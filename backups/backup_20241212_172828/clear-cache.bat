@echo off
echo Clearing npm cache...
npm cache clean --force

echo Removing node_modules...
rd /s /q node_modules

echo Removing dist...
rd /s /q dist

echo Removing package-lock.json...
del package-lock.json

echo Installing dependencies...
npm install

echo Building project...
npm run build

echo Done! Cache cleared and project rebuilt.
