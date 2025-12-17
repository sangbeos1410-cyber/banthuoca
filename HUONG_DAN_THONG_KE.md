# Tài Liệu Tính Năng Thống Kê - Đại Lý Bán Thuốc

## 📊 Giới thiệu

Tính năng **Báo cáo thống kê** là một phần mở rộng mới cho hệ thống quản lý đại lý bán thuốc, giúp quản lý và phân tích dữ liệu kinh doanh một cách hiệu quả.

## 🎯 Các chức năng chính

### 1. Tổng quan thống kê
- **Tổng doanh thu**: Hiển thị tổng doanh thu trong khoảng thời gian được chọn
- **Tổng đơn hàng**: Số lượng đơn hàng đã xử lý
- **Sản phẩm đã bán**: Tổng số lượng sản phẩm đã bán ra
- **Giá trị trung bình/Đơn**: Giá trị trung bình của mỗi đơn hàng
- **Giá trị kho**: Tổng giá trị hàng tồn kho hiện tại
- **Tổng hàng trong kho**: Số lượng sản phẩm còn trong kho

### 2. Top sản phẩm bán chạy
- Xếp hạng sản phẩm theo doanh thu
- Hiển thị số lượng bán, số đơn hàng
- Tính toán giá trị trung bình trên mỗi đơn hàng

### 3. Doanh thu theo thời gian
- Phân tích doanh thu theo ngày/tháng/năm
- Hiển thị xu hướng kinh doanh
- Tính toán tổng cộng và giá trị trung bình

### 4. Tình trạng tồn kho
- **Sản phẩm hết hàng**: Danh sách sản phẩm không còn trong kho
- **Sắp hết hàng**: Sản phẩm có số lượng dưới 10
- **Dư thừa kho**: Sản phẩm có số lượng trên 100
- Tổng giá trị tồn kho

### 5. Thống kê nhà cung cấp
- Xếp hạng nhà cung cấp theo số lượng hàng nhập
- Số phiếu nhập kho của từng nhà cung cấp
- Tổng hàng nhập

### 6. Thống kê khách hàng
- Xếp hạng khách hàng theo tổng chi tiêu
- Số đơn hàng của từng khách hàng
- Giá trị trung bình trên mỗi đơn hàng

## 📋 Hướng dẫn cài đặt

### Bước 1: Thêm mã JavaScript

Mở file `script.js` và **thêm toàn bộ nội dung** từ file `statistics-code.js` vào **cuối file** (trước dòng cuối cùng).

```javascript
// ... existing code in script.js ...

// PASTE ALL CODE FROM statistics-code.js HERE

// ... end of script.js ...
```

**Quan trọng**: Cập nhật hàm `showTab()` để hỗ trợ tab thống kê:

Tìm hàm `showTab()` và cập nhật phần `allowed` như sau:

```javascript
function showTab(tab) {
    const role = getCurrentRole();
    const allowed = (function(r){
        if (r === 'admin') return ['buy','catalog','warehouse','users','profile','statistics']; // Thêm 'statistics'
        if (r === 'staff') return ['buy','catalog','warehouse','profile','statistics']; // Thêm 'statistics'
        if (r === 'supplier') return ['warehouse'];
        return ['buy','profile'];
    })(role);
    
    // ... existing code ...
    
    // Thêm dòng này vào cuối hàm
    if (tab === 'statistics') { refreshAllStatistics(); }
}
```

Cập nhật hàm `showShop()` để hiển thị nút thống kê:

```javascript
function showShop() {
    // ... existing code ...
    
    const tabStatisticsBtn = document.getElementById('tab-statistics-btn');
    
    // Hiển thị tab thống kê cho admin và staff
    if (['admin', 'staff'].includes(role)) {
        if (tabStatisticsBtn) tabStatisticsBtn.style.display = 'inline-block';
    } else {
        if (tabStatisticsBtn) tabStatisticsBtn.style.display = 'none';
    }
    
    // ... rest of existing code ...
}
```

### Bước 2: Thêm HTML

Mở file `index.html` và thực hiện các bước sau:

#### 2.1. Thêm nút Thống kê vào Sidebar

Tìm thẻ `<aside class="sidebar">` và thêm nút mới:

```html
<aside class="sidebar" role="navigation" aria-label="Chức năng chính">
  <nav>
    <button class="tab-btn active" onclick="showTab('buy')">🛍️ Mua hàng</button>
    <button class="tab-btn" id="tab-catalog-btn" onclick="showTab('catalog')" style="display:none">📋 Quản lý danh mục</button>
    <button class="tab-btn" id="tab-warehouse-btn" onclick="showTab('warehouse')" style="display:none">📦 Quản lý kho</button>
    <button class="tab-btn" id="tab-users-btn" onclick="showTab('users')" style="display:none">👥 Quản lý nhân viên</button>
    <button class="tab-btn" id="tab-statistics-btn" onclick="showTab('statistics')" style="display:none">📊 Thống kê</button> <!-- THÊM DÒNG NÀY -->
    <button class="tab-btn" onclick="showTab('profile')">⚙️ Đổi thông tin</button>
  </nav>
</aside>
```

#### 2.2. Thêm Section Thống kê

**Copy toàn bộ nội dung** từ file `statistics-html.html` (phần section) và dán vào `<main class="main-content">` **sau section profile** (hoặc section cuối cùng), trước thẻ đóng `</main>`.

### Bước 3: Thêm CSS

Mở file `style.css` và **thêm toàn bộ nội dung** từ file `statistics-styles.css` vào **cuối file**.

```css
/* ... existing styles ... */

/* PASTE ALL CODE FROM statistics-styles.css HERE */
```

## 🎨 Giao diện

Giao diện thống kê được thiết kế với:
- **Cards màu sắc**: Mỗi chỉ số có màu riêng để dễ phân biệt
- **Bảng dữ liệu**: Hiển thị chi tiết với định dạng rõ ràng
- **Responsive**: Tự động điều chỉnh trên mobile và tablet
- **Icons**: Sử dụng emoji để dễ nhận biết

## 🔧 Sử dụng

### Truy cập tính năng thống kê

1. Đăng nhập với tài khoản **Admin** hoặc **Staff**
2. Nhấn vào nút **"📊 Thống kê"** trên sidebar
3. Chọn khoảng thời gian muốn xem (tùy chọn)
4. Nhấn **"🔄 Làm mới"** để cập nhật dữ liệu

### Lọc theo thời gian

- **Từ ngày**: Chọn ngày bắt đầu
- **Đến ngày**: Chọn ngày kết thúc
- **Nhóm theo**: Chọn nhóm dữ liệu theo Ngày/Tháng/Năm

Để xem tất cả dữ liệu, để trống cả hai trường ngày tháng.

### Xuất báo cáo

Nhấn nút **"📄 Xuất báo cáo"** để in hoặc lưu báo cáo dưới dạng PDF.

## 📊 Các chỉ số thống kê

### Chỉ số doanh thu
- **Tổng doanh thu**: Tổng số tiền thu được từ các đơn hàng
- **Giá trị TB/Đơn**: Doanh thu chia cho số đơn hàng

### Chỉ số bán hàng
- **Tổng đơn hàng**: Số lượng đơn hàng đã hoàn thành
- **Sản phẩm đã bán**: Tổng số lượng sản phẩm đã bán

### Chỉ số tồn kho
- **Giá trị kho**: Tổng giá trị các sản phẩm trong kho (số lượng × giá)
- **Tổng hàng trong kho**: Tổng số lượng tất cả sản phẩm

### Cảnh báo tồn kho
- **Hết hàng** (❌): Sản phẩm có số lượng = 0
- **Sắp hết hàng** (⚠️): Sản phẩm có số lượng < 10
- **Dư thừa kho** (📈): Sản phẩm có số lượng > 100

## 🔄 Cập nhật dữ liệu

### Cập nhật tự động
Dữ liệu thống kê được cập nhật tự động khi:
- Có đơn hàng mới được tạo
- Thêm/xóa sản phẩm trong kho
- Tạo phiếu nhập kho mới

### Cập nhật thủ công
Nhấn nút **"🔄 Làm mới"** để cập nhật dữ liệu ngay lập tức.

## 👥 Quyền truy cập

| Vai trò | Quyền truy cập |
|---------|---------------|
| **Admin** | ✅ Xem tất cả thống kê |
| **Staff** | ✅ Xem tất cả thống kê |
| **Supplier** | ❌ Không có quyền |
| **Customer** | ❌ Không có quyền |

## 💡 Mẹo sử dụng

1. **Phân tích xu hướng**: Sử dụng "Doanh thu theo thời gian" để xem xu hướng bán hàng
2. **Quản lý kho**: Thường xuyên kiểm tra "Tình trạng tồn kho" để tránh hết hàng
3. **Đánh giá nhà cung cấp**: Xem "Thống kê nhà cung cấp" để chọn đối tác tốt nhất
4. **Chăm sóc khách hàng**: Sử dụng "Thống kê khách hàng" để ưu đãi khách hàng VIP

## 🐛 Xử lý sự cố

### Không thấy nút Thống kê
- Kiểm tra bạn đã đăng nhập với tài khoản Admin hoặc Staff
- Xóa cache trình duyệt và tải lại trang

### Dữ liệu không hiển thị
- Nhấn nút "🔄 Làm mới"
- Kiểm tra đã có dữ liệu trong hệ thống (đơn hàng, sản phẩm)
- Thử xóa bộ lọc thời gian

### Lỗi JavaScript
- Kiểm tra đã thêm đầy đủ code từ `statistics-code.js`
- Mở Console (F12) để xem thông báo lỗi cụ thể

## 📝 Ghi chú kỹ thuật

### Lưu trữ dữ liệu
- Tất cả dữ liệu được lưu trong `localStorage` của trình duyệt
- Không cần server hoặc database

### Hiệu năng
- Tính toán được thực hiện trên client-side
- Với dữ liệu lớn (>1000 đơn hàng), có thể chậm một chút

### Tương thích
- Hỗ trợ tất cả trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)
- Responsive trên mobile và tablet

## 🔮 Phát triển tương lai

Các tính năng có thể bổ sung:
- [ ] Biểu đồ trực quan (charts)
- [ ] So sánh dữ liệu giữa các khoảng thời gian
- [ ] Thống kê theo danh mục thuốc
- [ ] Dự báo doanh thu
- [ ] Export dữ liệu Excel/CSV
- [ ] Email báo cáo tự động

## 📞 Hỗ trợ

Nếu có thắc mắc hoặc phát hiện lỗi, vui lòng:
1. Kiểm tra lại hướng dẫn cài đặt
2. Xem phần "Xử lý sự cố"
3. Liên hệ với người quản trị hệ thống

---

**Phiên bản**: 1.0.0  
**Ngày cập nhật**: 17/12/2024  
**Tác giả**: GitHub Copilot
