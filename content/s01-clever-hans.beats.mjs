// Stick With Eddie — Short #1: "The Horse That Could Do Math"
// One entry per narrated beat. Times inside a beat are seconds from the beat start,
// or "w:<word>[+/-s]" = the moment that word starts in the narration.
// Coordinates: metres. Hans stands at (0, -2) side-on, facing +x. Camera fov is vertical, degrees.

export const meta = {
  id: 's01-clever-hans', title: 'The Horse That Could Do Math',
  aspect: '9:16', fps: 30, width: 1080, height: 1920,
  gap: 0.12, // silence between beats
  // easter egg: a wooden log character peeks through the lit window above the crowd for ONE frame
  cameo: { t: 19.0, pos: [-1.37, 3.98, 11.45], set: 'courtyard' },
  // the one set this Short uses, and the S01-only pieces it asks for
  set: 'courtyard',
  sets: { courtyard: { chalkboard: true, screen: true, calendar: true, table: true, rope: true } },
  hans: { set: 'courtyard', at: [0, -2] }, // Hans the horse (taps, expressions, portrait/eye HUDs)
};

// ---------- cast (costumes + home marks) ----------
const coat = (color, long = false) => ({ color, long });
export const cast = {
  eddie: { card: 'hero', home: [1.35, -1.55], c: { egg: true, coat: coat('#2b2b36', true), hat: 'wide', hatColor: '#3b3129', hatBand: '#5a1f1f', beard: '#cfcfcf', shoes: 'sneaker', item: 'chalk', shirt: '#e8e2d2' } },
  oskar: { card: 'hero', home: [-0.95, 1.0], hidden: true, c: { body: '#7a6248', tweed: 'rgba(40,25,10,.22)', waistcoat: '#3f6a52', tie: '#7a1f1f', glasses: true, hair: 'side', hairColor: '#6b4424', itemL: 'notebook', item: 'pencil', shoes: 'boot' } },
  // thirteen experts
  e1: { card: 'mid', home: [-7.15, -1.6], c: { coat: coat('#34343f'), hat: 'top', monocle: true, moustache: '#3a3a3a', bushy: true, item: 'notebook', shoes: 'boot' } },
  e2: { card: 'mid', home: [-7.15, -0.9], c: { coat: coat('#5b4a3a'), hat: 'bowler', moustache: '#6b4a2a', shoes: 'boot' } },
  e3: { card: 'mid', home: [-7.15, -0.2], c: { coat: coat('#2f3d52'), hat: 'top', moustache: '#ddd', beard: '#e8e8e8', shoes: 'boot', item: 'paper' } },
  e4: { card: 'mid', home: [-7.15, 0.5], c: { coat: coat('#4a4a4a'), hat: 'bowler', monocle: true, shoes: 'boot' } },
  e5: { card: 'mid', home: [-7.15, 1.2], c: { coat: coat('#3d4a3a'), hat: 'top', moustache: '#222', glasses: true, shoes: 'boot', item: 'notebook' } },
  e6: { card: 'mid', home: [-7.15, 1.9], c: { coat: coat('#5a3a3a'), hat: 'bowler', moustache: '#8a5a2a', bushy: true, shoes: 'boot' } },
  e7: { card: 'mid', home: [-7.15, 2.6], c: { coat: coat('#2e2e2e'), hat: 'top', beard: '#7a5a3a', shoes: 'boot', item: 'pencil' } },
  e8: { card: 'mid', home: [-4.5, -9], hidden: true, c: { coat: coat('#45405a'), hat: 'bowler', glasses: true, moustache: '#444', shoes: 'boot', item: 'notebook' } },
  e9: { card: 'mid', home: [-4.5, -9], hidden: true, c: { coat: coat('#3a3a32'), hat: 'top', monocle: true, shoes: 'boot' } },
  e10: { card: 'mid', home: [-4.5, -9], hidden: true, c: { coat: coat('#59483a'), hat: 'bowler', beard: '#bbb', shoes: 'boot' } },
  e11: { card: 'mid', home: [-4.5, -9], hidden: true, c: { coat: coat('#2c3a44'), hat: 'top', moustache: '#5a3a1a', shoes: 'boot', item: 'paper' } },
  e12: { card: 'mid', home: [-4.5, -9], hidden: true, c: { coat: coat('#4d3d4d'), hat: 'bowler', glasses: true, shoes: 'boot' } },
  e13: { card: 'mid', home: [-4.5, -9], hidden: true, c: { coat: coat('#3b3b3b'), hat: 'top', moustache: '#999', bushy: true, shoes: 'boot', item: 'notebook' } },
  // crowd behind the rope
  c1: { card: 'extra', home: [-4.1, 3.3], c: { body: '#4a6fa5', hat: 'flat', hatColor: '#5b4b3b' } },
  c2: { card: 'extra', home: [-3.3, 3.9], c: { body: '#9b5f9e', hat: 'bonnet', hatColor: '#efe0bf', hatBand: '#9b2226' } },
  c3: { card: 'extra', home: [-2.4, 3.25], c: { body: '#6a8f4e', hat: 'flat', hatColor: '#4b4038', moustache: '#4a2a1a', apron: '#d8ccb0' } }, // dad
  kid: { card: 'extra', home: [-2.4, 3.30], ride: 'c3', c: { body: '#e07a3f', hat: 'flat', hatColor: '#6b5b4b', scale: 0.62, shoes: 'small' } },
  c4: { card: 'extra', home: [-1.5, 3.8], c: { body: '#c0504d', hat: 'bonnet', hatColor: '#cfe1f2', hatBand: '#3a6ea5', hair: 'bun' } },
  c5: { card: 'extra', home: [-0.6, 3.3], c: { body: '#5a5a7a', hat: 'bowler', hatColor: '#3a2e26', moustache: '#222' } },
  c6: { card: 'extra', home: [0.3, 3.85], c: { body: '#d9a441', hair: 'side', hairColor: '#7a3b1f', scale: 0.8, shoes: 'small' } },
  c7: { card: 'extra', home: [1.2, 3.3], c: { body: '#3f7f7a', hat: 'flat', hatColor: '#2e2e2e' } },
  c8: { card: 'extra', home: [2.1, 3.9], c: { body: '#8a6a9a', hat: 'bonnet', hatColor: '#f2d0d8', hatBand: '#a23b5a' } },
  c9: { card: 'extra', home: [3.0, 3.3], c: { body: '#7a4a2a', hat: 'bowler', hatColor: '#1e1e1e', glasses: true } },
  c10: { card: 'extra', home: [3.9, 3.85], c: { body: '#4f6d8f', hat: 'flat', hatColor: '#7a6a5a', moustache: '#6b4a2a' } },
  c11: { card: 'extra', home: [-3.8, 4.6], c: { body: '#5c7f3a', hat: 'flat', hatColor: '#3a3a3a' } },
  c12: { card: 'extra', home: [-2.0, 4.5], c: { body: '#a64b6b', hat: 'bonnet', hatColor: '#ffffff', hatBand: '#a64b6b' } },
  c13: { card: 'extra', home: [-0.2, 4.6], c: { body: '#3b5b7b', hat: 'top', hatColor: '#222' } },
  c14: { card: 'extra', home: [1.6, 4.5], c: { body: '#b8763a', hat: 'flat', hatColor: '#5a4a3a', beard: '#5a3a2a' } },
  c15: { card: 'extra', home: [3.4, 4.6], c: { body: '#6b6b8b', hat: 'bonnet', hatColor: '#d8e8c8', hatBand: '#4a7a3a' } },
  c16: { card: 'extra', home: [4.6, 4.4], c: { body: '#8b3a3a', hat: 'bowler', hatColor: '#2a2a2a', moustache: '#111' } },
};
export const crowdIds = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'kid'];
export const expertIds = ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10', 'e11', 'e12', 'e13'];
// two files out of the stable door: e1–e7 on the left (x -5.0), e8–e13 on the right (x -4.0)
const file = (i) => (i < 7 ? { x: -5.0, k: i, lag: 0 } : { x: -4.0, k: i - 7, lag: 0.31 });
const marchTo = (i) => { const f = file(i); return [f.x, -3.4 - f.lag - f.k * 0.62]; };
const marchFrom = (i) => { const [x, z] = marchTo(i); return [x, z - 4.6]; };

// ---------- the 16 beats ----------
// shot: { at, cam:[[x,y,z],[x,y,z]], look:[[..],[..]], fov:[a,b], ease, trans, hud, shake, captionY }
// trans: cut | whip | zoom | zoomout | pull | push | wipe | wipe:flare | wipe:paper | match | iris
export const beats = [
  { // 1
    line: 'He asked his horse what three plus two was.', min: 2.9, light: 'warm',
    shots: [{ at: 0, cam: [[0.6, 0.22, -0.15], [0.62, 0.24, -0.3]], look: [[1.02, 0.95, -2.0], [1.02, 0.97, -2.0]], fov: [70, 68], trans: 'cut' }],
    hans: { poise: [[0, 99]], expr: [[0, { brow: 0.3, mouth: 'smile', pupil: 0.6 }]] },
    acts: { eddie: [[0, 'chalkUp'], [0.35, 'ask', { talk: [0.35, 2.4] }], [1.6, 'askLean', { talk: [0.35, 2.4] }], [2.5, 'chalkUp']] },
    look: { eddie: 'hoof' },
  },
  { // 2
    line: 'The horse tapped his hoof five times.', min: 3.15, light: 'warm',
    shots: [
      { at: 0, cam: [[1.05, 0.55, 0.9], [1.0, 1.35, 0.55]], look: [[0.45, 0.5, -2], [0.75, 1.55, -2]], fov: [44, 46], trans: 'cut', ease: 'inout' },
      { at: 2.35, cam: [[1.0, 1.6, 0.4], [1.0, 1.6, 0.4]], look: [[0.8, 1.6, -2], [0.8, 1.6, -2]], fov: [40, 40], trans: 'cut', hud: { kind: 'hansPortrait', x: 0.5, y: 0.4, s: [0.7, 0.78] } },
    ],
    taps: { start: 0.08, n: 5, gap: 0.42, count: 'green' },
    hans: { expr: [[0, { brow: 0.2, mouth: 'smile' }], [1.6, { brow: 0.5, mouth: 'grin' }], [2.35, { head: 0.18, brow: 0.8, mouth: 'grin', blink: 0.55 }]], sparkle: 2.5 },
    acts: { eddie: [[0, 'watch'], [1.0, 'proud'], [2.0, 'present']] },
    sfx: [[2.4, 'ding']],
  },
  { // 3
    line: 'You see, in Berlin, over a hundred years ago, a maths teacher swore his horse could count.', min: 5.9, light: 'warm',
    shots: [{ at: 0, cam: [[0.75, 0.35, -0.95], [1.7, 2.7, 1.7]], look: [[0.45, 0.25, -2], [0.3, 1.2, -2.6]], fov: [55, 52], trans: 'pull', ease: 'inout', dur: 1.7, then: { cam: [1.7, 2.7, 1.7], cam2: [2.3, 4.0, 8.8], look: [0.3, 1.2, -2.6], look2: [0.3, 1.25, -2.6] } },
      { at: 'w:maths-0.1', cam: [[-0.95, 0.65, 1.9], [-0.7, 0.72, 1.5]], look: [[0.9, 1.5, -1.7], [0.95, 1.55, -1.7]], fov: [50, 46], trans: 'whip' }],
    acts: { eddie: [[0, 'present'], [1.8, 'proud'], [3.6, 'pointBoard'], [5.0, 'swear']] },
    hans: { expr: [[0, { head: 0.12, mouth: 'smile', brow: 0.4 }], [3.0, { head: 0.0, mouth: 'smile' }]] },
    mood: { crowd: 'watch' },
    sfx: [[0, 'whooshLong']],
  },
  { // 4
    line: 'His name was Hans. He could add. Subtract. Even tell the date.', min: 4.3, light: 'warm',
    shots: [
      { at: 0, cam: [[1.8, 1.8, 1.0], [1.9, 1.78, 0.75]], look: [[3.45, 1.72, -3.5], [3.45, 1.72, -3.5]], fov: [38, 36], trans: 'match' },
      { at: 'w:add-0.05', cam: [[0.75, 1.2, 2.7], [0.85, 1.25, 2.35]], look: [[1.3, 0.95, -2.5], [1.3, 1.0, -2.5]], fov: [54, 52], trans: 'match' },
      { at: 'w:Even-0.1', cam: [[1.4, 1.95, -4.4], [1.2, 2.0, -5.1]], look: [[1.0, 2.15, -8], [1.0, 2.15, -8]], fov: [42, 40], trans: 'whip' },
    ],
    board: [[0, ['2 + 1 = 3'], [0.0, 0.0]], [0.05, ['2 + 1 = 3'], [0.05, 1.1]], ['w:add-0.05', ['5 − 2 = ?'], [-1, -1]], ['w:Even', ['5 − 2 = 3'], [-1, -1]]],
    taps: { start: 'w:Subtract-0.05', n: 3, gap: 0.27, count: 'green' },
    pos: { eddie: [[0, [4.35, -3.05]], ['w:add-0.05', [2.45, -1.35]]] },
    acts: { eddie: [[0, 'write'], [0.7, 'writeB'], [1.25, 'presentL'], ['w:add', 'pointBoard'], ['w:Even', 'proud']] },
    hans: { expr: [[0, { mouth: 'smile' }], ['w:Even-0.1', { head: 0.15, brow: 0.6, mouth: 'grin' }]] },
    calendarSparkle: 'w:date',
    sfx: [[0.05, 'chalk', 1.0]],
  },
  { // 5
    line: 'Crowds packed the yard to watch, and he never charged a penny.', min: 4.3, light: 'warm',
    shots: [
      { at: 0, cam: [[0.6, 1.45, 0.4], [0.45, 1.5, 0.75]], look: [[-0.8, 1.45, 5], [-0.6, 1.5, 5]], fov: [52, 48], trans: 'whip' },
      { at: 'w:never-0.1', cam: [[-0.95, 1.0, 0.0], [-1.0, 0.95, 0.35]], look: [[-1.12, 0.62, 2.6], [-1.12, 0.62, 2.6]], fov: [44, 42], trans: 'whip', captionY: 0.82 },
    ],
    mood: { crowd: 'amazed' },
    pos: { eddie: [[0, [1.35, -1.55]]] },
    acts: { kid: [[0, 'point'], [1.4, 'cheer'], [2.4, 'pointUp']], c3: [[0, 'holdKid']], eddie: [[0, 'present']] },
    sfx: [[0.1, 'crowdGasp'], [0.0, 'crowdMurmur', 4.2]],
  },
  { // 6
    line: 'Even The New York Times wrote about him.', min: 2.8, light: 'warm',
    shots: [{ at: 0, cam: [[2.4, 3.2, 9.0], [2.3, 3.1, 8.6]], look: [[0.2, 1.3, -2.6], [0.2, 1.3, -2.6]], fov: [46, 44], trans: 'whip', hud: { kind: 'newspaper' } }],
    sfx: [[0.05, 'paper']],
  },
  { // 7
    line: 'But the scientists laughed.', line2: { text: 'A horse? Doing maths?', voice: 'expert', who: 'e3' }, min: 4.0, light: 'cool',
    shots: [{ at: 0, cam: [[-4.75, 1.6, 0.9], [-5.05, 1.5, 0.75]], look: [[-7.15, 1.5, 0.55], [-7.15, 1.5, 0.55]], fov: [56, 50], trans: 'zoomout' },
      { at: 'w2:Doing-0.12', cam: [[-4.5, 1.75, -0.05], [-4.7, 1.75, -0.1]], look: [[-7.15, 1.62, -0.2], [-7.15, 1.62, -0.2]], fov: [32, 30], trans: 'cut' }],
    mood: { table: 'laugh' },
    acts: { e3: [[0, 'laughBelly'], ['w2:A-0.05', 'skeptic', { talk: ['w2:A', 'end'] }], ['w2:Doing', 'pointSneer', { talk: ['w2:A', 'end'] }]], e4: [['w2:maths', 'gasp', { monoPop: 'w2:maths' }]] },
    sfx: [[0.2, 'laugh'], ['w2:maths', 'ping']],
  },
  { // 8
    line: 'So they sent thirteen experts to catch the trick.', min: 3.4, light: 'cool',
    shots: [{ at: 0, cam: [[-4.5, 1.25, -5.4], [-4.45, 0.32, -1.3]], look: [[-4.5, 1.4, -8.3], [-4.5, 1.8, -6.5]], fov: [58, 70], trans: 'push', ease: 'out', dur: 1.0, then: { cam: [-4.45, 0.32, -1.3], cam2: [-4.4, 0.3, -1.1], look: [-4.5, 1.75, -6.5], look2: [-4.5, 1.8, -6.5] } }],
    doors: [[0, 0], [0.55, 1]],
    march: { ids: expertIds, from: marchFrom, to: marchTo, delay: (i) => (i < 7 ? 0 : 0.12), start: 0.3, speed: 1.5 },
    sfx: [[0.05, 'creak'], [0, 'drumroll', 3.2]],
  },
  { // 9
    line: "They watched the teacher's hands. Nothing.", min: 2.9, light: 'cool',
    shots: [
      { at: 0, cam: [[-1.5, 1.6, 0.6], [-1.6, 1.62, 0.5]], look: [[-3.5, 1.6, -4.5], [-3.5, 1.6, -4.5]], fov: [50, 48], trans: 'cut', hud: { kind: 'eyes', ids: ['e9', 'e1', 'e5'] } },
      { at: 'w:Nothing-0.25', cam: [[2.1, 0.95, 0.15], [2.05, 0.95, 0.0]], look: [[1.35, 0.78, -1.55], [1.35, 0.8, -1.55]], fov: [42, 40], trans: 'cut' },
    ],
    pos: { eddie: [[0, [1.35, -1.55]]] },
    acts: { eddie: [[0, 'handsStill'], ['w:Nothing', 'handsStillShrug']], e1: [[0, 'skeptic']] },
    sfx: [['w:Nothing', 'tick']],
  },
  { // 10
    line: 'They asked the questions themselves. Hans still got them right.', min: 4.2, light: 'cool',
    shots: [{ at: 0, cam: [[3.35, 1.95, 1.55], [3.15, 1.9, 1.2]], look: [[0.95, 1.5, -2.0], [1.0, 1.45, -2.0]], fov: [48, 44], trans: 'cut' }],
    pos: { e1: [[0, [1.95, -0.9]]], eddie: [[0, [3.35, -1.2]]] },
    bubble: { who: 'e1', text: '3 + 1 ?', from: 0.15, to: 'w:Hans' },
    taps: { start: 'w:still-0.05', n: 4, gap: 0.24, count: 'green' },
    acts: { e1: [[0, 'ask'], ['w:Hans', 'watch'], ['w:right-0.1', 'gasp', { icon: '!' }]], eddie: [[0, 'handsStill'], ['w:right', 'proud']] },
    look: { e1: 'hans' },
    hans: { expr: [[0, { mouth: 'smile', pupil: 0.8 }], ['w:right', { head: 0.12, mouth: 'grin', brow: 0.6 }]] },
    sfx: [[0.15, 'pop']],
  },
  { // 11
    line: 'Their verdict: no trick at all.', min: 2.7, light: 'cool',
    shots: [
      { at: 0, cam: [[-6.0, 2.35, 1.6], [-6.05, 2.28, 1.55]], look: [[-6.25, 1.0, 1.26], [-6.25, 1.0, 1.26]], fov: [42, 40], trans: 'cut', hud: { kind: 'stamp', at: 'w:no-0.05', text: 'NO TRICK' } },
      { at: 'w:all-0.05', cam: [[0.8, 1.55, 0.8], [0.7, 1.6, 1.05]], look: [[-0.4, 1.6, 5], [-0.3, 1.65, 5]], fov: [54, 50], trans: 'whip' },
    ],
    mood: { crowd: 'cheer' },
    sfx: [['w:no-0.05', 'stamp'], ['w:all', 'cheer']],
  },
  { // 12
    line: 'Then a young student named Oskar tried one more thing.', min: 3.5, light: 'warm',
    shots: [{ at: 0, cam: [[-0.35, 1.6, 2.5], [-0.55, 1.55, 1.85]], look: [[-0.8, 1.5, 0.2], [-0.8, 1.55, 0.2]], fov: [52, 44], trans: 'cut', ease: 'inout' }],
    show: ['oskar'],
    screen: [[0, 2.1]], // the folding screen already stands in the yard; the questioner walks behind it (beats 12–15)
    pos: { oskar: [[0, [-1.2, 0.6]], [0.9, [-0.85, 0.25], "walk"]], e1: [[0, [-3.0, -4.6]]], eddie: [[0, [1.35, -1.55]]] },
    acts: { oskar: [[0, 'notes'], ['w:Oskar-0.1', 'pushGlasses'], ['w:one', 'pointUpOne']] },
    sfx: [[0.1, 'steps2']],
  },
  { // 13
    line: "He hid the person asking, where Hans couldn't see them.", min: 3.5, light: 'spot',
    shots: [{ at: 0, cam: [[-0.7, 2.2, 2.9], [-0.5, 2.15, 2.5]], look: [[1.7, 1.25, -1.3], [1.75, 1.25, -1.3]], fov: [54, 52], trans: 'whip' },
      { at: 'w:where-0.1', cam: [[-1.3, 3.45, -3.7], [-1.15, 3.35, -3.5]], look: [[2.1, 1.05, -1.25], [2.1, 1.05, -1.25]], fov: [50, 48], trans: 'cut' }],
    pos: { e1: [[0, [1.3, 0.2]], [0.3, [1.3, 0.2]], [1.05, [2.05, 0.15], 'walk'], [1.9, [3.0, -1.1], 'walk']], oskar: [[0, [-0.6, -0.4]]], eddie: [[0, [-2.0, -0.7]]] },
    acts: { oskar: [[0, 'pointRight'], [1.5, 'notes']], e1: [[0, 'watch'], [2.0, 'ask'], [2.8, 'askB']], eddie: [[0, 'worried']] },
    look: { e1: 'hans' },
    hans: { expr: [[0, { mouth: 'neutral', pupil: 0.8 }], [1.4, { mouth: 'neutral', pupil: -0.3, brow: -0.1 }]] },
    sfx: [[0.35, 'spotClunk'], [0.3, 'drone', 9], [0.4, 'steps2'], [1.2, 'steps2']],
  },
  { // 14
    line: 'Suddenly, the genius horse got almost everything wrong.', min: 3.9, light: 'spot',
    shots: [
      { at: 0, cam: [[0.65, 1.15, 1.45], [0.75, 1.3, 0.95]], look: [[0.35, 1.05, -2.0], [0.55, 1.35, -2]], fov: [56, 54], trans: 'cut', shake: 0.008 },
      { at: 'w:almost-0.1', cam: [[0.4, 1.5, 0.9], [0.3, 1.55, 1.15]], look: [[-0.6, 1.5, 5], [-0.6, 1.5, 5]], fov: [50, 46], trans: 'whip' },
      { at: 'w:wrong-0.15', cam: [[-1.0, 1.55, 1.55], [-1.1, 1.55, 1.3]], look: [[-2.0, 1.35, -0.7], [-2.0, 1.35, -0.7]], fov: [40, 38], trans: 'cut' },
    ],
    taps: { start: 0.12, n: 9, gap: 0.21, count: 'red' },
    mood: { crowd: 'gasp' },
    acts: { eddie: [[0, 'worried'], ['w:wrong-0.2', 'sweat']] },
    hans: { expr: [[0, { brow: -0.4, mouth: 'wobbly', pupil: -0.6, sweat: 1 }], [1.0, { brow: 1, mouth: 'wobbly', pupil: 0.6, sweat: 1 }]] },
    sfx: [['w:almost', 'crowdGasp']],
  },
  { // 15
    line: "Because as the taps reached the right number, people's faces relaxed, without them knowing.", min: 5.6, light: 'spot',
    shots: [
      { at: 0, cam: [[3.9, 1.7, 0.4], [3.8, 1.7, 0.2]], look: [[3.0, 1.5, -1.1], [3.0, 1.5, -1.1]], fov: [44, 42], trans: 'cut', hud: { kind: 'face', who: 'e1', x: 0.5, y: 0.4, s: [3.3, 3.6] } },
      { at: "w:faces-0.15", cam: [[1.2, 2.0, -1.2], [1.1, 2.0, -1.4]], look: [[0.95, 2.0, -2], [0.95, 2.0, -2]], fov: [30, 28], trans: 'zoom', hud: { kind: 'eye', s: [1.0, 1.08] } },
    ],
    acts: { e1: [[0, 'tense'], ['w:right-0.05', 'relaxed'], ['w:faces', 'relaxed']] },
    reflect: { tense: 0, relax: 'w:relaxed' },
    sfx: [['w:right', 'tick']],
  },
  { // 16
    line: "Hans wasn't reading numbers. He was reading faces.", min: 3.9, light: 'warm',
    shots: [
      { at: 0, cam: [[1.0, 1.6, 0.3], [1.0, 1.6, 0.3]], look: [[0.8, 1.6, -2], [0.8, 1.6, -2]], fov: [40, 40], trans: 'zoomout', hud: { kind: 'hansPortrait', x: 0.5, y: 0.4, s: [0.84, 0.74], camLook: true } },
      { at: 'w:He-0.1', cam: [[0.56, 0.28, -0.65], [0.6, 0.22, -0.15]], look: [[1.02, 0.99, -2.0], [1.02, 0.95, -2.0]], fov: [66, 70], trans: 'cut', ease: 'out' },
    ],
    hans: { poise: [['w:He-0.1', 99]], expr: [[0, { brow: 0.6, mouth: 'smug', pupil: 0, camLook: 1 }], ['w:He-0.1', { brow: 0.3, mouth: 'smile', pupil: 0.6 }]] },
    pos: { eddie: [[0, [1.35, -1.55]]], e1: [[0, [-3.0, -4.6]]] },
    screen: [[0, 40]], // screen cleared away again
    acts: { eddie: [[0, 'chalkUp']] },
    look: { eddie: 'hoof' },
  },
];
