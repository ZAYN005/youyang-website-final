@echo off
REM Packs an already finished build (.next) for the company server. No rebuilding.
cd /d C:\Users\asus\Projects\youyang-website
if not exist .next\standalone\server.js (
  echo.
  echo ===== No finished build found - run build-for-server.cmd first =====
  goto :eof
)

echo.
echo ===== 2/3  Collecting the finished site into the "deploy" folder =====
if exist deploy rmdir /s /q deploy
xcopy /e /i /q /h /y .next\standalone deploy >nul
if errorlevel 1 goto :error
xcopy /e /i /q /h /y .next\static deploy\.next\static >nul
if errorlevel 1 goto :error
xcopy /e /i /q /h /y public deploy\public >nul
if errorlevel 1 goto :error
xcopy /e /i /q /h /y prisma deploy\prisma >nul
if errorlevel 1 goto :error
if exist deploy\.env del deploy\.env
if exist deploy\uploads rmdir /s /q deploy\uploads
if exist deploy\deploy rmdir /s /q deploy\deploy

echo.
echo ===== 3/3  Packing =====
if exist ..\youyang-build.tar.gz del ..\youyang-build.tar.gz
tar -czf ..\youyang-build.tar.gz -C deploy .
if errorlevel 1 goto :error
dir ..\youyang-build.tar.gz
echo.
echo ===== DONE - now upload ..\youyang-build.tar.gz to the server =====
goto :eof

:error
echo.
echo ===== FAILED - copy the error above and send it to Claude =====
