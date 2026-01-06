# 📚 Bài 2: Back-of-the-envelope Estimation

## Giải Thích Concepts + Lab + Tổng Kết

> **Mục tiêu**: Học cách ước tính nhanh capacity và performance của hệ thống

---

# PHẦN 1: GIẢI THÍCH CÁC CONCEPTS KHÓ HIỂU 🎯

## 1. Back-of-the-envelope Estimation là gì?

### ❓ Tại sao gọi là "Back of the envelope" (Mặt sau của phong bì)?

**🎯 Ví dụ thực tế - Tính tiền ăn:**

Bạn đi ăn với 5 người bạn, mỗi người gọi món khác nhau. Thay vì cộng chính xác từng món, bạn **ước tính nhanh**:

- "Mỗi người khoảng 100k" → 6 người × 100k = ~600k

Đó chính là **back-of-the-envelope estimation** - ước tính nhanh, đủ chính xác để ra quyết định, không cần máy tính.

**Trong System Design:**

> "Estimation là quá trình ước tính bằng thought experiments và performance numbers để biết design nào đáp ứng được yêu cầu" - Jeff Dean, Google

---

## 2. Power of Two (Lũy thừa của 2)

### ❓ Tại sao cần biết Power of 2?

Máy tính hoạt động dựa trên hệ nhị phân (binary), nên data units đều là lũy thừa của 2.

### 📊 Bảng Power of Two (PHẢI NHỚ!)

| Power | Giá trị                         | Tên gọi    | Viết tắt | Ví dụ thực tế          |
| ----- | ------------------------------- | ---------- | -------- | ---------------------- |
| 2^10  | ~1,000 (1 Nghìn)                | 1 Kilobyte | 1 KB     | 1 trang text           |
| 2^20  | ~1,000,000 (1 Triệu)            | 1 Megabyte | 1 MB     | 1 bức ảnh              |
| 2^30  | ~1,000,000,000 (1 Tỷ)           | 1 Gigabyte | 1 GB     | 1 bộ phim              |
| 2^40  | ~1,000,000,000,000 (1 Nghìn Tỷ) | 1 Terabyte | 1 TB     | 1000 bộ phim           |
| 2^50  | ~1 Triệu Tỷ                     | 1 Petabyte | 1 PB     | Toàn bộ YouTube 1 ngày |

### 🍜 Ví dụ - Quán Phở:

| Unit | Ví dụ                        |
| ---- | ---------------------------- |
| 1 KB | Đơn hàng 1 tô phở (text nhỏ) |
| 1 MB | Menu có hình ảnh             |
| 1 GB | Video quảng cáo quán         |
| 1 TB | Camera an ninh lưu 1 tháng   |

### 💡 Mẹo nhớ nhanh:

```
Mỗi 10 lũy thừa = Nhân thêm 1000 lần
KB → MB → GB → TB → PB
  ×1000  ×1000  ×1000  ×1000
```

---

## 3. Latency Numbers Every Programmer Should Know

### ❓ Latency là gì?

**Latency = Thời gian chờ** để một operation hoàn thành.

### 🎯 Ví dụ - Các loại "chờ" trong cuộc sống:

| Operation                  | Latency           | Ví dụ đời thường        |
| -------------------------- | ----------------- | ----------------------- |
| L1 Cache                   | 0.5 ns            | Nhớ lại tên mình        |
| RAM                        | 100 ns            | Nhớ lại số điện thoại   |
| SSD Read                   | 16,000 ns = 16 μs | Mở sổ tay tìm thông tin |
| HDD Seek                   | 10 ms             | Đi tìm sách trong kệ    |
| Network (Same DC)          | 500 μs            | Hỏi người bàn bên cạnh  |
| Network (CA → Netherlands) | 150 ms            | Gọi điện quốc tế        |

### 📊 Bảng Latency Numbers (PHẢI NHỚ!)

| Operation                | Thời gian         | So sánh                 |
| ------------------------ | ----------------- | ----------------------- |
| L1 cache reference       | 0.5 ns            | Cực nhanh               |
| L2 cache reference       | 7 ns              | 14× chậm hơn L1         |
| Main memory (RAM)        | 100 ns            | 200× chậm hơn L1        |
| SSD random read          | 16,000 ns = 16 μs | 32,000× chậm hơn L1     |
| Read 1 MB from memory    | 250 μs            |                         |
| Round trip in datacenter | 500 μs            |                         |
| Disk seek (HDD)          | 10 ms             | 20 triệu × chậm hơn L1  |
| Read 1 MB from network   | 10 ms             |                         |
| Read 1 MB from disk      | 30 ms             |                         |
| CA → Netherlands → CA    | 150 ms            | 300 triệu × chậm hơn L1 |

### 💡 Kết luận quan trọng:

```
┌─────────────────────────────────────────────────────────────┐
│  1. Memory NHANH, Disk CHẬM                                 │
│  2. Tránh disk seeks nếu có thể → Dùng Cache!               │
│  3. Nén data trước khi gửi qua mạng                         │
│  4. Data centers ở xa = Latency cao                         │
│  5. SSD nhanh hơn HDD 100-1000×                             │
└─────────────────────────────────────────────────────────────┘
```

### 🎨 Đơn vị thời gian:

```
ns (nanosecond)  = 10^-9 seconds = 0.000000001 giây
μs (microsecond) = 10^-6 seconds = 1,000 ns
ms (millisecond) = 10^-3 seconds = 1,000 μs = 1,000,000 ns
```

---

## 4. Availability Numbers (Số khả dụng)

### ❓ Availability là gì?

**Availability = % thời gian hệ thống hoạt động**

| Availability | Nghĩa là                    |
| ------------ | --------------------------- |
| 99%          | Hệ thống down 3.65 ngày/năm |
| 99.9%        | Hệ thống down 8.76 giờ/năm  |
| 99.99%       | Hệ thống down 52.6 phút/năm |
| 99.999%      | Hệ thống down 5.26 phút/năm |

### 🎯 Ví dụ - SLA của Cloud Providers:

| Provider       | SLA    |
| -------------- | ------ |
| AWS EC2        | 99.99% |
| Google Compute | 99.99% |
| Azure          | 99.99% |

### 📊 Bảng Availability (PHẢI NHỚ!)

| Availability       | Downtime/Ngày | Downtime/Tuần | Downtime/Tháng | Downtime/Năm  |
| ------------------ | ------------- | ------------- | -------------- | ------------- |
| 99% (2 nines)      | 14.4 phút     | 1.68 giờ      | 7.31 giờ       | **3.65 ngày** |
| 99.9% (3 nines)    | 1.44 phút     | 10.1 phút     | 43.8 phút      | **8.76 giờ**  |
| 99.99% (4 nines)   | 8.64 giây     | 1.01 phút     | 4.38 phút      | **52.6 phút** |
| 99.999% (5 nines)  | 864 ms        | 6.05 giây     | 26.3 giây      | **5.26 phút** |
| 99.9999% (6 nines) | 86.4 ms       | 604 ms        | 2.63 giây      | **31.6 giây** |

### 🍜 Ví dụ - Quán Phở:

| Availability | Downtime/Năm | Ví dụ                           |
| ------------ | ------------ | ------------------------------- |
| 99%          | 3.65 ngày    | Quán nghỉ Tết 3-4 ngày          |
| 99.9%        | 8.76 giờ     | Quán mất điện vài lần/năm       |
| 99.99%       | 52.6 phút    | Quán chỉ nghỉ sửa máy POS       |
| 99.999%      | 5.26 phút    | Quán gần như không bao giờ nghỉ |

---

## 5. QPS (Queries Per Second)

### ❓ QPS là gì?

**QPS = Số requests server nhận được mỗi giây**

### 📐 Công thức tính QPS:

```
QPS = (Số users hoạt động) × (Số actions/user/ngày) / (24 × 3600)
                                                         │
                                              86,400 giây/ngày
```

### 🎯 Ví dụ - Tính QPS cho Twitter:

**Giả định:**

- 300 triệu monthly active users (MAU)
- 50% dùng hàng ngày → 150 triệu daily active users (DAU)
- Mỗi user post 2 tweets/ngày

**Tính toán:**

```
QPS = 150,000,000 × 2 / 86,400
    = 300,000,000 / 86,400
    ≈ 3,500 QPS

Peak QPS = 2 × QPS = 7,000 QPS
```

### 💡 Mẹo tính nhanh:

```
86,400 giây/ngày ≈ 100,000 (làm tròn để tính nhanh)

Vậy: QPS ≈ (DAU × actions/day) / 100,000
```

---

## 6. Storage Estimation (Ước tính lưu trữ)

### 📐 Công thức:

```
Daily Storage = DAU × actions/day × avg_size × % có media
Yearly Storage = Daily Storage × 365
N-year Storage = Yearly Storage × N
```

### 🎯 Ví dụ - Tính Storage cho Twitter:

**Giả định:**

- 150 triệu DAU
- 2 tweets/ngày
- 10% tweets có media (ảnh/video)
- Avg media size = 1 MB
- Lưu trữ 5 năm

**Tính toán:**

```
Daily media storage = 150M × 2 × 10% × 1 MB
                    = 30,000,000 MB
                    = 30 TB/ngày

5-year storage = 30 TB × 365 × 5
               = 54,750 TB
               ≈ 55 PB
```

---

# PHẦN 2: BÀI LAB THỰC HÀNH 🧪

## Lab: Ước Tính Capacity Cho Hệ Thống Thực Tế

### Mục tiêu Lab

- Thực hành ước tính QPS, Storage, Bandwidth
- Áp dụng các con số latency vào quyết định design
- Tính toán availability requirements

### Bài tập 1: Ước tính cho hệ thống Instagram-like

**Yêu cầu**: Thiết kế hệ thống photo sharing với specs:

- 500 triệu MAU
- 60% dùng hàng ngày
- Mỗi user xem 20 ảnh/ngày
- Mỗi user upload 1 ảnh/2 ngày
- Avg photo size = 2 MB
- Lưu trữ 10 năm

**Bài giải:**

```
📊 Bước 1: Tính DAU
DAU = 500M × 60% = 300 triệu

📊 Bước 2: Tính Read QPS (xem ảnh)
Read QPS = 300M × 20 / 86,400
         = 6,000,000,000 / 86,400
         ≈ 70,000 QPS

Peak Read QPS = 2 × 70,000 = 140,000 QPS

📊 Bước 3: Tính Write QPS (upload ảnh)
Upload/ngày = 300M × 0.5 = 150M ảnh/ngày
Write QPS = 150M / 86,400 ≈ 1,700 QPS

Peak Write QPS = 2 × 1,700 = 3,400 QPS

📊 Bước 4: Tính Daily Storage
Daily storage = 150M × 2 MB = 300 TB/ngày

📊 Bước 5: Tính 10-year Storage
10-year storage = 300 TB × 365 × 10
                = 1,095,000 TB
                ≈ 1.1 EB (Exabyte)

📊 Bước 6: Tính Bandwidth
Upload bandwidth = 300 TB / 86,400 = 3.5 GB/s
Download bandwidth = (300M × 20 × 2 MB) / 86,400
                   = 12,000 TB / 86,400
                   = 140 GB/s
```

### Bài tập 2: So sánh Storage Options

Dựa vào latency numbers, quyết định storage nào phù hợp:

| Scenario                       | Storage Choice      | Lý do                         |
| ------------------------------ | ------------------- | ----------------------------- |
| Session data (đọc mỗi request) | Redis (Memory)      | 100ns vs 10ms disk            |
| User profile                   | Database + Cache    | Đọc nhiều, cache thường xuyên |
| Photos                         | Object Storage (S3) | Large files, ít đọc lại       |
| Video streaming                | CDN                 | Giảm latency cho users        |
| Logs                           | HDD/Cold storage    | Truy cập không thường xuyên   |

### Bài tập 3: Tính Availability cần thiết

**Scenario**: E-commerce website, doanh thu 10 tỷ/ngày

| Availability | Downtime/năm | Mất doanh thu |
| ------------ | ------------ | ------------- |
| 99%          | 3.65 ngày    | ~100 triệu    |
| 99.9%        | 8.76 giờ     | ~4 triệu      |
| 99.99%       | 52.6 phút    | ~360 nghìn    |
| 99.999%      | 5.26 phút    | ~36 nghìn     |

**Kết luận**: E-commerce cần ít nhất **99.9%** availability.

### Bài tập 4: Cheat Sheet Calculator (Python)

```python
#!/usr/bin/env python3
"""
Back-of-the-envelope Estimation Calculator
"""

# Constants
SECONDS_PER_DAY = 86_400
SECONDS_PER_YEAR = 365 * SECONDS_PER_DAY

# Data Units
KB = 1024
MB = 1024 * KB
GB = 1024 * MB
TB = 1024 * GB
PB = 1024 * TB

def calculate_qps(dau: int, actions_per_day: float) -> dict:
    """Calculate QPS and Peak QPS"""
    qps = dau * actions_per_day / SECONDS_PER_DAY
    return {
        "QPS": round(qps),
        "Peak QPS (2x)": round(qps * 2),
        "Peak QPS (10x)": round(qps * 10)
    }

def calculate_storage(
    dau: int,
    items_per_day: float,
    avg_size_bytes: int,
    years: int
) -> dict:
    """Calculate storage requirements"""
    daily_bytes = dau * items_per_day * avg_size_bytes
    yearly_bytes = daily_bytes * 365
    total_bytes = yearly_bytes * years

    return {
        "Daily Storage": f"{daily_bytes / TB:.2f} TB",
        "Yearly Storage": f"{yearly_bytes / PB:.2f} PB",
        f"{years}-Year Storage": f"{total_bytes / PB:.2f} PB"
    }

def calculate_bandwidth(daily_storage_bytes: int) -> dict:
    """Calculate bandwidth from daily storage"""
    bytes_per_second = daily_storage_bytes / SECONDS_PER_DAY
    return {
        "Bandwidth": f"{bytes_per_second / GB:.2f} GB/s",
        "Peak Bandwidth (2x)": f"{bytes_per_second * 2 / GB:.2f} GB/s"
    }

def availability_downtime(availability_percent: float) -> dict:
    """Calculate downtime from availability"""
    downtime_percent = 100 - availability_percent
    downtime_seconds_year = (downtime_percent / 100) * SECONDS_PER_YEAR

    return {
        "Availability": f"{availability_percent}%",
        "Downtime/year": format_time(downtime_seconds_year),
        "Downtime/month": format_time(downtime_seconds_year / 12),
        "Downtime/day": format_time(downtime_seconds_year / 365)
    }

def format_time(seconds: float) -> str:
    """Format seconds to human readable"""
    if seconds >= 86400:
        return f"{seconds / 86400:.2f} days"
    elif seconds >= 3600:
        return f"{seconds / 3600:.2f} hours"
    elif seconds >= 60:
        return f"{seconds / 60:.2f} minutes"
    elif seconds >= 1:
        return f"{seconds:.2f} seconds"
    else:
        return f"{seconds * 1000:.2f} ms"

# Example: Twitter-like system
if __name__ == "__main__":
    print("=" * 50)
    print("Twitter-like System Estimation")
    print("=" * 50)

    MAU = 300_000_000
    DAU = int(MAU * 0.5)  # 50% daily active
    TWEETS_PER_DAY = 2
    MEDIA_PERCENT = 0.1
    MEDIA_SIZE = 1 * MB
    STORAGE_YEARS = 5

    print(f"\nAssumptions:")
    print(f"  MAU: {MAU:,}")
    print(f"  DAU: {DAU:,}")
    print(f"  Tweets/day: {TWEETS_PER_DAY}")
    print(f"  Media percent: {MEDIA_PERCENT * 100}%")

    print(f"\nQPS Estimation:")
    qps = calculate_qps(DAU, TWEETS_PER_DAY)
    for k, v in qps.items():
        print(f"  {k}: {v:,}")

    print(f"\nStorage Estimation (Media only):")
    storage = calculate_storage(
        DAU,
        TWEETS_PER_DAY * MEDIA_PERCENT,
        MEDIA_SIZE,
        STORAGE_YEARS
    )
    for k, v in storage.items():
        print(f"  {k}: {v}")

    print(f"\nAvailability Comparison:")
    for avail in [99, 99.9, 99.99, 99.999]:
        result = availability_downtime(avail)
        print(f"  {result['Availability']}: {result['Downtime/year']} downtime/year")
```

---

# PHẦN 3: TỔNG KẾT NỘI DUNG CỐT LÕI 📋

## 6 Điểm Cần Nhớ

### 1️⃣ Power of Two

```
2^10 = 1 KB  (Nghìn)
2^20 = 1 MB  (Triệu)
2^30 = 1 GB  (Tỷ)
2^40 = 1 TB  (Nghìn tỷ)
2^50 = 1 PB  (Triệu tỷ)
```

### 2️⃣ Latency Numbers (So sánh tương đối)

```
Memory (RAM)    : 100 ns      ← NHANH
SSD             : 16,000 ns   ← 160× chậm hơn RAM
HDD Seek        : 10,000,000 ns ← 100,000× chậm hơn RAM
Network (globe) : 150,000,000 ns ← 1,500,000× chậm hơn RAM
```

### 3️⃣ Availability Numbers (Nines)

```
99%     → 3.65 ngày downtime/năm
99.9%   → 8.76 giờ downtime/năm
99.99%  → 52.6 phút downtime/năm
99.999% → 5.26 phút downtime/năm
```

### 4️⃣ QPS Calculation

```
QPS = DAU × actions_per_day / 86,400
Peak QPS = QPS × 2 (hoặc × 10 cho critical systems)
```

### 5️⃣ Storage Calculation

```
Daily = DAU × items/day × size × media_percent
Yearly = Daily × 365
N-year = Yearly × N
```

### 6️⃣ Tips Khi Ước Tính

```
✅ Làm tròn số cho dễ tính: 86,400 → 100,000
✅ Ghi rõ assumptions
✅ Ghi rõ đơn vị (KB, MB, GB)
✅ Process quan trọng hơn kết quả chính xác
```

---

## Cheat Sheet - Số Liệu Cần Nhớ

```
┌─────────────────────────────────────────────────────────────┐
│                    QUICK REFERENCE                           │
├─────────────────────────────────────────────────────────────┤
│ Seconds/day    : 86,400    (≈ 100,000 để tính nhanh)        │
│ Seconds/month  : 2.6M      (≈ 2,500,000)                    │
│ Seconds/year   : 31.5M     (≈ 30,000,000)                   │
├─────────────────────────────────────────────────────────────┤
│ 1 ASCII char   : 1 byte                                      │
│ 1 Unicode char : 2-4 bytes                                   │
│ 1 Integer      : 4-8 bytes                                   │
│ 1 Tweet (text) : ~140 bytes                                  │
│ 1 Photo (avg)  : 1-2 MB                                      │
│ 1 Video (1min) : 50-100 MB                                   │
├─────────────────────────────────────────────────────────────┤
│ RAM latency    : ~100 ns                                     │
│ SSD latency    : ~100 μs (1,000× RAM)                        │
│ HDD latency    : ~10 ms  (100,000× RAM)                      │
│ Network (DC)   : ~500 μs                                     │
│ Network (globe): ~150 ms                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Áp Dụng Vào Công Việc

| Câu hỏi                | Cách ước tính                               |
| ---------------------- | ------------------------------------------- |
| Server cần bao nhiêu?  | QPS / capacity_per_server                   |
| Storage cần bao nhiêu? | DAU × items × size × years                  |
| Cần cache không?       | Nếu read từ DB > 10ms và read nhiều → Cache |
| Cần CDN không?         | Nếu users ở nhiều regions → CDN             |
| SLA bao nhiêu?         | Tính cost of downtime → Chọn nines phù hợp  |

---

_Bài học tiếp theo: A Framework for System Design Interviews (Ngày 4)_
