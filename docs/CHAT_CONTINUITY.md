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

Verified at 2026-08-24 11:29 UTC for Sites v134, Sites v135 and the first
authorized post-approval Flaconi feed check. Report #008 remains the latest
confirmed delivered report.

1. verified `master` before this continuity pull request:
   `12bc37c2c2e8fbe2a0788a55923342eb4fc39242`;
2. PR #27 is merged as `3092cd09d80080acb4fc450fe5461b3f932d3673`
   and records Sites v133;
3. PR #28 is merged as `12bc37c2c2e8fbe2a0788a55923342eb4fc39242`
   and adds only a source-limited, unscheduled Flaconi workflow;
4. `Perfumetr Flaconi feed` run #1, ID `32719672617`, pull request, passed
   importer validation 16/16. Its production job was correctly skipped;
5. run #2, ID `32719777955`, attempt 1 did not test AWIN. Sites rejected the
   new workflow identity with `orchestrator_404` before the importer reached
   the provider;
6. Sites v135 then added exact, scope-limited OIDC trust for `flaconi.yml` only
   to the catalog orchestrator. That workflow cannot access the TradeDoubler
   runtime bridge;
7. run #2 attempt 2 completed successfully from 11:20:17 to 11:20:35 UTC. Job
   `97413228339` passed Sites authorization, reached AWIN and returned the
   handled blocker `orchestrator_feed_not_found` before scanning any records;
8. the newest scheduled partner workflow remains run #58, ID `32711816055`,
   attempt 1, schedule, success from 09:29:21 to 09:34:29 UTC;
9. run #53 attempt 8 remains the final completed CJ recovery generation. Run
   #55 remains the latest full TradeDoubler snapshot;
10. Sites v134 source commit is
    `2c7851bf196482cd8f03be6725c0471f07066b72`, and version ID is
    `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_726fe7b1e354819183b229430cc54c4a`;
11. Sites v135 source commit is
    `00edc6921a2b1f2fd5c77a04d5f10adcb0ac3407`, and version ID is
    `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_20250ea793b08191bbdac344721ba79c`;
12. v135 is deployed with status `succeeded`. Sites reports an active public
    project and `https://beta.perfumetr.pl` as the live URL. Both custom domains
    have active domain, provider and SSL state with no recorded error;
13. build and artifact validation pass, the full Sites suite passes 50/50 and
    lint has zero errors with three existing warnings. No browser QA was run for
    v134 or v135;
14. v134 gives TradeDoubler, AWIN and CJ the same read-only fields: Connection,
    Programs, Catalogs and Promotions, with the same refresh action;
15. AWIN SSR uses the persisted programme registry, so the confirmed `1 of 5`
    state survives reload. Promotions and coupons are provider-neutral at the
    top level. Normal panel refreshes do not start imports;
16. D1 persistently records Flaconi advertiser 18563 as `approved`. The decision
    was recorded at 10:19:17 UTC and the latest check at 11:20:30 UTC. The
    earlier `0 of 5` after reload was a UI bug, not lost acceptance;
17. Flaconi source generation 1 is paused with `feed_not_found`, zero received,
    accepted, review or rejected rows and no Flaconi merchant or active offer;
18. the expected Enhanced path was checked after the documented one-hour
    propagation window. Its 404 means the next step is official feed discovery,
    not another programme-status check;
19. no `data_feed_api_key` status row was configured at the final check. The
    owner must save that separate key in the protected integration field. Never
    place the key or a keyed feed URL in chat, GitHub or this handoff;
20. Flaconi is already represented in the storefront registry and all generic
    offer surfaces. It must remain absent from the dynamic store rail until a
    verified active merchant and fresh offers actually exist;
21. live counts retain the verified pre-check baseline: Aelia 1,234, Cocolita
    843, Drogeria.pl 841, Notino 5,344 and Brasty 6,043, total 14,305;
22. run #58 partial review counters remain Notino 54 and Brasty 154. The prior
    completed generation ended with 297 true manual rows and zero automatic or
    pending-fresh work;
23. vouchers remain 4 received, 1 imported, 3 excluded and 1 active. The active
    coupon is not silently applied without structured owner confirmation;
24. v133 catalog motion and matte glass remain deployed and were not changed by
    v134 or v135;
25. product ratings remain unpublished because no authoritative structured
    rating and review-count source has been verified;
26. report #008, dated 2026-08-24, was sent to `support@perfumetr.pl` at
    09:59 UTC and confirmed in Sent. No report was sent for v134, v135 or this
    feed investigation;
27. after this continuity pull request merges there is no Sites edit, importer
    run, deployment or email in progress. The next task is to read Product Feed
    List after the protected Data Feed API key is saved, select advertiser 18563
    using its real format and locale, and continue the bounded official import.

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
24 sierpnia 2026, 11:29 UTC.

GITHUB
Master przed dokumentacyjnym PR:
12bc37c2c2e8fbe2a0788a55923342eb4fc39242
PR #27 jest scalony jako 3092cd09d80080acb4fc450fe5461b3f932d3673.
PR #28 jest scalony jako 12bc37c2c2e8fbe2a0788a55923342eb4fc39242
i dodaje tylko ograniczony workflow Flaconi bez harmonogramu, uruchamiany przy
push i ręcznie.
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
Wersja v135.
Commit: 00edc6921a2b1f2fd5c77a04d5f10adcb0ac3407
Version ID:
appgprj_6a8236775b808191b6b4979c4d86d889~appgver_20250ea793b08191bbdac344721ba79c
Status wdrożenia: succeeded, brak failure message.
Provider URL: https://perfumetr.borodzicz85.chatgpt.site
Live URL: https://beta.perfumetr.pl
Projekt jest aktywny i publiczny. perfumetr.pl i beta.perfumetr.pl mają aktywną
domenę, provider i SSL bez błędu. Build i artefakt działają, testy 50/50, lint
ma 0 błędów i 3 wcześniejsze ostrzeżenia. Nie wykonano przeglądarkowego QA v134
ani v135.

PANEL INTEGRACJI
TradeDoubler, AWIN i CJ mają teraz te same pola Połączenie, Programy, Katalogi
i Promocje oraz ten sam przycisk odświeżenia. Promocje i kupony są wspólne dla
sieci. AWIN SSR czyta zapisany rejestr programów, więc 1 z 5 nie znika po
odświeżeniu. Zwykły odczyt panelu nie uruchamia importu.
Sites v135 ufa dokładnie flaconi.yml tylko w catalog orchestratorze. Workflow
Flaconi nie ma dostępu do mostu TradeDoubler.

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
support@perfumetr.pl i potwierdzony w folderze Wysłane. Dla v134, v135 ani tej
kontroli feedu nie wysłano nowego raportu.

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
