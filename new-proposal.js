// ── Proposal config — fill this in, then run: node new-proposal.js ──────────

const config = {
  slug:         'northwood-legal',
  clientName:   'Northwood Legal',
  contactName:  'Sarah Brennan',
  company:      'Northwood Legal Group',
  date:         'April 28, 2026',
  validUntil:   'May 12, 2026',
  meetingDate:  'April 24, 2026',

  solving: 'Your current site isn\'t reflecting the caliber of work you do — prospects are landing on it and you\'re not confident it\'s helping you close. You want a site that builds trust fast and makes it easy for the right clients to reach out.',

  opt1: {
    name:     'Authority Blueprint',
    bestFor:  'You have a team to execute — you need the strategy and direction.',
    price:    '$4,500',
    priceRaw: 4500,
  },

  opt2: {
    name:     'Authority Website',
    bestFor:  'You want it done right without managing it yourself.',
    price:    '$7,500',
    priceRaw: 7500,
  },

  opt3: {
    name:     'Full Authority System',
    bestFor:  'You want the highest-confidence path with the least risk.',
    price:    '$12,000',
    priceRaw: 12000,
  },

  // Deliverable cells — use '✓', '—', or descriptive text
  deliverables: {
    strategy:   ['Light intake only',      'Full strategy foundation',   'Full strategy + deeper research'],
    sitemap:    ['✓',                       '✓',                          '✓'],
    visual:     ['—',                       '✓',                          '✓'],
    figma:      ['—',                       '✓',                          '✓'],
    wp:         ['—',                       '✓',                          '✓'],
    copy:       ['—',                       'Direction only',             'Full copy'],
    seo:        ['—',                       '✓',                          '✓'],
    a11y:       ['—',                       'Basic checks',               'Full audit'],
    perf:       ['—',                       '—',                          '✓'],
    analytics:  ['—',                       '—',                          '✓'],
    training:   ['—',                       '1 session',                  'Session + documentation'],
    support:    ['—',                       '30 days',                    '60 days'],
    priority:   ['—',                       '—',                          '✓'],
  },

  payment:  '50% on deposit, 50% at launch',
  timeline: '8–10 weeks for Option 2',
};

// ── Script — no need to edit below this line ─────────────────────────────────

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const templatePath = path.join(__dirname, '_template.html');
const outputDir    = path.join(__dirname, config.slug);
const outputPath   = path.join(outputDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('❌  _template.html not found.');
  process.exit(1);
}

let html = fs.readFileSync(templatePath, 'utf8');

const d = config.deliverables;

const replacements = {
  '{{CLIENT_NAME}}':   config.clientName,
  '{{CONTACT_NAME}}':  config.contactName,
  '{{COMPANY}}':       config.company,
  '{{DATE}}':          config.date,
  '{{VALID_UNTIL}}':   config.validUntil,
  '{{MEETING_DATE}}':  config.meetingDate,
  '{{SOLVING}}':       config.solving,

  '{{OPT1_NAME}}':     config.opt1.name,
  '{{OPT2_NAME}}':     config.opt2.name,
  '{{OPT3_NAME}}':     config.opt3.name,

  '{{OPT1_BEST_FOR}}': config.opt1.bestFor,
  '{{OPT2_BEST_FOR}}': config.opt2.bestFor,
  '{{OPT3_BEST_FOR}}': config.opt3.bestFor,

  '{{OPT1_PRICE}}':     config.opt1.price,
  '{{OPT2_PRICE}}':     config.opt2.price,
  '{{OPT3_PRICE}}':     config.opt3.price,
  '{{OPT1_PRICE_RAW}}': String(config.opt1.priceRaw),
  '{{OPT2_PRICE_RAW}}': String(config.opt2.priceRaw),
  '{{OPT3_PRICE_RAW}}': String(config.opt3.priceRaw),

  '{{OPT1_STRATEGY}}': d.strategy[0],  '{{OPT2_STRATEGY}}': d.strategy[1],  '{{OPT3_STRATEGY}}': d.strategy[2],
  '{{OPT1_SITEMAP}}':  d.sitemap[0],   '{{OPT2_SITEMAP}}':  d.sitemap[1],   '{{OPT3_SITEMAP}}':  d.sitemap[2],
  '{{OPT1_VISUAL}}':   d.visual[0],    '{{OPT2_VISUAL}}':   d.visual[1],    '{{OPT3_VISUAL}}':   d.visual[2],
  '{{OPT1_FIGMA}}':    d.figma[0],     '{{OPT2_FIGMA}}':    d.figma[1],     '{{OPT3_FIGMA}}':    d.figma[2],
  '{{OPT1_WP}}':       d.wp[0],        '{{OPT2_WP}}':       d.wp[1],        '{{OPT3_WP}}':       d.wp[2],
  '{{OPT1_COPY}}':     d.copy[0],      '{{OPT2_COPY}}':     d.copy[1],      '{{OPT3_COPY}}':     d.copy[2],
  '{{OPT1_SEO}}':      d.seo[0],       '{{OPT2_SEO}}':      d.seo[1],       '{{OPT3_SEO}}':      d.seo[2],
  '{{OPT1_A11Y}}':     d.a11y[0],      '{{OPT2_A11Y}}':     d.a11y[1],      '{{OPT3_A11Y}}':     d.a11y[2],
  '{{OPT1_PERF}}':     d.perf[0],      '{{OPT2_PERF}}':     d.perf[1],      '{{OPT3_PERF}}':     d.perf[2],
  '{{OPT1_ANALYTICS}}':d.analytics[0], '{{OPT2_ANALYTICS}}':d.analytics[1], '{{OPT3_ANALYTICS}}':d.analytics[2],
  '{{OPT1_TRAINING}}': d.training[0],  '{{OPT2_TRAINING}}': d.training[1],  '{{OPT3_TRAINING}}': d.training[2],
  '{{OPT1_SUPPORT}}':  d.support[0],   '{{OPT2_SUPPORT}}':  d.support[1],   '{{OPT3_SUPPORT}}':  d.support[2],
  '{{OPT1_PRIORITY}}': d.priority[0],  '{{OPT2_PRIORITY}}': d.priority[1],  '{{OPT3_PRIORITY}}': d.priority[2],

  '{{PAYMENT}}':       config.payment,
  '{{TIMELINE}}':      config.timeline,
};

for (const [key, val] of Object.entries(replacements)) {
  html = html.replaceAll(key, val);
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, html, 'utf8');
console.log(`✓  Generated ${outputPath}`);

try {
  execSync('git add .', { cwd: __dirname, stdio: 'inherit' });
  execSync(`git commit -m "Add proposal: ${config.slug}"`, { cwd: __dirname, stdio: 'inherit' });
  execSync('git push', { cwd: __dirname, stdio: 'inherit' });
  console.log(`✓  Pushed to GitHub — Cloudflare will deploy shortly`);
  console.log(`→  https://proposal.masstilt.com/${config.slug}`);
} catch (e) {
  console.error('❌  Git push failed — check your connection and try again.');
}
