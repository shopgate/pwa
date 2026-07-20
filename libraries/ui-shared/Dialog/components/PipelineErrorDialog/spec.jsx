import React from 'react';
import { mount } from 'enzyme';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PipelineErrorDialog from './index';

jest.mock('@shopgate/engage/a11y/components');

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

    const devMarker = 'Pipeline:';

    // Dev mode should be disabled.
    for (let i = 0; i < numTaps; i += 1) {
      expect(wrapper.text()).not.toContain(devMarker);
      clickElement.simulate('click');
    }

    expect(wrapper.text()).toContain(devMarker);

    // Dev mode should be enabled until 10 more taps.
    for (let i = 0; i < numTaps - 1; i += 1) {
      expect(wrapper.text()).toContain(devMarker);
      clickElement.simulate('click');
    }

    clickElement.simulate('click');
    expect(wrapper.text()).not.toContain(devMarker);
  });

  it('should open directly in developer detail mode when params.devMode is set', () => {
    render((
      <PipelineErrorDialog
        actions={[]}
        params={{
          ...defaultParams,
          devMode: true,
        }}
      />
    ));

    // Developer detail view is shown immediately, without any tapping.
    expect(screen.getByText('Pipeline:')).toBeInTheDocument();
    expect(screen.getByText('Code:')).toBeInTheDocument();
    expect(screen.getByText(/fakePipeline/)).toBeInTheDocument();
  });

  it('should not switch modes if tapped too slow', () => {
    jest.useFakeTimers();

    const wrapper = mount(<PipelineErrorDialog actions={[]} params={defaultParams} />);

    const numTaps = 10;
    const numTapsUntilTimeout = Math.round(numTaps / 2);

    const clickElement = wrapper.find('div[onClick]');

    const devMarker = 'Pipeline:';

    expect(wrapper.text()).not.toContain(devMarker);

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

    expect(wrapper.text()).not.toContain(devMarker);

    tapOnElement(numTapsUntilTimeout);

    expect(wrapper.text()).toContain(devMarker);
  });
});
