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

`proof` downloads a bounded TradeDoubler query, applies the perfume classifier
and imports only accepted perfume records.

`full` verifies the complete provider snapshot, counts every raw record and
sends only perfume records to Perfumetr in resumable chunks. Raw counts remain
independent from accepted counts, including chunks with zero perfumes.

The shared AWIN/CJ orchestrator performs a bounded number of server-side import
steps. Existing server-side cursors remain authoritative.

## Automation

`.github/workflows/tradedoubler.yml` retains its path because the current Sites
OIDC verifier trusts that exact workflow path. Its visible name is broader than
TradeDoubler because it now coordinates all catalog sources.

The scheduled run starts daily at 14:17 UTC. Manual modes are:

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

The complete TradeDoubler file is still downloaded for completeness checks.
Filtering currently reduces catalog traffic and writes, not provider download
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

The required backward-compatible Sites contracts are deployed in version 111.
Publish GitHub changes through a pull request, require the validation job to
pass, then merge. The first push to `master` performs the bounded TradeDoubler
proof, the full TradeDoubler cycle and the shared partner cycle. Do not remove
the old Worker fallback until that live run has directly verified the GitHub
path for the configured sources.

Project handoff information lives in `PROJECT_STATE.md`. Stable operating rules
are in `AGENTS.md`; architecture and chat continuity are documented under
`docs/`.
