/**
 * Index page: skills carousel
 */

let currentSlide = 0;
let autoSlideTimer;

function switchSkillTab(index) {
    currentSlide = index;
    updateCarousel();
    resetAutoSlide();
}

function nextSkillSlide() {
    const slides = document.querySelectorAll('.skill-slide');
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
    resetAutoSlide();
}

function prevSkillSlide() {
    const slides = document.querySelectorAll('.skill-slide');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
    resetAutoSlide();
}

function updateCarousel() {
    const slides = document.querySelectorAll('.skill-slide');
    const tabBtns = document.querySelectorAll('.tab-btn');

    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentSlide);
    });
    tabBtns.forEach((btn, idx) => {
        btn.classList.toggle('active', idx === currentSlide);
    });
}

function startAutoSlide() {
    const slides = document.querySelectorAll('.skill-slide');
    if (slides.length === 0) return;

    autoSlideTimer = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }, 5000);
}

function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
}

/**
 * Projects carousel: paged scrolling that always shows full cards,
 * wrapping back to the first card once the last one has been reached.
 */

const PROJECT_SLIDE_MS = 450;

function initProjectCarousel() {
    const carousel = document.getElementById('project-carousel');
    const track = document.getElementById('project-track');
    const dotsWrapper = document.getElementById('project-dots');
    if (!carousel || !track || !dotsWrapper) return;

    const total = track.children.length;
    if (total === 0) return;

    let index = 0;
    let locked = false;

    function stepSize() {
        const cards = track.children;
        if (cards.length < 2) return cards[0].getBoundingClientRect().width;
        return cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
    }

    function maxIndex() {
        const step = stepSize();
        if (step <= 0) return 0;
        const visible = Math.max(1, Math.round(track.getBoundingClientRect().width / step));
        return Math.max(0, total - visible);
    }

    function render(animate) {
        track.style.transition = animate ? `transform ${PROJECT_SLIDE_MS}ms ease` : 'none';
        track.style.transform = `translateX(${-index * stepSize()}px)`;
        syncDots();
    }

    function syncDots() {
        Array.from(dotsWrapper.children).forEach((dot, idx) => {
            const isActive = idx === index;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-selected', String(isActive));
        });
    }

    function slideTo(target) {
        locked = true;
        index = target;
        render(true);
        window.setTimeout(() => { locked = false; }, PROJECT_SLIDE_MS);
    }

    function go(direction) {
        if (locked) return;
        const last = maxIndex();
        if (direction > 0) {
            slideTo(index >= last ? 0 : index + 1);
        } else {
            slideTo(index <= 0 ? last : index - 1);
        }
    }

    function goTo(target) {
        if (locked || target === index) return;
        slideTo(Math.min(target, maxIndex()));
    }

    function buildDots() {
        const count = maxIndex() + 1;
        if (dotsWrapper.children.length !== count) {
            dotsWrapper.innerHTML = '';
            for (let i = 0; i < count; i++) {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'project-dot';
                dot.setAttribute('role', 'tab');
                dot.setAttribute('aria-label', `第 ${i + 1} 組作品`);
                dot.addEventListener('click', () => goTo(i));
                dotsWrapper.appendChild(dot);
            }
        }
        dotsWrapper.style.display = count > 1 ? 'flex' : 'none';
    }

    buildDots();

    carousel.addEventListener('wheel', event => {
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        if (Math.abs(delta) < 4) return;
        event.preventDefault();
        go(delta > 0 ? 1 : -1);
    }, { passive: false });

    carousel.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight') { event.preventDefault(); go(1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1); }
    });

    let touchStartX = 0;
    carousel.addEventListener('touchstart', event => {
        touchStartX = event.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', event => {
        const distance = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(distance) > 40) go(distance < 0 ? 1 : -1);
    });

    window.addEventListener('resize', () => {
        buildDots();
        index = Math.min(index, maxIndex());
        render(false);
    });

    render(false);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('skills-carousel')) {
        startAutoSlide();
    }
    initProjectCarousel();
});
