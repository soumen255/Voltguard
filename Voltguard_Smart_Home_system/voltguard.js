// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
const menuButton = document.createElement('button');
menuButton.className = 'menu-toggle';
menuButton.innerHTML = '<span class="material-icons">menu</span>';
document.querySelector('.navbar').insertBefore(menuButton, document.querySelector('.nav-links'));

menuButton.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            interest: document.getElementById('interest').value,
            message: document.getElementById('message').value
        };

        try {
            // Here you would typically send the data to your server
            // For demo purposes, we'll just show a success message
            showToast('Message sent successfully! We will contact you soon.', 'success');
            contactForm.reset();
        } catch (error) {
            showToast('Failed to send message. Please try again.', 'error');
        }
    });
}

// Hardware communication functions
const API_BASE_URL = 'http://localhost:3000/api';

// Get hardware status
async function getHardwareStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/status`);
        const data = await response.json();
        updateUIWithStatus(data);
    } catch (error) {
        console.error('Error fetching hardware status:', error);
    }
}

// Send control command to hardware
async function sendHardwareCommand(action, value) {
    try {
        const response = await fetch(`${API_BASE_URL}/control`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action, value }),
        });
        const data = await response.json();
        showToast(data.message, data.success ? 'success' : 'error');
    } catch (error) {
        console.error('Error sending command to hardware:', error);
        showToast('Failed to send command', 'error');
    }
}

// Update UI with hardware status
function updateUIWithStatus(status) {
    // Update status indicators
    const statusElements = document.querySelectorAll('.status-indicator');
    statusElements.forEach(element => {
        element.textContent = status.status;
        element.className = `status-indicator ${status.status}`;
    });

    // Update energy usage
    const energyUsageElement = document.querySelector('.energy-usage');
    if (energyUsageElement) {
        energyUsageElement.textContent = status.energyUsage;
    }

    // Update occupancy status
    const occupancyElement = document.querySelector('.occupancy-status');
    if (occupancyElement) {
        occupancyElement.textContent = status.occupancy ? 'Occupied' : 'Unoccupied';
        occupancyElement.className = `occupancy-status ${status.occupancy ? 'occupied' : 'unoccupied'}`;
    }
}

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize hardware communication
document.addEventListener('DOMContentLoaded', () => {
    // Get initial status
    getHardwareStatus();

    // Set up periodic status updates
    setInterval(getHardwareStatus, 5000);

    // Add event listeners for control buttons
    const controlButtons = document.querySelectorAll('.control-button');
    controlButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            const value = button.dataset.value;
            sendHardwareCommand(action, value);
        });
    });
});

// Smooth scroll function
function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

// Initialize animations on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add animation to elements
document.querySelectorAll('.benefit-card, .step, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Handle CTA buttons
document.querySelectorAll('.cta-button').forEach(button => {
    if (!button.type || button.type !== 'submit') {
        button.addEventListener('click', () => {
            if (button.textContent.includes('Demo') || button.textContent.includes('Buy')) {
                scrollToContact();
            }
        });
    }
});

// Add your contact information
const contactInfo = {
    email: 'soumenbhandari88@gmail.com',
    phone: '8116862676'
};

// Update footer contact information
const footerContact = document.querySelector('.footer-section:last-child');
if (footerContact) {
    footerContact.querySelector('p:first-child').textContent = `Email: ${contactInfo.email}`;
    footerContact.querySelector('p:last-child').textContent = `Phone: ${contactInfo.phone}`;
} 