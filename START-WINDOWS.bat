@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel% equ 0 (
  start "" "http://localhost:4173"
  py -3 -m http.server 4173 --directory dist --bind 127.0.0.1
  goto :eof
)
where python >nul 2>nul
if %errorlevel% equ 0 (
  start "" "http://localhost:4173"
  python -m http.server 4173 --directory dist --bind 127.0.0.1
  goto :eof
)
echo Python was not found. Open dist\index.html for a quick preview,
echo or serve the dist folder with any static web server.
pause
