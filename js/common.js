/**
 * Common utilities shared across portfolio pages
 */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const targetId = href.substring(1);
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function initLangToggle() {
    const langBtn = document.getElementById('lang-toggle-btn');
    const langText = document.getElementById('lang-text');
    if (!langBtn || !langText) return;

    let currentLang = 'zh';

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        langText.textContent = currentLang === 'zh' ? '中文' : 'English';

        document.querySelectorAll('[data-lang-zh]').forEach(el => {
            const text = el.getAttribute(`data-lang-${currentLang}`);
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else {
                    el.innerHTML = text;
                }
            }
        });

        document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: currentLang } }));
    });
}

function toggleExpand(id, btn) {
    const content = document.getElementById(id);
    if (!content) return;

    if (content.style.display === 'block') {
        content.style.display = 'none';
        btn.innerText = btn.innerText.replace('－ 收折', '＋ 展開查看');
    } else {
        content.style.display = 'block';
        btn.innerText = btn.innerText.replace('＋ 展開查看', '－ 收折');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initLangToggle();
});
