/**
 * Creates an action handler API.
 */
class Conditioner {
  /**
   * @param {Map} conditions conditions
   */
  constructor(conditions) {
    this.conditions = conditions || new Map();
  }

  /**
   * @param {string} name The name of the registered conditioner.
   * @param {Function} conditioner The registered conditioner.
   * @param {number} priority conditioner priority
   * @return {Conditioner}
   */
  addConditioner(name, conditioner, priority = 1) {
    if (typeof conditioner !== 'function') {
      throw new Error(`Conditioners need to be of type function. Received: '${typeof conditioner}'`);
    }

    this.conditions.set(name, {
      priority,
      conditioner,
    });
    return this;
  }

  /**
   * @param {string} name The name of the registered conditioner.
   * @return {Conditioner}
   */
  removeConditioner(name) {
    if (!this.conditions.has(name)) {
      return this;
    }

    this.conditions.delete(name);
    return this;
  }

  /**
   * @param {string} name The name of the conditioner to eliminate.
   * @return {Conditioner} new instance with cloned conditions
   */
  without(name) {
    const clonedConditions = new Map(this.conditions);

    if (clonedConditions.has(name)) {
      clonedConditions.delete(name);
    }
    return new Conditioner(clonedConditions);
  }

  /**
   * Resolves if all conditions are fulfilled.
   * @return {Promise}
   */
  check() {
    return new Promise(async (resolve, reject) => {
      const sorted = Array.from(this.conditions.values())
        .sort((a, b) => {
          if (a.priority === b.priority) {
            return 0;
          }
          return a.priority < b.priority ? -1 : 1;
        });

      try {
        for (let i = 0; i < sorted.length; i += 1) {
          const condition = sorted[i];

          // eslint-disable-next-line no-await-in-loop
          const conditionResult = await condition.conditioner();
          if (conditionResult === false) {
            return resolve(false);
          }
        }
        return resolve(true);
      } catch (error) {
        return reject(error);
      }
    });
  }
}

export default Conditioner;
