#!/bin/bash

echo "Setting up Supabase project..."

git clone --filter=blob:none --no-checkout https://github.com/supabase/supabase

cd supabase || exit

git sparse-checkout init --cone
git sparse-checkout set docker
git checkout master

cd ..

mkdir -p supabase-project

cp -rf supabase/docker/* supabase-project
cp supabase/docker/.env.example supabase-project/.env

cd supabase-project || exit

docker compose pull

echo "Run: sh ./utils/generate-keys.sh"
echo ""
echo "Supabase setup complete!"
echo "Run this to start Supabase:"
echo "cd supabase-project"
echo ""
echo "docker compose up -d"