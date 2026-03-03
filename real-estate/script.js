/* ============================================
   BALI LUXE ESTATES — GSAP Animations
   ============================================ */

// ============================================
// REDUCED MOTION CHECK
// ============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ============================================
// CUSTOM TEXT SPLITTER (replaces SplitText plugin)
// ============================================
class TextSplitter {
    constructor(element) {
        this.element = element;
        this.chars = [];
        this.words = [];
        this.originalHTML = element.innerHTML;
        this.split();
    }

    split() {
        const text = this.element.textContent;
        this.element.innerHTML = '';
        const words = text.split(/\s+/).filter(w => w.length > 0);

        words.forEach((word, wi) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';

            word.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.className = 'char';
                charSpan.textContent = char;
                charSpan.style.display = 'inline-block';
                charSpan.style.opacity = '0';
                charSpan.style.transform = 'translateY(100%)';
                wordSpan.appendChild(charSpan);
                this.chars.push(charSpan);
            });

            this.element.appendChild(wordSpan);
            this.words.push(wordSpan);

            if (wi < words.length - 1) {
                const space = document.createElement('span');
                space.innerHTML = '&nbsp;';
                space.style.display = 'inline-block';
                this.element.appendChild(space);
            }
        });
    }

    revert() {
        this.element.innerHTML = this.originalHTML;
    }
}

// ============================================
// UTILITY: Wait for DOM
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Reduced motion: skip all GSAP animations, show everything immediately
    if (prefersReducedMotion) {
        document.body.classList.remove('loading');
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.style.display = 'none';

        // Make all hidden elements visible
        document.querySelectorAll('.hero-subtitle, .hero-desc, .hero-buttons').forEach(el => {
            el.style.opacity = '1';
        });
        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });

        // Still need functional pieces (no animation)
        initMobileMenu();
        initFormValidation();
        initScrollDepthTracking();
        initCTATracking();
        return;
    }

    // Add loading class
    document.body.classList.add('loading');

    // Initialize everything
    initPreloader();
    initCustomCursor();
    initNavbar();
    initMobileMenu();
    initHeroAnimations();
    initAboutAnimations();
    initPropertyShowcase();
    initStatsCounter();
    initLocationsAnimations();
    initLifestyleAnimations();
    initTestimonialsAnimations();
    initContactAnimations();
    initFooterAnimations();
    initSmoothScroll();
    initFormValidation();
    initScrollDepthTracking();
    initCTATracking();

    // Recalculate all ScrollTrigger positions after pins are set up
    ScrollTrigger.refresh();
});

// ============================================
// PRELOADER
// ============================================
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const preloaderLine = document.querySelector('.preloader-line');
    const preloaderText = document.querySelector('.preloader-text');
    const preloaderSub = document.querySelector('.preloader-sub');

    const tl = gsap.timeline({
        onComplete: () => {
            document.body.classList.remove('loading');
        }
    });

    tl.from(preloaderLine, {
        scaleX: 0,
        duration: 1,
        ease: 'power2.inOut'
    })
    .from(preloaderText, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.3')
    .from(preloaderSub, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.3')
    .to(preloaderSub, {
        opacity: 0,
        duration: 0.3,
        delay: 0.5
    })
    .to(preloaderText, {
        opacity: 0,
        y: -20,
        duration: 0.3
    }, '-=0.1')
    .to(preloaderLine, {
        scaleX: 0,
        duration: 0.3
    }, '-=0.2')
    .to(preloader, {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut'
    }, '-=0.1');
}

// ============================================
// CUSTOM CURSOR
// ============================================
function initCustomCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    if (!dot || !outline) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.set(dot, { x: mouseX, y: mouseY });
    });

    // Smooth follow for outline
    gsap.ticker.add(() => {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        gsap.set(outline, { x: outlineX, y: outlineY });
    });

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .location-card, .lifestyle-item, .testimonial-card');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => outline.classList.add('hover'));
        el.addEventListener('mouseleave', () => outline.classList.remove('hover'));
    });
}

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');

    ScrollTrigger.create({
        start: 'top -80',
        onUpdate: (self) => {
            if (self.direction === 1 && self.scroll() > 80) {
                navbar.classList.add('scrolled');
            } else if (self.scroll() < 80) {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Navbar entrance animation
    gsap.from(navbar, {
        y: -100,
        opacity: 0,
        duration: 1,
        delay: 3.5,
        ease: 'power2.out'
    });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const hamburger = document.querySelector('.nav-hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-links a');

    if (!hamburger) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ============================================
// HERO ANIMATIONS
// ============================================
function initHeroAnimations() {
    // Disable video on mobile — use fallback image instead
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo && window.innerWidth <= 768) {
        heroVideo.pause();
        heroVideo.removeAttribute('autoplay');
        heroVideo.style.display = 'none';
    }

    const heroTl = gsap.timeline({ delay: 3.2 });

    // Animate hero title lines
    const heroLines = document.querySelectorAll('.hero-line');
    heroLines.forEach(line => {
        const text = line.textContent;
        line.innerHTML = '';
        const wrapper = document.createElement('span');
        wrapper.textContent = text;
        wrapper.style.display = 'inline-block';
        line.appendChild(wrapper);

        heroTl.from(wrapper, {
            yPercent: 110,
            duration: 1.2,
            ease: 'power4.out'
        }, heroTl.duration() > 0 ? '-=0.9' : 0);
    });

    // Subtitle
    heroTl.to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.6');

    // Description
    heroTl.to('.hero-desc', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.4');

    // Buttons
    heroTl.to('.hero-buttons', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.4');

    // Scroll indicator
    heroTl.from('.hero-scroll-indicator', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.2');

    // Parallax effect on hero background
    gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
}

// ============================================
// ABOUT SECTION ANIMATIONS
// ============================================
function initAboutAnimations() {
    // ---- Word-by-Word Rise for heading ----
    const aboutTitle = document.querySelector('.about-text .section-title');
    if (aboutTitle) {
        const html = aboutTitle.innerHTML;
        const lines = html.split(/<br\s*\/?>/i);

        aboutTitle.innerHTML = '';

        lines.forEach((line, li) => {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'title-line';

            const words = line.trim().split(/\s+/);
            words.forEach((word, wi) => {
                const clipWrapper = document.createElement('span');
                clipWrapper.className = 'word-clip';

                const wordSpan = document.createElement('span');
                wordSpan.className = 'word-rise';
                wordSpan.textContent = word;

                clipWrapper.appendChild(wordSpan);
                lineDiv.appendChild(clipWrapper);

                if (wi < words.length - 1) {
                    const space = document.createTextNode(' ');
                    lineDiv.appendChild(space);
                }
            });

            aboutTitle.appendChild(lineDiv);
        });
    }

    // ---- Main Timeline ----
    const aboutTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#about',
            start: 'top 70%',
            toggleActions: 'play none none none'
        }
    });

    aboutTl.from('.about-text .section-label', {
        x: -30,
        opacity: 0,
        duration: 0.6
    });

    aboutTl.from('.word-rise', {
        yPercent: 110,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08
    }, '-=0.2');

    aboutTl.from('.about-divider', {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 0.6
    }, '-=0.3');

    // ---- Gold Wipe Line-by-Line Reveal for descriptions ----
    const descriptions = document.querySelectorAll('.about-description');
    const allLines = [];

    descriptions.forEach(desc => {
        const text = desc.textContent.trim();
        // Split by sentences (period followed by a space)
        const sentences = text.split(/(?<=\.)\s+/);
        desc.innerHTML = '';

        sentences.forEach(sentence => {
            const lineSpan = document.createElement('span');
            lineSpan.className = 'desc-line';
            lineSpan.textContent = sentence;
            desc.appendChild(lineSpan);
            allLines.push(lineSpan);
        });

        desc.style.opacity = '1';
    });

    // Set initial state for all lines
    gsap.set(allLines, {
        opacity: 0.15,
        backgroundImage: 'linear-gradient(90deg, var(--gold) 50%, transparent 50%)',
        backgroundSize: '200% 2px',
        backgroundPosition: '100% 100%',
        backgroundRepeat: 'no-repeat'
    });

    // Animate each line with slow stagger
    allLines.forEach((line, i) => {
        const lineTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#about',
                start: 'top 65%',
                toggleActions: 'play none none none'
            },
            delay: 1.2 + (i * 0.7)
        });

        // Gold underline wipes across
        lineTl.to(line, {
            backgroundPosition: '0% 100%',
            duration: 2,
            ease: 'power2.inOut'
        });

        // Text fades up to full opacity while underline wipes
        lineTl.to(line, {
            opacity: 1,
            duration: 1.8,
            ease: 'power1.out'
        }, '-=1.8');

        // Underline fades away after wipe completes
        lineTl.to(line, {
            backgroundSize: '200% 0px',
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    aboutTl.from('.about-feature', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1
    }, '+=1.2');

    // Image reveals
    gsap.from('.about-img-main', {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.2,
        ease: 'power4.inOut',
        scrollTrigger: {
            trigger: '.about-images',
            start: 'top 75%'
        }
    });

    gsap.from('.about-img-secondary', {
        clipPath: 'inset(0 100% 0 0)',
        duration: 1,
        ease: 'power4.inOut',
        delay: 0.3,
        scrollTrigger: {
            trigger: '.about-images',
            start: 'top 75%'
        }
    });

    // Parallax on about images
    gsap.to('.about-img-main img', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}

// ============================================
// PROPERTY SHOWCASE (ScrollTrigger Scrub + Snap)
// ============================================
function initPropertyShowcase() {
    const showcase = document.querySelector('.property-showcase');
    if (!showcase) return;

    const slides = gsap.utils.toArray('.property-slide');
    const outerWrappers = gsap.utils.toArray('.property-slide .outer');
    const innerWrappers = gsap.utils.toArray('.property-slide .inner');
    const bgImages = gsap.utils.toArray('.property-slide .bg');
    const headings = gsap.utils.toArray('.property-showcase .section-heading');
    const galleries = gsap.utils.toArray('.property-gallery');
    const slideDots = gsap.utils.toArray('.slide-dot');
    const currentSlideEl = document.querySelector('.current-slide');

    // Split headings into characters
    const splitHeadings = headings.map(h => new TextSplitter(h));

    const numSlides = slides.length;
    const numTransitions = numSlides - 1;

    // ---- Initial States ----
    // All slides visible but stacked, z-index ascending so each new slide covers the previous
    slides.forEach((slide, i) => {
        gsap.set(slide, { autoAlpha: 1, zIndex: i + 1 });
    });

    // First slide: fully visible
    gsap.set(outerWrappers[0], { yPercent: 0 });
    gsap.set(innerWrappers[0], { yPercent: 0 });
    gsap.set(bgImages[0], { yPercent: 0 });
    gsap.set(splitHeadings[0].chars, { opacity: 1, y: 0 });

    // Remaining slides: positioned below (outer=100%, inner=-100% for parallax)
    for (let i = 1; i < numSlides; i++) {
        gsap.set(outerWrappers[i], { yPercent: 100 });
        gsap.set(innerWrappers[i], { yPercent: -100 });
        gsap.set(bgImages[i], { yPercent: 15 });
    }

    // ---- Build Master Timeline ----
    const masterTl = gsap.timeline();

    for (let i = 0; i < numTransitions; i++) {
        const tl = gsap.timeline();

        // Current slide: bg parallax up + heading fade out
        tl.to(bgImages[i], {
            yPercent: -15,
            duration: 1,
            ease: 'none'
        }, 0);

        tl.to(splitHeadings[i].chars, {
            opacity: 0,
            y: -30,
            duration: 0.4,
            stagger: 0.01,
            ease: 'none'
        }, 0);

        // Fade out current gallery
        if (galleries[i]) {
            tl.to(galleries[i], {
                opacity: 0,
                y: -20,
                duration: 0.3,
                ease: 'none'
            }, 0);
        }

        // Next slide: outer/inner/bg slide in from below
        tl.to(outerWrappers[i + 1], {
            yPercent: 0,
            duration: 1,
            ease: 'none'
        }, 0);

        tl.to(innerWrappers[i + 1], {
            yPercent: 0,
            duration: 1,
            ease: 'none'
        }, 0);

        tl.to(bgImages[i + 1], {
            yPercent: 0,
            duration: 1,
            ease: 'none'
        }, 0);

        // Reveal next heading characters
        tl.to(splitHeadings[i + 1].chars, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.02,
            ease: 'none'
        }, 0.4);

        // Fade in next gallery
        if (galleries[i + 1]) {
            tl.fromTo(galleries[i + 1],
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.3, ease: 'none' },
                0.6
            );
        }

        masterTl.add(tl);
    }

    // ---- ScrollTrigger: Pin + Scrub + Snap ----
    ScrollTrigger.create({
        trigger: '.property-showcase',
        start: 'top top',
        end: () => '+=' + (numTransitions * window.innerHeight),
        pin: true,
        animation: masterTl,
        scrub: 0.5,
        snap: {
            snapTo: 1 / numTransitions,
            duration: { min: 0.25, max: 0.7 },
            delay: 0.05,
            ease: 'power1.inOut'
        },
        onUpdate: (self) => {
            const index = Math.min(
                Math.round(self.progress * numTransitions),
                numTransitions
            );
            updateUI(index);
        }
    });

    // ---- UI Updates ----
    let lastTrackedSlide = -1;
    function updateUI(index) {
        if (currentSlideEl) {
            currentSlideEl.textContent = String(index + 1).padStart(2, '0');
        }
        slideDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        // Track slide views
        if (index !== lastTrackedSlide) {
            lastTrackedSlide = index;
            if (typeof trackEvent === 'function') {
                const heading = headings[index] ? headings[index].textContent : '';
                trackEvent('property_slide_view', { slide: index + 1, property: heading });
            }
        }
    }

    // ---- Properties Intro Animation ----
    gsap.from('.properties-intro .section-label', {
        y: 20, opacity: 0, duration: 0.6,
        scrollTrigger: { trigger: '.properties-intro', start: 'top 80%' }
    });

    gsap.from('.properties-intro .section-title', {
        y: 40, opacity: 0, duration: 0.8,
        scrollTrigger: { trigger: '.properties-intro', start: 'top 80%' }
    });

    gsap.from('.properties-intro .section-desc', {
        y: 30, opacity: 0, duration: 0.6, delay: 0.2,
        scrollTrigger: { trigger: '.properties-intro', start: 'top 80%' }
    });

    updateUI(0);
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(num => {
        const target = parseInt(num.dataset.target);

        gsap.to(num, {
            textContent: target,
            duration: 2,
            ease: 'power1.out',
            snap: { textContent: 1 },
            scrollTrigger: {
                trigger: num,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Stagger stat items
    gsap.from('.stat-item', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        scrollTrigger: {
            trigger: '#stats',
            start: 'top 80%'
        }
    });
}

// ============================================
// LOCATIONS ANIMATIONS
// ============================================
function initLocationsAnimations() {
    // ---- Section Label ----
    gsap.from('#locations .section-label', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: {
            trigger: '#locations',
            start: 'top 85%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true
        }
    });

    // ---- Word-by-Word Rise for title ----
    const locTitle = document.querySelector('#locations .section-title');
    if (locTitle) {
        const titleText = locTitle.textContent.trim();
        locTitle.innerHTML = '';

        const titleLine = document.createElement('div');
        titleLine.className = 'title-line';

        const words = titleText.split(/\s+/);
        words.forEach((word, wi) => {
            const clipWrapper = document.createElement('span');
            clipWrapper.className = 'word-clip';

            const wordSpan = document.createElement('span');
            wordSpan.className = 'word-rise';
            wordSpan.textContent = word;

            clipWrapper.appendChild(wordSpan);
            titleLine.appendChild(clipWrapper);

            if (wi < words.length - 1) {
                titleLine.appendChild(document.createTextNode(' '));
            }
        });

        locTitle.appendChild(titleLine);

        gsap.from(locTitle.querySelectorAll('.word-rise'), {
            yPercent: 110,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: {
                trigger: '#locations',
                start: 'top 80%',
                toggleActions: 'play none none none',
                invalidateOnRefresh: true
            }
        });
    }

    // ---- Gold Wipe Line-by-Line for subtitle ----
    const locDesc = document.querySelector('#locations .section-desc');
    if (locDesc) {
        const text = locDesc.textContent.trim();
        const sentences = text.split(/(?<=\.)\s+/);
        locDesc.innerHTML = '';

        const locLines = [];
        sentences.forEach(sentence => {
            const lineSpan = document.createElement('span');
            lineSpan.className = 'desc-line';
            lineSpan.textContent = sentence;
            locDesc.appendChild(lineSpan);
            locLines.push(lineSpan);
        });

        locDesc.style.opacity = '1';

        gsap.set(locLines, {
            opacity: 0.15,
            backgroundImage: 'linear-gradient(90deg, var(--gold) 50%, transparent 50%)',
            backgroundSize: '200% 2px',
            backgroundPosition: '100% 100%',
            backgroundRepeat: 'no-repeat'
        });

        locLines.forEach((line, i) => {
            const lineTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#locations',
                    start: 'top 75%',
                    toggleActions: 'play none none none',
                    invalidateOnRefresh: true
                },
                delay: 0.8 + (i * 0.7)
            });

            lineTl.to(line, {
                backgroundPosition: '0% 100%',
                duration: 2,
                ease: 'power2.inOut'
            });

            lineTl.to(line, {
                opacity: 1,
                duration: 1.8,
                ease: 'power1.out'
            }, '-=1.8');

            lineTl.to(line, {
                backgroundSize: '200% 0px',
                duration: 0.8,
                ease: 'power2.out'
            });
        });
    }

    // Location cards stagger — use batch for reliability after pinned sections
    const locationCards = gsap.utils.toArray('.location-card');
    locationCards.forEach((card, i) => {
        gsap.from(card, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#locations .locations-grid',
                start: 'top 90%',
                toggleActions: 'play none none none',
                invalidateOnRefresh: true
            }
        });
    });

    // Image parallax inside cards
    locationCards.forEach(card => {
        const img = card.querySelector('img');
        if (img) {
            gsap.to(img, {
                yPercent: -10,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                    invalidateOnRefresh: true
                }
            });
        }
    });

    // ---- Accordion Hover Effect (desktop only) ----
    const grid = document.querySelector('.locations-grid');
    if (!grid || window.matchMedia('(max-width: 1024px)').matches) return;

    const imgWrappers = locationCards.map(c => c.querySelector('.location-img-wrapper'));
    const cardDescs = locationCards.map(c => c.querySelector('.location-info p'));

    locationCards.forEach((card, i) => {
        card.addEventListener('mouseenter', () => {
            // Hide ALL subtexts immediately
            gsap.to(cardDescs, {
                autoAlpha: 0,
                height: 0,
                duration: 0.2,
                ease: 'power2.in'
            });

            // Expand hovered card
            gsap.to(card, {
                flexGrow: 1.8,
                duration: 0.6,
                ease: 'power2.out'
            });
            gsap.to(imgWrappers[i], {
                height: 340,
                duration: 0.6,
                ease: 'power2.out'
            });

            // Show hovered card's subtext after expand finishes
            gsap.to(cardDescs[i], {
                autoAlpha: 1,
                height: 'auto',
                duration: 0.4,
                delay: 0.35,
                ease: 'power2.out'
            });

            // Shrink the other 3 cards
            locationCards.forEach((other, j) => {
                if (j !== i) {
                    gsap.to(other, {
                        flexGrow: 0.7,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                    gsap.to(imgWrappers[j], {
                        height: 200,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                }
            });
        });
    });

    // Reset all when mouse leaves the entire grid
    grid.addEventListener('mouseleave', () => {
        // Hide subtexts during transition
        gsap.to(cardDescs, {
            autoAlpha: 0,
            height: 0,
            duration: 0.2,
            ease: 'power2.in'
        });

        gsap.to(locationCards, {
            flexGrow: 1,
            duration: 0.5,
            ease: 'power2.inOut'
        });
        gsap.to(imgWrappers, {
            height: 260,
            duration: 0.5,
            ease: 'power2.inOut'
        });

        // Show all subtexts after reset finishes
        gsap.to(cardDescs, {
            autoAlpha: 1,
            height: 'auto',
            duration: 0.4,
            delay: 0.35,
            ease: 'power2.out'
        });
    });
}

// ============================================
// LIFESTYLE ANIMATIONS
// ============================================
function initLifestyleAnimations() {
    // Section header
    gsap.from('#lifestyle .section-label', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: {
            trigger: '#lifestyle',
            start: 'top 85%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true
        }
    });

    gsap.from('#lifestyle .section-title', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: '#lifestyle',
            start: 'top 85%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true
        }
    });

    // Lifestyle items with clip-path reveal
    gsap.utils.toArray('.lifestyle-item').forEach((item, i) => {
        gsap.from(item, {
            clipPath: 'inset(100% 0 0 0)',
            duration: 1,
            ease: 'power4.inOut',
            delay: i * 0.1,
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                toggleActions: 'play none none none',
                invalidateOnRefresh: true
            }
        });
    });

    // Hook text animation
    const hook = document.querySelector('.lifestyle-hook');
    if (hook) {
        gsap.set('.hook-line', { scaleX: 0, transformOrigin: 'left' });
        gsap.set('.hook-text', { y: 30, autoAlpha: 0 });
        gsap.set('.hook-cta', { y: 15, autoAlpha: 0 });

        ScrollTrigger.create({
            trigger: hook,
            start: 'top 90%',
            invalidateOnRefresh: true,
            onEnter: () => {
                const tl = gsap.timeline();
                tl.to('.hook-line', {
                    scaleX: 1,
                    duration: 0.8,
                    ease: 'power2.inOut'
                })
                .to('.hook-text', {
                    y: 0,
                    autoAlpha: 1,
                    duration: 1,
                    ease: 'power2.out'
                }, '-=0.3')
                .to('.hook-cta', {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.6,
                    ease: 'power2.out'
                }, '-=0.4');
            },
            once: true
        });
    }
}

// ============================================
// TESTIMONIALS ANIMATIONS
// ============================================
function initTestimonialsAnimations() {
    gsap.from('#testimonials .section-label', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: {
            trigger: '#testimonials .section-header',
            start: 'top 80%'
        }
    });

    gsap.from('#testimonials .section-title', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: '#testimonials .section-header',
            start: 'top 80%'
        }
    });

    gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
        gsap.from(card, {
            y: 60,
            opacity: 0,
            duration: 0.7,
            delay: i * 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#testimonials',
                start: 'top 85%',
                toggleActions: 'play none none none',
                invalidateOnRefresh: true
            }
        });
    });
}

// ============================================
// CONTACT SECTION ANIMATIONS
// ============================================
function initContactAnimations() {
    const contactTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 70%'
        }
    });

    contactTl
        .from('.contact-text .section-label', {
            x: -30,
            opacity: 0,
            duration: 0.6
        })
        .from('.contact-text .section-title', {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.3')
        .from('.contact-desc', {
            y: 30,
            opacity: 0,
            duration: 0.6
        }, '-=0.3')
        .from('.contact-info-item', {
            x: -30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.12
        }, '-=0.2')
        .from('.contact-form-wrapper', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.5');

    // Form animation handled separately in initFormValidation()

    // Parallax on contact background
    gsap.to('.contact-bg img', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
            trigger: '#contact',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}

// ============================================
// FOOTER ANIMATIONS
// ============================================
function initFooterAnimations() {
    // Footer content reveals
    gsap.from('.footer-logo', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: {
            trigger: '#footer',
            start: 'top 90%',
            invalidateOnRefresh: true
        }
    });

    gsap.from('.footer-links', {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '#footer',
            start: 'top 85%',
            invalidateOnRefresh: true
        }
    });

    gsap.from('.footer-social a', {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.footer-social',
            start: 'top 90%',
            invalidateOnRefresh: true
        }
    });

    // ---- SUNSET ANIMATION ----
    // Starts as soon as footer peeks into view, plays slowly over a long scroll
    const sunsetTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#footer',
            start: 'top bottom',
            end: 'bottom+=300 bottom',
            scrub: 2,
            invalidateOnRefresh: true
        }
    });

    // Sun moves down-right and turns red — slow, cinematic
    sunsetTl.to('.sunset-sun', {
        yPercent: 110,
        xPercent: 65,
        background: '#bd0000',
        duration: 3,
        ease: 'power1.inOut'
    }, 0);

    // Sky darkens from warm sunset to deep night — slightly delayed
    sunsetTl.to('#footer', {
        backgroundImage: 'linear-gradient(#190304, #2b0607, #46090b, #46090b)',
        duration: 3,
        ease: 'none'
    }, 0.5);
}

// ============================================
// SMOOTH SCROLL (Anchor Links)
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            gsap.to(window, {
                duration: 1.2,
                scrollTo: {
                    y: target,
                    offsetY: 0
                },
                ease: 'power3.inOut'
            });
        });
    });
}

// ============================================
// MAGNETIC BUTTON EFFECT
// ============================================
document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.15,
            y: y * 0.15,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
    });
});

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = {
        name: { el: form.querySelector('#contactName'), errorEl: form.querySelector('#contactNameError') },
        email: { el: form.querySelector('#contactEmail'), errorEl: form.querySelector('#contactEmailError') },
        interest: { el: form.querySelector('#contactInterest'), errorEl: form.querySelector('#contactInterestError') }
    };
    const statusEl = document.getElementById('formStatus');

    // Clear error on input
    Object.values(fields).forEach(f => {
        if (f.el) {
            f.el.addEventListener('input', () => clearFieldError(f));
            f.el.addEventListener('change', () => clearFieldError(f));
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let valid = true;

        // Validate name
        if (!fields.name.el.value.trim()) {
            showFieldError(fields.name, 'Please enter your name');
            valid = false;
        }

        // Validate email
        const emailVal = fields.email.el.value.trim();
        if (!emailVal) {
            showFieldError(fields.email, 'Please enter your email');
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
            showFieldError(fields.email, 'Please enter a valid email address');
            valid = false;
        }

        // Validate interest
        if (!fields.interest.el.value) {
            showFieldError(fields.interest, 'Please select an interest');
            valid = false;
        }

        if (!valid) return;

        const btn = form.querySelector('.btn');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'SENDING...';

        // Check if real endpoint is configured
        const endpoint = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.formEndpoint) ? SITE_CONFIG.formEndpoint : '';

        if (endpoint) {
            // Real submission via Fetch API
            try {
                const formData = new FormData(form);
                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    showSuccess(btn, originalText, statusEl);
                    if (typeof trackEvent === 'function') trackEvent('form_submit', { type: 'contact_inquiry' });
                } else {
                    btn.textContent = 'ERROR — TRY AGAIN';
                    btn.style.background = '#ff6b6b';
                    btn.style.color = '#fff';
                    if (statusEl) statusEl.textContent = 'There was an error. Please try again.';
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                        btn.style.color = '';
                        btn.disabled = false;
                    }, 3000);
                }
            } catch (_err) {
                btn.textContent = 'ERROR — TRY AGAIN';
                btn.style.background = '#ff6b6b';
                btn.style.color = '#fff';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.disabled = false;
                }, 3000);
            }
        } else {
            // Demo mode — simulate success
            setTimeout(() => {
                showSuccess(btn, originalText, statusEl);
                if (typeof trackEvent === 'function') trackEvent('form_submit', { type: 'contact_inquiry_demo' });
            }, 800);
        }
    });

    function showSuccess(btn, originalText, statusEl) {
        btn.textContent = 'SENT SUCCESSFULLY';
        btn.style.background = 'var(--primary)';
        btn.style.color = '#fff';
        if (!prefersReducedMotion) {
            gsap.from(btn, { scale: 0.95, duration: 0.3, ease: 'back.out(1.7)' });
        }
        if (statusEl) statusEl.textContent = 'Your inquiry has been sent successfully!';
        setTimeout(() => {
            form.reset();
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
            if (statusEl) statusEl.textContent = '';
        }, 3000);
    }

    function showFieldError(field, msg) {
        field.el.parentElement.classList.add('has-error');
        field.errorEl.textContent = msg;
        field.el.setAttribute('aria-invalid', 'true');
    }

    function clearFieldError(field) {
        field.el.parentElement.classList.remove('has-error');
        field.errorEl.textContent = '';
        field.el.removeAttribute('aria-invalid');
    }
}

// ============================================
// CTA CLICK TRACKING
// ============================================
function initCTATracking() {
    document.querySelectorAll('.btn, .nav-cta, .hook-cta').forEach(el => {
        el.addEventListener('click', () => {
            if (typeof trackEvent === 'function') {
                trackEvent('cta_click', {
                    text: el.textContent.trim(),
                    href: el.getAttribute('href') || ''
                });
            }
        });
    });
}

// ============================================
// SCROLL DEPTH TRACKING
// ============================================
function initScrollDepthTracking() {
    const milestones = [25, 50, 75, 100];
    const reached = {};

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) return;
        const percent = Math.round((scrollTop / docHeight) * 100);

        milestones.forEach(m => {
            if (percent >= m && !reached[m]) {
                reached[m] = true;
                if (typeof trackEvent === 'function') {
                    trackEvent('scroll_depth', { depth: m + '%' });
                }
            }
        });
    }, { passive: true });
}

