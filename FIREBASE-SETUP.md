# Firebase Setup für Obitra (5 Minuten, kostenlos)

Firebase sorgt dafür, dass Chat und Lab für alle User synchron sind.
Ohne Firebase funktioniert die App trotzdem — aber Chat und Lab sind dann nur lokal.

---

## Schritt 1: Firebase Projekt erstellen

1. Gehe auf **https://console.firebase.google.com**
2. Klicke **"Projekt erstellen"**
3. Name: **obitra** (oder was du willst)
4. Google Analytics: kannst du abschalten → **"Projekt erstellen"**

## Schritt 2: Realtime Database erstellen

1. In der linken Sidebar: **"Erstellen" → "Realtime Database"**
2. Klicke **"Datenbank erstellen"**
3. Standort: **europe-west1** (oder was am nächsten ist)
4. Sicherheitsregeln: **"Im Testmodus starten"** → **"Aktivieren"**

⚠️ Testmodus erlaubt jedem Lesen/Schreiben für 30 Tage.
Danach kannst du die Regeln anpassen (siehe unten).

## Schritt 3: Web-App registrieren

1. Auf der Projekt-Übersicht klicke auf das **Web-Symbol (</>)**
2. App-Name: **obitra**
3. Firebase Hosting: **NEIN** (brauchst du nicht, hast Vercel)
4. Klicke **"App registrieren"**
5. Du siehst jetzt den **firebaseConfig** Block — kopiere ihn

## Schritt 4: Config einfügen

Öffne `src/firebase.js` und ersetze den Platzhalter-Block:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",           // ← dein Key
  authDomain: "obitra-xxx.firebaseapp.com",
  databaseURL: "https://obitra-xxx-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "obitra-xxx",
  storageBucket: "obitra-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**Wichtig:** Die `databaseURL` muss auf deine Realtime Database zeigen.
Du findest sie unter Realtime Database → oben steht die URL.

## Schritt 5: Deployen

```bash
cd C:\Users\Andry_Kroeger\Documents\Obitra
npm install
git add .
git commit -m "firebase integration"
git push
```

Fertig! Chat und Lab sind jetzt live synchron für alle User.

---

## Was wird wo gespeichert?

| Daten | Speicher | Geteilt? |
|-------|----------|----------|
| Journal Trades | localStorage | Nein (pro Gerät) |
| Goals | localStorage | Nein (pro Gerät) |
| Settings (Theme, Lang) | localStorage | Nein (pro Gerät) |
| Private Balance | localStorage | Nein (pro Gerät) |
| **Chat Messages** | **Firebase** | **Ja (alle User)** |
| **Lab Galleries + Posts** | **Firebase** | **Ja (alle User)** |

---

## Sicherheitsregeln (nach 30 Tagen)

Wenn der Testmodus abläuft, setze diese Regeln unter
Realtime Database → Regeln:

```json
{
  "rules": {
    "shared": {
      ".read": true,
      ".write": true
    }
  }
}
```

Das erlaubt jedem Lesen/Schreiben nur unter dem `shared/` Pfad.
Für mehr Sicherheit kannst du später Firebase Auth einbauen.

---

## Kosten

Firebase Free Tier (Spark Plan):
- 1 GB Speicher
- 10 GB Transfer/Monat
- 100 gleichzeitige Verbindungen

Für eine Trading-Gruppe mit 5-20 Leuten ist das **mehr als genug**.
Du zahlst **0 €**.
