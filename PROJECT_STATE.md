# Perfumetr project state

Updated: 2026-08-21 14:54 UTC

This file contains no credentials. Verify every external status again before a
new deployment.

## Current production evidence

Repository: `GADOMM/Index`

Default branch: `master`

Last verified production commit: `1d8f3b2299cd214ab6eb6499ee4c0c5ccdcb0f7c`

Last verified workflow run:
`https://github.com/GADOMM/Index/actions/runs/32489397241`

Production result from that run:

| Source | State | Verified result |
| --- | --- | --- |
| Cocolita, Feed `112471` | successful, unchanged full snapshot | proof reported 793 store offers |
| Drogeria.pl, Feed `118359` | successful full snapshot | 32,324 raw records, 1,564 perfumes, 814 live offers |
| Aelia.pl, Program `397216` | not connected to the GitHub importer | Feed ID still must be discovered, never guessed |
| TradeDoubler vouchers | server endpoint exists | included in the local shared-orchestrator draft |
| AWIN Flaconi | server importer exists outside this repository | GitHub orchestration not deployed |
| CJ Notino and Brasty | server importers exist outside this repository | GitHub orchestration not deployed |

Sites version 111 is deployed and succeeded:

* commit `539736b4e115837ce6e7f4ce0d341dbb856f719b`;
* version `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_0cc54540be888191bac6dbc7b528bd88`;
* deployment `appgdep_6a886666304c8191a45115b011de6794`;
* URL `https://perfumetr.borodzicz85.chatgpt.site`.

That version provides the exact OIDC bridge for Aelia, the shared catalog
orchestrator, operational integration status, dynamic public visibility for
verified active merchants and the automatically counted store rail on the
homepage and beta.

## Local draft in this workspace

The uncommitted local draft adds:

1. non-secret TradeDoubler source configuration;
2. Aelia configuration from the official program `397216` payload;
3. source-level failure isolation;
4. the `perfume-v1` classifier;
5. a bounded AWIN/CJ GitHub orchestrator;
6. broader workflow and tests;
7. durable project and chat handoff documentation.

This draft has not been published and is not production state.

## Deployed server contracts

Sites version 111 provides:

1. verified OIDC access to the existing `program_feeds` ticket and
   `configure_store_feed` flow for Aelia;
2. `/api/internal/catalog-orchestrator` with actions `status` and
   `advance_source`;
3. an exact allowlist for `tradedoubler:vouchers`, `awin:flaconi`, `cj:notino`
   and `cj:brasty`;
4. OIDC access from the existing trusted workflow path and audience;
5. unified persisted source status for the integrations panel;
6. safe generation restart after `feed_changed`, `incomplete_feed` and
   `pagination_incomplete`.

## Known risks

1. The TradeDoubler full payload is still parsed fully in memory after download.
2. The classifier is intentionally strict and requires live Aelia sampling to
   measure false negatives.
3. The current 120 minute workflow may become too short as sources grow.
4. GitHub scheduled workflows in inactive public repositories can be disabled
   by GitHub; a missing-success alert is still required.
5. A new TradeDoubler store still needs an allowlisted Sites store profile and
   a non-secret source entry before GitHub may discover its feed.

## Next action

Publish this draft through a pull request. Require CI to pass, merge, then
inspect the first push workflow and record the real result for every source.
Only after the GitHub cycle is verified may the legacy Worker fallback be
removed from Sites.

## Do not claim yet

Do not claim that Aelia imports, that AWIN/CJ are controlled by GitHub, that the
integrations panel is repaired or that future shops enroll automatically until
each behavior has direct production evidence.
