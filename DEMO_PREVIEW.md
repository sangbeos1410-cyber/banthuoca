# 📊 MẪU DEMO GIAO DIỆN THỐNG KÊ / STATISTICS INTERFACE PREVIEW

## Giao diện tổng quan / Overview Interface

```
╔══════════════════════════════════════════════════════════════════════╗
║                    📊 BÁO CÁO THỐNG KÊ                               ║
╠══════════════════════════════════════════════════════════════════════╣
║  Từ ngày: [2024-01-01]  Đến ngày: [2024-12-17]                      ║
║  Nhóm theo: [Ngày ▼]  [🔄 Làm mới] [📄 Xuất báo cáo]               ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  ┏━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━┓                ║
║  ┃ 💰         ┃  ┃ 📦         ┃  ┃ 💊         ┃                ║
║  ┃ Tổng DT    ┃  ┃ Tổng ĐH    ┃  ┃ SP đã bán  ┃                ║
║  ┃ 15,500,000đ┃  ┃    125     ┃  ┃    450     ┃                ║
║  ┗━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━┛                ║
║                                                                      ║
║  ┏━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━┓                ║
║  ┃ 📊         ┃  ┃ 🏭         ┃  ┃ 📋         ┃                ║
║  ┃ TB/Đơn     ┃  ┃ Giá trị kho┃  ┃ Hàng kho   ┃                ║
║  ┃   124,000đ ┃  ┃ 8,750,000đ ┃  ┃    320     ┃                ║
║  ┗━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━┛                ║
║                                                                      ║
╠══════════════════════════════════════════════════════════════════════╣
║                   🏆 TOP SẢN PHẨM BÁN CHẠY                           ║
╠══════════════════════════════════════════════════════════════════════╣
║  #  │ Tên thuốc           │ SL Bán │ Số ĐH │ Doanh thu   │ TB/Đơn  ║
║─────┼─────────────────────┼────────┼───────┼─────────────┼─────────║
║  1  │ Paracetamol 500mg   │   150  │  45   │ 3,750,000đ  │ 83,333đ ║
║  2  │ Vitamin C 500mg     │   120  │  40   │ 3,840,000đ  │ 96,000đ ║
║  3  │ Decolgen            │   100  │  35   │ 4,200,000đ  │120,000đ ║
║  4  │ Amoxicillin 500mg   │    80  │  30   │ 2,400,000đ  │ 80,000đ ║
║  5  │ Vitamin D3          │    75  │  25   │ 2,250,000đ  │ 90,000đ ║
╠══════════════════════════════════════════════════════════════════════╣
║                   💹 DOANH THU THEO THỜI GIAN                        ║
╠══════════════════════════════════════════════════════════════════════╣
║  Thời gian    │ Số đơn │ Doanh thu    │ TB/Đơn                      ║
║───────────────┼────────┼──────────────┼─────────────────────────────║
║  2024-12-01   │   15   │  1,850,000đ  │  123,333đ                  ║
║  2024-12-02   │   12   │  1,440,000đ  │  120,000đ                  ║
║  2024-12-03   │   18   │  2,160,000đ  │  120,000đ                  ║
║  2024-12-04   │   10   │  1,250,000đ  │  125,000đ                  ║
║  ...          │  ...   │    ...       │    ...                      ║
║───────────────┼────────┼──────────────┼─────────────────────────────║
║  TỔNG CỘNG    │  125   │ 15,500,000đ  │  124,000đ                  ║
╠══════════════════════════════════════════════════════════════════════╣
║                   📦 TÌNH TRẠNG TỒN KHO                              ║
╠══════════════════════════════════════════════════════════════════════╣
║  ┏━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━┓                ║
║  ┃ ⚠️         ┃  ┃ ❌         ┃  ┃ 📈         ┃                ║
║  ┃ Sắp hết    ┃  ┃ Hết hàng   ┃  ┃ Dư thừa    ┃                ║
║  ┃     5      ┃  ┃     2      ┃  ┃     3      ┃                ║
║  ┗━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━┛                ║
║                                                                      ║
║  ❌ Sản phẩm hết hàng (2)                                           ║
║  ┌─────────────────────────────────────────────────────────────┐   ║
║  │ Tên thuốc          │ Giá      │ Danh mục │ Kho thực         │   ║
║  ├─────────────────────────────────────────────────────────────┤   ║
║  │ Aspirin 100mg      │ 15,000đ  │    5     │    0             │   ║
║  │ Ibuprofen 400mg    │ 18,000đ  │    3     │    0             │   ║
║  └─────────────────────────────────────────────────────────────┘   ║
║                                                                      ║
║  ⚠️ Sản phẩm sắp hết hàng (5)                                       ║
║  ┌─────────────────────────────────────────────────────────────┐   ║
║  │ Tên thuốc          │ Giá      │ Danh mục │ Kho thực         │   ║
║  ├─────────────────────────────────────────────────────────────┤   ║
║  │ Vitamin B1         │ 22,000đ  │   10     │    8             │   ║
║  │ Paracetamol 500mg  │ 25,000đ  │   38     │    9             │   ║
║  └─────────────────────────────────────────────────────────────┘   ║
╠══════════════════════════════════════════════════════════════════════╣
║                   🏢 THỐNG KÊ NHÀ CUNG CẤP                           ║
╠══════════════════════════════════════════════════════════════════════╣
║  #  │ NCC              │ Công ty          │ Phiếu │ Tổng hàng       ║
║─────┼──────────────────┼──────────────────┼───────┼─────────────────║
║  1  │ supplier1        │ Pharma Corp      │   15  │    850          ║
║  2  │ supplier2        │ MediSupply Ltd   │   12  │    620          ║
║  3  │ supplier3        │ HealthPlus       │    8  │    430          ║
╠══════════════════════════════════════════════════════════════════════╣
║                   👥 THỐNG KÊ KHÁCH HÀNG                             ║
╠══════════════════════════════════════════════════════════════════════╣
║  #  │ Khách hàng  │ Số ĐH │ Tổng chi tiêu │ Tổng SP │ TB/Đơn        ║
║─────┼─────────────┼───────┼───────────────┼─────────┼───────────────║
║  1  │ nguyen_van_a│  45   │  5,625,000đ   │   180   │  125,000đ    ║
║  2  │ tran_thi_b  │  38   │  4,560,000đ   │   152   │  120,000đ    ║
║  3  │ le_van_c    │  25   │  3,000,000đ   │   100   │  120,000đ    ║
╚══════════════════════════════════════════════════════════════════════╝
```

## Màu sắc thẻ / Card Colors

### Overview Cards (Thẻ tổng quan)
- 💰 **Tổng doanh thu**: Xanh lá nhạt (Green gradient)
- 📦 **Tổng đơn hàng**: Xanh dương nhạt (Blue gradient)
- 💊 **Sản phẩm đã bán**: Vàng nhạt (Yellow gradient)
- 📊 **TB/Đơn**: Hồng nhạt (Pink gradient)
- 🏭 **Giá trị kho**: Xanh da trời (Sky blue gradient)
- 📋 **Hàng kho**: Tím nhạt (Purple gradient)

### Inventory Status Cards (Thẻ tồn kho)
- ⚠️ **Sắp hết hàng**: Vàng cảnh báo (Warning yellow)
- ❌ **Hết hàng**: Đỏ nguy hiểm (Danger red)
- 📈 **Dư thừa**: Xanh thông tin (Info blue)
- 💎 **Tổng giá trị**: Xanh thành công (Success green)

## Responsive Design

### Desktop (> 980px)
```
┌────────────────────────────────────────────────────────┐
│  [Card] [Card] [Card] [Card] [Card] [Card]            │
│  ← 6 cards in grid layout →                           │
└────────────────────────────────────────────────────────┘
```

### Tablet (480px - 980px)
```
┌────────────────────────────┐
│  [Card] [Card] [Card]      │
│  [Card] [Card] [Card]      │
│  ← 3 cards per row →       │
└────────────────────────────┘
```

### Mobile (< 480px)
```
┌──────────────┐
│   [Card]     │
│   [Card]     │
│   [Card]     │
│ ← 1 per row →│
└──────────────┘
```

## Export Preview (Khi in báo cáo)

```
╔══════════════════════════════════════════════════════╗
║            BÁO CÁO THỐNG KÊ                          ║
║         ĐẠI LÝ BÁN THUỐC                             ║
║                                                      ║
║  Thời gian: 2024-01-01 đến 2024-12-17               ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  1. TỔNG QUAN                                        ║
║  ┌────────────────────────────────────────────────┐ ║
║  │ Tổng doanh thu:        15,500,000đ            │ ║
║  │ Tổng đơn hàng:         125                    │ ║
║  │ Sản phẩm đã bán:       450                    │ ║
║  │ Giá trị TB/Đơn:        124,000đ               │ ║
║  │ Giá trị kho:           8,750,000đ             │ ║
║  └────────────────────────────────────────────────┘ ║
║                                                      ║
║  2. TOP 10 SẢN PHẨM BÁN CHẠY                         ║
║  ┌────┬──────────────────┬────────┬──────────────┐  ║
║  │ STT│ Tên thuốc        │ SL     │ Doanh thu    │  ║
║  ├────┼──────────────────┼────────┼──────────────┤  ║
║  │ 1  │ Paracetamol 500mg│  150   │ 3,750,000đ   │  ║
║  │ 2  │ Vitamin C 500mg  │  120   │ 3,840,000đ   │  ║
║  │ ... (continued)                                │  ║
║  └────┴──────────────────┴────────┴──────────────┘  ║
║                                                      ║
║            --- Hết báo cáo ---                       ║
╚══════════════════════════════════════════════════════╝
```

## Interactive Features (Tính năng tương tác)

### Date Filters (Bộ lọc ngày)
```
┌──────────────────────────────────────────────────┐
│ Từ ngày: [📅 2024-01-01] ◄ Date picker          │
│ Đến ngày: [📅 2024-12-17] ◄ Date picker         │
│ Nhóm theo: [Ngày ▼] [Tháng] [Năm]              │
│                                                  │
│ [🔄 Làm mới] ◄ Refresh data                     │
│ [📄 Xuất báo cáo] ◄ Print/Export                │
└──────────────────────────────────────────────────┘
```

### Hover Effects (Hiệu ứng hover)
- Cards lift up slightly on hover (translateY -2px)
- Table rows highlight on hover
- Buttons show pointer cursor and slight transform

### Click Actions
- 🔄 Làm mới: Refresh all statistics
- 📄 Xuất báo cáo: Open print dialog with formatted report
- Date inputs: Automatically refresh on change

## Data Flow (Luồng dữ liệu)

```
localStorage
    │
    ├─► invoices ──────────┐
    ├─► warehouse-stock ───┼──► calculateOverallStats()
    ├─► pharmacy-products ─┼──► calculateProductStats()
    └─► warehouse-receipts─┘    calculateRevenueOverTime()
                                calculateInventoryStats()
                                calculateSupplierStats()
                                calculateCustomerStats()
                                     │
                                     ▼
                            renderStatisticsOverview()
                            renderProductStatistics()
                            renderRevenueOverTime()
                            renderInventoryStatistics()
                            renderSupplierStatistics()
                            renderCustomerStatistics()
                                     │
                                     ▼
                                  Display in UI
```

## Browser Support

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
❌ Internet Explorer (not supported)

---

**Note**: Đây là preview dạng text. Giao diện thực tế sẽ có màu sắc đẹp hơn, responsive và interactive với CSS đầy đủ.
