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
                    return;
                }
                mainRestaurantMenuScroll.scrollLeft -= currentVelocity;
                currentVelocity *= friction;
                momentumRAF = requestAnimationFrame(step);
            };
            stopMomentum();
            momentumRAF = requestAnimationFrame(step);
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
    // Hide/dismiss mobile keypad when Enter / Search key is pressed
    modalMenuSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            modalMenuSearchInput.blur();
        }
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
