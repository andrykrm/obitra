# Obitra PWA — Deploy Guide

## Was du bekommst

Eine Web-App die sich auf dem iPhone wie eine echte App anfühlt:
eigenes Icon auf dem Home-Bildschirm, Vollbild ohne Safari-UI, Offline-fähig.
Funktioniert auch auf Android, Desktop-Browsern, überall.

Kosten: **0 €**

---

## Schritt 1: Icons generieren

1. Öffne `public/generate-icons.html` in deinem Browser
2. Klicke "Download icon-192.png" und "Download icon-512.png"
3. Speichere beide in den `public/` Ordner

---

## Schritt 2: GitHub Repository erstellen

1. Gehe auf https://github.com → "New Repository"
2. Name: `obitra` (oder was du willst)
3. Public oder Private — beides geht

Dann im Terminal:

```bash
cd obitra-pwa
git init
git add .
git commit -m "Obitra v1"
git remote add origin https://github.com/DEIN_USER/obitra.git
git push -u origin main
```

---

## Schritt 3: Auf Vercel deployen (kostenlos)

1. Gehe auf https://vercel.com → Sign up mit GitHub
2. Klicke "Add New Project"
3. Importiere dein `obitra` Repository
4. Framework: Vite (wird automatisch erkannt)
5. Klicke "Deploy"
6. Fertig! Du bekommst eine URL wie `obitra-xyz.vercel.app`

Jedes Mal wenn du Code auf GitHub pushst, updated Vercel automatisch.

---

## Schritt 4: iPhone App installieren

1. Öffne die Vercel-URL in **Safari** auf dem iPhone
2. Tippe auf das **Teilen-Symbol** (Quadrat mit Pfeil nach oben)
3. Scrolle runter → "**Zum Home-Bildschirm**"
4. Tippe "Hinzufügen"

Fertig! Obitra ist jetzt als App auf deinem iPhone:
- Eigenes Icon (Energy Orb)
- Kein Safari-UI (Vollbild)
- Schwarzer Status-Bar passend zum Design
- Startet wie eine echte App

---

## Schritt 5: Custom Domain (optional)

1. Kaufe eine Domain z.B. auf https://namecheap.com (ab ~8€/Jahr)
   Ideen: `obitra.app`, `obitra.trade`, `obitra.io`
2. In Vercel → Settings → Domains → Domain hinzufügen
3. DNS-Records setzen wie Vercel anzeigt
4. SSL kommt automatisch

---

## Für deine Freunde

Schicke ihnen einfach den Link. Anleitung:

> "Öffne [deine-url] in Safari, tippe auf Teilen → Zum Home-Bildschirm.
> Dann hast du die App."

Jeder loggt sich mit eigenem Username ein.
Alle Journal-Daten sind pro User getrennt.
Chat ist geteilt.

---

## Projektstruktur

```
obitra-pwa/
├── public/
│   ├── manifest.json         ← PWA Config (Name, Icons, Farben)
│   ├── sw.js                 ← Service Worker (Offline-Cache)
│   ├── icon.svg              ← Icon Vorlage
│   ├── generate-icons.html   ← Öffnen → Icons downloaden
│   ├── icon-192.png          ← (musst du generieren)
│   └── icon-512.png          ← (musst du generieren)
├── src/
│   ├── App.jsx               ← Obitra App
│   └── main.jsx              ← React Entry + SW Registration
├── index.html                ← HTML mit iOS PWA Meta-Tags
├── vite.config.js            ← Build Config
├── package.json              ← Dependencies
└── .gitignore
```

---

## Wie Storage funktioniert

In der Claude-Artifact Version: `window.storage` (Claudes API)
In der PWA Version: **localStorage** (Browser-eigener Speicher)

- Daten bleiben auch wenn der Browser geschlossen wird
- Daten bleiben nach App-Neustart
- Daten sind pro Gerät (nicht geräteübergreifend)
- ~5-10MB Speicher verfügbar

Für geräteübergreifenden Sync (z.B. iPhone + Desktop gleiche Trades)
könntest du später Firebase oder Supabase einbauen (beides kostenlos).

---

## TradingView

Der eingebettete Browser funktioniert in der PWA, weil es ein echter Browser ist.
Falls TradingView iframes blockiert, nutzen die User einfach den 
"Im neuen Tab öffnen" Button.

---

## Updates

Du pushst neuen Code auf GitHub → Vercel baut automatisch neu → 
User bekommen beim nächsten Öffnen die neue Version.
Kein manuelles Update nötig.

---

## Kostenübersicht

| Was | Kosten |
|-----|--------|
| Vercel Hosting | Kostenlos (100GB/Monat) |
| GitHub | Kostenlos |
| Domain (optional) | ~8€/Jahr |
| SSL | Kostenlos (automatisch) |
| **Total** | **0 €** (oder 8€/Jahr mit Domain) |

---

## Später: Desktop App

Wenn du auch eine .exe/.dmg willst, nutze das `obitra-desktop.zip` 
Electron-Projekt. Gleicher Code, gleiche App, aber als installierbare 
Desktop-Anwendung.
