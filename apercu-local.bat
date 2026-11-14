@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js est introuvable. Installez-le depuis https://nodejs.org puis relancez. & pause & exit /b 1)
node build.js || (pause & exit /b 1)
start "" "_site\index.html"
