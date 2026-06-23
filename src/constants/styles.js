const FONT = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');`;

export const css = `
  ${FONT}

  :root {
    --bg: #fcf8f4;
    --surface: #ffffff;
    --surface-alt: #f5ede4;
    --surface-dark: #2e190f;
    --primary: #7d4a33;
    --primary-dark: #4f2d1d;
    --accent: #d96d56;
    --accent-soft: #f2c8bc;
    --gold: #cc9b44;
    --text: #221711;
    --muted: #7d6656;
    --border: rgba(85, 52, 33, 0.12);
    --shadow: 0 18px 50px rgba(52, 28, 16, 0.08);
    --radius: 18px;
  }

  * { box-sizing: border-box; }
  html { background: var(--bg); }
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    color: var(--text);
    background:
      radial-gradient(circle at top, rgba(217, 109, 86, 0.08), transparent 28%),
      linear-gradient(180deg, #fffaf6 0%, var(--bg) 38%, #f7efe6 100%);
  }
  button, input, textarea, select { font: inherit; }
  img { display: block; max-width: 100%; }

  .app-shell { min-height: 100vh; }
  .page {
    max-width: 1240px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }
  .page-narrow {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }
  .eyebrow {
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 14px;
  }
  .eyebrow.light { color: rgba(255,255,255,0.78); }
  .page-title, .section-heading h2, .success-screen h1, .about-hero h1, .hero h1 {
    font-family: 'Playfair Display', serif;
    margin: 0;
    color: var(--text);
    line-height: 1.08;
  }
  .page-title { font-size: clamp(32px, 4vw, 46px); }
  .page-subtitle {
    margin: 14px 0 0;
    color: var(--muted);
    font-size: 16px;
    line-height: 1.65;
    max-width: 720px;
  }
  .section-heading {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 20px;
    margin-bottom: 24px;
  }
  .section-heading h2 { font-size: clamp(26px, 3vw, 38px); }
  .section-heading p {
    margin: 8px 0 0;
    color: var(--muted);
    max-width: 640px;
    line-height: 1.6;
  }
  .homepage-section { margin-bottom: 56px; }

  .btn-primary,
  .btn-secondary,
  .nav-icon-btn,
  .filter-chip,
  .toggle-chip,
  .favorite-btn,
  .add-cart-btn,
  .checkout-btn,
  .feedback-btn,
  .cookie-banner-btn,
  .logout-btn,
  .qty-btn,
  .sidebar-item,
  .category-spotlight,
  .nav-logo,
  .inline-link {
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  }

  .btn-primary,
  .btn-secondary,
  .checkout-btn,
  .feedback-btn,
  .cookie-banner-btn,
  .auth-submit {
    border: none;
    border-radius: 14px;
    padding: 13px 18px;
    cursor: pointer;
    font-weight: 600;
  }
  .btn-primary,
  .checkout-btn,
  .feedback-btn,
  .auth-submit {
    background: var(--primary);
    color: #fff;
    box-shadow: 0 14px 30px rgba(125, 74, 51, 0.22);
  }
  .btn-primary:hover,
  .checkout-btn:hover,
  .feedback-btn:hover,
  .auth-submit:hover { background: var(--primary-dark); transform: translateY(-1px); }
  .btn-secondary {
    background: rgba(255,255,255,0.12);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.22);
  }
  .btn-secondary:hover { background: rgba(255,255,255,0.18); }
  .btn-primary.invert {
    background: #fff;
    color: var(--surface-dark);
    box-shadow: none;
  }

  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(12px);
    background: rgba(252, 248, 244, 0.88);
    border-bottom: 1px solid var(--border);
  }
  .nav-inner {
    max-width: 1240px;
    margin: 0 auto;
    padding: 14px 24px;
    display: flex;
    gap: 20px;
    align-items: center;
  }
  .nav-logo {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 700;
    color: var(--primary-dark);
  }
  .nav-logo span, .footer-logo span, .auth-logo span { color: var(--accent); }
  .nav-links {
    display: flex;
    gap: 6px;
    flex: 1;
  }
  .nav-btn,
  .nav-icon-btn,
  .filter-chip,
  .toggle-chip,
  .sidebar-item,
  .logout-btn {
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 14px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
  }
  .nav-btn:hover,
  .nav-btn.active,
  .nav-icon-btn:hover,
  .filter-chip:hover,
  .filter-chip.active,
  .toggle-chip:hover,
  .toggle-chip.active,
  .sidebar-item:hover,
  .sidebar-item.active {
    background: var(--surface);
    border-color: var(--border);
    color: var(--primary-dark);
  }
  .nav-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .nav-icon-btn {
    border-color: var(--border);
    background: rgba(255,255,255,0.45);
  }
  .nav-icon-btn.primary {
    background: var(--primary);
    color: #fff;
    border-color: transparent;
  }
  .cart-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--accent);
    color: white;
    font-size: 11px;
    font-weight: 700;
  }

  .hero {
    padding: 36px 24px 18px;
  }
  .hero-content {
    max-width: 1240px;
    margin: 0 auto;
    border-radius: 28px;
    background:
      linear-gradient(120deg, rgba(40, 20, 12, 0.96), rgba(97, 56, 37, 0.78)),
      url('https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1600&auto=format&fit=crop') center/cover;
    box-shadow: var(--shadow);
  }
  .hero-grid {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 22px;
    padding: 34px;
  }
  .hero-copy { color: white; align-self: center; }
  .hero-copy h1 {
    color: #fff;
    font-size: clamp(42px, 5.2vw, 72px);
    max-width: 640px;
  }
  .hero-copy p {
    margin: 18px 0 0;
    max-width: 580px;
    color: rgba(255,255,255,0.82);
    line-height: 1.7;
    font-size: 16px;
  }
  .hero-btns {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 26px;
  }
  .hero-stats {
    display: flex;
    gap: 18px;
    flex-wrap: wrap;
    margin-top: 28px;
  }
  .hero-stat {
    min-width: 140px;
    padding: 14px 16px;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 16px;
    background: rgba(255,255,255,0.06);
  }
  .hero-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    color: #fff;
  }
  .hero-stat-label {
    margin-top: 6px;
    font-size: 13px;
    color: rgba(255,255,255,0.72);
  }
  .hero-featured-card {
    position: relative;
    min-height: 520px;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 22px 50px rgba(0,0,0,0.22);
  }
  .hero-featured-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .hero-featured-overlay {
    position: absolute;
    inset: auto 0 0 0;
    padding: 26px;
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(19,10,7,0.86) 60%, rgba(19,10,7,0.98) 100%);
    color: #fff;
  }
  .hero-featured-overlay h2 {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: 34px;
  }
  .hero-featured-overlay p {
    color: rgba(255,255,255,0.78);
    line-height: 1.6;
    margin: 12px 0 20px;
  }
  .hero-featured-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .hero-featured-bottom strong {
    font-size: 24px;
    font-family: 'Playfair Display', serif;
  }

  .category-grid,
  .month-picks-grid,
  .about-grid,
  .overview-stats,
  .feature-strip,
  .footer-inner {
    display: grid;
    gap: 18px;
  }
  .category-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .month-picks-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .feature-strip { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .overview-stats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .footer-inner { grid-template-columns: 1.1fr 0.8fr 0.8fr; align-items: start; }

  .category-spotlight,
  .month-pick-card,
  .feature-strip-card,
  .overview-card,
  .about-card,
  .feedback-contact-card,
  .catalog-auth-note,
  .account-hero-card,
  .cart-panel,
  .profile-card,
  .order-card,
  .auth-card,
  .account-sidebar {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }

  .category-spotlight {
    text-align: left;
    padding: 22px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .category-spotlight span {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    color: var(--primary-dark);
  }
  .category-spotlight strong {
    color: var(--muted);
    font-size: 14px;
  }
  .category-spotlight:hover { transform: translateY(-2px); }

  .month-pick-card {
    overflow: hidden;
  }
  .month-pick-card img {
    width: 100%;
    aspect-ratio: 1.15 / 1;
    object-fit: cover;
  }
  .month-pick-body { padding: 18px; }
  .month-pick-body strong {
    display: block;
    font-size: 18px;
    margin-bottom: 8px;
    color: var(--primary-dark);
  }
  .month-pick-body p {
    margin: 0;
    color: var(--muted);
    line-height: 1.6;
    font-size: 14px;
  }
  .month-pick-footer {
    margin-top: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .month-pick-footer span {
    font-weight: 700;
    color: var(--primary-dark);
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
  }
  .product-card {
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
  }
  .product-card:hover { transform: translateY(-2px); }
  .product-media {
    position: relative;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    background: var(--surface-alt);
  }
  .product-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .product-flags {
    position: absolute;
    right: 12px;
    top: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: end;
  }
  .product-flag {
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,0.94);
    color: var(--primary-dark);
    font-size: 12px;
    font-weight: 700;
  }
  .product-flag.accent {
    background: var(--accent);
    color: white;
  }
  .product-flag.warm {
    background: var(--gold);
    color: white;
  }
  .favorite-btn {
    position: absolute;
    left: 12px;
    top: 12px;
    width: 40px;
    height: 40px;
    border-radius: 999px;
    border: none;
    background: rgba(255,255,255,0.92);
    color: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(26, 12, 7, 0.12);
  }
  .favorite-btn.active {
    background: var(--accent);
    color: white;
  }
  .product-body {
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
  }
  .product-category {
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 700;
  }
  .product-name {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    color: var(--primary-dark);
  }
  .product-desc {
    margin: 0;
    color: var(--muted);
    line-height: 1.6;
    font-size: 14px;
    flex: 1;
  }
  .product-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: var(--muted);
    font-size: 13px;
  }
  .product-footer {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 12px;
  }
  .product-pricing {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .product-pricing strong {
    font-size: 24px;
    font-family: 'Playfair Display', serif;
    color: var(--primary-dark);
  }
  .product-pricing span {
    color: var(--muted);
    text-decoration: line-through;
    font-size: 13px;
  }
  .add-cart-btn {
    border: none;
    border-radius: 12px;
    padding: 11px 14px;
    background: var(--primary);
    color: white;
    cursor: pointer;
    font-weight: 600;
    flex-shrink: 0;
  }
  .add-cart-btn.added { background: #59815d; }

  .feature-strip-card,
  .overview-card,
  .about-card {
    padding: 22px;
  }
  .feature-strip-card strong,
  .overview-card strong,
  .about-card strong {
    color: var(--primary-dark);
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    display: block;
  }
  .feature-strip-card p,
  .about-card p {
    margin: 10px 0 0;
    color: var(--muted);
    line-height: 1.6;
  }
  .overview-card span {
    display: block;
    margin-top: 8px;
    color: var(--muted);
  }

  .feedback-section {
    padding: 30px;
    border-radius: 28px;
    background: linear-gradient(180deg, #fffdfb, #f8f0e8);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
  }
  .feedback-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 22px;
    margin-bottom: 22px;
  }
  .feedback-header h2 {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4vw, 40px);
    color: var(--primary-dark);
  }
  .feedback-header p {
    margin: 12px 0 0;
    color: var(--muted);
    line-height: 1.65;
    max-width: 640px;
  }
  .feedback-contacts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    min-width: 340px;
  }
  .feedback-contact-card {
    padding: 16px;
  }
  .feedback-contact-card span {
    display: block;
    color: var(--muted);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .feedback-contact-card strong {
    display: block;
    margin-top: 6px;
    color: var(--primary-dark);
  }
  .feedback-form {
    max-width: 780px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .feedback-form-grid,
  .form-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .feedback-form input,
  .feedback-form textarea,
  .form-group input,
  .form-group textarea,
  .form-group select,
  .catalog-search,
  .catalog-sort {
    width: 100%;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: #fff;
    color: var(--text);
    padding: 13px 14px;
    outline: none;
  }
  .feedback-form textarea,
  .form-group textarea { min-height: 120px; resize: vertical; }
  .feedback-success {
    padding: 18px;
    border-radius: 16px;
    background: rgba(89, 129, 93, 0.12);
    color: #3b6f47;
    font-weight: 600;
  }
  .consent-check {
    display: flex;
    gap: 10px;
    align-items: start;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.5;
  }
  .consent-check input { margin-top: 4px; accent-color: var(--primary); }

  .catalog-hero,
  .account-overview {
    display: grid;
    gap: 18px;
    margin-bottom: 26px;
  }
  .catalog-hero {
    grid-template-columns: 1fr 320px;
    align-items: start;
    padding: 26px 28px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    box-shadow: var(--shadow);
  }
  .catalog-hero.compact { grid-template-columns: 1fr; }
  .catalog-toolbar {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 14px;
    margin-bottom: 14px;
  }
  .catalog-auth-note,
  .inline-alert {
    padding: 18px;
    color: var(--primary-dark);
  }
  .catalog-auth-note strong { display: block; margin-bottom: 8px; }
  .inline-alert {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    border-radius: 18px;
    background: #fff7ef;
    border: 1px solid rgba(204, 155, 68, 0.28);
    margin-bottom: 18px;
  }
  .filter-bar,
  .toggle-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }
  .filter-bar { margin-bottom: 12px; }
  .toggle-row { margin-bottom: 24px; }
  .filter-chip,
  .toggle-chip {
    background: rgba(255,255,255,0.7);
    border: 1px solid var(--border);
  }
  .catalog-meta {
    margin-left: auto;
    color: var(--muted);
    font-size: 14px;
  }
  .catalog-filters-panel {
    margin-bottom: 24px;
    padding: 22px;
    border-radius: 22px;
    background: rgba(255,255,255,0.72);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
  }
  .catalog-price-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr)) auto;
    gap: 14px;
    align-items: end;
    margin-bottom: 16px;
  }
  .inline-link {
    border: none;
    background: none;
    padding: 0;
    color: var(--primary);
    cursor: pointer;
    font-weight: 600;
  }

  .cart-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 22px;
    align-items: start;
  }
  .cart-panel,
  .cart-summary {
    padding: 22px;
  }
  .cart-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .cart-item {
    display: grid;
    grid-template-columns: 88px 1fr auto auto;
    gap: 16px;
    align-items: center;
    padding: 12px;
    border-radius: 16px;
    background: #faf5ef;
    border: 1px solid rgba(85, 52, 33, 0.08);
  }
  .cart-item-thumb {
    width: 88px;
    height: 88px;
    object-fit: cover;
    border-radius: 14px;
  }
  .cart-item-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .cart-item-info strong { color: var(--primary-dark); }
  .cart-item-info span { color: var(--muted); font-size: 14px; }
  .qty-ctrl {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 6px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: #fff;
  }
  .qty-btn {
    width: 30px;
    height: 30px;
    border-radius: 999px;
    border: none;
    background: var(--surface-alt);
    color: var(--primary-dark);
    cursor: pointer;
  }
  .qty-num { min-width: 20px; text-align: center; font-weight: 600; }
  .cart-item-price,
  .summary-row.total span:last-child {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: var(--primary-dark);
  }
  .cart-summary {
    position: sticky;
    top: 90px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: var(--shadow);
  }
  .cart-summary h3,
  .form-head h3,
  .profile-card h2 { margin: 0; font-family: 'Playfair Display', serif; color: var(--primary-dark); }
  .summary-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;
    color: var(--muted);
    font-size: 14px;
  }
  .summary-row.total {
    padding-top: 14px;
    border-top: 1px solid var(--border);
    margin-top: 16px;
    align-items: end;
  }
  .summary-note {
    margin-top: 14px;
    color: #3b6f47;
    font-size: 14px;
  }
  .order-form {
    margin-top: 18px;
    padding: 24px;
    border-radius: 20px;
    background: #fff;
    border: 1px solid var(--border);
  }
  .form-head p {
    margin: 8px 0 0;
    color: var(--muted);
    line-height: 1.6;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .form-group label {
    color: var(--muted);
    font-size: 14px;
    font-weight: 600;
  }

  .success-screen,
  .empty-state {
    padding: 40px;
    border-radius: 26px;
    background: var(--surface);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    text-align: center;
  }
  .success-pill {
    display: inline-block;
    margin-bottom: 14px;
    padding: 7px 12px;
    border-radius: 999px;
    background: rgba(89, 129, 93, 0.12);
    color: #3b6f47;
    font-size: 13px;
    font-weight: 700;
  }
  .success-screen p,
  .empty-state p {
    margin: 16px auto 0;
    max-width: 620px;
    color: var(--muted);
    line-height: 1.7;
  }
  .empty-state-icon {
    width: 56px;
    height: 56px;
    margin: 0 auto 16px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: var(--surface-alt);
    color: var(--primary-dark);
    font-size: 22px;
  }
  .empty-state h3 {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    color: var(--primary-dark);
  }
  .empty-state.small { padding: 22px; }

  .account-overview {
    grid-template-columns: 1.2fr 1fr;
    align-items: stretch;
  }
  .account-hero-card {
    display: flex;
    gap: 20px;
    padding: 24px;
    align-items: center;
  }
  .account-avatar {
    width: 64px;
    height: 64px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    font-family: 'Playfair Display', serif;
    background: var(--surface-alt);
    color: var(--primary-dark);
  }
  .account-avatar.large {
    width: 88px;
    height: 88px;
    font-size: 34px;
  }
  .account-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 22px;
    align-items: start;
  }
  .account-sidebar {
    padding: 16px;
    position: sticky;
    top: 90px;
  }
  .sidebar-menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .account-main {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .profile-card { padding: 24px; }
  .profile-actions {
    margin-top: 18px;
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
  }
  .profile-hint { color: var(--muted); font-size: 14px; }

  .order-card { padding: 20px 22px; }
  .order-header {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: start;
    margin-bottom: 16px;
  }
  .order-id {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    color: var(--primary-dark);
  }
  .order-date {
    color: var(--muted);
    font-size: 14px;
    margin-top: 4px;
  }
  .order-status {
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
  }
  .status-new { background: rgba(204, 155, 68, 0.14); color: #8e5f12; }
  .status-cooking { background: rgba(76, 127, 194, 0.12); color: #2f5f94; }
  .status-done { background: rgba(89, 129, 93, 0.12); color: #3b6f47; }
  .status-canceled { background: rgba(210, 76, 76, 0.12); color: #9b3939; }
  .order-items-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .order-item-row {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 10px 0;
    border-top: 1px solid rgba(85, 52, 33, 0.08);
  }
  .order-item-row:first-child { border-top: none; padding-top: 0; }
  .order-item-thumb {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    object-fit: cover;
  }
  .order-item-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .order-item-text strong { color: var(--primary-dark); }
  .order-item-text span { color: var(--muted); font-size: 14px; }
  .order-total {
    margin-top: 16px;
    color: var(--primary-dark);
    font-weight: 700;
  }

  .auth-shell {
    min-height: calc(100vh - 76px);
    max-width: 1240px;
    margin: 0 auto;
    padding: 34px 24px 80px;
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 22px;
  }
  .auth-panel {
    border-radius: 28px;
    overflow: hidden;
  }
  .auth-cover {
    background:
      linear-gradient(120deg, rgba(34, 20, 12, 0.84), rgba(80, 45, 29, 0.66)),
      url('https://images.unsplash.com/photo-1519869325930-281384150729?w=1400&auto=format&fit=crop') center/cover;
    box-shadow: var(--shadow);
  }
  .auth-cover-content {
    padding: 42px;
    color: white;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
  .auth-cover-content h1 {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: clamp(34px, 4vw, 54px);
    line-height: 1.08;
  }
  .auth-cover-content p {
    margin: 18px 0 0;
    color: rgba(255,255,255,0.8);
    line-height: 1.7;
    max-width: 560px;
  }
  .auth-form-panel { display: flex; }
  .auth-card {
    width: 100%;
    padding: 34px;
    align-self: stretch;
  }
  .auth-logo {
    font-family: 'Playfair Display', serif;
    font-size: 34px;
    color: var(--primary-dark);
    text-align: center;
  }
  .auth-subtitle {
    margin-top: 8px;
    color: var(--muted);
    text-align: center;
  }
  .auth-demo-note {
    margin-top: 14px;
    padding: 14px 16px;
    border-radius: 14px;
    background: #faf4ec;
    border: 1px solid var(--border);
    color: var(--primary-dark);
    text-align: center;
    line-height: 1.6;
  }
  .auth-tabs {
    margin-top: 26px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    background: var(--surface-alt);
    padding: 6px;
    border-radius: 16px;
  }
  .auth-tab {
    border: none;
    background: transparent;
    border-radius: 12px;
    padding: 12px 14px;
    color: var(--muted);
    cursor: pointer;
    font-weight: 600;
  }
  .auth-tab.active {
    background: #fff;
    color: var(--primary-dark);
    box-shadow: 0 10px 20px rgba(52, 28, 16, 0.06);
  }
  .auth-form {
    margin-top: 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .auth-err {
    color: #a33b3b;
    background: rgba(220, 80, 80, 0.08);
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 14px;
  }

  .about-hero {
    padding: 36px 24px 10px;
  }
  .about-hero-content {
    max-width: 1240px;
    margin: 0 auto;
    padding: 44px;
    border-radius: 28px;
    background:
      linear-gradient(120deg, rgba(41, 23, 14, 0.92), rgba(110, 72, 51, 0.74)),
      url('https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1600&auto=format&fit=crop') center/cover;
    color: white;
    box-shadow: var(--shadow);
  }
  .about-hero h1 {
    color: white;
    font-size: clamp(38px, 5vw, 64px);
    max-width: 820px;
  }
  .about-hero p {
    margin: 16px 0 0;
    max-width: 680px;
    color: rgba(255,255,255,0.82);
    line-height: 1.7;
  }
  .about-band {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
    margin-top: 18px;
  }
  .about-copy {
    padding: 28px;
    border-radius: 22px;
    background: var(--surface);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
  }
  .about-copy h2 {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    color: var(--primary-dark);
  }
  .about-copy p {
    margin: 16px 0 0;
    color: var(--muted);
    line-height: 1.7;
  }
  .about-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .about-cta {
    margin-top: 28px;
    padding: 34px;
    border-radius: 26px;
    background: linear-gradient(180deg, #fff, #f6ede4);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    text-align: center;
  }
  .about-cta h2 {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    color: var(--primary-dark);
  }
  .about-cta p {
    margin: 14px auto 22px;
    max-width: 640px;
    color: var(--muted);
    line-height: 1.7;
  }

  .admin-hero {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 22px;
    margin-bottom: 24px;
    padding: 28px;
    border-radius: 28px;
    background:
      linear-gradient(135deg, rgba(41, 23, 14, 0.95), rgba(110, 72, 51, 0.78)),
      url('https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1600&auto=format&fit=crop') center/cover;
    color: white;
    box-shadow: var(--shadow);
  }
  .admin-hero .page-title,
  .admin-hero .page-subtitle { color: white; }
  .admin-hero .page-subtitle { max-width: 680px; opacity: 0.84; }
  .admin-stats-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  .admin-stat-card {
    padding: 18px;
    border-radius: 18px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.12);
    backdrop-filter: blur(8px);
  }
  .admin-stat-card strong {
    display: block;
    font-family: 'Playfair Display', serif;
    font-size: 34px;
    color: white;
  }
  .admin-stat-card span {
    display: block;
    margin-top: 6px;
    color: rgba(255,255,255,0.72);
  }
  .admin-tabs {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 18px;
  }
  .admin-layout {
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 22px;
    align-items: start;
  }
  .admin-list-panel,
  .admin-editor-panel,
  .admin-section-card {
    padding: 22px;
    border-radius: 22px;
    background: var(--surface);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
  }
  .admin-list-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    margin-bottom: 14px;
  }
  .admin-list-head h3 {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    color: var(--primary-dark);
  }
  .admin-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 780px;
    overflow: auto;
    padding-right: 4px;
  }
  .admin-list-item {
    display: grid;
    grid-template-columns: 72px 1fr;
    gap: 12px;
    align-items: center;
    width: 100%;
    text-align: left;
    padding: 12px;
    border-radius: 16px;
    border: 1px solid var(--border);
    background: #fffaf6;
    cursor: pointer;
  }
  .admin-list-item.active,
  .admin-list-item:hover {
    border-color: rgba(125, 74, 51, 0.3);
    background: #fff;
    transform: translateY(-1px);
  }
  .admin-list-item img {
    width: 72px;
    height: 72px;
    border-radius: 14px;
    object-fit: cover;
  }
  .admin-list-item strong {
    display: block;
    color: var(--primary-dark);
    margin-bottom: 6px;
  }
  .admin-list-item span {
    color: var(--muted);
    font-size: 13px;
    line-height: 1.5;
  }
  .admin-user-pill {
    width: 72px;
    height: 72px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: linear-gradient(180deg, #f5ede4, #f0dfd0);
    color: var(--primary-dark);
    font-family: 'Playfair Display', serif;
    font-size: 28px;
  }
  .admin-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .admin-form-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 6px;
  }
  .admin-secondary-btn {
    background: var(--surface-alt);
    color: var(--primary-dark);
    border: 1px solid var(--border);
  }
  .admin-secondary-btn:hover { background: #efe4d8; }
  .admin-order-grid,
  .admin-feedback-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }
  .admin-status-select {
    min-width: 170px;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px 12px;
    background: #fff;
    color: var(--text);
  }
  .admin-order-meta {
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: var(--muted);
    font-size: 14px;
  }
  .admin-feedback-card {
    padding: 20px;
    border-radius: 18px;
    border: 1px solid var(--border);
    background: #fffaf6;
  }
  .admin-feedback-card strong {
    display: block;
    color: var(--primary-dark);
    font-size: 18px;
  }
  .admin-feedback-card span,
  .admin-feedback-card time {
    display: block;
    color: var(--muted);
    font-size: 13px;
    margin-top: 6px;
  }
  .admin-feedback-card p {
    margin: 12px 0 0;
    color: var(--text);
    line-height: 1.6;
  }

  .footer {
    margin-top: 20px;
    padding: 34px 24px;
    background: var(--surface-dark);
    color: rgba(255,255,255,0.7);
  }
  .footer-inner {
    max-width: 1240px;
    margin: 0 auto;
  }
  .footer-logo {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    color: white;
  }
  .footer-copy {
    margin: 14px 0 0;
    line-height: 1.7;
    max-width: 520px;
  }
  .footer-meta strong {
    display: block;
    color: #fff;
    margin-bottom: 10px;
  }
  .footer-meta span {
    display: block;
    line-height: 1.8;
  }

  .toast {
    position: fixed;
    right: 24px;
    bottom: 24px;
    padding: 14px 18px;
    border-radius: 14px;
    background: rgba(33, 21, 14, 0.96);
    color: white;
    box-shadow: 0 20px 40px rgba(0,0,0,0.18);
    opacity: 0;
    transform: translateY(14px);
    pointer-events: none;
    z-index: 999;
  }
  .toast.show {
    opacity: 1;
    transform: translateY(0);
  }
  .toast.success {
    background: rgba(59, 111, 71, 0.96);
  }
  .cookie-banner {
    position: fixed;
    left: 24px;
    right: 24px;
    bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
    padding: 18px 20px;
    border-radius: 18px;
    background: rgba(26, 16, 11, 0.95);
    color: rgba(255,255,255,0.84);
    z-index: 998;
    box-shadow: 0 20px 40px rgba(0,0,0,0.18);
  }
  .cookie-banner-text {
    max-width: 760px;
    line-height: 1.6;
    font-size: 14px;
  }
  .cookie-banner-btn {
    background: #fff;
    color: var(--surface-dark);
    flex-shrink: 0;
  }

  @media (max-width: 1180px) {
    .hero-grid,
    .auth-shell,
    .about-band,
    .account-overview,
    .footer-inner,
    .category-grid,
    .products-grid,
    .month-picks-grid,
    .feature-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .products-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .cart-layout,
    .catalog-hero,
    .admin-hero,
    .admin-layout,
    .admin-order-grid,
    .admin-feedback-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 900px) {
    .nav-inner,
    .nav-links,
    .nav-actions,
    .feedback-header,
    .feedback-contacts,
    .catalog-toolbar,
    .form-row,
    .feedback-form-grid,
    .account-layout,
    .auth-shell,
    .hero-grid,
    .month-picks-grid,
    .overview-stats,
    .feature-strip,
    .category-grid,
    .about-grid,
    .products-grid { grid-template-columns: 1fr; }
    .nav-inner { flex-wrap: wrap; }
    .nav-links { order: 3; width: 100%; overflow-x: auto; }
    .nav-actions { width: 100%; justify-content: flex-end; }
    .hero-featured-card { min-height: 360px; }
    .feedback-contacts { min-width: 0; }
    .catalog-price-row,
    .admin-stats-grid { grid-template-columns: 1fr; }
    .account-sidebar { position: static; }
    .cart-item {
      grid-template-columns: 88px 1fr;
    }
    .cart-item-price,
    .qty-ctrl { grid-column: 2 / 3; }
  }

  @media (max-width: 640px) {
    .page,
    .page-narrow,
    .hero,
    .about-hero,
    .auth-shell,
    .footer { padding-left: 16px; padding-right: 16px; }
    .hero-grid,
    .about-hero-content,
    .auth-card,
    .auth-cover-content,
    .admin-hero,
    .catalog-hero,
    .feedback-section,
    .cart-panel,
    .cart-summary,
    .profile-card,
    .order-card,
    .account-hero-card,
    .about-copy,
    .about-cta,
    .success-screen,
    .empty-state { padding: 22px; }
    .nav-inner { padding: 12px 16px; }
    .cookie-banner {
      left: 16px;
      right: 16px;
      bottom: 16px;
      flex-direction: column;
      align-items: stretch;
    }
    .cookie-banner-btn { width: 100%; }
  }
`;
