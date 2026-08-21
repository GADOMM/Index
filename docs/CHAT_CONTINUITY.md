# Chat continuity runbook

The repository, not a single chat, is the durable project memory. A receiving
chat must be able to continue safely even if it can see none of the earlier
conversation.

## Mandatory maintenance

After every important deployment or major production investigation, update both
`PROJECT_STATE.md` and this file before declaring the task complete. Record:

1. the UTC verification timestamp;
2. the confirmed state of every project area;
3. the exact current `master` commit;
4. important pull request numbers and their state;
5. the latest GitHub Actions run and the last production importer run as two
   separate facts;
6. the current Sites version, source commit and deployment state;
7. exact live-offer counts for every active store and their total;
8. the last import result, including safe counters and source blockers;
9. what works, what does not work and what remains visually unverified;
10. completed work and test results;
11. any work still in progress, with its exact stage;
12. external blockers and ownership;
13. the exact next task;
14. the deployment-report number, recipient, sent timestamp and delivery state.

Use only directly verified facts. Never present work in progress, an unverified
deployment or a launched workflow as completed. Do not wait for ChatGPT to show
a conversation-length warning.

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
Po każdym ważnym wdrożeniu wyślij raport także na support@perfumetr.pl.
Raport musi mieć datę, kolejny numer, czytelny opis zmian, wynik testów, stan
działających i niedziałających elementów, blokady, następny krok, właściwe logo
Perfumetr. oraz stopkę:

Pozdrawiamy,
Zespół Perfumetr
Ten sam zapach. Różne ceny.
perfumetr.pl
support@perfumetr.pl

Ostatni raport: [numer, data, stan wysłany, oczekuje albo niewymagany]
Nie twierdź, że raport został wysłany bez potwierdzenia dostarczenia.

Najpierw potwierdź użytkownikowi, co odczytałeś i jaki jest rzeczywisty stan.
Dopiero potem przejdź do następnego zadania.
```

## Current continuity checkpoint

Verified at 2026-08-21 19:01 UTC before this documentation branch:

1. `master` commit:
   `5162f5ebf487de60083147b1be587d5c83fe283c`;
2. pull request `#13` is merged and records the verified production handoff;
3. Actions run number `29`, ID `32502783967`, succeeded as pull request
   validation and skipped the live importer;
4. Actions run number `28`, ID `32497431067`, attempt `3`, is the last
   successful production importer run;
5. Sites v113 is deployed successfully from commit
   `4e2adaf13f07fe197504677006c141e6b61dbb82` with 44 of 44 tests passing;
6. both custom domains have active provider and SSL status, while Sites reports
   `https://beta.perfumetr.pl` as the live URL;
7. verified live offers total `7,977`: Aelia `1,049`, Cocolita `793`,
   Drogeria.pl `814`, Notino `4,422` and Brasty `899`;
8. AWIN Flaconi remains blocked by `orchestrator_feed_not_found`;
9. no code change, import or Sites deployment is in progress;
10. the next task is the read-only visual and routing audit of the homepage,
    beta page, store rail, `perfumetr.pl` and `beta.perfumetr.pl`;
11. this documentation-only change does not require a deployment email;
12. the last delivered report number is not yet verified in the repository.

Treat this checkpoint as dated evidence, not as a substitute for a fresh GitHub
and Sites check.

## Report delivery rules

After every important deployment, send the same numbered and dated report in
chat and to `support@perfumetr.pl`. Use the real Perfumetr. wordmark, a readable
human summary and the approved footer shown in the handoff template.

Record one of these states in `PROJECT_STATE.md`:

1. `sent`, only after delivery is confirmed;
2. `pending`, when a report still needs to be sent or delivery is unconfirmed;
3. `not required`, only when no important deployment occurred.

Verify the last delivered report number before choosing the next sequential
number. Never invent or reuse a number.

## Information that must never enter a handoff

Never store tokens, passwords, provider download URLs, OIDC assertions, browser
tickets, administrator cookies, private provider payloads or copied mailbox
content. Use safe error codes and authorized dashboard links instead.

## When GitHub and Sites disagree

Stop before deployment. Verify both sides directly. A GitHub script can be
correct while the required Sites endpoint is absent, and a successful import
can still be hidden by separate public-catalog rules. Update the continuity
files only after the mismatch is understood.
