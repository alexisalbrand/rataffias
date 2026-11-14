#!/usr/bin/env node
// Fabrique le site (dossier _site/) à partir des fichiers content/*.json.
// Lancé automatiquement par GitHub à chaque modification faite dans l'administration (Pages CMS).
// Pour tester sur un ordinateur : node build.js, puis ouvrir _site/index.html.
// Aucune dépendance à installer : Node.js 18 ou plus suffit.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, '_site');

const load = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, 'content', name + '.json'), 'utf8'));

// Échappe un texte brut
const e = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
// Texte avec **gras** et *italique*
const fmt = (v) => e(v).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<em>$1</em>');
const paras = (v) => String(v ?? '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  .map((b) => `<p>${fmt(b).replace(/\n/g, '<br>')}</p>`).join('');
// Chemin d'image relatif (marche aussi sous un sous-dossier GitHub Pages)
const src = (p) => e(String(p ?? '').replace(/^\/+/, ''));
const ext = (href, text, cls = '') => `<a${cls ? ` class="${cls}"` : ''} href="${e(href)}" target="_blank" rel="noopener">${text}</a>`;
const list = (v) => (Array.isArray(v) ? v : []);
const head = (num, title) => `<div class="act-head"><span class="num">${num}</span><h2>${title}</h2></div>`;

const g = load('general');
const sp = load('spectacle');
const tr = load('troupe');
const ph = load('photos');
const rp = load('representations');
const rep = load('repertoire');
const lo = load('livre-or');
const pr = load('presse');

const nom = e(g.nom);
const resa = g.lien_reservation || '';

// ---------- Navigation ----------
const navLinks = [['spectacle', 'Le spectacle'], ['troupe', 'La troupe'], ['photos', 'Photos'], ['tournee', 'Représentations'],
  ['repertoire', 'Répertoire'], ['public', 'Livre d’or'], ['presse', 'Presse'], ['contact', 'Contact']];
const nav = `<nav class="nav" aria-label="Navigation principale">
  <div class="wrap">
    <a class="brand-block" href="#top"><span class="brand">${nom}</span><span class="tagline">${e(g.sous_titre)}</span></a>
    <ul>${navLinks.map(([i, l]) => `<li><a href="#${i}">${l}</a></li>`).join('')}</ul>
    ${resa ? ext(resa, 'Réserver', 'book') : ''}
  </div>
</nav>`;

// ---------- Hero ----------
const nx = sp.prochaine || {};
let ticket = '';
if (nx.afficher) {
  const rows = [['Heure', 'heure'], ['Lieu', 'lieu'], ['Ville', 'ville'], ['Public', 'public']]
    .filter(([, f]) => nx[f]).map(([k, f]) => `<dt>${k}</dt><dd>${e(nx[f])}</dd>`).join('');
  const lien = nx.lien || resa;
  ticket = `<aside class="ticket" aria-label="Prochaine représentation">
      <div class="top">
        <span class="label">Prochaine représentation</span>
        <span class="date">${e(nx.date)}</span>
        <dl class="rows">${rows}</dl>
      </div>
      <div class="stub"><span class="price">${e(nx.tarif)}</span>${lien ? ext(lien, 'Réserver sur HelloAsso →', 'btn') : ''}</div>
    </aside>`;
}
const hero = `<header class="hero" id="top">
  <div class="wrap">
    <div>
      <p class="eyebrow">À l’affiche</p>
      <h1 class="zai" aria-label="${e(sp.titre)}">${String(sp.titre || '').split(/\s+/).filter(Boolean).map((w) => `<span>${e(w)}</span>`).join('')}</h1>
      <p class="lede">${fmt(sp.accroche)}</p>
    </div>
    ${ticket}
  </div>
</header>`;

// ---------- Acte I ----------
const facts = list(sp.infos).map((i) => `<div><dt>${e(i.libelle)}</dt><dd>${e(i.valeur)}</dd></div>`).join('');
const trailer = sp.bande_annonce
  ? ext(sp.bande_annonce, '<span class="play"><svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true"><path d="M0 0 L16 9 L0 18 Z"/></svg></span> Voir la bande-annonce', 'trailer')
  : '';
const poster = sp.affiche ? `<figure class="poster"><img src="${src(sp.affiche)}" alt="${e(sp.affiche_description || 'Affiche')}"></figure>` : '';
const acte1 = `<section class="act" id="spectacle"><div class="wrap">
  ${head('Acte I', 'Le spectacle')}
  <div class="syn"><div>${paras(sp.synopsis)}${trailer}<dl class="facts" style="margin-top:32px">${facts}</dl></div>${poster}</div>
</div></section>`;

// ---------- Acte II ----------
const stats = list(tr.chiffres).map((c) => `<div><b>${e(c.nombre)}</b><span>${e(c.libelle)}</span></div>`).join('');
const cast = list(tr.membres).map((m) => (m.photo
  ? `<li><img class="face" src="${src(m.photo)}" alt="${e(m.prenom)}" loading="lazy"><span class="nm">${e(m.prenom)}</span></li>`
  : `<li class="soon"><span class="ph" aria-hidden="true">?</span><span class="nm">${e(m.prenom)}</span></li>`)).join('');
const group = tr.photo_groupe
  ? `<figure class="troupe-photo"><img src="${src(tr.photo_groupe)}" alt="${e(tr.legende_groupe || 'La troupe')}"><figcaption>${e(tr.legende_groupe)}</figcaption></figure>`
  : '';
const acte2 = `<section class="act" id="troupe"><div class="wrap">
  ${head('Acte II', 'La troupe')}
  ${group}
  <div class="troupe">
    <div class="intro">${paras(tr.presentation)}<div class="stats">${stats}</div></div>
    <div><ul class="cast">${cast}</ul><p class="cast-note">${e(tr.note)}</p></div>
  </div>
</div></section>`;

// ---------- Photos ----------
const gal = list(ph.photos).filter((p) => p.image)
  .map((p) => `<figure><img src="${src(p.image)}" alt="${e(p.description || p.legende)}" loading="lazy"><figcaption>${e(p.legende)}</figcaption></figure>`).join('');
const photos = `<section class="act" id="photos"><div class="wrap">
  ${head('Coulisses', 'En images')}
  <div class="gal">${gal}</div>
  ${ph.credit ? `<p class="gal-credit">${e(ph.credit)}</p>` : ''}
</div></section>`;

// ---------- Acte III ----------
const years = list(rp.annees).map((y) => {
  const lis = list(y.lieux).map((l) => {
    const inner = `${e(l.ville)}${l.precision ? ` <small>${e(l.precision)}</small>` : ''}`;
    // Lien de réservation : celui du lieu, sinon (pour la prochaine date) celui du site
    const lien = l.lien || (l.prochaine ? resa : '');
    const cls = [l.prochaine ? 'next' : '', lien ? 'has-link' : ''].filter(Boolean).join(' ');
    const body = lien ? ext(lien, `${inner} <span class="go" aria-hidden="true">Réserver ↗</span>`) : inner;
    return `<li${cls ? ` class="${cls}"` : ''}>${body}</li>`;
  }).join('');
  return `<div class="year"><h3>${e(y.annee)}</h3><ul class="places">${lis}</ul></div>`;
}).join('');
const acte3 = `<section class="act" id="tournee"><div class="wrap">
  ${head('Acte III', 'Représentations')}
  <div class="tour">${years}</div>
</div></section>`;

// ---------- Acte IV ----------
const cards = list(rep.spectacles).map((s) => {
  const aff = s.affiche
    ? `<span class="aff"><img src="${src(s.affiche)}" alt="Affiche de ${e(s.titre)}" loading="lazy"></span>`
    : '<span class="aff none" aria-hidden="true">R</span>';
  const txt = [s.auteur, s.notes].filter(Boolean).join(' ');
  return `<li${s.a_l_affiche ? ' class="now"' : ''}>${aff}<span class="${s.date_a_preciser ? 'when tbc' : 'when'}">${e(s.date_de_jeu)}</span><h3>${e(s.titre)}</h3><p>${fmt(txt)}</p></li>`;
}).join('');
const acte4 = `<section class="act" id="repertoire"><div class="wrap">
  ${head('Acte IV', 'Répertoire')}
  <ul class="rep">${cards}</ul>
</div></section>`;

// ---------- Livre d'or ----------
const msgs = list(lo.messages).filter((m) => m.texte)
  .map((m) => `<figure${m.mis_en_avant ? ' class="xl"' : ''}><div class="q" aria-hidden="true">“</div><p>${e(m.texte)}</p></figure>`).join('');
const livre = `<section class="act" id="public"><div class="wrap">
  ${head('Entracte', 'Livre d’or')}
  <div class="public gb">${msgs}</div>
  ${lo.source ? `<p class="public-src">${e(lo.source)}</p>` : ''}
</div></section>`;

// ---------- Presse ----------
const u = pr.a_la_une || {};
let clip = '';
if (u.afficher) {
  const cits = list(u.citations).filter(Boolean).map((c) => `<li>« ${e(c)} »</li>`).join('');
  const num = u.chiffre ? `<div><span class="big-n">${e(u.chiffre)}</span> <span>${e(u.chiffre_libelle)}</span></div>` : '';
  const link = u.lien ? `<div class="links" style="margin-top:4px">${ext(u.lien, e(u.lien_libelle || 'Lire'), 'chip')}</div>` : '';
  const titre = e(u.titre).replace('10e', '10<sup>e</sup>');
  clip = `<article class="clip"><span class="src">${e(u.source)}</span><h3>${titre}</h3>${num}<p>${e(u.resume)}</p>${cits ? `<ul>${cits}</ul>` : ''}${link}</article>`;
}
const arch = list(pr.archives).map((a) => `<li><span>${e(a.date)}</span><span>${e(a.detail)}</span></li>`).join('');
const cps = list(pr.coupures).filter((c) => c.image)
  .map((c) => `<figure><img src="${src(c.image)}" alt="Coupure de presse : ${e(c.legende)}" loading="lazy"><figcaption>${e(c.legende)}</figcaption></figure>`).join('');
const presse = `<section class="act" id="presse"><div class="wrap">
  ${head('Revue de presse', 'Ils en parlent')}
  <div class="press">${clip}<div class="arch"><h3>Archives</h3><p>${e(pr.archives_intro)}</p><ol>${arch}</ol></div></div>
  ${cps ? `<div class="clips"><h3>Coupures de presse</h3><div class="clips-grid">${cps}</div></div>` : ''}
</div></section>`;

// ---------- Contact ----------
const ct = g.contact || {};
const pa = g.partenaires || {};
const parts = list(pa.liste).map((p) => `<h3>${e(p.nom)}</h3><p>${e(p.detail)}</p>`).join('');
const fb = g.facebook;
const contact = `<section class="act" id="contact"><div class="wrap">
  ${head('Rideau', 'Nous contacter')}
  <div class="contact">
    <div>
      <p class="big">${e(ct.accroche)}</p>
      <div class="addr"><span class="label">${nom} · ${e(ct.nom)}</span>${ct.email ? `<a class="mail" href="mailto:${e(ct.email)}">${e(ct.email)}</a>` : ''}</div>
      ${fb ? `<div class="links">${ext(fb, 'Suivre la troupe sur Facebook', 'chip')}</div>` : ''}
    </div>
    <div class="partner"><span class="eyebrow">Partenaires</span><p>${e(pa.intro)}</p>${parts}</div>
  </div>
</div></section>`;

const footer = `<footer><div class="wrap"><span class="brand">${nom}</span><span>${e(g.pied_de_page)}${fb ? ' · ' + ext(fb, 'Facebook') : ''}</span></div></footer>`;

const page = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${nom} · ${e(g.sous_titre)}</title>
<meta name="description" content="${nom}, ${e(g.sous_titre)}. À l’affiche : ${e(sp.titre)}.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Shrikhand&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=DM+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
${nav}
${hero}
<main>
${acte1}
${acte2}
${photos}
${acte3}
${acte4}
${livre}
${presse}
${contact}
</main>
${footer}
</body>
</html>
`;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), page, 'utf8');
for (const d of ['assets', 'media']) {
  if (fs.existsSync(path.join(ROOT, d))) fs.cpSync(path.join(ROOT, d), path.join(OUT, d), { recursive: true });
}
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log('Site généré dans _site/');
