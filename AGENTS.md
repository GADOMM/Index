# Perfumetr importer agent rules

These rules apply to every agent or chat working in this repository.

## Start here

1. Read `PROJECT_STATE.md`, `docs/ARCHITECTURE.md` and
   `docs/CHAT_CONTINUITY.md` before changing code.
2. Verify the current GitHub `master` commit and the last Actions result. Do not
   assume a status copied from an older chat is still current.
3. Check whether the matching Sites contract has already been deployed. A
   GitHub contract change must never be published first.

## Non-negotiable safety rules

1. Never commit or print TradeDoubler, AWIN, CJ, OIDC or bridge credentials.
2. Never commit raw provider payloads, redirect URLs containing tokens, browser
   tickets, administrator cookies or personal email content.
3. Use only synthetic fixtures in tests.
4. Do not replace an official feed with manually prepared JSON.
5. Preserve the distinction between raw provider records and accepted perfume
   records in every snapshot and report.
6. Treat unknown payload shapes, source identities, domains and currencies as
   failures. Do not guess feed identifiers.
7. Do not retry provider HTTP 429 downloads manually. Record the safe code and
   wait for the provider window or the scheduled retry.
8. Keep actions pinned to full commit SHAs and keep checkout credentials
   disabled.

## Coordinated deployment

For a contract change:

1. deploy a backwards-compatible Sites endpoint;
2. verify it directly;
3. publish the GitHub change through a pull request;
4. verify CI and the bounded live proof;
5. verify the full import only when provider quotas allow;
6. remove the old contract only in a later deployment.

The existing path `.github/workflows/tradedoubler.yml` and OIDC audience
`perfumetr-tradedoubler-bridge` must remain until Sites explicitly accepts a new
path and audience.

## Verification

Run `npm test` for every code change. New source adapters require tests for:

1. correct source identity, program and domain;
2. malformed and ambiguous responses;
3. secret redaction;
4. source-level failure isolation;
5. raw and accepted product counts;
6. resumable and idempotent snapshot behavior;
7. classifier false positives and false negatives.

No live workflow is authorized merely by editing this repository. A live run
must remain within the user's current authorization and provider quota.

## Handoff and reports

After every important deployment or major production investigation, update both
`PROJECT_STATE.md` and `docs/CHAT_CONTINUITY.md`. Record the UTC timestamp,
current `master` baseline, important pull requests, latest Actions run, last
production importer run, Sites version and deployment, exact offer counts,
tests, completed work, work still in progress, what works, what does not work,
external blockers, report-delivery state and the exact next task. Never put
secrets in either file and never present unfinished work as completed.

When the user says that the chat is lagging, asks to change chats or requests a
message for the next chat, immediately return one complete paste-ready handoff
that follows `docs/CHAT_CONTINUITY.md`. Do not ask the user to summarize the old
chat. The receiving chat must read the four required project files and verify
GitHub and Sites before it changes code, imports, configuration or production.

The current reporting rule supersedes the earlier per-deployment rule. Do not
send a report automatically after each visual deployment. The user wants one
consolidated report after the workday and will explicitly say when it should be
sent. Until that instruction arrives, record the report as deferred at the
user's request.

Before preparing the next report, inspect the delivered report `#003` in Sent
and reproduce that exact visual template, including its Perfumetr. wordmark,
layout, typography and footer. Do not improvise a new email design. Recheck the
latest delivered number before assigning the next sequential number. The last
confirmed delivered report at the 2026-08-21 v120 checkpoint is `#005`; this
fact must be verified again immediately before sending.

Every requested report goes to `support@perfumetr.pl`, includes its date,
sequential number, clear change summary, test result, working and non-working
elements, blockers and next step, and ends with:

```text
Pozdrawiamy,
Zespół Perfumetr
Ten sam zapach. Różne ceny.
perfumetr.pl
support@perfumetr.pl
```

Claim `sent` only after delivery is confirmed. Otherwise record `deferred`,
`pending` or `not required` accurately.
