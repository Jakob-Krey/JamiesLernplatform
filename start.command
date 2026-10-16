#!/bin/bash
# Jamie's Lernplattform - Doppelklick-Starter für Mac
cd "$(dirname "$0")"

echo "🌟 Starte Jamie's Lernplattform mit Astro..."

# Starte Astro Dev Server
npm run dev &
DEV_PID=$!

# Kurz warten und Browser öffnen
sleep 2
open "http://localhost:4321"

echo "✨ Jamies Lernplattform läuft auf http://localhost:4321"
echo "Drücke CTRL+C oder schließe dieses Fenster zum Beenden."

wait $DEV_PID
