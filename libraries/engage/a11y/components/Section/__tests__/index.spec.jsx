/* eslint-disable require-jsdoc, extra-rules/potential-point-free,
class-methods-use-this, extra-rules/no-single-line-objects */
import React from 'react';
import { mount } from 'enzyme';
import Section from '../index';
import { hidden } from '../style';

const mutationConstructorSpy = jest.fn();
const mutationObserveSpy = jest.fn();
const mutationDisconnectSpy = jest.fn();

global.MutationObserver = class {
  constructor(callback) { mutationConstructorSpy(callback); }
  observe(element, initObject) { mutationObserveSpy(element, initObject); }
  disconnect() { mutationDisconnectSpy(); }
};

const mockTranslate = jest.fn();

jest.mock('../../../../components', () => ({
  I18n: {
    Text: function Translate(props) {
      mockTranslate(props);
      return props.string;
    },
  },
}));

const title = 'my.headline';
const titleParams = { some: 'params' };

describe('<Section />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render visible', () => {
    const wrapper = mount((
      <Section title={title} titleParams={titleParams}>
        <div id="child-component" />
      </Section>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('section').hasClass(hidden.toString())).toBe(false);
    expect(mockTranslate).toHaveBeenCalledWith({ string: title, params: titleParams });
  });

  it('should render hidden when no children rendered', () => {
    const wrapper = mount(<Section title={title} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('section').hasClass(hidden.toString())).toBe(true);
    expect(mockTranslate).toHaveBeenCalledWith({ string: title, params: {} });
  });

  describe('MutationObserver', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(<Section title={title} />);
    });

    it('should create an observer instance', () => {
      expect(mutationConstructorSpy).toHaveBeenCalledTimes(1);
      expect(mutationConstructorSpy).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should observe with the correct initialization', () => {
      expect(mutationObserveSpy).toHaveBeenCalledTimes(1);
      expect(mutationObserveSpy).toHaveBeenCalledWith(
        wrapper.find('section').instance(),
        {
          childList: true,
        }
      );
    });

    it('should call disconnect on unmount', () => {
      wrapper.unmount();
      expect(mutationDisconnectSpy).toHaveBeenCalledTimes(1);
    });
  });
});

/* eslint-enable require-jsdoc, extra-rules/potential-point-free,
class-methods-use-this, extra-rules/no-single-line-objects */
