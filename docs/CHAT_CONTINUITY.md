# Chat continuity runbook

The repository, not a single chat, is the durable project memory. A receiving
chat must be able to continue safely even if it can see none of the earlier
conversation.

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

## Current continuity checkpoint

Verified at 2026-08-22 09:42 UTC after continuity pull request `#19`:

1. `master` before PR #19 was
   `f741cb7c4198f7eeea98d13c05669c5a79b3cd88`; PR #19 merged as
   `5e06942de9d7df90a6a608e95ce608fd3234b47a`;
2. pull requests `#12` through `#19` are merged;
3. latest Actions run before this metadata-only refresh is number `43`, ID
   `32565560052`, attempt `1`, pull-request validation, conclusion
   `success`;
4. run 43 passed importer validation and skipped the production import job;
5. latest scheduled production partner cycle is run `41`, ID
   `32563903356`, attempt `1`, successful from 09:03:07 to 09:07:08 UTC;
6. run 41 skipped the full TradeDoubler snapshot and advanced partner sources;
   latest full TradeDoubler importer remains run `28`, ID
   `32497431067`, attempt `3`, and GitHub Actions is the only automatic
   scheduler;
7. run 41 reports Aelia `1,049`, Cocolita `793`, Drogeria.pl `814`,
   Notino `4,422` and Brasty `1,092` live offers, total `8,170`;
8. the TradeDoubler counts remain verified run 28 results because run 41 did
   not execute a full TradeDoubler product snapshot;
9. Notino completed in run 41 with 7,005 received, 3,776 imported, 445 review,
   2,784 excluded, 8,291 stored and 4,422 live offers;
10. Brasty paused incomplete in run 41 with 9,540 received, 1,514 imported,
    7,885 review, 141 excluded, 6,582 stored and 1,092 live offers;
11. TradeDoubler vouchers are fresh with 4 received, 4 excluded, 0 imported and
    0 active coupons;
12. AWIN Flaconi remains externally blocked by
    `orchestrator_feed_not_found`;
13. Sites v122 is deployed from source commit
    `11e1639fe7a8e1f3d95802c3ecd22f07de3802f1`;
14. v122 version ID is
    `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_0439d4ebf1308191abc69eb241a03494`;
15. v122 deployment ID is `appgdep_6a896c851c308191bed86741aaf78c4b`
    and its directly rechecked status is `succeeded`;
16. the provider URL is `https://perfumetr.borodzicz85.chatgpt.site`;
17. Sites reports version `122`, the project is active and public, and
    `https://beta.perfumetr.pl` is the current live URL;
18. `perfumetr.pl` and `beta.perfumetr.pl` both report active domain,
    provider and SSL state;
19. the production build passed, the full Sites suite passed `47/47`, and
    lint has zero errors with three existing warnings;
20. v122 spotlights Emporio Armani Stronger With You EDT 50 ml, GTIN
    `3605522040281`, from 2026-08-22 09:20 UTC through
    2026-08-23 09:20 UTC;
21. the asset contains only the bottle on a transparent background;
22. price, merchant, offer count, delivery and coupon effects remain dynamic
    from D1 rather than copied from the screenshot;
23. the saved five-day rotation is not overwritten and resumes automatically
    after the spotlight interval;
24. the v114-v121 homepage, beta, store rail, search, footer and minimal catalog
    refinements remain deployed and were not changed in v122;
25. no importer, schema, schedule, source or domain configuration changed in
    v122;
26. the beta has been shared with several people and their feedback has not yet
    been triaged;
27. report `#006`, dated 2026-08-22, remains the latest confirmed delivered
    report;
28. no report was sent for v122, following the user's explicit daily-report
    policy;
29. no code change, import, Sites deployment or email delivery is currently in
    progress;
30. the exact next task is to verify after 2026-08-23 09:20 UTC that the normal
    homepage rotation resumed, or before then respond to concrete tester
    feedback or the user's next targeted visual request.

Treat this checkpoint as dated evidence, not as a substitute for a fresh GitHub
and Sites check.

## Current paste-ready handoff baseline

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
2026-08-22 09:42 UTC

REPOZYTORIUM I CI
Master przed PR #19: f741cb7c4198f7eeea98d13c05669c5a79b3cd88.
PR #19 został scalony jako 5e06942de9d7df90a6a608e95ce608fd3234b47a.
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
Aktualna wersja: v122.
Commit źródłowy: 11e1639fe7a8e1f3d95802c3ecd22f07de3802f1.
Version ID:
appgprj_6a8236775b808191b6b4979c4d86d889~appgver_0439d4ebf1308191abc69eb241a03494
Deployment: appgdep_6a896c851c308191bed86741aaf78c4b, succeeded.
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
Repozytorium i CI działają. Sites v122 działa. Importer i harmonogram nie były
zmieniane w v122. Pięć źródeł ma aktywne oferty; Flaconi jest zewnętrznie
zablokowane. Strona główna ma czasowy spotlight Stronger With You. Strona beta,
wyszukiwarka, katalog, filtry, pasek pięciu sklepów, licznik sklepów, stopka i
panel integracji zachowują stan v121. Obie domeny i SSL są aktywne. Feedback
testerów może nadejść i nie został jeszcze przeanalizowany.

OSTATNIO ZAKOŃCZONA PRACA
Sites v122 ustawia Emporio Armani Stronger With You EDT 50 ml, GTIN
3605522040281, na stronie głównej dokładnie od 22 sierpnia 09:20 UTC do
23 sierpnia 09:20 UTC, czyli do 11:20 czasu polskiego. Obraz zawiera tylko
flakon na przezroczystym tle. Cena, sklep, liczba ofert, dostawa i kupony są
dynamiczne. Po wygaśnięciu wraca zwykła pięciodniowa rotacja. Jeśli oferta
zniknie wcześniej, działa bezpieczny fallback. Nie zmieniono importera,
schematu, harmonogramu ani domen.

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
Raport #006 z 2026-08-22 jest ostatnim potwierdzonym raportem. Dla v122 nie
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
7. Report `#006`, dated 2026-08-22, is the latest confirmed delivered report at
   this checkpoint. If the sequence remains unchanged when rechecked, the next
   report number is `#007`.
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
