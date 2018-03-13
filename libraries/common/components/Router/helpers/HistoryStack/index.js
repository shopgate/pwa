import EventEmitter from 'events';
import {
  HISTORY_PUSH_ACTION,
  HISTORY_POP_ACTION,
  HISTORY_REPLACE_ACTION,
} from '../../../../constants/ActionTypes';

/**
 * Manges the full history stack
 */
class HistoryStack extends EventEmitter {
  /**
   * Event is executed when an entry was removed
   * @type {string}
   */
  static EVENT_ENTRY_REMOVED = 'EVENT_ENTRY_REMOVED';

  /**
   * Event is executed when an entry was removed
   * @type {string}
   */
  static EVENT_ENTRY_ADDED = 'EVENT_ENTRY_ADDED';

  /**
   * Event is executed when an entry got inactive (not on top anymore)
   * @type {string}
   */
  static EVENT_ENTRY_INACTIVE = 'EVENT_ENTRY_INACTIVE';

  /**
   * Event is executed when an entry got active (moved to top)
   * @type {string}
   */
  static EVENT_ENTRY_ACTIVE = 'EVENT_ENTRY_ACTIVE';

  /**
   * Event is executed when a entry changed its values
   * @type {string}
   */
  static EVENT_ENTRY_CHANGED = 'EVENT_ENTRY_CHANGED';

  /**
   * Initializes the HistoryStack class.
   * @param {Object} initialEntry The first entry in the history stack.
   */
  constructor(initialEntry) {
    super();
    this.stack = [];
    this.stack.push(initialEntry);
  }

  /**
   * Searches a history entry by its key.
   * @param {string} key The unique location key.
   * @returns {number}
   */
  findHistoryIndexByKey = key => this.stack.findIndex(e => e.key === key);

  /**
   * Returns the active history entry.
   * @returns {Object}
   */
  getActive = () => this.stack[this.stack.length - 1];

  /**
   * Returns the history length.
   * @returns {number}
   */
  getLength = () => this.stack.length;

  /**
   * Updates the last stack entry
   * @param {Object} newEntry The new stack entry
   */
  updateStack(newEntry) {
    this.stack[this.stack.length - 1] = newEntry;
  }

  /**
   * Applies a real history change to this history stack.
   * @param {string} action The action that caused history change (PUSH, POP, REPLACE)
   * @param {Object} location The location object.
   */
  applyChange(action, location) {
    switch (action) {
      case HISTORY_PUSH_ACTION: {
        // Add a new history entry.
        const updatedLocation = {
          ...location,
          immutableKey: location.key,
        };
        this.stack.push(updatedLocation);

        this.emit(HistoryStack.EVENT_ENTRY_ADDED, updatedLocation);
        this.emit(HistoryStack.EVENT_ENTRY_INACTIVE, this.stack[this.stack.length - 2]);
        break;
      }

      case HISTORY_REPLACE_ACTION: {
        /**
         * Replace causes the key to be changed. This only causes confusion
         * therefore HistoryStack provides an additional immutableKey that will never change.
         */
        const before = this.stack[this.stack.length - 1];

        if (before.pathname !== location.pathname) {
          const updatedLocation = {
            ...location,
            immutableKey: location.key,
          };

          this.updateStack(updatedLocation);

          this.emit(HistoryStack.EVENT_ENTRY_REMOVED, before);
          this.emit(HistoryStack.EVENT_ENTRY_ADDED, updatedLocation);
        } else {
          this.updateStack({
            ...location,
            immutableKey: before.immutableKey,
          });
        }

        this.emit(
          HistoryStack.EVENT_ENTRY_CHANGED,
          this.stack[this.stack.length - 1],
          before
        );
        break;
      }

      case HISTORY_POP_ACTION: {
        /**
         * Pop all history entries up to the one we are looking for
         * and fire an event for each entry that was removed.
         */
        const targetIndex = this.findHistoryIndexByKey(location.key || 'root');
        if (targetIndex === -1) {
          // When going back to a page that is no longer stored push it instead.
          this.applyChange(HISTORY_PUSH_ACTION, location);
          return;
        }

        // Clean the stack and store removed entries.
        const removedEntries = this.stack
          .slice(targetIndex + 1, this.stack.length);
        this.stack = this.stack.slice(0, targetIndex + 1);

        // Notify removed entries.
        removedEntries.forEach(target => this.emit(HistoryStack.EVENT_ENTRY_REMOVED, target));

        // Active changed
        this.emit(HistoryStack.EVENT_ENTRY_ACTIVE, this.stack[this.stack.length - 1]);
        break;
      }

      default:
        break;
    }
  }
}

export default HistoryStack;
