/* site.js: theme, navigation, scroll reveal and the contact form.
   Loaded in <head> so the saved theme is applied before first paint. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  function readTheme() {
    try {
      var t = localStorage.getItem('theme');
      return t === 'light' || t === 'dark' ? t : null;
    } catch (e) { return null; }
  }
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) { /* storage blocked: theme lasts for this page only */ }
  }
  root.setAttribute('data-theme', readTheme() || 'dark');

  function init() {
    var nav = document.getElementById('nav');
    var themeBtn = document.getElementById('themeBtn');
    var mobBtn = document.getElementById('mobBtn');
    var menu = document.getElementById('navMobile');

    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      });
    }

    function setMenu(open) {
      if (!menu || !mobBtn) return;
      menu.hidden = !open;
      mobBtn.setAttribute('aria-expanded', String(open));
      if (nav) nav.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    if (mobBtn && menu) {
      mobBtn.addEventListener('click', function () { setMenu(menu.hidden); });
      menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !menu.hidden) { setMenu(false); mobBtn.focus(); }
      });
      window.addEventListener('resize', function () { if (window.innerWidth > 1000 && !menu.hidden) setMenu(false); });
    }

    if (nav) {
      var last = 0;
      window.addEventListener('scroll', function () {
        var y = window.scrollY;
        nav.classList.toggle('scrolled', y > 40);
        nav.classList.toggle('hide', y > last && y > 100 && menu && menu.hidden);
        last = y;
      }, { passive: true });
    }

    var reveal = document.querySelectorAll('.r');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('on'); io.unobserve(en.target); }
        });
      }, { threshold: 0.1 });
      reveal.forEach(function (el) { io.observe(el); });
    } else {
      reveal.forEach(function (el) { el.classList.add('on'); });
    }

    // a screenshot that fails to load is replaced by its placeholder
    document.querySelectorAll('img.phone-shot').forEach(function (img) {
      function fail() {
        img.hidden = true;
        var fb = img.nextElementSibling;
        if (fb && fb.classList.contains('phone-fallback')) fb.classList.add('show');
      }
      if (img.complete && img.naturalWidth === 0) fail();
      else img.addEventListener('error', fail);
    });

    // if a badge file is missing, fall back to a plain text button
    document.querySelectorAll('.store-badge img').forEach(function (img) {
      function fail() {
        var a = img.parentNode;
        a.className = 'text-badge primary';
        a.textContent = img.alt.indexOf('Google') !== -1 ? 'Google Play' : 'App Store';
      }
      if (img.complete && img.naturalWidth === 0) fail();
      else img.addEventListener('error', fail);
    });

    var form = document.getElementById('contactForm');
    if (form && window.fetch) {
      var btn = document.getElementById('submitBtn');
      var status = document.getElementById('fStatus');
      var show = function (ok, text) {
        status.className = 'f-status show ' + (ok ? 'ok' : 'err');
        status.textContent = text;
      };
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (form.elements._gotcha && form.elements._gotcha.value) {
          form.reset(); show(true, "Message sent. We'll be in touch."); return;
        }
        btn.disabled = true; btn.textContent = 'Sending...';
        status.className = 'f-status';
        fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            email: form.elements.email.value.trim(),
            message: form.elements.message.value.trim()
          })
        }).then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset(); show(true, "Message sent. We'll be in touch.");
        }).catch(function () {
          show(false, 'Something went wrong. Please email us directly.');
        }).then(function () {
          btn.disabled = false; btn.textContent = 'Send message';
        });
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
