(() => {
    const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const RM = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const U = (id, w = 700) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
    const SITE = { address: '2nd Ave, Block E, Annanagar East, Chennai, Tamil Nadu 600102', phone: '+91 8870244066', email: 'krish06kumars@gmail.com', hours: 'Daily 7:00 – 22:00', maps: 'https://www.google.com/maps/place/Anna+Nagar+East+metro+station/@13.0758361,80.2055245,13.7z/data=!4m6!3m5!1s0x3a526426669da0a7:0x4d2304ef992fd998!8m2!3d13.0847633!4d80.2196589!16s%2Fg%2F11dd_tg_7t?entry=ttu&g_ep=EgoyMDI2MTAxOS4wIKXMDSoASAFQAw%3D%3D' };
    const PRODUCTS = [
        { id: 'esp', name: 'Espresso', desc: 'Bold, concentrated, and beautifully balanced.', price: 120, cat: ['Espresso'], img: '1514432324607-a09d9b4aefdd' },
        { id: 'cap', name: 'Cappuccino', desc: 'Rich espresso wrapped in velvety milk foam.', price: 160, cat: ['Hot Coffee'], img: '1534778101976-62847782c213', best: 1 },
        { id: 'lat', name: 'Café Latte', desc: 'Smooth espresso and steamed milk, made for slow moments.', price: 180, cat: ['Hot Coffee'], img: '1511920170033-f8396924c348' },
        { id: 'mac', name: 'Caramel Macchiato', desc: 'Espresso, creamy milk, and a delicate caramel finish.', price: 210, cat: ['Hot Coffee', 'Signature Drinks'], img: '1485808191679-5f86510681a2' },
        { id: 'moc', name: 'Mocha', desc: 'A comforting meeting of chocolate and espresso.', price: 200, cat: ['Hot Coffee'], img: '1578314675249-a6910f80cc4e' },
        { id: 'cold', name: 'Cold Brew', desc: 'Slow-steeped coffee with a smooth, refreshing finish.', price: 190, cat: ['Iced Coffee'], img: '1517701604599-bb29b565090c' },
        { id: 'van', name: 'Vanilla Iced Latte', desc: 'Chilled espresso, creamy milk, and subtle vanilla.', price: 200, cat: ['Iced Coffee'], img: '1461023058943-07fcbe16d735' },
        { id: 'sig', name: 'Signature Velora Blend', desc: 'Our house signature, created for a memorable everyday ritual.', price: 230, cat: ['Signature Drinks'], img: '1495474472287-4d71bcdd2085', best: 1 }];
    const SIZES = [['Small', 0], ['Medium', 30], ['Large', 60]];
    const TESTI = [['The cappuccino is the slowest, kindest part of my morning.', 'Demo Customer A'], ['Quiet corners, warm light, and coffee that actually tastes of something.', 'Demo Customer B'], ['I came for the cold brew and stayed for the conversation.', 'Demo Customer C']];
    const inr = n => '₹' + n.toLocaleString('en-IN');
    const img = (p, w) => `<img loading="lazy" src="${U(p.img, w)}" alt="${p.name}" onerror="this.remove()">`;
    const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2000) };

    /* ---- cart (state separate from view) ---- */
    let cart = []; try { cart = JSON.parse(localStorage.getItem('velora-cart')) || [] } catch (e) { }
    const save = () => { try { localStorage.setItem('velora-cart', JSON.stringify(cart)) } catch (e) { } };
    const price = (p, s) => p.price + SIZES[s][1];
    const total = () => cart.reduce((a, i) => a + price(PRODUCTS.find(p => p.id === i.id), i.s) * i.q, 0);
    function add(id, s = 0, q = 1) { const i = cart.find(x => x.id === id && x.s === s); i ? i.q += q : cart.push({ id, s, q }); save(); render(); toast(PRODUCTS.find(p => p.id === id).name + ' added to cart') }
    function render() {
        $('#count').textContent = cart.reduce((a, i) => a + i.q, 0); $('#total').textContent = inr(total());
        $('#items').innerHTML = cart.length ? cart.map((i, n) => { const p = PRODUCTS.find(p => p.id === i.id); return `<div class="it">${img(p, 120)}<div><b>${p.name}</b> · ${SIZES[i.s][0]}<br>${inr(price(p, i.s))} × ${i.q} = <b>${inr(price(p, i.s) * i.q)}</b></div><button data-a="-" data-n="${n}" aria-label="Decrease">−</button><button data-a="+" data-n="${n}" aria-label="Increase">+</button><button data-a="x" data-n="${n}" aria-label="Remove">✕</button></div>` }).join('') : '<p>Your cart is empty. Find a cup you love in the menu.</p>';
        $('#checkout').disabled = !cart.length
    }
    $('#items').onclick = e => { const b = e.target.closest('button'); if (!b) return; const i = cart[b.dataset.n]; if (b.dataset.a === '+') i.q++; if (b.dataset.a === '-') i.q--; if (b.dataset.a === 'x' || i.q < 1) cart.splice(b.dataset.n, 1); save(); render() };
    const dr = $('#drawer'), openCart = o => { dr.classList.toggle('open', o); dr.setAttribute('aria-hidden', !o); $('#mask').hidden = !o; if (o) $('#close').focus() };
    $('#cartBtn').onclick = () => openCart(true); $('#close').onclick = () => openCart(false);
    $('#checkout').onclick = () => { toast('Demo order confirmed — no payment taken.'); cart = []; save(); render(); openCart(false) };

    /* ---- menu ---- */
    let cat = 'All', term = ''; const cats = ['All', 'Espresso', 'Hot Coffee', 'Iced Coffee', 'Signature Drinks'];
    $('.filters').innerHTML = cats.map(c => `<button aria-pressed="${c === 'All'}">${c}</button>`).join('');
    function grid() {
        const list = PRODUCTS.filter(p => (cat === 'All' || p.cat.includes(cat)) && p.name.toLowerCase().includes(term));
        $('#grid').innerHTML = list.map(p => `<article class="card" data-id="${p.id}" tabindex="0" aria-label="${p.name}, details">${p.best ? '<span class="bs">Bestseller</span>' : ''}<div class="im">${img(p)}</div><h3>${p.name}</h3><p>${p.desc}</p><div class="row"><b>${inr(p.price)}</b><button class="btn sm" data-add="${p.id}">Add</button></div></article>`).join('');
        $('#none').hidden = !!list.length; if (!RM) gsap.from('.card', { y: 40, opacity: 0, stagger: .07, duration: .6, ease: 'power3.out', clearProps: 'all' }); ScrollTrigger.refresh()
    }
    $('.filters').onclick = e => { const b = e.target.closest('button'); if (!b) return; cat = b.textContent; $$('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b)); grid() };
    $('#q').oninput = e => { term = e.target.value.toLowerCase(); grid() }; $('#search').onclick = () => { location.hash = 'menu'; setTimeout(() => $('#q').focus(), 600) };
    $('#grid').onclick = e => { const a = e.target.closest('[data-add]'); if (a) { e.stopPropagation(); add(a.dataset.add); const b = a; gsap.fromTo(b, { scale: .85 }, { scale: 1, duration: .4, ease: 'back.out(3)' }); return } const c = e.target.closest('.card'); c && modal(c.dataset.id) };
    $('#grid').onkeydown = e => { if (e.key === 'Enter' && e.target.classList.contains('card')) modal(e.target.dataset.id) };
    $('#grid').onmousemove = e => { if (matchMedia('(hover:none)').matches || RM) return; const c = e.target.closest('.card'); if (!c) return; const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(8px)` };
    $('#grid').onmouseout = e => { const c = e.target.closest('.card'); if (c) c.style.transform = '' };
    let lastFocus; function modal(id) {
        const p = PRODUCTS.find(x => x.id === id); let s = 0, q = 1; lastFocus = document.activeElement; const m = $('#modal');
        const draw = () => { m.innerHTML = `<div class="mi">${img(p, 900)}</div><div class="mb"><button class="ic x" aria-label="Close">✕</button><p class="lab">${p.cat[0]}</p><h3 id="mt">${p.name}</h3><p>${p.desc}</p><div class="sz" role="group" aria-label="Size">${SIZES.map((z, i) => `<button data-s="${i}" aria-pressed="${i === s}">${z[0]}</button>`).join('')}</div><div class="qty"><button data-q="-1" aria-label="Decrease quantity">−</button><b aria-live="polite">${q}</b><button data-q="1" aria-label="Increase quantity">+</button></div><button class="btn" data-go>Add to cart · ${inr(price(p, s) * q)}</button></div>` };
        draw(); m.hidden = false; $('#mask').hidden = false; gsap.from(m, { opacity: 0, y: 30, duration: .35 }); $('.x', m).focus();
        m.onclick = e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.s) s = +b.dataset.s; if (b.dataset.q) q = Math.max(1, Math.min(20, q + +b.dataset.q)); if ('go' in b.dataset) { add(id, s, q); closeM(); return } if (b.classList.contains('x')) { closeM(); return } draw(); $(`[data-s="${s}"],[data-q]`, m) }
    }
    function closeM() { $('#modal').hidden = true; if (dr.classList.contains('open') === false) $('#mask').hidden = true; lastFocus && lastFocus.focus() }
    $('#mask').onclick = () => { closeM(); openCart(false) };
    addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeM(); openCart(false); $('#links').classList.remove('open') }
        if (e.key === 'Tab' && !$('#modal').hidden) { const f = $$('button', $('#modal')); const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() } }
    });

    /* ---- nav, site, testimonials, forms ---- */
    $('#burger').onclick = () => { const o = $('#links').classList.toggle('open'); $('#burger').setAttribute('aria-expanded', o) };
    $('#links').onclick = e => e.target.tagName === 'A' && $('#links').classList.remove('open');
    $('#site').innerHTML = `<dt>Address</dt><dd>${SITE.address}</dd><dt>Hours</dt><dd>${SITE.hours}</dd><dt>Contact</dt><dd>${SITE.phone}<br>${SITE.email}</dd>`; $('#dir').href = SITE.maps;
    $$('[data-soc]').forEach(a => { a.href = '#'; a.onclick = e => { e.preventDefault(); toast('Social URLs are set in app.js (demo)') } }); $('#yr').textContent = new Date().getFullYear();
    $('.track').innerHTML = TESTI.map(t => `<div class="slide"><q>${t[0]}</q><p>— ${t[1]} (demo testimonial)</p></div>`).join('');
    let ci = 0; const go = i => { ci = (i + TESTI.length) % TESTI.length; $('.track').style.transform = `translateX(-${ci * 100}%)`; $$('#dots button').forEach((b, n) => b.setAttribute('aria-current', n === ci)) };
    $('#dots').innerHTML = TESTI.map((_, i) => `<button aria-label="Testimonial ${i + 1}"></button>`).join(''); $$('#dots button').forEach((b, i) => b.onclick = () => go(i));
    $('#prev').onclick = () => go(ci - 1); $('#next').onclick = () => go(ci + 1); go(0);
    $('#car').onkeydown = e => { if (e.key === 'ArrowLeft') go(ci - 1); if (e.key === 'ArrowRight') go(ci + 1) }; let tx; $('#car').ontouchstart = e => tx = e.touches[0].clientX; $('#car').ontouchend = e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 40) go(ci + (d < 0 ? 1 : -1)) };
    $('#news').onsubmit = e => { e.preventDefault(); const v = $('#em').value.trim(), n = $('#nm'); const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); $('#em').setAttribute('aria-invalid', !ok); n.textContent = ok ? 'Thanks! (Demo only — no mailing list connected.)' : 'Please enter a valid email address.' };
    $$('.tag').forEach(t => t.onclick = () => $('#ing-d').textContent = t.dataset.i);
    render();

    /* ---- STORY data ---- */
    const STAGES = [['Sourcing', 'Good coffee begins with great origins.', '1447933601403-0c6688de566e'], ['Roasting', 'Carefully roasted to reveal character, aroma, and depth.', '1559056199-641a0ac8b55e'], ['Grinding', 'Every detail matters, from the first crack of a bean to the final grind.', '1497935586351-b67a49e012bf'], ['Brewing', 'Crafted with intention. Served with care.', '1514432324607-a09d9b4aefdd']];
    $('.frame').innerHTML = STAGES.map(s => `<div class="si"><img loading="lazy" src="${U(s[2], 1000)}" alt="${s[0]}" onerror="this.remove()"></div>`).join('');
    $('.st').innerHTML = STAGES.map((s, i) => `<div class="sx"><span class="n">0${i + 1}</span><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('');

    /* ---- bean rain (canvas, no React/DOM per bean) ---- */
    /* ---- bean rain: Home section only, ~4 seconds, plays once ---- */
    const cv = $('#beans'), cx = cv.getContext('2d'), hero = $('#home');
    hero.appendChild(cv);                       // move the canvas INTO the hero
    const dpr = Math.min(devicePixelRatio, 2), DUR = 4000;
    let W, H, beans = [], raf, t0, seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    function size() {
        W = cv.width = hero.clientWidth * dpr; H = cv.height = hero.clientHeight * dpr;
        const n = innerWidth < 700 ? 18 : innerWidth < 1000 ? 30 : 55;
        beans = Array.from({ length: n }, () => {
            const z = rnd();
            return {
                x: rnd() * W, y: -rnd() * H * .8, z, s: (8 + z * 24) * dpr, v: (4 + z * 8) * dpr,
                dx: (rnd() - .5) * .8 * dpr, ph: rnd() * 6.28, r: rnd() * 6.28, vr: (rnd() - .5) * .05
            }
        });
    }
    function bean(b, a) {
        cx.save(); cx.translate(b.x, b.y); cx.rotate(b.r); cx.globalAlpha = a * (.3 + b.z * .6);
        cx.fillStyle = b.z > .5 ? '#55301F' : '#3a2014';
        cx.beginPath(); cx.ellipse(0, 0, b.s, b.s * .62, 0, 0, 6.28); cx.fill();
        cx.strokeStyle = '#B97843'; cx.lineWidth = Math.max(1, b.s * .08);
        cx.beginPath(); cx.moveTo(-b.s * .8, 0); cx.bezierCurveTo(-b.s * .3, -b.s * .3, b.s * .3, b.s * .3, b.s * .8, 0); cx.stroke();
        cx.restore();
    }
    function tick(now) {
        t0 = t0 || now; const e = now - t0;
        if (e > DUR) { cv.remove(); return }             // stop and remove after 4s
        const fade = e < 2800 ? 1 : 1 - (e - 2800) / (DUR - 2800); // fade out during the last 1.2s
        cx.clearRect(0, 0, W, H);
        for (const b of beans) {
            b.y += b.v; b.x += b.dx + Math.sin(b.y * .004 / dpr + b.ph) * .6 * dpr; b.r += b.vr;
            if (b.y < H + 50) bean(b, fade);
        }
        raf = requestAnimationFrame(tick);
    }
    if (!RM) { size(); raf = requestAnimationFrame(tick) } else cv.remove();
    addEventListener('pagehide', () => cancelAnimationFrame(raf));
    /* ---- GSAP ---- */
    if (!window.gsap) { return } gsap.registerPlugin(ScrollTrigger); grid();
    const nav = $('#nav'), navSecs = $$('main section'); let lastScroll = 0;
    function onScroll() {
        const y = scrollY; let dark = true, cur = 'home';
        navSecs.forEach(s => {
            const r = s.getBoundingClientRect();
            if (r.top <= 50 && r.bottom > 50) dark = s.classList.contains('dark') || s.classList.contains('testi');
            if (s.id && r.top < innerHeight * .4) cur = s.id;
        });
        // colour: transparent at very top, dark glass over dark sections, cream over light ones
        nav.classList.toggle('drk', y >= 10 && dark);
        nav.classList.toggle('lite', y >= 10 && !dark);
        // hide when scrolling down, show when scrolling up
        const menuOpen = $('#links').classList.contains('open');
        if (Math.abs(y - lastScroll) > 4) { nav.classList.toggle('hide', y > lastScroll && y > 120 && !menuOpen); lastScroll = y }
        $$('#links a').forEach(a => a.classList.toggle('on', a.hash === '#' + cur));
    }
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    if (RM) return;
    gsap.from('.hero h1 span', { yPercent: 110, duration: 1.2, stagger: .15, ease: 'power4.out', delay: .2 }); gsap.from('.hero-t>*:not(h1)', { opacity: 0, y: 20, stagger: .12, delay: .8 });
    gsap.from('#cup', { scale: .6, opacity: 0, duration: 1.6, ease: 'power3.out' });
    gsap.to('.cup-img', { y: -14, rotation: 2, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    // cup scroll scrub: rises, rotates, scales, fades into story
    gsap.to('.cup-wrap', { scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom 15%', scrub: .8 }, y: -160, rotation: 28, scale: .45, opacity: 0, ease: 'none' });
    gsap.to('.glow', { scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true }, y: 200, opacity: 0 });
    gsap.to('.hero-t', { scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true }, y: -80, opacity: .2 });
    // pointer tilt
    const qx = gsap.quickTo('#cup', 'rotationY', { duration: .8 }), qy = gsap.quickTo('#cup', 'rotationX', { duration: .8 });
    $('#home').addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; qx((e.clientX / innerWidth - .5) * 18); qy(-(e.clientY / innerHeight - .5) * 14) });
    // story
    const mm = gsap.matchMedia(); const imgs = $$('.si'), txt = $$('.sx');
    mm.add('(min-width:901px)', () => {
        const STEP = 2, N = imgs.length;                    // each stage = 2 timeline units
        gsap.set($$('.si img'), { scale: 1.2 });
        gsap.set(txt, { opacity: 0, y: 40 }); gsap.set(txt[0], { opacity: 1, y: 0 });
        const tl = gsap.timeline({
            defaults: { ease: 'none' }, scrollTrigger: {
                trigger: '.pin', start: 'top top', end: '+=300%', pin: true, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true
            }
        });
        imgs.forEach((im, i) => {
            const t = i * STEP;
            tl.to($('img', im), { scale: 1, duration: STEP }, t);            // slow zoom over the whole stage
            if (i < N - 1) {
                const n = t + STEP - .5;                                       // hand-over to the next stage
                tl.to(txt[i], { opacity: 0, y: -40, duration: .4 }, n)
                    .fromTo(imgs[i + 1], { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: .5, immediateRender: true }, n)
                    .fromTo(txt[i + 1], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .4, immediateRender: true }, n + .3);
            }
        });
        tl.to('.prog i', { scaleX: 1, duration: STEP * N }, 0);              // bar fills over the full pin
    });
    mm.add('(max-width:900px)', () => { gsap.set(imgs, { opacity: 0 }); gsap.set(imgs[0], { opacity: 1 }); txt.forEach((t, i) => ScrollTrigger.create({ trigger: t, start: 'top 60%', end: 'bottom 60%', onToggle: s => s.isActive && gsap.to(imgs, { opacity: (k) => k === i ? 1 : 0, duration: .6 }) })) });
    // story→menu: cream to espresso
    gsap.fromTo('#menu', { backgroundColor: '#F3E8D6', color: '#120D0A' }, { backgroundColor: '#120D0A', color: '#F3E8D6', ease: 'none', scrollTrigger: { trigger: '#menu', start: 'top bottom', end: 'top 35%', scrub: true } });
    gsap.from('.menu .head>*', { y: 50, opacity: 0, stagger: .1, scrollTrigger: { trigger: '.menu .head', start: 'top 85%' } });
    // brand
    gsap.to('.bimg img', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.bimg', start: 'top bottom', end: 'bottom top', scrub: true } });
    $$('.btxt li').forEach(li => ScrollTrigger.create({ trigger: li, start: 'top 88%', once: true, onEnter: () => { li.classList.add('in'); gsap.from(li, { y: 30, opacity: 0, duration: .8 }) } }));
    // featured glass
    const L = [['.l1', -14], ['.l2', 0], ['.l3', 14], ['.l4', 30]];
    gsap.to('#glass', { scale: 1.12, rotation: -4, ease: 'none', scrollTrigger: { trigger: '.feat', start: 'top bottom', end: 'bottom top', scrub: true } });
    $('.feat').addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5; gsap.to('#glass', { rotationY: x * 30, rotationX: -y * 20, duration: .6 }); L.forEach(([s, d]) => gsap.to(s, { x: x * d, y: y * d, duration: .6 })) });
    // final CTA
    gsap.fromTo('#cup2', { scale: .5, opacity: .2, y: 80, rotation: -15 }, { scale: 1, opacity: 1, y: 0, rotation: 0, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top 90%', end: 'center 60%', scrub: true } });
    gsap.from('.cta h2', { y: 60, opacity: 0, scrollTrigger: { trigger: '.cta h2', start: 'top 90%' } });
    addEventListener('load', () => ScrollTrigger.refresh());
})();
