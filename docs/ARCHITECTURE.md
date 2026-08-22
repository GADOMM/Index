# Perfumetr importer architecture

## Trust boundary

GitHub is the scheduler and bounded compute worker. Perfumetr Sites is the
source of truth for configured networks, encrypted credentials, source state,
snapshot cursors, catalog matching and public visibility.

GitHub obtains a short-lived OIDC token with audience
`perfumetr-tradedoubler-bridge`. Sites must verify the token signature and exact
repository, ref and workflow identity before any internal action.

No network credential is stored in GitHub Secrets or repository files. The
current TradeDoubler flow necessarily places its provider token transiently in
the trusted runner's validated redirect URL, but the token is never persisted
or logged. AWIN and CJ credentials remain entirely server-side.

## TradeDoubler flow

1. Load non-secret source policy from `config/tradedoubler-sources.json`.
2. For Aelia, issue a browser ticket with Feed ID field `397216` and mode
   `program_feeds`.
3. Redeem the ticket and download the official TradeDoubler program payload.
4. Submit that payload to `configure_store_feed` with store `aelia`.
5. Use only the numeric Feed ID returned by Sites. Sites remains responsible
   for program, PLN, eligibility and domain validation.
6. Request a one-use browser ticket for feed metadata or provider data.
7. Validate the provider redirect host and token shape without logging it.
8. For a proof, try the existing bounded query first. Only an invalid or empty
   successful response, no perfume result, or `bridge_feed_not_configured`
   permits scanning up to ten exact `page` tickets.
9. For a full import, compare exact feed metadata before and after download.
10. Use Products Unlimited as the primary full transport. Only the exact safe
    `provider_snapshot_incomplete_missing_object_*_<expectedCount>` shape may
    switch to page transport. HTTP 429 and unrelated errors remain fatal.
11. On page transport, require the same metadata `totalHits` on every page,
    exactly 100 records except the final remainder, the exact combined count
    and no more than 10,000 pages. Hash the combined JSON snapshot with SHA-256.
12. Count every raw provider product.
13. Apply `perfume-v1` before sending a chunk to the catalog.
14. Send raw count and filtered payload separately.
15. Complete the snapshot only after cursor, hash, count and version checks.

Aelia program ticket request:

```json
{"action":"issue_browser_ticket","feedId":"397216","mode":"program_feeds"}
```

After the ticket is redeemed and its provider payload downloaded, configure the
store through the bridge:

```json
{
  "action": "configure_store_feed",
  "store": "aelia",
  "payload": {"providerPayload": "official TradeDoubler response"}
}
```

The safe response contains `ok` and a numeric `feedId`. It must not contain a
Product Feeds token or a provider download URL.

Each resolved feed is isolated. Failure is recorded as a safe result and the
next feed still runs. The process exits with failure after all sources have had
their chance, so GitHub remains visibly red without sacrificing other stores.

## Shared partner flow

The GitHub script never downloads AWIN or CJ feeds directly in the first
migration stage. It also advances the already supported TradeDoubler voucher
source through the same control plane. It calls
`/api/internal/catalog-orchestrator` with one of these exact source IDs:

* `tradedoubler:vouchers`
* `awin:flaconi`
* `cj:notino`
* `cj:brasty`

Allowed actions are:

```json
{"action":"status","source":"awin:flaconi"}
```

```json
{"action":"advance_source","source":"awin:flaconi"}
```

The server invokes the existing encrypted, resumable importer for that source.
The deployed response places state inside `overview`:

```json
{
  "ok": true,
  "overview": {"state": "running"},
  "busy": false
}
```

Allowed states are `not_started`, `paused`, `running`, `completed` and `failed`.
`busy` is an optional boolean. `skipped` is absent or exactly the string
`fresh`. The orchestrator always calls `advance_source` at least once after a
normal status response, including an initial `completed` or `failed` state. The
server can then return `skipped: "fresh"` or restart an old generation. An
advance response with `failed`, `skipped: "fresh"` or `busy: true` stops that
source. A completed CJ source must also return `automaticReviewCount`,
`pendingFreshOfferCount` and `maintenanceProcessedCount`. The orchestrator
continues bounded maintenance after a generation first reaches `completed`, and
while an already completed source still has automatic work and the preceding
maintenance step processed at least one row. A completed maintenance step with
remaining work but zero progress stops safely, for example during a retry
cooldown. Manual and terminal review rows do not control this loop. Safe
allowlisted numeric counters from `overview` are copied to the GitHub report,
including `receivedCount`, `reviewCount`, `excludedCount`, `importedCount`,
`liveOffers`, `storedProducts`, `activeCoupons`, `automaticReviewCount`,
`pendingFreshOfferCount` and `maintenanceProcessedCount` when present.

Exactly `orchestrator_feed_not_found`, `orchestrator_feed_access_denied` and
`orchestrator_not_configured` are expected provider-activation blockers. They
produce `ok: true` with `blocked: true`, so a later scheduled cycle retries them
without making the entire workflow red. Every other exception and every
unexplained `failed` state remains fatal.

The workflow configures at most 48 steps per source. Every source has an
independent try/catch boundary. Partners run at 02:47, 08:47, 14:17 and 20:47
UTC. The full TradeDoubler snapshot runs only at 14:17 UTC.

## Classifier contract

`perfume-v1` accepts only an explicit perfume signal in the product name or a
structured category. Descriptions are not positive evidence because cosmetic
descriptions frequently mention a related perfume.

Explicit exclusion signals win over positive signals. This prevents gift sets,
testers, samples, refills, deodorants, body care, mists and home fragrances from
entering the comparison catalog.

The snapshot still records the raw provider count. The accepted perfume count
is a second independent number. A zero-product filtered chunk is valid if its
raw count is nonzero and the server advances the raw cursor accordingly.

## Panel status

The integrations panel should read one persisted status model rather than call
legacy provider Product APIs during page interaction. Each source needs:

1. configuration state;
2. last successful run;
3. next scheduled run;
4. raw and perfume counts;
5. live offers;
6. safe current error;
7. whether public visibility checks pass.

The manual button should mean only “refresh now”. A green network credential
test does not prove that its product feed is active or visible.

## Migration rule

Sites changes land first and remain backward compatible. GitHub changes land
second. Removing an old endpoint, audience or workflow path is always a later,
separately verified deployment.
