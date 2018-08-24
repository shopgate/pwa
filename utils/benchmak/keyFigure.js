export const KEY_FIGURE_MODE_ADD = 'add';
export const KEY_FIGURE_MODE_SUB = 'sub';

export const KEY_FIGURE_METHOD_COUNT = 'count';
export const KEY_FIGURE_METHOD_TIME = 'time';
export const KEY_FIGURE_METHOD_OBSERVER = 'observer';

/**
 * Class
 */
export default class KeyFigure {
  /**
   * Init
   * @param {string} mode Append mode.
   * @param {string} method Method.
   * @param {bool} calculateExclusive  Whether exclusive key figure needs to be calculated.
   */
  constructor(mode, method, calculateExclusive = true) {
    this.mode = mode;
    this.method = method;
    this.calculateExclusive = calculateExclusive;
    this.measure = {
      exclusiveTimers: [],
      timings: {},
      observers: {},
      inclusive: {},
      exclusive: {},
    };
  }

  /**
   * Starts measuring.
   * @param {string} key Unique identifier for action.
   */
  startMeasure(key) {
    if (typeof this.measure.inclusive[key] === 'undefined') {
      this.measure.inclusive[key] = this.method !== KEY_FIGURE_METHOD_OBSERVER ? 0 : {};
      this.measure.exclusive[key] = this.method !== KEY_FIGURE_METHOD_OBSERVER ? 0 : {};
    }

    if (this.method === KEY_FIGURE_METHOD_TIME) {
      this.measure.timings[key] = this.measure.timings[key] || [];
      this.measure.timings[key].push({
        start: performance.now(),
        stop: null,
        others: {},
      });
    }

    if (this.method === KEY_FIGURE_METHOD_OBSERVER) {
      // Create observer and start observing.
      const observer = {
        instance: new PerformanceObserver(() => {}),
        events: [],
      };
      observer.instance.observe({
        entryTypes: ['measure', 'paint', 'navigation', 'resource'],
      });

      this.measure.observers[key] = this.measure.observers[key] || [];
      this.measure.observers[key].push(observer);
    }
  }

  /**
   * Stops measuring.
   * @param {string} key Unique key.
   */
  stopMeasure(key) {
    if (this.method === KEY_FIGURE_METHOD_COUNT) {
      this.measure.inclusive[key] += 1;
      this.measure.exclusive[key] += 1;
    }

    if (this.method === KEY_FIGURE_METHOD_OBSERVER) {
      const { instance } = this.measure.observers[key].pop();
      const events = instance.takeRecords();
      instance.disconnect(); // Stops observing

      const renders = events
        .filter(event => event.entryType === 'measure')
        .filter(event => event.name.endsWith('[update]'))
        .map(event => ({
          duration: event.duration,
          componentName: event.name.replace('⚛', '').replace(/ /g, '').replace('[update]', ''),
        }));
      const mounts = events
        .filter(event => event.entryType === 'measure')
        .filter(event => event.name.endsWith('.componentDidMount'))
        .map(event => ({
          duration: event.duration,
          componentName: event.name.replace('⚛', '').replace(/ /g, '').replace('.componentDidMount', ''),
        }));

      // Process renders.
      renders.forEach(({ componentName, duration }) => {
        this.measure.inclusive[key][componentName] = this.measure.inclusive[key][componentName] || {
          render: 0,
          renderTime: 0,
          mount: 0,
          mountTime: 0,
        };

        const comp = this.measure.inclusive[key][componentName];
        comp.render += 1;
        comp.renderTime += duration;
      });

      // Process mounts
      mounts.forEach(({ componentName, duration }) => {
        this.measure.inclusive[key][componentName] = this.measure.inclusive[key][componentName] || {
          render: 0,
          renderTime: 0,
          mount: 0,
          mountTime: 0,
        };

        const comp = this.measure.inclusive[key][componentName];
        comp.mount += 1;
        comp.mountTime += duration;
      });
    }

    if (this.method === KEY_FIGURE_METHOD_TIME) {
      // Add inclusive timer.
      const timing = this.measure.timings[key].pop();
      const time = performance.now() - timing.start;

      // Add exclusive timer.
      this.measure.exclusiveTimers.push({ key, time });

      // Calculate measure.
      const currentMeasure = {
        inclusive: time,
        exclusive: time,
      };

      // Calculate exclusive
      if (this.measure.exclusiveTimers.length >= 2) {
        const [first, ...remaining] = this.measure.exclusiveTimers;
        this.measure.exclusiveTimers = remaining;
        currentMeasure.exclusive -= first.time;

        // Reset if callstack reached last call.
        if (this.measure.exclusiveTimers.length === 1) {
          this.measure.exclusiveTimers = [];
        }
      }

      this.measure.inclusive[key] += currentMeasure.inclusive;
      this.measure.exclusive[key] += currentMeasure.exclusive;
    }
  }
}
