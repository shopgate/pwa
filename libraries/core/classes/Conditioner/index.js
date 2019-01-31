import logger from '../../helpers';
/**
 * Creates an action handler API.
 */
class Conditioner {
  conditioners = new Map();

  /**
   * @param {string} name The name of the registered conditioner.
   * @param {Function} conditioner The registered conditioner.
   * @return {Conditioner}
   */
  addConditioner(name, conditioner) {
    if (typeof conditioner !== 'function') {
      throw new Error(`Conditioners need to be of type function. Received: '${typeof conditioner}'`);
    }

    this.conditioners.set(name, conditioner);
    return this;
  }

  /**
   * @param {string} name The name of the registered conditioner.
   * @return {Conditioner}
   */
  removeConditioner(name) {
    if (!this.conditioners.has(name)) {
      logger.warn(`Couldn't remove conditioner. '${name}' no found.`);
      return this;
    }

    this.conditioners.delete(name);
    return this;
  }

  /**
   * Resolves if all conditions are fullfilled.
   * @return {Promise}
   */
  check() {
    return new Promise((resolve, reject) => {
      try {
        const conditions = [];

        this.conditioners.forEach((conditioner) => {
          conditions.push(conditioner());
        });

        return resolve(!conditions.includes(false));
      } catch (error) {
        return reject(error);
      }
    });
  }
}

export default Conditioner;
