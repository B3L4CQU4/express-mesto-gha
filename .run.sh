#!/bin/sh
brew services start mongodb/brew/mongodb-community
cd dev/express-mesto-gha/
npm run dev