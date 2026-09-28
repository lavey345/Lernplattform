# Meine Lernplattform

Eine persönliche, statische Lernplattform: Materialien und Übungen liegen versioniert im Repository, die Website zeigt sie ohne Server an.

## So funktioniert der Ablauf

1. Du lädst im Chat Arbeitsblätter, Fotos, PDFs oder Text hoch und nennst Fach/Thema.
2. Ich erstelle daraus Übungen im Format `content/<fach>/<thema>/exercises/*.json` und speichere das Original in `materials/`.
3. Der Validator prüft die Übungsdateien automatisch. Danach ist die Aufgabe direkt auf der Website sichtbar.
4. Öffne die Website lokal mit einem einfachen Webserver oder veröffentliche sie über GitHub Pages.

## Ordnerstruktur

```text
content/<fach>/<thema>/
  index.json                  # Titel, Beschreibung und Reihenfolge
  exercises/<kennung>.json    # genau eine Übung mit Metadaten
materials/<fach>/<thema>/     # hochgeladene Quellen (optional, nicht öffentlich)
scripts/validate-content.mjs  # prüft alle Übungsdateien
```

## Neue Übung hinzufügen

1. Kopiere `content/templates/exercise.template.json` nach `content/<fach>/<thema>/exercises/`.
2. Vergib eine eindeutige `id`, bearbeite Inhalt und Lösung.
3. Führe `node scripts/validate-content.mjs` aus.

Für den bequemen Weg brauchst du nur das Material hier hochzuladen. Ich lege die Datei und den passenden Eintrag an. Bei der Einbindung in GitHub wird daraus ein Commit bzw. Pull Request.

## Veröffentlichen mit GitHub Pages

In GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**. Die Seite verwendet nur HTML, CSS und JavaScript und braucht keinen Build-Schritt.

> Hinweis: Unterrichtsmaterial kann persönlich oder urheberrechtlich geschützt sein. Behalte `materials/` privat und veröffentliche nur Übungen, die auf der Website stehen sollen.
