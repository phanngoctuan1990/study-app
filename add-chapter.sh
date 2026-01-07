#!/bin/bash
# add-chapter.sh - Script thêm chương mới vào Study App
# Sử dụng: ./add-chapter.sh <chapter_id> <path_to_docs_folder>

set -e

CHAPTER_ID=$1
DOCS_FOLDER=$2

if [ -z "$CHAPTER_ID" ] || [ -z "$DOCS_FOLDER" ]; then
    echo "❌ Thiếu tham số!"
    echo ""
    echo "Cách sử dụng:"
    echo "  ./add-chapter.sh <chapter_id> <path_to_docs_folder>"
    echo ""
    echo "Ví dụ:"
    echo "  ./add-chapter.sh 02_new_chapter /path/to/docs"
    exit 1
fi

# Tạo thư mục trong public/lessons
TARGET_DIR="public/lessons/${CHAPTER_ID}"
mkdir -p "$TARGET_DIR"

# Copy tất cả file .md vào thư mục
if [ -d "$DOCS_FOLDER" ]; then
    cp "$DOCS_FOLDER"/*.md "$TARGET_DIR/" 2>/dev/null || true
    echo "✅ Đã copy tài liệu vào: $TARGET_DIR"
elif [ -f "$DOCS_FOLDER" ]; then
    cp "$DOCS_FOLDER" "$TARGET_DIR/"
    echo "✅ Đã copy file vào: $TARGET_DIR"
else
    echo "❌ Không tìm thấy: $DOCS_FOLDER"
    exit 1
fi

# Hiển thị các file đã copy
echo ""
echo "📁 Các file trong chương:"
ls -la "$TARGET_DIR"

echo ""
echo "📝 BƯỚC TIẾP THEO:"
echo "   1. Mở file: src/data/lessons.json"
echo "   2. Thêm chapter mới với id: ${CHAPTER_ID}"
echo "   3. Chạy: npm run deploy"
echo ""
