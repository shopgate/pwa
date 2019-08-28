import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { UIEvents } from '../../../../core';
import LiveMessage from '../../LiveMessage';
import {
  EVENT_LIVE_MESSAGE,
  LIVE_MESSAGE_TYPE_ASSERTIVE,
  LIVE_MESSAGE_TYPE_POLITE,
} from '../constants';
import LiveMessenger from '../index';

jest.mock('../../../../components', () => ({
  I18n: {
    Text: function Translate({ string }) {
      return string;
    },
  },
}));

jest.mock('../../../../core', () => ({
  UIEvents: {
    addListener: jest.fn(),
    removeListener: jest.fn(),
  },
}));

describe.skip('<LiveMessenger />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = mount(<LiveMessenger />);
    expect(wrapper).toMatchSnapshot();

    const liveMessages = wrapper.find(LiveMessage);
    expect(liveMessages).toHaveLength(2);
    expect(liveMessages.at(0).props()).toEqual({
      'aria-live': 'assertive',
      message: '',
      params: null,
    });
    expect(liveMessages.at(1).props()).toEqual({
      'aria-live': 'polite',
      message: '',
      params: null,
    });
  });

  it('should register and remove the events as expected', () => {
    const wrapper = mount(<LiveMessenger />);
    const [[, callback]] = UIEvents.addListener.mock.calls;

    expect(UIEvents.addListener).toHaveBeenCalledTimes(1);
    expect(UIEvents.addListener).toHaveBeenCalledWith(EVENT_LIVE_MESSAGE, expect.any(Function));
    expect(UIEvents.removeListener).not.toHaveBeenCalled();

    wrapper.unmount();

    expect(UIEvents.addListener).toHaveBeenCalledTimes(1);
    expect(UIEvents.removeListener).toHaveBeenCalledTimes(1);
    expect(UIEvents.removeListener).toHaveBeenCalledWith(EVENT_LIVE_MESSAGE, callback);
  });

  it('should update the polite message by default when the event comes in', () => {
    const message = 'My Message';
    const options = {
      params: { some: 'param' },
    };

    const wrapper = mount(<LiveMessenger />);
    const [[, callback]] = UIEvents.addListener.mock.calls;

    act(() => {
      callback(message, options);
    });

    wrapper.update();
    expect(wrapper.find(LiveMessage).at(1).props()).toEqual({
      'aria-live': 'polite',
      params: options.params,
      message,
    });
  });

  it('should update the polite message when the event comes in with the appropriate type', () => {
    const message = 'My Polite Message';
    const options = {
      type: LIVE_MESSAGE_TYPE_POLITE,
      params: { some: 'param' },
    };

    const wrapper = mount(<LiveMessenger />);
    const [[, callback]] = UIEvents.addListener.mock.calls;

    act(() => {
      callback(message, options);
    });

    wrapper.update();
    expect(wrapper.find(LiveMessage).at(1).props()).toEqual({
      'aria-live': 'polite',
      message,
      params: options.params,
    });
  });

  it('should update the assertive message when the event comes in with the appropriate type', () => {
    const message = 'My Assertive Message';
    const options = {
      type: LIVE_MESSAGE_TYPE_ASSERTIVE,
      params: { some: 'param' },
    };

    const wrapper = mount(<LiveMessenger />);
    const [[, callback]] = UIEvents.addListener.mock.calls;

    act(() => {
      callback(message, options);
    });

    wrapper.update();
    expect(wrapper.find(LiveMessage).at(0).props()).toEqual({
      'aria-live': 'assertive',
      params: options.params,
      message,
    });
  });

  it('should only update the message when it has the correct id', () => {
    const id = 'my-id';
    const message = 'My Message';
    const options = {};

    const wrapper = mount(<LiveMessenger id={id} />);
    const [[, callback]] = UIEvents.addListener.mock.calls;

    act(() => {
      callback(message, options);
    });

    wrapper.update();
    expect(wrapper.find(LiveMessage).at(1).props()).toEqual({
      'aria-live': 'polite',
      params: null,
      message: '',
    });

    act(() => {
      callback(message, { id });
    });

    wrapper.update();
    expect(wrapper.find(LiveMessage).at(1).props()).toEqual({
      'aria-live': 'polite',
      params: null,
      message,
    });
  });
});
