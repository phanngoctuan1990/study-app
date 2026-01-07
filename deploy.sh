#!/bin/bash
# deploy.sh - One-click deploy to GitHub Pages
# Sử dụng: ./deploy.sh

set -e

echo "🔄 Building app..."
npm run build

echo "📤 Deploying to GitHub Pages..."
npm run deploy

echo ""
echo "✅ Deploy thành công!"
echo "🌐 Truy cập: https://phanngoctuan1990.github.io/study-app/"
echo ""
