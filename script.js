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

// Navbar Scroll Effect (Optimized with Passive Listener & State Cache)
const navbar = document.querySelector('.navbar');
if (navbar) {
    let isScrolled = false;
    const updateNavbar = () => {
        const scrolled = window.scrollY > 50;
        if (scrolled !== isScrolled) {
            isScrolled = scrolled;
            navbar.classList.toggle('navbar-scrolled', isScrolled);
        }
    };
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
}

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

// Close menu when user scrolls the page (Passive)
window.addEventListener('scroll', () => {
    if (navLinks && navLinks.classList.contains('nav-active')) {
        navLinks.classList.remove('nav-active');
    }
}, { passive: true });

// Reveal Elements on Scroll (High-Performance IntersectionObserver without layout thrashing)
const revealElements = document.querySelectorAll('.reviews-slider-container, .vibe-text, .contact-container, .main-menu-section');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        revealObserver.observe(el);
    });
} else {
    revealElements.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
}

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
// MAIN RESTAURANT MENU HORIZONTAL SCROLL & THREE-DOT CATEGORY FILTER
// ============================================================
const mainRestaurantMenuScroll = document.getElementById('main-restaurant-menu-scroll');
const mainMenuFilterWrapper = document.getElementById('main-menu-filter-dropdown-wrapper');
const mainMenuFilterBtn = document.getElementById('main-menu-filter-dots-btn');
const mainMenuFilterDropdown = document.getElementById('main-menu-filter-dropdown-menu');
const mainCurrentFilterLabel = document.getElementById('main-current-filter-label');
const inPageMenuTabs = document.querySelectorAll('#main-menu-filter-dropdown-menu .menu-tab-btn, .main-menu-section .menu-tab-btn');
const inPageFoodCards = document.querySelectorAll('#main-restaurant-menu-scroll .food-menu-card, .main-menu-section .food-menu-card');

// Toggle Dropdown when clicking three-dot button
if (mainMenuFilterBtn && mainMenuFilterWrapper) {
    mainMenuFilterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mainMenuFilterWrapper.classList.toggle('open');
        mainMenuFilterBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close Dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!mainMenuFilterWrapper.contains(e.target)) {
            mainMenuFilterWrapper.classList.remove('open');
            mainMenuFilterBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainMenuFilterWrapper.classList.contains('open')) {
            mainMenuFilterWrapper.classList.remove('open');
            mainMenuFilterBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

if (mainRestaurantMenuScroll) {
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let momentumRAF = null;
    let hasMoved = false;
    let scrollPauseTimer = null;

    // Pause float animations during scroll for zero lag
    function onMenuScrolling() {
        mainRestaurantMenuScroll.classList.add('is-scrolling');
        clearTimeout(scrollPauseTimer);
        scrollPauseTimer = setTimeout(() => {
            mainRestaurantMenuScroll.classList.remove('is-scrolling');
        }, 150);
    }
    mainRestaurantMenuScroll.addEventListener('scroll', onMenuScrolling, { passive: true });

    const stopMomentum = () => {
        if (momentumRAF) {
            cancelAnimationFrame(momentumRAF);
            momentumRAF = null;
        }
    };

    mainRestaurantMenuScroll.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        stopMomentum();
        isDown = true;
        hasMoved = false;
        startX = e.pageX - mainRestaurantMenuScroll.offsetLeft;
        scrollStart = mainRestaurantMenuScroll.scrollLeft;
        lastX = e.pageX;
        lastTime = performance.now();
        velocity = 0;
        mainRestaurantMenuScroll.style.cursor = 'grabbing';
        mainRestaurantMenuScroll.style.userSelect = 'none';
        mainRestaurantMenuScroll.classList.add('is-scrolling');
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const currentX = e.pageX;
        const now = performance.now();
        const deltaX = currentX - lastX;
        const dt = now - lastTime;
        
        if (Math.abs(currentX - (startX + mainRestaurantMenuScroll.offsetLeft)) > 5) {
            hasMoved = true;
        }

        if (dt > 0) {
            velocity = deltaX / dt;
        }
        lastX = currentX;
        lastTime = now;

        const x = e.pageX - mainRestaurantMenuScroll.offsetLeft;
        const walk = x - startX;
        mainRestaurantMenuScroll.scrollLeft = scrollStart - walk;
    }, { passive: true });

    const endDrag = () => {
        if (!isDown) return;
        isDown = false;
        mainRestaurantMenuScroll.style.cursor = 'grab';
        mainRestaurantMenuScroll.style.removeProperty('user-select');

        // Apply smooth momentum glide
        if (Math.abs(velocity) > 0.1) {
            let currentVelocity = velocity * 16;
            const friction = 0.94;

            const step = () => {
                if (Math.abs(currentVelocity) < 0.2 || isDown) {
                    stopMomentum();
                    mainRestaurantMenuScroll.classList.remove('is-scrolling');
                    return;
                }
                mainRestaurantMenuScroll.scrollLeft -= currentVelocity;
                currentVelocity *= friction;
                momentumRAF = requestAnimationFrame(step);
            };
            stopMomentum();
            momentumRAF = requestAnimationFrame(step);
        } else {
            mainRestaurantMenuScroll.classList.remove('is-scrolling');
        }
    };

    window.addEventListener('mouseup', endDrag);

    // Prevent accidental clicking of links/buttons if user was dragging
    mainRestaurantMenuScroll.addEventListener('click', (e) => {
        if (hasMoved) {
            e.preventDefault();
            e.stopPropagation();
            hasMoved = false;
        }
    }, true);

    // Smooth horizontal mouse-wheel scrolling
    mainRestaurantMenuScroll.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0 && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            stopMomentum();
            mainRestaurantMenuScroll.scrollLeft += e.deltaY * 0.9;
        }
    }, { passive: false });

    mainRestaurantMenuScroll.addEventListener('touchstart', () => {
        stopMomentum();
    }, { passive: true });
}

if (inPageMenuTabs.length > 0) {
    inPageMenuTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.stopPropagation();
            const siblingTabs = document.querySelectorAll('#main-menu-filter-dropdown-menu .menu-tab-btn, .main-menu-section .menu-tab-btn');
            siblingTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const selectedCategory = tab.getAttribute('data-category');

            // Update main button label
            if (mainCurrentFilterLabel) {
                const icon = tab.querySelector('.tab-icon, i:not(.active-indicator-icon)');
                const titleSpan = tab.querySelector('.tab-title');
                const title = titleSpan ? titleSpan.textContent : tab.textContent.trim();
                const iconClass = icon ? icon.className : 'fas fa-utensils';
                mainCurrentFilterLabel.innerHTML = `<i class="${iconClass}"></i> <span>${title}</span>`;
            }

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

            // Smoothly reset track to beginning when category is clicked
            if (mainRestaurantMenuScroll) {
                mainRestaurantMenuScroll.scrollTo({ left: 0, behavior: 'smooth' });
            }

            // Close dropdown menu after selection
            if (mainMenuFilterWrapper) {
                mainMenuFilterWrapper.classList.remove('open');
                if (mainMenuFilterBtn) {
                    mainMenuFilterBtn.setAttribute('aria-expanded', 'false');
                }
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
// IN-PAGE FULL MENU POPUP MODAL LOGIC (With Three-Dot Filter Dropdown)
// ============================================================
const fullMenuModal = document.getElementById('full-menu-modal');
const openFullMenuModalBtn = document.getElementById('open-full-menu-modal-btn');
const closeFullMenuModalBtn = document.getElementById('close-full-menu-modal-btn');
const closeFullMenuIconBtn = document.getElementById('close-full-menu-icon-btn');
const fullMenuModalOverlay = document.getElementById('full-menu-modal-overlay');
const modalMenuSearchInput = document.getElementById('modal-menu-search-input');
const modalMenuSearchClearBtn = document.getElementById('modal-menu-search-clear');
const modalMenuFilterWrapper = document.getElementById('modal-menu-filter-dropdown-wrapper');
const modalMenuFilterBtn = document.getElementById('modal-menu-filter-dots-btn');
const modalCurrentFilterLabel = document.getElementById('modal-current-filter-label');
const modalCategoryTabs = document.querySelectorAll('#modal-menu-filter-dropdown-menu .menu-tab-btn, #modal-menu-category-tabs .menu-tab-btn, .full-menu-modal .menu-tab-btn');
const modalFoodCards = document.querySelectorAll('#modal-full-menu-grid .food-menu-card, .full-menu-modal .food-menu-card');
const modalNoResultsMsg = document.getElementById('modal-no-results-msg');
const modalTimingBtn = document.getElementById('modal-timing-btn');
const modalOrderTimingsSection = document.getElementById('modal-order-timings');

let modalActiveCategory = 'all';

// Modal 3-Dot Filter Dropdown Toggle
if (modalMenuFilterBtn && modalMenuFilterWrapper) {
    modalMenuFilterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = modalMenuFilterWrapper.classList.toggle('open');
        modalMenuFilterBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
        if (!modalMenuFilterWrapper.contains(e.target)) {
            modalMenuFilterWrapper.classList.remove('open');
            modalMenuFilterBtn.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalMenuFilterWrapper.classList.contains('open')) {
            modalMenuFilterWrapper.classList.remove('open');
            modalMenuFilterBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

function updateModalSearchClearBtn() {
    if (!modalMenuSearchClearBtn || !modalMenuSearchInput) return;
    if (modalMenuSearchInput.value.length > 0) {
        modalMenuSearchClearBtn.classList.add('visible');
    } else {
        modalMenuSearchClearBtn.classList.remove('visible');
    }
}

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
        if (modalCurrentFilterLabel) {
            modalCurrentFilterLabel.innerHTML = `<i class="fas fa-utensils"></i> <span>All Items</span>`;
        }
        if (modalMenuFilterWrapper) {
            modalMenuFilterWrapper.classList.remove('open');
            if (modalMenuFilterBtn) {
                modalMenuFilterBtn.setAttribute('aria-expanded', 'false');
            }
        }
        if (modalMenuSearchInput) {
            modalMenuSearchInput.value = '';
        }
        updateModalSearchClearBtn();
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
        tab.addEventListener('click', (e) => {
            e.stopPropagation();
            modalCategoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            modalActiveCategory = tab.getAttribute('data-category');

            // Update modal button label
            if (modalCurrentFilterLabel) {
                const icon = tab.querySelector('.tab-icon, i:not(.active-indicator-icon)');
                const titleSpan = tab.querySelector('.tab-title');
                const title = titleSpan ? titleSpan.textContent : tab.textContent.trim();
                const iconClass = icon ? icon.className : 'fas fa-utensils';
                modalCurrentFilterLabel.innerHTML = `<i class="${iconClass}"></i> <span>${title}</span>`;
            }

            // Close modal dropdown after selection
            if (modalMenuFilterWrapper) {
                modalMenuFilterWrapper.classList.remove('open');
                if (modalMenuFilterBtn) {
                    modalMenuFilterBtn.setAttribute('aria-expanded', 'false');
                }
            }
            
            // Clear search input on tab selection so category items are clearly displayed
            if (modalMenuSearchInput && modalMenuSearchInput.value.trim() !== '') {
                modalMenuSearchInput.value = '';
                updateModalSearchClearBtn();
            }
            
            filterModalMenu();
        });
    });
}

if (modalMenuSearchInput) {
    modalMenuSearchInput.addEventListener('input', () => {
        updateModalSearchClearBtn();
        const query = modalMenuSearchInput.value.toLowerCase().trim();
        // If searching with a query while on a specific filter tab, switch tab to 'all' so UI reflects all matching items
        if (query !== '' && modalActiveCategory !== 'all') {
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
            if (modalCurrentFilterLabel) {
                modalCurrentFilterLabel.innerHTML = `<i class="fas fa-utensils"></i> <span>All Items</span>`;
            }
        }
        filterModalMenu();
    });
}

if (modalMenuSearchClearBtn && modalMenuSearchInput) {
    modalMenuSearchClearBtn.addEventListener('click', () => {
        modalMenuSearchInput.value = '';
        updateModalSearchClearBtn();
        filterModalMenu();
        modalMenuSearchInput.focus();
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

// ============================================================
// DIWALI FESTIVAL CELEBRATION SUITE (দীপাবলি ও কালীপূজা ২০২৬)
// Ultra-Lightweight & Optimized for Low-End Budget Phones (1GB-3GB RAM)
// ============================================================
(function() {
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 768;
    const isLowPowerDevice = isTouchDevice || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

    // --- 1. WEB AUDIO API SYNTHESIZER ---
    let audioCtx = null;
    let soundEnabled = false;

    function initAudio() {
        if (!soundEnabled) return;
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playFireworkBoom() {
        if (!soundEnabled || !audioCtx) return;
        try {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.35);
        } catch (e) {}
    }

    function playDiwaliChime() {
        if (!soundEnabled || !audioCtx) return;
        try {
            const now = audioCtx.currentTime;
            [880, 1108, 1318].forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.06);
                gain.gain.setValueAtTime(0.06, now + idx * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.5);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now + idx * 0.06);
                osc.stop(now + idx * 0.06 + 0.55);
            });
        } catch (e) {}
    }

    // --- 2. ULTRA-LIGHTWEIGHT FIREWORKS ENGINE ---
    const canvas = document.getElementById('diwali-fireworks-canvas');
    let ctx = canvas ? canvas.getContext('2d') : null;
    let fireworks = [];
    let particles = [];
    const colors = ['#FFD700', '#FF9100', '#FF1744', '#00E5FF', '#76FF03', '#E040FB'];

    let isHeroInView = true;
    let animationRunning = false;

    const heroEl = document.getElementById('home');
    if ('IntersectionObserver' in window && heroEl) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isHeroInView = entry.isIntersecting;
                if (!isHeroInView) {
                    stopAnimation();
                } else {
                    startAnimation();
                }
            });
        }, { threshold: 0.05 });
        observer.observe(heroEl);
    }

    function resizeCanvas() {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.floor(rect.width);
        canvas.height = Math.floor(rect.height);
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    setTimeout(resizeCanvas, 250);

    class FireworkRocket {
        constructor(startX, startY, targetX, targetY) {
            this.x = startX;
            this.y = startY;
            this.startX = startX;
            this.startY = startY;
            this.targetX = targetX;
            this.targetY = targetY;
            this.distanceToTarget = Math.hypot(targetX - startX, targetY - startY);
            this.angle = Math.atan2(targetY - startY, targetX - startX);
            this.speed = isLowPowerDevice ? 5 : 4.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update(index) {
            const vx = Math.cos(this.angle) * this.speed;
            const vy = Math.sin(this.angle) * this.speed;
            this.x += vx;
            this.y += vy;
            this.speed *= 1.03;

            if (this.y <= this.targetY || Math.hypot(this.x - this.startX, this.y - this.startY) >= this.distanceToTarget) {
                createExplosion(this.targetX, this.targetY, this.color);
                playFireworkBoom();
                fireworks.splice(index, 1);
            }
        }

        draw() {
            if (!ctx) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    class FireworkParticle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * (isLowPowerDevice ? 3.5 : 5) + 1.2;
            this.friction = 0.94;
            this.gravity = 0.65;
            this.color = color;
            this.alpha = 1;
            this.decay = Math.random() * 0.03 + (isLowPowerDevice ? 0.03 : 0.018);
        }

        update(index) {
            this.speed *= this.friction;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
            this.alpha -= this.decay;
            if (this.alpha <= 0.05) {
                particles.splice(index, 1);
            }
        }

        draw() {
            if (!ctx) return;
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillRect(this.x, this.y, 2.5, 2.5);
            ctx.globalAlpha = 1;
        }
    }

    function createExplosion(x, y, color) {
        const particleCount = isLowPowerDevice ? 14 : 36;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new FireworkParticle(x, y, color));
        }
    }

    function launchRocketTo(targetX, targetY) {
        if (!canvas) return;
        const startX = Math.random() * canvas.width;
        const startY = canvas.height;
        fireworks.push(new FireworkRocket(startX, startY, targetX, targetY));
        if (!animationRunning) startAnimation();
    }

    if (canvas) {
        canvas.addEventListener('click', (e) => {
            initAudio();
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            launchRocketTo(x, y);
        });
    }

    function animateFireworks() {
        if (!animationRunning || !ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].draw();
            fireworks[i].update(i);
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].draw();
            particles[i].update(i);
        }

        if (fireworks.length === 0 && particles.length === 0 && !isHeroInView) {
            stopAnimation();
            return;
        }

        requestAnimationFrame(animateFireworks);
    }

    function startAnimation() {
        if (animationRunning) return;
        animationRunning = true;
        requestAnimationFrame(animateFireworks);
    }

    function stopAnimation() {
        animationRunning = false;
        particles = [];
        fireworks = [];
        if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    startAnimation();

    const ambientDelay = isLowPowerDevice ? 7000 : 4000;
    setInterval(() => {
        if (canvas && isHeroInView && document.visibilityState === 'visible') {
            const tx = Math.random() * (canvas.width * 0.8) + (canvas.width * 0.1);
            const ty = Math.random() * (canvas.height * 0.45) + (canvas.height * 0.1);
            launchRocketTo(tx, ty);
        }
    }, ambientDelay);

    // --- 3. SPARKLER TRAIL (DESKTOP ONLY) ---
    let sparklerEnabled = !isTouchDevice;
    let lastSparklerTime = 0;

    function createSparkler(x, y) {
        if (!sparklerEnabled || isTouchDevice) return;
        const now = Date.now();
        if (now - lastSparklerTime < 35) return;
        lastSparklerTime = now;

        const count = 2;
        for (let i = 0; i < count; i++) {
            const spark = document.createElement('div');
            spark.className = 'diwali-sparkler-dot';
            const size = Math.random() * 4 + 3;
            spark.style.width = size + 'px';
            spark.style.height = size + 'px';
            spark.style.left = x + 'px';
            spark.style.top = y + 'px';
            const col = colors[Math.floor(Math.random() * colors.length)];
            spark.style.background = col;

            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 25 + 8;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist + 10;
            spark.style.setProperty('--tx', `${tx}px`);
            spark.style.setProperty('--ty', `${ty}px`);

            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 550);
        }
    }

    if (!isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            createSparkler(e.clientX, e.clientY);
        }, { passive: true });
    }

        // --- 4. INTERACTIVE DIYA GARLAND AT BOTTOM ---
    function initDiyas() {
        const diyaItems = document.querySelectorAll('.interactive-diya-item');
        diyaItems.forEach(diyaItem => {
            diyaItem.addEventListener('click', () => {
                initAudio();
                const isUnlit = diyaItem.classList.toggle('unlit');
                if (!isUnlit) {
                    playDiwaliChime();
                }
            });
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDiyas);
    } else {
        initDiyas();
    }

    console.log("🪔 Diwali Theme Active & Smooth!");
})();
