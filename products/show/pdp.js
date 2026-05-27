/* ============================================================
   IMPERIA · Product Display Page — render & interaction
   ============================================================ */

(() => {
  'use strict';

  const PRODUCTS = {
    'aurelia': {
      num: '01', name: 'Aurelia', basePrice: 86, tag: 'New',
      latin: 'Paeonia · Rosa centifolia · Astilbe',
      notes: 'Soft · romantic · pastel · gilded morning light',
      image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1600&q=80',
      caption: '"Aurelia, photographed in the studio one Thursday in May."',
      description: "A soft, opulent composition of garden peonies and old-fashioned roses, set against the wispy plumes of astilbe. Aurelia is the gentlest of our spring pieces — the bouquet you bring to a long Sunday lunch, or send to someone who has been quietly tired.",
      includes: [
        "Eight stems of Paeonia 'Sarah Bernhardt'",
        "Five stems of Rosa centifolia 'Garance'",
        'Twelve stems of Astilbe arendsii, ivory',
        'A hand-marbled silk wrap, sand-coloured ribbon, and a hand-written care card',
      ],
      care: "Trim two centimetres from each stem at a forty-five-degree angle. Place in cool, clean water with the sachet of flower food included in the wrap. Change the water every two days. Display away from direct sunlight and any ripening fruit (ethylene gas shortens the life of peonies in particular).",
      longevity: 'five to seven days at room temperature with daily water changes.',
      delivery: 'Hand-delivered the same day across Berlin for orders placed before fourteen-hundred. Next-morning by refrigerated courier in Brandenburg and Potsdam. Imperia does not ship cut flowers beyond Germany — we send only to addresses we can deliver to before the peonies open.',
    },

    'vesper': {
      num: '02', name: 'Vesper', basePrice: 72,
      latin: "Dahlia 'Karma Choc' · Scabiosa · Hellebore",
      notes: 'Moody · burgundy · twilight · a little dramatic',
      image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1600&q=80',
      caption: '"Vesper sits well on dark wood and reads beautifully under candlelight."',
      description: "A composition for low light. Dahlia 'Karma Choc' in deep burgundy is anchored by burgundy scabiosa, hellebore in their late, papery stage, and trailing greens of clematis. Vesper is what we propose for autumn weddings, for tables of long conversations, and for sending flowers to writers.",
      includes: [
        "Six stems of Dahlia 'Karma Choc'",
        'Ten stems of Scabiosa atropurpurea',
        'Hellebore foetidus, twelve sprigs',
        'Trailing clematis vines and a sand-coloured silk wrap',
      ],
      care: 'Cut stems with a sharp blade at an angle and place into cool water immediately. Dahlias are thirsty: top up the vase daily. Hellebore lasts longer if you submerge the stem briefly in boiling water for ten seconds before arranging.',
      longevity: 'four to six days at room temperature.',
      delivery: 'Same-day across Berlin for orders before fourteen-hundred. Next-day by refrigerated courier in Brandenburg and Potsdam.',
    },

    'solenne': {
      num: '03', name: 'Solenne', basePrice: 94, tag: 'Bridal',
      latin: 'Paeonia lactiflora · Lisianthus · Eucalyptus',
      notes: 'White · silk · weddings · early summer',
      image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1600&q=80',
      caption: '"Solenne, the morning of a wedding in Charlottenburg."',
      description: 'Our most-requested bridal piece. Paeonia lactiflora in chalky white, lisianthus, and the long whip of eucalyptus parvifolia. Hand-tied with a knot of natural silk in raw oyster. Solenne is the composition we keep returning to, for weddings, christenings, and quieter ceremonial moments.',
      includes: [
        'Six stems of Paeonia lactiflora, ivory',
        'Twelve stems of Lisianthus, white-with-cream',
        'Eucalyptus parvifolia, four long branches',
        'Hand-tied with raw oyster silk and a marbled card',
      ],
      care: 'Trim stems at an angle. Cool water, flower food, change every other day. Peonies open more quickly in warmth — keep cool if you wish them to last toward the day of the event.',
      longevity: 'six to eight days. Peonies will open fully across the first three days.',
      delivery: 'For weddings, hand-delivered in person by a member of the studio. Otherwise same-day across Berlin and next-day in Brandenburg.',
    },

    'eden-wild': {
      num: '04', name: 'Eden Wild', basePrice: 48,
      latin: 'Achillea · Cosmos · Bupleurum · Phlox',
      notes: 'Garden · airy · informal · just-picked',
      image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1600&q=80',
      caption: '"Eden Wild — the composition we make for ourselves on a Friday."',
      description: "An informal, garden-y handful — achillea in soft yellow, cosmos in shell-pink and white, the loose froth of bupleurum, and clouds of summer phlox. Eden Wild is the bouquet to send to someone moving into a new flat, or to bring to a dinner where someone is cooking. Gentle, unfussy, slightly wild around the edges.",
      includes: [
        'Achillea filipendulina, six stems',
        'Cosmos bipinnatus in shell-pink and ivory, ten stems',
        'Bupleurum, six sprigs',
        'Phlox paniculata, three stems',
        'Hand-tied with a length of brown paper twine',
      ],
      care: 'Trim stems daily. Phlox in particular drinks quickly — keep the vase topped up. Pluck spent cosmos blooms gently to encourage the buds to open.',
      longevity: 'five to seven days. Cosmos and phlox continue to open across the week.',
      delivery: 'Same-day across Berlin. The piece travels well — also available for next-day shipment within Germany via our cold-chain partners.',
    },

    'camellia-noir': {
      num: '05', name: 'Camellia Noir', basePrice: 98, tag: 'Limited',
      latin: "Camellia japonica · Anemone 'Mona Lisa' · Ivy",
      notes: 'Dramatic · gothic · waxy leaves · for serious rooms',
      image: 'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?auto=format&fit=crop&w=1600&q=80',
      caption: '"Camellia Noir, very nearly the last of the season."',
      description: 'A small, intense composition for very particular interiors. Camellia japonica in deep wine-red with their waxy dark leaves, anchored by black-throated anemones and a tangle of trailing ivy. Camellia Noir is for galleries, for opera-going friends, for the kind of person who reads Bachelard.',
      includes: [
        'Camellia japonica, three branches, in deep wine',
        "Anemone 'Mona Lisa' (Bordeaux), eight stems",
        'Hedera helix, two trailing vines',
        'Hand-tied with black-edged ribbon',
      ],
      care: 'Camellia leaves last longest with frequent water changes and a cool position. Mist the foliage every other day. Anemones drink heavily — top up daily.',
      longevity: 'four to six days. The anemones open and close with the light, which is half the pleasure.',
      delivery: 'Limited edition — only six made each fortnight. Same-day in Berlin only.',
    },

    'provence': {
      num: '06', name: 'Provence', basePrice: 44,
      latin: 'Lavandula · Rosmarinus · Salvia · Limonium',
      notes: 'Herbal · sun-bleached · scented · the south of France',
      image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1600&q=80',
      caption: '"Provence smells of the south for two whole weeks."',
      description: "Our most fragrant composition. Lavender, rosemary, garden sage, and bleached limonium, bound with rough twine. Provence dries beautifully and keeps its scent for months — many of our customers buy it precisely to let it dry on the mantelpiece and then move it to the linen cupboard. Restful, herbal, somewhere between a bouquet and a tisane.",
      includes: [
        'Lavandula angustifolia, twenty stems',
        'Rosmarinus officinalis, ten sprigs',
        'Salvia officinalis, six leaves',
        'Limonium, bleached, fifteen stems',
        'Rough natural twine',
      ],
      care: "Either treat as fresh — cool water, change every two days — or hang upside-down in a dark corner to dry. Both work. The herbs continue to perfume the room either way.",
      longevity: 'fresh: ten to fourteen days. Dried: indefinitely. Many customers keep theirs for half a year.',
      delivery: 'Same-day in Berlin, next-day across Germany, and available for shipment within the EU (it travels well dry).',
    },

    'marguerite': {
      num: '07', name: 'Marguerite', basePrice: 52, tag: 'Subscription',
      latin: 'Leucanthemum · Matricaria · Avena',
      notes: 'Pastoral · daisy-light · meadow · summery',
      image: 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=1600&q=80',
      caption: '"Marguerite — what we send on Mondays to break the week."',
      description: 'A gentle, pastoral composition for the weekly subscription — leucanthemum daisies, chamomile, and quaking oat-grass, tied with a length of pale linen. Marguerite is the bouquet we send to clients who do not want anything dramatic; the visual equivalent of a window left open on a meadow.',
      includes: [
        'Leucanthemum vulgare, twelve stems',
        'Matricaria chamomilla, ten stems',
        'Avena sativa (ornamental oat), eight sprays',
        'Pale linen ribbon',
      ],
      care: 'Trim stems daily; daisies drink quickly. Position out of direct sun. The oat-grass dries beautifully — keep it after the daisies are spent.',
      longevity: 'five to seven days. The grasses persist for weeks beyond.',
      delivery: 'Weekly subscription pieces are delivered on Friday afternoons across Berlin, by our cyclists.',
    },

    'hortensia': {
      num: '08', name: 'Hortensia', basePrice: 68,
      latin: 'Hydrangea macrophylla · Delphinium',
      notes: 'Bluest of blues · cool · oceanic · still',
      image: 'https://images.unsplash.com/photo-1465146633011-14f8e0781093?auto=format&fit=crop&w=1600&q=80',
      caption: '"Hortensia, photographed against bare plaster."',
      description: 'A study in blue. French hydrangea in cornflower and slate, with the dark spires of delphinium and the silvery puff of silver dollar eucalyptus. Hortensia is heavy in the hand and quite still in the vase — it suits libraries, north-facing rooms, and old apartments with high ceilings.',
      includes: [
        'Hydrangea macrophylla, four heads in mixed blue',
        "Delphinium 'Pacific Giant', six spires",
        'Eucalyptus cinerea, three branches',
      ],
      care: 'Hydrangeas drink through their petals as much as their stems. Mist them daily with cool water if they begin to look limp; they revive astonishingly. Keep cool, keep watered, keep out of strong sun.',
      longevity: 'seven to ten days. Hydrangea heads can then be hung to dry and kept indefinitely.',
      delivery: 'Same-day in Berlin and next-day across Germany.',
    },

    'boheme': {
      num: '09', name: 'Bohème', basePrice: 58,
      latin: 'Cosmos · Zinnia · Nigella · Daucus',
      notes: 'Eclectic · joyous · mixed · slightly maximalist',
      image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1600&q=80',
      caption: '"Bohème is our happiest piece. It cannot be made with restraint."',
      description: 'A loose, joyful gathering of cosmos, zinnia in apricot and coral, the blue ink-drops of nigella, and ammi visnaga in lace-white. Bohème is the bouquet for birthdays, for new flats, for the people who like a little chaos arranged carefully. It is also our florists\' personal favourite.',
      includes: [
        'Cosmos bipinnatus, eight stems',
        "Zinnia elegans 'Queeny Lime Orange', six stems",
        'Nigella damascena, ten sprigs',
        'Daucus carota, three umbels',
        'Hand-tied with marigold ribbon',
      ],
      care: 'Cut zinnias bleed milky sap — rinse stem ends before placing in water. Trim and refresh every two days.',
      longevity: 'five to seven days. The nigella seed-heads dry beautifully and may be kept.',
      delivery: 'Same-day in Berlin, next-day across Germany.',
    },

    'garance': {
      num: '10', name: 'Garance', basePrice: 142, tag: 'Limited',
      latin: "Rosa 'Garance' · Astrantia · Smilax",
      notes: 'Bridal · cascading · old-master red',
      image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&w=1600&q=80',
      caption: '"Garance — for a bride in November."',
      description: "Our largest bridal piece. A cascading composition of David Austin's 'Garance' rose in dusty terracotta, paired with astrantia, smilax, and just enough trailing greenery to read as a Rubens still-life. Garance is reserved for autumn brides; we make no more than four a season.",
      includes: [
        "Rosa 'Garance', twenty stems",
        'Astrantia major, twelve stems',
        'Smilax aspera, two trailing vines',
        'Hand-tied with iron-grey silk',
      ],
      care: 'Roses last longest with the stems re-cut underwater daily. Mist the foliage if the room is warm. Refrigerate the night before, if possible.',
      longevity: 'five to seven days, with proper care.',
      delivery: 'For weddings only. Hand-delivered in person by a member of the studio, by arrangement.',
    },

    'ophelie': {
      num: '11', name: 'Ophélie', basePrice: 76,
      latin: 'Anemone · Ranunculus · Clematis',
      notes: 'Watery · pale · early spring · breathy',
      image: 'https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?auto=format&fit=crop&w=1600&q=80',
      caption: '"Ophélie reads best in low, watery light."',
      description: 'A pale, watery composition for early spring — anemones in chalky white with their black hearts, ranunculus in shell-pink and butter, and trailing clematis vines that lend the piece its sense of looking-just-after-rain. Named, naturally, for the Millais. Best displayed on a side-table with one tall candle nearby.',
      includes: [
        "Anemone coronaria 'The Bride', eight stems",
        'Ranunculus asiaticus, twelve stems',
        'Clematis vines, two trailing',
        'Hand-tied with mossy silk',
      ],
      care: 'Anemones and ranunculus both drink heavily — keep the vase full. Anemones close at night and open with morning light; this is part of the bouquet\'s rhythm.',
      longevity: 'four to six days.',
      delivery: 'Same-day in Berlin and next-day across Germany.',
    },

    'la-petite': {
      num: '12', name: 'La Petite', basePrice: 32, tag: 'Subscription',
      latin: "Florist's choice · in season",
      notes: 'Small · weekly · florist\'s caprice',
      image: 'https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=1600&q=80',
      caption: '"La Petite, last Friday in May."',
      description: "Our smallest weekly piece — composed at the dawn market each Friday from whatever is most lovely on that particular day. La Petite is unpredictable by design: it might be all dahlias one week, all anemones the next. We send a small printed card naming every stem inside. Best for desks, kitchens, and bedside tables.",
      includes: [
        'Eight to twelve stems, chosen each Friday by the florist on duty',
        'A small printed card listing every name',
        'Marbled paper wrap, brown twine',
      ],
      care: 'Each piece comes with brief care notes specific to its contents.',
      longevity: 'typically five to seven days, depending on the week.',
      delivery: 'Subscription only. Delivered Friday afternoons across Berlin.',
    },
  };

  /* ----- Helpers ----- */
  const SIZE_LABELS = {
    petite:  { copy: '~20 stems · 28 × 32 cm',     mult: 1   },
    maison:  { copy: '~32 stems · 40 × 48 cm',     mult: 1.5 },
    atelier: { copy: '~50 stems · 56 × 72 cm',     mult: 2.4 },
  };

  const slug = (new URLSearchParams(window.location.search)).get('p') || 'aurelia';
  const p = PRODUCTS[slug] || PRODUCTS['aurelia'];

  const $ = (id) => document.getElementById(id);

  /* ----- State ----- */
  const state = { size: 'petite', vessel: 'none', vesselAdd: 0, qty: 1 };

  const calcTotal = () => {
    const sub = p.basePrice * SIZE_LABELS[state.size].mult + state.vesselAdd;
    return Math.round(sub * state.qty);
  };

  const fmtPrice = (n) => '€ ' + n;

  /* ----- Render static content ----- */
  document.title = `IMPERIA — ${p.name}`;

  $('crumb').textContent = p.name;
  $('heroNum').textContent = '№ ' + p.num;
  $('heroImg').src = p.image;
  $('heroImg').alt = `${p.name} — ${p.latin}`;
  $('heroCaption').textContent = p.caption;

  if (p.tag) {
    $('heroTag').textContent = p.tag;
    $('heroTag').hidden = false;
  }

  $('title').textContent = p.name;
  $('latin').textContent = p.latin;
  $('notes').textContent = p.notes;
  $('description').textContent = p.description;
  $('price').textContent = fmtPrice(p.basePrice);
  $('care').textContent = p.care;
  $('longevity').textContent = ' ' + p.longevity;
  $('delivery').textContent = p.delivery;

  const ul = $('includes');
  p.includes.forEach((line) => {
    const li = document.createElement('li');
    li.textContent = line;
    ul.appendChild(li);
  });

  /* ----- Build related products (3 random others) ----- */
  const others = Object.entries(PRODUCTS).filter(([k]) => k !== slug);
  others.sort(() => Math.random() - 0.5);
  const related = others.slice(0, 3);
  const relGrid = $('related');
  related.forEach(([k, r]) => {
    const a = document.createElement('a');
    a.className = 'product';
    a.href = '/products/show/?p=' + k;

    const frame = document.createElement('div');
    frame.className = 'product-frame';

    const num = document.createElement('span');
    num.className = 'product-num';
    num.textContent = '№ ' + r.num;
    frame.appendChild(num);

    if (r.tag) {
      const tag = document.createElement('span');
      tag.className = 'product-tag';
      tag.textContent = r.tag;
      frame.appendChild(tag);
    }

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = r.image;
    img.alt = r.name;
    frame.appendChild(img);

    const info = document.createElement('div');
    info.className = 'product-info';

    const name = document.createElement('span');
    name.className = 'product-name';
    name.textContent = r.name;

    const price = document.createElement('span');
    price.className = 'product-price';
    price.textContent = fmtPrice(r.basePrice);

    const latin = document.createElement('span');
    latin.className = 'product-latin';
    latin.textContent = r.latin;

    info.append(name, price, latin);
    a.append(frame, info);
    relGrid.appendChild(a);
  });

  /* ----- Option buttons ----- */
  const optionGroups = ['sizeOpts', 'vesselOpts'];
  optionGroups.forEach((gid) => {
    const group = $(gid);
    group.querySelectorAll('.pdp-opt').forEach((btn) => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.pdp-opt').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const key = btn.dataset.key;
        const val = btn.dataset.val;
        if (key === 'size') {
          state.size = val;
          $('sizeNote').textContent = SIZE_LABELS[val].copy;
        } else if (key === 'vessel') {
          state.vessel = val;
          state.vesselAdd = parseFloat(btn.dataset.add || '0');
        }
        updatePrice();
      });
    });
  });

  /* ----- Quantity ----- */
  document.querySelectorAll('.pdp-qty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.dataset.step, 10);
      state.qty = Math.max(1, Math.min(9, state.qty + step));
      $('qty').textContent = state.qty;
      updatePrice();
    });
  });

  const updatePrice = () => {
    $('ctaPrice').textContent = fmtPrice(calcTotal());
  };
  updatePrice();

  /* ----- Add to bouquet — toast confirmation ----- */
  const toast = $('toast');
  const toastMsg = $('toastMsg');
  let toastTimer = null;

  $('addBtn').addEventListener('click', () => {
    const vesselWord = state.vessel === 'none' ? 'no vessel'
                     : state.vessel === 'glass' ? 'glass cylinder'
                     : 'ceramic urn';
    const sizeWord = state.size[0].toUpperCase() + state.size.slice(1);
    const unitPrice = Math.round(p.basePrice * SIZE_LABELS[state.size].mult + state.vesselAdd);
    const note = (document.getElementById('noteText')?.value || '').trim();

    if (window.imperiaCart) {
      window.imperiaCart.add({
        slug,
        name: p.name,
        image: p.image,
        size: state.size,
        vessel: state.vessel,
        note,
        unitPrice,
        qty: state.qty,
      });
    }

    toastMsg.textContent = `${p.name} · ${sizeWord}, ${vesselWord} · ${fmtPrice(calcTotal())}`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);

    if (window.imperiaCart) {
      setTimeout(() => window.imperiaCart.open(), 380);
    }
  });
})();
