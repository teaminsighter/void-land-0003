/* ============================================
   SITE CONFIGURATION
   ============================================
   Client: Change ONLY the values below.
   Then deploy. That's it.
   ============================================ */

const SITE_CONFIG = {

    // ---- Company Info ----
    companyName: 'Bali Luxe Estates',
    tagline: 'Luxury Real Estate in Bali',
    phone: '+62 361 234 5678',
    email: 'hello@baliluxeestates.com',
    address: 'Jl. Kayu Aya No. 88, Seminyak, Bali 80361',

    // ---- Social Links (leave blank to hide) ----
    social: {
        instagram: '#',
        facebook: '#',
        linkedin: '#',
        youtube: '#'
    },

    // ---- SEO ----
    seo: {
        title: 'Bali Luxe Estates | Luxury Real Estate in Bali',
        description: 'Discover luxury villas, beachfront estates, and tropical sanctuaries across Bali. Premium real estate in Seminyak, Ubud, Canggu, and Uluwatu.',
        canonicalUrl: 'https://www.baliluxeestates.com',
        ogImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
        locale: 'en_US'
    },

    // ---- Analytics (leave blank to disable) ----
    analytics: {
        gtmId: '',           // e.g. 'GTM-XXXXXXX'
        ga4Id: '',           // e.g. 'G-XXXXXXXXXX'  (fallback if no GTM)
        fbPixelId: ''        // e.g. '1234567890'
    },

    // ---- Contact Form ----
    // Set a Formspree/Getform URL to enable real submissions.
    // Leave blank for demo mode (shows success without sending).
    formEndpoint: '',        // e.g. 'https://formspree.io/f/xyzabcde'

    // ---- Footer ----
    yearFounded: 2009,
    copyright: '2024 Bali Luxe Estates. All Rights Reserved.'
};


/* ============================================
   DOM AUTO-POPULATION FROM CONFIG
   ============================================ */

function applySiteConfig() {
    const c = SITE_CONFIG;

    // Title tag
    document.title = c.seo.title;

    // Meta tags
    setMeta('description', c.seo.description);
    setMetaProperty('og:title', c.seo.title);
    setMetaProperty('og:description', c.seo.description);
    setMetaProperty('og:image', c.seo.ogImage);
    setMetaProperty('og:url', c.seo.canonicalUrl);
    setMetaProperty('og:site_name', c.companyName);
    setMetaProperty('og:locale', c.seo.locale);
    setMeta('twitter:title', c.seo.title);
    setMeta('twitter:description', c.seo.description);
    setMeta('twitter:image', c.seo.ogImage);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = c.seo.canonicalUrl;

    // data-config elements
    document.querySelectorAll('[data-config]').forEach(el => {
        const key = el.getAttribute('data-config');
        const val = resolveConfigKey(key, c);
        if (val !== undefined) {
            if (el.tagName === 'A') {
                if (key.startsWith('social.')) {
                    el.href = val || '#';
                    el.style.display = val ? '' : 'none';
                } else if (key === 'email') {
                    el.href = 'mailto:' + val;
                    el.textContent = val;
                } else if (key === 'phone') {
                    el.href = 'tel:' + val.replace(/\s+/g, '');
                    el.textContent = val;
                }
            } else {
                el.textContent = val;
            }
        }
    });

    // JSON-LD structured data
    updateJsonLd(c);
}

function resolveConfigKey(dotKey, obj) {
    return dotKey.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

function setMeta(name, content) {
    let el = document.querySelector('meta[name="' + name + '"]');
    if (el) el.setAttribute('content', content);
}

function setMetaProperty(property, content) {
    let el = document.querySelector('meta[property="' + property + '"]');
    if (el) el.setAttribute('content', content);
}

function updateJsonLd(c) {
    const existing = document.getElementById('jsonld-schema');
    if (existing) existing.remove();

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        name: c.companyName,
        description: c.seo.description,
        url: c.seo.canonicalUrl,
        telephone: c.phone,
        email: c.email,
        address: {
            '@type': 'PostalAddress',
            streetAddress: c.address
        },
        image: c.seo.ogImage,
        sameAs: Object.values(c.social).filter(u => u && u !== '#')
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'jsonld-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}


/* ============================================
   ANALYTICS (fires ONLY after cookie consent)
   ============================================ */

let analyticsLoaded = false;

function initAnalytics() {
    if (analyticsLoaded) return;
    const a = SITE_CONFIG.analytics;
    if (!a.gtmId && !a.ga4Id && !a.fbPixelId) return;

    window.dataLayer = window.dataLayer || [];

    // GTM
    if (a.gtmId) {
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtm.js?id=' + a.gtmId;
        document.head.appendChild(s);
        window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    }
    // GA4 fallback (only if no GTM)
    else if (a.ga4Id) {
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + a.ga4Id;
        document.head.appendChild(s);
        window.dataLayer.push({ js: new Date() });
        window.dataLayer.push({ config: a.ga4Id });
        window.gtag = function () { window.dataLayer.push(arguments); };
    }

    // Facebook Pixel
    if (a.fbPixelId) {
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
        n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
        s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
        (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', a.fbPixelId);
        fbq('track', 'PageView');
    }

    analyticsLoaded = true;
}

function trackEvent(eventName, params) {
    if (!analyticsLoaded) return;
    params = params || {};

    // GTM / GA4
    if (window.dataLayer) {
        window.dataLayer.push(Object.assign({ event: eventName }, params));
    }
    if (window.gtag) {
        window.gtag('event', eventName, params);
    }

    // Facebook Pixel
    if (window.fbq) {
        fbq('trackCustom', eventName, params);
    }
}


/* ============================================
   COOKIE CONSENT
   ============================================ */

function initCookieConsent() {
    const STORAGE_KEY = 'cookie_consent';
    const saved = localStorage.getItem(STORAGE_KEY);

    // If already accepted, load analytics immediately
    if (saved === 'accepted') {
        initAnalytics();
        return;
    }

    // If declined, do nothing
    if (saved === 'declined') return;

    // Otherwise show the banner after preloader finishes (~4.5s)
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;

    setTimeout(() => {
        banner.classList.add('visible');
    }, 4500);

    document.getElementById('cookieAccept').addEventListener('click', () => {
        localStorage.setItem(STORAGE_KEY, 'accepted');
        banner.classList.remove('visible');
        initAnalytics();
    });

    document.getElementById('cookieDecline').addEventListener('click', () => {
        localStorage.setItem(STORAGE_KEY, 'declined');
        banner.classList.remove('visible');
    });
}


/* ============================================
   INIT ON LOAD
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    applySiteConfig();
    initCookieConsent();
});
