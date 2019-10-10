import React from 'react';
import { mount } from 'enzyme';
import Section from '../index';
import { hidden } from '../style';

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
    expect(mockTranslate).toHaveBeenCalledWith({
      string: title,
      params: titleParams,
    });
  });

  it('should render hidden when no children rendered', () => {
    const wrapper = mount(<Section title={title} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('section').hasClass(hidden.toString())).toBe(true);
    expect(mockTranslate).toHaveBeenCalledWith({
      string: title,
      params: {},
    });
  });

  describe('MutationObserver', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(<Section title={title} />);
    });

    it('should create an observer instance', () => {
      expect(global.mutationConstructorSpy).toHaveBeenCalledTimes(1);
      expect(global.mutationConstructorSpy).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should observe with the correct initialization', () => {
      expect(global.mutationObserveSpy).toHaveBeenCalledTimes(1);
      expect(global.mutationObserveSpy).toHaveBeenCalledWith(
        wrapper.find('section').instance(),
        {
          childList: true,
        }
      );
    });

    it('should call disconnect on unmount', () => {
      wrapper.unmount();
      expect(global.mutationDisconnectSpy).toHaveBeenCalledTimes(1);
    });
  });
});
