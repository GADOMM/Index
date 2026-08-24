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

## Latest continuity checkpoint

Verified at 2026-08-24 10:01 UTC for Sites v132, the focused catalog
transition, the product-rating source audit and delivery of report #008.

1. verified `master` before continuity PR #26:
   `fb3396ee134ea7bba317b32fdebae4a0aad73789`;
2. PR #24 is merged as `deedfdb60d0129cfefb51d89631ab897f434d980`;
   PR #25 is merged as `fb3396ee134ea7bba317b32fdebae4a0aad73789`;
   PR #26 is the documentation-only Sites v132 and report #008 record and its
   final CI and merge state must be checked directly;
3. the newest production workflow remains run #58, ID `32711816055`,
   attempt 1, schedule, success from 09:29:21 to 09:34:29 UTC; validation
   passed 16/16, full TradeDoubler was correctly skipped and the bounded
   partner orchestrator succeeded;
4. run #53, ID `32666073700`, attempt 8 remains the final completed CJ
   recovery generation;
5. run #55 remains the latest full TradeDoubler snapshot. Its full import step
   succeeded from 00:24:49 to 00:41:51 UTC, although the overall run failed on
   the retired pre-v131 CJ maintenance path;
6. Sites v132 source commit is
   `843e1f8d7dc542bf5a40b6507ba53d67e0fa815c`;
7. v132 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_10e6ac8f132481918c4d811807773972`;
8. deployment `appgdep_6a8c154fe2e481919fb8c616f25171b7` is
   `succeeded` with no failure message, directly rechecked by the main agent;
9. Sites reports version 132, an active public project and
   `https://beta.perfumetr.pl` as the live URL. Both custom domains report
   active domain, provider and SSL state with no recorded error;
10. build and artifact validation pass, the full Sites suite passes 49/49,
    lint has zero errors and three existing warnings, and an independent review
    found no motion, mobile or reduced-motion blocker. No browser QA was run
    for v132;
11. v129 fixed voucher destination handling, simplified the catalog and added
    three dynamic homepage cutouts; v130 forced one safe voucher refresh; v131
    removed the D1 quadratic maintenance path; v132 changes only catalog motion
    and translucency;
12. live counts remain Aelia 1,234, Cocolita 843, Drogeria.pl 841,
    Notino 5,344 and Brasty 6,043, total 14,305;
13. run #58 paused a new Notino generation safely after 48 steps with 5,344
    live, 54 review, 54 automatic and 0 pending fresh;
14. run #58 paused a new Brasty generation safely after 48 steps with 6,043
    live, 154 review, 66 automatic and 0 pending fresh;
15. those partial counters are not final. The preceding completed generation
    ended with 297 true manual rows and zero automatic or pending-fresh work;
16. the automatic schedule can continue both paused, non-busy generations. Do
    not weaken matching rules or compare partial and completed counters as if
    they were equivalent;
17. vouchers remain 4 received, 1 imported, 3 excluded and 1 active. The three
    exclusions have aggregate reason `tracking_url_not_approved`;
18. the active coupon is not silently applied to price without structured
    owner confirmation;
19. Flaconi remains externally blocked by
    `orchestrator_feed_not_found`;
20. the earlier directly verified ordinary homepage rotation remains YSL Libre
    Flowers & Flames EDP 50 ml, Notino, 3 stores, 359.40 PLN total and 258.50
    PLN saving. v132 did not modify the homepage;
21. the expired Stronger With You spotlight is gone; earlier production checks
    found no empty or stale hero;
22. v132 adds a 280 ms restrained dialog transition, gradual backdrop fade and
    translucent sand layers while preserving Escape, focus, scrolling, mobile
    columns and reduced-motion behavior;
23. product ratings were not published. CJ, TradeDoubler, AWIN, the API models
    and D1 do not currently provide authoritative customer rating and review
    counts. Beta feedback and importer-review counters must never be reused as
    product reviews;
24. report #008, dated 2026-08-24, was sent to
    `support@perfumetr.pl` at 09:59 UTC and confirmed in Sent. It reproduces
    the permanent report #003 visual template and inline Perfumetr logo;
25. after PR #26 merges there is no code edit, import, deployment or email in
    progress. The next user-driven task is visual evaluation of the v132
    transition and transparency. Ratings remain blocked until an official store
    API, official feed or licensed source is available.

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
TradeDoubler, bieżącą wersję i wdrożenie Sites, domeny perfumetr.pl i
beta.perfumetr.pl oraz produkcję. Jeżeli wystąpi rozbieżność, najpierw opisz ją
użytkownikowi. Nie zmieniaj kodu, importera, konfiguracji ani produkcji przed
zakończeniem kontroli.

CZAS WERYFIKACJI
24 sierpnia 2026, 10:01 UTC.

GITHUB
Master przed PR #26:
fb3396ee134ea7bba317b32fdebae4a0aad73789
PR #24 jest scalony jako deedfdb60d0129cfefb51d89631ab897f434d980.
PR #25 jest scalony jako fb3396ee134ea7bba317b32fdebae4a0aad73789.
PR #26 zapisuje Sites v132 i raport #008. Sprawdź jego końcowy CI i merge.
Najnowszy produkcyjny workflow pozostaje run #58, ID 32711816055, attempt 1,
schedule, success, 09:29:21–09:34:29 UTC. Walidacja 16/16 przeszła, pełny
TradeDoubler został poprawnie pominięty, a partner orchestrator zakończył się
sukcesem.
Run #53 attempt 8 pozostaje ostatnią zakończoną generacją naprawczą CJ.
Run #55 pozostaje ostatnim pełnym TradeDoublerem. Jego pełny krok zakończył się
sukcesem, choć cały run miał failure przez wycofaną ścieżkę CJ sprzed v131.
GitHub Actions jest jedynym automatycznym harmonogramem.

SITES
Wersja v132.
Commit: 843e1f8d7dc542bf5a40b6507ba53d67e0fa815c
Version ID:
appgprj_6a8236775b808191b6b4979c4d86d889~appgver_10e6ac8f132481918c4d811807773972
Deployment: appgdep_6a8c154fe2e481919fb8c616f25171b7
Status: succeeded, brak failure message.
Provider URL: https://perfumetr.borodzicz85.chatgpt.site
Live URL: https://beta.perfumetr.pl
Projekt jest aktywny i publiczny. perfumetr.pl i beta.perfumetr.pl mają aktywną
domenę, provider i SSL bez błędu. Build i artefakt działają, testy 49/49, lint
ma 0 błędów i 3 wcześniejsze ostrzeżenia. Niezależny przegląd nie znalazł
blokera. Nie wykonano przeglądarkowego QA v132.

WYKONANE
v132 dotyka wyłącznie katalogu po kliknięciu „Przeglądaj perfumy”. Otwieranie i
zamykanie używa spokojnego przejścia 280 ms, delikatnego przesunięcia i małej
zmiany skali. Tło pod katalogiem wygasza się i rozmywa płynnie. Piaskowy panel,
nagłówek, kategorie i filtry są półprzezroczyste. Telefon używa mocniejszej
nieprzezroczystości i mniejszego rozmycia dla czytelności. Escape, fokus,
przewijanie, układ produktów i preferencja ograniczenia ruchu pozostają
zachowane. Nie zmieniono danych, API, importera, ofert ani strony głównej.

OPINIE PRODUKTÓW
Nie opublikowano gwiazdek ani liczby opinii. Oficjalne źródła CJ dla Notino,
TradeDoubler i AWIN, aktualne modele API oraz D1 nie dostarczają średniej oceny
produktu i liczby opinii klientów. feedback.rating jest oceną bety przez
testera, a catalog_import_sources.review_count liczy produkty do kontroli
importera. Nie wolno ich użyć jako opinii produktu.
Docelowo ocena musi być osobna dla każdej oferty sklepu, mieć źródło i datę
aktualności oraz pochodzić z oficjalnego API sklepu, oficjalnego feedu lub
licencjonowanego źródła.

OFERTY I IMPORTER
Aelia: 1234 aktywne oferty.
Cocolita: 843.
Drogeria.pl: 841.
Notino: 5344 aktywne oferty. Częściowy run #58: review 54, automatic 54,
pending fresh 0.
Brasty: 6043 aktywne oferty. Częściowy run #58: review 154, automatic 66,
pending fresh 0.
Łącznie: 14305.
Liczniki run #58 są częściowe. Poprzednia zakończona generacja miała 297
prawdziwych przypadków ręcznych oraz 0 automatic i 0 pending fresh.
Harmonogram będzie kontynuował obie wstrzymane generacje. Nie osłabiaj reguł
dopasowania tylko po to, aby obniżyć licznik.

KUPONY I BLOKADY
Kupony TradeDoubler: 4 odebrane, 1 zaimportowany, 3 wykluczone, 1 aktywny.
Aktywny kupon nie jest po cichu uwzględniany w cenie bez strukturalnego
potwierdzenia właściciela. Flaconi pozostaje zewnętrznie zablokowane przez
orchestrator_feed_not_found.

STRONA GŁÓWNA
v132 nie zmieniło strony głównej. Ostatni bezpośrednio potwierdzony stan zwykłej
rotacji to YSL Libre Flowers & Flames EDP 50 ml, Notino, 3 sklepy, 359,40 zł
razem i 258,50 zł oszczędności. Wygasły spotlight Stronger With You nie jest
przypięty, a hero nie było puste ani stare.

RAPORT
Raport #008 z 24 sierpnia 2026 został wysłany o 09:59 UTC na
support@perfumetr.pl i potwierdzony w folderze Wysłane. Używa dokładnego
szablonu wizualnego #003 oraz jego logo. Przed następnym raportem sprawdź
Wysłane. Jeżeli #008 nadal jest ostatni, następny numer to #009.

PRACA W TOKU
Po scaleniu dokumentacyjnego PR #26 brak. Nie trwa edycja, import, wdrożenie ani
wysyłka e-maila. Automatyczny harmonogram może kontynuować run #58.

NASTĘPNE ZADANIE
Poczekaj na ocenę użytkownika dotyczącą płynności przejścia i poziomu
przezroczystości v132. Nie rozpoczynaj szerokiego redesignu katalogu. Oceny
produktów wdrażaj dopiero po potwierdzeniu autorytatywnego, ustrukturyzowanego
źródła danych.
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
7. Report `#008`, dated 2026-08-24, is the latest confirmed delivered report at
   this checkpoint. If the sequence remains unchanged when rechecked, the next
   report number is `#009`.
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
