# Perfumetr importer

Automat pobierający oficjalne feedy TradeDoublera dla:

- Cocolita — Feed ID `112471`
- Drogeria.pl — Feed ID `118359`

Nie wymaga ręcznego dodawania produktów. Workflow ma dwa tryby:

- `proof` — pobiera po jednej, z góry ustalonej stronie wyników dla frazy
  „woda perfumowana” i przekazuje ją do importera Perfumetr;
- `full` — sprawdza wersję pełnego feedu, pobiera go tylko po zmianie i
  przekazuje dane do Perfumetr w małych, wznawialnych porcjach.

## Automatyzacja

Workflow `.github/workflows/tradedoubler.yml` uruchamia pełny import codziennie
o 03:17 UTC. Po zmianie kodu najpierw testuje oba feedy, a po powodzeniu
uruchamia pierwszy pełny import. Można go też uruchomić ręcznie w trybie
`proof` lub `full`.

Nie wymaga sekretu dodawanego ręcznie. GitHub Actions pobiera własny,
krótkotrwały token OIDC, a Perfumetr sprawdza jego podpis i przyjmuje wyłącznie
workflow z repozytorium `GADOMM/Index`, gałęzi `master` i dokładnie tego pliku.
Uprawnienie `id-token: write` nie daje importerowi prawa zapisu do repozytorium.
Skrypt nie wypisuje tokenu OIDC, podpisanych biletów ani adresu przekierowania
zawierającego token TradeDoublera.

Kod może pozostawać publiczny, ponieważ nie zawiera danych dostępowych. Token
TradeDoublera jest przechowywany wyłącznie po stronie Perfumetr.

## Wynik

Każde uruchomienie kończy się krótkim raportem JSON z liczbą pobranych produktów,
porcji i aktywnych ofert. Brak danych, błędny podpis, niepełny feed albo błąd
importu powoduje czerwony status zadania zamiast pozornego sukcesu.
