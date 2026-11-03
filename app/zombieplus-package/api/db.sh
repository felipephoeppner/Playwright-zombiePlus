#!/usr/bin/env bash
set -e

cd -- "$(dirname -- "$0")"

npx sequelize db:migrate:undo:all
npx sequelize db:migrate
npx sequelize db:seed:all
