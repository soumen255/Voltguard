// Device data
const devices = [
    {
        id: 1,
        name: "Living Room Light",
        type: "light",
        icon: "lightbulb",
        status: "on",
        value: 80,
        room: "living-room",
        lastUpdated: "2 minutes ago",
        powerUsage: 0.12 // kW
    },
    {
        id: 2,
        name: "Bedroom Light",
        type: "light",
        icon: "lightbulb",
        status: "off",
        value: 0,
        room: "bedroom",
        lastUpdated: "5 minutes ago",
        powerUsage: 0.08
    },
    {
        id: 3,
        name: "Kitchen Light",
        type: "light",
        icon: "lightbulb",
        status: "on",
        value: 60,
        room: "kitchen",
        lastUpdated: "1 minute ago",
        powerUsage: 0.09
    },
    {
        id: 4,
        name: "Living Room Thermostat",
        type: "thermostat",
        icon: "thermostat",
        status: "on",
        value: 22,
        room: "living-room",
        lastUpdated: "10 minutes ago",
        powerUsage: 0.15
    },
    {
        id: 5,
        name: "Security Camera",
        type: "camera",
        icon: "videocam",
        status: "on",
        value: 100,
        room: "entrance",
        lastUpdated: "Just now",
        powerUsage: 0.05
    }
];

// Energy monitoring data
const energyData = {
    currentUsage: 2.4,
    monthlyCost: 45.20,
    carbonFootprint: 0.8,
    trends: {
        usage: -12,
        cost: 8,
        carbon: -15
    }
};

// State management
let currentRoom = "all";
let isDarkMode = false;
let isEcoMode = false;
let isAwayMode = false;

// DOM Elements
const sidebar = document.querySelector('.sidebar');
const menuToggle = document.querySelector('.menu-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const roomButtons = document.querySelectorAll('.room-btn');
const roomTitle = document.querySelector('.room-title');
const devicesGrid = document.querySelector('.devices-grid');
const quickActionButtons = document.querySelectorAll('.quick-action-btn');

// Tab Navigation
const navLinks = document.querySelectorAll('.nav-links li');
const tabContents = document.querySelectorAll('.tab-content');

// Event Listeners
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    themeToggle.querySelector('.material-icons').textContent = isDarkMode ? 'light_mode' : 'dark_mode';
});

roomButtons.forEach(button => {
    button.addEventListener('click', () => {
        const room = button.getAttribute('data-room');
        currentRoom = room;

        // Update active state
        roomButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update room title
        updateRoomTitle(room);

        // Render devices
        renderDevices();
    });
});

// Quick action buttons
quickActionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        handleQuickAction(action);
    });
});

// Tab Navigation
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const tabId = link.getAttribute('data-tab');

        // Update active states
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Show selected tab
        tabContents.forEach(tab => {
            tab.classList.remove('active');
            if (tab.id === tabId) {
                tab.classList.add('active');
            }
        });

        // Initialize charts if analytics tab is selected
        if (tabId === 'analytics') {
            initializeCharts();
        }
    });
});

// Functions
function updateRoomTitle(room) {
    const roomNames = {
        'all': 'All Rooms',
        'living-room': 'Living Room',
        'bedroom': 'Bedroom',
        'kitchen': 'Kitchen',
        'entrance': 'Entrance'
    };

    roomTitle.querySelector('h2').textContent = roomNames[room];
    roomTitle.querySelector('p').textContent = `${devices.filter(d => room === 'all' || d.room === room).length} devices`;
}

function createDeviceCard(device) {
    const card = document.createElement('div');
    card.className = 'device-card';
    card.innerHTML = `
        <div class="device-header">
            <span class="material-icons device-icon">${device.icon}</span>
            <span class="device-status ${device.status}">${device.status}</span>
        </div>
        <h3 class="device-name">${device.name}</h3>
        <div class="device-controls">
            <button class="power-button">
                <span class="material-icons">${device.status === 'on' ? 'power_settings_new' : 'power_off'}</span>
            </button>
            ${device.type === 'light' || device.type === 'thermostat' ? `
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${device.value}%"></div>
                </div>
                <input type="range" class="device-slider" min="0" max="100" value="${device.value}">
            ` : ''}
        </div>
        <div class="device-footer">
            <span>Last updated: ${device.lastUpdated}</span>
            <span>${device.type === 'thermostat' ? device.value + '°C' : device.value + '%'}</span>
        </div>
        <div class="device-energy">
            <span class="material-icons">electric_bolt</span>
            <span>${device.powerUsage} kW</span>
        </div>
    `;

    // Add event listeners
    const powerButton = card.querySelector('.power-button');
    powerButton.addEventListener('click', () => toggleDeviceStatus(device));

    const slider = card.querySelector('.device-slider');
    if (slider) {
        slider.addEventListener('input', (e) => updateDeviceValue(device, e.target.value));
    }

    return card;
}

function renderDevices() {
    devicesGrid.innerHTML = '';
    const filteredDevices = currentRoom === 'all'
        ? devices
        : devices.filter(device => device.room === currentRoom);

    filteredDevices.forEach(device => {
        devicesGrid.appendChild(createDeviceCard(device));
    });
}

function toggleDeviceStatus(device) {
    device.status = device.status === 'on' ? 'off' : 'on';
    device.value = device.status === 'on' ? 80 : 0;
    device.lastUpdated = 'Just now';
    updateEnergyUsage();
    renderDevices();
}

function updateDeviceValue(device, value) {
    device.value = parseInt(value);
    device.lastUpdated = 'Just now';
    updateEnergyUsage();
    renderDevices();
}

function updateEnergyUsage() {
    const totalUsage = devices.reduce((sum, device) => {
        return sum + (device.status === 'on' ? device.powerUsage * (device.value / 100) : 0);
    }, 0);

    energyData.currentUsage = totalUsage.toFixed(1);
    energyData.monthlyCost = (totalUsage * 0.12 * 30).toFixed(2); // Assuming $0.12 per kWh
    energyData.carbonFootprint = (totalUsage * 0.0007).toFixed(1); // Assuming 0.7 kg CO2 per kWh

    updateEnergyDisplay();
}

function updateEnergyDisplay() {
    document.querySelector('.energy-value:nth-child(2)').textContent = `${energyData.currentUsage} kW`;
    document.querySelector('.energy-value:nth-child(3)').textContent = `$${energyData.monthlyCost}`;
    document.querySelector('.energy-value:nth-child(4)').textContent = `${energyData.carbonFootprint} tons`;
}

function handleQuickAction(action) {
    switch (action) {
        case 'all-on':
            devices.forEach(device => {
                device.status = 'on';
                device.value = 80;
                device.lastUpdated = 'Just now';
            });
            break;
        case 'all-off':
            devices.forEach(device => {
                device.status = 'off';
                device.value = 0;
                device.lastUpdated = 'Just now';
            });
            break;
        case 'eco-mode':
            isEcoMode = !isEcoMode;
            devices.forEach(device => {
                if (device.status === 'on') {
                    device.value = Math.min(device.value, 60);
                    device.lastUpdated = 'Just now';
                }
            });
            break;
        case 'away-mode':
            isAwayMode = !isAwayMode;
            if (isAwayMode) {
                devices.forEach(device => {
                    if (device.type !== 'camera') {
                        device.status = 'off';
                        device.value = 0;
                        device.lastUpdated = 'Just now';
                    }
                });
            }
            break;
    }
    updateEnergyUsage();
    renderDevices();
}

// Analytics Charts
function initializeCharts() {
    // Energy Usage Trends Chart
    const energyCtx = document.getElementById('energyChart').getContext('2d');
    new Chart(energyCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Energy Usage (kWh)',
                data: [24.5, 22.8, 25.3, 23.7, 26.1, 21.9, 20.5],
                borderColor: '#00b894',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(0, 184, 148, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    // Device Usage Distribution Chart
    const deviceCtx = document.getElementById('deviceChart').getContext('2d');
    new Chart(deviceCtx, {
        type: 'doughnut',
        data: {
            labels: ['Lights', 'Thermostat', 'Security', 'Other'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#00b894',
                    '#ff3366',
                    '#6c5ce7',
                    '#a8a8a8'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });

    // Cost Analysis Chart
    const costCtx = document.getElementById('costChart').getContext('2d');
    new Chart(costCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Cost ($)',
                data: [45.20, 42.80, 48.50, 43.90, 46.70, 41.30],
                backgroundColor: '#00b894'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

// Energy Schedule
const scheduleData = [
    { time: '6:00 AM', action: 'Turn on living room lights', status: 'active' },
    { time: '8:00 AM', action: 'Adjust thermostat for day', status: 'active' },
    { time: '6:00 PM', action: 'Turn on all lights', status: 'active' },
    { time: '10:00 PM', action: 'Dim lights for night', status: 'active' },
    { time: '11:00 PM', action: 'Turn off non-essential devices', status: 'active' }
];

function renderSchedule() {
    const scheduleGrid = document.querySelector('.schedule-grid');
    scheduleGrid.innerHTML = scheduleData.map(item => `
        <div class="schedule-item ${item.status}">
            <div class="schedule-time">${item.time}</div>
            <div class="schedule-action">${item.action}</div>
            <div class="schedule-status">
                <span class="material-icons">${item.status === 'active' ? 'check_circle' : 'cancel'}</span>
            </div>
        </div>
    `).join('');
}

// Settings State Management
const settings = {
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'en',
    notifications: {
        push: localStorage.getItem('pushNotifications') === 'true',
        email: localStorage.getItem('emailNotifications') === 'true'
    },
    security: {
        twoFactorAuth: localStorage.getItem('twoFactorAuth') === 'true',
        autoLock: localStorage.getItem('autoLock') || '15'
    },
    energy: {
        autoEcoMode: localStorage.getItem('autoEcoMode') === 'true',
        energyAlerts: localStorage.getItem('energyAlerts') === 'true'
    }
};

// Settings Functionality
function initializeSettings() {
    // Theme Selection
    const themeSelect = document.getElementById('themeSelect');
    themeSelect.value = settings.theme;
    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        settings.theme = theme;
        localStorage.setItem('theme', theme);
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.body.setAttribute('data-theme', theme);
        }
    });

    // Language Selection
    const languageSelect = document.getElementById('languageSelect');
    languageSelect.value = settings.language;
    languageSelect.addEventListener('change', (e) => {
        settings.language = e.target.value;
        localStorage.setItem('language', e.target.value);
        updateLanguage(e.target.value);
    });

    // Notification Settings
    const pushNotifications = document.getElementById('pushNotifications');
    const emailNotifications = document.getElementById('emailNotifications');

    pushNotifications.checked = settings.notifications.push;
    emailNotifications.checked = settings.notifications.email;

    pushNotifications.addEventListener('change', (e) => {
        settings.notifications.push = e.target.checked;
        localStorage.setItem('pushNotifications', e.target.checked);
        updateNotificationSettings();
    });

    emailNotifications.addEventListener('change', (e) => {
        settings.notifications.email = e.target.checked;
        localStorage.setItem('emailNotifications', e.target.checked);
        updateNotificationSettings();
    });

    // Security Settings
    const twoFactorAuth = document.getElementById('twoFactorAuth');
    const autoLockSelect = document.getElementById('autoLockSelect');

    twoFactorAuth.checked = settings.security.twoFactorAuth;
    autoLockSelect.value = settings.security.autoLock;

    twoFactorAuth.addEventListener('change', (e) => {
        settings.security.twoFactorAuth = e.target.checked;
        localStorage.setItem('twoFactorAuth', e.target.checked);
        updateSecuritySettings();
    });

    autoLockSelect.addEventListener('change', (e) => {
        settings.security.autoLock = e.target.value;
        localStorage.setItem('autoLock', e.target.value);
        updateSecuritySettings();
    });

    // Energy Settings
    const autoEcoMode = document.getElementById('autoEcoMode');
    const energyAlerts = document.getElementById('energyAlerts');

    autoEcoMode.checked = settings.energy.autoEcoMode;
    energyAlerts.checked = settings.energy.energyAlerts;

    autoEcoMode.addEventListener('change', (e) => {
        settings.energy.autoEcoMode = e.target.checked;
        localStorage.setItem('autoEcoMode', e.target.checked);
        updateEnergySettings();
    });

    energyAlerts.addEventListener('change', (e) => {
        settings.energy.energyAlerts = e.target.checked;
        localStorage.setItem('energyAlerts', e.target.checked);
        updateEnergySettings();
    });
}

// Settings Update Functions
function updateLanguage(language) {
    // Here you would implement language switching logic
    console.log('Language changed to:', language);
}

function updateNotificationSettings() {
    // Here you would implement notification settings logic
    console.log('Notification settings updated:', settings.notifications);
}

function updateSecuritySettings() {
    // Here you would implement security settings logic
    console.log('Security settings updated:', settings.security);
}

function updateEnergySettings() {
    // Here you would implement energy settings logic
    console.log('Energy settings updated:', settings.energy);

    // Auto Eco Mode Implementation
    if (settings.energy.autoEcoMode) {
        // Check current energy usage and enable eco mode if usage is high
        const currentUsage = parseFloat(energyData.currentUsage);
        if (currentUsage > 3.0) { // Threshold of 3 kW
            isEcoMode = true;
            devices.forEach(device => {
                if (device.status === 'on') {
                    device.value = Math.min(device.value, 60);
                    device.lastUpdated = 'Just now';
                }
            });
            renderDevices();
        }
    }

    // Energy Alerts Implementation
    if (settings.energy.energyAlerts) {
        const currentUsage = parseFloat(energyData.currentUsage);
        if (currentUsage > 4.0) { // Alert threshold of 4 kW
            showEnergyAlert('High energy usage detected! Consider enabling eco mode.');
        }
    }
}

function showEnergyAlert(message) {
    // Create and show a notification
    const notification = document.createElement('div');
    notification.className = 'energy-alert';
    notification.innerHTML = `
        <span class="material-icons">warning</span>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Add CSS for energy alerts
const style = document.createElement('style');
style.textContent = `
    .energy-alert {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--error-color);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 2px 4px var(--shadow-color);
        animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize app
function init() {
    // Set initial theme
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

    // Set initial room
    updateRoomTitle('all');

    // Update energy display
    updateEnergyDisplay();

    // Render devices
    renderDevices();

    // Render energy schedule
    renderSchedule();

    // Initialize settings
    initializeSettings();
}

// Start the app
init(); 