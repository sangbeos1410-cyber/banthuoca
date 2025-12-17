// Full, consolidated script.js for quanlithuoc
// Includes: storage helpers, auth, register, forgot/reset, staff codes, users, UI/role handling,
// effect filtering, best-sellers, products/admin rendering, warehouse, receipts, cart/checkout,
// invoices/print, reports, profile, and initial rendering.

// --- Dữ liệu khởi tạo ---
if (!localStorage.getItem('pharmacy-users')) {
    const defaultUsers = [
        { username: "admin", password: "admin123", role: "admin", email: "admin@example.com" },
        { username: "staff", password: "staff123", role: "staff", staffCode: "NV001", phone: "0123456789", email: "staff@example.com" },
        { username: "khach", password: "123", role: "customer", email: "khach@example.com" }
    ];
    localStorage.setItem('pharmacy-users', JSON.stringify(defaultUsers));
}
if (!localStorage.getItem('staff-codes')) {
    localStorage.setItem('staff-codes', JSON.stringify(["NV002", "NV003"]));
}
if (!localStorage.getItem('pharmacy-products')) {
    const sampleProducts = [
        { name: "Paracetamol 500mg", price: 25000, qty: 38, desc: "Giảm đau, hạ sốt, giảm viêm", img: "https://via.placeholder.com/240x120?text=Paracetamol" },
        { name: "Vitamin C 500mg", price: 32000, qty: 30, desc: "Tăng sức đề kháng, bổ sung vitamin", img: "https://via.placeholder.com/240x120?text=Vitamin+C" },
        { name: "Decolgen", price: 42000, qty: 40, desc: "Điều trị cảm cúm, giảm nghẹt mũi", img: "https://via.placeholder.com/240x120?text=Decolgen" }
    ];
    localStorage.setItem('pharmacy-products', JSON.stringify(sampleProducts));
}
if (!localStorage.getItem('invoices')) {
    localStorage.setItem('invoices', JSON.stringify([]));
}
if (!localStorage.getItem('warehouse-stock')) {
    const initialStock = [
        { name: "Paracetamol 500mg", qty: 50 },
        { name: "Vitamin C 500mg", qty: 30 },
        { name: "Decolgen", qty: 40 }
    ];
    localStorage.setItem('warehouse-stock', JSON.stringify(initialStock));
}
if (!localStorage.getItem('warehouse-receipts')) {
    localStorage.setItem('warehouse-receipts', JSON.stringify([]));
}

// --- Helpers for storage ---
function getUsers() { return JSON.parse(localStorage.getItem('pharmacy-users') || '[]'); }
function setUsers(u) { localStorage.setItem('pharmacy-users', JSON.stringify(u)); }
function getValidStaffCodes() { return JSON.parse(localStorage.getItem('staff-codes') || '[]'); }
function setValidStaffCodes(arr) { localStorage.setItem('staff-codes', JSON.stringify(arr)); }
function getProductsList() { return JSON.parse(localStorage.getItem('pharmacy-products') || '[]'); }
function setProductsList(p) { localStorage.setItem('pharmacy-products', JSON.stringify(p)); }
function getInvoices() { return JSON.parse(localStorage.getItem('invoices') || '[]'); }
function setInvoices(inv) { localStorage.setItem('invoices', JSON.stringify(inv)); }

function getWarehouseStock() { return JSON.parse(localStorage.getItem('warehouse-stock') || '[]'); }
function setWarehouseStock(arr) { localStorage.setItem('warehouse-stock', JSON.stringify(arr)); }

function getWarehouseReceipts() { return JSON.parse(localStorage.getItem('warehouse-receipts') || '[]'); }
function setWarehouseReceipts(arr) { localStorage.setItem('warehouse-receipts', JSON.stringify(arr)); }

function getCurrentUser() { return localStorage.getItem('pharmacy-current-user'); }
function setCurrentUser(u) { localStorage.setItem('pharmacy-current-user', u); }
function clearCurrentUser() { localStorage.removeItem('pharmacy-current-user'); }

// --- Utility ---
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }
function escapeJs(s) { return String(s).replace(/'/g, "\\'"); }

// --- Helpers: Effect (desc) extraction & best-sellers ---
function extractKeywords(desc) {
    if (!desc) return [];
    return String(desc)
        .split(/[,;\/•·\-–]+/)
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => s.toLowerCase());
}
function capitalize(s) { if (!s) return s; return s.charAt(0).toUpperCase() + s.slice(1); }

function populateDescFilter() {
    const selBuy = document.getElementById('filter-effect');
    const selCat = document.getElementById('filter-effect-catalog');
    const products = getProductsList();
    const set = new Set();
    products.forEach(p => {
        extractKeywords(p.desc).forEach(k => set.add(k));
    });
    const arr = Array.from(set).sort();
    if (selBuy) {
        selBuy.innerHTML = '<option value="all">Tất cả tác dụng</option>';
        arr.forEach(k => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = capitalize(k);
            selBuy.appendChild(opt);
        });
    }
    if (selCat) {
        selCat.innerHTML = '<option value="all">Tất cả tác dụng</option>';
        arr.forEach(k => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = capitalize(k);
            selCat.appendChild(opt);
        });
    }
}

// --- Notifications ---
function notify(msg, error=false) {
    const el = document.getElementById('notification');
    if (!el) return;
    el.textContent = msg;
    el.style.color = error ? '#d32f2f' : '#2e7d32';
    setTimeout(() => { if (el) el.textContent = ''; }, 3000);
}
function adminNotify(msg, error=false) {
    const el = document.getElementById('admin-notification');
    if (!el) return;
    el.textContent = msg;
    el.style.color = error ? '#c62828' : '#43a047';
    setTimeout(()=>{ if (el) el.textContent = ''; }, 3000);
}
function staffCodeNotify(msg, error=false) {
    const el = document.getElementById('staffcode-notification');
    if (!el) return;
    el.textContent = msg;
    el.style.color = error ? '#c62828' : '#43a047';
    setTimeout(()=>{ if (el) el.textContent = ''; }, 2500);
}

// --- Auth / Register / Login ---
function showRegister() {
    const lf = document.getElementById('login-form');
    const rf = document.getElementById('register-form');
    if (lf) lf.style.display = 'none';
    if (rf) rf.style.display = 'block';
}
function showLogin() {
    const lf = document.getElementById('login-form');
    const rf = document.getElementById('register-form');
    if (rf) rf.style.display = 'none';
    if (lf) lf.style.display = 'block';
}
function toggleStaffFields() {
    const roleEl = document.getElementById('register-role');
    const role = roleEl ? roleEl.value : 'customer';
    const sc = document.getElementById('register-staff-code');
    const sp = document.getElementById('register-staff-phone');
    const comp = document.getElementById('register-company');
    if (sc) sc.style.display = (role === 'staff') ? 'block' : 'none';
    if (sp) sp.style.display = (role === 'staff') ? 'block' : 'none';
    if (comp) comp.style.display = (role === 'supplier') ? 'block' : 'none';
}

function showAuth() {
    const authSection = document.getElementById('auth-section');
    const shopSection = document.getElementById('shop-section');
    if (authSection) authSection.style.display = 'block';
    if (shopSection) shopSection.style.display = 'none';
    const fields = ['login-identifier','login-password','register-username','register-email','register-password','register-company'];
    fields.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const rr = document.getElementById('register-role'); if (rr) rr.value = 'customer';
    toggleStaffFields();
    showLogin();
    // update header auth UI
    updateHeaderAuth();
}

function register() {
    const username = (document.getElementById('register-username').value || '').trim();
    const email = (document.getElementById('register-email').value || '').trim().toLowerCase();
    const password = document.getElementById('register-password').value || '';
    const role = document.getElementById('register-role').value || 'customer';
    const staffCode = (document.getElementById('register-staff-code').value || '').trim();
    const staffPhone = (document.getElementById('register-staff-phone').value || '').trim();
    const company = (document.getElementById('register-company').value || '').trim();

    if (!username || !email || !password) { notify("Vui lòng nhập đầy đủ thông tin (bao gồm email)!", true); return; }
    if (!isValidEmail(email)) { notify("Email không hợp lệ!", true); return; }

    let users = getUsers();
    if (users.find(u => u.username === username)) { notify("Tên đăng nhập đã tồn tại!", true); return; }
    if (users.find(u => u.email && u.email.toLowerCase() === email)) { notify("Email đã được sử dụng!", true); return; }

    if (role === 'staff') {
        if (!staffCode) { notify("Vui lòng nhập mã nhân viên!", true); return; }
        if (!staffPhone) { notify("Vui lòng nhập số điện thoại!", true); return; }
        const validCodes = getValidStaffCodes();
        if (!validCodes.includes(staffCode)) { notify("Mã nhân viên không hợp lệ hoặc đã sử dụng!", true); return; }
        setValidStaffCodes(validCodes.filter(c => c !== staffCode));
        users.push({ username, password, role, staffCode, phone: staffPhone, email });
    } else if (role === 'supplier') {
        if (!company) { notify("Nhà cung cấp phải nhập tên công ty!", true); return; }
        users.push({ username, password, role, company, email });
    } else {
        users.push({ username, password, role, email });
    }
    setUsers(users);
    notify("Đăng ký thành công! Bạn có thể đăng nhập.");
    showLogin();
}

function login() {
    const identifier = (document.getElementById('login-identifier').value || '').trim();
    const password = document.getElementById('login-password').value || '';
    if (!identifier || !password) { notify("Vui lòng nhập đầy đủ thông tin!", true); return; }

    let users = getUsers();
    const user = users.find(u =>
        (u.username === identifier || (u.email && u.email.toLowerCase() === identifier.toLowerCase())) && u.password === password
    );
    if (!user) { notify("Sai tên đăng nhập/email hoặc mật khẩu!", true); return; }
    setCurrentUser(user.username);
    showShop();
    // update header auth UI
    updateHeaderAuth();
}
function logout() { clearCurrentUser(); showAuth(); updateHeaderAuth(); }

// --- Forgot / Reset password ---
function showForgotPassword() {
    const modal = document.getElementById('modal-forgot');
    if (modal) modal.style.display = 'flex';
    const email = document.getElementById('forgot-email'); if (email) email.value = '';
    const notice = document.getElementById('forgot-notice'); if (notice) notice.textContent = '';
    const code = document.getElementById('forgot-simulated-code'); if (code) code.textContent = '';
}
function closeForgotModal() { const modal = document.getElementById('modal-forgot'); if (modal) modal.style.display = 'none'; const code = document.getElementById('forgot-simulated-code'); if (code) code.textContent = ''; }
function showResetModal(prefillEmail) {
    const modal = document.getElementById('modal-reset');
    if (modal) modal.style.display = 'flex';
    const re = document.getElementById('reset-email'); if (re) re.value = prefillEmail || '';
    ['reset-code','reset-password','reset-password-confirm'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const notice = document.getElementById('reset-notice'); if (notice) notice.textContent = '';
}
function closeResetModal() { const modal = document.getElementById('modal-reset'); if (modal) modal.style.display = 'none'; }

function sendResetCode(email) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 15 * 60 * 1000;
    localStorage.setItem('pw-reset-' + email.toLowerCase(), JSON.stringify({ code, expires }));
    return code;
}
function requestPasswordReset() {
    const emailInput = (document.getElementById('forgot-email').value || '').trim().toLowerCase();
    const noticeEl = document.getElementById('forgot-notice');
    if (!noticeEl) return;
    noticeEl.textContent = '';
    if (!emailInput) { noticeEl.textContent = 'Nhập email!'; noticeEl.style.color = '#c62828'; return; }
    const users = getUsers();
    if (!users.find(u => u.email && u.email.toLowerCase() === emailInput)) { noticeEl.textContent = 'Không tìm thấy email đăng ký.'; noticeEl.style.color = '#c62828'; return; }
    const code = sendResetCode(emailInput);
    const sim = document.getElementById('forgot-simulated-code'); if (sim) sim.textContent = 'Mã (mô phỏng): ' + code;
    noticeEl.style.color = '#43a047';
    noticeEl.textContent = 'Mã đã được gửi (mô phỏng).';
    showResetModal(emailInput);
}
function performPasswordReset() {
    const email = (document.getElementById('reset-email').value || '').trim().toLowerCase();
    const code = (document.getElementById('reset-code').value || '').trim();
    const pw = (document.getElementById('reset-password').value || '');
    const pw2 = (document.getElementById('reset-password-confirm').value || '');
    const notice = document.getElementById('reset-notice');
    if (!notice) return;
    notice.textContent = '';
    if (!email || !code || !pw || !pw2) { notice.textContent = 'Nhập đầy đủ thông tin!'; notice.style.color = '#c62828'; return; }
    if (pw !== pw2) { notice.textContent = 'Mật khẩu nhập lại không khớp!'; notice.style.color = '#c62828'; return; }
    const storedRaw = localStorage.getItem('pw-reset-' + email);
    if (!storedRaw) { notice.textContent = 'Mã không hợp lệ hoặc đã hết hạn!'; notice.style.color = '#c62828'; return; }
    let stored;
    try { stored = JSON.parse(storedRaw); } catch(e) { stored = null; }
    if (!stored || stored.code !== code || Date.now() > stored.expires) { notice.textContent = 'Mã không hợp lệ hoặc đã hết hạn!'; notice.style.color = '#c62828'; return; }
    let users = getUsers();
    const idx = users.findIndex(u => u.email && u.email.toLowerCase() === email);
    if (idx === -1) { notice.textContent = 'Không tìm thấy tài khoản.'; notice.style.color = '#c62828'; return; }
    users[idx].password = pw;
    setUsers(users);
    notice.style.color = '#43a047';
    notice.textContent = 'Đặt lại mật khẩu thành công!';
    setTimeout(() => { closeResetModal(); closeForgotModal(); }, 1200);
}

// --- Staff code management & Users management ---
function addStaffCode() {
    const code = (document.getElementById('new-staff-code').value || '').trim();
    if (!code) { staffCodeNotify("Vui lòng nhập mã hợp lệ!", true); return; }
    let codes = getValidStaffCodes();
    if (codes.includes(code)) { staffCodeNotify("Mã đã tồn tại!", true); return; }
    codes.push(code);
    setValidStaffCodes(codes);
    staffCodeNotify("Đã thêm mã!", false);
    document.getElementById('new-staff-code').value = '';
    renderStaffCodeList();
}
function renderStaffCodeList() {
    const ul = document.getElementById('staff-code-list');
    if (!ul) return;
    ul.innerHTML = '';
    getValidStaffCodes().forEach(code => {
        const li = document.createElement('div');
        li.textContent = code;
        ul.appendChild(li);
    });
}

function renderUsersTable() {
    const tbody = document.getElementById('users-table');
    if (!tbody) return;
    const users = getUsers().filter(u => u.role === 'staff');
    tbody.innerHTML = '';
    users.forEach((u, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${idx+1}</td><td>${escapeHtml(u.username)}</td><td>${escapeHtml(u.email||'')}</td><td>${escapeHtml(u.staffCode||'')}</td><td><button class="icon-small" onclick="deleteStaffUser('${escapeJs(u.username)}')">🗑️</button></td>`;
        tbody.appendChild(tr);
    });
}
function showAddStaffModal() {
    const modal = document.getElementById('modal-addstaff');
    if (modal) modal.style.display = 'flex';
    ['addstaff-username','addstaff-email','addstaff-password','addstaff-staffcode','addstaff-phone'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const note = document.getElementById('addstaff-notification'); if (note) note.textContent = '';
}
function closeAddStaffModal() { const modal = document.getElementById('modal-addstaff'); if (modal) modal.style.display = 'none'; }
function addStaffUser() {
    const username = (document.getElementById('addstaff-username').value || '').trim();
    const email = (document.getElementById('addstaff-email').value || '').trim().toLowerCase();
    const password = (document.getElementById('addstaff-password').value || '');
    const staffcode = (document.getElementById('addstaff-staffcode').value || '').trim();
    const phone = (document.getElementById('addstaff-phone').value || '').trim();
    const note = document.getElementById('addstaff-notification');
    if (!note) return;
    note.textContent = '';
    if (!username || !email || !password || !staffcode) { note.textContent = 'Nhập đủ thông tin!'; note.style.color = '#c62828'; return; }
    let users = getUsers();
    if (users.find(u => u.username === username)) { note.textContent = 'Tên đăng nhập tồn tại!'; note.style.color = '#c62828'; return; }
    users.push({ username, password, role: 'staff', staffCode: staffcode, phone, email });
    setUsers(users);
    note.style.color = '#43a047';
    note.textContent = 'Đã thêm nhân viên!';
    setTimeout(() => { closeAddStaffModal(); renderUsersTable(); }, 600);
}
function deleteStaffUser(username) {
    if (!confirm('Bạn có chắc muốn xóa nhân viên này?')) return;
    let users = getUsers();
    const idx = users.findIndex(u => u.username === username && u.role === 'staff');
    if (idx === -1) return;
    users.splice(idx, 1);
    setUsers(users);
    renderUsersTable();
}

// --- UI & Role handling ---
function getCurrentRole() {
    const users = getUsers();
    const u = users.find(x => x.username === getCurrentUser());
    return u ? u.role : 'customer';
}
function showShop() {
    const auth = document.getElementById('auth-section');
    const shop = document.getElementById('shop-section');
    if (auth) auth.style.display = 'none';
    if (shop) shop.style.display = 'block';
    const cu = document.getElementById('current-user');
    if (cu) cu.textContent = getCurrentUser() || '';

    const user = getUsers().find(u => u.username === getCurrentUser());
    const role = getCurrentRole();
    const currentRoleEl = document.getElementById('current-role');

    if (user && user.role === 'staff') {
        if (currentRoleEl) currentRoleEl.innerHTML = `Nhân viên<br>Email: ${user.email || ''}<br>SĐT: ${user.phone || ''}<br>Mã NV: ${user.staffCode || ''}`;
    } else if (user && user.role === 'supplier') {
        if (currentRoleEl) currentRoleEl.innerHTML = `Nhà cung cấp<br>Email: ${user.email || ''}<br>Công ty: ${user.company || ''}`;
    } else if (user) {
        if (currentRoleEl) currentRoleEl.innerHTML = `${user.role}<br>Email: ${user.email || ''}`;
    } else {
        if (currentRoleEl) currentRoleEl.textContent = getCurrentRole();
    }

    // hide/show UI elements by role
    const adminPanel = document.getElementById('admin-panel');
    const addStaffcodePanel = document.getElementById('add-staffcode-panel');
    const tabCatalogBtn = document.getElementById('tab-catalog-btn');
    const tabWarehouseBtn = document.getElementById('tab-warehouse-btn');
    const tabUsersBtn = document.getElementById('tab-users-btn');
    const tabStatisticsBtn = document.getElementById('tab-statistics-btn');

    if (adminPanel) adminPanel.style.display = 'none';
    if (addStaffcodePanel) addStaffcodePanel.style.display = 'none';
    if (tabCatalogBtn) tabCatalogBtn.style.display = 'none';
    if (tabWarehouseBtn) tabWarehouseBtn.style.display = 'none';
    if (tabUsersBtn) tabUsersBtn.style.display = 'none';
    if (tabStatisticsBtn) tabStatisticsBtn.style.display = 'none';

    if (role === 'admin') {
        if (adminPanel) adminPanel.style.display = 'block';
        if (addStaffcodePanel) addStaffcodePanel.style.display = 'block';
        if (tabCatalogBtn) tabCatalogBtn.style.display = 'inline-block';
        if (tabWarehouseBtn) tabWarehouseBtn.style.display = 'inline-block';
        if (tabUsersBtn) tabUsersBtn.style.display = 'inline-block';
        if (tabStatisticsBtn) tabStatisticsBtn.style.display = 'inline-block';
        renderStaffCodeList();
    } else if (role === 'staff') {
        if (adminPanel) adminPanel.style.display = 'block';
        if (tabCatalogBtn) tabCatalogBtn.style.display = 'inline-block';
        if (tabWarehouseBtn) tabWarehouseBtn.style.display = 'inline-block';
        if (tabStatisticsBtn) tabStatisticsBtn.style.display = 'inline-block';
    } else if (role === 'supplier') {
        if (tabWarehouseBtn) tabWarehouseBtn.style.display = 'inline-block';
    }

    const addStockPanel = document.getElementById('add-stock-panel');
    if (addStockPanel) addStockPanel.style.display = (['admin','staff'].includes(role)) ? 'block' : 'none';
    const inventoryPanel = document.getElementById('inventory-panel');
    if (inventoryPanel) inventoryPanel.style.display = (['admin','staff'].includes(role)) ? 'block' : 'none';
    const invoicePanel = document.getElementById('invoice-panel');
    if (invoicePanel) invoicePanel.style.display = 'block';

    if (role === 'supplier') showTab('warehouse'); else showTab('buy');

    populateReceiptSupplierSelect();
    populateDescFilter();
    loadCart();
    renderCart();
    renderBestSellers();

    // update header auth UI
    updateHeaderAuth();
}

// --- Tab switching ---
function showTab(tab) {
    const role = getCurrentRole();
    const allowed = (function(r){
        if (r === 'admin') return ['buy','catalog','warehouse','users','statistics','profile'];
        if (r === 'staff') return ['buy','catalog','warehouse','statistics','profile'];
        if (r === 'supplier') return ['warehouse'];
        return ['buy','profile'];
    })(role);
    if (!allowed.includes(tab)) {
        tab = allowed.length ? allowed[0] : 'buy';
    }

    document.querySelectorAll('.tab-content').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active'));
    const tabEl = document.getElementById('tab-' + tab);
    if (tabEl) tabEl.classList.add('active');
    const btn = document.querySelector('.tab-btn[onclick*="' + tab + '"]');
    if (btn) btn.classList.add('active');

    if (tab === 'catalog') { renderProducts(); renderInventory(); renderStaffCodeList(); renderReport(); renderProductsAdmin(); }
    if (tab === 'buy') { renderProducts(); renderCart(); renderInvoices(); renderBestSellers(); }
    if (tab === 'users') renderUsersTable();
    if (tab === 'statistics') renderStatistics();
    if (tab === 'profile') fillProfileForm();
    if (tab === 'warehouse') { renderWarehouse(); renderReceipts(); renderCurrentReceiptItems(); }
}

// --- Products rendering & admin area ---
let editingIndex = -1;

// Best sellers: aggregate from invoices
function renderBestSellers(limit = 6) {
    const container = document.getElementById('best-sellers');
    if (!container) return;
    const invoices = getInvoices();
    if (!invoices || invoices.length === 0) {
        container.innerHTML = '<div class="muted">Chưa có sản phẩm bán chạy.</div>';
        return;
    }
    const stats = {};
    invoices.forEach(inv => {
        (inv.items || []).forEach(it => {
            if (!stats[it.name]) stats[it.name] = { qty: 0, revenue: 0, price: it.price || 0 };
            stats[it.name].qty += it.qty;
            stats[it.name].revenue += (it.price || 0) * it.qty;
        });
    });
    const list = Object.entries(stats).map(([name, s]) => ({ name, qty: s.qty, revenue: s.revenue, price: s.price }));
    list.sort((a,b) => b.qty - a.qty);
    const top = list.slice(0, limit);
    container.innerHTML = '';
    top.forEach(item => {
        const prod = getProductsList().find(p => p.name === item.name) || {};
        const card = document.createElement('div');
        card.className = 'product';
        card.innerHTML = `
            <img src="${prod.img || 'https://via.placeholder.com/240x120?text=No+Image'}" alt="${escapeHtml(item.name)}">
            <h4 style="margin:6px 0">${escapeHtml(item.name)}</h4>
            <div class="muted" style="font-size:0.9rem">Đã bán: <b>${item.qty}</b></div>
            <div style="margin-top:auto;display:flex;gap:8px;align-items:center;justify-content:flex-end;">
                <button class="icon-btn" onclick="addToCart('${escapeJs(item.name)}', ${item.price || 0})">🛒 Thêm</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderProducts() {
    const productsDiv = document.getElementById('products');
    if (!productsDiv) return;
    const search = (document.getElementById('search').value || '').trim().toLowerCase();
    const selectedEffect = (document.getElementById('filter-effect') ? document.getElementById('filter-effect').value : 'all') || 'all';
    const products = getProductsList().map((p, idx) => ({...p, idx}))
        .filter(p => {
            const nameMatch = p.name.toLowerCase().includes(search);
            const descMatch = (p.desc || '').toLowerCase().includes(search);
            let effectMatch = true;
            if (selectedEffect && selectedEffect !== 'all') {
                const kws = extractKeywords(p.desc);
                effectMatch = kws.includes(selectedEffect.toLowerCase());
            }
            return (nameMatch || descMatch) && effectMatch;
        });
    productsDiv.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div'); div.className = 'product';
        div.innerHTML = `
            <img src="${product.img || 'https://via.placeholder.com/240x120?text=No+Image'}" alt="${escapeHtml(product.name)}">
            <h2>${escapeHtml(product.name)}</h2>
            <p><i>${escapeHtml(product.desc)}</i></p>
            <p>Giá: <b>${product.price.toLocaleString()}đ</b></p>
            <p>Tồn kho: <b>${product.qty}</b></p>
            <div style="margin-top:auto;display:flex;justify-content:flex-end;">
                <button class="icon-btn" onclick="addToCart('${escapeJs(product.name)}', ${product.price})">🛒 Thêm vào giỏ</button>
            </div>
        `;
        productsDiv.appendChild(div);
    });
    renderBestSellers();
}

function renderProductsAdmin() {
    const productsDiv = document.getElementById('products-admin');
    if (!productsDiv) return;
    const selectedEffect = (document.getElementById('filter-effect-catalog') ? document.getElementById('filter-effect-catalog').value : 'all') || 'all';
    const products = getProductsList().map((p, idx) => ({...p, idx}))
        .filter(p => {
            if (selectedEffect && selectedEffect !== 'all') {
                const kws = extractKeywords(p.desc);
                return kws.includes(selectedEffect.toLowerCase());
            }
            return true;
        });
    productsDiv.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div'); div.className = 'product';
        div.innerHTML = `
            <img src="${product.img || 'https://via.placeholder.com/240x120?text=No+Image'}" alt="${escapeHtml(product.name)}">
            <h2>${escapeHtml(product.name)}</h2>
            <p><i>${escapeHtml(product.desc)}</i></p>
            <p>Giá: <b>${product.price.toLocaleString()}đ</b></p>
            <p>Tồn kho (hiển thị): <b>${product.qty}</b></p>
            <div class="admin-btns">
                <button class="icon-btn edit-btn" onclick="editProduct(${product.idx})">✏️ Sửa</button>
                <button class="icon-btn delete-btn" onclick="deleteProduct(${product.idx})">🗑️ Xóa</button>
            </div>
        `;
        productsDiv.appendChild(div);
    });
}

function addNewProduct() {
    const name = (document.getElementById('new-name').value || '').trim();
    const price = parseInt(document.getElementById('new-price').value);
    const qty = parseInt(document.getElementById('new-qty').value);
    const desc = (document.getElementById('new-desc').value || '').trim();
    const img = (document.getElementById('new-img').value || '').trim();
    if (!name || !price || !desc || isNaN(qty) || qty < 0) { adminNotify('Vui lòng nhập đầy đủ thông tin!', true); return; }

    const warehouse = getWarehouseStock();
    const ws = warehouse.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (!ws) { adminNotify('Không thể thêm: thuốc chưa có trong kho!', true); return; }
    if (ws.qty <= 0) { adminNotify('Không thể thêm: kho hiện đang hết hàng!', true); return; }
    if (qty > ws.qty) { adminNotify(`Không thể thêm: số lượng danh mục (${qty}) vượt quá kho (${ws.qty})!`, true); return; }

    let products = getProductsList();
    if (products.find(p=>p.name.toLowerCase() === name.toLowerCase())) { adminNotify('Thuốc này đã tồn tại!', true); return; }
    products.push({ name, price, qty, desc, img });
    setProductsList(products);
    adminNotify('Thêm thuốc thành công!');
    ['new-name','new-price','new-qty','new-desc','new-img'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    populateDescFilter();
    renderProducts(); renderInventory(); renderProductsAdmin();
}

function editProduct(idx) { editingIndex = idx; renderProductsEditForm(idx); }
function cancelEditProduct() { editingIndex = -1; renderProductsAdmin(); renderProducts(); }

function renderProductsEditForm(idx) {
    const products = getProductsList();
    if (!products[idx]) return;
    const product = products[idx];
    const productsDiv = document.getElementById('products-admin');
    if (!productsDiv) return;
    productsDiv.innerHTML = '';
    const div = document.createElement('div'); div.className = 'product';
    div.innerHTML = `
        <div class="edit-fields">
            <input id="edit-name" placeholder="Tên thuốc" value="${escapeHtml(product.name)}">
            <input id="edit-price" type="number" placeholder="Giá" value="${product.price}">
            <input id="edit-qty" type="number" placeholder="Số lượng tồn kho" value="${product.qty}">
            <input id="edit-desc" placeholder="Công dụng" value="${escapeHtml(product.desc)}">
            <input id="edit-img" placeholder="Link ảnh" value="${product.img || ''}">
        </div>
        <div class="admin-btns">
            <button class="icon-btn save-btn" onclick="saveEditProduct(${idx})">💾 Lưu</button>
            <button class="icon-btn" onclick="cancelEditProduct()">↩️ Hủy</button>
        </div>
    `;
    productsDiv.appendChild(div);
}

function saveEditProduct(idx) {
    const name = (document.getElementById('edit-name').value || '').trim();
    const price = parseInt(document.getElementById('edit-price').value);
    const qty = parseInt(document.getElementById('edit-qty').value);
    const desc = (document.getElementById('edit-desc').value || '').trim();
    const img = (document.getElementById('edit-img').value || '').trim();
    if (!name || !price || !desc || isNaN(qty) || qty < 0) { adminNotify('Vui lòng nhập đầy đủ thông tin!', true); return; }

    let products = getProductsList();
    if (!products[idx]) { adminNotify('Sản phẩm không tồn tại!', true); return; }
    const oldName = products[idx].name;

    const warehouse = getWarehouseStock();
    const wsForNewName = warehouse.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (!wsForNewName) {
        if (name.toLowerCase() !== oldName.toLowerCase()) {
            adminNotify('Không thể đổi tên: thuốc mới không tồn tại trong kho!', true); return;
        }
    } else {
        if (qty > wsForNewName.qty) { adminNotify(`Không thể đặt số lượng ${qty} > kho (${wsForNewName.qty})!`, true); return; }
    }

    if (name.toLowerCase() === oldName.toLowerCase()) {
        const ws = warehouse.find(s => s.name.toLowerCase() === name.toLowerCase());
        if (ws && qty > ws.qty) { adminNotify(`Không thể đặt số lượng ${qty} > kho (${ws.qty})!`, true); return; }
    }

    if (products.find((p,i) => p.name.toLowerCase() === name.toLowerCase() && i !== idx)) { adminNotify('Tên thuốc đã tồn tại!', true); return; }
    products[idx] = { name, price, qty, desc, img };
    setProductsList(products);
    adminNotify('Đã cập nhật thuốc!');
    editingIndex = -1;
    populateDescFilter();
    renderProducts(); renderInventory(); renderProductsAdmin();
}

function deleteProduct(idx) {
    if (getCurrentRole() !== 'admin') { adminNotify('Bạn không có quyền xóa thuốc!', true); return; }
    let products = getProductsList();
    if (!products[idx]) return;
    const name = products[idx].name;
    const warehouse = getWarehouseStock();
    const ws = warehouse.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (ws && ws.qty > 0) { adminNotify('Không thể xóa: trong kho vẫn còn hàng. Vui lòng xuất hoặc giảm kho trước khi xóa danh mục.', true); return; }
    if (!confirm('Bạn có chắc muốn xóa thuốc này khỏi danh mục?')) return;
    products.splice(idx,1);
    setProductsList(products);
    adminNotify('Đã xóa thuốc khỏi danh mục!');
    populateDescFilter();
    if (editingIndex === idx) editingIndex = -1;
    renderProducts(); renderInventory(); renderProductsAdmin();
}

// --- Inventory display ---
function renderInventory() {
    const tbody = document.getElementById('inventory-table');
    if (!tbody) return;
    const role = getCurrentRole();
    if (!['admin','staff','supplier'].includes(role)) { tbody.innerHTML = '<i>Không có quyền xem inventory</i>'; return; }
    const products = getProductsList();
    const warehouse = getWarehouseStock();
    const rows = products.map(p => {
        const ws = warehouse.find(s => s.name.toLowerCase() === p.name.toLowerCase());
        const wQty = ws ? ws.qty : 0;
        return `<tr><td>${escapeHtml(p.name)}</td><td>${p.price.toLocaleString()}đ</td><td>${p.qty}</td><td>Kho thực tế: ${wQty}</td><td>${escapeHtml(p.desc)}</td></tr>`;
    }).join('');
    tbody.innerHTML = `<tr><th>Tên</th><th>Giá</th><th>QL danh mục</th><th>Kho thực tế</th><th>Mô tả</th></tr>` + rows;
}

// --- Warehouse management ---
function renderWarehouse() {
    const table = document.getElementById('warehouse-table');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    const warehouse = getWarehouseStock();
    tbody.innerHTML = '';
    const role = getCurrentRole();

    warehouse.forEach((item, idx) => {
        const tr = document.createElement('tr');
        if (role === 'supplier') {
            tr.innerHTML = `<td>${idx+1}</td>
                <td>${escapeHtml(item.name)}</td>
                <td>${item.qty}</td>
                <td><i>Thay đổi qua Phiếu nhập kho</i></td>`;
        } else {
            tr.innerHTML = `<td>${idx+1}</td>
                <td>${escapeHtml(item.name)}</td>
                <td>${item.qty}</td>
                <td class="warehouse-actions">
                    <button class="icon-small" onclick="changeStockQty(${idx}, 1)">➕</button>
                    <button class="icon-small" onclick="changeStockQty(${idx}, -1)">➖</button>
                    <button class="icon-btn" onclick="promptSetStock(${idx})">✏️ Sửa</button>
                    <button class="icon-btn" onclick="deleteStockItem(${idx})">🗑️ Xóa</button>
                </td>`;
        }
        tbody.appendChild(tr);
    });
}

function addStockItem() {
    const role = getCurrentRole();
    const notifyEl = document.getElementById('warehouse-notification');
    if (role === 'supplier') {
        if (notifyEl) { notifyEl.style.color = '#c62828'; notifyEl.textContent = 'Nhà cung cấp chỉ được nhập kho qua Phiếu nhập kho.'; }
        return;
    }
    const name = (document.getElementById('stock-name').value || '').trim();
    const qty = parseInt(document.getElementById('stock-qty').value);
    if (!notifyEl) return;
    notifyEl.textContent = '';
    if (!name || isNaN(qty) || qty < 0) { notifyEl.textContent = 'Nhập tên và số lượng hợp lệ!'; notifyEl.style.color = '#c62828'; return; }
    let warehouse = getWarehouseStock();
    const existing = warehouse.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (existing) existing.qty += qty; else warehouse.push({ name, qty });
    setWarehouseStock(warehouse);
    notifyEl.style.color = '#43a047';
    notifyEl.textContent = 'Cập nhật kho thành công!';
    document.getElementById('stock-name').value = '';
    document.getElementById('stock-qty').value = '';
    renderWarehouse();
    renderInventory();
}

function changeStockQty(idx, delta) {
    const role = getCurrentRole();
    if (role === 'supplier') { alert('Nhà cung cấp chỉ được thay đổi kho bằng Phiếu nhập kho.'); return; }
    let warehouse = getWarehouseStock();
    if (!warehouse[idx]) return;
    warehouse[idx].qty += delta;
    if (warehouse[idx].qty < 0) warehouse[idx].qty = 0;
    setWarehouseStock(warehouse);
    renderWarehouse();
    renderInventory();
}

function promptSetStock(idx) {
    const role = getCurrentRole();
    if (role === 'supplier') { alert('Nhà cung cấp chỉ được thay đổi kho bằng Phiếu nhập kho.'); return; }
    let warehouse = getWarehouseStock();
    if (!warehouse[idx]) return;
    const val = prompt('Nhập số lượng mới cho: ' + warehouse[idx].name, warehouse[idx].qty);
    if (val === null) return;
    const newQty = parseInt(val);
    if (isNaN(newQty) || newQty < 0) { alert('Số lượng không hợp lệ'); return; }
    warehouse[idx].qty = newQty;
    setWarehouseStock(warehouse);
    renderWarehouse();
    renderInventory();
}

function deleteStockItem(idx) {
    const role = getCurrentRole();
    if (role === 'supplier') { alert('Nhà cung cấp không được xóa mục kho; chỉ ràng buộc qua Phiếu nhập kho.'); return; }
    if (!confirm('Xóa mục kho này?')) return;
    let warehouse = getWarehouseStock();
    warehouse.splice(idx,1);
    setWarehouseStock(warehouse);
    renderWarehouse();
    renderInventory();
}

// --- Cart & Checkout ---
let cart = [];
function saveCart() { if (getCurrentUser()) localStorage.setItem('pharmacy-cart-' + getCurrentUser(), JSON.stringify(cart)); }
function loadCart() { if (getCurrentUser()) cart = JSON.parse(localStorage.getItem('pharmacy-cart-' + getCurrentUser()) || '[]'); else cart = []; }

function addToCart(productName, price) {
    let products = getProductsList();
    let product = products.find(p => p.name === productName);
    if (!product || product.qty <= 0) { notify('Thuốc đã hết hàng!', true); return; }
    const existing = cart.find(c => c.name === productName);
    const cartQty = existing ? existing.qty : 0;
    const warehouse = getWarehouseStock().find(s => s.name.toLowerCase() === productName.toLowerCase());
    const warehouseQty = warehouse ? warehouse.qty : 0;
    if (cartQty + 1 > product.qty || cartQty + 1 > warehouseQty) { notify('Không đủ thuốc trong kho!', true); return; }
    if (existing) existing.qty += 1; else cart.push({ name: productName, price, qty: 1 });
    saveCart(); renderCart(); notify('Đã thêm vào giỏ hàng!');
}
function removeFromCart(idx) { cart.splice(idx,1); saveCart(); renderCart(); }
function changeQty(idx, delta) {
    const products = getProductsList();
    const item = cart[idx];
    if (!item) return;
    const product = products.find(p => p.name === item.name);
    if (!product) return;
    const warehouse = getWarehouseStock().find(s => s.name.toLowerCase() === item.name.toLowerCase());
    const warehouseQty = warehouse ? warehouse.qty : 0;
    if (item.qty + delta > product.qty || item.qty + delta > warehouseQty) { notify('Không đủ thuốc trong kho!', true); return; }
    item.qty += delta;
    if (item.qty <= 0) cart.splice(idx,1);
    saveCart(); renderCart();
}

function renderCart() {
    const el = document.getElementById('cart'); if (!el) return; el.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
        const li = document.createElement('li'); li.className = 'cart-item';
        li.innerHTML = `<div style="flex:1"><strong>${escapeHtml(item.name)}</strong><div class="muted">${item.price.toLocaleString()}đ</div></div>
            <div class="cart-controls">
                <button class="icon-small" onclick="changeQty(${idx}, 1)">➕</button>
                <div style="padding:4px 6px;border-radius:6px;background:#f1f8f7">${item.qty}</div>
                <button class="icon-small" onclick="changeQty(${idx}, -1)">➖</button>
                <button class="icon-btn" onclick="removeFromCart(${idx})">🗑️ Xóa</button>
            </div>`;
        el.appendChild(li);
        total += item.price * item.qty;
    });
    const totalEl = document.getElementById('total');
    if (totalEl) totalEl.textContent = 'Tổng: ' + total.toLocaleString() + 'đ';
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
}

function checkout() {
    if (!cart.length) return;
    const products = getProductsList();
    const enough = cart.every(item => {
        const p = products.find(pr => pr.name === item.name);
        const w = getWarehouseStock().find(s => s.name.toLowerCase() === item.name.toLowerCase());
        const wQty = w ? w.qty : 0;
        return p && p.qty >= item.qty && wQty >= item.qty;
    });
    if (!enough) { notify('Một số thuốc không đủ hàng trong kho!', true); return; }
    if (!confirm('Xác nhận thanh toán đơn hàng?')) return;

    const invoices = getInvoices();
    const nowISO = new Date().toISOString();
    const nowDisplay = new Date().toLocaleString();
    invoices.push({
        user: getCurrentUser(),
        time: nowISO,
        timeDisplay: nowDisplay,
        items: JSON.parse(JSON.stringify(cart))
    });
    setInvoices(invoices);

    // deduct product list and warehouse
    cart.forEach(item => {
        const pList = getProductsList();
        const p = pList.find(pr => pr.name === item.name);
        if (p) p.qty -= item.qty;
        setProductsList(pList);

        const warehouse = getWarehouseStock();
        const w = warehouse.find(s => s.name.toLowerCase() === item.name.toLowerCase());
        if (w) w.qty -= item.qty;
        setWarehouseStock(warehouse);
    });

    cart = [];
    saveCart();
    renderCart();
    notify('Thanh toán thành công!');
    renderProducts(); renderInventory(); renderInvoices(); renderReport(); renderWarehouse();
    renderBestSellers();
}

// --- Invoices & print ---
function renderInvoices() {
    const role = getCurrentRole();
    const currentUser = getCurrentUser();
    const invoices = getInvoices();
    const div = document.getElementById('invoice-list');
    let filtered = [];
    if (role === 'customer') filtered = invoices.filter(inv => inv.user === currentUser);
    else filtered = invoices.slice().reverse();
    if (!filtered.length) { if (div) div.innerHTML = "<i>Chưa có hóa đơn nào.</i>"; return; }
    if (!div) return;
    div.innerHTML = filtered.map((inv) => {
        const itemsHtml = inv.items.map(i => `${escapeHtml(i.name)} x ${i.qty} (${i.price.toLocaleString()}đ)`).join('<br>');
        const globalIndex = invoices.indexOf(inv);
        return `<div style="border-bottom:1px dashed #e6efee;padding:8px 0;"><b>Người mua:</b> ${escapeHtml(inv.user)} | <b>Thời gian:</b> ${escapeHtml(inv.timeDisplay || inv.time)}<br>${itemsHtml}<br><button class="icon-btn" onclick="showInvoiceModal(${globalIndex})">🔍 Xem</button></div>`;
    }).join('');
}

function showInvoiceModal(globalIdx) {
    const invoices = getInvoices();
    const inv = invoices[globalIdx];
    if (!inv) return;
    const total = inv.items.reduce((s,i)=>s + i.price*i.qty, 0);
    let html = `<h3>HÓA ĐƠN BÁN LẺ</h3>
        <div><b>Mã hóa đơn:</b> HD${globalIdx+1}</div>
        <div><b>Khách hàng:</b> ${escapeHtml(inv.user)}</div>
        <div><b>Thời gian:</b> ${escapeHtml(inv.timeDisplay || inv.time)}</div>
        <table style="width:100%;margin-top:10px;" border="1" cellpadding="4">
            <tr><th>Tên thuốc</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr>
            ${inv.items.map(i => `<tr><td>${escapeHtml(i.name)}</td><td>${i.qty}</td><td>${i.price.toLocaleString()}đ</td><td>${(i.price*i.qty).toLocaleString()}đ</td></tr>`).join('')}
        </table>
        <div style="margin-top:8px;text-align:right"><b>Tổng cộng: ${total.toLocaleString()}đ</b></div>`;
    const container = document.getElementById('modal-invoice-content');
    if (container) container.innerHTML = html;
    const modal = document.getElementById('modal-invoice'); if (modal) modal.style.display = 'flex';
    const role = getCurrentRole();
    const printBtn = document.getElementById('btn-print-invoice');
    if (printBtn) printBtn.style.display = (role === 'staff' || role === 'admin') ? 'inline-block' : 'none';
    window.__currentInvoiceHtml = html;
}
function closeInvoiceModal() { const modal = document.getElementById('modal-invoice'); if (modal) modal.style.display = 'none'; window.__currentInvoiceHtml = null; }
function printInvoice() {
    if (!window.__currentInvoiceHtml) return;
    const win = window.open('', '', 'width=800,height=900');
    win.document.write('<html><head><title>In hóa đơn</title>');
    win.document.write('<style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;}table{width:100%;border-collapse:collapse;}table,th,td{border:1px solid #ccc;padding:6px;text-align:left;}</style>');
    win.document.write('</head><body>');
    win.document.write(window.__currentInvoiceHtml);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    win.print();
}

// --- Reports ---
function renderReport() {
    const invoices = getInvoices();
    const from = document.getElementById('report-from') ? document.getElementById('report-from').value : '';
    const to = document.getElementById('report-to') ? document.getElementById('report-to').value : '';
    let filtered = invoices.slice();
    if (from) {
        const fromDate = new Date(from);
        filtered = filtered.filter(inv => new Date(inv.time) >= fromDate);
    }
    if (to) {
        const toDate = new Date(to);
        toDate.setDate(toDate.getDate() + 1);
        filtered = filtered.filter(inv => new Date(inv.time) < toDate);
    }
    let totalRevenue = 0;
    const productStats = {};
    filtered.forEach(inv => {
        inv.items.forEach(item => {
            totalRevenue += item.price * item.qty;
            if (!productStats[item.name]) productStats[item.name] = { qty: 0, revenue: 0 };
            productStats[item.name].qty += item.qty;
            productStats[item.name].revenue += item.price * item.qty;
        });
    });
    const productList = Object.entries(productStats).map(([name, stat]) => ({ name, ...stat })).sort((a,b) => b.qty - a.qty);
    let html = `<b>Tổng số đơn hàng:</b> ${filtered.length}<br><b>Tổng doanh thu:</b> ${totalRevenue.toLocaleString()}đ<br><br>
        <b>Top sản phẩm bán chạy:</b>
        <table border="1" style="margin-top:8px;width:100%;border-collapse:collapse;">
            <tr><th>Tên thuốc</th><th>Số lượng bán</th><th>Doanh thu</th></tr>
            ${productList.map(p => `<tr><td>${escapeHtml(p.name)}</td><td>${p.qty}</td><td>${p.revenue.toLocaleString()}đ</td></tr>`).join('')}
        </table>`;
    const reportContent = document.getElementById('report-content');
    if (reportContent) reportContent.innerHTML = html;
    window.__currentReportHtml = `<h2>BÁO CÁO THỐNG KÊ</h2>${html}`;
}
function exportReport() {
    if (!window.__currentReportHtml) { alert('Chưa có báo cáo để xuất!'); return; }
    const win = window.open('', '', 'width=900,height=900');
    win.document.write('<html><head><title>Xuất báo cáo</title>');
    win.document.write('<style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;}table{width:100%;border-collapse:collapse;}table,th,td{border:1px solid #ccc;padding:6px;text-align:left;}</style>');
    win.document.write('</head><body>');
    win.document.write(window.__currentReportHtml);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    win.print();
}

// --- Receipts (Phiếu nhập kho) ---
let __currentReceiptItems = [];

function populateReceiptSupplierSelect() {
    const sel = document.getElementById('receipt-supplier-select');
    if (!sel) return;
    sel.innerHTML = '';
    const role = getCurrentRole();
    const users = getUsers();
    if (role === 'admin') {
        const suppliers = users.filter(u => u.role === 'supplier');
        if (suppliers.length === 0) {
            const opt = document.createElement('option'); opt.value = ''; opt.textContent = '(Chưa có nhà cung cấp)'; sel.appendChild(opt);
        } else {
            suppliers.forEach(s => {
                const opt = document.createElement('option'); opt.value = s.username; opt.textContent = `${s.username} (${s.company || ''})`; sel.appendChild(opt);
            });
        }
    } else {
        const cur = users.find(u => u.username === getCurrentUser());
        if (cur && cur.role === 'supplier') {
            const opt = document.createElement('option'); opt.value = cur.username; opt.textContent = `${cur.username} (${cur.company || ''})`; sel.appendChild(opt);
        } else {
            const opt = document.createElement('option'); opt.value = ''; opt.textContent = '(Chọn nhà cung cấp nếu muốn)'; sel.appendChild(opt);
        }
    }
    const dspan = document.getElementById('receipt-date');
    if (dspan) dspan.textContent = new Date().toLocaleString();
}

function addReceiptItem() {
    const name = (document.getElementById('receipt-item-name').value || '').trim();
    const qty = parseInt(document.getElementById('receipt-item-qty').value);
    const noteEl = document.getElementById('receipt-notification');
    if (!noteEl) return;
    noteEl.textContent = '';
    if (!name || isNaN(qty) || qty <= 0) { noteEl.textContent = 'Nhập tên và số lượng hợp lệ cho mặt hàng!'; noteEl.style.color = '#c62828'; return; }
    const existing = __currentReceiptItems.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (existing) existing.qty += qty; else __currentReceiptItems.push({ name, qty });
    document.getElementById('receipt-item-name').value = '';
    document.getElementById('receipt-item-qty').value = '';
    renderCurrentReceiptItems();
}

function renderCurrentReceiptItems() {
    const div = document.getElementById('receipt-items-list');
    if (!div) return;
    if (__currentReceiptItems.length === 0) { div.innerHTML = '<i>Danh sách phiếu rỗng.</i>'; return; }
    const rows = __currentReceiptItems.map((it, idx) => `<div style="margin-bottom:6px;background:#fff;padding:8px;border-radius:8px;border:1px solid #eef6f5;">
        ${escapeHtml(it.name)} — <b>${it.qty}</b>
        <div style="float:right">
            <button class="icon-btn" onclick="removeReceiptItem(${idx})">🗑️ Xóa</button>
        </div>
    </div>`).join('');
    div.innerHTML = rows;
}
function removeReceiptItem(idx) { if (idx < 0 || idx >= __currentReceiptItems.length) return; __currentReceiptItems.splice(idx,1); renderCurrentReceiptItems(); }
function clearCurrentReceipt() { __currentReceiptItems = []; renderCurrentReceiptItems(); const noteEl = document.getElementById('receipt-notification'); if (noteEl) noteEl.textContent = ''; }

function createReceipt() {
    const role = getCurrentRole();
    if (!['admin','supplier','staff'].includes(role)) { alert('Bạn không có quyền tạo phiếu nhập kho'); return; }
    if (__currentReceiptItems.length === 0) { const note = document.getElementById('receipt-notification'); if (note) { note.textContent = 'Phiếu rỗng, thêm mặt hàng trước khi tạo!'; note.style.color='#c62828'; } return; }

    const sel = document.getElementById('receipt-supplier-select');
    const supplierUser = sel ? sel.value : '';
    const users = getUsers();
    let supplierInfo = null;
    if (supplierUser) supplierInfo = users.find(u => u.username === supplierUser && u.role === 'supplier');
    if (!supplierInfo && getCurrentRole() === 'supplier') supplierInfo = users.find(u => u.username === getCurrentUser());

    const receipt = {
        id: 'PN' + Date.now(),
        createdBy: getCurrentUser(),
        supplier: supplierInfo ? supplierInfo.username : (supplierUser || ''),
        supplierCompany: supplierInfo ? supplierInfo.company || '' : '',
        time: new Date().toISOString(),
        timeDisplay: new Date().toLocaleString(),
        items: JSON.parse(JSON.stringify(__currentReceiptItems))
    };

    const receipts = getWarehouseReceipts();
    receipts.push(receipt);
    setWarehouseReceipts(receipts);

    const warehouse = getWarehouseStock();
    receipt.items.forEach(it => {
        const w = warehouse.find(s => s.name.toLowerCase() === it.name.toLowerCase());
        if (w) w.qty += it.qty; else warehouse.push({ name: it.name, qty: it.qty });
    });
    setWarehouseStock(warehouse);

    __currentReceiptItems = [];
    renderCurrentReceiptItems();
    renderWarehouse();
    renderInventory();
    renderReceipts();

    const noteEl = document.getElementById('receipt-notification');
    if (noteEl) { noteEl.style.color = '#43a047'; noteEl.textContent = 'Tạo phiếu nhập kho thành công! Kho đã được cập nhật.'; }
}

function renderReceipts() {
    const div = document.getElementById('warehouse-receipts-list');
    if (!div) return;
    const receipts = getWarehouseReceipts().slice().reverse();
    if (receipts.length === 0) { div.innerHTML = '<i>Chưa có phiếu nhập kho nào.</i>'; return; }
    div.innerHTML = receipts.map(r => {
        const itemsHtml = r.items.map(i => `${escapeHtml(i.name)} x ${i.qty}`).join('<br>');
        return `<div style="border:1px solid #ddd;padding:8px;margin-bottom:8px;border-radius:6px;background:#fff;">
            <b>Phiếu:</b> ${escapeHtml(r.id)} | <b>Nhà cung cấp:</b> ${escapeHtml(r.supplier || '---')} ${r.supplierCompany ? '(' + escapeHtml(r.supplierCompany) + ')' : ''} | <b>Thời gian:</b> ${escapeHtml(r.timeDisplay || r.time)}
            <div style="margin-top:6px;">${itemsHtml}</div>
        </div>`;
    }).join(''); 
}

// --- Profile management ---
function fillProfileForm() {
    const user = getUsers().find(u => u.username === getCurrentUser());
    if (!user) return;
    const profileUsername = document.getElementById('profile-username');
    const profileEmail = document.getElementById('profile-email');
    const profileCompany = document.getElementById('profile-company');
    if (profileUsername) profileUsername.value = user.username;
    if (profileEmail) profileEmail.value = user.email || '';
    if (user.role === 'supplier') { if (profileCompany) { profileCompany.style.display = 'block'; profileCompany.value = user.company || ''; } } else { if (profileCompany) { profileCompany.style.display = 'none'; profileCompany.value = ''; } }
    ['profile-old-password','profile-new-password','profile-new-password2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const notifyEl = document.getElementById('profile-notification'); if (notifyEl) notifyEl.textContent = '';
}

function changeProfile() {
    const username = (document.getElementById('profile-username').value || '').trim();
    const email = (document.getElementById('profile-email').value || '').trim().toLowerCase();
    const company = document.getElementById('profile-company') ? (document.getElementById('profile-company').value || '').trim() : '';
    const oldPass = document.getElementById('profile-old-password').value || '';
    const newPass = document.getElementById('profile-new-password').value || '';
    const newPass2 = document.getElementById('profile-new-password2').value || '';
    const notifyEl = document.getElementById('profile-notification');

    let users = getUsers();
    let userIdx = users.findIndex(u => u.username === getCurrentUser());
    if (userIdx === -1) { if (notifyEl) notifyEl.textContent = 'Không tìm thấy tài khoản!'; return; }
    let user = users[userIdx];

    if (!oldPass) { if (notifyEl) notifyEl.textContent = 'Nhập mật khẩu cũ!'; return; }
    if (user.password !== oldPass) { if (notifyEl) notifyEl.textContent = 'Mật khẩu cũ không đúng!'; return; }

    if (!username) { if (notifyEl) notifyEl.textContent = 'Tên đăng nhập không được bỏ trống!'; return; }
    if (!email || !isValidEmail(email)) { if (notifyEl) notifyEl.textContent = 'Email không hợp lệ!'; return; }

    if (users.find((u,i)=>u.username===username && i!==userIdx)) { if (notifyEl) notifyEl.textContent = 'Tên đăng nhập đã tồn tại!'; return; }
    if (users.find((u,i)=>u.email && u.email.toLowerCase()===email && i!==userIdx)) { if (notifyEl) notifyEl.textContent = 'Email đã được đăng ký!'; return; }

    if (newPass || newPass2) {
        if (newPass.length < 4) { if (notifyEl) notifyEl.textContent = 'Mật khẩu mới quá ngắn!'; return; }
        if (newPass !== newPass2) { if (notifyEl) notifyEl.textContent = 'Nhập lại mật khẩu không khớp!'; return; }
        user.password = newPass;
    }

    user.username = username;
    user.email = email;
    if (user.role === 'supplier') user.company = company;

    users[userIdx] = user;
    setUsers(users);
    setCurrentUser(username);
    if (notifyEl) { notifyEl.style.color = '#43a047'; notifyEl.textContent = 'Cập nhật thành công!'; setTimeout(()=>{ notifyEl.textContent = ''; }, 2000); }
}

// --- Statistics / Reporting ---
function renderStatistics() {
    renderOverviewStats();
    renderCategoryAnalysis();
    renderTopProducts();
    renderRevenueChart();
    renderInventoryStatus();
}

function renderOverviewStats() {
    const products = getProductsList();
    const invoices = getInvoices();
    const warehouse = getWarehouseStock();
    
    // Total products
    const totalProducts = products.length;
    document.getElementById('stat-total-products').textContent = totalProducts;
    
    // Total orders
    const totalOrders = invoices.length;
    document.getElementById('stat-total-orders').textContent = totalOrders;
    
    // Total revenue and products sold
    let totalRevenue = 0;
    let totalSold = 0;
    invoices.forEach(inv => {
        inv.items.forEach(item => {
            totalRevenue += item.price * item.qty;
            totalSold += item.qty;
        });
    });
    document.getElementById('stat-total-revenue').textContent = totalRevenue.toLocaleString() + 'đ';
    document.getElementById('stat-total-sold').textContent = totalSold;
}

function renderCategoryAnalysis() {
    const products = getProductsList();
    const container = document.getElementById('stats-categories');
    if (!container) return;
    
    // Group products by their effects/categories
    const categoryMap = {};
    products.forEach(p => {
        const effects = extractKeywords(p.desc);
        effects.forEach(effect => {
            if (!categoryMap[effect]) {
                categoryMap[effect] = { count: 0, products: [] };
            }
            categoryMap[effect].count++;
            categoryMap[effect].products.push(p.name);
        });
    });
    
    const categories = Object.entries(categoryMap)
        .map(([name, data]) => ({ name, count: data.count, products: data.products }))
        .sort((a, b) => b.count - a.count);
    
    if (categories.length === 0) {
        container.innerHTML = '<p class="muted">Chưa có dữ liệu phân loại</p>';
        return;
    }
    
    const maxCount = categories[0].count;
    container.innerHTML = categories.map(cat => {
        const percentage = (cat.count / maxCount) * 100;
        return `
            <div class="category-bar">
                <div class="category-name">${capitalize(cat.name)}</div>
                <div class="category-progress">
                    <div class="category-progress-bar" style="width: ${percentage}%">
                        ${cat.count} sản phẩm
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderTopProducts() {
    const tbody = document.getElementById('stats-top-products');
    if (!tbody) return;
    
    const invoices = getInvoices();
    const productStats = {};
    
    invoices.forEach(inv => {
        inv.items.forEach(item => {
            if (!productStats[item.name]) {
                productStats[item.name] = { qty: 0, revenue: 0 };
            }
            productStats[item.name].qty += item.qty;
            productStats[item.name].revenue += item.price * item.qty;
        });
    });
    
    const topProducts = Object.entries(productStats)
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 10);
    
    if (topProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="muted">Chưa có dữ liệu bán hàng</td></tr>';
        return;
    }
    
    tbody.innerHTML = topProducts.map((p, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td>${escapeHtml(p.name)}</td>
            <td>${p.qty}</td>
            <td>${p.revenue.toLocaleString()}đ</td>
        </tr>
    `).join('');
}

function renderRevenueChart(fromDate = null, toDate = null) {
    const container = document.getElementById('stats-revenue-chart');
    if (!container) return;
    
    const invoices = getInvoices();
    let filtered = invoices;
    
    // Filter by date if provided
    if (fromDate) {
        const from = new Date(fromDate);
        filtered = filtered.filter(inv => new Date(inv.time) >= from);
    }
    if (toDate) {
        const to = new Date(toDate);
        to.setDate(to.getDate() + 1);
        filtered = filtered.filter(inv => new Date(inv.time) < to);
    }
    
    // Group by date
    const revenueByDate = {};
    filtered.forEach(inv => {
        const date = new Date(inv.time).toLocaleDateString('vi-VN');
        if (!revenueByDate[date]) {
            revenueByDate[date] = 0;
        }
        inv.items.forEach(item => {
            revenueByDate[date] += item.price * item.qty;
        });
    });
    
    const dateEntries = Object.entries(revenueByDate)
        .sort((a, b) => new Date(a[0]) - new Date(b[0]));
    
    if (dateEntries.length === 0) {
        container.innerHTML = '<p class="muted">Chưa có dữ liệu doanh thu trong khoảng thời gian này</p>';
        return;
    }
    
    const maxRevenue = Math.max(...dateEntries.map(([_, rev]) => rev));
    container.innerHTML = dateEntries.map(([date, revenue]) => {
        const percentage = (revenue / maxRevenue) * 100;
        return `
            <div class="revenue-chart-bar">
                <div class="revenue-date">${date}</div>
                <div class="revenue-bar-container">
                    <div class="revenue-bar" style="width: ${percentage}%">
                        ${revenue.toLocaleString()}đ
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterStatisticsByDate() {
    const fromDate = document.getElementById('stats-date-from').value;
    const toDate = document.getElementById('stats-date-to').value;
    renderRevenueChart(fromDate, toDate);
}

function renderInventoryStatus() {
    const tbody = document.getElementById('stats-inventory');
    if (!tbody) return;
    
    const warehouse = getWarehouseStock();
    
    if (warehouse.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="muted">Chưa có dữ liệu tồn kho</td></tr>';
        return;
    }
    
    tbody.innerHTML = warehouse.map(item => {
        let status = '';
        let statusClass = '';
        
        if (item.qty === 0) {
            status = 'Hết hàng';
            statusClass = 'inventory-status-low';
        } else if (item.qty < 10) {
            status = 'Sắp hết';
            statusClass = 'inventory-status-low';
        } else if (item.qty < 30) {
            status = 'Trung bình';
            statusClass = 'inventory-status-medium';
        } else {
            status = 'Đầy đủ';
            statusClass = 'inventory-status-good';
        }
        
        return `
            <tr>
                <td>${escapeHtml(item.name)}</td>
                <td>${item.qty}</td>
                <td class="${statusClass}">${status}</td>
            </tr>
        `;
    }).join('');
}

// --- Initial render & boot ---
document.addEventListener('DOMContentLoaded', () => {
    // Basic renders
    renderProducts();
    renderProductsAdmin && renderProductsAdmin();
    renderInventory && renderInventory();
    renderWarehouse && renderWarehouse();
    renderReceipts && renderReceipts();
    renderCurrentReceiptItems && renderCurrentReceiptItems();
    populateReceiptSupplierSelect && populateReceiptSupplierSelect();
    populateDescFilter && populateDescFilter();
    renderBestSellers && renderBestSellers();
    // if a user is logged in, show shop
    if (getCurrentUser()) showShop(); else showAuth();
});
// --- Header auth UI helper & theme binding (PATCH) ---
// Dán block này vào cuối script.js (sau tất cả hàm khác)

function updateHeaderAuth() {
  const headerDiv = document.getElementById('user-info');
  const nameEl = document.getElementById('current-user');
  const roleEl = document.getElementById('current-role');
  const current = (typeof getCurrentUser === 'function') ? getCurrentUser() : localStorage.getItem('pharmacy-current-user');

  if (!headerDiv) {
    console.warn('updateHeaderAuth: #user-info not found');
    return;
  }
  if (current) {
    headerDiv.style.display = 'flex';
    if (nameEl) nameEl.textContent = current;
    try {
      const u = (typeof getUsers === 'function') ? getUsers().find(x => x.username === current) : null;
      if (roleEl) {
        if (u) {
          if (u.role === 'staff') roleEl.innerHTML = `Nhân viên<br>Email: ${escapeHtml(u.email||'')}<br>SĐT: ${escapeHtml(u.phone||'')}<br>Mã NV: ${escapeHtml(u.staffCode||'')}`;
          else if (u.role === 'supplier') roleEl.innerHTML = `Nhà cung cấp<br>Email: ${escapeHtml(u.email||'')}<br>Công ty: ${escapeHtml(u.company||'')}`;
          else roleEl.innerHTML = `${escapeHtml(u.role)}<br>Email: ${escapeHtml(u.email||'')}`;
        } else {
          roleEl.textContent = '';
        }
      }
    } catch (e) {
      if (roleEl) roleEl.textContent = '';
    }
  } else {
    headerDiv.style.display = 'none';
    if (nameEl) nameEl.textContent = '';
    if (roleEl) roleEl.textContent = '';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // ensure header logout exists and bound
  const hLogout = document.getElementById('header-logout') || document.getElementById('logout-button') || null;
  if (hLogout && !hLogout.__bound_logout) {
    hLogout.addEventListener('click', function(e) {
      try { if (typeof logout === 'function') logout(); } catch (err) { console.warn('logout() not found', err); }
      try { updateHeaderAuth(); } catch(_) {}
    });
    hLogout.__bound_logout = true;
  }

  // update header initially
  try { updateHeaderAuth(); } catch(e) { console.warn('updateHeaderAuth error', e); }

  // apply saved theme if any (optional)
  try {
    const pref = localStorage.getItem('site-theme') || 'light';
    if (pref === 'dark' && document.body) document.body.classList.add('bt-theme');
  } catch (e) {}
});