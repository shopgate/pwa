import React from 'react';
import { shallow, mount } from 'enzyme';
import Link from './index';

const mockConstructor = jest.fn();
const mockOpen = jest.fn();

jest.mock('../../helpers/parsed-link', () => (class {
  /**
   * Mocked version of the ParsedLink constructor.
   * @param {string} href Link location.
   */
  constructor(href) {
    mockConstructor(href);
  }

  /* eslint-disable class-methods-use-this */
  /**
   * Mocked version of open function.
   * @param {Object} history History object from react router
   */
  open(history) {
    mockOpen(history);
  }
  /* eslint-enable class-methods-use-this */
}));

describe('<Link />', () => {
  it('should render inner content of the link', () => {
    const wrapper = shallow(
      (
        <Link href="/">
          <span>Test</span>
        </Link>
      ),
      {
        context: {
          history: {
            push: () => {},
          },
        },
      }
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('span').length).toEqual(1);
    expect(wrapper.find('span').at(0).text()).toEqual('Test');
  });

  it('should construct parsed-link and open it when clicked', () => {
    const wrapper = mount(
      (
        <Link href="/category/123">
          <span>Test</span>
        </Link>
      ),
      {
        context: {
          history: {
            push: () => {},
          },
        },
      }
    );

    expect(wrapper).toMatchSnapshot();
    wrapper.find('div[role="link"]').at(0).simulate('click');

    expect(mockConstructor).toHaveBeenCalledWith('/category/123');
    expect(mockOpen).toHaveBeenCalled();
  });

  it('should construct disabled parsed-link and click should be noop', () => {
    const wrapper = mount(
      (
        <Link href="/category/toClick" disabled={true}>
          <span>Test</span>
        </Link>
      ),
      {
        context: {
          history: {
            push: () => {},
          },
        },
      }
    );

    expect(wrapper).toMatchSnapshot();
    wrapper.find('div[role="link"]').at(0).simulate('click');

    expect(mockConstructor).not.toHaveBeenCalledWith('/category/toClick');
    expect(mockOpen).not.toHaveBeenCalled();
  });
});
