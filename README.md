# 🎒 Jamie's persönliche Lernplattform (Astro Edition) 🌟

Willkommen auf Jamies interaktiver Lernplattform! Gebaut mit modernem **[Astro](https://astro.build)** für blitzschnelle Ladezeiten, modulare Komponenten und kinderleichte Erweiterbarkeit.

Die Plattform kann sowohl **lokal auf dem Mac** genutzt als auch kostenlos auf **GitHub Pages** bereitgestellt werden (z.B. für das iPad oder Smartphone).

---

## 🌟 Was ist alles enthalten?

### 1. 📅 Interaktiver Stundenplan & Ranzen-Checker ([src/pages/index.astro](file:///Users/jakobkrey/Desktop/Jamies%20Lernplattform/src/pages/index.astro))
- **Exakter Wochenstundenplan (Montag bis Freitag)**
- **Ansichten**: Ganze Woche, Einzeltag-Fokus mit Uhrzeiten & Pausen, dynamischer Ranzen-Check.
- **Fach-Details & Modals**: Mit einem Klick auf eine Stunde öffnen sich Packlisten, Lerntipps und Direktlinks zum Üben.
- **Konfetti & Soundeffekte**: Bei vollem Ranzen ertönt eine Fanfare und Jamie erhält Belohnungs-Sterne!

### 2. 🇬🇧 Englisch-Abenteuer ([src/pages/englisch.astro](file:///Users/jakobkrey/Desktop/Jamies%20Lernplattform/src/pages/englisch.astro))
- **3D-Vokabelkarten** für Tiere (*Animals*), Farben (*Colors*), Schule (*School*) und Essen (*Food*).
- **🔊 Echte Audio-Sprachausgabe**: Jamie kann auf den Lautsprecher tippen und hört die korrekte englische Aussprache.
- **Sterne-Belohnung**: Für jedes gelernte Wort gibt es Punkte.

### 3. 🔢 Mathe-Dschungel ([src/pages/mathe.astro](file:///Users/jakobkrey/Desktop/Jamies%20Lernplattform/src/pages/mathe.astro))
- **Kopfrechen-Trainer**:
  - ➕ Plusaufgaben bis 20
  - ➖ Minusaufgaben bis 20
  - ✖️ 1x1 Einmaleins-Training
  - 🎯 Rechnen im Zahlenraum bis 100
- **Streak-Counter & Belohnung**: Bei Serien regnet es Bonus-Sterne!

### 4. 📖 Deutsch-Wortschatz ([src/pages/deutsch.astro](file:///Users/jakobkrey/Desktop/Jamies%20Lernplattform/src/pages/deutsch.astro))
- **Interaktive Lernkarten**:
  - 🏷️ Wortarten (Nomen = Namenwörter, Verben = Tunwörter, Adjektive = Wie-Wörter)
  - ⚡ Doppelte Mitlaute (*Sonne, Wasser, Ball, Rennen*)
  - 🎶 Silben schwingen (*Schmet-ter-ling, Kro-ko-dil*)
- Erklärungen und wichtige Rechtschreibregeln auf einen Blick.

### 5. ⚡ Pokémon-Arena & Sammelalbum ([src/pages/pokemon.astro](file:///Users/jakobkrey/Desktop/Jamies%20Lernplattform/src/pages/pokemon.astro))
- **3D-Hologramm-Karten**: Dynamische Schimmer- und Neigeeffekte beim Bewegen der Maus oder Berühren auf dem Touchscreen!
- **Belohnungssystem**: Mit den im Alltag gesammelten Lern-Sternen kann Jamie neue Pokémon freischalten (Glumanda, Schiggy, Bisasam, Mewtu).

---

## 💾 Wie werden Jamies Fortschritte gespeichert?

Jamies Plattform bietet ein **duales Speichersystem** (erreichbar über das ☁️-Symbol oben rechts neben den Sternen):

1. **Immer aktiv (Lokal im Browser)**:
   - Alle Sterne, Häkchen und freigeschalteten Pokémon werden automatisch im Browser (`localStorage`) gespeichert.
   - **Kostenlos, ohne Registrierung, sofort und offline nutzbar.**
2. **Schnelles Datei-Backup**:
   - Im ☁️-Menü kann mit einem Klick ein Backup als `.json`-Datei heruntergeladen und auf anderen Geräten (z.B. iPad) importiert werden.
3. **Kostenlose Cloud-Datenbank (Supabase)**:
   - Wer möchte, kann in [Supabase](https://supabase.com) ein kostenloses Projekt anlegen (Free Tier) und die URL + Anon-Key im ☁️-Menü eintragen.
   - Jamies Punktestand synchronisiert sich dann **live und automatisch zwischen Mac, iPad und Handy**!

---

## 🚀 Wie starte ich die Plattform?

### Option A: Mac Doppelklick
Einfach die Datei **`start.command`** per Doppelklick öffnen! Sie startet den Astro-Server und öffnet Jamies Plattform im Standardbrowser.

### Option B: Terminal
```bash
npm run dev
```
Öffne anschließend [http://localhost:4321](http://localhost:4321) im Browser.

---

## 🌐 Deployment auf GitHub Pages

Ein automatischer GitHub-Workflow ist bereits eingerichtet unter [`.github/workflows/deploy.yml`](file:///Users/jakobkrey/Desktop/Jamies%20Lernplattform/.github/workflows/deploy.yml).

### Einmalige Schritte auf GitHub:
1. Den Code zu deinem GitHub-Repository pushen:
   ```bash
   git add .
   git commit -m "Migrate to Astro with GitHub Pages and Cloud Sync"
   git remote add origin https://github.com/Jakob-Krey/open.git
   git branch -M main
   git push -u origin main
   ```
2. Im GitHub-Repository auf **Settings ➔ Pages** gehen.
3. Unter **Build and deployment ➔ Source** auswählen: **`GitHub Actions`**.
4. Fertig! Bei jedem `git push` wird die Seite vollautomatisch aktualisiert und ist weltweit unter deiner GitHub-Pages-URL abrufbar.

## Mehrere Kinder (Profile)

Die Seite unterstützt mehrere Kinder über die Adresse:

- `…/` oder `…/?kind=jamie` – Jamie (Standard, alle Seiten)
- `…/?kind=maya` – Maya, 4. Klasse (Start, Übungen mit Klasse-4-Themen, Mathe mit schweren Aufgaben, Englisch, Pokémon, Fokus-Timer)

Das Profil wird im Browser gemerkt. Profile und ihre Rechte stehen in `src/lib/profile.ts`
(ein neues Kind = ein neuer Eintrag dort plus Icons `public/icons/<id>-*.png` und ein
`src/pages/manifest-<id>.webmanifest.ts`).

Getrennt je Kind: Sterne, Pokémon, Favoriten, Übungsblatt-Antworten, Fokus-Timer und der
Cloud-Datensatz (`jamie_data/progress` für Jamie, `jamie_data/progress_<id>` für die anderen).
Gemeinsam: Vokabeln, Übungs-Generator, Pokémon-Karten und alle Verbesserungen. Auf der
Pokémon-Seite sieht man, welche Karten das andere Kind besitzt.

Firestore-Regeln: Die Sammlung `jamie_data` muss für alle Dokumente lesbar und schreibbar sein,
nicht nur für `progress`, zum Beispiel:

```
match /jamie_data/{doc} { allow read, write: if true; }
```

Für Maya als eigene Web-App: Seite in Safari mit `?kind=maya` öffnen und „Zum Home-Bildschirm“ wählen.
