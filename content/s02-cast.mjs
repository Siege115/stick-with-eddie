// S02 Ice King: costumes for every character group (art brief section 2, owner decisions 2026-11-17).
// Pure data so a beats file can import it in node and the lineup page can import it in the browser.
// Rules: Eddie always keeps his sneakers; no bowlers (1806/1833); adults only on the pond; same flat white faces for everyone,
// identity carried by clothing; respectful period dress in Martinique and Calcutta (no caricature, no "exotic" props).
const coat = (color, long = true) => ({ color, long });

export const S02_COSTUMES = {
  // ---- Eddie as Frederic Tudor ----
  eddie1806: { label: 'Eddie as Tudor, 1806', c: { egg: true, coat: coat('#1f2a44'), capelet: '#2a3a5e', cravat: '#ffffff', shirt: '#e3cf98', hat: 'topTall', hatColor: '#1b1b1b', hatBand: '#3a3a3a', scarf: '#8a2a2a', shoes: 'sneaker' }, pose: 'proud' },
  eddie1806ice: { label: '1806 · ice held up', c: { egg: true, coat: coat('#1f2a44'), capelet: '#2a3a5e', cravat: '#ffffff', shirt: '#e3cf98', hat: 'topTall', hatColor: '#1b1b1b', hatBand: '#3a3a3a', scarf: '#8a2a2a', shoes: 'sneaker', item: 'ice' }, pose: 'presentIce' },
  eddie1806letter: { label: '1806 · letter, hat droops', c: { egg: true, coat: coat('#1f2a44'), capelet: '#2a3a5e', cravat: '#ffffff', shirt: '#e3cf98', hat: 'topTall', hatColor: '#1b1b1b', hatBand: '#3a3a3a', shoes: 'sneaker', item: 'letter' }, pose: 'hatDroop' },
  eddie1833: { label: 'Eddie as Tudor, 1833 (older)', c: { egg: true, coat: coat('#1f2a44'), capelet: '#2a3a5e', cravat: '#ffffff', shirt: '#e3cf98', hat: 'topTall', hatColor: '#1b1b1b', hatBand: '#3a3a3a', sideburns: '#a9a9a9', browColor: '#8a8a8a', shoes: 'sneaker', item: 'cane' }, pose: 'oldStand' },
  eddie1833lift: { label: '1833 · lifts his hat', c: { egg: true, coat: coat('#1f2a44'), capelet: '#2a3a5e', cravat: '#ffffff', shirt: '#e3cf98', hat: 'topTall', hatColor: '#1b1b1b', hatBand: '#3a3a3a', sideburns: '#a9a9a9', browColor: '#8a8a8a', shoes: 'sneaker', itemL: 'cane' }, pose: 'hatLift' },
  // ---- pond ice workers (adults only) ----
  iceSaw1: { label: 'Ice cutter · long saw', c: { body: '#5a4a3a', hat: 'knit', hatColor: '#8a2a2a', hatBand: '#6a1f1f', gloves: '#3a3a5a', scarf: '#2f4a6a', apronLong: '#b8ab8a', item: 'saw', shoes: 'boot' }, pose: 'saw' },
  iceTongs: { label: 'Ice cutter · tongs', c: { body: '#3f4a5a', hat: 'knit', hatColor: '#2f4a6a', hatBand: '#1f3550', pomColor: '#e9e2d0', gloves: '#5a3a2a', scarf: '#9a7a3a', item: 'tongs', shoes: 'boot' }, pose: 'tongsLift' },
  icePike: { label: 'Ice cutter · pike pole', c: { body: '#6a5a44', hat: 'roundHat', hatColor: '#4a3a2a', hatBand: '#2a2018', gloves: '#3a3a3a', scarf: '#7a2a2a', item: 'pike', shoes: 'boot' }, pose: 'pushPole' },
  iceSaw2: { label: 'Ice cutter · leather apron', c: { body: '#4a4a52', hat: 'knit', hatColor: '#6a6a6a', hatBand: '#4a4a4a', pom: false, gloves: '#6a4a2a', apronLong: '#7a5a3a', item: 'saw', shoes: 'boot' }, pose: 'saw' },
  // ---- sailors ----
  sailor1: { label: 'Sailor · hauling (Boston)', c: { body: '#f4f1e8', stripes: '#1d3557', neckerchief: '#c0392b', hat: 'knit', hatColor: '#1d3557', hatBand: '#14263d', pom: false, shoes: 'boot' }, pose: 'hoist' },
  sailor2: { label: 'Sailor · coiling rope', c: { body: '#efe8d8', stripes: '#7a2a2a', neckerchief: '#1d3557', hat: 'knit', hatColor: '#1d3557', hatBand: '#14263d', pom: false, item: 'rope', shoes: 'boot' }, pose: 'coilRope' }, // striped shirt + knit cap: never mistaken for Eddie
  sailor3: { label: 'Sailor · straw hat (at sea)', c: { body: '#f4f1e8', stripes: '#7a2a2a', neckerchief: '#1d3557', hat: 'straw', hatColor: '#e3c87a', hatBand: '#1d3557', shoes: 'boot' }, pose: 'wheel' },
  // ---- Boston crowd, 1806 ----
  b06man: { label: 'Boston 1806 · gentleman', c: { coat: coat('#3a2a22'), cravat: '#ffffff', shirt: '#e8dcc0', hat: 'topTall', hatColor: '#222', hatBand: '#5a3a2a', breeches: '#c9b48a', stockings: '#f2efe6', shoes: 'small' }, pose: 'laughPoint' },
  b06old: { label: 'Boston 1806 · older man, bicorne', c: { coat: coat('#4a4a52'), cravat: '#ffffff', hat: 'bicorne', hatColor: '#1e1e22', breeches: '#2a2a2e', stockings: '#e8e4da', moustache: '#d0d0d0', shoes: 'small', item: 'cane' }, pose: 'laughBelly' },
  b06work: { label: 'Boston 1806 · dock worker', c: { body: '#e8e2d2', vest: '#6a4a2a', hat: 'roundHat', hatColor: '#5a4a3a', hatBand: '#2a2018', scarf: '#2f4a6a', shoes: 'boot' }, pose: 'kneeSlap' },
  b06woman: { label: 'Boston 1806 · bonnet, spencer', c: { body: '#f2ead6', empire: { color: '#f2ead6', sash: '#5d7ea8', hem: '#5d7ea8' }, spencer: '#8a2a3a', hat: 'bonnet', hatColor: '#d9c9a6', hatBand: '#5d7ea8', shoes: 'small' }, pose: 'laughBack' },
  b06woman2: { label: 'Boston 1806 · shawl', c: { body: '#e9dcb0', empire: { color: '#e9dcb0', sash: '#3f6a52' }, shawl: { color: '#7a2a2a', pattern: '#e8c55a' }, hair: 'bun', hairColor: '#4a3020', shoes: 'small' }, pose: 'handsCheeks' },
  b06kid: { label: 'Boston 1806 · child (on the wharf only)', c: { body: '#5d7ea8', scarf: '#c0392b', hat: 'knit', hatColor: '#e9c46a', hatBand: '#c9a34a', scale: 0.7, shoes: 'small' }, pose: 'laughPoint' },
  // ---- Boston crowd, 1833 ----
  b33man: { label: 'Boston 1833 · frock coat', c: { coat: coat('#2a3a2a'), cravat: '#1b1b1b', shirt: '#e8dcc0', hat: 'topTall', hatColor: '#3a3028', hatBand: '#1b1b1b', shoes: 'small' }, pose: 'cheer' },
  b33woman: { label: 'Boston 1833 · puffed sleeves', c: { body: '#c9d8e8', empire: { color: '#c9d8e8', waist: 'natural', sash: '#2a4a7a', bodice: '#c9d8e8' }, puffSleeves: '#c9d8e8', hat: 'bonnet', hatColor: '#e8d6b0', hatBand: '#c0392b', shoes: 'small' }, pose: 'clap' },
  b33work: { label: 'Boston 1833 · worker', c: { body: '#e8e2d2', vest: '#2f4a3a', hat: 'roundHat', hatColor: '#3a3a3a', hatBand: '#222', shoes: 'boot' }, pose: 'cheerOne' },
  // ---- kitchen ----
  cook: { label: 'Cook, 1806 kitchen', c: { body: '#8a5a4a', empire: { color: '#8a5a4a' }, apronLong: '#f4f1e8', hat: 'mobcap', hatColor: '#fbf8ef', hatBand: '#5d7ea8', shoes: 'small' }, pose: 'fan' },
  // ---- Martinique, 1806 ----
  mqMerchant: { label: 'Martinique merchant', c: { coat: coat('#efe6cf'), cravat: '#ffffff', shirt: '#d9c79a', hat: 'straw', hatColor: '#e8d49a', hatBand: '#3a2a1a', item: 'fan', breeches: '#efe6cf', stockings: '#ffffff', shoes: 'small' }, pose: 'fan' },
  mqMerchantB: { label: 'Merchant · holds the dripping block', c: { coat: coat('#efe6cf'), cravat: '#ffffff', shirt: '#d9c79a', hat: 'straw', hatColor: '#e8d49a', hatBand: '#3a2a1a', item: 'iceBlock', breeches: '#efe6cf', stockings: '#ffffff', shoes: 'small' }, pose: 'holdAtArm' },
  mqWoman: { label: 'Townswoman · madras head-tie, parasol', c: { body: '#f2ead6', empire: { color: '#f2ead6', hem: '#2e86ab', sash: '#2e86ab' }, shawl: { color: '#e9c46a' }, hat: 'headwrap', hatColor: '#f2c94c', check: '#c0392b', item: 'parasol', shoes: 'small' }, pose: 'holdParasol' },
  mqMan: { label: 'Townsman · linen coat', c: { coat: coat('#d9cfb8'), cravat: '#ffffff', hat: 'roundHat', hatColor: '#d9c08a', hatBand: '#5a3a1a', shoes: 'small' }, pose: 'handChin' },
  mqFisher: { label: 'Fisherman · straw hat', c: { body: '#e8e2d2', hat: 'straw', hatColor: '#e3c87a', hatBand: '#7a3420', item: 'rope', shoes: 'boot' }, pose: 'watch' },
  // ---- Calcutta, 1833 ----
  caMerchant1: { label: 'Bengali merchant · pagri, ledger', c: { body: '#f4ecd6', chapkan: '#f4ecd6', dhoti: '#fbf8ef', shawl: { color: '#b5532a', pattern: '#e8c55a' }, hat: 'turban', hatColor: '#f6f2e6', hatBand: '#c9962e', item: 'ledger', shoes: 'small' }, pose: 'holdLedger' },
  caMerchant2: { label: 'Bengali merchant · umbrella', c: { body: '#efc98a', chapkan: '#efc98a', dhoti: '#fbf8ef', shawl: { color: '#3a5a8a' }, hair: 'side', hairColor: '#1b1b1b', item: 'umbrella', shoes: 'small' }, pose: 'holdUmbrella' },
  caWorker1: { label: 'Dockworker · kurta, rope', c: { body: '#f2efe6', kurta: '#f2efe6', dhoti: '#f6f2e6', hat: 'headwrap', hatColor: '#f2efe6', check: '#b5532a', item: 'rope', shoes: 'small' }, pose: 'coilRope' },
  caWorker2: { label: 'Dockworker · carrying', c: { body: '#e8dcc0', kurta: '#e8dcc0', dhoti: '#f6f2e6', hat: 'headwrap', hatColor: '#e9e2d0', shoes: 'small' }, pose: 'carry' },
  caWorker3: { label: 'Dockworker · sack', c: { body: '#d9c8a0', kurta: '#d9c8a0', dhoti: '#f6f2e6', hat: 'headwrap', hatColor: '#c97a4a', shoes: 'small' }, pose: 'carry' },
  caBritMan: { label: 'British resident · linen coat', c: { coat: coat('#f2efe6'), cravat: '#1b1b1b', shirt: '#e8dcc0', hat: 'straw', hatColor: '#e8d49a', hatBand: '#1b1b1b', shoes: 'small' }, pose: 'clap' },
  caBritWoman: { label: 'British resident · 1830s dress', c: { body: '#f2e6e8', empire: { color: '#f2e6e8', waist: 'natural', sash: '#7a2a3a', bodice: '#f2e6e8' }, puffSleeves: '#f2e6e8', hat: 'bonnet', hatColor: '#efe2c4', hatBand: '#7a2a3a', item: 'parasol', shoes: 'small' }, pose: 'holdParasol' },
  // ---- sawmill ----
  mill1: { label: 'Sawmill worker · shovel', c: { body: '#e8e2d2', vest: '#5a4a3a', hat: 'roundHat', hatColor: '#4a3a2a', hatBand: '#2a2018', apronLong: '#7a5a3a', item: 'shovel', shoes: 'boot' }, pose: 'shovel' },
  mill2: { label: 'Sawmill worker · guides the log', c: { body: '#d9e2ea', vest: '#3a3a42', hat: 'knit', hatColor: '#5a3a2a', hatBand: '#3a2418', pom: false, shoes: 'boot' }, pose: 'pushPole' },
};
export const LINEUP = [
  ['Eddie as Frederic Tudor (sneakers kept)', ['eddie1806', 'eddie1806ice', 'eddie1806letter', 'eddie1833', 'eddie1833lift']],
  ['Pond ice cutters (adults only) · sailors', ['iceSaw1', 'iceTongs', 'icePike', 'iceSaw2', 'sailor1', 'sailor2', 'sailor3']],
  ['Boston crowd 1806 (no bowlers: top hats, bicorne, round hats, knit caps, bonnets) · 1833', ['b06man', 'b06old', 'b06work', 'b06woman', 'b06woman2', 'b06kid', 'b33man', 'b33woman', 'b33work']],
  ['Kitchen cook · Martinique 1806', ['cook', 'mqMerchant', 'mqMerchantB', 'mqWoman', 'mqMan', 'mqFisher']],
  ['Calcutta 1833 · sawmill', ['caMerchant1', 'caMerchant2', 'caWorker1', 'caWorker2', 'caWorker3', 'caBritMan', 'caBritWoman', 'mill1', 'mill2']],
];
