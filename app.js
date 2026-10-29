/* ============================================================================
 *  Sai sije — logika stránky / 页面逻辑
 *  1) vykreslí cenník a kontakty z menu.js
 *  2) vygeneruje QR kód na aktuálnu adresu
 *  3) režim úprav: ?edit=1  ->  meniť ceny, pridať položky, exportovať menu.js
 * ========================================================================== */
(function () {
  'use strict';

  var DATA = window.SAI_SIJE || {};
  var STORE_KEY = 'sai-sije:menu:v1';
  var TEL = 'tel:' + (DATA.phoneHref || '+421903143758');
  var WA = 'https://wa.me/' + (DATA.whatsapp || '421903143758');

  /* ── drobné pomocníky ─────────────────────────────────────────────────── */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function readStore() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function writeStore(value) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }

  /* ── textové väzby (telefón, adresa, hodiny…) ─────────────────────────── */
  function bindBasics() {
    var map = {
      tagline: DATA.tagline,
      hours: DATA.hours,
      address: DATA.address,
      phone: DATA.phone,
      note: DATA.note,
      lead: DATA.lead
    };
    Object.keys(map).forEach(function (key) {
      if (!map[key]) return;
      var nodes = document.querySelectorAll('[data-bind="' + key + '"]');
      for (var i = 0; i < nodes.length; i++) nodes[i].textContent = map[key];
    });

    var telNodes = document.querySelectorAll('[data-bind-href="tel"]');
    for (var t = 0; t < telNodes.length; t++) telNodes[t].setAttribute('href', TEL);
    var waNodes = document.querySelectorAll('[data-bind-href="wa"]');
    for (var w = 0; w < waNodes.length; w++) waNodes[w].setAttribute('href', WA);

    var y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());

    if (DATA.name) document.title = DATA.name + ' — ' + (DATA.tagline || '') + ' | ' + (DATA.address || '');
  }

  /* ── cenník ───────────────────────────────────────────────────────────── */
  function renderMenu() {
    var root = document.getElementById('menu-root');
    if (!root) return;
    root.innerHTML = '';

    (DATA.categories || []).forEach(function (cat, ci) {
      var box = el('article', 'menu__cat');
      box.setAttribute('data-cat', String(ci));

      var head = el('div', 'menu__cathead');
      var title = el('h3', 'menu__title', cat.title);
      title.setAttribute('data-field', 'title');
      head.appendChild(title);
      if (cat.note) head.appendChild(el('p', 'menu__note', cat.note));
      box.appendChild(head);

      var list = el('ul', 'menu__list');
      (cat.items || []).forEach(function (item, ii) {
        list.appendChild(makeRow(item, ci, ii));
      });
      box.appendChild(list);

      var add = el('button', 'additem', '+ Pridať položku');
      add.type = 'button';
      add.addEventListener('click', function () {
        var item = { name: 'Nová položka', price: 'od 0 €' };
        DATA.categories[ci].items.push(item);
        var row = makeRow(item, ci, DATA.categories[ci].items.length - 1);
        list.appendChild(row);
        var nameEl = row.querySelector('.menu__name');
        if (nameEl) { nameEl.focus(); document.execCommand && document.execCommand('selectAll', false, null); }
      });
      box.appendChild(add);

      root.appendChild(box);
    });
  }

  function makeRow(item, ci, ii) {
    var row = el('li', 'menu__item');
    row.setAttribute('data-ci', String(ci));
    row.setAttribute('data-ii', String(ii));

    var name = el('span', 'menu__name', item.name);
    name.setAttribute('data-field', 'name');
    if (document.body.classList.contains('editing')) name.setAttribute('contenteditable', 'true');

    var price = el('span', 'menu__price', item.price);
    price.setAttribute('data-field', 'price');
    if (document.body.classList.contains('editing')) price.setAttribute('contenteditable', 'true');

    row.appendChild(name);
    row.appendChild(el('span', 'menu__dots'));
    row.appendChild(price);
    return row;
  }

  /* ── sociálne siete ───────────────────────────────────────────────────── */
  function renderSocial() {
    var root = document.getElementById('social-root');
    if (!root) return;
    root.innerHTML = '';
    (DATA.social || []).forEach(function (s) {
      if (!s || !s.url) return;
      var a = el('a', null, s.label);
      a.href = s.url;
      a.target = '_blank';
      a.rel = 'noopener';
      root.appendChild(a);
    });
  }

  /* ── QR kód ───────────────────────────────────────────────────────────── */
  function renderQr() {
    var root = document.getElementById('qr-root');
    if (!root || typeof qrcode !== 'function') return;
    var url = location.href.split('?')[0].split('#')[0];
    try {
      var qr = qrcode(0, 'M');
      qr.addData(url);
      qr.make();
      root.innerHTML = qr.createSvgTag({ cellSize: 5, margin: 0, scalable: true });
    } catch (e) {
      root.textContent = '';
      root.setAttribute('title', 'QR sa nepodarilo vygenerovať');
    }
  }

  /* ── režim úprav ──────────────────────────────────────────────────────── */
  function collectFromDom() {
    var out = [];
    var cats = document.querySelectorAll('#menu-root .menu__cat');
    for (var i = 0; i < cats.length; i++) {
      var box = cats[i];
      var titleEl = box.querySelector('[data-field="title"]');
      var noteEl = box.querySelector('.menu__note');
      var items = [];
      var rows = box.querySelectorAll('.menu__item');
      for (var r = 0; r < rows.length; r++) {
        var n = rows[r].querySelector('[data-field="name"]');
        var p = rows[r].querySelector('[data-field="price"]');
        items.push({
          name: (n ? n.textContent : '').trim(),
          price: (p ? p.textContent : '').trim()
        });
      }
      out.push({
        title: (titleEl ? titleEl.textContent : '').trim(),
        note: (noteEl ? noteEl.textContent : '').trim(),
        items: items
      });
    }
    return out;
  }

  function enableEditMode() {
    document.body.classList.add('editing');

    var editable = document.querySelectorAll('#menu-root [data-field="name"], #menu-root [data-field="price"], #menu-root [data-field="title"]');
    for (var i = 0; i < editable.length; i++) editable[i].setAttribute('contenteditable', 'true');

    var bar = el('div', 'editbar');
    var label = el('span', null, 'Režim úprav');
    var save = el('button', null, 'Uložiť');
    var exportBtn = el('button', null, 'Stiahnuť menu.js');
    var exit = el('button', null, 'Zavrieť');

    save.type = exportBtn.type = exit.type = 'button';

    save.addEventListener('click', function () {
      DATA.categories = collectFromDom();
      var ok = writeStore({ categories: DATA.categories });
      save.textContent = ok ? 'Uložené ✓' : 'Nepodarilo sa';
      setTimeout(function () { save.textContent = 'Uložiť'; }, 1800);
    });

    exportBtn.addEventListener('click', function () {
      DATA.categories = collectFromDom();
      var copy = {};
      Object.keys(DATA).forEach(function (k) { copy[k] = DATA[k]; });
      copy.categories = DATA.categories;
      var text = '/* Vygenerované režimom úprav — nahraďte týmto súborom menu.js */\n'
        + 'window.SAI_SIJE = ' + JSON.stringify(copy, null, 2) + ';\n';
      var blob = new Blob([text], { type: 'text/javascript;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'menu.js';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    });

    exit.addEventListener('click', function () {
      var url = location.href.split('?')[0];
      location.href = url;
    });

    bar.appendChild(label);
    bar.appendChild(save);
    bar.appendChild(exportBtn);
    bar.appendChild(exit);
    document.body.appendChild(bar);
  }

  /* ── štart ────────────────────────────────────────────────────────────── */
  function boot() {
    var stored = readStore();
    if (stored && stored.categories && stored.categories.length) {
      DATA.categories = stored.categories;
    }

    bindBasics();
    renderMenu();
    renderSocial();
    renderQr();

    if (/[?&]edit=1/.test(location.search) || location.hash === '#edit') {
      enableEditMode();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
