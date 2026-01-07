# Study Review App - Hướng Dẫn Deploy

## 🚀 Deploy Lên GitHub Pages

### Bước 1: Cài đặt dependencies

```bash
cd study-app
npm install
```

### Bước 2: Test trên local

```bash
npm run dev
```

Mở browser: http://localhost:5173

### Bước 3: Build và Deploy

```bash
# Deploy tự động lên GitHub Pages
npm run deploy
```

App sẽ available tại: `https://<username>.github.io/study-app/`

---

## 📚 Thêm Chương Mới

### Bước 1: Tạo folder chương mới

```bash
mkdir -p public/lessons/02_tenChapter
```

### Bước 2: Copy file markdown vào folder

```bash
cp path/to/your/document.md public/lessons/02_tenChapter/
```

### Bước 3: Cập nhật file `src/data/lessons.json`

```json
{
  "chapters": [
    // ... chapter cũ ...
    {
      "id": "02_tenChapter",
      "title": "Tên Chương Hiển Thị",
      "icon": "📊",
      "description": "Mô tả ngắn về chương",
      "documents": [
        {
          "id": "ten_tai_lieu",
          "title": "Tên Tài Liệu Hiển Thị",
          "type": "translation",
          "icon": "📖",
          "file": "ten_tai_lieu.md"
        }
      ]
    }
  ]
}
```

### Bước 4: Deploy lại

```bash
npm run deploy
```

---

## 📝 Cấu Trúc Thư Mục

```
study-app/
├── public/
│   └── lessons/
│       ├── 01_scale_zero_to_millions/
│       │   ├── ban_dich_tieng_viet.md
│       │   └── giai_thich_va_lab.md
│       └── 02_next_chapter/          ← Thêm chapter mới ở đây
│           └── document.md
├── src/
│   └── data/
│       └── lessons.json              ← Cập nhật config ở đây
└── ...
```

---

## ⚡ Script Tự Động Thêm Chương

Chạy script sau để thêm chương mới nhanh chóng:

```bash
#!/bin/bash
# File: add-chapter.sh

CHAPTER_ID=$1
CHAPTER_TITLE=$2
DOC_FILE=$3

# Tạo folder
mkdir -p "public/lessons/${CHAPTER_ID}"

# Copy file
cp "$DOC_FILE" "public/lessons/${CHAPTER_ID}/"

echo "✅ Đã tạo chương: ${CHAPTER_ID}"
echo "📝 Nhớ cập nhật src/data/lessons.json"
```

Sử dụng:

```bash
chmod +x add-chapter.sh
./add-chapter.sh "02_new_chapter" "New Chapter Title" "/path/to/doc.md"
```

---

## ❓ Xử Lý Lỗi Thường Gặp

| Lỗi                   | Nguyên nhân        | Cách sửa                                 |
| --------------------- | ------------------ | ---------------------------------------- |
| 404 khi load document | Đường dẫn file sai | Kiểm tra file có trong `public/lessons/` |
| Trang trắng           | Build lỗi          | Chạy `npm run build` xem lỗi             |
| Deploy failed         | Git conflict       | `git pull` trước khi deploy              |
