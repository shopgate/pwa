import React from 'react';
import { render } from '@testing-library/react';
import Section from '../index';

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

  it('should render with a label', () => {
    const { container } = render((
      <Section title={title} titleParams={titleParams}>
        <div id="child-component" />
      </Section>
    ));
    const section = container.querySelector('section');

    expect(section).toMatchSnapshot();
    expect(container.querySelector('h2')).not.toBeNull();
    expect(mockTranslate).toHaveBeenCalledWith({
      string: title,
      params: titleParams,
    });
  });

  it('should render hidden when no children rendered', () => {
    const { container } = render(<Section title={title} />);
    const section = container.querySelector('section');

    expect(section).toMatchSnapshot();
    expect(container.querySelector('h2')).toBeNull();
    expect(mockTranslate).toHaveBeenCalledTimes(0);
  });

  describe('MutationObserver', () => {
    let rendered;
    let sectionElement;

    beforeEach(() => {
      rendered = render(<Section title={title} />);
      sectionElement = rendered.container.querySelector('section');
    });

    it('should create an observer instance', () => {
      expect(global.mutationConstructorSpy).toHaveBeenCalledTimes(1);
      expect(global.mutationConstructorSpy).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should observe with the correct initialization', () => {
      expect(global.mutationObserveSpy).toHaveBeenCalledTimes(1);
      expect(global.mutationObserveSpy).toHaveBeenCalledWith(
        sectionElement,
        {
          childList: true,
        }
      );
    });

    it('should call disconnect on unmount', () => {
      rendered.unmount();
      expect(global.mutationDisconnectSpy).toHaveBeenCalledTimes(1);
    });
  });
});
