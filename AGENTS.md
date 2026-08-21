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

After every important deployment update `PROJECT_STATE.md` with UTC timestamp,
commit, Sites version, workflow run, verified counts, blockers and next action.
Never put secrets in that file.

The user requires a numbered and dated report after every important deployment,
both in chat and by email. The report must clearly distinguish verified facts,
unfinished work and automatic next steps. Use the approved Perfumetr wordmark
and this footer:

```text
Pozdrawiamy,
Zespół Perfumetr
Ten sam zapach. Różne ceny.
perfumetr.pl
support@perfumetr.pl
```
