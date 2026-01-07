const app = {
    // Default Config
    defaults: {
        brandName: "DMP AI Dev",
        heroTitle: "Kiến tạo giải pháp",
        heroSubtitle: "Phần mềm Đột phá",
        heroDesc: "Chúng tôi cung cấp dịch vụ thiết kế Website, Mobile App và tích hợp AI hàng đầu. Đưa doanh nghiệp của bạn vươn tầm cao mới với công nghệ hiện đại.",
        primaryColor: "#1677ff",
        radius: "6px",
        phone: "+84 766 771 509",
        email: "dmpaidev@gmail.com",
        address: "06 Nguyễn Bính, Huế",
        fb: "https://www.facebook.com/profile.php?id=61585771779201",
        yt: "youtube.com/@DMPAIDev",
        tt: "https://www.tiktok.com/@dpmaidev",
        zalo: "https://zalo.me/0766771509"
    },

    init: function() {
        this.loadConfig();
        this.renderUI();
        
        // If on admin page, check auth state
        if (window.location.pathname.includes('admin.html')) {
            this.checkAdminAuth();
        }
    },

    // Data Management
    getConfig: function() {
        const saved = localStorage.getItem('siteConfig');
        return saved ? JSON.parse(saved) : this.defaults;
    },

    saveConfigToStorage: function(config) {
        localStorage.setItem('siteConfig', JSON.stringify(config));
        this.renderUI(); // Live update if possible
    },

    loadConfig: function() {
        const config = this.getConfig();
        // Set CSS Variables
        const root = document.documentElement;
        root.style.setProperty('--primary', config.primaryColor);
        root.style.setProperty('--radius', config.radius);
    },

    renderUI: function() {
        const config = this.getConfig();
        
        // Text Content Injection
        document.querySelectorAll('[data-cms]').forEach(el => {
            const key = el.getAttribute('data-cms');
            if (config[key]) el.textContent = config[key];
        });

        // Social Links Injection
        const setLink = (id, url) => {
            const el = document.getElementById(id);
            if (el) {
                if(url) { el.href = url.startsWith('http') ? url : 'https://' + url; el.style.display = 'flex'; }
                else { el.style.display = 'none'; }
            }
        };
        setLink('linkFb', config.fb);
        setLink('linkYt', config.yt);
        setLink('linkTt', config.tt);
        setLink('linkZalo', config.zalo);

        // Admin Inputs Injection (if on admin page)
        if (document.getElementById('conf-brandName')) {
            document.getElementById('conf-brandName').value = config.brandName;
            document.getElementById('conf-heroTitle').value = config.heroTitle;
            document.getElementById('conf-heroSubtitle').value = config.heroSubtitle;
            document.getElementById('conf-heroDesc').value = config.heroDesc;
            document.getElementById('conf-primary').value = config.primaryColor;
            document.getElementById('conf-radius').value = config.radius;
            document.getElementById('conf-phone').value = config.phone;
            document.getElementById('conf-email').value = config.email;
            document.getElementById('conf-address').value = config.address;
            document.getElementById('conf-fb').value = config.fb;
            document.getElementById('conf-yt').value = config.yt;
            document.getElementById('conf-tt').value = config.tt;
            document.getElementById('conf-zalo').value = config.zalo;
        }
    },

    // Public: Submit Lead
    submitLead: function(e) {
        e.preventDefault();
        const form = e.target;
        const lead = {
            id: Date.now(),
            date: new Date().toLocaleString('vi-VN'),
            name: form.name.value,
            phone: form.phone.value,
            message: form.message.value
        };

        const leads = JSON.parse(localStorage.getItem('siteLeads') || '[]');
        leads.unshift(lead);
        localStorage.setItem('siteLeads', JSON.stringify(leads));

        alert('Cảm ơn bạn! Chúng tôi đã nhận được thông tin và sẽ liên hệ sớm.');
        form.reset();
    },

    // Admin: Auth
    adminLogin: function() {
        const pass = document.getElementById('adminPass').value;
        if (pass === 'Phu@1976') {
            sessionStorage.setItem('isAdmin', 'true');
            document.getElementById('loginOverlay').classList.add('hidden');
            document.getElementById('adminContent').classList.remove('hidden');
            this.renderLeads();
        } else {
            document.getElementById('loginMsg').classList.remove('hidden');
        }
    },

    checkAdminAuth: function() {
        if (sessionStorage.getItem('isAdmin') === 'true') {
            document.getElementById('loginOverlay').classList.add('hidden');
            document.getElementById('adminContent').classList.remove('hidden');
            this.renderLeads();
        }
    },

    logout: function() {
        sessionStorage.removeItem('isAdmin');
        window.location.reload();
    },

    // Admin: Logic
    switchTab: function(tabName) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        document.getElementById('tab-' + tabName).classList.remove('hidden');
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('bg-blue-50', 'text-[var(--primary)]');
            if(btn.dataset.tab === tabName) btn.classList.add('bg-blue-50', 'text-[var(--primary)]');
        });
    },

    saveConfig: function() {
        const newConfig = {
            brandName: document.getElementById('conf-brandName').value,
            heroTitle: document.getElementById('conf-heroTitle').value,
            heroSubtitle: document.getElementById('conf-heroSubtitle').value,
            heroDesc: document.getElementById('conf-heroDesc').value,
            primaryColor: document.getElementById('conf-primary').value,
            radius: document.getElementById('conf-radius').value,
            phone: document.getElementById('conf-phone').value,
            email: document.getElementById('conf-email').value,
            address: document.getElementById('conf-address').value,
            fb: document.getElementById('conf-fb').value,
            yt: document.getElementById('conf-yt').value,
            tt: document.getElementById('conf-tt').value,
            zalo: document.getElementById('conf-zalo').value
        };
        this.saveConfigToStorage(newConfig);
        alert('Đã lưu cấu hình thành công!');
    },

    renderLeads: function() {
        const leads = JSON.parse(localStorage.getItem('siteLeads') || '[]');
        const tbody = document.getElementById('leadsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = leads.map(lead => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${lead.date}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${lead.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${lead.phone}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${lead.message}</td>
            </tr>
        `).join('');
    },

    exportLeads: function() {
        const leads = JSON.parse(localStorage.getItem('siteLeads') || '[]');
        let csvContent = "data:text/csv;charset=utf-8,Date,Name,Phone,Message\n";
        leads.forEach(row => {
            csvContent += `${row.date},${row.name},${row.phone},"${row.message}"\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "dmp_leads.csv");
        document.body.appendChild(link);
        link.click();
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => app.init());
