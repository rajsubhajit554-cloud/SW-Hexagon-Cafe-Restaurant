// ============================================================
// GUARANTEED PRELOADER INITIALIZATION & SAFETY FALLBACK
// ============================================================
(function() {
    let preloaderDismissed = false;
    function dismissPreloader() {
        if (preloaderDismissed) return;
        preloaderDismissed = true;
        
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('preloader-fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
        document.body.classList.remove('no-scroll');
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(dismissPreloader, 400);
    } else {
        window.addEventListener('DOMContentLoaded', () => setTimeout(dismissPreloader, 400));
        window.addEventListener('load', () => setTimeout(dismissPreloader, 400));
    }
    
    // Hard fallback timeout (maximum 1.5 seconds)
    setTimeout(dismissPreloader, 1500);
})();

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }
});

// Mobile & Desktop Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('nav-active');
    });
}

// Close menu when a link is clicked
const navItems = document.querySelectorAll('.nav-links li a');
if (navItems && navLinks) {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
        });
    });
}

// Close menu when clicking anywhere outside the menu and hamburger button
document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('nav-active')) {
        if (!navLinks.contains(e.target) && (!hamburger || !hamburger.contains(e.target))) {
            navLinks.classList.remove('nav-active');
        }
    }
});

// Close menu when user scrolls the page
window.addEventListener('scroll', () => {
    if (navLinks && navLinks.classList.contains('nav-active')) {
        navLinks.classList.remove('nav-active');
    }
});

// Reveal Elements on Scroll
const revealElements = document.querySelectorAll('.reviews-slider-container, .vibe-text, .contact-container, .main-menu-section');

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
revealOnScroll();

// Banner Image Slider
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
        bannerInterval = setInterval(rotateBanner, 5000);
    }
}

function stopBannerTimer() {
    if (bannerInterval) {
        clearInterval(bannerInterval);
    }
}

if (bannerImages.length > 0) {
    transitionToBannerImage(0);
    startBannerTimer();
}

if (leftZone && bannerImages.length > 1) {
    leftZone.addEventListener('click', () => {
        const prevIndex = (currentImageIndex - 1 + bannerImages.length) % bannerImages.length;
        currentImageIndex = prevIndex;
        transitionToBannerImage(currentImageIndex);
        startBannerTimer();
    });
}

if (rightZone && bannerImages.length > 1) {
    rightZone.addEventListener('click', () => {
        const nextIndex = (currentImageIndex + 1) % bannerImages.length;
        currentImageIndex = nextIndex;
        transitionToBannerImage(currentImageIndex);
        startBannerTimer();
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
    
    if (index >= reviewItems.length) {
        currentReviewIndex = 0;
    } else if (index < 0) {
        currentReviewIndex = reviewItems.length - 1;
    } else {
        currentReviewIndex = index;
    }
    
    reviewItems.forEach((item, i) => {
        if (i === currentReviewIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
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
    if (reviewItems.length > 1) {
        reviewInterval = setInterval(() => {
            showReview(currentReviewIndex + 1);
        }, 5000);
    }
}

function stopReviewTimer() {
    if (reviewInterval) {
        clearInterval(reviewInterval);
    }
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        showReview(currentReviewIndex + 1);
        startReviewTimer();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        showReview(currentReviewIndex - 1);
        startReviewTimer();
    });
}

if (reviewDots) {
    reviewDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            showReview(index);
            startReviewTimer();
        });
    });
}

if (reviewItems.length > 0) {
    showReview(0);
    startReviewTimer();
}

// ============================================================
// MAIN RESTAURANT MENU HORIZONTAL SCROLL & CATEGORY FILTER
// ============================================================
const mainRestaurantMenuScroll = document.getElementById('main-restaurant-menu-scroll');
const inPageMenuTabs = document.querySelectorAll('.main-menu-section .menu-category-tabs .menu-tab-btn, .menu-tab-btn');
const inPageFoodCards = document.querySelectorAll('#main-restaurant-menu-scroll .food-menu-card, .main-menu-section .food-menu-card');

if (mainRestaurantMenuScroll) {
    let isMouseDownMain = false;
    let startXMain = 0;
    let scrollLeftMain = 0;

    mainRestaurantMenuScroll.addEventListener('mousedown', (e) => {
        isMouseDownMain = true;
        startXMain = e.pageX - mainRestaurantMenuScroll.offsetLeft;
        scrollLeftMain = mainRestaurantMenuScroll.scrollLeft;
    });

    mainRestaurantMenuScroll.addEventListener('mouseleave', () => {
        isMouseDownMain = false;
    });

    mainRestaurantMenuScroll.addEventListener('mouseup', () => {
        isMouseDownMain = false;
    });

    mainRestaurantMenuScroll.addEventListener('mousemove', (e) => {
        if (!isMouseDownMain) return;
        e.preventDefault();
        const x = e.pageX - mainRestaurantMenuScroll.offsetLeft;
        const walk = (x - startXMain) * 1.5;
        mainRestaurantMenuScroll.scrollLeft = scrollLeftMain - walk;
    });
}

if (inPageMenuTabs.length > 0) {
    inPageMenuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabsContainer = tab.closest('.menu-category-tabs');
            if (tabsContainer) {
                const siblingTabs = tabsContainer.querySelectorAll('.menu-tab-btn');
                siblingTabs.forEach(t => t.classList.remove('active'));
            }
            tab.classList.add('active');

            const selectedCategory = tab.getAttribute('data-category');

            if (inPageFoodCards.length > 0) {
                inPageFoodCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            }

            // Smoothly center clicked tab inside single line tabs container to bring next options into view
            if (tabsContainer) {
                const targetScroll = tab.offsetLeft - (tabsContainer.clientWidth / 2) + (tab.offsetWidth / 2);
                tabsContainer.scrollTo({ left: targetScroll, behavior: 'smooth' });
            }

            // Smoothly reset track to beginning when category is clicked
            if (mainRestaurantMenuScroll) {
                mainRestaurantMenuScroll.scrollTo({ left: 0, behavior: 'smooth' });
            }
        });
    });
}

// ============================================================
// SLIDE-OUT MESSAGE PANEL LOGIC
// ============================================================
const closeMsgPanelBtn = document.getElementById('close-msg-panel-btn');
const msgPanel = document.getElementById('msg-panel');
const msgPanelOverlay = document.getElementById('msg-panel-overlay');
const msgPanelForm = document.getElementById('msg-panel-form');
const submitMsgBtn = document.getElementById('submit-msg-btn');
const msgStatusContainer = document.getElementById('msg-status-container');
const openMsgPanelDirectBtn = document.getElementById('open-msg-panel-direct-btn');

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwFRBfgECv4kyCOJCrjDmpbWn4oIkiCJOpGndOI_d3SCzTtWGuG14uJZ2xGtUIDEsL8/exec";

function openMessagePanel() {
    if (msgPanel && msgPanelOverlay) {
        msgPanel.classList.add('active');
        msgPanelOverlay.classList.add('active');
        document.body.classList.add('no-scroll');
    }
}

function closeMessagePanel() {
    if (msgPanel && msgPanelOverlay) {
        msgPanel.classList.remove('active');
        msgPanelOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
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

if (msgPanelForm) {
    msgPanelForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('msg-name').value.trim();
        const email = document.getElementById('msg-email').value.trim();
        const content = document.getElementById('msg-content').value.trim();
        
        if (!name || !email || !content) return;
        
        if (submitMsgBtn) {
            submitMsgBtn.disabled = true;
            submitMsgBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        }
        
        try {
            const formData = new URLSearchParams();
            formData.append('Name', name);
            formData.append('Email_or_Phone', email);
            formData.append('Message', content);
            
            await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            });
            
            if (msgStatusContainer) {
                msgStatusContainer.style.display = 'block';
                msgStatusContainer.className = 'msg-status-container status-success';
                msgStatusContainer.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully!';
            }
            msgPanelForm.reset();
            setTimeout(closeMessagePanel, 2000);
        } catch (error) {
            if (msgStatusContainer) {
                msgStatusContainer.style.display = 'block';
                msgStatusContainer.className = 'msg-status-container status-error';
                msgStatusContainer.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error sending message. Please try again.';
            }
        } finally {
            if (submitMsgBtn) {
                submitMsgBtn.disabled = false;
                submitMsgBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
            }
        }
    });
}

// ============================================================
// IN-PAGE FULL MENU POPUP MODAL LOGIC
// ============================================================
const fullMenuModal = document.getElementById('full-menu-modal');
const openFullMenuModalBtn = document.getElementById('open-full-menu-modal-btn');
const closeFullMenuModalBtn = document.getElementById('close-full-menu-modal-btn');
const closeFullMenuIconBtn = document.getElementById('close-full-menu-icon-btn');
const fullMenuModalOverlay = document.getElementById('full-menu-modal-overlay');
const modalMenuSearchInput = document.getElementById('modal-menu-search-input');
const modalCategoryTabs = document.querySelectorAll('#modal-menu-category-tabs .menu-tab-btn, .full-menu-modal .menu-tab-btn');
const modalFoodCards = document.querySelectorAll('#modal-full-menu-grid .food-menu-card, .full-menu-modal .food-menu-card');
const modalNoResultsMsg = document.getElementById('modal-no-results-msg');
const modalTimingBtn = document.getElementById('modal-timing-btn');
const modalOrderTimingsSection = document.getElementById('modal-order-timings');

let modalActiveCategory = 'all';

function filterModalMenu() {
    if (!modalFoodCards || modalFoodCards.length === 0) return;
    const query = modalMenuSearchInput ? modalMenuSearchInput.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    modalFoodCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const keywords = (card.getAttribute('data-keywords') || '') + ' ' + card.innerText.toLowerCase();

        // When searching, show matching items regardless of whichever category filter is currently active
        const matchesCategory = (query !== '' || modalActiveCategory === 'all' || cardCategory === modalActiveCategory);
        const matchesSearch = query === '' || keywords.includes(query);

        if (matchesCategory && matchesSearch) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });

    if (modalNoResultsMsg) {
        modalNoResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

function openFullMenuModal() {
    if (fullMenuModal) {
        fullMenuModal.classList.add('active');
        fullMenuModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');

        modalActiveCategory = 'all';
        if (modalCategoryTabs) {
            modalCategoryTabs.forEach(t => {
                if (t.getAttribute('data-category') === 'all') {
                    t.classList.add('active');
                } else {
                    t.classList.remove('active');
                }
            });
        }
        if (modalMenuSearchInput) {
            modalMenuSearchInput.value = '';
        }
        filterModalMenu();
    }
}

function closeFullMenuModal() {
    if (fullMenuModal) {
        fullMenuModal.classList.remove('active');
        fullMenuModal.setAttribute('aria-hidden', 'true');
        
        const msgActive = msgPanel && msgPanel.classList.contains('active');
        if (!msgActive) {
            document.body.classList.remove('no-scroll');
        }
    }
}

if (openFullMenuModalBtn) {
    openFullMenuModalBtn.addEventListener('click', openFullMenuModal);
}

if (closeFullMenuModalBtn) {
    closeFullMenuModalBtn.addEventListener('click', closeFullMenuModal);
}

if (closeFullMenuIconBtn) {
    closeFullMenuIconBtn.addEventListener('click', closeFullMenuModal);
}

if (fullMenuModalOverlay) {
    fullMenuModalOverlay.addEventListener('click', closeFullMenuModal);
}

if (modalCategoryTabs.length > 0) {
    modalCategoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            modalCategoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            modalActiveCategory = tab.getAttribute('data-category');
            
            // Clear search input on tab selection so category items are clearly displayed
            if (modalMenuSearchInput && modalMenuSearchInput.value.trim() !== '') {
                modalMenuSearchInput.value = '';
            }
            
            const modalTabsContainer = tab.closest('.menu-category-tabs');
            if (modalTabsContainer) {
                const targetScroll = tab.offsetLeft - (modalTabsContainer.clientWidth / 2) + (tab.offsetWidth / 2);
                modalTabsContainer.scrollTo({ left: targetScroll, behavior: 'smooth' });
            }
            filterModalMenu();
        });
    });
}

if (modalMenuSearchInput) {
    modalMenuSearchInput.addEventListener('input', () => {
        const query = modalMenuSearchInput.value.toLowerCase().trim();
        // If searching with a query while on a specific filter tab, switch tab to 'all' so UI reflects all matching items
        if (query !== '' && modalActiveCategory !== 'all') {
            modalActiveCategory = 'all';
            if (modalCategoryTabs) {
                modalCategoryTabs.forEach(t => {
                    if (t.getAttribute('data-category') === 'all') {
                        t.classList.add('active');
                        const modalTabsContainer = t.closest('.menu-category-tabs');
                        if (modalTabsContainer) {
                            modalTabsContainer.scrollTo({ left: 0, behavior: 'smooth' });
                        }
                    } else {
                        t.classList.remove('active');
                    }
                });
            }
        }
        filterModalMenu();
    });
}

// Two-Way Scroll for Modal Timings Button (Down to Timings / Up to Top)
const modalBody = document.querySelector('.full-menu-modal-body');
const modalTimingIcon = modalTimingBtn ? modalTimingBtn.querySelector('i') : null;
const modalTimingText = modalTimingBtn ? modalTimingBtn.querySelector('span') : null;

function isNearModalTimings() {
    if (!modalOrderTimingsSection || !modalBody) return false;
    const modalBodyRect = modalBody.getBoundingClientRect();
    const timingsRect = modalOrderTimingsSection.getBoundingClientRect();
    const isScrolledToBottom = (modalBody.scrollTop + modalBody.clientHeight >= modalBody.scrollHeight - 150);
    return (timingsRect.top <= modalBodyRect.bottom - 120) || isScrolledToBottom;
}

if (modalTimingBtn && modalOrderTimingsSection && modalBody) {
    modalTimingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isNearModalTimings()) {
            modalBody.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            modalOrderTimingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    modalBody.addEventListener('scroll', () => {
        if (isNearModalTimings()) {
            modalTimingBtn.classList.add('at-bottom');
            if (modalTimingIcon) modalTimingIcon.className = 'fas fa-arrow-up';
            if (modalTimingText) modalTimingText.innerText = 'Top';
            modalTimingBtn.title = 'Scroll back to Top (উপরে ফিরে যান)';
        } else {
            modalTimingBtn.classList.remove('at-bottom');
            if (modalTimingIcon) modalTimingIcon.className = 'fas fa-clock';
            if (modalTimingText) modalTimingText.innerText = 'Timings';
            modalTimingBtn.title = 'Order Timings (অর্ডার সময়সূচী)';
        }
    }, { passive: true });
}

// Close full menu modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fullMenuModal && fullMenuModal.classList.contains('active')) {
        closeFullMenuModal();
    }
});
