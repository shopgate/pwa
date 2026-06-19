const { CLEANUP_SAFETY } = require('../timing');

jest.mock('react-dom');
jest.mock('../Overlay', () => ({ __esModule: true, default: () => null }));
jest.mock('../helpers', () => ({
  prefersReducedMotion: jest.fn(() => false),
}));

const VALID_RECT = {
  top: 10, left: 20, width: 100, height: 200,
};

/**
 * Builds a fresh fake clone adapter of plain jest.fn methods.
 * @returns {Object} The fake clone adapter.
 */
const makeClone = () => ({
  render: jest.fn(),
  fly: jest.fn(),
  fade: jest.fn(),
  remove: jest.fn(),
});

/**
 * Builds a fresh fake hero adapter of plain jest.fn methods.
 * @param {Object} [rect] The rect returned by getRect.
 * @returns {Object} The fake hero adapter.
 */
const makeHero = (rect = VALID_RECT) => ({
  setHidden: jest.fn(),
  getRect: jest.fn(() => rect),
});

describe('theme-ios11 > components > HeroTransition > flight', () => {
  let flight;
  let prefersReducedMotion;

  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();
    // eslint-disable-next-line global-require
    flight = require('../flight');
    // eslint-disable-next-line global-require
    ({ prefersReducedMotion } = require('../helpers'));
    prefersReducedMotion.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should hide the hero, render and fly when a hero is already registered', () => {
    const clone = makeClone();
    const hero = makeHero();

    flight.registerClone(clone);
    flight.registerHero(hero);

    flight.capture({ sourceRect: VALID_RECT, src: 'a.jpg', productId: 'p1' });

    expect(hero.setHidden).toHaveBeenCalledWith(true);
    expect(clone.render).toHaveBeenCalledWith({ src: 'a.jpg', sourceRect: VALID_RECT });
    expect(clone.fly).toHaveBeenCalledWith(VALID_RECT);
    expect(flight.isFlightPending()).toBe(true);
  });

  it('should tear down on settle: remove clone, reveal hero, no longer pending', () => {
    const clone = makeClone();
    const hero = makeHero();

    flight.registerClone(clone);
    flight.registerHero(hero);
    flight.capture({ sourceRect: VALID_RECT, src: 'a.jpg', productId: 'p1' });

    flight.settle();

    expect(clone.remove).toHaveBeenCalledTimes(1);
    expect(hero.setHidden).toHaveBeenLastCalledWith(false);
    expect(flight.isFlightPending()).toBe(false);
  });

  it('should replay render + fly when the clone registers late', () => {
    const hero = makeHero();
    const clone = makeClone();

    flight.registerHero(hero);
    flight.capture({ sourceRect: VALID_RECT, src: 'a.jpg', productId: 'p1' });

    // Now flying with no clone yet; late clone registration replays.
    flight.registerClone(clone);

    expect(clone.render).toHaveBeenCalledWith({ src: 'a.jpg', sourceRect: VALID_RECT });
    expect(clone.fly).toHaveBeenCalledWith(VALID_RECT);
  });

  it('should arm the fallback then fly when the hero registers late', () => {
    const clone = makeClone();
    const hero = makeHero();

    flight.registerClone(clone);
    flight.capture({ sourceRect: VALID_RECT, src: 'a.jpg', productId: 'p1' });

    // No hero at capture: fallback armed, clone not flying yet.
    expect(clone.fly).not.toHaveBeenCalled();

    flight.registerHero(hero);

    expect(hero.setHidden).toHaveBeenCalledWith(true);
    expect(clone.fly).toHaveBeenCalledWith(VALID_RECT);

    // Fallback was cancelled: advancing past TARGET_TIMEOUT does not fade.
    jest.advanceTimersByTime(2000);
    expect(clone.fade).not.toHaveBeenCalled();
  });

  it('should be a no-op when prefers-reduced-motion is set', () => {
    prefersReducedMotion.mockReturnValue(true);

    const clone = makeClone();
    const hero = makeHero();

    flight.registerClone(clone);
    flight.registerHero(hero);

    // setHidden may be called by registerHero only when captured; here it is
    // idle, so registering must not hide. Clear to isolate capture behaviour.
    hero.setHidden.mockClear();

    flight.capture({ sourceRect: VALID_RECT, src: 'a.jpg', productId: 'p1' });

    expect(clone.render).not.toHaveBeenCalled();
    expect(hero.setHidden).not.toHaveBeenCalled();
    expect(flight.isFlightPending()).toBe(false);
  });

  it('should tear down only once when settle is called twice', () => {
    const clone = makeClone();
    const hero = makeHero();

    flight.registerClone(clone);
    flight.registerHero(hero);
    flight.capture({ sourceRect: VALID_RECT, src: 'a.jpg', productId: 'p1' });

    flight.settle();
    flight.settle();

    expect(clone.remove).toHaveBeenCalledTimes(1);
  });

  // BUG 1 regression: a second capture must cancel the prior flight's timers so
  // a stale timer cannot tear down the new (re-armed) flight prematurely.
  it('should not let a stale timer from a prior capture tear down a new flight', () => {
    const clone = makeClone();

    flight.registerClone(clone);

    // Flight A: no hero -> arms the no-target fallback timer.
    flight.capture({ sourceRect: VALID_RECT, src: 'a.jpg', productId: 'p1' });

    // Flight B begins before A settles; this must cancel A's armed timer.
    flight.capture({ sourceRect: VALID_RECT, src: 'b.jpg', productId: 'p2' });

    // Advance well past both TARGET_TIMEOUT and CLEANUP_SAFETY. Flight B has no
    // hero, so its own fallback fires (fade + post-fade settle), tearing it down
    // exactly once -- not twice, and not preempted by A's stale timer.
    jest.advanceTimersByTime(2000);

    expect(clone.fade).toHaveBeenCalledTimes(1);
    expect(clone.remove).toHaveBeenCalledTimes(1);
    expect(flight.isFlightPending()).toBe(false);
  });

  // BUG 2 regression: registering the hero twice must not leak the first
  // reveal timer, and unregister must clear the active one.
  it('should not leak a hero-reveal timer when registerHero runs twice', () => {
    const clone = makeClone();
    const heroA = makeHero();
    const heroB = makeHero();

    flight.registerClone(clone);
    flight.registerHero(heroA);
    // heroA armed one reveal-safety timer. Registering heroB must CLEAR heroA's
    // before arming its own, so the live timer count stays at exactly one. A
    // leak (the bug) would leave two armed timers here.
    expect(jest.getTimerCount()).toBe(1);
    const unregisterB = flight.registerHero(heroB);
    expect(jest.getTimerCount()).toBe(1);

    flight.capture({ sourceRect: VALID_RECT, src: 'a.jpg', productId: 'p1' });

    // heroB is the active hero: hidden on capture, then flown.
    expect(heroB.setHidden).toHaveBeenCalledWith(true);

    // Advance past HERO_REVEAL_SAFETY. The first (heroA) timer must have been
    // cleared, so only the active hero's backstop can reveal -- and heroA's
    // setHidden(false) backstop must never fire from a leaked timer.
    jest.advanceTimersByTime(1500);

    expect(heroA.setHidden).not.toHaveBeenCalledWith(false);

    // Unregister clears the active reveal timer; advancing further is a no-op.
    unregisterB();
    heroB.setHidden.mockClear();
    jest.advanceTimersByTime(5000);
    expect(heroB.setHidden).not.toHaveBeenCalled();
  });

  // BUG 3 regression: the cleanup-safety backstop measures from fly-start, so a
  // missed transitionend still tears the flight down at CLEANUP_SAFETY.
  it('should settle at CLEANUP_SAFETY after fly-start when transitionend never arrives', () => {
    const clone = makeClone();
    const hero = makeHero();

    flight.registerClone(clone);
    flight.registerHero(hero);
    flight.capture({ sourceRect: VALID_RECT, src: 'a.jpg', productId: 'p1' });

    expect(clone.fly).toHaveBeenCalledWith(VALID_RECT);

    // No settle() from the clone (simulating a missed transitionend). Just
    // before CLEANUP_SAFETY (450ms) nothing has torn down yet.
    jest.advanceTimersByTime(449);
    expect(clone.remove).not.toHaveBeenCalled();
    expect(flight.isFlightPending()).toBe(true);

    // At CLEANUP_SAFETY the backstop fires.
    jest.advanceTimersByTime(1);
    expect(clone.remove).toHaveBeenCalledTimes(1);
    expect(flight.isFlightPending()).toBe(false);
  });

  // BUG 3 regression: with NO hero, the 600ms TARGET_TIMEOUT fade fallback runs
  // and is not preempted by a premature hard settle before 600ms.
  it('should run the fade fallback at TARGET_TIMEOUT when no hero ever arrives', () => {
    const clone = makeClone();

    flight.registerClone(clone);
    flight.capture({ sourceRect: VALID_RECT, src: 'a.jpg', productId: 'p1' });

    // Before TARGET_TIMEOUT (600ms): no premature settle, no fade yet.
    jest.advanceTimersByTime(599);
    expect(clone.fade).not.toHaveBeenCalled();
    expect(clone.remove).not.toHaveBeenCalled();

    // At TARGET_TIMEOUT the fade fallback runs (not a hard settle).
    jest.advanceTimersByTime(1);
    expect(clone.fade).toHaveBeenCalledTimes(1);
    expect(clone.remove).not.toHaveBeenCalled();

    // The post-fade settle then tears it down.
    jest.advanceTimersByTime(CLEANUP_SAFETY);
    expect(clone.remove).toHaveBeenCalledTimes(1);
    expect(flight.isFlightPending()).toBe(false);
  });
});
