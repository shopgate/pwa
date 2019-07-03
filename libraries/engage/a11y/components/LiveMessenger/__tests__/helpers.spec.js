import { UIEvents } from '../../../../core';
import { broadcastLiveMessage } from '../helpers';
import {
  EVENT_LIVE_MESSAGE,
  LIVE_MESSAGE_TYPE_POLITE,
  LIVE_MESSAGE_TYPE_ASSERTIVE,
} from '../constants';

jest.mock('../../../../core', () => ({
  UIEvents: {
    emit: jest.fn(),
  },
}));

describe('LiveMessenger helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('broadcastLiveMessage()', () => {
    const message = 'My Message';
    const defaultOptions = {
      type: LIVE_MESSAGE_TYPE_POLITE,
      params: null,
      id: null,
      force: false,
    };

    it('should not broadcast without a message', () => {
      broadcastLiveMessage();
      expect(UIEvents.emit).not.toHaveBeenCalled();
    });

    it('should broadcast with default options', () => {
      broadcastLiveMessage(message);
      expect(UIEvents.emit).toHaveBeenCalledTimes(1);
      expect(UIEvents.emit).toHaveBeenCalledWith(EVENT_LIVE_MESSAGE, message, defaultOptions);
    });

    it('should broadcast with some options', () => {
      const options = {
        type: LIVE_MESSAGE_TYPE_ASSERTIVE,
        params: { some: 'params' },
        id: 'some-id',
      };

      broadcastLiveMessage(message, options);
      expect(UIEvents.emit).toHaveBeenCalledTimes(1);
      expect(UIEvents.emit).toHaveBeenCalledWith(EVENT_LIVE_MESSAGE, message, {
        ...options,
        force: false,
      });
    });

    it('should broadcast an empty message when the FORCE option is set', (done) => {
      const options = {
        force: true,
      };

      broadcastLiveMessage(message, options);
      setTimeout(() => {
        expect(UIEvents.emit).toHaveBeenCalledTimes(2);
        expect(UIEvents.emit).toHaveBeenCalledWith(EVENT_LIVE_MESSAGE, '', {
          ...defaultOptions,
          force: true,
        });
        expect(UIEvents.emit).toHaveBeenCalledWith(EVENT_LIVE_MESSAGE, message, {
          ...defaultOptions,
          force: true,
        });
        done();
      }, 0);
    });
  });
});
