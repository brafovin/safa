# Finde den Unterschied

Ein Browser-basiertes "Spot the Difference"-Spiel, komplett in HTML, CSS und JavaScript geschrieben. Keine Abhängigkeiten, keine externen Bilder – jede Szene wird prozedural als SVG generiert, sodass du in jedem Durchgang ein neues Bild mit neuen Unterschieden bekommst.

## Spielen

Einfach die `index.html` im Browser öffnen:

```bash
# Beispiel (Linux / macOS)
xdg-open index.html   # oder: open index.html
```

Für lokale Webserver-Umgebungen reicht z. B. `python3 -m http.server` im Projektordner.

## Spielablauf

1. Wähle oben rechts deine Schwierigkeit (3, 5, 8 oder 12 Unterschiede).
2. Klicke **Neues Spiel**, um eine neue Szene zu generieren.
3. Vergleiche **Bild A** und **Bild B** und klicke jeden erkannten Unterschied an – egal in welchem der beiden Bilder.
4. Richtige Treffer werden **grün** markiert, Fehlklicks kurz **rot**.
5. Sobald alle Unterschiede gefunden sind, erscheint ein Ergebnis-Overlay mit deiner Zeit und den Fehlklicks.

## Arten von Unterschieden

Der Generator variiert Objekte der Szene auf fünf Weisen:

- **Farbe** – ein Objekt hat in Bild B eine andere Farbe
- **Größe** – ein Objekt ist vergrößert oder verkleinert
- **Position** – ein Objekt ist leicht verschoben
- **Entfernt** – ein Objekt fehlt in Bild B
- **Hinzugefügt** – ein Objekt kommt nur in Bild B vor

## Dateien

- `index.html` – UI-Gerüst „Finde den Unterschied"
- `style.css` – Layout und Animationen
- `game.js` – Szenen-Generator, Mutationen und Spiellogik

## Messi Memory

Zusätzlich enthält das Projekt ein klassisches Memory-Spiel mit zehn
verschiedenen Messi-Motiven (Trikots von Barcelona, PSG, Inter Miami,
Argentinien und Newell's Old Boys sowie WM-Pokal 2022, Copa América 2021,
Ballon d'Or, Olympia-Gold 2008 und GOAT-Karte).

Einfach `memory.html` im Browser öffnen (oder oben rechts im Unterschiede-Spiel
auf „Messi Memory" klicken).

### Spielablauf

1. Oben rechts die Schwierigkeit wählen (6, 8 oder 10 Paare).
2. Je zwei Karten aufdecken – gleiche Motive bleiben offen, ungleiche werden
   wieder umgedreht.
3. Züge, gefundene Paare und Zeit werden oben mitgezählt.
4. Sind alle Paare gefunden, erscheint ein Ergebnis-Overlay.

### Eigene Fotos verwenden

Die Karten-Rückseiten werden als Inline-SVG gerendert. Um echte Fotos
einzusetzen, einfach in `memory.js` die `svg`-Strings eines Motivs durch ein
`<image href="pfad/zum/bild.jpg" width="300" height="400"/>` innerhalb des
`<svg>`-Tags ersetzen.

### Dateien

- `memory.html` – UI-Gerüst
- `memory.css` – Kartenlayout und 3D-Flip-Animation
- `memory.js` – Motive (SVG), Decks, Spiellogik
