import React from 'react';
import { mount } from 'enzyme';
import Accordion from './index';

jest.unmock('@shopgate/pwa-ui-shared');

const logger = console;
logger.error = jest.fn();

describe('<Accordion />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with renderLabel prop and children', () => {
    const wrapper = mount((
      <Accordion renderLabel={() => <div />}>
        Some content.
      </Accordion>
    ));

    expect(wrapper.find('AccordionContent').exists()).toBe(true);
    expect(logger.error).toHaveBeenCalledTimes(0);
  });

  it('should not render without a renderLabel prop', () => {
    mount(<Accordion />);
    expect(logger.error).toHaveBeenCalledTimes(2);
  });

  it('should not render without children', () => {
    mount(<Accordion renderLabel={() => { }} />);
    expect(logger.error).toHaveBeenCalledTimes(0);
  });
});
