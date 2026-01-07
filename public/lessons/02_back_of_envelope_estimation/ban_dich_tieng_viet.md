# 📖 Back-of-the-envelope Estimation

## Bản Dịch Tiếng Việt - ByteByteGo Chapter 3

> **Nguồn gốc**: [ByteByteGo - Back-of-the-envelope Estimation](https://bytebytego.com/courses/system-design-interview/back-of-the-envelope-estimation)

---

Trong phỏng vấn system design, đôi khi bạn được yêu cầu ước tính system capacity hoặc performance requirements bằng phương pháp **back-of-the-envelope estimation**. Theo Jeff Dean, Google Senior Fellow, "back-of-the-envelope calculations là những ước tính bạn tạo ra bằng cách kết hợp thought experiments và common performance numbers để có cảm nhận tốt về design nào sẽ đáp ứng được requirements của bạn" [1].

Bạn cần có kiến thức tốt về scalability basics để thực hiện back-of-the-envelope estimation một cách hiệu quả. Các concepts sau đây cần được hiểu rõ: **power of two** [2], **latency numbers every programmer should know**, và **availability numbers**.

---

## 1. Power of Two (Lũy thừa của 2)

Mặc dù data volume có thể trở nên khổng lồ khi làm việc với distributed systems, nhưng tất cả tính toán đều quy về basics. Để có được calculations chính xác, điều quan trọng là phải biết data volume unit sử dụng power of 2.

**Một byte là một chuỗi 8 bits. Một ký tự ASCII sử dụng 1 byte memory (8 bits).**

Dưới đây là bảng giải thích data volume unit:

### 📊 Table 1: Data Volume Units

| Power | Giá trị xấp xỉ           | Tên đầy đủ | Viết tắt |
| ----- | ------------------------ | ---------- | -------- |
| 10    | 1 Thousand (Nghìn)       | 1 Kilobyte | 1 KB     |
| 20    | 1 Million (Triệu)        | 1 Megabyte | 1 MB     |
| 30    | 1 Billion (Tỷ)           | 1 Gigabyte | 1 GB     |
| 40    | 1 Trillion (Nghìn tỷ)    | 1 Terabyte | 1 TB     |
| 50    | 1 Quadrillion (Triệu tỷ) | 1 Petabyte | 1 PB     |

---

## 2. Latency Numbers Every Programmer Should Know

Dr. Dean từ Google đã công bố thời gian của các computer operations điển hình vào năm 2010 [1]. Một số con số đã outdated vì máy tính ngày càng nhanh và mạnh hơn. Tuy nhiên, những con số này vẫn có thể cho chúng ta ý tưởng về sự nhanh chậm của các computer operations khác nhau.

### 📊 Table 2: Latency Numbers

| Operation Name                                 | Time                    |
| ---------------------------------------------- | ----------------------- |
| L1 cache reference                             | 0.5 ns                  |
| Branch mispredict                              | 5 ns                    |
| L2 cache reference                             | 7 ns                    |
| Mutex lock/unlock                              | 100 ns                  |
| Main memory reference                          | 100 ns                  |
| Compress 1K bytes with Zippy                   | 10,000 ns = 10 μs       |
| Send 2K bytes over 1 Gbps network              | 20,000 ns = 20 μs       |
| Read 1 MB sequentially from memory             | 250,000 ns = 250 μs     |
| Round trip within the same datacenter          | 500,000 ns = 500 μs     |
| Disk seek                                      | 10,000,000 ns = 10 ms   |
| Read 1 MB sequentially from the network        | 10,000,000 ns = 10 ms   |
| Read 1 MB sequentially from disk               | 30,000,000 ns = 30 ms   |
| Send packet CA (California) → Netherlands → CA | 150,000,000 ns = 150 ms |

### Notes về đơn vị thời gian:

```
ns = nanosecond    (nano giây)
μs = microsecond   (micro giây)
ms = millisecond   (mili giây)

1 ns = 10^-9 seconds
1 μs = 10^-6 seconds = 1,000 ns
1 ms = 10^-3 seconds = 1,000 μs = 1,000,000 ns
```

### 📊 Figure 1: Visualized Latency Numbers (2020)

> **Mô tả**: Biểu đồ so sánh thời gian của các operations khác nhau trong hệ thống máy tính và mạng. Các ô vuông có kích thước tỷ lệ với thời gian của mỗi operation.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                    LATENCY COMPARISON (2020)                               │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ■ L1 cache (1ns)                     Rất nhỏ, gần như tức thời           │
│                                                                            │
│  ■■ L2 cache (4ns)                                                         │
│                                                                            │
│  ■■■■ Main memory (100ns)                                                  │
│                                                                            │
│  ████████ SSD random read (16μs)                                           │
│                                                                            │
│  ████████████████ Send 2KB over network (44μs)                             │
│                                                                            │
│  ████████████████████████████████ Round trip in DC (500μs)                 │
│                                                                            │
│  ████████████████████████████████████████████████ Disk seek (10ms)         │
│                                                                            │
│  ████████████████████████████████████████████████████████████████████████  │
│  CA → Netherlands → CA (150ms)                                             │
│                                                                            │
└───────────────────────────────────────────────────────────────────────────┘
```

### Kết luận từ phân tích các con số:

Bằng cách phân tích các con số trong Figure 1, chúng ta rút ra các kết luận sau:

- **Memory is fast but the disk is slow.** (Memory nhanh nhưng disk chậm)

- **Avoid disk seeks if possible.** (Tránh disk seeks nếu có thể)

- **Simple compression algorithms are fast.** (Thuật toán nén đơn giản rất nhanh)

- **Compress data before sending it over the internet if possible.** (Nén data trước khi gửi qua internet nếu có thể)

- **Data centers are usually in different regions, and it takes time to send data between them.** (Data centers thường ở các regions khác nhau, và cần thời gian để gửi data giữa chúng)

---

## 3. Availability Numbers (Số khả dụng)

**High availability** là khả năng của một hệ thống hoạt động liên tục trong một khoảng thời gian dài mong muốn. High availability được đo bằng phần trăm, với **100% nghĩa là service có 0 downtime**. Hầu hết các services nằm trong khoảng 99% và 100%.

### Service Level Agreement (SLA)

**Service level agreement (SLA)** là thuật ngữ thường được sử dụng bởi service providers. Đây là thỏa thuận giữa bạn (service provider) và khách hàng, và thỏa thuận này chính thức định nghĩa mức uptime mà service của bạn sẽ cung cấp.

Các cloud providers lớn:

- **Amazon** [4] - SLA: 99.9% trở lên
- **Google** [5] - SLA: 99.9% trở lên
- **Microsoft** [6] - SLA: 99.9% trở lên

**Uptime traditionally được đo bằng "nines"**. Càng nhiều nines, càng tốt.

### 📊 Table 3: Availability và Downtime

| Availability % | Downtime/Day        | Downtime/Week | Downtime/Month | Downtime/Year     |
| -------------- | ------------------- | ------------- | -------------- | ----------------- |
| 99%            | 14.40 minutes       | 1.68 hours    | 7.31 hours     | **3.65 days**     |
| 99.99%         | 8.64 seconds        | 1.01 minutes  | 4.38 minutes   | **52.60 minutes** |
| 99.999%        | 864.00 milliseconds | 6.05 seconds  | 26.30 seconds  | **5.26 minutes**  |
| 99.9999%       | 86.40 milliseconds  | 604.80 ms     | 2.63 seconds   | **31.56 seconds** |

---

## 4. Example: Estimate Twitter QPS and Storage Requirements

> **Lưu ý**: Các con số sau đây chỉ dành cho bài tập này và không phải là số liệu thực tế từ Twitter.

### Assumptions (Giả định):

- **300 million** monthly active users (300 triệu MAU)
- **50%** of users use Twitter daily (50% dùng hàng ngày)
- Users post **2 tweets** per day on average (Trung bình 2 tweets/ngày)
- **10%** of tweets contain media (10% tweets có media)
- Data is stored for **5 years** (Lưu trữ 5 năm)

### Estimations (Ước tính):

#### Query per second (QPS) estimate:

```
Daily active users (DAU) = 300 million × 50% = 150 million

Tweets QPS = 150 million × 2 tweets / 24 hours / 3600 seconds
           = 300,000,000 / 86,400
           ≈ 3,500 QPS

Peak QPS = 2 × QPS = ~7,000 QPS
```

#### Media storage estimate:

Chúng ta chỉ ước tính media storage ở đây.

**Average tweet size:**

- tweet_id: 64 bytes
- text: 140 bytes
- media: 1 MB

```
Media storage per day = 150 million × 2 × 10% × 1 MB
                      = 30,000,000 MB
                      = 30 TB per day

5-year media storage = 30 TB × 365 × 5
                     = 54,750 TB
                     ≈ 55 PB (Petabytes)
```

---

## 5. Tips

Back-of-the-envelope estimation là về **process**. **Solving the problem quan trọng hơn obtaining results.** Interviewers có thể đang test problem-solving skills của bạn.

### Các tips cần tuân theo:

#### 1. Rounding and Approximation (Làm tròn và Xấp xỉ)

Rất khó để thực hiện các phép tính phức tạp trong interview. Ví dụ, kết quả của "99987 / 9.1" là gì? Không cần phải dành thời gian quý báu để giải các bài toán phức tạp.

**Precision không được kỳ vọng.** Sử dụng round numbers và approximation.

> Phép chia trên có thể được đơn giản hóa thành: "100,000 / 10"

#### 2. Write down your assumptions (Ghi lại các giả định)

Ghi lại các assumptions của bạn để tham khảo sau này.

#### 3. Label your units (Ghi rõ đơn vị)

Khi bạn viết "5", nó có nghĩa là 5 KB hay 5 MB? Bạn có thể tự confuse mình. Ghi rõ đơn vị vì "5 MB" giúp loại bỏ sự mơ hồ.

#### 4. Commonly asked estimations (Các estimation thường được hỏi)

- QPS (Queries Per Second)
- Peak QPS
- Storage
- Cache
- Number of servers

Bạn có thể practice các calculations này khi chuẩn bị cho interview. **Practice makes perfect!**

---

## Tổng kết

Congratulations on getting this far! Now give yourself a pat on the back. Good job!

---

## Reference Materials (Tài liệu tham khảo)

1. **J. Dean. Google Pro Tip: Use Back-Of-The-Envelope-Calculations To Choose The Best Design:**
   http://highscalability.com/blog/2011/1/26/google-pro-tip-use-back-of-the-envelope-calculations-to-choo.html

2. **System design primer:**
   https://github.com/donnemartin/system-design-primer

3. **Latency Numbers Every Programmer Should Know:**
   https://colin-scott.github.io/personal_website/research/interactive_latency.html

4. **Amazon Compute Service Level Agreement:**
   https://aws.amazon.com/compute/sla/

5. **Compute Engine Service Level Agreement (SLA):**
   https://cloud.google.com/compute/sla

6. **SLA summary for Azure services:**
   https://azure.microsoft.com/en-us/support/legal/sla/summary/

---

_Bản dịch này được tạo để hỗ trợ học tập. Nội dung gốc thuộc về ByteByteGo._
