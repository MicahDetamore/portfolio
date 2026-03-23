/* ============================================
   MOBILE NAVIGATION
   ============================================ */

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    });
});

/* ============================================
   SMOOTH SCROLLING & ACTIVE NAV LINK
   ============================================ */

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

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;

    if (atBottom) {
        // At the bottom of the page - always highlight the last section (Contact)
        current = sections[sections.length - 1].getAttribute('id');
    } else {
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */

const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });
}

/* ============================================
   CONTACT FORM
   ============================================ */

// Check if EmailJS is loaded
console.log('EmailJS loaded?', typeof emailjs !== 'undefined');

if (typeof emailjs !== 'undefined') {
    // Initialize EmailJS
    emailjs.init("hAgDXEiIyoIRckFGd");
    console.log('EmailJS initialized with public key');
} else {
    console.error('EmailJS library failed to load - this should not happen!');
}

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('Contact form submitted');

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Validate form
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email', 'error');
            return;
        }

        // Send email using EmailJS
        const templateParams = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            to_email: 'micah.detamore@gmail.com'
        };

        console.log('Sending email with params:', templateParams);
        console.log('Service ID: service_elqjh5r');
        console.log('Template ID: template_7y0uxjl');
        
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS is not defined - library not loaded');
            showNotification('Email service not loaded. Please refresh the page.', 'error');
            return;
        }

        emailjs.send('service_elqjh5r', 'template_7y0uxjl', templateParams)
            .then(function(response) {
                console.log('Email sent successfully. Response:', response);
                if (response.ok || response.status === 200) {
                    // Show success message
                    showNotification('Message sent successfully! I will get back to you soon.', 'success');
                    // Reset form
                    contactForm.reset();
                } else {
                    throw new Error('Server returned status ' + response.status);
                }
            })
            .catch(function(error) {
                console.error('EmailJS error details:', error);
                if (error.message) {
                    console.error('Error message:', error.message);
                }
                showNotification('Failed to send message. Please try again.', 'error');
            });
    });
}

/* ============================================
   NOTIFICATIONS
   ============================================ */

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        ${type === 'success' ? `
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
        ` : `
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
        `}
    `;

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/* ============================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ============================================ */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.project-card, .timeline-item, .skill-category, .stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

/* ============================================
   CURSOR EFFECTS
   ============================================ */

document.addEventListener('mousemove', (e) => {
    // Optional: Add cursor glow effect or other mouse-based effects
    // This is a placeholder for potential enhancements
});

/* ============================================
   DARK MODE TOGGLE (Optional)
   ============================================ */

// Uncomment to add dark mode functionality

/*
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const htmlElement = document.documentElement;

// Check for saved dark mode preference
const darkModePreference = localStorage.getItem('darkMode');
if (darkModePreference === 'enabled') {
    htmlElement.setAttribute('data-theme', 'dark');
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('darkMode', newTheme === 'dark' ? 'enabled' : 'disabled');
    });
}
*/

/* ============================================
   SCROLL TO TOP BUTTON
   ============================================ */

// Create scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = 'scroll-to-top';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 20px;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 20px rgba(45, 97, 0, 0.3);
    z-index: 999;
    transition: all 0.3s ease;
`;

document.body.appendChild(scrollTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

// Scroll to top
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseover', () => {
    scrollTopBtn.style.transform = 'translateY(-5px)';
    scrollTopBtn.style.boxShadow = '0 10px 30px rgba(45, 97, 0, 0.4)';
});

scrollTopBtn.addEventListener('mouseout', () => {
    scrollTopBtn.style.transform = 'translateY(0)';
    scrollTopBtn.style.boxShadow = '0 5px 20px rgba(45, 97, 0, 0.3)';
});

/* ============================================
   PAGE LOAD ANIMATION
   ============================================ */

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// Trigger animation on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        document.body.style.opacity = '1';
    });
} else {
    document.body.style.opacity = '1';
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Debounce function for scroll events
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================
   LOGGER FOR DEBUGGING
   ============================================ */

console.log('Portfolio website loaded successfully!');
