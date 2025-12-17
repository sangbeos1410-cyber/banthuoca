// ============================================================================
// STATISTICS MODULE - CODE TO ADD TO script.js
// ============================================================================
// Hướng dẫn: Copy các hàm này vào cuối file script.js (trước dòng cuối cùng)
// Instruction: Copy these functions to the end of script.js (before the last line)

// --- Statistics Helper Functions ---

/**
 * Tính toán các chỉ số thống kê tổng quan
 * Calculate overall statistics metrics
 */
function calculateOverallStats(dateFrom, dateTo) {
    const invoices = getInvoices();
    const warehouse = getWarehouseStock();
    const products = getProductsList();
    
    // Lọc hóa đơn theo khoảng thời gian
    let filtered = invoices.slice();
    if (dateFrom) {
        const fromDate = new Date(dateFrom);
        filtered = filtered.filter(inv => new Date(inv.time) >= fromDate);
    }
    if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setDate(toDate.getDate() + 1);
        filtered = filtered.filter(inv => new Date(inv.time) < toDate);
    }
    
    // Tính tổng doanh thu và số đơn hàng
    let totalRevenue = 0;
    let totalOrders = filtered.length;
    let totalProductsSold = 0;
    
    filtered.forEach(inv => {
        inv.items.forEach(item => {
            totalRevenue += item.price * item.qty;
            totalProductsSold += item.qty;
        });
    });
    
    // Tính giá trị trung bình đơn hàng
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Tính tổng giá trị kho
    let totalWarehouseValue = 0;
    warehouse.forEach(item => {
        const product = products.find(p => p.name.toLowerCase() === item.name.toLowerCase());
        if (product) {
            totalWarehouseValue += product.price * item.qty;
        }
    });
    
    return {
        totalRevenue,
        totalOrders,
        totalProductsSold,
        averageOrderValue,
        totalWarehouseValue,
        totalWarehouseItems: warehouse.reduce((sum, item) => sum + item.qty, 0),
        totalProducts: products.length
    };
}

/**
 * Tính toán thống kê sản phẩm bán chạy nhất
 * Calculate best-selling products statistics
 */
function calculateProductStats(dateFrom, dateTo, limit = 10) {
    const invoices = getInvoices();
    
    // Lọc hóa đơn theo khoảng thời gian
    let filtered = invoices.slice();
    if (dateFrom) {
        const fromDate = new Date(dateFrom);
        filtered = filtered.filter(inv => new Date(inv.time) >= fromDate);
    }
    if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setDate(toDate.getDate() + 1);
        filtered = filtered.filter(inv => new Date(inv.time) < toDate);
    }
    
    const productStats = {};
    filtered.forEach(inv => {
        inv.items.forEach(item => {
            if (!productStats[item.name]) {
                productStats[item.name] = { 
                    name: item.name,
                    qty: 0, 
                    revenue: 0,
                    orderCount: 0 
                };
            }
            productStats[item.name].qty += item.qty;
            productStats[item.name].revenue += item.price * item.qty;
            productStats[item.name].orderCount += 1;
        });
    });
    
    const productList = Object.values(productStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit);
    
    return productList;
}

/**
 * Tính toán doanh thu theo thời gian (theo ngày/tháng)
 * Calculate revenue over time (by day/month)
 */
function calculateRevenueOverTime(dateFrom, dateTo, groupBy = 'day') {
    const invoices = getInvoices();
    
    // Lọc hóa đơn theo khoảng thời gian
    let filtered = invoices.slice();
    if (dateFrom) {
        const fromDate = new Date(dateFrom);
        filtered = filtered.filter(inv => new Date(inv.time) >= fromDate);
    }
    if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setDate(toDate.getDate() + 1);
        filtered = filtered.filter(inv => new Date(inv.time) < toDate);
    }
    
    const revenueByTime = {};
    
    filtered.forEach(inv => {
        const date = new Date(inv.time);
        let key;
        
        if (groupBy === 'day') {
            key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        } else if (groupBy === 'month') {
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
        } else if (groupBy === 'year') {
            key = String(date.getFullYear()); // YYYY
        }
        
        if (!revenueByTime[key]) {
            revenueByTime[key] = { date: key, revenue: 0, orders: 0 };
        }
        
        inv.items.forEach(item => {
            revenueByTime[key].revenue += item.price * item.qty;
        });
        revenueByTime[key].orders += 1;
    });
    
    return Object.values(revenueByTime).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Tính toán thống kê tồn kho
 * Calculate inventory statistics
 */
function calculateInventoryStats() {
    const warehouse = getWarehouseStock();
    const products = getProductsList();
    
    let lowStockItems = [];
    let outOfStockItems = [];
    let overstockItems = [];
    
    products.forEach(product => {
        const warehouseItem = warehouse.find(w => w.name.toLowerCase() === product.name.toLowerCase());
        const stockQty = warehouseItem ? warehouseItem.qty : 0;
        
        const item = {
            name: product.name,
            catalogQty: product.qty,
            warehouseQty: stockQty,
            price: product.price,
            value: product.price * stockQty
        };
        
        if (stockQty === 0) {
            outOfStockItems.push(item);
        } else if (stockQty < 10) {
            lowStockItems.push(item);
        } else if (stockQty > 100) {
            overstockItems.push(item);
        }
    });
    
    return {
        lowStockItems,
        outOfStockItems,
        overstockItems,
        totalValue: warehouse.reduce((sum, item) => {
            const product = products.find(p => p.name.toLowerCase() === item.name.toLowerCase());
            return sum + (product ? product.price * item.qty : 0);
        }, 0)
    };
}

/**
 * Tính toán thống kê nhà cung cấp
 * Calculate supplier statistics
 */
function calculateSupplierStats(dateFrom, dateTo) {
    const receipts = getWarehouseReceipts();
    
    // Lọc phiếu nhập kho theo thời gian
    let filtered = receipts.slice();
    if (dateFrom) {
        const fromDate = new Date(dateFrom);
        filtered = filtered.filter(r => new Date(r.time) >= fromDate);
    }
    if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setDate(toDate.getDate() + 1);
        filtered = filtered.filter(r => new Date(r.time) < toDate);
    }
    
    const supplierStats = {};
    
    filtered.forEach(receipt => {
        const supplierName = receipt.supplier || 'Không xác định';
        if (!supplierStats[supplierName]) {
            supplierStats[supplierName] = {
                name: supplierName,
                company: receipt.supplierCompany || '',
                receiptsCount: 0,
                totalItems: 0
            };
        }
        
        supplierStats[supplierName].receiptsCount += 1;
        receipt.items.forEach(item => {
            supplierStats[supplierName].totalItems += item.qty;
        });
    });
    
    return Object.values(supplierStats).sort((a, b) => b.totalItems - a.totalItems);
}

/**
 * Tính toán thống kê khách hàng
 * Calculate customer statistics
 */
function calculateCustomerStats(dateFrom, dateTo) {
    const invoices = getInvoices();
    
    // Lọc hóa đơn theo thời gian
    let filtered = invoices.slice();
    if (dateFrom) {
        const fromDate = new Date(dateFrom);
        filtered = filtered.filter(inv => new Date(inv.time) >= fromDate);
    }
    if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setDate(toDate.getDate() + 1);
        filtered = filtered.filter(inv => new Date(inv.time) < toDate);
    }
    
    const customerStats = {};
    
    filtered.forEach(inv => {
        const customer = inv.user || 'Không xác định';
        if (!customerStats[customer]) {
            customerStats[customer] = {
                name: customer,
                ordersCount: 0,
                totalSpent: 0,
                totalItems: 0
            };
        }
        
        customerStats[customer].ordersCount += 1;
        inv.items.forEach(item => {
            customerStats[customer].totalSpent += item.price * item.qty;
            customerStats[customer].totalItems += item.qty;
        });
    });
    
    return Object.values(customerStats).sort((a, b) => b.totalSpent - a.totalSpent);
}

// --- Render Statistics UI Functions ---

/**
 * Hiển thị tab thống kê tổng quan
 * Render overall statistics tab
 */
function renderStatisticsOverview() {
    const fromInput = document.getElementById('stats-date-from');
    const toInput = document.getElementById('stats-date-to');
    
    const dateFrom = fromInput ? fromInput.value : '';
    const dateTo = toInput ? toInput.value : '';
    
    const stats = calculateOverallStats(dateFrom, dateTo);
    
    let html = `
        <div class="stats-grid">
            <div class="stat-card stat-card-revenue">
                <div class="stat-icon">💰</div>
                <div class="stat-content">
                    <div class="stat-label">Tổng doanh thu</div>
                    <div class="stat-value">${stats.totalRevenue.toLocaleString()}đ</div>
                </div>
            </div>
            
            <div class="stat-card stat-card-orders">
                <div class="stat-icon">📦</div>
                <div class="stat-content">
                    <div class="stat-label">Tổng đơn hàng</div>
                    <div class="stat-value">${stats.totalOrders}</div>
                </div>
            </div>
            
            <div class="stat-card stat-card-products">
                <div class="stat-icon">💊</div>
                <div class="stat-content">
                    <div class="stat-label">Sản phẩm đã bán</div>
                    <div class="stat-value">${stats.totalProductsSold}</div>
                </div>
            </div>
            
            <div class="stat-card stat-card-average">
                <div class="stat-icon">📊</div>
                <div class="stat-content">
                    <div class="stat-label">Giá trị TB/Đơn</div>
                    <div class="stat-value">${stats.averageOrderValue.toLocaleString('vi-VN', {maximumFractionDigits: 0})}đ</div>
                </div>
            </div>
            
            <div class="stat-card stat-card-warehouse">
                <div class="stat-icon">🏭</div>
                <div class="stat-content">
                    <div class="stat-label">Giá trị kho</div>
                    <div class="stat-value">${stats.totalWarehouseValue.toLocaleString()}đ</div>
                </div>
            </div>
            
            <div class="stat-card stat-card-items">
                <div class="stat-icon">📋</div>
                <div class="stat-content">
                    <div class="stat-label">Tổng hàng trong kho</div>
                    <div class="stat-value">${stats.totalWarehouseItems}</div>
                </div>
            </div>
        </div>
    `;
    
    const container = document.getElementById('statistics-overview-content');
    if (container) container.innerHTML = html;
}

/**
 * Hiển thị thống kê sản phẩm bán chạy
 * Render best-selling products statistics
 */
function renderProductStatistics() {
    const fromInput = document.getElementById('stats-date-from');
    const toInput = document.getElementById('stats-date-to');
    
    const dateFrom = fromInput ? fromInput.value : '';
    const dateTo = toInput ? toInput.value : '';
    
    const productStats = calculateProductStats(dateFrom, dateTo, 20);
    
    if (productStats.length === 0) {
        const container = document.getElementById('product-stats-content');
        if (container) container.innerHTML = '<p class="muted">Chưa có dữ liệu bán hàng trong khoảng thời gian này.</p>';
        return;
    }
    
    let html = `
        <table class="stats-table">
            <thead>
                <tr>
                    <th>Xếp hạng</th>
                    <th>Tên thuốc</th>
                    <th>Số lượng bán</th>
                    <th>Số đơn</th>
                    <th>Doanh thu</th>
                    <th>TB/Đơn</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    productStats.forEach((product, index) => {
        const avgPerOrder = product.orderCount > 0 ? product.revenue / product.orderCount : 0;
        html += `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td>${escapeHtml(product.name)}</td>
                <td>${product.qty}</td>
                <td>${product.orderCount}</td>
                <td><strong>${product.revenue.toLocaleString()}đ</strong></td>
                <td>${avgPerOrder.toLocaleString('vi-VN', {maximumFractionDigits: 0})}đ</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    const container = document.getElementById('product-stats-content');
    if (container) container.innerHTML = html;
}

/**
 * Hiển thị thống kê doanh thu theo thời gian
 * Render revenue over time statistics
 */
function renderRevenueOverTime() {
    const fromInput = document.getElementById('stats-date-from');
    const toInput = document.getElementById('stats-date-to');
    const groupBySelect = document.getElementById('stats-group-by');
    
    const dateFrom = fromInput ? fromInput.value : '';
    const dateTo = toInput ? toInput.value : '';
    const groupBy = groupBySelect ? groupBySelect.value : 'day';
    
    const revenueData = calculateRevenueOverTime(dateFrom, dateTo, groupBy);
    
    if (revenueData.length === 0) {
        const container = document.getElementById('revenue-time-content');
        if (container) container.innerHTML = '<p class="muted">Chưa có dữ liệu doanh thu trong khoảng thời gian này.</p>';
        return;
    }
    
    let html = `
        <div class="revenue-chart">
            <table class="stats-table">
                <thead>
                    <tr>
                        <th>Thời gian</th>
                        <th>Số đơn hàng</th>
                        <th>Doanh thu</th>
                        <th>TB/Đơn</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    let totalRevenue = 0;
    let totalOrders = 0;
    
    revenueData.forEach(item => {
        const avgPerOrder = item.orders > 0 ? item.revenue / item.orders : 0;
        totalRevenue += item.revenue;
        totalOrders += item.orders;
        
        html += `
            <tr>
                <td><strong>${item.date}</strong></td>
                <td>${item.orders}</td>
                <td><strong>${item.revenue.toLocaleString()}đ</strong></td>
                <td>${avgPerOrder.toLocaleString('vi-VN', {maximumFractionDigits: 0})}đ</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
                <tfoot>
                    <tr>
                        <th>Tổng cộng</th>
                        <th>${totalOrders}</th>
                        <th><strong>${totalRevenue.toLocaleString()}đ</strong></th>
                        <th>${(totalOrders > 0 ? totalRevenue / totalOrders : 0).toLocaleString('vi-VN', {maximumFractionDigits: 0})}đ</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    const container = document.getElementById('revenue-time-content');
    if (container) container.innerHTML = html;
}

/**
 * Hiển thị thống kê tồn kho
 * Render inventory statistics
 */
function renderInventoryStatistics() {
    const stats = calculateInventoryStats();
    
    let html = `
        <div class="inventory-stats-summary">
            <div class="stat-card stat-card-warning">
                <div class="stat-icon">⚠️</div>
                <div class="stat-content">
                    <div class="stat-label">Sắp hết hàng</div>
                    <div class="stat-value">${stats.lowStockItems.length}</div>
                </div>
            </div>
            
            <div class="stat-card stat-card-danger">
                <div class="stat-icon">❌</div>
                <div class="stat-content">
                    <div class="stat-label">Hết hàng</div>
                    <div class="stat-value">${stats.outOfStockItems.length}</div>
                </div>
            </div>
            
            <div class="stat-card stat-card-info">
                <div class="stat-icon">📈</div>
                <div class="stat-content">
                    <div class="stat-label">Dư thừa kho</div>
                    <div class="stat-value">${stats.overstockItems.length}</div>
                </div>
            </div>
            
            <div class="stat-card stat-card-success">
                <div class="stat-icon">💎</div>
                <div class="stat-content">
                    <div class="stat-label">Tổng giá trị kho</div>
                    <div class="stat-value">${stats.totalValue.toLocaleString()}đ</div>
                </div>
            </div>
        </div>
        
        <div class="inventory-details">
    `;
    
    // Hết hàng
    if (stats.outOfStockItems.length > 0) {
        html += `
            <div class="inventory-section">
                <h4>❌ Sản phẩm hết hàng (${stats.outOfStockItems.length})</h4>
                <table class="stats-table">
                    <thead>
                        <tr>
                            <th>Tên thuốc</th>
                            <th>Giá</th>
                            <th>Danh mục</th>
                            <th>Kho thực</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        stats.outOfStockItems.forEach(item => {
            html += `
                <tr>
                    <td>${escapeHtml(item.name)}</td>
                    <td>${item.price.toLocaleString()}đ</td>
                    <td>${item.catalogQty}</td>
                    <td><strong class="text-danger">${item.warehouseQty}</strong></td>
                </tr>
            `;
        });
        html += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // Sắp hết hàng
    if (stats.lowStockItems.length > 0) {
        html += `
            <div class="inventory-section">
                <h4>⚠️ Sản phẩm sắp hết hàng (${stats.lowStockItems.length})</h4>
                <table class="stats-table">
                    <thead>
                        <tr>
                            <th>Tên thuốc</th>
                            <th>Giá</th>
                            <th>Danh mục</th>
                            <th>Kho thực</th>
                            <th>Giá trị còn lại</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        stats.lowStockItems.forEach(item => {
            html += `
                <tr>
                    <td>${escapeHtml(item.name)}</td>
                    <td>${item.price.toLocaleString()}đ</td>
                    <td>${item.catalogQty}</td>
                    <td><strong class="text-warning">${item.warehouseQty}</strong></td>
                    <td>${item.value.toLocaleString()}đ</td>
                </tr>
            `;
        });
        html += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    html += `</div>`;
    
    const container = document.getElementById('inventory-stats-content');
    if (container) container.innerHTML = html;
}

/**
 * Hiển thị thống kê nhà cung cấp
 * Render supplier statistics
 */
function renderSupplierStatistics() {
    const fromInput = document.getElementById('stats-date-from');
    const toInput = document.getElementById('stats-date-to');
    
    const dateFrom = fromInput ? fromInput.value : '';
    const dateTo = toInput ? toInput.value : '';
    
    const supplierStats = calculateSupplierStats(dateFrom, dateTo);
    
    if (supplierStats.length === 0) {
        const container = document.getElementById('supplier-stats-content');
        if (container) container.innerHTML = '<p class="muted">Chưa có dữ liệu nhà cung cấp trong khoảng thời gian này.</p>';
        return;
    }
    
    let html = `
        <table class="stats-table">
            <thead>
                <tr>
                    <th>Xếp hạng</th>
                    <th>Nhà cung cấp</th>
                    <th>Công ty</th>
                    <th>Số phiếu nhập</th>
                    <th>Tổng hàng nhập</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    supplierStats.forEach((supplier, index) => {
        html += `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td>${escapeHtml(supplier.name)}</td>
                <td>${escapeHtml(supplier.company)}</td>
                <td>${supplier.receiptsCount}</td>
                <td><strong>${supplier.totalItems}</strong></td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    const container = document.getElementById('supplier-stats-content');
    if (container) container.innerHTML = html;
}

/**
 * Hiển thị thống kê khách hàng
 * Render customer statistics
 */
function renderCustomerStatistics() {
    const fromInput = document.getElementById('stats-date-from');
    const toInput = document.getElementById('stats-date-to');
    
    const dateFrom = fromInput ? fromInput.value : '';
    const dateTo = toInput ? toInput.value : '';
    
    const customerStats = calculateCustomerStats(dateFrom, dateTo);
    
    if (customerStats.length === 0) {
        const container = document.getElementById('customer-stats-content');
        if (container) container.innerHTML = '<p class="muted">Chưa có dữ liệu khách hàng trong khoảng thời gian này.</p>';
        return;
    }
    
    let html = `
        <table class="stats-table">
            <thead>
                <tr>
                    <th>Xếp hạng</th>
                    <th>Khách hàng</th>
                    <th>Số đơn hàng</th>
                    <th>Tổng chi tiêu</th>
                    <th>Tổng sản phẩm</th>
                    <th>TB/Đơn</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    customerStats.forEach((customer, index) => {
        const avgPerOrder = customer.ordersCount > 0 ? customer.totalSpent / customer.ordersCount : 0;
        html += `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td>${escapeHtml(customer.name)}</td>
                <td>${customer.ordersCount}</td>
                <td><strong>${customer.totalSpent.toLocaleString()}đ</strong></td>
                <td>${customer.totalItems}</td>
                <td>${avgPerOrder.toLocaleString('vi-VN', {maximumFractionDigits: 0})}đ</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    const container = document.getElementById('customer-stats-content');
    if (container) container.innerHTML = html;
}

/**
 * Làm mới tất cả các thống kê
 * Refresh all statistics
 */
function refreshAllStatistics() {
    renderStatisticsOverview();
    renderProductStatistics();
    renderRevenueOverTime();
    renderInventoryStatistics();
    renderSupplierStatistics();
    renderCustomerStatistics();
}

/**
 * Xuất báo cáo thống kê ra file in
 * Export statistics report to print
 */
function exportStatisticsReport() {
    const fromInput = document.getElementById('stats-date-from');
    const toInput = document.getElementById('stats-date-to');
    
    const dateFrom = fromInput ? fromInput.value : '';
    const dateTo = toInput ? toInput.value : '';
    
    const stats = calculateOverallStats(dateFrom, dateTo);
    const productStats = calculateProductStats(dateFrom, dateTo, 10);
    const revenueData = calculateRevenueOverTime(dateFrom, dateTo, 'day');
    
    let html = `
        <h1 style="text-align:center">BÁO CÁO THỐNG KÊ</h1>
        <h2 style="text-align:center">ĐẠI LÝ BÁN THUỐC</h2>
        <p style="text-align:center"><em>Thời gian: ${dateFrom || 'Tất cả'} đến ${dateTo || 'Hiện tại'}</em></p>
        
        <h3>1. Tổng quan</h3>
        <table border="1" style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr><td><strong>Tổng doanh thu:</strong></td><td>${stats.totalRevenue.toLocaleString()}đ</td></tr>
            <tr><td><strong>Tổng đơn hàng:</strong></td><td>${stats.totalOrders}</td></tr>
            <tr><td><strong>Sản phẩm đã bán:</strong></td><td>${stats.totalProductsSold}</td></tr>
            <tr><td><strong>Giá trị trung bình/Đơn:</strong></td><td>${stats.averageOrderValue.toLocaleString('vi-VN', {maximumFractionDigits: 0})}đ</td></tr>
            <tr><td><strong>Giá trị kho:</strong></td><td>${stats.totalWarehouseValue.toLocaleString()}đ</td></tr>
        </table>
        
        <h3>2. Top 10 sản phẩm bán chạy</h3>
        <table border="1" style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <thead>
                <tr style="background:#f0f0f0">
                    <th>STT</th>
                    <th>Tên thuốc</th>
                    <th>Số lượng</th>
                    <th>Doanh thu</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    productStats.forEach((product, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(product.name)}</td>
                <td>${product.qty}</td>
                <td>${product.revenue.toLocaleString()}đ</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        
        <p style="text-align:center;margin-top:40px"><em>--- Hết báo cáo ---</em></p>
    `;
    
    const win = window.open('', '', 'width=900,height=900');
    win.document.write('<html><head><title>Báo cáo thống kê</title>');
    win.document.write('<style>body{font-family:Arial,sans-serif;padding:30px;line-height:1.6}table{width:100%;border-collapse:collapse}table,th,td{border:1px solid #333;padding:8px}th{background:#f5f5f5;text-align:left}</style>');
    win.document.write('</head><body>');
    win.document.write(html);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    win.print();
}

// ============================================================================
// THÊM VÀO HÀM showTab() - ADD TO showTab() FUNCTION
// ============================================================================
// Tìm hàm showTab() trong script.js và thêm dòng này vào:
// Find the showTab() function in script.js and add this line:
//
// if (tab === 'statistics') { refreshAllStatistics(); }
//
// Ví dụ / Example:
/*
function showTab(tab) {
    // ... existing code ...
    
    if (tab === 'catalog') { renderProducts(); renderInventory(); renderStaffCodeList(); renderReport(); renderProductsAdmin(); }
    if (tab === 'buy') { renderProducts(); renderCart(); renderInvoices(); renderBestSellers(); }
    if (tab === 'users') renderUsersTable();
    if (tab === 'profile') fillProfileForm();
    if (tab === 'warehouse') { renderWarehouse(); renderReceipts(); renderCurrentReceiptItems(); }
    if (tab === 'statistics') { refreshAllStatistics(); }  // <-- THÊM DÒNG NÀY / ADD THIS LINE
}
*/
