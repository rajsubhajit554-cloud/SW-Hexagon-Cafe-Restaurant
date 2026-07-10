// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Mobile & Desktop Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent document click handler from firing immediately
    navLinks.classList.toggle('nav-active');
});

// Close menu when a link is clicked
const navItems = document.querySelectorAll('.nav-links li a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('nav-active');
    });
});

// Close menu when clicking anywhere outside the menu and hamburger button
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('nav-active')) {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove('nav-active');
        }
    }
});

// Close menu when user scrolls the page
window.addEventListener('scroll', () => {
    if (navLinks.classList.contains('nav-active')) {
        navLinks.classList.remove('nav-active');
    }
});

// Reveal Elements on Scroll
const revealElements = document.querySelectorAll('.reviews-slider-container, .vibe-text, .contact-container');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    revealElements.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.style.transition = 'all 0.8s ease-out';
        } else if (!el.style.opacity) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
// Trigger once on load
revealOnScroll();

// Banner Image Slider (Fade and Scale Effect with Hover Preview & Side Click Zones)
const bannerImages = document.querySelectorAll('.hero-bg img');
const leftZone = document.querySelector('.hero-nav-zone.left-zone');
const rightZone = document.querySelector('.hero-nav-zone.right-zone');

let currentImageIndex = 0;
let lastDisplayedIndex = -1;
let bannerInterval;

function updateBannerBg(imgElement) {
    const bannerContainer = document.querySelector('.hero-bg');
    if (bannerContainer && imgElement) {
        bannerContainer.style.setProperty('--bg-image', `url("${imgElement.src}")`);
    }
}

function transitionToBannerImage(targetIndex) {
    if (targetIndex === lastDisplayedIndex) return;
    if (targetIndex < 0 || targetIndex >= bannerImages.length) return;
    
    bannerImages.forEach(img => {
        img.classList.remove('active', 'prev');
    });
    
    if (lastDisplayedIndex !== -1 && lastDisplayedIndex < bannerImages.length) {
        bannerImages[lastDisplayedIndex].classList.add('prev');
    }
    
    bannerImages[targetIndex].classList.add('active');
    updateBannerBg(bannerImages[targetIndex]);
    lastDisplayedIndex = targetIndex;
}

function rotateBanner() {
    if (bannerImages.length <= 1) return;
    const nextIndex = (currentImageIndex + 1) % bannerImages.length;
    transitionToBannerImage(nextIndex);
    currentImageIndex = nextIndex;
}

function startBannerTimer() {
    stopBannerTimer();
    if (bannerImages.length > 1) {
        bannerInterval = setInterval(rotateBanner, 5000); // Change image every 5 seconds
    }
}

function stopBannerTimer() {
    if (bannerInterval) {
        clearInterval(bannerInterval);
    }
}

// Initialize banner
if (bannerImages.length > 0) {
    transitionToBannerImage(0);
    startBannerTimer();
}

// Add event listeners for navigation zones
if (leftZone && bannerImages.length > 1) {
    leftZone.addEventListener('click', () => {
        const prevIndex = (currentImageIndex - 1 + bannerImages.length) % bannerImages.length;
        currentImageIndex = prevIndex;
        transitionToBannerImage(currentImageIndex);
        startBannerTimer(); // reset auto-slide timer on manual click
    });
}

if (rightZone && bannerImages.length > 1) {
    rightZone.addEventListener('click', () => {
        const nextIndex = (currentImageIndex + 1) % bannerImages.length;
        currentImageIndex = nextIndex;
        transitionToBannerImage(currentImageIndex);
        startBannerTimer(); // reset auto-slide timer on manual click
    });
}

// Reviews Slider Animation
const reviewItems = document.querySelectorAll('.reviews-slider .review-slide');
const reviewDots = document.querySelectorAll('.slider-dots .dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentReviewIndex = 0;
let reviewInterval;

function showReview(index) {
    if (reviewItems.length === 0) return;
    
    // Wrap around index
    if (index >= reviewItems.length) {
        currentReviewIndex = 0;
    } else if (index < 0) {
        currentReviewIndex = reviewItems.length - 1;
    } else {
        currentReviewIndex = index;
    }
    
    // Update active classes for reviews
    reviewItems.forEach((item, i) => {
        if (i === currentReviewIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update active classes for dots
    reviewDots.forEach((dot, i) => {
        if (i === currentReviewIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function startReviewTimer() {
    stopReviewTimer();
    reviewInterval = setInterval(() => {
        showReview(currentReviewIndex + 1);
    }, 5000); // changes review every 5 seconds
}

function stopReviewTimer() {
    if (reviewInterval) {
        clearInterval(reviewInterval);
    }
}

// Event Listeners for controls
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        showReview(currentReviewIndex + 1);
        startReviewTimer(); // reset timer on manual click
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        showReview(currentReviewIndex - 1);
        startReviewTimer(); // reset timer on manual click
    });
}

if (reviewDots) {
    reviewDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            showReview(index);
            startReviewTimer(); // reset timer on manual click
        });
    });
}

// Initialize reviews slider
if (reviewItems.length > 0) {
    showReview(0);
    startReviewTimer();
}

// Preloader Screen Logic (Fades out after 1 second and reveals Promo Poster if present)
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader-fade-out');
            
            // Show Promo Modal after preloader fades out
            const promoModal = document.getElementById('promo-modal');
            if (promoModal) {
                setTimeout(openPromoModal, 300);
            } else {
                document.body.classList.remove('no-scroll'); // Re-enable vertical scrolling if no promo modal
            }
        }, 1000); // 1 second duration
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initPreloader);
} else {
    initPreloader();
}

// Rath Yatra Restaurant Feast Click-to-Activate Animation
const templeBell = document.getElementById('temple-bell');
const rathAltar = document.getElementById('rath-feast-altar');
if (templeBell && rathAltar) {
    templeBell.addEventListener('click', () => {
        if (!rathAltar.classList.contains('activated')) {
            rathAltar.classList.add('activated');
            
            // Reset animations after 2.5 seconds
            setTimeout(() => {
                rathAltar.classList.remove('activated');
            }, 2500);
        }
    });
}

// ============================================================
// SLIDE-OUT MESSAGE PANEL LOGIC
// ============================================================
// Message Panel Logic
const closeMsgPanelBtn = document.getElementById('close-msg-panel-btn');
const msgPanel = document.getElementById('msg-panel');
const msgPanelOverlay = document.getElementById('msg-panel-overlay');
const msgPanelForm = document.getElementById('msg-panel-form');
const submitMsgBtn = document.getElementById('submit-msg-btn');
const msgStatusContainer = document.getElementById('msg-status-container');
const openMsgPanelDirectBtn = document.getElementById('open-msg-panel-direct-btn');

// Google Sheet Web App URL provided by user
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwFRBfgECv4kyCOJCrjDmpbWn4oIkiCJOpGndOI_d3SCzTtWGuG14uJZ2xGtUIDEsL8/exec";

function openMessagePanel() {
    if (msgPanel && msgPanelOverlay) {
        msgPanel.classList.add('active');
        msgPanelOverlay.classList.add('active');
        document.body.classList.add('no-scroll'); // Disable page scrolling
    }
}

function closeMessagePanel() {
    if (msgPanel && msgPanelOverlay) {
        msgPanel.classList.remove('active');
        msgPanelOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll'); // Restore page scrolling
        // Reset status message
        if (msgStatusContainer) {
            msgStatusContainer.style.display = 'none';
            msgStatusContainer.className = 'msg-status-container';
        }
    }
}

if (openMsgPanelDirectBtn) {
    openMsgPanelDirectBtn.addEventListener('click', openMessagePanel);
}

if (closeMsgPanelBtn) {
    closeMsgPanelBtn.addEventListener('click', closeMessagePanel);
}

if (msgPanelOverlay) {
    msgPanelOverlay.addEventListener('click', closeMessagePanel);
}

// Handle Form Submission
if (msgPanelForm) {
    msgPanelForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('msg-name');
        const emailInput = document.getElementById('msg-email');
        const contentInput = document.getElementById('msg-content');

        if (!nameInput || !emailInput || !contentInput) return;

        const payload = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: contentInput.value.trim()
        };

        // Disable button and show loading state
        submitMsgBtn.disabled = true;
        const originalBtnContent = submitMsgBtn.innerHTML;
        submitMsgBtn.innerHTML = '<div class="btn-loader"></div> Sending...';

        // Hide previous status
        if (msgStatusContainer) {
            msgStatusContainer.style.display = 'none';
        }

        // Send post request to Google Sheets script
        fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8' // Apps Script handles text/plain without triggering CORS preflight options blocks in some environments
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            // Apps script returns 200 or redirect
            submitMsgBtn.innerHTML = originalBtnContent;
            submitMsgBtn.disabled = false;
            
            if (msgStatusContainer) {
                msgStatusContainer.textContent = "Your message was sent successfully! Thank you.";
                msgStatusContainer.className = "msg-status-container success";
            }
            
            // Clear inputs
            msgPanelForm.reset();
            
            // Auto close after 3 seconds
            setTimeout(closeMessagePanel, 3000);
        })
        .catch((error) => {
            // Error response
            submitMsgBtn.innerHTML = originalBtnContent;
            submitMsgBtn.disabled = false;
            
            if (msgStatusContainer) {
                msgStatusContainer.textContent = "Something went wrong. Please try again.";
                msgStatusContainer.className = "msg-status-container error";
            }
            console.error("Error submitting contact form:", error);
        });
    });
}

// ============================================================
// PROMOTIONAL POSTER MODAL LOGIC
// ============================================================
const promoModal = document.getElementById('promo-modal');
const closePromoModalBtn = document.getElementById('close-promo-modal-btn');
const promoModalOverlay = document.querySelector('.promo-modal-overlay');
const promoModalContent = document.querySelector('.promo-modal-content');
const openPromoModalDirectBtn = document.getElementById('open-promo-modal-direct-btn');

function closePromoModal() {
    if (promoModal && promoModalContent) {
        const button = document.getElementById('open-promo-modal-direct-btn');
        if (button) {
            const buttonRect = button.getBoundingClientRect();
            const contentRect = promoModalContent.getBoundingClientRect();

            // Calculate exact center coordinates difference
            const dx = (buttonRect.left + buttonRect.width / 2) - (contentRect.left + contentRect.width / 2);
            const dy = (buttonRect.top + buttonRect.height / 2) - (contentRect.top + contentRect.height / 2);

            // Apply to CSS variables
            promoModalContent.style.setProperty('--fly-x', `${dx}px`);
            promoModalContent.style.setProperty('--fly-y', `${dy}px`);
        }

        // Add closing state to trigger scale and translation
        promoModal.classList.add('closing');
        document.body.classList.remove('no-scroll'); // Restore scrolling

        setTimeout(() => {
            promoModal.classList.remove('active', 'closing');
            promoModalContent.style.removeProperty('--fly-x');
            promoModalContent.style.removeProperty('--fly-y');
        }, 650); // 650ms match with CSS keyframe animation duration
    } else if (promoModal) {
        promoModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}

function openPromoModal() {
    if (promoModal) {
        promoModal.classList.remove('closing');
        if (promoModalContent) {
            promoModalContent.style.removeProperty('--fly-x');
            promoModalContent.style.removeProperty('--fly-y');
        }
        promoModal.classList.add('active');
        document.body.classList.add('no-scroll'); // Lock scrolling
    }
}

if (openPromoModalDirectBtn) {
    openPromoModalDirectBtn.addEventListener('click', openPromoModal);
}

if (closePromoModalBtn) {
    closePromoModalBtn.addEventListener('click', closePromoModal);
}

if (promoModalOverlay) {
    promoModalOverlay.addEventListener('click', closePromoModal);
}

// ============================================================
// END OF FILE
// ============================================================

