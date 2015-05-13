#!/bin/bash

cd $(dirname $0)/../

# make sure electron-prebuilt is installed
npm install

# make tmp dir
TMPD="$HOME/Desktop/paycoin-electron-build"

rm -rf "$TMPD"
mkdir -p "$TMPD"
cp -r node_modules/electron-prebuilt/dist/ "$TMPD"
mv "$TMPD/Electron.app/" "$TMPD/Paycoin.app/"
APPDIR="$TMPD/Paycoin.app"
mv "$APPDIR/Contents/MacOS/Electron" "$APPDIR/Contents/MacOS/Paycoin"
rm -rf "$APPDIR/Contents/Resources/"
mkdir -p "$APPDIR/Contents/Resources"
cp resources/paycoin.icns "$APPDIR/Contents/Resources/paycoin.icns"
npm rm electron-prebuilt
./node_modules/.bin/asar pack . "$APPDIR/Contents/Resources/app.asar"
PLIST="$APPDIR/Contents/Info.plist"
sed -i "" 's/com.github.electron/com.evanlucas.paycoin/g' "$PLIST"
sed -i "" 's/Electron/Paycoin/g' "$PLIST"
sed -i "" 's/atom.icns/paycoin.icns/g' "$PLIST"
