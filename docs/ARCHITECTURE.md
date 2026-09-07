# Perfumetr importer architecture

## Explicit search navigation and cancellation (Sites v234 / 2026-09-07)

- Landing and search remain mounted in one photographic document. A primitive
  searchSession revision makes generic re-entry an explicit reset even when the
  optional initialVariantId has not changed. Reset preserves loaded catalog and
  campaign data rather than remounting the entire comparison component.
- The visible back action resets the current search entry, query/result state,
  pending variant and overlay state. Generic URLs set view=search and remove
  variantId/hash; exact bottle links retain their variant. History state and
  attribution are preserved. popstate refreshes the navigation intent; pageshow
  alone keeps the current comparison and its existing price-resume behavior.
- One stable cancellation callback aborts all four search-related request kinds,
  invalidates sequence guards and cancels transition/scroll timers and frame.
  Unmount, reset and a replacement lookup share it; late results fail closed.
- Native 44px SVG/text back control is visible for all non-idle states and uses
  shared material/focus styling. Focus returns to the search wrapper without
  forcing a mobile keyboard. No API or persistence contract changed.
- 120 tests pass, including five deterministic component-state regressions.
  No browser/DOM/physical-device verification is claimed.

## Internal, live-eligible campaign examples (Sites v233 / 2026-09-07)

- Store-sale campaign metadata is separate from the resolved examples.
  getHomepageStoreSales uses the exact three Douglas source product IDs,
  primary reads and existing public catalog scope to resolve current variants.
  GTIN/volume/concentration, source/merchant eligibility, latest in-stock PLN
  offer and 18-hour freshness are required. No prices or variant IDs are guessed.
- Homepage optional reads remain parallel. A failed sale lookup returns no
  campaign examples and no-store. Beta schema=4 separates cached older payloads;
  additive examples retains singular example compatibility.
- Product anchors are same-origin exact-variant deep links. Ordinary clicks
  invoke PerfumeApp's existing abortable comparison loader in place; modified
  clicks preserve native anchor behavior. Only campaign terms remain external.
- Three compact text rows and their heading share the existing collapsed
  glass disclosure. No image changes, dependencies, importer revision,
  migration, schedule or eligibility-policy relaxation. Full tests: 115 passed.
- Generation 21 finalization failed independently during this work; see the
  precise nonterminal D1 state and failed Actions attempt in PROJECT_STATE.md.

## Douglas Paradoxe bottle alias (Sites v232 / 2026-09-07)

- Douglas classification normalizes the confirmed full line "Paradoxe
  Refillable" to "Paradoxe" only for Prada EDP/women/standard bottles with
  exact GTIN/volume pairs 3614273760713/30, 3614273760652/50 and
  3614273760164/90. The 100 ml refill and other lines remain distinct.
- Import revision 4 makes existing completed revision-3 snapshots refresh
  through the unchanged official AWIN adapter. No owner export is imported
  into production. All source, GTIN, semantic, stock, quarantine and
  18-hour public freshness gates remain.
- Post-persist logs are limited to the recognized bottle identities and
  query their actual source mapping/fresh-offer existence. Logging failure
  does not change import success; credentials and payloads are excluded.
- Two focused regressions cover exact normalization boundaries and persisted
  recovery with unchanged observed price/time. Full suite: 114 passing tests.
  Existing client graph and UI remain; no schema or endpoint contract change.

## Shared material compatibility and footer social links (Sites v231 / 2026-09-07)

- Glass tokens live on :root, not behind :has(); base tint rgba(64,89,105,.28)
  plus a subtle neutral highlight and blur(10px), without material brightness/
  saturation filters. Standard and WebKit properties share this definition.
  Header, inline feedback, cards, promotions, search and footer share it.
- No viewport-specific material overrides. Browser-support fallback uses a
  46% fill; reduced-transparency restores opaque surfaces and takes priority.
  Photographic crop still varies with viewport; no pixel-identical device
  output is promised or browser QA claimed.
- TikTokLink is a stateless local SVG/text anchor shared by both public
  footers; full handle @perfumetrpl and canonical owner-supplied profile URL,
  safe new-tab attributes, no TikTok embed/script/dependency.
- Contacts stay close and wrap; v230 normal-flow bottom footer, promotion
  section after feedback and centered desktop feedback remain.
- Production build/artifact and 112 tests passed; v230 bundles retained.
  No pricing, importer, schema or runtime contract changes.

## Minimal discovery copy and footer (Sites v229 / 2026-09-07)

- StoreCoverage is presentational, accepts only optional variant, and displays
  “Zweryfikowane drogerie. Ceny odświeżane codziennie.” without numeric counts.
  Landing/search still use actual verified/fresh store data for the logo rail.
  Numeric diagnostic counts remain in integrations; API contracts are unchanged.
- Search no longer renders a brand-count/placeholder row. Feedback is retained.
- Comparison footer uses a responsive grid and native closed details/summary
  for explanatory copy. Mobile keeps two compact rows, 44px contact/privacy/
  summary targets and an accessible Instagram icon. Shared matte-glass
  variables, focus and reduced-transparency/motion behavior are retained.
- Build/artifact validation and all 111 tests pass; public v228 assets retained.
  No importer or price behavior change. The individual Douglas offer issue
  remains paused and unresolved at the owner's instruction.

## Editorial campaign destinations and image captions (Sites v228 / 2026-09-07)

- HomepageStoreSale.example has optional url in addition to the retained
  variantId/label. Editorial campaign examples link explicitly to the official
  merchant product; older payloads without url fall back to termsUrl. They no
  longer imply the merchant has a fresh offer in internal comparison.
- BottleVisual renders no source-credit anchor. Source/license description is
  retained in the image title and catalog metadata; product alt text remains.
  Removed all obsolete bottle-credit CSS. No photo or pricing changes.
- Shared glass, collapsed campaign behavior and one-document comparison flow
  remain. Build/artifact validation and 111 tests pass; v227 assets retained.
- Individual Douglas Prada 90 ml feed absence remains unconfirmed/unrepaired.
  See PROJECT_STATE.md; do not equate completed snapshot counters with current
  fresh offers or merchant-page availability with a validated provider record.

## Compact campaign and glass system (Sites v227 / 2026-09-07)

- HomepagePromotion is collapsed by default with a native button, useId,
  aria-expanded/controls and an inert hidden details region. Grid track
  transitions animate height without retaining an opacity backdrop root.
- The campaign, main cards, footer and search share --frost-surface and
  --frost-backdrop: approximately 15% tint and 12px blur, WebKit included.
  Reduced-motion and reduced-transparency preferences remain supported.
- Campaign dates/eligibility, exact links and all API contracts are unchanged.
  SVG controls replace remaining promotion text arrows. Complete v226 public
  bundles are retained. Build/artifact and 110 tests pass.

## Borderless glass refinement (Sites v224 / 2026-09-07)

- `experience.css` and `glass-controls.css` retain the shared photographic
  scene with borderless smoked panels, stronger blur and no inset edge shine.
- Search uses a translucent 62px/58px rounded field with an inset text button,
  16px mobile input and explicit focus/loading/reduced-transparency states.
  Its idle parent has no backdrop filter, letting the input blur the scene.
- No component, endpoint, query, schema or importer contract change.
  v223 exact deal recovery remains; final build and 108 tests pass.
  Public v223 bundles are retained for already-open documents.

## Homepage read recovery (Sites v223 / 2026-09-07)

- Featured products render only from a complete priced FeaturedDeal, including
  the exact comparison variant ID. No unpriced decorative bottle fallback.
- Candidate discovery uses a bounded reviewed-GTIN lookup with EXISTS instead
  of counting all merchant offers. Prices use the unchanged comparison pipeline
  and first-primary reads. Public freshness remains 18h.
- Main featured deadline: 6s; other homepage data: 2.5s. Client request: 8s,
  with one automatic transient retry and cancellation on unmount.
- Optional `featuredStatus` is complete/unavailable; failed responses are
  no-store. Existing payload fields remain. New main client uses schema=4
  and no-store; successful server responses retain 30s/60s caching.
- v222 public assets join the retained compatibility graph. No schema,
  importer or scheduler change. Final build and 108 automated tests pass.

## Public experience integration (Sites v221-v222 / 2026-09-05)

- Main and beta render the same `PerfumetrExperience` client wrapper; main starts
  on the landing, beta on search, with explicit search/variant deep links.
  CTA/history switch panels in one document and retain bounded marketing UTM
  fields. Main-domain catalog/search/compare/feedback/out routes use the existing
  guarded data pipeline rather than returning a hostname-based 404.
- `experience.css`, `glass-controls.css` and `scene-motion.ts` own the shared
  photographic scene, matte controls, mobile offer rows and bounded parallax.
  Reduced motion is honored. Entrance animations must not retain an opacity
  backdrop root after completion: backwards fill permits actual backdrop blur.
- Public v220/v221 assets are retained exactly for already-open documents,
  with a SHA-256/dependency manifest test. Root responses use private/no-store.
  This is frontend rollout compatibility, not a change to offer cache freshness.
- v222 source `34dcdb094988a36cb8a0c5e2380d524bd97727ca`; final build and 106
  tests pass. No production schema/importer/schedule changes. Visual evidence
  uses local synthetic fixtures, never production price certification.

## Current runtime additions (Sites v218-v219 / 2026-09-05)

These values supersede older freshness checkpoints below.

- Public offers expire from comparison after **18h**. CJ maintenance targets
  records older than **9h**, using bounded 50-product batches and 48-step
  runner cycles. A completed provider generation can still have a pending
  freshness queue; report both, never infer fresh completion from the state.
- PR #56 adds CJ-only slots 05:47, 11:47, 17:47, 23:47 UTC to the existing
  shared 02:47, 08:47, 14:17, 20:47 UTC cycles. Full TD remains
  02:47/14:17 and Douglas 05:23/17:23. cancel-in-progress remains false.
- Comparison reads use D1 `withSession("first-primary")` and no-store
  responses/fetches. Homepage caching is 30s browser / 60s shared, or
  10s / 30s for a fallback. No long stale-while-revalidate price window.
- Visible comparisons refresh at five-minute intervals and on focus/pageshow/
  visibility after 60s. Refresh timeout is eight seconds. After ten minutes
  without a successful refresh the client clears stale offer prices.
- Coupon-shaped exact 5/10/15/20 percent Notino feed reductions are not treated
  as unconditional price evidence without verified coupon eligibility.
  Delivery uncertainty stays explicit; unknown delivery is never invented as
  zero.
- Canonical repairs are scoped to known variant/GTIN evidence. Eros EDP/EDT,
  Good Girl Blush/Elixir, Le Male brand identity, Sauvage refillable labeling,
  La Vie Est Belle aliases and a known BOSS Bottled EDT/Parfum row retain
  strict identity guards. These repairs are not a general fuzzy matcher.
- v219 public layout is in app/editorial.css, imported after globals.css by
  app/layout.tsx. It changes presentation only, leaves owner navigation
  text-based and does not modify importer/GTIN/classifier rules.
- The 26-entry cutout manifest is matched by exact GTIN. Static v216 behavior
  is retained; v215 2.5D was explicitly rejected. A fallback never supplies a
  fabricated price.

### Retained v208-v213 snapshot safeguards

Nonempty feeds cannot replace an existing valid snapshot with zero accepted
offers. Old public rows stay active until new-snapshot validation and atomic
completion. Exact first-party tracking hosts are allowlisted; unknown hosts
remain rejected. Abandoned-session replacement requires a recorded failure,
changed provider snapshot/remoteVersion and absence of an active claim.
Cleanup uses lease/CAS/session checks and touches only old staging, not active
offers. Repeated full Aelia GTIN conflict scans were removed. Ordinary Flaconi
status reads use bounded counters and a lightweight safety certificate; full
audits remain before mutation/finalization. Coverage must distinguish complete
and unavailable reads and must not add differently timed partial source reads
into a false global total.

## Atomic TradeDoubler full snapshots (Sites v195)

Sites v195 and GitHub worker `de1f14f` make Products Unlimited a staged,
complete-snapshot protocol. The public catalog no longer changes while an
Unlimited generation is still transferring.

### Snapshot sequence

1. The worker downloads and validates the complete official provider snapshot.
2. Before the first bridge write, it rejects any duplicate offer identity
   across the whole snapshot. Identity uses `offer.id` when present; otherwise
   it uses `tradedoubler:<feedId-or-unknown>:<sourceProductId>`, matching Sites.
3. The worker derives selector `all-products-v2:perfume-v1`, computes the
   snapshot hash and begins an OIDC-authenticated Unlimited session.
4. Every bounded chunk carries:
   - the complete raw slice in `payload.rawProducts`;
   - the exact ordered `perfume-v1` result for that slice in
     `payload.products`;
   - `classifierVersion: "perfume-v1"`;
   - raw count, cursor, session and snapshot identity.
5. Sites validates every raw record, required field and within-chunk identity,
   recomputes `perfume-v1` from `rawProducts`, then rejects any omitted, added,
   mutated or reordered accepted row.
6. Valid chunks write only session-scoped staging rows. Staging is excluded
   from public listings, offers, store rails and global catalog counters.
7. Completion rechecks selector, hash, cursor, raw count, accepted count and
   session ownership. One D1 transaction applies the complete candidate
   snapshot, records the completion receipt and marks the feed completed.
8. Failure or interruption leaves the prior canonical/public snapshot intact.
   A later run starts or resumes only a contract-compatible session.

Unlimited begin, chunk, complete and fail operations, plus issuance of the
`unlimited_full` browser ticket, are OIDC-only. They retain audience
`perfumetr-tradedoubler-bridge` and the exact repository, branch and workflow
identity checks. This restriction is specific to the Unlimited full-import
contract and does not describe other browser-ticket modes.

Selector version is durable in the active session, completed feed metadata and
completion receipt. A missing or older selector forces a replay even if the
provider timestamp is unchanged. A pre-v195 session cannot download, resume or
complete under the v195 contract. Completion remains idempotent only for the
current selector and the same verified receipt.

The dual classifier is intentional. The worker filters before transfer for a
separate accepted count; Sites recomputes the same function from every raw row
and is authoritative. A category-only perfume can therefore pass when its
structured category is explicit. A perfume mention found only in description
is still insufficient. Explicit exclusions for testers, samples, refills,
sets, deodorants, body care, mists and home fragrance still win.

Validated v195 rows bypass only the legacy narrower downstream perfume-name
predicate. All hidden-catalog, semantic identity, duplicate, source and exact
GTIN gates remain active. GTIN quarantine is symmetric: a new row conflicts
with an existing visible identity even when the witness row has a null GTIN,
and the conflict cannot be published by choosing an arbitrary side.

The old local full-import helper is not a compatibility path for v195. GitHub
remains the scheduler and worker; Sites and D1 remain the source of truth. A
production proof is a completed scheduled full generation, not a successful
pull-request test or a partially transferred session.

### CJ feed-discovery boundary

CJ uses a separate bounded server-side importer and is not covered by the
TradeDoubler atomic snapshot protocol. Current CJ discovery selects the largest
eligible feed from at most the first 20 Product Feeds returned for a programme.
That proves safe processing of the selected feed, not enumeration of every
possible Notino or Brasty feed topology.

Before claiming complete CJ programme coverage, compare the persisted feed
selection with an official Product Feeds inventory containing feed ID, name,
country, language, currency, product count and update time. Do not copy a CJ
token, authenticated download URL or private raw feed into GitHub or project
documentation. A topology change must remain bounded, source-isolated and must
not weaken product identity or `perfume-v1`.

## Audited identity and freshness safety (Sites v185-v194)

Catalog identity is shared by CJ, Douglas, Flaconi and TradeDoubler. It uses an
explicit dictionary of 19 audited brand groups and stores the normalized brand
used by public counters. Family repair is limited to 28 audited family keys and
two explicit Stronger With You aliases. It is not fuzzy: a concentration,
audience, product-type or volume slot conflict cannot be auto-merged. Public
rows must be standard, active and nonhidden; 71 confirmed nonstandard variants
are quarantined instead of being counted or exposed.

The Xerjoff line rule is intentionally narrow and independent of GTIN. Only the
exact brand and line pair Xerjoff + `XJ 1861 Naxos` canonicalizes to `Naxos`;
other `XJ 1861` names remain unchanged. Separately, targeted reprocessing of
earlier conflict rows is restricted to GTIN `8033488155070` and its leading-
zero form `08033488155070`. The regression proves these code contracts; it is
not proof that every possible Naxos offer exists in current D1.

One global freshness contract caps publication at 30 hours for every source
across catalog pages, comparison results, the store rail, public counters,
coupons and outbound redirects. CJ rolling refresh targets 20 hours so a
normal cycle can refresh an offer before it disappears. An older offer is
deliberately hidden, never treated as current merely to keep a store or price
visible.

CJ lifecycle maintenance remains bounded and confirmation-safe:

- at most 50 known product IDs are refreshed in one maintenance batch;
- a transient omission becomes retryable, with confirmation no sooner than the
  15-minute cooldown; a changed GTIN returns to review instead of replacing an
  identity;
- an unavailable tombstone is rechecked after six hours and only an exact
  confirmed restock may reactivate the offer;
- one coverage step examines at most three verified standard-GTIN variants,
  each requiring a fresh offer witness from another verified store;
- the first provider total is the cursor baseline. Drift is limited to 2%,
  capped at 250 rows, and a drifted query may complete only at a guarded EOF.
  Repeated cursors, empty non-EOF pages and overruns fail closed; result scopes
  above 10,000 are `scope_skipped`.

Flaconi completed-generation review-backlog reprocessing handles at most 40
rows per step. Its separate safety phase has its own 400-row bound; 40 is not
a limit for the entire maintenance path.
Douglas EOF first persists a durable paused checkpoint. Idempotent cleanup and
safety phases heartbeat the lease and may resume; only their successful end
can mark the generation completed. Source-counter reconciliation is atomic.
Stale, duplicate or reused Douglas external product IDs fail closed, while an
exact confirmed restock can safely reactivate an invalidated row. The duplicate
gate applies once a conflict is observed. If two contradictory copies are on
different feed pages, the first can be briefly public before the second copy is
read. Once the conflict is observed, the shared external ID moves to review and
the earlier offer is invalidated. This source-ID gate is not a global semantic-
duplicate audit across different product IDs.

These mechanisms prefer temporary non-publication over an ambiguous family,
identity or stale price. They do not complete the outstanding global semantic-
duplicate audit, and they do not prove that the single largest CJ feed selected
from at most 20 returned feeds represents the complete programme topology.

## First-party marketing analytics (Sites v183)

Marketing attribution is implemented inside Sites and D1. It is deliberately
separate from the GitHub feed worker and from catalog classification.

### Request and event flow

1. A request carrying one or more of the five supported UTM fields reaches a
   public Perfumetr host.
2. The server sanitizes and preserves
   `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` and
   `utm_term` on internal cross-host navigation.
3. Before consent, the values may remain in the URL but no analytics session or
   event is written.
4. After explicit analytics consent, `POST /api/marketing/session` creates or
   resumes a random first-touch session and records `entry`.
5. `POST /api/marketing/event` accepts the bounded client events
   `search_used` and `product_view`.
6. `GET /out/[offerId]` resolves the current offer and allowlisted affiliate
   target exactly as before. It schedules a server-authoritative
   `offer_click` snapshot with `after()` or the Cloudflare execution context,
   then returns the same redirect. Logging is fail-open and does not delay or
   replace the shopping redirect.
7. `https://perfumetr.pl/panel-opinii/marketing` queries aggregate data through
   the existing owner gate. No raw-event API or public analytics endpoint is
   exposed. The apex route was enabled in Sites v183; unauthenticated requests
   stop at the gate before any aggregate query.

The client is not trusted to supply offer economics. For `offer_click`, the
server snapshots the variant identifier, brand, product name, volume,
concentration, store, offer identifier, product price, known delivery price,
known total price, first-touch attribution, landing page and event date from
current catalog state. Unknown costs remain null.

### Consent and data boundaries

No GA4, Meta Pixel or TikTok Pixel is loaded because no configured identifier
exists. Future third-party measurement must remain behind the same explicit
analytics consent and must not be enabled with a guessed identifier.

The analytics cookie records only consent. The production session cookie is
random, `HttpOnly`, `Secure`, `SameSite=Strict` and scoped to
`perfumetr.pl`, allowing the entry and comparison hosts to retain one
attribution session. The application stores no email and no full IP. Network
rate keys are HMAC-derived.

Exact origin validation, bounded lengths, rate limits, a 500-event session cap,
short per-event deduplication and bounded 90-day cleanup constrain spam and
accidental repeats. The local preview origin is a disjoint, exact development
exception and cannot widen the accepted public-host origin set.

### D1 schema

Migration `drizzle/0021_spicy_blue_blade.sql` creates:

- `marketing_session_limits`: bounded anonymous session-creation limits;
- `marketing_sessions`: first-touch attribution, landing page, timestamps and
  reservation counters;
- `marketing_events`: the four funnel events and bounded product/offer
  snapshots.

The marketing panel reports entries, distinct search users, distinct product
viewers and offer clicks by date, platform and campaign, plus step conversion,
top products and top stores. A click is the primary conversion. Commission or
sale attribution is not claimed until a partner exposes a safe, reliable join
key.

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
12. Count every raw provider product and reject duplicate offer identities
    across the full snapshot before the first write.
13. Build bounded chunks containing the complete raw slice and its exact
    ordered `perfume-v1` subset.
14. Let Sites revalidate each raw record and independently recompute the exact
    subset before writing only session-scoped staging rows.
15. Publish the staged snapshot atomically only after cursor, hash, raw count,
    accepted count, classifier and selector checks all pass.

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
* `awin:douglas`
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

Safety maintenance is fail closed and may require more than one bounded cycle.
A preflight failure for an already completed generation preserves `completed`
and its checkpoint. A stale recovered `running` row is normalized to `paused`
after failure so it cannot retain a false active state after its lease is
released. A failed Flaconi row with `import_failed` is also normalized to
`paused` after a bounded maintenance pass makes verified progress; the error is
retained until the importer actually resumes, and every following step still
passes the fail-closed audit before any feed fetch. A stale safety error is
cleared and the programme is restored to `ready` only after a later verified
recovery.

Exactly `orchestrator_feed_not_found`, `orchestrator_feed_access_denied` and
`orchestrator_not_configured` are expected provider-activation blockers. They
produce `ok: true` with `blocked: true`, so a later scheduled cycle retries them
without making the entire workflow red. Every other exception and every
unexplained `failed` state remains fatal.

The workflow configures at most 48 steps per source. Every source has an
independent try/catch boundary. Partners run at 02:47, 08:47, 14:17 and 20:47
UTC. The full TradeDoubler snapshot runs only at 14:17 UTC.

## Flaconi identity safety gate

Migration `0020` adds durable Flaconi identity evidence and conflict tables,
plus a normalized brand and product-name index used by bounded checks. The
orchestrator must not fetch another AWIN feed page until the safety marker is
current and the persisted audit returns `passed: true`. Bootstrap, quarantine
and final verification are intentionally bounded; an interrupted or
lease-limited pass remains closed and resumes during a later cycle.
Before the marker exists, ordinary status reads return a lightweight fail-closed
audit instead of running the full catalog scan. The full audit still runs before
the marker can be written. Exact-GTIN checks enumerate only valid 8, 12, 13 and
14 digit zero-padded candidates so SQLite can use the unique GTIN index without
changing the accepted leading-zero equivalence.

AWIN CSV pages are capped at 1,000 rows so one mapped page remains bounded for
D1 even when product rows contain longer merchant URLs and identity evidence.
The cursor and rolling prefix fingerprint are persisted together, so a later
cycle resumes from the last committed row rather than restarting the feed.

Sites v180 also makes EOF finalization resumable. Reaching the end of the feed
first persists the final page, cursor and fingerprint without attempting every
generation cleanup in the same request. Three cleanup queries then run as
separate idempotent phases. Each phase heartbeats the existing lease while the
source remains at the durable paused EOF checkpoint, so an interruption or
execution limit safely replays cleanup without replaying the final page or
leaving an apparent active lock. Only after all three cleanup phases succeed
does one transaction atomically mark the generation `completed`, clear its
error and restore the programme registry to `ready`. Repeating any completed
phase is safe, and an incomplete phase never exposes a false completed state.

GTIN comparison is canonical and treats leading-zero representations as the
same identifier. Exact-GTIN evidence may resolve a verified naming suffix, but
different-GTIN products still require strict agreement of canonical family,
concentration, audience, type and volume. Only explicitly tested brand aliases
are accepted. A reused external product ID whose identity changes remains in
review and cannot overwrite its durable evidence. Contradictory occurrences of
the same external product ID in one feed page are terminal
`duplicate_source_product` cases rather than arbitrary winners.

An active source row that later becomes parser-rejected is invalidated
immediately. Persisted hidden, ambiguous or identity-conflicting rows are
quarantined, and orphan Flaconi listings are removed from public visibility.
These controls do not weaken `perfume-v1`, the GTIN gates or the shared hidden
catalog rules.

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

Sites changes that define or enforce a new contract land first and remain
backward compatible. GitHub changes that rely on that contract land second.
Removing an old endpoint, audience or workflow path is always a later,
separately verified deployment.

Before v195 enforcement, future-contract fields in the GitHub worker were
inert, optional metadata that Sites v194 ignored while it continued accepting
the established payload. The same worker revision also added independent local
duplicate-offer detection and bounded chunk validation, but did not rely on or
activate a new Sites contract. Sites v195 was the first side to enforce exact
dual classification, staging and atomic publication, and the already
compatible worker supplied the required fields. The preparatory merge did not
start a production import.
