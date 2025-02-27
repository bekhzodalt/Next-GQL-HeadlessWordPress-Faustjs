echo "Deploy starting..."
if [ ! -d ".build_temp" ]; then
  echo '\033[31m temp Directory for build does not exist! - Adding\033[0m'  
  mkdir .build_temp
fi

yarn install || exit

BUILD_DIR=.build_temp yarn build || exit


rm -rf .next
mv .build_temp .next
pm2 startOrReload ecosystem.config.js --env $1
pm2 reset all

echo "Deploy done."
