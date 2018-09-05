import React from 'react';
import { shallow } from 'enzyme';
import { Disconnected as Link } from './index';

describe('<Link />', () => {
  const historyPush = jest.fn();
  const historyReplace = jest.fn();
  const pathname = '/';
  const state = { x: 5 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with children', () => {
    const wrapper = shallow((
      <Link
        href={pathname}
        historyPush={historyPush}
        historyReplace={historyReplace}
      >
        <span />
      </Link>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('span').length).toBe(1);
  });

  it('handles a push', () => {
    const wrapper = shallow((
      <Link
        href={pathname}
        state={state}
        historyPush={historyPush}
        historyReplace={historyReplace}
      >
        <span />
      </Link>
    ));

    wrapper.find('div').simulate('click');

    expect(historyPush).toHaveBeenLastCalledWith({
      pathname,
      state,
    });
  });

  it('handles a replace', () => {
    const wrapper = shallow((
      <Link
        href={pathname}
        historyPush={historyPush}
        historyReplace={historyReplace}
        state={state}
        replace
      >
        <span />
      </Link>
    ));

    wrapper.find('div').simulate('click');

    expect(historyReplace).toHaveBeenLastCalledWith({
      pathname,
      state,
    });
  });
});
