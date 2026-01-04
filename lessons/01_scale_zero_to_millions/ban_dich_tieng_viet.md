# 📖 Scale From Zero to Millions of Users

## Bản Dịch Tiếng Việt - ByteByteGo Chapter 2

> **Nguồn gốc**: [ByteByteGo - Scale From Zero to Millions of Users](https://bytebytego.com/courses/system-design-interview/scale-from-zero-to-millions-of-users)

---

Thiết kế một hệ thống hỗ trợ hàng triệu người dùng là thách thức lớn, và đó là một hành trình đòi hỏi sự tinh chỉnh liên tục và cải tiến không ngừng. Trong chương này, chúng ta sẽ xây dựng một hệ thống hỗ trợ một người dùng duy nhất và dần dần mở rộng nó để phục vụ hàng triệu người dùng.

---

## 1. Thiết Lập Single Server (Máy Chủ Đơn)

"Hành trình vạn dặm bắt đầu từ một bước chân" - xây dựng hệ thống phức tạp cũng không khác. Để bắt đầu đơn giản, mọi thứ chạy trên một máy chủ duy nhất: web app, database, cache, v.v.

### Request Flow (Luồng Request)

1. **Users truy cập websites thông qua domain names** (ví dụ: api.mysite.com). Thông thường, Domain Name System (DNS) là dịch vụ trả phí do bên thứ 3 cung cấp, không được host trên servers của chúng ta.

2. **IP address được trả về cho browser hoặc mobile app**. Ví dụ: IP 15.125.23.214.

3. **Khi có IP address, các HTTP requests được gửi trực tiếp đến web server**.

4. **Web server trả về HTML pages hoặc JSON response** để rendering.

### Traffic Source (Nguồn Traffic)

Traffic đến web server đến từ hai nguồn:

- **Web application**: Sử dụng kết hợp ngôn ngữ server-side (Java, Python, v.v.) để xử lý business logic, storage, v.v., và ngôn ngữ client-side (HTML và JavaScript) cho presentation.

- **Mobile application**: HTTP protocol là giao thức giao tiếp giữa mobile app và web server. JSON là format API response phổ biến để truyền dữ liệu.

**Ví dụ API Response (JSON):**

```json
GET /users/12 – Lấy thông tin user có id = 12

{
   "id": 12,
   "firstName": "John",
   "lastName": "Smith",
   "address": {
      "streetAddress": "21 2nd Street",
      "city": "New York",
      "state": "NY",
      "postalCode": 10021
   },
   "phoneNumbers": [
      "212 555-1234",
      "646 555-4567"
   ]
}
```

---

## 2. Database

Với sự tăng trưởng của user base, một server không đủ, và chúng ta cần nhiều servers: một cho web/mobile traffic, một cho database. **Tách web/mobile traffic (web tier) và database (data tier) servers cho phép chúng scale độc lập.**

### Chọn Database Nào?

Bạn có thể chọn giữa **relational database** (quan hệ) và **non-relational database** (phi quan hệ).

**Relational databases** (RDBMS hoặc SQL database):

- Các database phổ biến: MySQL, Oracle, PostgreSQL
- Lưu trữ dữ liệu trong tables và rows
- Có thể thực hiện JOIN operations giữa các tables

**Non-Relational databases** (NoSQL):

- Các database phổ biến: CouchDB, Neo4j, Cassandra, HBase, Amazon DynamoDB
- Được chia thành 4 loại: key-value stores, graph stores, column stores, document stores
- Thường không hỗ trợ JOIN operations

**Khi nào dùng NoSQL?**

- Ứng dụng yêu cầu **độ trễ cực thấp** (super-low latency)
- Dữ liệu **phi cấu trúc** (unstructured), không có quan hệ
- Chỉ cần **serialize và deserialize data** (JSON, XML, YAML)
- Cần lưu trữ **lượng dữ liệu khổng lồ**

---

## 3. Vertical Scaling vs Horizontal Scaling

**Vertical scaling (Scale up)**: Thêm nhiều power (CPU, RAM, v.v.) vào servers hiện có.

**Horizontal scaling (Scale out)**: Thêm nhiều servers vào pool of resources.

### Hạn chế của Vertical Scaling:

- Có **giới hạn cứng** - không thể thêm CPU và memory vô hạn vào một server
- **Không có failover và redundancy** - nếu server chết, website/app chết theo

**Horizontal scaling phù hợp hơn cho ứng dụng quy mô lớn** do các hạn chế của vertical scaling.

---

## 4. Load Balancer

**Load balancer phân phối đều incoming traffic** đến các web servers trong load-balanced set.

### Cách hoạt động:

- Users kết nối đến **public IP** của load balancer
- Web servers **không thể truy cập trực tiếp** từ clients (bảo mật hơn)
- **Private IPs** được sử dụng cho giao tiếp giữa các servers

### Lợi ích:

- **Failover**: Nếu server 1 offline, traffic tự động chuyển sang server 2
- **Scalability**: Dễ dàng thêm servers khi traffic tăng
- **No single point of failure**: Website không bị down khi 1 server chết

---

## 5. Database Replication

> "Database replication có thể được sử dụng trong nhiều database management systems, thường với quan hệ master/slave giữa bản gốc (master) và các bản sao (slaves)" - Wikipedia

### Master Database:

- Chỉ hỗ trợ **write operations**
- Nhận tất cả data-modifying commands: INSERT, DELETE, UPDATE

### Slave Database:

- Nhận bản sao data từ master
- Chỉ hỗ trợ **read operations**
- Số lượng slaves thường lớn hơn masters (vì read nhiều hơn write)

### Lợi ích:

- **Better performance**: Writes vào master, reads phân tán qua slaves → xử lý nhiều queries song song
- **Reliability**: Data được replicate qua nhiều locations, không sợ mất data khi có thiên tai
- **High availability**: Website vẫn hoạt động dù một database offline

### Khi Database Offline:

- **Slave offline**: Reads chuyển tạm sang master hoặc slaves khác
- **Master offline**: Một slave được promote thành master mới (phức tạp hơn, có thể cần chạy data recovery scripts)

---

## 6. Cache

**Cache là vùng lưu trữ tạm thời** lưu kết quả của các responses tốn kém hoặc data được truy cập thường xuyên trong memory, giúp các requests tiếp theo được phục vụ nhanh hơn.

### Cache Tier

Cache tier là **tầng data store tạm thời, nhanh hơn database rất nhiều**.

**Read-through cache strategy:**

1. Web server kiểm tra cache trước
2. Nếu có (cache hit) → trả về ngay
3. Nếu không có (cache miss) → query database → lưu vào cache → trả về

**Ví dụ Memcached APIs:**

```python
SECONDS = 1
cache.set('myKey', 'hi there', 3600 * SECONDS)
cache.get('myKey')
```

### Considerations khi dùng Cache:

- **Khi nào dùng**: Data được read thường xuyên nhưng ít modify
- **Expiration policy**: Không quá ngắn (reload nhiều), không quá dài (data cũ)
- **Consistency**: Giữ data store và cache đồng bộ
- **Mitigating failures**: Nhiều cache servers tránh SPOF (Single Point of Failure)
- **Eviction Policy**: LRU (Least Recently Used), LFU (Least Frequently Used), FIFO

---

## 7. Content Delivery Network (CDN)

**CDN là mạng lưới các servers phân tán địa lý** để phân phối static content như images, videos, CSS, JavaScript files.

### Cách CDN hoạt động:

1. User request image từ CDN URL
2. Nếu CDN không có → request từ origin server
3. Origin trả về image với HTTP header TTL (Time-to-Live)
4. CDN cache image và trả về cho user
5. User tiếp theo request → trả từ cache (nếu chưa hết TTL)

### Considerations:

- **Cost**: CDN tính phí theo data transfer, cân nhắc những gì đáng cache
- **Cache expiry**: Không quá dài (content cũ), không quá ngắn (reload nhiều)
- **CDN fallback**: Có phương án backup khi CDN outage
- **Invalidating files**: Dùng APIs của CDN vendors hoặc object versioning (image.png?v=2)

---

## 8. Stateless Web Tier

Để scale web tier horizontally, cần **di chuyển state ra khỏi web tier**.

### Stateful Architecture (Có trạng thái):

- Server nhớ client data từ request này sang request khác
- User A phải luôn được route đến Server 1 (vì đó là nơi lưu session của A)
- **Vấn đề**: Khó thêm/bớt servers, khó handle server failures

### Stateless Architecture (Không trạng thái):

- Server **không giữ state information**
- State data được lưu trong **shared data store** (Redis, database)
- HTTP requests từ users có thể gửi đến **bất kỳ web server nào**
- **Đơn giản hơn, robust hơn, scalable hơn**

---

## 9. Data Centers

Khi website phát triển và thu hút users quốc tế, cần **hỗ trợ multiple data centers** để cải thiện availability và user experience.

### GeoDNS Routing:

- Users được route đến data center gần nhất
- Ví dụ: x% traffic ở US-East, (100-x)% ở US-West

### Thách thức Multi-Data Center:

- **Traffic redirection**: Dùng GeoDNS để direct traffic
- **Data synchronization**: Replicate data across data centers
- **Test and deployment**: Test ở nhiều locations, dùng automated deployment tools

---

## 10. Message Queue

**Message queue là component bền vững, lưu trong memory**, hỗ trợ giao tiếp bất đồng bộ (asynchronous communication).

### Kiến trúc cơ bản:

- **Producers/Publishers**: Tạo messages và publish vào queue
- **Consumers/Subscribers**: Kết nối queue và thực hiện actions

### Lợi ích Decoupling:

- Producer có thể post message khi consumer unavailable
- Consumer có thể read messages khi producer unavailable
- Producer và consumer **scale độc lập**

**Ví dụ**: Photo processing

- Web servers publish jobs vào queue
- Photo processing workers pick up jobs và xử lý bất đồng bộ
- Queue lớn → thêm workers; Queue trống → giảm workers

---

## 11. Logging, Metrics, Automation

Khi site phát triển lớn, cần đầu tư vào các tools này:

### Logging:

- Monitor error logs để identify errors và problems
- Aggregate logs vào centralized service để dễ search và viewing

### Metrics:

- **Host level**: CPU, Memory, disk I/O
- **Aggregated level**: Performance của database tier, cache tier
- **Business metrics**: Daily active users, retention, revenue

### Automation:

- **Continuous integration**: Verify code check-in qua automation
- Automate build, test, deploy process

---

## 12. Database Scaling

### Vertical Scaling (Scale Up):

- Thêm power (CPU, RAM, DISK) vào machine hiện có
- Ví dụ: Amazon RDS có server với 24 TB RAM
- **Hạn chế**:
  - Có hardware limits
  - Greater risk of SPOF
  - Chi phí cao

### Horizontal Scaling (Sharding):

- Thêm nhiều servers
- Tách large databases thành các shards nhỏ hơn
- Mỗi shard có cùng schema nhưng data khác nhau

**Ví dụ**: Sharding theo user_id

- user_id % 4 = 0 → Shard 0
- user_id % 4 = 1 → Shard 1
- ...

### Thách thức của Sharding:

**Resharding data**: Cần khi:

- Single shard không thể hold thêm data
- Uneven data distribution (shard exhaustion)
- Giải pháp: Consistent hashing

**Celebrity problem (Hotspot key)**:

- Data của celebrities (Katy Perry, Justin Bieber) tập trung vào 1 shard
- Giải pháp: Allocate separate shard cho celebrity, có thể cần partition thêm

**Join and de-normalization**:

- Khó perform join operations across shards
- Giải pháp: De-normalize database

---

## 13. Millions of Users and Beyond

Scaling là **iterative process**. Tổng kết các kỹ thuật để scale đến millions of users:

| Kỹ thuật                                 | Mục đích                    |
| ---------------------------------------- | --------------------------- |
| Keep web tier **stateless**              | Dễ scale horizontally       |
| Build **redundancy** at every tier       | Failover, high availability |
| **Cache** data as much as you can        | Giảm tải database, tăng tốc |
| Support **multiple data centers**        | Phục vụ users toàn cầu      |
| Host **static assets in CDN**            | Giảm latency                |
| Scale data tier by **sharding**          | Handle data lớn             |
| **Split tiers into individual services** | Microservices               |
| **Monitor** and use **automation tools** | Proactive operations        |

---

## Tài Liệu Tham Khảo

1. [Hypertext Transfer Protocol](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol)
2. [Should you go Beyond Relational Databases?](https://blog.teamtreehouse.com/should-you-go-beyond-relational-databases)
3. [Replication (computing)](<https://en.wikipedia.org/wiki/Replication_(computing)>)
4. [Multi-master replication](https://en.wikipedia.org/wiki/Multi-master_replication)
5. [NDB Cluster Replication](https://dev.mysql.com/doc/refman/8.4/en/mysql-cluster-replication-multi-source.html)
6. [Caching Strategies and How to Choose the Right One](https://codeahoy.com/2017/08/11/caching-strategies-and-how-to-choose-the-right-one/)
7. [Scaling Memcache at Facebook](https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf)
8. [Single point of failure](https://en.wikipedia.org/wiki/Single_point_of_failure)
9. [Amazon CloudFront Dynamic Content Delivery](https://aws.amazon.com/cloudfront/dynamic-content/)
10. [Configure Sticky Sessions for Your Classic Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-sticky-sessions.html)
11. [Active-Active for Multi-Regional Resiliency](https://netflixtechblog.com/active-active-for-multi-regional-resiliency-c47719f6685b)
12. [Amazon EC2 High Memory Instances](https://aws.amazon.com/ec2/instance-types/high-memory/)
13. [What it takes to run Stack Overflow](http://nickcraver.com/blog/2013/11/22/what-it-takes-to-run-stack-overflow)
14. [What The Heck Are You Actually Using NoSQL For](http://highscalability.com/blog/2010/12/6/what-the-heck-are-you-actually-using-nosql-for.html)

---

_Bản dịch này được tạo để hỗ trợ học tập. Nội dung gốc thuộc về ByteByteGo._
