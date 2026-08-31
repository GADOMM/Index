# Chat continuity runbook

The repository, not a single chat, is the durable project memory. A receiving
chat must be able to continue safely even if it can see none of the earlier
conversation.

## Current handoff: Sites v195 atomic TradeDoubler snapshots

Verified through approximately 2026-08-31 00:38 UTC after the Sites v195
post-deployment and report-delivery checks.

- The compatible GitHub worker checkpoint is
  `de1f14fb224e38a669258bac42d81d5c5ecb1cc6`.
- Pull request #44, `Make full TradeDoubler snapshots atomic and exact`, is
  merged. Pull-request validation run #128, ID `33343249979`, succeeded with
  27/27 worker tests and skipped the production job. Never describe run #128
  as a product import.
- Documentation pull request #45 is merged as
  `12b5bb9346430bc1fa626c327e8b92e59ed48f1d`. Pull-request validation run
  #129, ID `33344895933`, also succeeded with 27/27 tests and skipped the
  production import job. It is not a product import.
- Sites v195 is deployed from source commit
  `7430f7b5c2b9770ad5fae7c97f8ac0375ce3e89a`; version ID
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_0581a7ae25848191bb7b847085f737f1`;
  deployment `appgdep_6a94c5dc21308191812d9bf6d472fe08` publish
  succeeded with null failure message.
- Future-contract fields in the worker were inert, optional metadata ignored
  by Sites v194 while it continued to receive its established compatible
  payload. The same worker revision also added independent local duplicate-
  offer detection and bounded chunk validation, but did not rely on or activate
  a new Sites contract. Sites v195 was the first side to enforce strict dual
  validation, staging and atomic publication. No import was started by either
  rollout.
- The v184-v194 baseline remains active. v184 made analytics consent compact;
  after a decision there is no permanent bottom-right privacy control.
- Shared identity across CJ, Douglas, Flaconi and TradeDoubler uses only 19
  audited brand groups, 28 audited family keys and two explicit Stronger With
  You aliases. Jean Paul Gaultier is one of those brand groups. There is no
  fuzzy merge, semantic slot conflicts stay separate, counters use the
  normalized brand and 71 confirmed nonstandard variants remain hidden.
- Only the exact brand and line pair Xerjoff + `XJ 1861 Naxos` canonicalizes to
  `Naxos`; this narrow rewrite is independent of GTIN. Separately, targeted
  reprocessing of earlier conflict rows is restricted to GTIN `8033488155070`
  and its leading-zero form `08033488155070`. This is test-backed code behavior,
  not proof of every live Naxos row or permission to remove `XJ 1861` globally.
- A global 30-hour publication cap applies to every source across catalog,
  comparison, store rail, counters, coupons and outbound redirects. CJ rolling
  refresh targets 20 hours. Older offers are intentionally hidden instead of
  presented as current.
- CJ known-ID maintenance is capped at 50, confirmation retry waits 15 minutes,
  stale unavailability is rechecked after six hours, a changed GTIN goes to
  review and coverage examines at most three verified standard-GTIN variants
  per step with a fresh other-store witness. Cursor drift is at most 2%, capped
  at 250 rows; only guarded EOF may finish a drifted query and scopes above
  10,000 are skipped safely.
- Flaconi completed maintenance is capped at 40. Douglas paused recovery, EOF
  cleanup, safety phases and counter reconciliation are bounded, resumable and
  fail closed. A stale, duplicate or reused external ID fails closed once the
  conflict is observed; if contradictory copies are on different pages, the
  first can be briefly public before the second is read and quarantine begins.
  This is not a global semantic-duplicate audit across different product IDs.
  Only an exact safe restock may reactivate a row.
- Every TradeDoubler Unlimited chunk now contains the complete raw slice and
  its exact ordered `perfume-v1` subset. Sites independently recomputes the
  subset and rejects an omission, addition, mutation or order change.
- The worker rejects duplicate offer identities across the entire snapshot
  before chunk one. Sites validates the full raw chunk again. Chunks write only
  session-scoped staging; public listings, offers, store rails and global
  counts change only in one verified completion transaction.
- Selector `all-products-v2:perfume-v1` is durable in the active session,
  completed feed metadata and receipt. An old selector forces replay and an
  old session cannot resume or complete under v195.
- Unlimited begin, chunk, complete and fail actions, plus issuance of the
  `unlimited_full` browser ticket, are OIDC-only with audience
  `perfumetr-tradedoubler-bridge` and exact workflow identity checks. Other
  browser-ticket modes are outside this statement.
- The validated exact classifier subset bypasses only the older narrower
  perfume-name predicate. Category-only perfume evidence works; description-
  only references, shampoo, testers, samples, refills, sets, body care, mists
  and home fragrance remain excluded. Hidden-catalog, identity, duplicate,
  semantic and exact-GTIN gates remain active. GTIN quarantine is symmetric,
  including a null-GTIN witness.
- Verification passed: Sites build and artifact validation, Sites suite 80/80,
  worker suite 27/27 and `git diff --check` in both repositories. Lint has zero
  errors and three pre-existing warnings. Two independent exact-code reviews
  returned GO.
- The latest scheduled production cycle is run #127, ID `33340455040`, from
  2026-08-30 22:56 UTC. Validation passed and full TradeDoubler was correctly
  skipped, but the partner job failed: Flaconi and Notino returned
  `orchestrator_import_failed`; Brasty completed. One failed bounded partner
  cycle is not a global catalog outage. No manual retry was launched.
- Run #126, ID `33338337893`, is the latest full TradeDoubler attempt and
  failed after Douglas persisted a safe checkpoint near 39,000 scanned rows.
  It is not a completed full snapshot. The first successful scheduled full
  cycle after v195 is still required to prove the new contract in production.
- `sync_locks` was empty, and a complete `catalog_meta` scan found no active or
  abandoned Unlimited session key. No import or catalog lease was running.
- Post-deployment D1 source truth:
  - Douglas generation 6 is `failed` at the safe 39,000 checkpoint with 2,407
    accepted, 2,322 review and 34,271 rejected; error `import_failed`, no lock.
  - Flaconi generation 15 is `completed` with 35,010 received, 3,754 accepted,
    1,332 review, 29,924 rejected and null source error.
  - Notino generation 22 is safely `paused`, not completed and not running. It
    has no source error; 19,269 received, 11,380 accepted, 2,947 review and
    4,942 rejected. The active bounded query checkpoint is 9,500 of 9,681 and
    product status is `syncing`.
  - Brasty generation 17 is `completed` with 13,161 received, 11,320 accepted
    and 300 rejected. Run #127 overview reported 658 review, but a later D1
    row reported 1,541; preserve both until a consistent later read resolves
    the discrepancy.
- Three consecutive post-deployment SSR reads were identical: Notino 8,686,
  Brasty 5,370, Flaconi 3,754, Cocolita 896, Drogeria.pl 862, Aelia.pl 1,471
  and Douglas 2,966, total 24,005. The same reads reported 11,122 catalog
  entries, all with an image, across 628 brands. These are live public counts,
  not generation accepted counts.
- Flaconi returned to the rail after an earlier pre-deployment read showed it
  absent. No import was started to create this read-only verification, and the
  application did not retain or invent expired DUO pricing.
- Five of five direct apex requests returned HTTP 200, but average response
  time was 11.69 seconds. Four production assets were byte-identical with the
  v195 build. Native post-publication logs contained no application exception
  or error payload. An errors-only filter returned three canceled technical
  `/api/search` reads and one verifier request to the nonexistent `/katalog`
  route that returned 404. All came from the deployment check, had
  `error=null`, and the 404 recorded worker outcome `ok`. This proves the
  deployed asset, not a fast apex. Do not call it fully stable or fast. Recheck
  `www` separately before changing its historical unresolved status.
- Current CJ discovery chooses the largest eligible feed from at most the first
  20 Product Feeds returned. Complete Notino and Brasty programme coverage is
  therefore not proven. The owner may provide a Product Feeds list/export with
  feed ID, name, country, language, currency, product count and update time.
  Never request or store the CJ token, an authenticated feed URL or a private
  raw feed in the repository.
- Do not start an import merely to observe v195. Let the ordinary schedule
  exercise it, then read the completed session, receipt, source counters,
  public offers and locks. Do not manually retry HTTP 429.
- The user explicitly requested consolidated report #011 after the work was
  complete. Report #011 was delivered to `support@perfumetr.pl` on 2026-08-31
  at 00:36:59 UTC; Gmail records both `SENT` and `INBOX`. Report #010 is the
  immediately previous delivered report and report #003 remains the visual
  template authority.
- Exact next task: observe the next ordinary full TradeDoubler cycle, then
  verify its session, receipt, D1 source rows, public counters and empty locks.
  Separately compare the official CJ Product Feeds inventory before making any
  source-discovery change. Do not weaken `perfume-v1`, exact GTIN,
  hidden-catalog or duplicate gates.

## Earlier Sites v183 marketing analytics continuity checkpoint

Verified approximately 2026-08-29 12:49 UTC.

- Sites v183 is live from source commit
  `985bd96d53ed7c6f274d0188cd92a3b1cd5ac3f9`; deployment
  `appgdep_6a92d4f7b0008191be0dab134b60d104` succeeded. It retains
  the v182 analytics core and exposes the same protected owner panel on the
  main domain.
- First-party analytics is consent-gated and records `entry`,
  `search_used`, `product_view` and server-authoritative `offer_click`.
  It retains all five supported UTM fields and first-touch landing across the
  public Perfumetr hosts.
- There was no existing GA4, Meta Pixel or TikTok Pixel identifier. None was
  fabricated or loaded. Do not enable any external tracker before consent.
- D1 now contains `marketing_session_limits`, `marketing_sessions` and
  `marketing_events` from migration
  `drizzle/0021_spicy_blue_blade.sql`.
- Aggregate results are available only through the protected owner route
  `https://perfumetr.pl/panel-opinii/marketing`. Raw events are not public.
  Production verification returned the code gate with HTTP 200 and no campaign
  data before login; cache and framing protections remained active.
- `/out/[offerId]` keeps the existing allowlisted affiliate redirect.
  Analytics is scheduled after the response, derives its price/store/product
  snapshot on the server and fails open.
- Automated verification: 71/71 tests, successful build/artifact validation,
  zero lint errors with three pre-existing warnings, and independent security
  GO.
- Production desktop QA campaign `qa_production_20260829` produced exactly
  `entry`, `search_used`, `product_view`, and `offer_click`; the clicked
  Aelia.pl offer continued to `visit.aelia.pl` without leaking UTM values.
  Treat this campaign as QA, not marketing performance.
- Do not claim an independent phone-sized production test yet. The available
  production browser had a fixed desktop viewport; repeat the same UTM funnel
  on a physical phone before marking mobile E2E passed.
- Public SSR after deployment: 25,721 offers, 11,499 catalog entries with
  images, 717 brands, seven stores.
- Current source truth remains: Flaconi generation 12 failed
  `feed_changed`, Notino generation 20 failed `pagination_incomplete`,
  Brasty generation 15 is safely `paused`, Douglas generation 3 is
  `completed`; `sync_locks` was empty before deployment.
- Latest Actions: #110 is the latest scheduled failure; #108 is the latest
  successful production partner cycle and latest full TradeDoubler; #102 is
  still the latest PR validation. No import or feed workflow was manually
  started for analytics.
- `perfumetr.pl` completed the live funnel. The `www` host is still pending
  and returns HTTP 502. Do not report it repaired.
- No report #011 and no partner message was sent.
- The next catalog-data task remains the read-only global duplicate/review
  audit. Do not alter `perfume-v1`, semantic conflict gates, bounded imports or
  affiliate integrations as part of analytics follow-up.

## Mandatory maintenance

After every important deployment or major production investigation, update both
`PROJECT_STATE.md` and this file before declaring the task complete. Record:

1. the UTC verification timestamp;
2. the confirmed state of every project area;
3. the exact verified `master` baseline and the continuity pull request;
4. important pull request numbers and their state;
5. the latest GitHub Actions run and the last full production importer run as
   separate facts;
6. the current Sites version, source commit and deployment state;
7. exact live-offer counts for every active store and their total;
8. the latest import result, including safe counters and source blockers;
9. what works, what does not work and what remains visually unverified;
10. completed work and test results;
11. any work still in progress, with its exact stage;
12. external blockers and ownership;
13. the exact next task;
14. the report number, recipient, delivery state and current user instruction.

Use only directly verified facts. Never present work in progress, an unverified
deployment or a launched workflow as completed.

## Immediate transfer trigger

If the user says that the conversation is lagging, asks to change chats or asks
for a message for the next chat, immediately return one complete paste-ready
handoff. Do not ask the user to summarize the conversation and do not split the
handoff across several messages.

The final handoff must be self-contained. Do not assume that the receiving chat
can see the old conversation, earlier tool output or memory.

Before writing the handoff, verify the current state directly when access is
available. If verification is blocked, state exactly which value is the latest
recorded value, when it was recorded and why it could not be rechecked. Never
fill a missing value by guessing.

## Verification order for the receiving chat

The handoff must tell the receiving chat to do all of the following before any
change:

1. use GitHub and Sites in read-only mode;
2. read `AGENTS.md`, `PROJECT_STATE.md`, `docs/ARCHITECTURE.md` and
   `docs/CHAT_CONTINUITY.md` from `GADOMM/Index`;
3. verify the current `master` commit;
4. verify the latest Actions run and the latest full production importer run;
5. verify the current Sites version, deployment, domains and SSL state;
6. compare production with the handoff;
7. report any mismatch to the user;
8. make no code, import, configuration or production change until the checks are
   complete.

## Earlier Sites v180 continuity checkpoint

Verified through approximately 2026-08-27 18:15 UTC for the completed catalog
recovery and Sites v180. Report #010 is the latest confirmed delivered report.

1. verified GitHub `master`:
   `c5f52143dcf9050e35350be31e6e51a7b5ac431d`;
2. full TradeDoubler run #93 completed successfully with Cocolita 886,
   Drogeria.pl 855 and Aelia.pl 1,461 live offers;
3. Douglas generation 3 is completed: 51,996 received, 4,032 accepted and
   live, 1,742 review and 46,222 excluded. Its logo and wordmark are directly
   verified in the public store rail;
4. isolated Flaconi run #6, ID `33102239793`, completed successfully with
   35,171 received, 3,756 imported and live, 1,344 review, 30,071 excluded,
   5,247 stored, automatic review 0 and maintenance processed 221;
5. final Notino run #101, ID `33102412389`, completed successfully with 5,333
   live, 663 review, 2,858 excluded, 3,619 imported, 10,240 stored, pending
   fresh 0 and automatic review 0;
6. Brasty is completed with 5,585 live offers and pending fresh 0;
7. the exact fresh live-offer total is 21,908. The public API reports 9,690
   catalog entries, all 9,690 with images, across 658 brands;
8. Sites v180 source commit is
   `0312176047d0098b737e9cdaea83d0843d4af246`;
9. v180 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_a9b91b18c0b88191b486650065006fbd`;
10. deployment `appgdep_6a907db645688191a1d3f659622e4f45` is
    `succeeded` with no failure message. Provider URL:
    `https://perfumetr.borodzicz85.chatgpt.site`;
11. v180 persists the EOF page before cleanup, advances three idempotent
    cleanup phases with lease heartbeats and durable paused checkpoints, and
    atomically writes final source `completed` plus programme registry `ready`;
12. build and artifact validation passed, the full suite passed 66/66, lint has
    zero errors with the same three existing warnings, and an independent
    final review returned GO;
13. production D1 reports all import-source rows `completed` with null error;
    `sync_locks` is empty, so no import or catalog lease remains active;
14. the provider URL and `beta.perfumetr.pl` returned HTTP 200. The apex
    `perfumetr.pl` returned 502 and then two consecutive 200 responses, so a
    first-request regression is not ruled out. `www.perfumetr.pl` consistently
    returned 502;
15. Parfumdreams PL is rejected by AWIN while its persisted registry row still
    shows the older applied state. Do not treat that row as current approval;
16. the global duplicate audit across published families and manual-review
    rows is incomplete. Preserve all GTIN, identity, hidden-catalog and
    `perfume-v1` gates;
17. report #010 was delivered to `support@perfumetr.pl`; Gmail records `SENT`
    and `INBOX` at 2026-08-27 01:08:03 UTC. Report #009 remains the previous
    delivered report, report #003 remains the visual template authority, and
    no report #011 was requested or sent;
18. no import, deployment or email delivery is in progress. The next data task
    is the read-only global duplicate and remaining manual-review audit,
    followed only by unambiguous bounded repairs.

Treat these as point-in-time facts. Recheck GitHub, Sites, D1, domains and
external programme state before another change.

## Earlier Sites v156 continuity checkpoint

Verified through 2026-08-25 21:38 UTC for the latest tester feedback and
Sites v156. Report #009 remains the latest confirmed delivered report.

1. verified `master` before this continuity pull request:
   `d14d218b578157d7235b0fbf0082d75bf0d0a7e0`;
2. the latest completed workflow is catalog run #77, ID `32898882767`,
   attempt 1, schedule, success from 21:03:22 to 21:17:50 UTC. Importer
   validation and the bounded partner orchestrator succeeded while the full
   TradeDoubler snapshot was correctly skipped;
3. run #72, ID `32800552146`, remains the latest full production
   TradeDoubler snapshot. GitHub Actions remains the only automatic scheduler;
4. Sites v156 source commit is
   `98eee0c3815049f8c04e9a5a00a13b62b398f9c0`;
5. v156 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_56ba63caa25c81919615ae4c0e83f2eb`;
6. deployment `appgdep_6a8e0a3699c48191b2264c499d021193` is
   `succeeded` with no failure message. Provider URL:
   `https://perfumetr.borodzicz85.chatgpt.site`;
7. the project is active and public, with current live URL
   `https://beta.perfumetr.pl`. `perfumetr.pl` and
   `beta.perfumetr.pl` have active provider and SSL status. The separate
   `www.perfumetr.pl` domain is newly pending provider validation and was not
   changed in this task;
8. the latest panel entry reports unreadable desktop catalog filter and
   price-sort text at `2560×1305`. It has one protected screenshot that was
   not copied from private R2 or opened outside the authenticated owner route;
9. the defect is confirmed from source and agent preview: filter choices were
   `9px`, headings `10px`, and the sort select plus native options
   `11px`. Contrast was adequate, so undersized typography was the exact
   cause;
10. v156 changes only desktop catalog text at `721px` and wider: sort and
    toolbar actions are `14px`, group headings `12px`, filter choices and
    brand suggestions `13px`, and the brand input `14px`;
11. no JSX, state, sorting logic, color, control height or mobile picker changed.
    Preview at `1363×936` confirmed the new computed values, no clipped
    filter labels and a working `price-asc` selection;
12. the targeted regression passes 1/1. Build and artifact validation pass, the
    full Sites suite passes 58/58, and lint has zero errors with the same three
    existing warnings;
13. direct production checks returned HTTP 200 for the provider URL and both
    production domains. Beta loads `/assets/index-CpZ4uGDw.css` and that
    stylesheet contains every corrected desktop rule;
14. the fresh production rail currently shows Aelia 1,397, Cocolita 874,
    Drogeria.pl 845, Notino 4,214 and Brasty 6,181, total 13,511. Flaconi is
    absent from the fresh rail; no feed, importer, D1, schedule or partner
    configuration change was authorized or made;
15. the feedback row remains `new` because the current owner panel exposes no
    supported status-transition action or API. No feedback was deleted;
16. no report was requested or sent for v156. After this documentation pull
    request merges, no work remains in progress. The exact next task is to read
    the next new or unresolved panel entry, reproduce any claimed defect on
    current production, and modify only a confirmed UI problem.

Treat this as dated evidence and recheck all unstable values before a new
change.

## Earlier Sites v146 continuity checkpoint

Verified through 2026-08-25 03:50 UTC for the catalog review reduction and
Sites v146. Report #009 remains the latest confirmed delivered report.

1. verified `master` before this continuity pull request:
   `13b8ec7c89c03626d4c71c61e83511965f41e9e5`;
2. PR #34 is merged as that commit and adds bounded automatic review handling
   for the official Flaconi feed. Importer validation passes 18/18;
3. catalog run #72, ID `32800552146`, attempt 1, push, completed successfully.
   It is the latest full TradeDoubler production snapshot;
4. scheduled run #67, ID `32777576698`, attempt 3, completed successfully.
   TradeDoubler was correctly skipped while Notino and Brasty finished with
   zero pending fresh offers;
5. isolated Flaconi run #4, ID `32800552050`, attempt 2, job `97677660697`,
   completed successfully at 03:48:35 UTC with no source error;
6. Sites v146 source commit is
   `f3031eeb6b124d8e568fa7bd804209ae6a0010d4`;
7. v146 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_eb1cd01923b481919c5a0701734ff163`;
8. deployment `appgdep_6a8d106a83848191ac8d0841b3ac7388` is
   `succeeded` with no failure message. Provider URL:
   `https://perfumetr.borodzicz85.chatgpt.site`;
9. both production domains have active provider and SSL status with no last
   error. The Sites project is active, public and owned by the current user;
10. build and artifact validation pass, the full Sites suite passes 53/53,
    lint has zero errors with three existing warnings, and the independent
    final code review found no blocker;
11. directly rendered live counts are Aelia 1,381, Cocolita 855, Drogeria.pl
    845, Notino 5,431, Brasty 6,180 and Flaconi 3,668, total 18,360;
12. this is a net gain of 3,027 fresh offers from the verified 15,333 baseline;
13. the full TradeDoubler snapshot scanned 27,811 Cocolita, 32,414
    Drogeria.pl and 8,545 Aelia provider products. The shared explicit proof
    diagnostic ended at 972 review candidates, down from about 10,001;
14. Notino now has 5,431 live offers and 144 review rows. Brasty has 6,180
    live offers and 125 review rows. Both have zero automatic review rows and
    zero pending fresh offers;
15. the first safe Flaconi maintenance pass recovered 2,660 historical
    `gtin_not_found` rows and left 93 semantic conflicts in review;
16. v146 attempted the remaining 386 eligible Flaconi rows. Seventy-five
    passed every identity and visibility gate and became live; 61 were stopped
    by stricter GTIN gates and 250 received terminal unresolved reasons, so
    none can cause an automatic loop;
17. final Flaconi state is completed: 34,597 received, 3,668 imported, 1,357
    review, 29,572 excluded, 5,128 stored, 3,668 live and zero automatic review
    rows;
18. a full post-run scan covered 5,128/5,128 rows, all with unique external
    IDs. Review reasons are exactly 1,002 `gtin_identity_conflict`, 105
    `semantic_gtin_conflict`, 249 `missing_audience_unresolved` and one
    `missing_line_unresolved`; every legacy nonterminal reason, `catalog_hidden`
    and every other review reason is zero;
19. all 136 audited recovery candidates were resolved: 75 became live and 61
    were correctly held by the GTIN gates, adding 49 identity and 12 semantic
    conflicts instead of blindly attaching an offer;
20. local Flaconi audience inference is restricted to nine audited word-bound
    signals. Sibling evidence requires the same official feed and generation,
    terminal AWIN family, exact raw brand, concentration and product type,
    identical normalized title stem, one unanimous visible audience and no
    repeated GTIN. Mixed evidence remains in review;
21. hidden variants, exact GTIN identity conflicts, semantic conflicts and
    duplicate evidence still block publication. Unknown stored shipping is
    preserved as unknown, never changed to zero;
22. two confirmed historical cross-product mappings remain quarantined with
    unavailable listings and invalid offers;
23. coupon refresh is completed with one active approved coupon and three
    rejected unapproved tracking URLs;
24. direct production HTML at 03:49 UTC returned HTTP 200 and showed Lattafa
    Khamrah EDP 100 ml, Drogeria.pl, four stores, 108.98 PLN and the complete
    six-store rail. There was no empty hero;
25. report #009 remains the latest confirmed delivered report. No report was
    requested or sent for this catalog task;
26. after the documentation pull request merges, no work remains in progress.
    Investigate remaining conflicts only with stronger official identity
    evidence and do not relax the production gates to chase a lower counter.

Treat this as dated evidence and recheck all unstable values before a new
change.

## Earlier Sites v140 continuity checkpoint

Verified at 2026-08-25 00:47 UTC for Sites v140 and the global offer-price
integrity correction. Report #009 remains the latest confirmed delivered
report.

1. verified `master` before this continuity pull request:
   `786844704f861fca0a9c0baa02cb17966a2d03a0`;
2. PR #32 is merged as that commit and records Sites v139;
3. the newest completed Actions run is `Perfumetr catalog feeds` run #69,
   ID `32793165028`, attempt 1, pull request, success. Importer validation
   succeeded and the production import job was skipped;
4. isolated Flaconi run #2, ID `32719777955`, attempt 26, job `97633299587`,
   remains the latest completed Flaconi generation. Run #55 remains the latest
   full TradeDoubler snapshot;
5. Sites v140 source commit is
   `b39cef8a5afdf11c0b12424d53250daace512ffc`;
6. v140 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_217c05ee1f8c8191a229531cdcbfb981`;
7. deployment `appgdep_6a8ce58741a88191b93d5a2f47f35a9a` is
   `succeeded` with no failure message. Provider URL:
   `https://perfumetr.borodzicz85.chatgpt.site`;
8. build and artifact validation pass, the full Sites suite passes 52/52 and
   lint has zero errors with three existing warnings;
9. the defect was global: offers with known delivery were always ranked before
   offers with unknown delivery, even if their visible amount was much higher;
10. SQL, the API builder, beta comparison, catalog detail and homepage now
    order by the lowest visible amount. A known final total wins only an exact
    visible-price tie;
11. when delivery is not verified, the UI shows `od`, names the amount as the
    product price and does not call it a final total or recommendation;
12. D1 now contains active, source-backed delivery rules for Cocolita and
    Drogeria.pl: DPD Pickup costs 7.99 PLN and is free from 159.00 PLN. The
    rules require re-verification after 30 days;
13. no ambiguous Aelia free-delivery threshold was guessed. Its unknown
    delivery remains explicit and cannot masquerade as a final total;
14. direct production HTML at 00:46 UTC returned HTTP 200 and showed Lattafa
    Khamrah EDP 100 ml, Drogeria.pl, three stores and 108.98 PLN together with
    delivery. The incorrect Brasty 162.38 PLN result disappeared;
15. current directly rendered counts remain Aelia 1,234, Cocolita 842,
    Drogeria.pl 841, Notino 5,363, Brasty 6,120 and Flaconi 933, total 15,333;
16. no import, source, mapping rule, scheduler or report was changed or started
    for v140;
17. report #009 remains the latest confirmed delivered report. No report was
    requested or sent for v140;
18. after the documentation pull request merges, no work remains in progress.
    Reverify the expiring delivery rules from official store sources and never
    turn an unknown delivery amount into a claimed checkout total.

Treat this as dated evidence and recheck all unstable values before a new
change.

## Earlier Sites v139 continuity checkpoint

Verified at 2026-08-25 00:18 UTC for Sites v139 and the new 24-hour homepage
cutout rotation. Report #009 remains the latest confirmed delivered report.

1. verified `master` before this continuity pull request:
   `79aa195b82c4f6229c34e00ef53dbb2e5e67cd3f`;
2. PR #31 is merged as that commit and safely paces consecutive Flaconi chunks
   by 12.5 seconds without changing other sources;
3. `Perfumetr catalog feeds` run #68, ID `32792155232`, pull request, completed
   successfully with importer tests 17/17 and its production job skipped;
4. the merge intentionally used the supported CI skip marker, so it did not
   run unrelated store imports;
5. isolated Flaconi run #2, ID `32719777955`, attempt 26, job `97633299587`,
   remains the latest completed Flaconi generation. Run #55 remains the latest
   full TradeDoubler snapshot;
6. Sites v139 source commit is
   `28c956a0d3f9f8f16ae2657142445b86d5cc782d`;
7. v139 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_e9671c30cc2c819194eace4ac4f2c061`;
8. deployment `appgdep_6a8cdeea96f88191ad385304c762d118` is
   `succeeded` with no failure message. Provider URL:
   `https://perfumetr.borodzicz85.chatgpt.site`;
9. build and artifact validation pass, the full Sites suite passes 50/50 and
   lint has zero errors with three existing warnings;
10. no browser QA was requested or run. A direct production HTML read of
    `perfumetr.pl` verified the changed elements;
11. the six locally reviewed transparent cutouts now share one 24-hour cycle,
    giving each bottle a four-hour slot;
12. the cycle starts with Lattafa Khamrah at 2026-08-25 00:00 UTC and repeats
    daily. The next cutout is selected directly from time and the reviewed
    manifest, without writing homepage rotation state to D1;
13. a temporarily unavailable scheduled product falls forward to the next
    reviewed cutout, preventing an empty hero or arbitrary feed photo;
14. production at 00:17 UTC showed Lattafa Khamrah EDP 100 ml, its reviewed
    transparent cutout, Brasty, three stores and a dynamic 162.38 PLN final
    price;
15. Flaconi appears in the accepted continuous store rail with 933 fresh
    offers. The rail reports six active stores;
16. current directly rendered counts are Aelia 1,234, Cocolita 842,
    Drogeria.pl 841, Notino 5,363, Brasty 6,120 and Flaconi 933, total 15,333;
17. Flaconi generation 2 remains completed with 34,597 received, 933 imported,
    4,092 review, 29,572 excluded and 5,128 stored products;
18. report #009 is still the latest confirmed delivered report. No report was
    requested or sent for v139;
19. after the documentation pull request merges, no import, Sites deployment
    or email remains in progress;
20. the next focused task is a read-only check after the first four-hour
    boundary to confirm the next reviewed bottle appears without an empty hero.
    Do not deploy if the timed transition works.

Treat this as dated evidence and recheck all unstable values before a new
change.

## Earlier Sites v138 continuity checkpoint

Verified from 2026-08-24 23:30 UTC through 2026-08-25 00:02 UTC for Sites v138,
the first complete official AWIN Flaconi generation and the follow-up pacing
fix. Report #009 is the latest confirmed delivered report.

1. verified `master` before the pacing continuity pull request:
   `d97eac6d122610e01e84acf42cf092fc04c349d1`;
2. Sites v138 source commit is
   `5ebfb1893e57a5d9cbd348967298417e61d945d1`;
3. v138 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_f56fc148ad548191a077e53116caa1a6`;
4. deployment `appgdep_6a8c469952d081919a75258f19cae3ed` is
   `succeeded` with no failure message;
5. v138 contains the official AWIN Flaconi CSV-gzip adapter, strict field
   mapping and bounded resumable import for advertiser 18563 and feed 37697;
6. the protected AWIN key is valid and encrypted in Sites. Never copy the key,
   ciphertext or keyed feed URL to GitHub, documentation or chat;
7. isolated workflow `Perfumetr Flaconi feed` run #2, ID `32719777955`,
   attempt 26, final job `97633299587`, completed successfully;
8. only `awin:flaconi` was advanced. No other store or TradeDoubler source was
   touched by this production import;
9. generation 2 is completed: 34,597 received, 933 imported, 4,092 review,
   29,572 excluded, 5,128 stored products and 933 live offers;
10. Flaconi is active and verified, its AWIN programme is approved and product
    status is ready;
11. Stronger With You EDT 50 ml, GTIN 3605522040281, is mapped to the existing
    variant with a fresh active Flaconi offer at 214.76 PLN and zero shipping;
12. the comparison is dynamic. No screenshot price or manual product JSON was
    inserted;
13. unchanged existing live counts are Aelia 1,234, Cocolita 843,
    Drogeria.pl 841, Notino 5,344 and Brasty 6,043. Together with Flaconi 933,
    the resulting total is 15,238;
14. public visual QA of the offer was not performed because the beta gate was
    active. Production D1 directly verified the offer, variant, affiliate URL,
    freshness, price and shipping;
15. the first full generation required isolated resumptions because Sites
    enforces 12 seconds between chunks and the GitHub client previously sent
    them immediately;
16. the follow-up client fix waits 12.5 seconds before consecutive Flaconi
    chunks, never retries HTTP 429 and does not change pacing for other sources;
17. syntax checks and the full importer suite pass 17/17, including a
    synthetic two-chunk Flaconi pacing test;
18. report #009 was sent to `support@perfumetr.pl` and confirmed in Sent. It
    covered the protected key handoff, v138 preparation and planned import;
19. no second report was requested or sent after completion;
20. after the continuity pull request merges, no import, Sites deployment or
    email remains in progress. Observe the next scheduled partner cycle once
    to prove the paced Flaconi refresh completes in one job.

Treat this as dated evidence and recheck all unstable values before a new
change.

## Earlier Sites v136 continuity checkpoint

Verified at 2026-08-24 11:57 UTC for Sites v136 and the focused cleanup of the
`Produkty i ceny` integration section. Report #008 was then the latest
confirmed delivered report.

1. verified `master` before this continuity pull request:
   `fb272af362f30263d004ef3ca888e29fe8f71135`;
2. PR #29 is merged as `fb272af362f30263d004ef3ca888e29fe8f71135`
   and records Sites v134, v135 and the authorized Flaconi feed check;
3. the newest scheduled partner workflow remains run #58, ID `32711816055`,
   attempt 1, schedule, success from 09:29:21 to 09:34:29 UTC;
4. run #53 attempt 8 remains the final completed CJ recovery generation. Run
   #55 remains the latest full TradeDoubler snapshot;
5. Sites v136 source commit is
   `d7bbc115a5717a1394a4e95fef7108b0ec62c087`;
6. v136 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_bd470fdd6bc4819191ef4bdbbd872673`;
7. deployment `appgdep_6a8c311d41588191a434e2bb64d0d70e` is
   `succeeded` with no failure message and was directly rechecked by the main
   agent. The provider URL is `https://perfumetr.borodzicz85.chatgpt.site`;
8. the pre-deployment Sites check confirmed an active public project and
   `https://beta.perfumetr.pl` as the live URL. The prior 11:29 UTC check of
   both custom domains recorded active domain, provider and SSL state with no
   error; v136 changed no domain configuration;
9. build and artifact validation pass, the full Sites suite passes 50/50 and
   lint has zero errors with three existing warnings;
10. no browser QA was run for v136. Rendered coverage asserts all six cards,
    and an independent read-only review found no blocker;
11. Cocolita, Drogeria.pl, Aelia.pl, Notino, Brasty and Flaconi each have one
    identically placed `Odśwież status` action;
12. every card uses only its existing safe GET endpoint. No client card sends
    POST or can start or advance an import;
13. all six cards poll every 30 seconds and use consistent loading, success and
    error feedback, `aria-busy` state, live announcements and collapsible
    details structure;
14. the Notino access diagnostic now starts in `idle`, so `Sprawdź dostęp` no
    longer remains disabled as `Sprawdzam…` before the first click;
15. a TradeDoubler status read is no longer blocked by an importer busy flag.
    A temporary panel read failure does not falsely turn an active offer badge
    red;
16. disconnecting an integration during a manual status read cannot leave its
    button stuck after reconnection;
17. v136 changed no importer route, source configuration, schema, scheduler,
    catalog mapping, offer, price or coupon data;
18. live counts therefore retain the verified baseline: Aelia 1,234, Cocolita
    843, Drogeria.pl 841, Notino 5,344 and Brasty 6,043, total 14,305;
19. run #58 partial review counters remain Notino 54 and Brasty 154. The prior
    completed generation ended with 297 true manual rows and zero automatic or
    pending-fresh work;
20. vouchers remain 4 received, 1 imported, 3 excluded and 1 active. The active
    coupon is not silently applied without structured owner confirmation;
21. Flaconi approval remains persisted, but generation 1 remains paused with
    `feed_not_found`, zero imported rows and no active Flaconi offer. The next
    data step still requires the separate protected AWIN Data Feed API key;
22. v133 catalog motion and matte glass, v134 network-card cleanup and v135
    scoped workflow trust remain deployed and unchanged by v136;
23. product ratings remain unpublished because no authoritative structured
    rating and review-count source has been verified;
24. report #008, dated 2026-08-24, was sent to `support@perfumetr.pl` at
    09:59 UTC and confirmed in Sent. No report was requested or sent for v136;
25. after this continuity pull request merges there is no Sites edit, importer
    run, deployment or email in progress. The next data task is to read Product
    Feed List after the protected Data Feed API key is saved, select advertiser
    18563 using its real format and locale, and continue the bounded official
    import.

Treat this as dated evidence and recheck all unstable values before a new
change.

## Earlier Sites v128 continuity checkpoint retained for history

Verified at 2026-08-22 17:20 UTC for Sites v128 and catalog recovery. This
checkpoint supersedes the lower v123 checkpoint retained for history.

1. verified `master` before continuity PR #22:
   `8eab30aac9d9209c3d73a19cfcddaa08ed6787ce`;
2. PR #20 and PR #21 are merged; PR #22 is the documentation-only continuity
   record for this checkpoint and its final state must be checked directly;
3. GitHub Actions run #47, ID `32581506389`, attempt 15, production job
   `97065393622`, completed successfully from 17:16:44 to 17:17:26 UTC;
4. attempt 15 reported no HTTP 429 or workflow error; run #28 remains the
   latest full TradeDoubler snapshot;
5. Sites v128 source commit is
   `7f4943aac6d4256faccb2f62ebb50f9bf56589d5`;
6. v128 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_54ab4c69fcac8191a673e5dccda17080`;
7. deployment `appgdep_6a89d93b1f988191886c838226132d0f` is
   `succeeded`;
8. the build passed, the full Sites suite passed 47/47, lint has zero errors
   and three existing warnings, and an independent review found no blocker;
9. the safe Notino coverage backlog fell from 1,381 to 0 and added 701 live
   offers;
10. final live counts are Aelia 1,185, Cocolita 830, Drogeria.pl 835,
    Notino 5,297 and Brasty 6,041, total 14,188;
11. Notino is completed with 209 review, 0 automatic and 0 pending fresh;
12. Brasty is completed with 220 review, 0 automatic and 0 pending fresh;
13. the remaining review cases are true manual cases and are not presented as
    safe automatic matches;
14. the exact homepage spotlight shows Notino, 5 stores, 217.40 PLN total and
    220.50 PLN saving for Stronger With You EDT 50 ml;
15. prices and offer details remain dynamic; no screenshot price or manual
    product JSON was inserted;
16. TradeDoubler vouchers remain 4 received, 4 excluded, 0 imported and 0
    active;
17. Flaconi remains externally blocked by
    `orchestrator_feed_not_found`;
18. report #006 remains the latest confirmed delivered report; no report was
    sent for this work;
19. there is no code change, import, deployment, pull request merge or email
    delivery in progress except the documentation-only PR #22 until its final
    state is confirmed;
20. the next time-based task is the read-only homepage rotation check after
    2026-08-23 09:20 UTC.

Treat this as dated evidence and recheck all unstable values before a new
change.

## Latest paste-ready handoff baseline

```text
KONTYNUUJEMY PROJEKT PERFUMETR

Nie zakładaj, że widzisz historię poprzedniego czatu.

Najpierw niczego nie zmieniaj. Użyj GitHuba i Sites wyłącznie do odczytu.
Przeczytaj w GADOMM/Index:
AGENTS.md
PROJECT_STATE.md
docs/ARCHITECTURE.md
docs/CHAT_CONTINUITY.md

Następnie sprawdź aktualny master, najnowszy GitHub Actions run, ostatni pełny
TradeDoubler, bieżącą wersję i wdrożenie Sites, D1, domeny oraz produkcję.
Jeżeli wystąpi rozbieżność, najpierw opisz ją użytkownikowi. Nie zmieniaj kodu,
importera, konfiguracji ani produkcji przed zakończeniem kontroli.

CZAS WERYFIKACJI
Około 27 sierpnia 2026, 18:15 UTC.

GITHUB I WORKFLOW
Zweryfikowany master:
c5f52143dcf9050e35350be31e6e51a7b5ac431d
Pełny TradeDoubler run #93 zakończył się sukcesem: Cocolita 886,
Drogeria.pl 855 i Aelia.pl 1461 aktywnych ofert.
Izolowany Flaconi run #6, ID 33102239793, zakończył się sukcesem.
Końcowy Notino run #101, ID 33102412389, zakończył się sukcesem.
GitHub Actions pozostaje jedynym automatycznym harmonogramem.

SITES
Wersja v180.
Commit: 0312176047d0098b737e9cdaea83d0843d4af246
Version ID:
appgprj_6a8236775b808191b6b4979c4d86d889~appgver_a9b91b18c0b88191b486650065006fbd
Deployment: appgdep_6a907db645688191a1d3f659622e4f45
Status: succeeded, brak failure message.
Provider URL: https://perfumetr.borodzicz85.chatgpt.site
Build i walidacja artefaktu przeszły. Pełny suite 66/66. Lint: 0 błędów i
3 istniejące ostrzeżenia. Niezależna kontrola końcowa: GO.

V180 I BEZPIECZNE DOMKNIĘCIE FEEDU
Ostatnia strona EOF jest najpierw trwale zapisywana razem z kursorem i
fingerprintem. Trzy idempotentne fazy cleanup działają osobno, odnawiają lease
i pozostawiają źródło na trwałym paused checkpoint, więc przerwany cykl może
bezpiecznie powtórzyć cleanup bez ponownego zapisu strony. Dopiero po wszystkich cleanupach jedna transakcja
ustawia źródło completed, czyści error i przywraca registry ready.
Nie omijaj tego mechanizmu i nie przedłużaj ręcznie lease.

OFERTY
Cocolita: 886 live.
Drogeria.pl: 855 live.
Aelia.pl: 1461 live.
Douglas PL generation 3: completed, 51996 received, 4032 accepted i live,
1742 review, 46222 excluded. Logo i wordmark Douglas są potwierdzone na
publicznym pasku sklepów.
Flaconi run #6: completed, 35171 received, 3756 imported i live, 1344 review,
30071 excluded, 5247 stored, automatic review 0, maintenance processed 221.
Notino run #101: completed, 5333 live, 663 review, 2858 excluded, 3619
imported, 10240 stored, pending fresh 0, automatic review 0.
Brasty: completed, 5585 live, pending fresh 0.
Łącznie: dokładnie 21908 świeżych aktywnych ofert.
Publiczne statystyki API: 9690 pozycji katalogu, wszystkie 9690 ze zdjęciem,
658 marek.

D1 I BLOKADY
Wszystkie wiersze import sources mają completed i error null. sync_locks jest
puste. Nie trwa import ani blokada katalogu.
Parfumdreams PL zostało odrzucone przez AWIN, ale registry nadal pokazuje stary
stan applied. To rozbieżność rejestru, nie aktywna akceptacja.
Globalny audyt duplikatów opublikowanych rodzin i manual review nie jest
ukończony. Nie osłabiaj GTIN, identity, hidden catalog ani perfume-v1, żeby
zwiększyć licznik.

DOMENY
Provider i beta.perfumetr.pl odpowiadały 200.
perfumetr.pl zwrócił 502, a potem dwa razy 200. Nie przedstawiaj problemu
pierwszego wejścia jako całkowicie wykluczonego.
www.perfumetr.pl stale zwraca 502 i pozostaje nierozwiązane.

RAPORT
Raport #010 został dostarczony na support@perfumetr.pl. Gmail potwierdza SENT
i INBOX 27 sierpnia 2026 o 01:08:03 UTC. Raport #009 jest poprzednim
dostarczonym raportem, a #003 pozostaje wzorem wizualnym. Raport #011 nie został
zamówiony ani wysłany.

PRACA W TOKU I NASTĘPNE ZADANIE
Nie trwa import, wdrożenie ani wysyłka maila. Następne zadanie to odczytowy,
globalny audyt potencjalnych duplikatów oraz pozostałych przypadków manual
review. Automatycznie naprawiaj wyłącznie przypadki jednoznaczne; konflikty
GTIN, koncentracji, odbiorcy, typu, pojemności i tożsamości pozostaw do kontroli.

Najpierw potwierdź użytkownikowi rzeczywisty stan i każdą rozbieżność. Dopiero
potem kontynuuj pracę.
```

## Earlier Sites v136 paste-ready handoff baseline

```text
KONTYNUUJEMY PROJEKT PERFUMETR

Nie zakładaj, że widzisz historię poprzedniego czatu.

Najpierw niczego nie zmieniaj. Użyj GitHuba i Sites wyłącznie do odczytu.
Przeczytaj w GADOMM/Index:
AGENTS.md
PROJECT_STATE.md
docs/ARCHITECTURE.md
docs/CHAT_CONTINUITY.md

Następnie sprawdź aktualny master, najnowszy GitHub Actions run, ostatni pełny
TradeDoubler, bieżącą wersję i wdrożenie Sites, domeny perfumetr.pl i
beta.perfumetr.pl oraz produkcję. Jeżeli wystąpi rozbieżność, najpierw opisz ją
użytkownikowi. Nie zmieniaj kodu, importera, konfiguracji ani produkcji przed
zakończeniem kontroli.

CZAS WERYFIKACJI
24 sierpnia 2026, 11:57 UTC.

GITHUB
Master przed dokumentacyjnym PR:
fb272af362f30263d004ef3ca888e29fe8f71135
PR #27 jest scalony jako 3092cd09d80080acb4fc450fe5461b3f932d3673.
PR #28 jest scalony jako 12bc37c2c2e8fbe2a0788a55923342eb4fc39242
i dodaje tylko ograniczony workflow Flaconi bez harmonogramu, uruchamiany przy
push i ręcznie.
PR #29 jest scalony jako fb272af362f30263d004ef3ca888e29fe8f71135 i
zapisuje Sites v134, v135 oraz kontrolę feedu Flaconi.
Workflow Perfumetr Flaconi feed run #1, ID 32719672617, przeszedł walidację
16/16; import był poprawnie pominięty dla PR.
Run #2, ID 32719777955, attempt 1 nie dotarł do AWIN. Sites odrzuciło nową
tożsamość workflow kodem orchestrator_404.
Po Sites v135 run #2 attempt 2, job 97413228339, success,
11:20:17–11:20:35 UTC, przeszedł OIDC, dotarł do AWIN i zakończył się
obsługiwanym blockerem orchestrator_feed_not_found przed skanowaniem.
Najnowszy zaplanowany cykl partnerski pozostaje run #58. Run #55 pozostaje
ostatnim pełnym TradeDoublerem. GitHub Actions jest jedynym automatycznym
harmonogramem.

SITES
Wersja v136.
Commit: d7bbc115a5717a1394a4e95fef7108b0ec62c087
Version ID:
appgprj_6a8236775b808191b6b4979c4d86d889~appgver_bd470fdd6bc4819191ef4bdbbd872673
Deployment: appgdep_6a8c311d41588191a434e2bb64d0d70e
Status wdrożenia: succeeded, brak failure message.
Provider URL: https://perfumetr.borodzicz85.chatgpt.site
Live URL: https://beta.perfumetr.pl
Projekt jest aktywny i publiczny. Poprzednia kontrola obu domen potwierdziła
aktywną domenę, provider i SSL bez błędu, a v136 nie zmieniło konfiguracji
domen. Build i artefakt działają, testy 50/50, lint ma 0 błędów i 3 wcześniejsze
ostrzeżenia. Nie wykonano przeglądarkowego QA v136.

PANEL INTEGRACJI
TradeDoubler, AWIN i CJ mają teraz te same pola Połączenie, Programy, Katalogi
i Promocje oraz ten sam przycisk odświeżenia. Promocje i kupony są wspólne dla
sieci. AWIN SSR czyta zapisany rejestr programów, więc 1 z 5 nie znika po
odświeżeniu. Zwykły odczyt panelu nie uruchamia importu.
Sites v135 ufa dokładnie flaconi.yml tylko w catalog orchestratorze. Workflow
Flaconi nie ma dostępu do mostu TradeDoubler.
Sites v136 porządkuje sekcję Produkty i ceny. Wszystkie sześć kart ma jeden
przycisk Odśwież status, polling co 30 sekund, te same stany ładowania i błędu
oraz tę samą zwijaną strukturę szczegółów. Każdy przycisk używa wyłącznie
bezpiecznego GET. Karty nie wysyłają POST i nie uruchamiają importu. Diagnostyka
Notino startuje w stanie idle, więc Sprawdź dostęp nie pozostaje zablokowane.
Chwilowy błąd odczytu panelu nie udaje awarii aktywnych ofert.

FLACONI
D1 trwale potwierdza advertiser 18563 jako approved. Decyzję zapisano o
10:19:17 UTC, a najnowsza kontrola jest z 11:20:30 UTC. Wcześniejsze 0 z 5 było
błędem UI, nie utratą akceptacji.
Po pełnej godzinie propagacji oficjalny oczekiwany Enhanced endpoint nadal
zwrócił feed_not_found. Generacja 1 jest paused, liczniki received, accepted,
review i rejected wynoszą 0. Nie istnieje jeszcze merchant ani oferta Flaconi.
Nie ma skonfigurowanego statusu data_feed_api_key. Właściciel musi zapisać
osobny Feed API Key w chronionym polu integracji, nigdy w czacie ani GitHubie.
Następnie trzeba odczytać Product Feed List i użyć rzeczywistego formatu,
Feed ID oraz locale dla reklamodawcy 18563, bez zgadywania.
Flaconi jest już obsługiwane w rejestrze sklepów i ogólnych powierzchniach
ofert. Pojawi się dynamicznie w pasku dopiero po powstaniu zweryfikowanych,
świeżych ofert. Nie dodawaj go statycznie.

OFERTY I IMPORTER
Ostatni zweryfikowany baseline pozostaje bez zmian: Aelia 1234, Cocolita 843,
Drogeria.pl 841, Notino 5344 i Brasty 6043, razem 14305 aktywnych ofert.
Run #58 ma częściowe review 54 dla Notino i 154 dla Brasty. Poprzednia
zakończona generacja miała 297 prawdziwych przypadków ręcznych.

KUPONY I RAPORT
Kupony: 4 odebrane, 1 zaimportowany, 3 wykluczone, 1 aktywny. Aktywny kupon nie
jest po cichu uwzględniany bez strukturalnego potwierdzenia właściciela.
Raport #008 z 24 sierpnia 2026 został wysłany o 09:59 UTC na
support@perfumetr.pl i potwierdzony w folderze Wysłane. Nie wysłano nowego
raportu dla v134, v135, v136 ani dla tej kontroli feedu.

PRACA W TOKU I NASTĘPNE ZADANIE
Po scaleniu dokumentacyjnego PR nie trwa edycja Sites, import, wdrożenie ani
wysyłka e-maila. Następnym potwierdzonym krokiem jest zapisanie przez właściciela
osobnego Feed API Key w chronionym panelu. Po jego zapisaniu odczytaj Product
Feed List, wybierz reklamodawcę 18563 według realnego formatu i locale, a
następnie kontynuuj ograniczony oficjalny import. Nie przedstawiaj Flaconi jako
aktywnego sklepu przed realnymi ofertami.
```

## Earlier Sites v128 paste-ready handoff baseline retained for history

```text
KONTYNUUJEMY PROJEKT PERFUMETR

Nie zakładaj, że widzisz historię poprzedniego czatu.

Najpierw niczego nie zmieniaj. Użyj GitHuba i Sites wyłącznie do odczytu.
Przeczytaj w GADOMM/Index:
AGENTS.md
PROJECT_STATE.md
docs/ARCHITECTURE.md
docs/CHAT_CONTINUITY.md

Następnie sprawdź aktualny master, najnowszy GitHub Actions run, ostatni pełny
TradeDoubler, bieżącą wersję i wdrożenie Sites, domeny perfumetr.pl i
beta.perfumetr.pl oraz produkcję. Jeżeli wystąpi rozbieżność, najpierw opisz ją
użytkownikowi. Nie zmieniaj kodu, importera, konfiguracji ani produkcji przed
zakończeniem tej kontroli.

CZAS WERYFIKACJI
22 sierpnia 2026, 17:20 UTC.

GITHUB
Master przed PR #22:
8eab30aac9d9209c3d73a19cfcddaa08ed6787ce
PR #20 i #21 są scalone. PR #22 zapisuje ten stan i trzeba sprawdzić jego
ostateczny CI oraz merge.
Najnowszy cykl: run #47, ID 32581506389, attempt 15, job 97065393622,
success, 17:16:44–17:17:26 UTC. Nie wystąpił HTTP 429.
Ostatni pełny TradeDoubler: run #28, ID 32497431067, attempt 3.
GitHub Actions jest jedynym automatycznym harmonogramem.

SITES
Wersja v128.
Commit: 7f4943aac6d4256faccb2f62ebb50f9bf56589d5
Version ID:
appgprj_6a8236775b808191b6b4979c4d86d889~appgver_54ab4c69fcac8191a673e5dccda17080
Deployment: appgdep_6a89d93b1f988191886c838226132d0f
Status: succeeded.
Provider URL: https://perfumetr.borodzicz85.chatgpt.site
Build działa, testy 47/47, lint 0 błędów i 3 wcześniejsze ostrzeżenia.
Obie domeny zachowują poprzedni aktywny stan; sprawdź go ponownie przed zmianą.

AUTOMATYZACJA KATALOGU
Importer używa oficjalnych danych dostawców. Nie dodano ręcznego JSON ani ceny
ze zrzutu. Bezpieczne mapowanie wymaga jednoznacznego pełnego GTIN. Stare
oferty są odświeżane przez oficjalne zapytanie po ID produktu. Audyt pokrycia
szuka brakujących ofert tylko dla zweryfikowanych wariantów z aktywną ofertą
innego zweryfikowanego sklepu. GitHub opróżnia ograniczone paczki i zatrzymuje
się przy braku postępu, błędzie, cooldownie, busy albo limicie 48 kroków.
Konflikty po świeżym odczycie przechodzą do prawdziwej ręcznej kontroli i nie
zapętlają automatu.

WYNIK
Aelia: 1185 aktywnych ofert.
Cocolita: 830.
Drogeria.pl: 835.
Notino: 5297, review 209, automatic 0, pending fresh 0.
Brasty: 6041, review 220, automatic 0, pending fresh 0.
Łącznie: 14188.
Backlog pokrycia Notino spadł z 1381 do 0, a Notino zyskało 701 ofert.
Pozostałe review to rzeczywiste przypadki ręczne, nie bezpieczne automatyczne
dopasowania.
Kupony: 4 odebrane, 4 wykluczone, 0 aktywnych.
Flaconi: zewnętrzna blokada orchestrator_feed_not_found.

STRONA GŁÓWNA
Bezpośrednia kontrola po attempt 15: HTTP 200, Stronger With You EDT 50 ml,
Notino, 5 sklepów, 217,40 zł łącznie i 220,50 zł oszczędności. Dane są
dynamiczne z D1. Cena ze zrzutu nie została wpisana na stałe.

PRACA W TOKU
Brak po scaleniu dokumentacyjnego PR #22. Nie ma edycji, importu, wdrożenia ani
wysyłki e-mail.

NASTĘPNE ZADANIE CZASOWE
Po 23 sierpnia 2026 o 09:20 UTC wyłącznie odczytowo sprawdź, czy czasowy
spotlight wygasł, wróciła zwykła pięciodniowa rotacja, oferta jest dynamiczna i
nie ma pustego ani starego hero. Nie wdrażaj niczego, jeśli powrót zadziałał.

RAPORTY
Raport #006 pozostaje ostatnim potwierdzonym. Dla tej pracy nie wysłano raportu.
Nie wysyłaj kolejnego bez wyraźnego polecenia użytkownika. Przed raportem
sprawdź Wysłane i odwzoruj dokładnie szablon raportu #003.

Najpierw krótko potwierdź użytkownikowi rzeczywisty odczytany stan i każdą
rozbieżność. Dopiero potem wykonuj następne konkretne zadanie.
```

## Earlier continuity checkpoint retained for history

Verified at 2026-08-22 13:44 UTC for Sites v123; continuity pull request
`#20` records this checkpoint:

1. `master` before PR #20 was
   `aaec7bbe009426f98d922d2356b027d4650b66c2`;
2. pull requests `#12` through `#19` are merged; PR #20 is the
   documentation-only v123 continuity record and its live state must be checked;
3. latest Actions run before this continuity PR is number `43`, ID
   `32565560052`, attempt `1`, pull-request validation, conclusion
   `success`;
4. run 43 passed importer validation `14/14` and skipped production import;
5. latest scheduled production partner cycle remains run `41`, ID
   `32563903356`, attempt `1`, successful from 09:03:07 to 09:07:08 UTC;
6. run 41 skipped the full TradeDoubler snapshot and advanced partner sources;
   latest full TradeDoubler remains run `28`, ID `32497431067`, attempt
   `3`;
7. the latest verified live-offer counters remain Aelia `1,049`, Cocolita
   `793`, Drogeria.pl `814`, Notino `4,422` and Brasty `1,092`,
   total `8,170`;
8. Notino remains completed in run 41 and Brasty remains paused incomplete;
9. TradeDoubler vouchers remain 4 received, 4 excluded, 0 imported and
   0 active coupons;
10. AWIN Flaconi remains externally blocked by
    `orchestrator_feed_not_found`;
11. Sites v123 is deployed from source commit
    `9333dfcbcb02bdb172908b2c9bb7191e369f3b9d`;
12. v123 version ID is
    `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_8168714f30308191bec15294142b87e9`;
13. v123 deployment ID is `appgdep_6a89a78633c88191b681c5d81d89dda8`
    and its directly rechecked status is `succeeded`;
14. the provider URL remains
    `https://perfumetr.borodzicz85.chatgpt.site`;
15. Sites reports version `123`, the project is active and public, and
    `https://beta.perfumetr.pl` is the current live URL;
16. `perfumetr.pl` and `beta.perfumetr.pl` retain active domain, provider
    and SSL state;
17. the production build passed, the full Sites suite passed `47/47`, and
    lint has zero errors with three existing warnings;
18. the active Stronger With You spotlight still reads Brasty, 4 stores and
    239.74 PLN for the 50 ml EDT variant;
19. the homepage now displays `pojemność 50 ml` instead of the negligible
    `oszczędzasz 0,08 zł · −0%`;
20. savings are shown in the hero only when they are at least 5 PLN and 2%;
21. meaningful discounts remain visible and the price, merchant, store count,
    delivery and coupon effects remain dynamic;
22. the Stronger With You spotlight interval, fallback and saved five-day
    rotation were not changed;
23. the beta, search, catalog, filters, store rail, footer and integrations
    panel were not changed in v123;
24. no importer, schema, schedule, source or domain configuration changed in
    v123;
25. report `#006`, dated 2026-08-22, remains the latest confirmed delivered
    report;
26. no report was sent for v122 or v123, following the user's daily-report
    policy;
27. no code change, import, Sites deployment or email delivery is currently in
    progress;
28. the exact next task is to verify after 2026-08-23 09:20 UTC that the normal
    homepage rotation resumed, or before then respond to concrete tester
    feedback or the user's next targeted visual request.

Treat this checkpoint as dated evidence, not as a substitute for a fresh GitHub
and Sites check.

## Earlier paste-ready handoff baseline retained for history

When the transfer trigger occurs, first refresh every unstable value. Then
return one self-contained Polish message using the following baseline and
include any newer verified facts:

```text
Kontynuujemy projekt Perfumetr z poprzedniego czatu. Nie zakładaj, że widzisz
jego historię.

Najpierw niczego nie zmieniaj. Użyj GitHuba i Sites wyłącznie do odczytu.
Przeczytaj w repozytorium GADOMM/Index:
AGENTS.md
PROJECT_STATE.md
docs/ARCHITECTURE.md
docs/CHAT_CONTINUITY.md

Następnie sprawdź aktualny commit gałęzi master, najnowszy przebieg GitHub
Actions, ostatni pełny produkcyjny import, aktualną wersję i wdrożenie Sites
oraz stan domen perfumetr.pl i beta.perfumetr.pl. Porównaj je z poniższym
przekazaniem. Jeżeli wystąpi rozbieżność, najpierw ją opisz. Nie zmieniaj kodu,
importera, konfiguracji ani produkcji przed zakończeniem tej weryfikacji.

CZAS OSTATNIEJ WERYFIKACJI
2026-08-22 13:44 UTC

REPOZYTORIUM I CI
Master przed PR #20: aaec7bbe009426f98d922d2356b027d4650b66c2.
PR #20 zapisuje wdrożenie Sites v123; jego aktualny stan trzeba sprawdzić.
Ważne PR-y #12–#19 są scalone.
Najnowszy Actions: run #43, ID 32565560052, attempt 1, pull_request, success.
Walidacja importera przeszła, a import produkcyjny został pominięty.
Ostatni produkcyjny cykl partnerski: run #41, ID 32563903356, attempt 1,
schedule, success, 2026-08-22 09:03:07–09:07:08 UTC. Pełny TradeDoubler został
pominięty, a źródła partnerskie przesunięte.
Ostatni pełny TradeDoubler: run #28, ID 32497431067, attempt 3, success.
GitHub Actions jest jedynym automatycznym harmonogramem.

SITES I DOMENY
Projekt Perfumetr jest aktywny i publiczny.
Aktualna wersja: v123.
Commit źródłowy: 9333dfcbcb02bdb172908b2c9bb7191e369f3b9d.
Version ID:
appgprj_6a8236775b808191b6b4979c4d86d889~appgver_8168714f30308191bec15294142b87e9
Deployment: appgdep_6a89a78633c88191b681c5d81d89dda8, succeeded.
Testy: 47/47; lint: 0 błędów i 3 istniejące ostrzeżenia.
Provider URL: https://perfumetr.borodzicz85.chatgpt.site
Sites live URL: https://beta.perfumetr.pl
perfumetr.pl i beta.perfumetr.pl: aktywna domena, provider i SSL, bez błędu.

IMPORTER I OFERTY
Aelia: 1049 aktywnych ofert.
Cocolita: 793 aktywne oferty.
Drogeria.pl: 814 aktywnych ofert.
Notino: 4422 aktywne oferty; run #41 zakończony: 7005 odebranych, 3776
zaimportowanych, 445 review, 2784 wykluczone, 8291 zapisanych.
Brasty: 1092 aktywne oferty; run #41 nieukończony i wstrzymany po ograniczonym
cyklu: 9540 odebranych, 1514 zaimportowanych, 7885 review, 141 wykluczonych,
6582 zapisane. Nie przedstawiaj tego jako pełnego zakończonego odświeżenia.
Łącznie: 8170 aktywnych ofert.
Kupony TradeDoubler: 4 odebrane, 4 wykluczone, 0 zaimportowanych, 0 aktywnych.
Flaconi: zewnętrzna blokada orchestrator_feed_not_found.
Nie traktuj ograniczonych proof importów jako wielkości pełnego feedu.

STAN WSZYSTKICH ELEMENTÓW
Repozytorium i CI działają. Sites v123 działa. Importer i harmonogram nie były
zmieniane w v123. Pięć źródeł ma aktywne oferty; Flaconi jest zewnętrznie
zablokowane. Strona główna ma czasowy spotlight Stronger With You i pokazuje
pojemność 50 ml zamiast symbolicznej oszczędności 0,08 zł. Strona beta,
wyszukiwarka, katalog, filtry, pasek pięciu sklepów, licznik sklepów, stopka i
panel integracji zachowują stan v121. Obie domeny i SSL są aktywne. Feedback
testerów może nadejść i nie został jeszcze przeanalizowany.

OSTATNIO ZAKOŃCZONA PRACA
Sites v123 usuwa odstraszający komunikat „oszczędzasz 0,08 zł · −0%” z hero.
Oszczędność jest teraz pokazywana tylko od 5 zł i 2%. Przy mniejszej różnicy
trzecia metryka pokazuje pojemność flakonu, obecnie 50 ml. Stronger With You,
Brasty, 4 sklepy, cena 239,74 zł, czas spotlightu i dynamiczne dane pozostały
bez zmian. Produkcja odpowiada HTTP 200, testy przeszły 47/47, a wdrożenie v123
ma status succeeded.

CO NIE DZIAŁA LUB POZOSTAJE ZEWNĘTRZNE
AWIN Flaconi czeka na aktywację feedu po stronie zewnętrznego partnera.
Bieżąca generacja Brasty w run #41 jest incomplete i ma być kontynuowana przez
kolejny zaplanowany cykl. Subiektywny feedback nowych testerów nie został
jeszcze zebrany.

PRACA W TOKU
Brak.

DOKŁADNE NASTĘPNE ZADANIE
Po 23 sierpnia 2026 o 09:20 UTC potwierdzić, że wróciła zwykła rotacja strony
głównej. Wcześniej reagować wyłącznie na konkretny feedback testerów lub kolejną
precyzyjną prośbę wizualną użytkownika.

RAPORTY
Raport #006 z 2026-08-22 jest ostatnim potwierdzonym raportem. Dla v122 ani v123 nie
wysłano raportu. Nie wysyłaj raportu automatycznie po każdym wizualnym
wdrożeniu. Użytkownik poprosi o jeden raport po zakończeniu dnia.
Przed wysłaniem odczytaj raport #003 z Wysłanych i odwzoruj dokładnie jego
szablon, wordmark, układ, typografię, logo i stopkę. Sprawdź ostatni faktycznie
dostarczony numer przed nadaniem kolejnego. Raport wysyłaj wyłącznie na
support@perfumetr.pl, chyba że użytkownik jawnie zmieni odbiorcę.

Wymagana stopka:
Pozdrawiamy,
Zespół Perfumetr
Ten sam zapach. Różne ceny.
perfumetr.pl
support@perfumetr.pl

Najpierw potwierdź użytkownikowi, co odczytałeś i jaki jest rzeczywisty stan.
Dopiero potem przejdź do następnego zadania.
```

If work is in progress when the handoff is requested, replace the `Brak`
statement with its exact unfinished state: files changed, tests run, deployment
status and next safe verification step. Never present unfinished or unverified
work as complete.

## Report delivery rules

The current user instruction supersedes the earlier automatic
per-deployment-email rule.

1. Do not send a report merely because a visual deployment completed.
2. Wait for the user to explicitly request the consolidated report, normally
   after the workday.
3. Before composing it, retrieve delivered report `#003` from Sent and use
   that exact visual template. Preserve its wordmark, spacing, typography,
   colors, content structure, inline Perfumetr logo and approved footer.
4. Verify the latest delivered report number in Sent immediately before
   assigning the next number.
5. Send only to `support@perfumetr.pl` unless the user explicitly changes the
   recipient.
6. Record `sent` only after delivery is confirmed. Otherwise use `deferred`,
   `pending` or `not required`.
7. Report `#011`, dated 2026-08-31, is the latest confirmed delivered report.
   Gmail records `SENT` and `INBOX` at 2026-08-31 00:36:59 UTC. It covers
   marketing analytics, audited catalog identity and freshness, the v184-v194
   safety baseline and the Sites v195 atomic TradeDoubler rollout. Report
   `#010` is the immediately previous delivered report, and report `#003`
   remains the visual template authority. If the sequence remains unchanged
   and the user explicitly requests another report, the next number is `#012`.
8. Never put credentials, provider payloads or private mailbox content into the
   repository.

Required footer:

Pozdrawiamy,
Zespół Perfumetr
Ten sam zapach. Różne ceny.
perfumetr.pl
support@perfumetr.pl

## When GitHub and Sites disagree

Stop before deployment. Verify both sides directly. A GitHub script can be
correct while the required Sites endpoint is absent, and a successful import
can still be hidden by separate public-catalog rules. Update the continuity
files only after the mismatch is understood.

## Information that must never enter a handoff

Never store tokens, passwords, provider download URLs, OIDC assertions, browser
tickets, administrator cookies, private provider payloads or copied mailbox
content. Use safe error codes and authorized dashboard links instead.
