# Perfumetr project state

Updated: 2026-08-31 00:16 UTC after the Sites v195 post-deployment verifier

This file contains no credentials. Verify every external status again before a
new change, import, deployment or report.

## TradeDoubler snapshot-safety checkpoint (Sites v195)

Sites v195 is deployed and its point-in-time production state was rechecked
without starting an import.

### Deployment and compatible GitHub worker

- Sites version: `195`.
- Sites source commit:
  `7430f7b5c2b9770ad5fae7c97f8ac0375ce3e89a`.
- Sites version ID:
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_0581a7ae25848191bb7b847085f737f1`.
- Sites deployment: `appgdep_6a94c5dc21308191812d9bf6d472fe08`,
  publish `succeeded` with null failure message.
- GitHub `master` after the compatible worker rollout:
  `de1f14fb224e38a669258bac42d81d5c5ecb1cc6`.
- Pull request #44, `Make full TradeDoubler snapshots atomic and exact`, is
  merged. Its pull-request validation is run #128, ID `33343249979`, and
  succeeded. That run validated the importer with 27/27 tests and skipped the
  production job; it is not evidence of a production import.
- The additive GitHub worker landed first while the previous Sites consumer
  could safely ignore the additional validated fields. Sites v195 then enabled
  the strict staged contract. The merge used the supported CI-skip marker, so
  it did not launch an unrelated product import.

### v195 full-snapshot contract

- Every TradeDoubler Unlimited chunk carries the complete bounded raw product
  slice in `rawProducts`, the exact ordered `perfume-v1` subset in `products`
  and classifier version `perfume-v1`.
- The worker rejects a duplicate offer identity anywhere in the complete
  provider snapshot before sending the first chunk. Sites independently
  validates each complete raw chunk and recomputes the exact classifier subset,
  rejecting omissions, additions, mutations and reordered accepted rows.
- Chunks only stage snapshot candidates. Public listings, canonical offers and
  public counters do not change until one final D1 transaction verifies the
  session hash, cursor, counts and selector, applies the complete snapshot and
  marks the feed completed.
- An interrupted or failed session therefore cannot expose a partial new
  generation. Staging rows are excluded from public and global catalog counts.
- Unlimited begin, chunk, complete, fail and browser-ticket actions are
  OIDC-only and retain audience `perfumetr-tradedoubler-bridge`.
- Selector `all-products-v2:perfume-v1` is persisted in the active session,
  completed feed metadata and completion receipt. A missing or older selector
  forces a full replay even when the provider timestamp did not change; an old
  session cannot resume or complete through the v195 contract.
- Exact validated classifier rows bypass only the older, narrower downstream
  perfume-name predicate. Hidden-catalog, exclusion, identity, duplicate and
  GTIN gates still run. Category-only perfume evidence is accepted, while
  description-only references, testers, samples, refills, sets, deodorants,
  body care, mists and home fragrance remain excluded.
- GTIN conflict quarantine is symmetric, including conflicts witnessed by
  rows whose own GTIN is null. No classifier, identity or publication gate was
  weakened.

Verification before deployment:

- Sites build and artifact validation: passed.
- Full Sites suite: 80/80 passed.
- GitHub worker suite: 27/27 passed.
- Lint: zero errors and three pre-existing warnings.
- `git diff --check`: passed for both repositories.
- Two independent final reviews returned GO for the exact reviewed code.

No production workflow was manually started to test v195. The next scheduled
full TradeDoubler cycle is the first production exercise of this contract and
must be observed without manually retrying provider HTTP 429 responses.

### Latest automation and post-deployment D1 truth

- The latest scheduled production cycle is run #127, ID `33340455040`, from
  2026-08-30 22:56 UTC. Importer validation succeeded and the full
  TradeDoubler job was correctly skipped, but the bounded partner orchestrator
  ended the workflow in failure: Flaconi and Notino returned
  `orchestrator_import_failed`; Brasty completed. This is not a global catalog
  outage and no manual retry was launched.
- Run #126, ID `33338337893`, is the newest full TradeDoubler attempt. It
  failed after Douglas persisted a safe checkpoint near 39,000 scanned rows;
  the prior public snapshot remained available. Do not describe run #126 as a
  completed full refresh.
- `sync_locks` was empty and the full `catalog_meta` scan contained no active
  or abandoned Unlimited session key. No import or live lease was running.

Latest directly read source checkpoints after deployment:

| Source | Post-deployment D1 state |
| --- | --- |
| Douglas | generation 6 `failed` at the safe 39,000-row checkpoint; 2,407 accepted, 2,322 review, 34,271 rejected; error `import_failed`; no active lock |
| Flaconi | generation 15 `completed`; 35,010 received, 3,754 accepted, 1,332 review, 29,924 rejected; source error null |
| Notino | generation 22 `paused`, no source error; 19,269 received, 11,380 accepted, 2,947 review, 4,942 rejected; current bounded query 9,500 of 9,681; product status `syncing` |
| Brasty | generation 17 `completed`; 13,161 received, 11,320 accepted and 300 rejected. D1 later showed 1,541 review while run #127 overview showed 658; keep the discrepancy explicit until a later consistent read |

Three consecutive post-deployment SSR reads were identical:

| Store | Fresh public offers |
| --- | ---: |
| Notino | 8,686 |
| Brasty | 5,370 |
| Flaconi | 3,754 |
| Cocolita | 896 |
| Drogeria.pl | 862 |
| Aelia.pl | 1,471 |
| Douglas | 2,966 |
| **Total** | **24,005** |

These are public fresh-offer counters, not accepted-generation counters.
The same SSR reported 11,122 catalog entries, all 11,122 with an image, across
628 brands. Flaconi returned to the public rail with 3,754 fresh offers after
the earlier pre-deployment read showed it absent. No import was started to
produce this verification, and expired DUO pricing was not retained or
invented.

Five of five direct apex requests returned HTTP 200, but average response time
was poor at 11.69 seconds. Four production assets were byte-identical with the
v195 build, and Sites reported zero worker error events in the first 15 minutes
after publication. These checks verify the deployed code path but do not make
the apex fast; do not describe it as fully stable. The separate `www` host
remains an unresolved historical domain risk and must be rechecked before any
newer claim.

### Remaining CJ coverage limitation

Current CJ discovery selects one largest eligible feed from at most the first
20 returned Product Feeds. It does not yet prove that every Notino or Brasty
country/language/currency feed has been enumerated. Therefore neither the
Naxos investigation nor the successful per-feed refresh may be generalized to
complete CJ programme coverage without a real Product Feeds inventory.

The safe next evidence is a CJ Product Feeds list or export containing only
feed ID, feed name, country, language, currency, product count and last update
time. Do not request or store the CJ token, a credential-bearing download URL
or a raw private feed in this repository. Compare that inventory with the
persisted selected feed before changing discovery or publication behavior.

The user explicitly requested consolidated report #011 after all work is
finished. At this documentation draft stage, report #010 remains the last
confirmed delivered report and #011 must remain `pending` until mailbox
delivery is verified.

## Earlier marketing analytics production checkpoint (Sites v183)

Verified through approximately 2026-08-29 12:49 UTC. This section supersedes the
older analytics assumptions below; importer and partner-history sections remain
historical unless explicitly refreshed here.

### Deployed scope

- Sites version: `183`.
- Sites source commit:
  `985bd96d53ed7c6f274d0188cd92a3b1cd5ac3f9`.
- Sites deployment:
  `appgdep_6a92d4f7b0008191be0dab134b60d104`, `succeeded`.
- The active deployment adds first-party, consent-gated, anonymous marketing
  analytics without changing catalog matching, feeds, affiliate URLs or the
  public visual design.
- The funnel events are `entry`, `search_used`, `product_view` and
  `offer_click`. `offer_click` is the primary business conversion.
- The five accepted attribution fields are `utm_source`, `utm_medium`,
  `utm_campaign`, `utm_content` and `utm_term`. First-touch attribution and
  the landing page are retained for the session across the public entry and
  comparison hosts.
- No GA4, Meta Pixel or TikTok Pixel identifier was present. None was invented
  or loaded. No analytics write occurs before explicit analytics consent.
- The application does not claim sale or commission attribution. Current
  affiliate reporting cannot reliably join a later transaction to a marketing
  session, so an outbound store-offer click is the authoritative funnel
  conversion.
- The protected aggregate view is `/panel-opinii/marketing` behind the existing
  owner access gate. It exposes daily/platform/campaign funnels, transition
  percentages, most-clicked products and most-clicked stores; it does not expose
  raw event rows publicly.
- Sites v183 makes that same protected panel available at
  `https://perfumetr.pl/panel-opinii/marketing`. An unauthenticated production
  request returns the owner-code gate with HTTP 200, `private, no-store`, CSP and
  frame denial, and does not render the QA campaign data.

### Storage, privacy and safety

- Migration `drizzle/0021_spicy_blue_blade.sql` adds
  `marketing_session_limits`, `marketing_sessions` and
  `marketing_events`.
- Events contain a random session identifier, bounded attribution and
  catalog/offer snapshots. They do not contain email addresses or a full IP.
  Abuse-rate keys are HMAC-derived rather than stored as raw network data.
- Production session cookies are `Secure`, scoped to `perfumetr.pl` and
  shared only by its hosts. Origin checks, bounded field lengths, hourly and
  per-session rate limits, short deduplication windows and a bounded 90-day
  cleanup reduce abuse and accidental double counting.
- The existing `/out/[offerId]` redirect remains the affiliate boundary. Its
  target is resolved and allowlisted exactly as before. The analytics snapshot
  is derived server-side from the current offer and is scheduled after the
  redirect response; analytics failure remains fail-open for the shopper.
- Unknown delivery or total prices remain `null`; they are never represented as
  zero.

### Verification

- `npm test`: 71/71 passed.
- Production build and artifact validation: passed.
- `git diff --check`: passed.
- Lint: zero errors and three pre-existing warnings.
- Independent security review after the preview-origin hardening: GO.
- Isolated desktop preview test with a fixture produced exactly one event for
  every funnel step and retained complete Instagram attribution.
- Production desktop test used
  `utm_source=instagram&utm_medium=paid_social&utm_campaign=qa_production_20260829&utm_content=reel_prod_01&utm_term=prospecting_broad`.
  It recorded one session and exactly these four event rows:
  `entry`, `search_used`, `product_view` and `offer_click`.
- The production product snapshot was Yves Saint Laurent MYSLF Eau de Parfum,
  60 ml. The click snapshot selected Aelia.pl, stored the live offer identifier,
  product price `38000` grosz, unknown shipping and total as `null`, and
  retained the five UTM values and landing page.
- The outbound browser reached `visit.aelia.pl`; no UTM parameter leaked to the
  merchant target.
- A separate phone-sized production browser run is still outstanding. The
  available production browser had a fixed desktop viewport. Responsive code
  and event handlers are shared, but do not report a real-device mobile test as
  passed until it is repeated on a phone.

### Current production and automation truth

- Public SSR after deployment: 25,721 fresh offers, 11,499 catalog entries with
  images, 717 brands and seven stores.
- Latest scheduled GitHub Actions run is #110
  (`33245372229`), failed: Flaconi `orchestrator_feed_changed`, Notino
  `orchestrator_pagination_incomplete`, Brasty safely `paused`.
- Latest successful production partner cycle and latest full TradeDoubler run
  is #108 (`33220791325`). Latest PR validation remains #102
  (`33103154115`), successful with 21/21 importer tests and its production job
  skipped.
- Production D1 `sync_locks` was empty before this deployment. The analytics
  migration is live. No importer or feed workflow was manually started for this
  change.
- `perfumetr.pl` is active and the complete production funnel worked through
  it. The `www` host remains pending with pending SSL validation and returns
  HTTP 502. Do not describe the `www` host as repaired.
- The single production QA session above is deliberately retained as auditable
  test evidence and must be excluded from campaign decisions by its
  `qa_production_20260829` campaign name.
- No report #011 and no partner email was sent for this deployment.

## Earlier Sites v180 production checkpoint

Verified through approximately 2026-08-27 18:15 UTC for the completed catalog
recovery, Sites v180 and direct production verification. No credential, private
mailbox content or provider payload is recorded here.

Repository and automation:

* repository: `GADOMM/Index`;
* verified `master`: `c5f52143dcf9050e35350be31e6e51a7b5ac431d`;
* full TradeDoubler run `#93` completed successfully. Its verified live counts
  are Cocolita `886`, Drogeria.pl `855` and Aelia.pl `1,461`;
* isolated Flaconi run `#6`, ID `33102239793`, completed successfully;
* the final Notino run `#101`, ID `33102412389`, completed successfully;
* GitHub Actions remains the only automatic scheduler. The sources were
  advanced through bounded, source-isolated workflows rather than an
  unbounded local import.

Current Sites deployment:

* Sites version `180`;
* source commit `0312176047d0098b737e9cdaea83d0843d4af246`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_a9b91b18c0b88191b486650065006fbd`;
* deployment `appgdep_6a907db645688191a1d3f659622e4f45`;
* deployment type `publish`, status `succeeded` and no failure message;
* provider URL `https://perfumetr.borodzicz85.chatgpt.site`;
* v180 separates persistence of the final EOF page from three idempotent
  cleanup queries, heartbeats the lease during finalization, writes a durable
  paused checkpoint when a bounded step must continue, and commits the final
  `completed` source state together with registry `ready` atomically;
* production build and artifact validation passed, the full suite passed
  `66/66`, lint has zero errors and the same three existing warnings, and an
  independent final review returned GO;
* production D1 reports every import-source row as `completed` with `error`
  null, and `sync_locks` is empty.

Verified catalog state:

| Source | Final verified state |
| --- | --- |
| TradeDoubler Cocolita | `886` live offers; full run #93 succeeded |
| TradeDoubler Drogeria.pl | `855` live offers; full run #93 succeeded |
| TradeDoubler Aelia.pl | `1,461` live offers; full run #93 succeeded |
| AWIN Douglas PL | generation 3 completed; `51,996` received, `4,032` accepted and live, `1,742` review, `46,222` excluded |
| AWIN Flaconi | run #6 completed; `35,171` received, `3,756` imported and live, `1,344` review, `30,071` excluded, `5,247` stored, automatic review `0`, maintenance processed `221` |
| CJ Notino | run #101 completed; `5,333` live, `663` review, `2,858` excluded, `3,619` imported, `10,240` stored, pending fresh `0`, automatic review `0` |
| CJ Brasty | completed; `5,585` live, pending fresh `0` |

The exact fresh live-offer total is `21,908`. The public API reports `9,690`
catalog entries, all `9,690` with images, across `658` brands. The Douglas logo
and wordmark are directly verified in the public store rail.

Production and remaining work:

* the provider URL and `beta.perfumetr.pl` returned HTTP 200;
* `perfumetr.pl` was intermittent during the final check, returning 502 and
  then two consecutive 200 responses. It must not yet be described as immune
  to a first-request or provider regression;
* `www.perfumetr.pl` consistently returned HTTP 502 and remains unresolved;
* Parfumdreams PL is rejected by AWIN while the persisted programme registry
  still shows the older applied state. This is a registry mismatch, not an
  active import;
* the global duplicate audit across published families and manual-review rows
  remains incomplete. Existing GTIN, identity, hidden-catalog and classifier
  gates must not be weakened merely to publish more rows;
* report `#010` was delivered to `support@perfumetr.pl`; Gmail records both
  `SENT` and `INBOX` at 2026-08-27 01:08:03 UTC. No report `#011` has been
  requested or sent.

No import, deployment or email delivery remains in progress at this checkpoint.
The next data task is the read-only global duplicate and remaining manual-review
audit, followed only by unambiguous bounded repairs. Recheck all live counters,
domains and external programme states before the next change.

## Earlier Sites v156 production checkpoint

Verified through 2026-08-25 21:38 UTC for the latest tester feedback,
Sites v156 and direct production verification. No credential, private screenshot
or provider payload is recorded here.

Repository and automation:

* repository: `GADOMM/Index`;
* verified `master` before this continuity pull request:
  `d14d218b578157d7235b0fbf0082d75bf0d0a7e0`;
* the latest completed workflow is `Perfumetr catalog feeds` run `#77`,
  ID `32898882767`, attempt `1`, scheduled, successful from 21:03:22 to
  21:17:50 UTC. Importer validation and the bounded partner orchestrator
  succeeded; the full TradeDoubler snapshot was correctly skipped;
* run `#72`, ID `32800552146`, remains the latest full production
  TradeDoubler snapshot;
* GitHub Actions remains the only automatic scheduler;
* no importer, feed, catalog data, D1 schema, schedule or partner configuration
  was changed or started for this UI correction.

Current Sites deployment:

* Sites version `156`;
* source commit `98eee0c3815049f8c04e9a5a00a13b62b398f9c0`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_56ba63caa25c81919615ae4c0e83f2eb`;
* deployment `appgdep_6a8e0a3699c48191b2264c499d021193`;
* deployment type `publish`, status `succeeded` and no failure message;
* provider URL `https://perfumetr.borodzicz85.chatgpt.site`;
* the Sites project is active and public, and its current live URL remains
  `https://beta.perfumetr.pl`;
* `perfumetr.pl` and `beta.perfumetr.pl` have active domain, provider and
  SSL status with no recorded error. `www.perfumetr.pl` is newly pending
  provider validation and was not changed in this task;
* the targeted regression passed `1/1`; build and artifact validation passed;
  the full Sites suite passed `58/58`; lint has zero errors and the same three
  existing warnings.

Latest feedback and correction:

* the newest entry reports hard-to-read desktop typography in catalog filters
  and in the price-sort menu at viewport `2560×1305`;
* the entry includes a protected screenshot. It was not copied from private R2
  or opened outside the authenticated owner endpoint;
* source inspection and agent-preview reproduction confirmed an objective
  readability defect: filter choices rendered at `9px`, group headings at
  `10px`, and the sort select and its native options at `11px`;
* v156 changes only desktop catalog typography at `721px` and wider:
  sort and toolbar actions are `14px`, group headings `12px`, filter
  choices and brand suggestions `13px`, and the brand input `14px`;
* filter state, sort logic, colors, control heights and the mobile native
  `16px` select remain unchanged. Agent preview at `1363×936` confirmed
  the new computed sizes, no clipped filter labels and a working
  `price-asc` selection;
* direct production checks returned HTTP 200 for the provider URL,
  `beta.perfumetr.pl` and `perfumetr.pl`. Beta serves the v156 stylesheet
  `/assets/index-CpZ4uGDw.css` with all four corrected desktop rules;
* the directly rendered production rail currently shows Aelia `1,397`,
  Cocolita `874`, Drogeria.pl `845`, Notino `4,214` and Brasty
  `6,181`, total `13,511` fresh active offers. Flaconi is absent from the
  fresh rail; this was recorded only as current production evidence and no
  feed or importer change was made;
* the feedback row remains `new` because the current owner panel has no
  supported status-transition action or API. No opinion was deleted.

Report `#009` remains the latest confirmed delivered report in repository
continuity. The user did not request an email for v156, so none was sent. After
this continuity pull request merges, no code edit, deployment, import or email
remains in progress. The exact next task is to inspect the next new or
unresolved panel entry, reproduce any claimed defect on current production and
change only a confirmed UI problem.

## Earlier Sites v146 production checkpoint

Verified through 2026-08-25 03:50 UTC for the catalog review reduction,
Sites v146 and the final isolated Flaconi maintenance pass. No credential,
private feed URL or provider payload is recorded here.

Repository and automation:

* repository: `GADOMM/Index`;
* verified `master` before this continuity pull request:
  `13b8ec7c89c03626d4c71c61e83511965f41e9e5`;
* pull request `#34`, `fix: automate safe Flaconi review backlog`, is merged as
  that commit. Importer validation passes `18/18`;
* `Perfumetr catalog feeds` run `#72`, ID `32800552146`, attempt `1`, push,
  completed successfully. It is the latest full TradeDoubler production
  snapshot and also advanced the bounded partner orchestrator;
* scheduled catalog run `#67`, ID `32777576698`, attempt `3`, completed
  successfully. The full TradeDoubler steps were correctly skipped; Notino and
  Brasty completed with no pending fresh offers;
* isolated `Perfumetr Flaconi feed` run `#4`, ID `32800552050`, attempt `2`,
  final job `97677660697`, completed successfully at 03:48:35 UTC with no
  source error;
* GitHub Actions remains the only automatic scheduler.

Current Sites deployment:

* Sites version `146`;
* source commit `f3031eeb6b124d8e568fa7bd804209ae6a0010d4`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_eb1cd01923b481919c5a0701734ff163`;
* deployment `appgdep_6a8d106a83848191ac8d0841b3ac7388`;
* deployment type `publish`, status `succeeded` and no failure message;
* provider URL `https://perfumetr.borodzicz85.chatgpt.site`;
* both `perfumetr.pl` and `beta.perfumetr.pl` remain active with active
  provider status, active SSL and no recorded domain error;
* production build and artifact validation passed, the full Sites suite passed
  `53/53`, and lint has zero errors with the same three existing warnings;
* an independent review of the final Flaconi rule found no blocker.

Catalog recovery and safety:

* the directly rendered production rail now shows Aelia `1,381`, Cocolita
  `855`, Drogeria.pl `845`, Notino `5,431`, Brasty `6,180` and Flaconi `3,668`,
  total `18,360` fresh live offers;
* the verified baseline before this work was `15,333`, so the net catalog gain
  is `3,027` fresh offers without manually prepared product JSON;
* the full TradeDoubler snapshot scanned Cocolita `27,811`, Drogeria.pl
  `32,414` and Aelia `8,545` provider products. Its final store results before
  later integrity quarantine were respectively `857`, `847` and `1,382` live
  offers. The explicit proof diagnostic reduced the shared review-candidate
  count from about `10,001` to `972`;
* Notino completed with `5,431` live offers, `144` review rows, zero automatic
  review rows and zero pending fresh offers. Brasty completed with `6,180`
  live offers, `125` review rows, zero automatic review rows and zero pending
  fresh offers;
* the first bounded Flaconi maintenance rule recovered `2,660` prior
  `gtin_not_found` rows and retained `93` semantic conflicts for human-quality
  evidence instead of forcing them live;
* the v146 pass attempted all `386` remaining eligible Flaconi review rows.
  `75` passed every identity, visibility and GTIN gate and became live. Of the
  remainder, `61` were stopped by stricter GTIN gates and `250` received
  terminal unresolved reasons, so the automation cannot loop forever;
* final Flaconi counters are `34,597` received, `3,668` imported, `1,357`
  review, `29,572` excluded, `5,128` stored and `3,668` live offers. Automatic
  review count is zero;
* a full post-run scan covered all `5,128` rows with `5,128` unique external
  IDs and no duplicate. The remaining review reasons are exactly `1,002`
  `gtin_identity_conflict`, `105` `semantic_gtin_conflict`, `249`
  `missing_audience_unresolved` and one `missing_line_unresolved`. There are
  zero legacy nonterminal `gtin_not_found`, `missing_audience` or
  `missing_line` rows, zero `catalog_hidden` rows and no other review reason;
* the 136 audited recovery candidates split into `75` live rows and `61` rows
  correctly held by GTIN conflict gates. The latter added `49` exact-identity
  and `12` semantic conflicts instead of blindly attaching an offer;
* v146 recognizes only nine audited audience signals local to Flaconi. Sibling
  inheritance requires the same official feed and generation, a terminal
  AWIN family suffix, identical raw brand, concentration and product type, an
  identical normalized title stem, one unanimous visible audience and no
  repeated GTIN. Mixed evidence always stays in review;
* the ordinary hidden-catalog, exact-GTIN, semantic-conflict and duplicate
  checks still run after that inference. Shipping absent from a stored review
  row remains unknown rather than being invented as zero;
* two independently confirmed historical identity mismatches remain hidden by
  the one-time catalog quarantine. Their listings and offers are unavailable;
* the coupon refresh remains completed with one active approved coupon and
  three rejected rows whose tracking URLs were not approved.

Direct production verification at 03:49 UTC returned HTTP 200. The homepage
showed Lattafa Khamrah EDP 100 ml, Drogeria.pl, four stores and `108.98` PLN,
and the six-store rail exposed the exact live counts above. There was no empty
hero or missing store rail.

Report `#009` remains the latest confirmed delivered report. The user did not
request an email for this catalog task, so none was sent. After this continuity
pull request merges, no code edit, import, deployment or email remains in
progress. The next data-quality task is to investigate the remaining conflict
rows only with stronger official identity evidence; do not weaken the current
gates merely to reduce the visible review counter.

## Earlier Sites v140 production checkpoint

Verified at 2026-08-25 00:47 UTC for Sites v140 and the global offer-price
integrity correction.

Repository and automation:

* repository: `GADOMM/Index`;
* verified `master` before this continuity pull request:
  `786844704f861fca0a9c0baa02cb17966a2d03a0`;
* pull request `#32` is merged as that commit and records Sites v139;
* the newest completed Actions run is `Perfumetr catalog feeds` run `#69`,
  ID `32793165028`, attempt `1`, pull request, success from 00:19:40 to
  00:19:50 UTC. Importer validation succeeded and the production import job
  was skipped;
* isolated Flaconi run `#2`, ID `32719777955`, attempt `26`, final job
  `97633299587`, remains the latest completed Flaconi production generation;
* run `#55` remains the latest full TradeDoubler snapshot;
* no import, feed, mapping rule or scheduler was changed or started for v140.

Current Sites deployment:

* Sites version `140`;
* source commit `b39cef8a5afdf11c0b12424d53250daace512ffc`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_217c05ee1f8c8191a229531cdcbfb981`;
* deployment `appgdep_6a8ce58741a88191b93d5a2f47f35a9a`;
* deployment type `publish`, status `succeeded` and no failure message;
* provider URL `https://perfumetr.borodzicz85.chatgpt.site`;
* production build and artifact validation passed, the full Sites suite passed
  `52/52`, and lint has zero errors with three existing warnings;
* the React quality review found no blocker in the three changed components;
* direct production HTML verification returned HTTP 200 and confirmed the
  corrected Lattafa Khamrah result.

Offer-price integrity correction:

* the prior global ranking put every offer with a known delivery cost ahead of
  every offer without one, even when the latter product price was much lower;
* SQL, the API offer builder, the beta comparison, the catalog detail and the
  homepage now share the same safe order by the lowest visible amount. A known
  final total wins only an exact visible-price tie;
* an offer without a verified delivery amount remains eligible, but is shown
  as a product price prefixed with `od`. It is not described as a final total
  or as a Perfumetr recommendation;
* current official delivery evidence adds active D1 rules for Cocolita and
  Drogeria.pl: DPD Pickup costs `7.99` PLN and becomes free from `159.00` PLN;
* those two rules expire after 30 days unless reverified. Aelia remains
  explicitly unknown rather than receiving an ambiguous or guessed free-
  delivery threshold;
* production now shows Lattafa Khamrah EDP 100 ml at Drogeria.pl, three stores
  and `108.98` PLN together with delivery. The incorrect Brasty result of
  `162.38` PLN is no longer presented as the cheapest offer;
* a new regression covers the exact failure class and proves that a much more
  expensive delivered offer cannot outrank a lower visible product price;
* current directly rendered rail counts remain Aelia `1,234`, Cocolita `842`,
  Drogeria.pl `841`, Notino `5,363`, Brasty `6,120` and Flaconi `933`, total
  `15,333` fresh live offers.

Report `#009` remains the latest confirmed delivered report. The user did not
request a report for v140, so none was sent. After this continuity pull request
merges, no code edit, import, Sites deployment or email remains in progress.
The next data-quality task is to reverify expiring delivery rules from official
store sources and to keep every still-unknown delivery visibly separate from a
final checkout total.

## Earlier Sites v139 production checkpoint

Verified at 2026-08-25 00:18 UTC for Sites v139 and the new 24-hour homepage
bottle rotation.

Repository and automation:

* repository: `GADOMM/Index`;
* verified `master` before this continuity pull request:
  `79aa195b82c4f6229c34e00ef53dbb2e5e67cd3f`;
* pull request `#31` is merged as that commit and adds safe 12.5-second pacing
  between consecutive Flaconi chunks;
* `Perfumetr catalog feeds` run `#68`, database ID `32792155232`, pull request,
  completed successfully. Importer validation passed `17/17` and the production
  import job was correctly skipped;
* the master merge used GitHub's supported CI skip marker, so it did not start
  unrelated store imports;
* isolated Flaconi run `#2`, ID `32719777955`, attempt `26`, final job
  `97633299587`, remains the latest completed Flaconi production generation;
* run `#55` remains the latest full TradeDoubler snapshot;
* GitHub Actions remains the only automatic scheduler.

Current Sites deployment:

* Sites version `139`;
* source commit `28c956a0d3f9f8f16ae2657142445b86d5cc782d`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_e9671c30cc2c819194eace4ac4f2c061`;
* deployment `appgdep_6a8cdeea96f88191ad385304c762d118`;
* deployment type `publish`, status `succeeded` and no failure message;
* provider URL `https://perfumetr.borodzicz85.chatgpt.site`;
* the production build and artifact validation passed, the full Sites suite
  passed `50/50`, and lint has zero errors with three existing warnings;
* no browser QA was requested or run. Direct production HTML verification of
  `perfumetr.pl` returned the expected dynamic product, price, store count and
  six-store rail.

Homepage rotation and store rail:

* all six reviewed transparent cutouts now complete one rotation every 24
  hours, so each normal slot lasts exactly four hours;
* the cycle begins with Lattafa Khamrah at
  `2026-08-25T00:00:00.000Z` and repeats every 24 hours;
* selection is computed from time and the reviewed manifest. Homepage reads no
  arbitrary provider image and no longer writes persistent rotation state;
* if the scheduled bottle temporarily has no valid fresh offer, the hero falls
  forward through the reviewed list instead of becoming empty;
* direct production HTML at 00:17 UTC showed Lattafa Khamrah EDP 100 ml using
  `/lattafa-khamrah-edp-100ml-cutout.png`, Brasty as the cheapest of three
  stores and a dynamic final price of `162.38` PLN;
* Flaconi is present in the continuous store rail with `933` fresh offers. The
  rail and its count remain D1-driven rather than statically duplicating a
  store;
* the same read showed six active stores: Aelia `1,234`, Cocolita `842`,
  Drogeria.pl `841`, Notino `5,363`, Brasty `6,120` and Flaconi `933`, total
  `15,333` fresh live offers;
* current Flaconi generation counters remain `34,597` received, `933` imported,
  `4,092` review, `29,572` excluded and `5,128` stored products.

Report `#009` remains the latest confirmed delivered report. The user did not
request another report for v139, so none was sent. After this continuity pull
request merges, no import, deployment or email remains in progress. The next
focused check is to confirm the first four-hour boundary changes the hero to
the next reviewed bottle without an empty state; do not redeploy if the timed
transition works.

## Earlier Sites v138 production checkpoint

Verified from 2026-08-24 23:30 UTC through 2026-08-25 00:02 UTC for the first
complete official AWIN Flaconi import and the follow-up orchestrator pacing
fix. No credential, keyed URL or private provider payload is recorded here.

Repository and automation:

* repository: `GADOMM/Index`;
* verified `master` before the pacing continuity pull request:
  `d97eac6d122610e01e84acf42cf092fc04c349d1`;
* isolated `Perfumetr Flaconi feed` run `#2`, database ID `32719777955`,
  completed successfully on attempt `26`; final import job `97633299587`;
* only source `awin:flaconi` was advanced. Aelia, Cocolita, Drogeria.pl,
  Notino, Brasty, TradeDoubler products and vouchers were not advanced by this
  run;
* the import exposed a 12-second Sites safety interval between completed
  chunks. The cursor persisted correctly, but the existing GitHub client sent
  the next chunk too early and required isolated job resumptions;
* the follow-up fix waits 12.5 seconds before every second and later Flaconi
  chunk. It does not retry HTTP 429 and does not change pacing for other
  sources;
* syntax checks and the full importer suite pass `17/17`, including a new
  synthetic test proving the exact Flaconi pacing behavior;
* GitHub Actions remains the only automatic scheduler.

Current Sites deployment:

* Sites version `138`;
* source commit `5ebfb1893e57a5d9cbd348967298417e61d945d1`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_f56fc148ad548191a077e53116caa1a6`;
* deployment `appgdep_6a8c469952d081919a75258f19cae3ed`;
* deployment type `publish`, status `succeeded` and no failure message;
* provider URL `https://perfumetr.borodzicz85.chatgpt.site`;
* v138 adds the official AWIN Flaconi CSV-gzip adapter, strict field mapping,
  bounded resumable chunks and official feed selection for advertiser `18563`
  and feed `37697`;
* the AWIN API credential is present only in encrypted Sites storage. It is
  valid and must never be moved into this repository, documentation or logs.

First complete Flaconi generation:

* generation `2` is `completed`, with no error;
* `34,597` received, `933` imported, `4,092` routed to review and `29,572`
  excluded;
* `5,128` catalog products are stored for the source and `933` Flaconi offers
  are live;
* Flaconi merchant status is active and verified, the AWIN programme is
  approved and its product status is ready;
* the official Stronger With You EDT 50 ml row with GTIN `3605522040281` is
  mapped to the existing catalog variant. Its live Flaconi offer is `214.76`
  PLN with zero shipping, active affiliate routing and fresh validity;
* this is lower than the previous Brasty homepage price of `239.74` PLN. The
  comparison remains dynamic; no screenshot price was inserted manually;
* prior directly verified live counts were Aelia `1,234`, Cocolita `843`,
  Drogeria.pl `841`, Notino `5,344` and Brasty `6,043`. Because the isolated
  run changed only Flaconi, the resulting total is `15,238` live offers,
  including Flaconi `933`;
* no public browser screenshot was used as proof because the beta access gate
  was active. The offer, mapping, price, shipping, freshness and affiliate
  route were verified directly in production D1.

Report `#009` was sent to `support@perfumetr.pl` and confirmed in Sent before
the owner saved the protected key. It covered the key handoff, v138 preparation
and planned import. No second report was requested or sent after the completed
generation.

After this continuity pull request is merged, no import, Sites deployment or
email is in progress. The next scheduled partner cycle should be observed once
to confirm that the new Flaconi pacing completes in one job without a rate-limit
resumption. Product review rows remain review rows; do not weaken strict mapping
or classification rules merely to reduce their count.

## Earlier Sites v136 production checkpoint

Verified at 2026-08-24 11:57 UTC for Sites v136 and the focused cleanup of the
`Produkty i ceny` integration section. Importer counters retain their directly
verified 09:35 UTC baseline because v136 changed only read-only status controls
and did not change import, source, schema, schedule or offer data.

Repository and automation:

* repository: `GADOMM/Index`;
* verified `master` before this continuity pull request:
  `fb272af362f30263d004ef3ca888e29fe8f71135`;
* pull request `#24` is merged as
  `deedfdb60d0129cfefb51d89631ab897f434d980` and records Sites v131;
* pull request `#25` is merged as
  `fb3396ee134ea7bba317b32fdebae4a0aad73789` and records report `#007`;
* pull request `#26` is merged as
  `4b1f3a6238c28cd6012f676a4cdce34d14d0510a` and records Sites v132 and
  delivered report `#008`;
* pull request `#27` is merged as
  `3092cd09d80080acb4fc450fe5461b3f932d3673` and records Sites v133;
* pull request `#28` is merged as
  `12bc37c2c2e8fbe2a0788a55923342eb4fc39242` and adds one source-limited,
  unscheduled Flaconi workflow supporting push and manual dispatch;
* pull request `#29` is merged as
  `fb272af362f30263d004ef3ca888e29fe8f71135` and records Sites v134, v135
  and the authorized Flaconi feed check;
* `Perfumetr Flaconi feed` run `#1`, database ID `32719672617`, attempt `1`,
  pull request, completed successfully. Importer validation passed `16/16` and
  the production job was correctly skipped;
* `Perfumetr Flaconi feed` run `#2`, database ID `32719777955`, attempt `2`,
  completed successfully from 11:20:17 to 11:20:35 UTC. The isolated Flaconi
  job was `97413228339`;
* attempt `1` of run `#2` did not test AWIN. Sites rejected the new workflow
  identity with `orchestrator_404` before the importer reached AWIN;
* attempt `2` passed the scoped OIDC boundary, reached AWIN and returned the
  handled external blocker `orchestrator_feed_not_found` before scanning any
  records;
* the newest scheduled partner workflow remains run `#58`, database ID
  `32711816055`, attempt `1`, event `schedule`, successful from 09:29:21
  to 09:34:29 UTC; importer validation passed `16/16`, full TradeDoubler was
  correctly skipped and the bounded partner orchestrator succeeded;
* run `#53`, database ID `32666073700`, attempt `8`, remains the final
  completed CJ recovery generation;
* run `#55` remains the latest full TradeDoubler snapshot. Its full import
  step succeeded from 00:24:49 to 00:41:51 UTC, although the overall run failed
  on the retired pre-v131 CJ maintenance path;
* GitHub Actions remains the only automatic scheduler.

Current Sites deployment:

* Sites version `136`;
* source commit `d7bbc115a5717a1394a4e95fef7108b0ec62c087`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_bd470fdd6bc4819191ef4bdbbd872673`;
* deployment `appgdep_6a8c311d41588191a434e2bb64d0d70e`;
* deployment type `publish`, status `succeeded` and no failure message,
  directly rechecked by the main agent after deployment;
* provider URL `https://perfumetr.borodzicz85.chatgpt.site`;
* Sites reports version `136`; the pre-deployment project check confirmed an
  active public project and
  `https://beta.perfumetr.pl` as the live URL;
* the previous 11:29 UTC check of `perfumetr.pl` and `beta.perfumetr.pl`
  recorded active domain, provider and SSL state with no error; v136 did not
  alter domain configuration;
* production build and artifact validation passed, the full suite passed
  `50/50`, and lint has zero errors with three existing warnings;
* no browser QA was run for v136. Verification is the direct Sites deployment
  result, build, tests, rendered six-card coverage and an independent read-only
  code review.

Sites v134 and v135 changed only integration presentation and workflow trust:

1. TradeDoubler, AWIN and CJ now use the same read-only card model:
   Connection, Programs, Catalogs and Promotions, with the same refresh action;
2. AWIN server rendering uses the persisted programme registry, so the
   confirmed `1 of 5` state survives a page reload;
3. promotions and coupons are provider-neutral and appear once at the top
   level instead of being presented as a TradeDoubler-only capability;
4. ordinary integration-panel refreshes still do not start imports;
5. v135 trusts the exact `flaconi.yml` workflow only for the catalog
   orchestrator and only for `push` or `workflow_dispatch` events;
6. the Flaconi workflow cannot access the TradeDoubler runtime bridge. Existing
   TradeDoubler trust remains unchanged.

Sites v136 makes `Produkty i ceny` internally consistent without turning
the panel into a second scheduler:

1. Cocolita, Drogeria.pl, Aelia.pl, Notino, Brasty and Flaconi each expose one
   identically placed `Odśwież status` action;
2. every action uses only its existing safe GET status endpoint. The six client
   cards contain no POST request and cannot start or advance an import;
3. all six cards poll every 30 seconds and share consistent loading, success
   and error feedback, `aria-busy` state and live announcements;
4. every card uses the same collapsible import-details structure;
5. the Notino access diagnostic now starts in `idle`, fixing the state in which
   `Sprawdź dostęp` could remain disabled as `Sprawdzam…`;
6. a read-only TradeDoubler refresh is no longer blocked by an importer busy
   flag, and a temporary panel read failure does not falsely turn an active
   offer-status badge red;
7. disconnecting an integration during a manual status read cannot leave the
   button stuck in its loading state after reconnection.

Product-rating audit:

* CJ Notino, TradeDoubler, AWIN, the current API models and production D1 do
  not provide a customer product rating plus review count;
* `feedback.rating` is a beta-tester score and
  `catalog_import_sources.review_count` is an importer review-queue counter.
  Neither may be displayed as product reviews;
* v132 deliberately publishes no fabricated stars or manually copied counts;
* a future rating must be stored per merchant listing, include its source and
  freshness, and come from an official store API, official feed or licensed
  source before the UI can show it.

Importer and offer state is unchanged by Sites v133 through v136:

| Source | Live offers | Review | Automatic | Pending fresh |
| --- | ---: | ---: | ---: | ---: |
| Aelia.pl | 1,234 | bounded TradeDoubler proof | not applicable | not applicable |
| Cocolita | 843 | bounded TradeDoubler proof | not applicable | not applicable |
| Drogeria.pl | 841 | bounded TradeDoubler proof | not applicable | not applicable |
| Notino | 5,344 | 54 partial | 54 | 0 |
| Brasty | 6,043 | 154 partial | 66 | 0 |

The verified total remains `14,305` live offers. Run #58 started new CJ
generations and stopped both safely at the 48-step cycle limit. Their partial
review and automatic counters are not final. The preceding completed
generation ended with `297` true manual rows, zero automatic work and zero
pending-fresh work. Do not weaken mapping rules to reduce a counter.

Voucher state remains 4 received, 1 imported, 3 excluded and 1 active. The
active coupon is not silently applied to price without structured owner
confirmation. D1 persistently records Flaconi advertiser `18563` as `approved`,
with the decision recorded at 10:19:17 UTC and the latest check at 11:20:30 UTC.
Reloading the panel does not remove that approval;
the previous `0 of 5` display was a presentation bug. Run #2 attempt 2 reached
the official AWIN Enhanced endpoint after the documented propagation window,
but AWIN returned feed-not-found before scanning. The source remains paused at
generation 1 with zero received, accepted, review or rejected rows, and no
Flaconi merchant or offer exists. A separate AWIN Data Feed API key was not
configured at the final check; it is required to discover the official feed
format, feed ID and locale through Product Feed List. Never store the key or a
keyed feed URL in this repository.

The earlier directly verified homepage state remains the ordinary five-day
rotation with YSL Libre Flowers & Flames EDP 50 ml, Notino, 3 stores, 359.40
PLN total and 258.50 PLN saving. Sites v133 through v136 did not modify the homepage,
rotation, cutouts or dynamic offer calculation.

Report `#008`, dated 2026-08-24, was sent to
`support@perfumetr.pl` at 09:59 UTC and confirmed in Sent. It uses the exact
visual template and inline Perfumetr logo from delivered report `#003`.
Report `#008` is the latest confirmed delivered report.

There is no Sites code edit, importer run, deployment or email delivery in
progress after this continuity pull request is merged. No report was requested
or sent for v136. The next user-driven data task remains saving the separate
AWIN Data Feed API key in the protected integration field, never in chat or the
repository. Then read Product Feed List, select only advertiser 18563 using its
real format and locale, and continue the bounded official-feed import. Flaconi
remains hidden from store rails and comparisons until verified fresh offers
exist. Product ratings remain blocked until an authoritative structured source
is available.

## Earlier Sites v128 production checkpoint retained for history

Verified at 2026-08-22 17:20 UTC. This checkpoint supersedes the lower dated
v123 evidence, which is retained only for history.

Repository and automation:

* repository: `GADOMM/Index`;
* verified `master` before continuity pull request `#22`:
  `8eab30aac9d9209c3d73a19cfcddaa08ed6787ce`;
* pull request `#20` is merged as
  `792657f3e91621efa6e450e8d98fa1200745a7d1`;
* pull request `#21` is merged as
  `8eab30aac9d9209c3d73a19cfcddaa08ed6787ce` and lets the GitHub
  orchestrator drain bounded CJ maintenance batches;
* pull request `#22` is the documentation-only continuity record for this
  checkpoint; verify its final CI and merge state directly;
* GitHub Actions run `#47`, database ID `32581506389`, attempt `15`,
  completed successfully; the production job ID is `97065393622`;
* the attempt-15 production job ran from 17:16:44 to 17:17:26 UTC, reported no
  HTTP 429 and no workflow error;
* the latest full TradeDoubler snapshot remains run `#28`, database ID
  `32497431067`, attempt `3`;
* GitHub Actions remains the only automatic scheduler.

Current Sites deployment:

* Sites version `128`;
* source commit `7f4943aac6d4256faccb2f62ebb50f9bf56589d5`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_54ab4c69fcac8191a673e5dccda17080`;
* deployment `appgdep_6a89d93b1f988191886c838226132d0f`;
* deployment status `succeeded`, directly rechecked after publication;
* provider URL `https://perfumetr.borodzicz85.chatgpt.site`;
* production build passed, the full suite passed `47/47`, and lint has zero
  errors with three existing warnings;
* an independent read-only review found no data-safety blocker.

The catalog recovery was completed without manual product JSON and without
copying screenshot prices into the database:

1. exact complete GTINs are mapped only when the catalog match is unique;
2. fresh CJ product-ID queries replace stale queued price data before an offer
   is published;
3. completed imports detect legacy active products that have no live listing;
4. a bounded exact-GTIN coverage audit queries official CJ data for verified
   variants that already have a fresh offer in another verified store;
5. the GitHub orchestrator drains bounded maintenance work and stops on zero
   progress, cooldown, busy state, an error or the 48-step safety limit;
6. v128 converts unresolved fresh mapping or classification conflicts into
   explicit manual-review cases, so they no longer loop through the automatic
   queue; a later complete provider generation can still improve them.

Verified production result:

| Source | Live offers | Review | Automatic | Pending fresh |
| --- | ---: | ---: | ---: | ---: |
| Aelia.pl | 1,185 | bounded TradeDoubler proof | not applicable | not applicable |
| Cocolita | 830 | bounded TradeDoubler proof | not applicable | not applicable |
| Drogeria.pl | 835 | bounded TradeDoubler proof | not applicable | not applicable |
| Notino | 5,297 | 209 | 0 | 0 |
| Brasty | 6,041 | 220 | 0 | 0 |

The verified total is `14,188` live offers. During the recovery, the Notino
coverage backlog fell from `1,381` to `0` and Notino gained `701` live
offers, from `4,596` to `5,297`. The final attempt kept Notino at `5,297`
live offers and completed four maintenance operations that moved the last two
looping conflicts into true manual review. The remaining `209` Notino and
`220` Brasty review rows are not represented as safe automatic matches.

Final CJ counters from run #47 attempt 15:

* Notino: state `completed`, 7,005 received, 3,945 imported, 2,869 excluded,
  9,106 stored, 5,297 live, 209 review, 0 automatic and 0 pending fresh;
* Brasty: state `completed`, 13,598 received, 5,221 imported, 321 excluded,
  6,582 stored, 6,041 live, 220 review, 0 automatic and 0 pending fresh.

TradeDoubler proof in the same successful attempt confirmed Aelia `1,185`,
Cocolita `830` and Drogeria.pl `835` live offers. The `100 received`
values for Cocolita and Drogeria.pl remain bounded proof samples, not provider
feed sizes. Vouchers remain 4 received, 4 excluded, 0 imported and 0 active.

AWIN Flaconi remains externally blocked by
`orchestrator_feed_not_found`. Do not describe it as active.

A direct `perfumetr.pl` check after attempt 15 returned HTTP 200 and showed
the exact Stronger With You EDT 50 ml spotlight with Notino, 5 stores,
217.40 PLN total and 220.50 PLN saving. The price, merchant, store count,
delivery and saving remain dynamic D1 results. The screenshot price was not
hard-coded.

No email report was sent. Report `#006` remains the latest confirmed
delivered report. There is no code edit, import, deployment or email delivery
in progress. The exact next time-based task remains the read-only check after
2026-08-23 09:20 UTC that the temporary spotlight expired and the saved
five-day homepage rotation resumed without an empty or stale hero.

## Earlier production evidence retained for history

Repository: `GADOMM/Index`

Default branch: `master`

Repository baseline verified before continuity pull request `#19`:

* `master` commit `f741cb7c4198f7eeea98d13c05669c5a79b3cd88`;
* pull request `#12`: production importer release;
* pull request `#13`: verified importer production state;
* pull request `#14`: strict chat-continuity runbook;
* pull request `#15`: Sites v114 store-rail continuity record;
* pull request `#16`: Sites v120 catalog continuity record;
* pull request `#17`: Sites v121 minimal-catalog continuity record;
* pull request `#18`: report #006 and tester-feedback continuity record;
* pull request `#19`: documentation-only Sites v122 Stronger With You
  spotlight continuity record, merged as
  `5e06942de9d7df90a6a608e95ce608fd3234b47a`;
* pull request `#20`: documentation-only Sites v123 meaningful-savings
  continuity record; verify its current CI and merge state directly.

GitHub Actions evidence:

* latest Actions run before this metadata-only refresh: number `43`, database
  ID `32565560052`, attempt `1`, event `pull_request`, conclusion
  `success`;
* run 43 validated the importer successfully and skipped the production import
  job because it was pull-request documentation validation;
* latest scheduled production partner cycle is run number `41`, database ID
  `32563903356`, attempt `1`, conclusion `success`, from
  2026-08-22 09:03:07 UTC to 09:07:08 UTC;
* run 41 passed importer validation, skipped the full TradeDoubler snapshot and
  advanced bounded partner sources successfully;
* latest full production TradeDoubler importer remains run number `28`,
  database ID `32497431067`, attempt `3`, successful at
  2026-08-21 16:20 UTC;
* GitHub Actions remains the only automatic scheduler.

## Earlier Sites deployment retained for history

Sites v123 is deployed successfully:

* source commit `9333dfcbcb02bdb172908b2c9bb7191e369f3b9d`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_8168714f30308191bec15294142b87e9`;
* deployment `appgdep_6a89a78633c88191b681c5d81d89dda8`;
* deployment status `succeeded`, directly verified at
  2026-08-22 13:44 UTC;
* provider URL `https://perfumetr.borodzicz85.chatgpt.site`;
* Sites reports version `123` and `https://beta.perfumetr.pl` as the
  current live URL;
* the Sites project is active and public;
* `perfumetr.pl` and `beta.perfumetr.pl` retain active domain, provider
  and SSL state with no recorded error.

The v123 production build completed successfully. The full Sites test suite
passes `47/47`. Lint reports zero errors and three existing unused-variable
warnings. An independent read-only review found no blocking regression in the
meaningful-savings guard or its fallback.

A direct production HTTPS check at 2026-08-22 13:44 UTC returned Stronger With
You EDT 50 ml, Brasty, 4 stores and 239.74 PLN. The third hero metric now shows
`pojemność` and `50 ml`; it no longer advertises the negligible 0.08 PLN
difference as a saving.

No importer, database schema, source configuration, automatic schedule or
domain setting changed in v123.

## Earlier project area checkpoint retained for history

| Area | Confirmed state at this checkpoint |
| --- | --- |
| Repository and CI | PR #19 merged as `5e06942...`; latest Actions run 43 succeeded; scheduled production run 41 succeeded; run 28 remains the latest full TradeDoubler import |
| Sites | v123 deployed successfully from `9333dfc...`; production build and 47/47 tests passed |
| Importer | TradeDoubler and CJ paths remain operational; v123 did not change importer code or schedules |
| Affiliate sources | Aelia, Cocolita, Drogeria.pl, Notino and Brasty have live offers; AWIN Flaconi remains externally blocked |
| Domains | `perfumetr.pl` and `beta.perfumetr.pl` report active provider and SSL state; Sites reports beta as the live URL |
| Homepage | v123 keeps the active Stronger With You spotlight and suppresses negligible savings; 0.08 PLN is replaced by the 50 ml volume metric |
| Beta landing page | Search, browse trigger, feedback prominence, metadata and responsive footer refinements remain deployed and unchanged in v122 |
| Catalog browser | The v121 transparent minimal catalog, flat filters, automatic price-capable volume selection and accessible interaction remain deployed |
| Store rail | Five store logos loop continuously, blend into the page on both ends and retain the compact mobile treatment |
| Store count | The dynamic coverage message remains separate from the logo rail and announces that more stores are coming |
| Integrations panel | Persisted read-only status model remains deployed; normal page interaction does not start imports |
| Reporting | Report #006 remains the latest confirmed delivered report; no report was sent for v122 |
| Human feedback | The beta has been shared with several people; their feedback may arrive and has not yet been triaged |

## Earlier verified importer results retained for history

| Source | State | Latest verified production result |
| --- | --- | --- |
| TradeDoubler Cocolita, Feed `112471` | active; not rerun in run 41 | run 28 proof: 100 received, 29 perfumes, 793 live offers |
| TradeDoubler Drogeria.pl, Feed `118359` | active; not rerun in run 41 | run 28 proof: 100 received, 25 perfumes, 814 live offers |
| TradeDoubler Aelia.pl, Feed `258031`, Program `397216` | active; not rerun in run 41 | run 28: 8,426 provider/scanned products, 1,799 perfumes, 85 chunks, 1,049 live offers |
| TradeDoubler vouchers | completed and fresh in run 41 | 4 received, 4 excluded, 0 imported, 0 active coupons |
| CJ Notino | completed in run 41 | 7,005 received, 3,776 imported, 445 review, 2,784 excluded, 8,291 stored products, 4,422 live offers |
| CJ Brasty | bounded generation paused as incomplete in run 41 | 9,540 received, 1,514 imported, 7,885 review, 141 excluded, 6,582 stored products, 1,092 live offers |
| AWIN Flaconi | externally blocked and retried automatically | `orchestrator_feed_not_found`; partner feed still requires external activation |

The latest verified total is `8,170` live offers: Aelia `1,049`,
Cocolita `793`, Drogeria.pl `814`, Notino `4,422` and Brasty `1,092`.

Run 41 did not execute a new TradeDoubler product snapshot, so the three
TradeDoubler counts remain verified run 28 results. The `100 received` values
for Cocolita and Drogeria.pl are bounded proof samples, not full provider-feed
sizes.

Brasty's run 41 generation is not complete and must not be described as a
completed refresh. Its `1,092` live offers are the latest counters reported by
production. The bounded orchestrator will continue the source in a later
scheduled cycle. This paused state did not fail the overall workflow.

A blocked source does not stop successful TradeDoubler or CJ sources. Scheduled
cycles retry the AWIN blocker automatically after the feed becomes available.

## Automatic schedule

Partner sources run at 02:47, 08:47, 14:17 and 20:47 UTC. The full TradeDoubler
snapshot runs at 14:17 UTC. GitHub may start a scheduled run later than the
configured minute. Source-level isolation prevents one unavailable partner from
blocking the remaining stores.

## Sites v123 meaningful-savings guard

The user reported that the homepage hero showed `oszczędzasz 0,08 zł · −0%`,
which made the offer look unreliable.

Completed behavior:

1. the homepage labels a value as `oszczędzasz` only when the saving is at
   least 5 PLN and at least 2%;
2. smaller or zero-value differences fall back to the existing `pojemność`
   metric and the live bottle volume;
3. the current Stronger With You spotlight therefore shows `pojemność` and
   `50 ml` instead of `0,08 zł · −0%`;
4. meaningful discounts such as the tested 200 PLN and 40% fixture remain
   visible;
5. price, merchant, store count, delivery and coupon effects remain dynamic;
6. no catalog, importer, schedule, database or domain behavior changed.

Verification:

* production build: passed;
* full automated suite: `47/47`;
* targeted negligible-saving regression test: passed;
* lint: zero errors, three existing warnings;
* independent read-only logic review: no blocker;
* deployment v123: directly confirmed `succeeded`;
* direct `perfumetr.pl` check: HTTP 200 and the expected `pojemność 50 ml`
  metric, with no visible `oszczędzasz 0,08 zł`.

## Sites v122 Stronger With You spotlight

The user requested one targeted homepage change and no unrelated visual work.

Completed behavior:

1. the submitted screenshot was used only to identify Emporio Armani Stronger
   With You EDT 50 ml, GTIN `3605522040281`;
2. the homepage asset contains only the recognisable bottle on a transparent
   background, without the box, phone interface or screenshot background;
3. the spotlight is active from `2026-08-22T09:20:00.000Z` through
   `2026-08-23T09:20:00.000Z`, which is 11:20 to 11:20 in Poland;
4. the current D1 catalog supplies the price, merchant, offer count, delivery
   cost and coupon effects dynamically; the screenshot price is not hard-coded;
   a direct production HTTPS check at 2026-08-22 09:44 UTC returned Brasty,
   4 stores and 239.74 PLN for this 50 ml EDT variant; this is point-in-time
   evidence and remains subject to the live D1 data;
5. the normal saved five-day rotation is not overwritten;
6. after the interval expires, the normal rotation resumes automatically
   without another deployment;
7. if this exact live variant becomes unavailable during the interval, the
   homepage safely falls back to the normal rotation.

Verification:

* production build: passed;
* full automated suite: `47/47`;
* lint: zero errors, three existing warnings;
* independent spotlight-logic review: no blocker;
* independent transparent-asset review: no blocker;
* deployment v122: directly confirmed `succeeded`.

No browser preview was run because the user asked for a focused deployment and
the Sites workflow did not require a subjective re-review of unrelated areas.

## Earlier visual work retained

The v114-v122 homepage, beta landing, catalog and spotlight refinements remain part of the
current build. They include the continuously looping store rail, separate
store-count message, browse trigger, refreshed search, prominent feedback
action, responsive footer and minimal transparent catalog. v123 did not rebuild
or reverse those areas.

## Integrations panel

The panel uses one read-only status model for TradeDoubler, AWIN and CJ:
Connection, Programs, Catalogs and Promotions, with the same refresh action.
AWIN server rendering uses the persisted programme registry, so confirmed
programme states survive a page reload. Promotions and coupons are
provider-neutral at the top level. Normal panel refreshes do not start imports.

Emergency authenticated import routes remain available for controlled recovery,
but the panel is not a second scheduler. Since Sites v157, verified coupons are
activated and expired automatically from protected structured configuration;
the panel is only a view and the user does not manually accept coupons.

## Deployment reports

Report `#010`, dated 2026-08-27, is the latest confirmed delivered message to
`support@perfumetr.pl`. Gmail records `SENT` and `INBOX` at
2026-08-27 01:08:03 UTC. It uses the established report template and covers the
audited Douglas PL launch. Report `#009` remains the immediately previous
delivered report, and report `#003` remains the visual template authority.

Current reporting instruction:

1. do not send a report automatically after each visual deployment;
2. wait until the user explicitly requests the consolidated report;
3. before writing it, retrieve delivered report `#003` from Sent and reproduce
   its exact visual template, wordmark, layout, typography and footer;
4. recheck the latest delivered report number immediately before assigning the
   next sequential number;
5. after confirmed report `#010`, the next number is `#011` only if the
   mailbox check still confirms that sequence and the user explicitly requests
   another consolidated report.

Required footer:

Pozdrawiamy,
Zespół Perfumetr
Ten sam zapach. Różne ceny.
perfumetr.pl
support@perfumetr.pl

## Earlier operational handoff retained for history

No code change, import, Sites deployment or email delivery is currently in
progress. The last production change is Sites v123, deployed from source commit
`9333dfcbcb02bdb172908b2c9bb7191e369f3b9d`. It hides the negligible
0.08 PLN homepage saving and shows the current 50 ml volume instead. The
production build passed, the full suite passed `47/47`, lint has zero errors
and three existing warnings, and the deployment was directly confirmed
`succeeded`.

Pull request `#20` is the documentation-only continuity record for this
checkpoint. Its current merge and CI state must be verified directly before a
future change.

The exact next task remains to verify, after 2026-08-23 09:20 UTC, that the
normal five-day homepage rotation resumed. Before then, respond only to
concrete tester feedback or the user's next targeted visual request; do not
proactively alter unrelated interface areas.

## Known risks and blockers

1. `www.perfumetr.pl` still returns HTTP 502. The apex `perfumetr.pl` also
   returned one 502 before two consecutive 200 responses in the final check, so
   a first-request or provider regression is not ruled out.
2. Parfumdreams PL is rejected by AWIN while the persisted programme registry
   still shows the older applied state.
3. The global duplicate audit across published families and manual-review rows
   is not complete. Remaining Flaconi and Notino review counters must not be
   treated as automatically safe matches.
4. Full TradeDoubler snapshots are parsed in memory after download.
5. GitHub scheduled workflows can be disabled on inactive public repositories;
   a missing-success alert is still recommended.
6. A future provider schema change may require a new bounded adapter or source
   profile.
7. Identity maintenance and EOF finalization are deliberately bounded. A
   durable paused checkpoint can mean that another scheduled cycle is required;
   it is not permission to bypass the audit or extend the lease indefinitely.

## Chat continuity

The repository is the durable project memory. Keep this file and
`docs/CHAT_CONTINUITY.md` current after every important deployment. When the
user says that the chat is lagging, asks to change chats or requests a message
for the next chat, immediately prepare one complete paste-ready handoff. Do not
ask the user to summarize the conversation.

The receiving chat must first read `AGENTS.md`, `PROJECT_STATE.md`,
`docs/ARCHITECTURE.md` and `docs/CHAT_CONTINUITY.md`. It must verify GitHub
and Sites directly and must not change code, imports, configuration or
production before that verification.

## Do not claim

Do not advertise a saving below 5 PLN or 2% in the homepage hero. Do not claim
that the global duplicate or manual-review audit is complete. Do not publish
ambiguous GTIN, reused external-ID or identity-conflict rows, and do not weaken
`perfume-v1`, hidden-catalog or identity gates to increase the visible offer
count. Do not describe the intermittent apex response as fully fixed, and do
not claim that `www.perfumetr.pl` works while it returns 502. Do not present the
Parfumdreams registry row as current partner approval. Report `#010` is the
latest confirmed delivered report; do not claim that report `#011` was sent.
