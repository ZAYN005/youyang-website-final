@echo off
REM Builds the website on this laptop and packs it for the company server.
REM Stop "npm run dev" before running this.
cd /d C:\Users\asus\Projects\youyang-website
set PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma
if exist deploy rmdir /s /q deploy
if exist .next rmdir /s /q .next

echo.
echo ===== 1/3  Building (about 4-5 minutes) =====
call npm run build
if errorlevel 1 goto :error

call pack-for-server.cmd
goto :eof

:error
echo.
echo ===== FAILED - copy the error above and send it to Claude =====
