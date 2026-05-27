/* ============================================================
   IMPERIA · Confirmation — render the last placed order
   ============================================================ */

(() => {
  'use strict';

  const fmt = (n) => '€ ' + Math.round(n);

  const optWords = {
    size:   { petite: 'Petite', maison: 'Maison', atelier: 'Atelier' },
    vessel: { none: 'no vessel', glass: 'glass cylinder', ceramic: 'ceramic urn' },
  };

  const describeLine = (l) => {
    const parts = [];
    if (l.size)   parts.push(optWords.size[l.size] || l.size);
    if (l.vessel) parts.push(optWords.vessel[l.vessel] || l.vessel);
    if (l.qty > 1) parts.push('× ' + l.qty);
    return parts.join(' · ');
  };

  const el = (tag, attrs, ...children) => {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class')      node.className = v;
        else if (k === 'text')  node.textContent = v;
        else                    node.setAttribute(k, v);
      }
    }
    for (const c of children) {
      if (c == null || c === false) continue;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return node;
  };

  const init = () => {
    let order = null;
    try {
      order = JSON.parse(sessionStorage.getItem('imperia.lastOrder') || 'null');
    } catch (_) {}

    if (!order) {
      const orderNoEl = document.getElementById('orderNo');
      if (orderNoEl) orderNoEl.textContent = '—';
      const body = document.getElementById('thanksBody');
      if (body) {
        body.textContent = 'It looks like this page was opened directly, without an order on file. ' +
          'If you placed an order, please check your inbox — we have already sent the confirmation.';
      }
      return;
    }

    const orderNoEl = document.getElementById('orderNo');
    if (orderNoEl) orderNoEl.textContent = order.orderNo;

    const recap = document.getElementById('thanksRecap');
    const list  = document.getElementById('thanksRecapList');
    const total = document.getElementById('thanksRecapTotal');

    if (recap && list && total && order.items && order.items.length) {
      recap.hidden = false;

      list.replaceChildren(
        ...order.items.map((l) => {
          const meta = describeLine(l);
          const left = el('div', null,
            el('span', { text: l.name }),
            meta ? el('span', { class: 'meta', text: meta }) : null,
          );
          const right = el('span', { text: fmt(l.unitPrice * l.qty) });
          return el('div', { class: 'thanks-recap-row' }, left, right);
        })
      );

      const totalLabel = el('span', null, el('em', { text: 'Total paid' }));
      total.replaceChildren(
        totalLabel,
        el('span', { text: fmt(order.total) }),
      );
    }

    const body = document.getElementById('thanksBody');
    if (body && order.details && order.details.firstName) {
      const firstName = order.details.firstName;
      body.textContent =
        `Thank you, ${firstName}. A confirmation has been sent to ${order.details.email}. ` +
        `We'll hand-tie the composition in the studio and our cyclists will deliver it ` +
        `in the window you chose. Should anything change between now and then, write to ` +
        `atelier@imperia.flowers and we will see it within the hour.`;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
