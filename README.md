# Perfumetr catalog importer

GitHub Actions orchestration for the Perfumetr catalog. The repository contains
no affiliate network credentials and never requires manual product uploads.

## Sources

TradeDoubler sources are defined with non-secret metadata in
`config/tradedoubler-sources.json`.

| Source | Resolution |
| --- | --- |
| Cocolita | fixed verified Feed ID `112471` |
| Drogeria.pl | fixed verified Feed ID `118359` |
| Aelia.pl | feed configured from the official Program `397216` payload through the bridge |

The Aelia Feed ID is deliberately not guessed or committed. GitHub requests a
`program_feeds` ticket for Program `397216`, downloads the official payload and
submits it to the bridge action `configure_store_feed` for store `aelia`. Sites
validates the program, currency, eligibility and domain and returns the selected
Feed ID.

TradeDoubler vouchers, AWIN Flaconi and CJ Notino/Brasty are advanced by
`scripts/catalog-orchestrator.mjs`. The script calls the deployed internal
`/api/internal/catalog-orchestrator` endpoint and never receives affiliate
network credentials. Each source is isolated so one failure does not stop the
others.

## Modes

`proof` first downloads the existing bounded TradeDoubler query, applies the
perfume classifier and imports only accepted perfume records. If that query has
an invalid or empty successful response, contains no perfumes, or its import is
rejected specifically as `feed_not_configured`, the runner scans at most ten
strict 100-product `page` tickets. It stops at the first page with perfumes and
reports both the successful transport and the number of scanned records.

`full` verifies the complete provider snapshot, counts every raw record and
sends only perfume records to Perfumetr in resumable chunks. Raw counts remain
independent from accepted counts, including chunks with zero perfumes. The
primary transport remains Products Unlimited. Only its exact safe
`provider_snapshot_incomplete_missing_object_*_<expectedCount>` result enables
the page fallback. Every page must repeat the metadata count and contain the
exact expected number of records; the combined snapshot is SHA-256 hashed
before resumable import. HTTP 429 and unrelated failures never enable fallback.

The shared AWIN/CJ orchestrator performs a bounded number of server-side import
steps. Existing server-side cursors remain authoritative. A missing,
access-denied or not-yet-configured feed is reported as `blocked` and retried by
the next cycle without failing the workflow. Every other error remains fatal.

## Automation

`.github/workflows/tradedoubler.yml` retains its path because the current Sites
OIDC verifier trusts that exact workflow path. Its visible name is broader than
TradeDoubler because it now coordinates all catalog sources.

Partner sources run daily at 02:47, 08:47, 14:17 and 20:47 UTC. The complete
TradeDoubler import runs only at 14:17 UTC. Manual modes are:

* `proof`
* `full`
* `partners`
* `all`

Run locally:

```sh
npm test
```

The live importer requires GitHub Actions OIDC environment variables and must
not be run locally with copied credentials.

## Filtering

`scripts/perfume-classifier.mjs` accepts explicit perfume names or structured
perfume categories. It rejects sets, testers, samples, refills, body care,
deodorants, mists, candles, diffusers and similar non-perfume products.
Description-only mentions of perfumes are not sufficient for acceptance.

The complete TradeDoubler snapshot is still downloaded for completeness
checks, either through Products Unlimited or strictly validated 100-record
pages. Filtering reduces catalog traffic and writes, not provider download
size. A future streaming parser can also reduce peak memory.

## Security

GitHub Actions obtains a short-lived OIDC token. Perfumetr validates the
repository, branch, workflow and audience. Provider credentials stay encrypted
at rest on the Perfumetr side and are absent from repository files, fixtures
and logs. The TradeDoubler token is visible only transiently inside the trusted
runner's validated provider redirect; AWIN and CJ credentials never leave the
server-side importer.

The code logs only allowlisted error codes. It never logs OIDC tokens, bridge
tickets, provider redirect URLs or affiliate API tokens.

## Deployment and verification order

The required backward-compatible Sites contracts are deployed in version 112.
Publish GitHub changes through a pull request, require the validation job to
pass, then merge. The first push to `master` performs the bounded TradeDoubler
proof, the full TradeDoubler cycle and the shared partner cycle. Do not remove
the old Worker fallback until that live run has directly verified the GitHub
path for the configured sources.

Project handoff information lives in `PROJECT_STATE.md`. Stable operating rules
are in `AGENTS.md`; architecture and chat continuity are documented under
`docs/`.
