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
5. the latest GitHub Actions run and the last production importer run as
   separate facts;
6. the current Sites version, source commit and deployment state;
7. exact live-offer counts for every active store and their total;
8. the last import result, including safe counters and source blockers;
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
4. verify the latest Actions run and the last production importer run;
5. verify the current Sites version, deployment, domains and SSL state;
6. compare production with the handoff;
7. report any mismatch to the user;
8. make no code, import, configuration or production change until the checks are
   complete.

## Required paste-ready handoff

Use the structure below. Replace every placeholder with a verified value or an
explicitly labelled unknown. Remove all instruction notes before sending it.
The delivered message must contain no placeholders.

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
Actions, ostatni produkcyjny przebieg importera, aktualną wersję i wdrożenie
Sites oraz stan domen perfumetr.pl i beta.perfumetr.pl. Porównaj je z poniższym
przekazaniem. Jeżeli wystąpi rozbieżność, najpierw ją opisz. Nie zmieniaj kodu,
importera, konfiguracji ani produkcji przed zakończeniem tej weryfikacji.

CZAS WERYFIKACJI
[UTC timestamp]

REPOZYTORIUM I CI
Aktualny commit master: [pełny SHA]
Ważne pull requesty: [numery, cel i stan]
Najnowszy Actions run: [run number, ID, event, conclusion, importer wykonany albo
pominięty]
Ostatni produkcyjny import: [run number, ID, attempt, czas i conclusion]
Automatyczny harmonogram: [potwierdzony stan]

SITES I DOMENY
Projekt: [nazwa]
Aktualna wersja: [numer]
Commit źródłowy: [pełny SHA]
Wdrożenie: [ID i stan]
Wynik testów: [dokładny wynik]
Domena perfumetr.pl: [provider, SSL, routing i wynik bezpośredniej weryfikacji]
Domena beta.perfumetr.pl: [provider, SSL, routing i wynik bezpośredniej
weryfikacji]
Główny adres raportowany przez Sites: [URL]

IMPORTER I OFERTY
Wynik ostatniego importu: [dokładny opis]
Aelia: [liczba aktywnych ofert]
Cocolita: [liczba aktywnych ofert]
Drogeria.pl: [liczba aktywnych ofert]
Notino: [liczba aktywnych ofert]
Brasty: [liczba aktywnych ofert]
Łącznie: [dokładna suma aktywnych ofert]
Flaconi: [stan i bezpieczny kod blokady]
Pozostałe źródła i kupony: [stan i bezpieczne liczniki]
Nie traktuj ograniczonego proof importu jako wielkości pełnego feedu.

STAN WSZYSTKICH ELEMENTÓW
Repozytorium i CI: [stan]
Sites: [stan]
Importer: [stan]
Sieci afiliacyjne: [stan]
Strona główna: [stan]
Strona beta: [stan]
Katalog i filtry: [stan]
Pasek sklepów i dynamiczna liczba sklepów: [stan]
Panel integracji: [stan]
Domeny i SSL: [stan]
Raportowanie: [stan]
Inne aktywne elementy: [stan]

CO DZIAŁA
[pełna lista potwierdzonych elementów]

CO NIE DZIAŁA LUB NIE ZOSTAŁO JESZCZE ZWERYFIKOWANE
[pełna lista z rozróżnieniem awarii i braku weryfikacji]

ZEWNĘTRZNE BLOKADY
[blokada, właściciel zewnętrzny i oczekiwane zdarzenie odblokowujące]

OSTATNIO ZAKOŃCZONA PRACA
[dokładny opis zmian, wdrożenia i testów]

PRACA AKTUALNIE W TOKU
[brak albo dokładny etap: nie rozpoczęta, w toku, wdrożona bez weryfikacji lub
zakończona]
Nie przedstawiaj tej pracy jako zakończonej, dopóki produkcja nie została
bezpośrednio sprawdzona.

DOKŁADNE NASTĘPNE ZADANIE
[jeden konkretny i bezpieczny krok]

RAPORTY WDROŻENIOWE
Nie wysyłaj raportu automatycznie po każdym wizualnym wdrożeniu. Użytkownik
poprosi o jeden skonsolidowany raport po zakończeniu dnia. Przed wysłaniem
odczytaj raport #003 z folderu Wysłane i odwzoruj dokładnie jego szablon,
wordmark, układ, typografię oraz stopkę. Nie twórz nowego wyglądu wiadomości.
Sprawdź ostatni faktycznie dostarczony numer przed wybraniem kolejnego.

Każdy zamówiony raport wyślij na support@perfumetr.pl. Musi mieć datę, kolejny
numer, czytelny opis zmian, wynik testów, stan działających i niedziałających
elementów, blokady, następny krok, właściwe logo Perfumetr. oraz stopkę:

Pozdrawiamy,
Zespół Perfumetr
Ten sam zapach. Różne ceny.
perfumetr.pl
support@perfumetr.pl

Ostatni raport: [numer, data i stan]
Raport bieżącego wdrożenia: [wysłany, oczekuje, odroczony na prośbę użytkownika
albo niewymagany]
Nie twierdź, że raport został wysłany bez potwierdzenia dostarczenia.

Najpierw potwierdź użytkownikowi, co odczytałeś i jaki jest rzeczywisty stan.
Dopiero potem przejdź do następnego zadania.
```

## Current continuity checkpoint

Verified at 2026-08-21 23:08 UTC before the v120 continuity branch:

1. `master` baseline commit:
   `15cdffc860d319bc82705ea903e3127b2145c985`;
2. pull requests `#12`, `#13`, `#14` and `#15` are merged;
3. latest Actions run is number `32`, ID `32527917523`, attempt `1`,
   pull-request validation, succeeded from 21:18:57 to 21:19:07 UTC;
4. run 32 completed the validation job and skipped the import job;
5. latest scheduled production partner run remains number `31`, ID
   `32526426619`, attempt `1`, succeeded from 21:00:42 to 21:01:08 UTC;
6. run 31 passed importer validation `14/14`, skipped the full TradeDoubler
   snapshot and successfully advanced partner sources;
7. latest full production importer remains run `28`, ID `32497431067`,
   attempt `3`, successful at 16:20 UTC;
8. run 31 reconfirmed Notino `4,422` and Brasty `899` live offers; the
   TradeDoubler counts remain the verified run 28 results: Aelia `1,049`,
   Cocolita `793` and Drogeria.pl `814`; verified total `7,977`;
9. TradeDoubler vouchers remain fresh with 4 received, 4 excluded and 0 active
   coupons;
10. AWIN Flaconi remains externally blocked by
    `orchestrator_feed_not_found`; the blocker did not fail the workflow;
11. Sites v120 is deployed successfully from source commit
    `4302d9133a5cc99eec4d4f5da7e3358108561b60`;
12. v120 version ID is
    `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_e30e538bc74081918bfdc3fa5c7c8706`;
13. v120 deployment ID is `appgdep_6a88d9d0cd048191b6ff07192ccbeef4`
    and its directly rechecked status is `succeeded`;
14. the production build succeeded and the full Sites suite passed `47/47`;
    lint has zero errors and two pre-existing warnings;
15. `perfumetr.pl` and `beta.perfumetr.pl` report active domain, provider and
    SSL state with no domain error; Sites reports `https://beta.perfumetr.pl`
    as the live URL;
16. the v114-v119 homepage and beta visual refinements remain deployed;
17. v120 replaces the earlier catalog drawer with the Catalog Canvas: calm
    centered desktop surface, full-screen mobile layout, searchable brand
    selection, radio refinements, synchronized active chips, simpler cards,
    integrated back action and automatic first price-capable volume lookup;
18. request cancellation, focus and scroll restoration, error states,
    reduced-motion handling and mobile safe areas remain preserved;
19. the redesign has technical verification but has not yet received the user's
    subjective visual and full interaction review on a physical phone and
    desktop;
20. report `#005` remains the last confirmed delivered report;
21. no v120 report was sent because the user requires a consolidated report only
    after explicitly asking for it; when requested, the exact visual template
    from delivered report `#003` must be reused;
22. no code change, import, Sites deployment or email delivery is in progress;
23. the exact next task is the user's desktop and real-phone review of v120 on
    `beta.perfumetr.pl`, followed only by the specific refinements requested.

Treat this checkpoint as dated evidence, not as a substitute for a fresh GitHub
and Sites check.

## Report delivery rules

The current user instruction supersedes the earlier automatic per-deployment
email rule.

1. Do not send a report merely because a visual deployment completed.
2. Wait for the user to explicitly request the consolidated report, normally
   after the workday.
3. Before composing it, retrieve delivered report `#003` from Sent and use that
   exact visual template. Preserve its wordmark, spacing, typography, colors,
   content structure and approved footer.
4. Verify the latest delivered report number in Sent. At this checkpoint `#005`
   is latest, but this must be rechecked before assigning `#006`.
5. Send only to `support@perfumetr.pl` unless the user explicitly changes the
   recipient.
6. Record `sent` only after delivery is confirmed. Otherwise use `deferred`,
   `pending` or `not required`.
7. Never put credentials, provider payloads or private mailbox content into the
   repository.

## When GitHub and Sites disagree

Stop before deployment. Verify both sides directly. A GitHub script can be
correct while the required Sites endpoint is absent, and a successful import
can still be hidden by separate public-catalog rules. Update the continuity
files only after the mismatch is understood.

## Information that must never enter a handoff

Never store tokens, passwords, provider download URLs, OIDC assertions, browser
tickets, administrator cookies, private provider payloads or copied mailbox
content. Use safe error codes and authorized dashboard links instead.
