# 📚 Bài 1: Scale From Zero to Millions of Users

## Giải Thích Concepts + Lab + Tổng Kết

> **Mục tiêu**: Hiểu cách xây dựng hệ thống từ 1 user đến hàng triệu users

---

# PHẦN 1: GIẢI THÍCH CÁC CONCEPTS KHÓ HIỂU 🎯

## 1. Structured Data vs Unstructured Data

### ❓ "Data are unstructured" là gì?

**Structured Data (Dữ liệu có cấu trúc):**

- Dữ liệu được tổ chức theo bảng, có cột rõ ràng
- Ví dụ: Bảng Excel có các cột "Tên", "Tuổi", "Email"

```
| ID | Tên      | Tuổi | Email           |
|----|----------|------|-----------------|
| 1  | Tuấn     | 28   | tuan@email.com  |
| 2  | Hoa      | 25   | hoa@email.com   |
```

**Unstructured Data (Dữ liệu phi cấu trúc):**

- Dữ liệu không có format cố định
- Mỗi record có thể có các fields khác nhau

**🍜 Ví dụ thực tế - Quán Phở:**

| Structured (SQL)                      | Unstructured (NoSQL)                                                        |
| ------------------------------------- | --------------------------------------------------------------------------- |
| Menu cố định: Phở bò, Phở gà, giá 50k | Khách order: "Cho tôi phở bò, thêm hành, ít nước, nhiều thịt, không giá đỗ" |
| Mỗi món có giá cố định                | Mỗi order có yêu cầu riêng                                                  |

**Khi nào dùng gì?**

- **SQL (Structured)**: Đơn hàng, tài khoản ngân hàng - cần chính xác, có quan hệ
- **NoSQL (Unstructured)**: Profile user, log, comments - linh hoạt, thay đổi nhiều

---

## 2. Serialize và Deserialize

### ❓ "Serialize and deserialize data" nghĩa là gì?

**🎁 Ví dụ - Gửi đồ qua bưu điện:**

| Bước     | Tên kỹ thuật    | Ví dụ thực tế                                             |
| -------- | --------------- | --------------------------------------------------------- |
| Đóng gói | **Serialize**   | Bạn muốn gửi chiếc xe đạp → phải tháo rời, đóng vào thùng |
| Mở gói   | **Deserialize** | Người nhận mở thùng → lắp ráp lại thành xe đạp            |

**Trong lập trình:**

```python
# Object trong Python (không thể gửi qua mạng)
user = {
    "id": 1,
    "name": "Tuấn",
    "age": 28
}

# SERIALIZE: Chuyển thành chuỗi JSON (có thể gửi qua mạng)
json_string = '{"id": 1, "name": "Tuấn", "age": 28}'

# DESERIALIZE: Chuyển chuỗi JSON thành object
user = json.loads(json_string)
```

**Tại sao cần?**

- Máy tính khác nhau không thể gửi objects trực tiếp
- Phải "đóng gói" thành text (JSON, XML) để gửi qua mạng
- Bên nhận "mở gói" để dùng lại

---

## 3. DNS (Domain Name System)

### 🎯 Ví dụ - Danh Bạ Điện Thoại:

| Không có DNS          | Có DNS                |
| --------------------- | --------------------- |
| Nhớ số: 14.225.0.35   | Nhớ tên: google.com   |
| Như nhớ số điện thoại | Như tìm trong danh bạ |

**Flow thực tế:**

```
Bạn gõ "facebook.com"
    → DNS tìm: "facebook.com là IP nào?"
    → Trả về: 157.240.1.35
    → Trình duyệt kết nối đến 157.240.1.35
```

---

## 4. Load Balancer

### 🎯 Ví dụ - Điều Phối Viên Tại Ngân Hàng:

**Không có Load Balancer:**

- 100 khách hàng xếp hàng 1 quầy
- Nhân viên quá tải, khách hàng chờ lâu

**Có Load Balancer:**

- Bảo vệ (Load Balancer) đứng cửa
- Điều khách đến quầy nào đang trống
- 3 quầy phục vụ 100 khách nhanh hơn

```
              Load Balancer
                   |
        ┌──────────┼──────────┐
        ↓          ↓          ↓
    Server 1   Server 2   Server 3
```

**Lợi ích:**

- ✅ Không server nào bị quá tải
- ✅ Nếu 1 server chết, 2 server còn lại vẫn chạy
- ✅ Thêm server dễ dàng khi cần

---

## 5. Database Replication (Master-Slave)

### 🎯 Ví dụ - Cửa Hàng & Chi Nhánh:

| Master (Cửa hàng chính) | Slave (Chi nhánh)         |
| ----------------------- | ------------------------- |
| Nhập hàng, cập nhật giá | Chỉ bán hàng              |
| Quản lý kho             | Đọc thông tin từ hệ thống |
| **Write operations**    | **Read operations**       |

**Tại sao cần?**

- Đọc data (Read) nhiều hơn ghi data (Write) - thường 90% Read, 10% Write
- Master xử lý Write → Slave copy data → Slave phục vụ Read
- Giảm tải cho Master, tăng tốc độ đọc

```
         Write
           ↓
       [Master DB]
           |
    ───────┼───────
    ↓      ↓      ↓
 [Slave] [Slave] [Slave]
    ↑      ↑      ↑
        Read
```

---

## 6. Cache

### 🎯 Ví dụ - Quán Cà Phê:

**Không có Cache:**

- Khách order "Cà phê sữa"
- Nhân viên pha mới từ đầu (5 phút)

**Có Cache:**

- Nhân viên pha sẵn 10 ly cà phê sữa
- Khách order → Lấy ly có sẵn (10 giây)
- Hết hàng → Pha thêm

| Thuật ngữ              | Ý nghĩa                                   |
| ---------------------- | ----------------------------------------- |
| **Cache Hit**          | Có sẵn trong cache → trả ngay             |
| **Cache Miss**         | Không có → query database → lưu vào cache |
| **TTL (Time To Live)** | Thời gian cà phê còn tươi (1 giờ)         |
| **Eviction**           | Đổ bỏ cà phê nguội                        |

---

## 7. CDN (Content Delivery Network)

### 🎯 Ví dụ - Chuỗi Cửa Hàng Tiện Lợi:

**Không có CDN:**

- Bạn ở Hà Nội, mua hàng từ kho Sài Gòn
- Đợi 3 ngày vận chuyển

**Có CDN:**

- Hàng được đặt sẵn ở cửa hàng tiện lợi gần nhà
- Mua xong về luôn

| Server gốc (Origin) | CDN Edge Server          |
| ------------------- | ------------------------ |
| Kho chính Sài Gòn   | Cửa hàng tiện lợi Hà Nội |
| Lưu tất cả hàng     | Lưu hàng hay mua         |
| Xa khách hàng       | Gần khách hàng           |

**CDN cache gì?**

- ✅ Images, videos
- ✅ CSS, JavaScript files
- ✅ Static HTML
- ❌ Không cache data động (giỏ hàng, đơn hàng)

---

## 8. Stateless vs Stateful

### 🎯 Ví dụ - Quán Ăn:

**Stateful (Nhớ khách):**

- Phục vụ A nhớ khách thích ít đường
- Khách đến → Phải gặp đúng phục vụ A
- Phục vụ A nghỉ → Khách phải nói lại sở thích

**Stateless (Không nhớ, tra sổ):**

- Sở thích khách được ghi trong app
- Bất kỳ phục vụ nào cũng tra app được
- Phục vụ nào nghỉ cũng không sao

```
Stateful:  Khách → Luôn đến Server 1 (có session)
Stateless: Khách → Bất kỳ server nào (tra database/Redis)
```

**Tại sao Stateless tốt hơn?**

- ✅ Dễ thêm/bớt server
- ✅ Server chết → user tự động sang server khác
- ✅ Scale dễ dàng

---

## 9. Vertical vs Horizontal Scaling

### 🎯 Ví dụ - Vận Chuyển Hàng:

| Vertical Scaling                       | Horizontal Scaling                          |
| -------------------------------------- | ------------------------------------------- |
| Mua xe tải to hơn                      | Mua thêm nhiều xe tải nhỏ                   |
| **Scale Up**                           | **Scale Out**                               |
| Nâng cấp RAM, CPU                      | Thêm nhiều servers                          |
| Có giới hạn (xe to nhất là bao nhiêu?) | Không giới hạn (mua bao nhiêu xe cũng được) |
| Đơn giản nhưng đắt                     | Phức tạp nhưng linh hoạt                    |

**Thực tế:**

- **Startup nhỏ**: Vertical (đơn giản)
- **Scale lớn**: Horizontal (không bị giới hạn)

---

## 10. Database Sharding

### 🎯 Ví dụ - Thư Viện Lớn:

**Không Sharding:**

- 1 triệu sách trong 1 phòng
- Tìm sách = Mò kim đáy bể

**Có Sharding:**

- Phòng A: Sách tên tác giả A-F
- Phòng B: Sách tên tác giả G-M
- Phòng C: Sách tên tác giả N-Z
- Tìm sách của "Nguyễn Nhật Ánh" → Vào phòng C

```
user_id % 4 = ?
├── 0 → Shard 0
├── 1 → Shard 1
├── 2 → Shard 2
└── 3 → Shard 3
```

**Sharding Key quan trọng:**

- Chọn key phân tán đều data
- Thường dùng: user_id, order_id

---

## 11. Message Queue

### 🎯 Ví dụ - Quán Trà Sữa:

**Không có Queue:**

- Nhân viên nhận order → Pha ngay → Trả khách
- Khách đông → Xếp hàng dài, nhân viên quá tải

**Có Message Queue:**

- Nhân viên A nhận order → Viết vào giấy, đặt lên quầy (Queue)
- Nhân viên B lấy giấy → Pha trà sữa
- Khách nhận số, ngồi chờ → Gọi số khi xong

| Producer           | Queue            | Consumer          |
| ------------------ | ---------------- | ----------------- |
| Nhân viên thu ngân | Chồng giấy order | Nhân viên pha chế |
| Web Server         | Kafka/RabbitMQ   | Worker            |

**Lợi ích:**

- ✅ **Decoupling**: Thu ngân & pha chế làm độc lập
- ✅ **Buffer**: Đông khách → Chồng giấy cao lên, không ai bị overload
- ✅ **Async**: Khách không cần đứng chờ

---

# PHẦN 2: BÀI LAB THỰC HÀNH 🧪

## Lab: Xây Dựng Kiến Trúc Scale Từ Zero

### Mục tiêu Lab

- Setup hệ thống với Load Balancer, 2 App Servers, Cache, Database Master-Slave
- Hiểu cách các components kết nối với nhau
- Test failover và caching

### Yêu cầu

- Docker Desktop đã cài đặt
- Kiến thức cơ bản về Docker Compose

### Cấu trúc thư mục

```
scale-lab/
├── docker-compose.yml
├── nginx/
│   └── nginx.conf
├── app/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
└── README.md
```

### Bước 1: Tạo thư mục dự án

```bash
mkdir -p scale-lab/{nginx,app}
cd scale-lab
```

### Bước 2: Tạo App Server (Node.js)

**File: `app/package.json`**

```json
{
  "name": "scale-demo",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "ioredis": "^5.3.2",
    "pg": "^8.11.3"
  }
}
```

**File: `app/server.js`**

```javascript
const express = require("express");
const Redis = require("ioredis");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;
const SERVER_ID = process.env.SERVER_ID || "unknown";

// Redis connection (Cache)
const redis = new Redis({
  host: "redis",
  port: 6379,
});

// PostgreSQL connection (Database)
const pool = new Pool({
  host: "postgres-master",
  database: "testdb",
  user: "postgres",
  password: "postgres123",
  port: 5432,
});

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    server: SERVER_ID,
    timestamp: new Date().toISOString(),
  });
});

// Demo: Get user with caching
app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const cacheKey = `user:${userId}`;

  try {
    // 1. Check cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`[${SERVER_ID}] Cache HIT for user ${userId}`);
      return res.json({
        source: "cache",
        server: SERVER_ID,
        data: JSON.parse(cached),
      });
    }

    // 2. Cache miss - query database
    console.log(`[${SERVER_ID}] Cache MISS for user ${userId}`);
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3. Store in cache for 60 seconds
    await redis.setex(cacheKey, 60, JSON.stringify(result.rows[0]));

    res.json({
      source: "database",
      server: SERVER_ID,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Demo: Create user (Write to master)
app.post("/user", async (req, res) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );

    console.log(`[${SERVER_ID}] Created user: ${result.rows[0].id}`);
    res.json({
      server: SERVER_ID,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Show which server handled the request
app.get("/", (req, res) => {
  res.json({
    message: "Scale Demo API",
    server: SERVER_ID,
    endpoints: ["GET /health", "GET /user/:id", "POST /user"],
  });
});

app.listen(PORT, () => {
  console.log(`[${SERVER_ID}] Server running on port ${PORT}`);
});
```

**File: `app/Dockerfile`**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY server.js .

CMD ["node", "server.js"]
```

### Bước 3: Cấu hình Nginx Load Balancer

**File: `nginx/nginx.conf`**

```nginx
upstream app_servers {
    # Round-robin load balancing
    server app1:3000;
    server app2:3000;
}

server {
    listen 80;

    location / {
        proxy_pass http://app_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Bước 4: Docker Compose

**File: `docker-compose.yml`**

```yaml
version: "3.8"

services:
  # Load Balancer
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app1
      - app2

  # App Server 1
  app1:
    build: ./app
    environment:
      - SERVER_ID=SERVER-1
    depends_on:
      - redis
      - postgres-master

  # App Server 2
  app2:
    build: ./app
    environment:
      - SERVER_ID=SERVER-2
    depends_on:
      - redis
      - postgres-master

  # Cache Layer (Redis)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # Database Master
  postgres-master:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres123
      - POSTGRES_DB=testdb
    ports:
      - "5432:5432"
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
```

**File: `init.sql`** (Khởi tạo database)

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email) VALUES
    ('Nguyen Van A', 'a@example.com'),
    ('Tran Thi B', 'b@example.com'),
    ('Le Van C', 'c@example.com');
```

### Bước 5: Chạy Lab

```bash
# 1. Start all services
docker-compose up -d --build

# 2. Wait for services to be ready
sleep 10

# 3. Test Load Balancer - Chạy 5 lần, xem server nào xử lý
for i in {1..5}; do
  curl -s http://localhost:8080/ | jq '.server'
done

# 4. Test Caching
# Lần 1: Cache MISS (query database)
curl -s http://localhost:8080/user/1 | jq '.'

# Lần 2: Cache HIT (từ Redis)
curl -s http://localhost:8080/user/1 | jq '.'

# 5. Test Create User (Write)
curl -X POST http://localhost:8080/user \
  -H "Content-Type: application/json" \
  -d '{"name": "New User", "email": "new@example.com"}' | jq '.'

# 6. Stop one server - Test failover
docker-compose stop app1

# Vẫn hoạt động với app2
curl -s http://localhost:8080/ | jq '.server'

# 7. Cleanup
docker-compose down -v
```

### Bài tập mở rộng

1. **Thêm Server thứ 3**: Sửa docker-compose.yml và nginx.conf
2. **Test Cache TTL**: Đợi 60s và gọi lại, quan sát cache miss
3. **Thêm Database Slave**: Setup PostgreSQL replication

---

# PHẦN 3: TỔNG KẾT NỘI DUNG CỐT LÕI 📋

## 7 Điểm Cần Nhớ

### 1️⃣ Single Server → Scale Architecture

```
[User] → [DNS] → [Load Balancer] → [Web Servers] → [Cache] → [Database]
```

### 2️⃣ Vertical vs Horizontal Scaling

- **Vertical**: Nâng cấp 1 máy (giới hạn)
- **Horizontal**: Thêm nhiều máy (không giới hạn)

### 3️⃣ Load Balancer

- Phân tải đều đến các servers
- Failover khi server chết
- Public IP → Private IPs

### 4️⃣ Database Replication

- **Master**: Write operations
- **Slave**: Read operations (copy từ Master)
- Tỷ lệ thường: 1 Master, nhiều Slaves

### 5️⃣ Cache (Redis/Memcached)

- Lưu data hay truy cập vào memory
- Nhanh hơn database 100-1000x
- TTL để data không bị cũ

### 6️⃣ CDN

- Đặt static files gần user
- Giảm latency, tăng tốc load
- Cache: images, CSS, JS, videos

### 7️⃣ Stateless Architecture

- Không lưu state trong server
- State lưu ở Redis/Database
- Dễ scale, dễ failover

---

## Checklist Áp Dụng Vào Công Việc

| Câu hỏi                     | Khi nào cần            | Giải pháp                    |
| --------------------------- | ---------------------- | ---------------------------- |
| App chậm, 1 server quá tải? | Traffic tăng           | Load Balancer + thêm servers |
| Database là bottleneck?     | Query chậm             | Cache + DB Replication       |
| Static files load chậm?     | Users xa server        | CDN                          |
| Session bị mất khi restart? | Scale web tier         | Stateless + Redis sessions   |
| Database quá lớn?           | > 1TB data             | Sharding                     |
| Tasks chạy lâu?             | Video encoding, emails | Message Queue                |

---

## Sơ Đồ Kiến Trúc Hoàn Chỉnh

```
                        ┌─────────────────────────────────────────────────┐
                        │                    USERS                        │
                        │            (Web Browser / Mobile App)           │
                        └─────────────────────────┬───────────────────────┘
                                                  │
                                                  ▼
                        ┌─────────────────────────────────────────────────┐
                        │                     DNS                         │
                        │              (api.mysite.com → IP)              │
                        └─────────────────────────┬───────────────────────┘
                                                  │
                        ┌─────────────────────────┴───────────────────────┐
                        │                                                  │
                        ▼                                                  ▼
    ┌───────────────────────────────────┐          ┌──────────────────────────────┐
    │              CDN                  │          │       LOAD BALANCER          │
    │     (Static: JS, CSS, Images)     │          │      (Nginx, HAProxy)        │
    └───────────────────────────────────┘          └──────────────┬───────────────┘
                                                                  │
                                        ┌─────────────────────────┼─────────────────────────┐
                                        │                         │                         │
                                        ▼                         ▼                         ▼
                              ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
                              │   Web Server 1  │       │   Web Server 2  │       │   Web Server 3  │
                              │  (Stateless)    │       │  (Stateless)    │       │  (Stateless)    │
                              └────────┬────────┘       └────────┬────────┘       └────────┬────────┘
                                       │                         │                         │
                                       └─────────────────────────┼─────────────────────────┘
                                                                 │
                                       ┌─────────────────────────┼─────────────────────────┐
                                       │                         │                         │
                                       ▼                         ▼                         ▼
                              ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
                              │    CACHE        │       │  MESSAGE QUEUE  │       │   DATABASE      │
                              │    (Redis)      │       │    (Kafka)      │       │   (PostgreSQL)  │
                              └─────────────────┘       └────────┬────────┘       └────────┬────────┘
                                                                 │                         │
                                                                 ▼                   ┌─────┴─────┐
                                                        ┌─────────────────┐          │           │
                                                        │    WORKERS      │    ┌─────┴─────┐ ┌───┴───┐
                                                        │ (Async Tasks)   │    │  Master   │ │ Slave │
                                                        └─────────────────┘    │  (Write)  │ │(Read) │
                                                                               └───────────┘ └───────┘
```

---

_Bài học tiếp theo: Back-of-the-envelope Estimation (Ngày 3)_
