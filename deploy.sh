#!/bin/bash
cwd=$(pwd)
echo "🦊 Fetching latest code 🦊"
git stash
git pull origin develop
echo "\n 💥 Refreshing the sub-module 💥"
git submodule update
echo "\n🔧 Installing dependencies 🔧"
npm i
# echo "\n🔧 Installing & 💥 Building custom extensions"
# cd $cwd/custom/s3-to-file-library
# npm i
# npm run build
# cd $cwd
npm install pm2 -g
echo "\n🥂 Restarting the process"
pm2 describe localeyz > /dev/null
RUNNING=$?

if [ "${RUNNING}" -ne 0 ]; then
  pm2 start npm --name "localeyz" -- start
else
  pm2 restart localeyz
fi;