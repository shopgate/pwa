/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  HISTORY_PUSH_ACTION,
  HISTORY_POP_ACTION,
  HISTORY_REPLACE_ACTION,
} from '../../../../constants/ActionTypes';
import HistoryStack from './index';

describe('HistoryStack', () => {
  it('should trigger added and inactive event when history entry was added', () => {
    const stack = new HistoryStack({ key: 'root' });
    const addedSpy = jest.fn();
    const inactiveSpy = jest.fn();

    stack.on(HistoryStack.EVENT_ENTRY_ADDED, addedSpy);
    stack.on(HistoryStack.EVENT_ENTRY_INACTIVE, inactiveSpy);
    stack.applyChange(HISTORY_PUSH_ACTION, { key: '123' });

    expect(addedSpy).toHaveBeenCalledTimes(1);
    expect(addedSpy).toHaveBeenLastCalledWith({
      immutableKey: '123',
      key: '123',
    });
    expect(inactiveSpy).toHaveBeenCalledTimes(1);
    expect(inactiveSpy).toHaveBeenLastCalledWith({ key: 'root' });
  });

  it('should trigger removed event for all previous entries', () => {
    const stack = new HistoryStack({ key: 'root' });
    const removedSpy = jest.fn();
    const activeSpy = jest.fn();

    // Navigate 3 pages forward
    stack.applyChange(HISTORY_PUSH_ACTION, { key: '123' });
    stack.applyChange(HISTORY_PUSH_ACTION, { key: '456' });
    stack.applyChange(HISTORY_PUSH_ACTION, { key: '789' });

    // Navigate back to the first (-2)
    stack.on(HistoryStack.EVENT_ENTRY_REMOVED, removedSpy);
    stack.on(HistoryStack.EVENT_ENTRY_ACTIVE, activeSpy);
    stack.applyChange(HISTORY_POP_ACTION, {
      immutableKey: '123',
      key: '123',
    });

    // Pop should have been called on all old routes.
    expect(removedSpy).toHaveBeenCalledTimes(2);
    expect(removedSpy).toHaveBeenCalledWith({
      immutableKey: '789',
      key: '789',
    });
    expect(removedSpy).toHaveBeenCalledWith({
      immutableKey: '456',
      key: '456',
    });

    // Active should be the first entry again.
    expect(activeSpy).toHaveBeenCalledTimes(1);
    expect(activeSpy).toHaveBeenCalledWith({
      immutableKey: '123',
      key: '123',
    });
  });

  it('should not mutate the immutableKey when replacing history', () => {
    const stack = new HistoryStack({ key: 'root' });
    const changedSpy = jest.fn();

    stack.on(HistoryStack.EVENT_ENTRY_CHANGED, changedSpy);
    stack.applyChange(HISTORY_PUSH_ACTION, { key: '123' });
    stack.applyChange(HISTORY_REPLACE_ACTION, { key: '456' });

    expect(stack.getActive().key).toEqual('456');
    expect(stack.getActive().immutableKey).toEqual('123');

    expect(changedSpy).toHaveBeenCalledTimes(1);
    expect(changedSpy).toHaveBeenCalledWith(
      {
        immutableKey: '123',
        key: '456',
      },
      {
        immutableKey: '123',
        key: '123',
      }
    );
  });

  it('should allow history changes inside the event handler', () => {
    const stack = new HistoryStack({ key: 'root' });

    /**
     * Replaces history immediately after adding.
     */
    const added = () => {
      stack.applyChange(HISTORY_REPLACE_ACTION, { key: '123' });
    };

    /**
     * Replaces history immediately after removing.
     */
    const removed = () => {
      stack.applyChange(HISTORY_REPLACE_ACTION, { key: '456' });
    };

    stack.on(HistoryStack.EVENT_ENTRY_ADDED, added);
    stack.on(HistoryStack.EVENT_ENTRY_REMOVED, removed);

    stack.applyChange(HISTORY_PUSH_ACTION, { key: 'x123' });
    stack.applyChange(HISTORY_PUSH_ACTION, { key: 'foo' });
    stack.applyChange(HISTORY_POP_ACTION, { key: '123' });

    expect(stack.stack).toEqual([
      { key: 'root' },
      { immutableKey: 'x123', key: '456' },
    ]);
  });
});
