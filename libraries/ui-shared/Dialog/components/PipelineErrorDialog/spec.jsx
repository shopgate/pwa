import React from 'react';
import { mount } from 'enzyme';
import PipelineErrorDialog from './index';

describe('<PipelineErrorDialog />', () => {
  const defaultParams = {
    code: '123',
    message: 'Error message',
    pipeline: 'fakePipeline',
    request: {},
  };

  it('should render with minimal props', () => {
    const wrapper = mount(<PipelineErrorDialog actions={[]} params={defaultParams} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should show a custom message if a message is is provided', () => {
    const message = 'Custom message';
    const wrapper = mount((
      <PipelineErrorDialog
        actions={[]}
        message={message}
        params={defaultParams}
      />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatch(message);
  });

  it('should switch modes on tap', () => {
    const wrapper = mount(<PipelineErrorDialog actions={[]} params={defaultParams} />);

    const numTaps = 10;

    const clickElement = wrapper.find('div[onClick]');

    // Dev mode should be disabled.
    for (let i = 0; i < numTaps; i += 1) {
      expect(wrapper.state().devMode).toBe(false);
      clickElement.simulate('click');
    }

    // Dev mode should be enabled.
    for (let i = 0; i < numTaps; i += 1) {
      expect(wrapper.state().devMode).toBe(true);
      clickElement.simulate('click');
    }

    // Dev mode should be disabled again.
    expect(wrapper.state().devMode).toBe(false);
  });

  it('should not switch modes if tapped too slow', () => {
    jest.useFakeTimers();

    const wrapper = mount(<PipelineErrorDialog actions={[]} params={defaultParams} />);

    const numTaps = 10;
    const numTapsUntilTimeout = Math.round(numTaps / 2);

    const clickElement = wrapper.find('div[onClick]');

    // Dev mode should be disabled.
    expect(wrapper.state().devMode).toBe(false);

    /**
     * Simulates multiple tap events.
     * @param {number} amount The number of tap events to simulate in a row.
     */
    const tapOnElement = (amount) => {
      if (amount > 0) {
        clickElement.simulate('click');
        tapOnElement(amount - 1);
      }
    };

    // Tap a few times.
    tapOnElement(numTapsUntilTimeout);

    // Trigger a timeout (user was too slow).
    jest.runAllTimers();

    // Tap the remaining times.
    tapOnElement(numTaps - numTapsUntilTimeout);

    // We timed out and should not be in dev mode by now.
    expect(wrapper.state().devMode).toBe(false);

    // Add the remaining amount of taps to enter dev mode.
    tapOnElement(numTapsUntilTimeout);

    // This time dev mode should be enabled.
    expect(wrapper.state().devMode).toBe(true);
  });
});
