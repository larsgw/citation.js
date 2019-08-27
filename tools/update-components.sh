#!/usr/bin/env bash

cd node_modules/
PACKAGES=$(npm outdated --parseable | cut -d: -f4 | grep '^@citation-js' | tr "\n" " ")
cd ..

npm i $PACKAGES --save-exact
