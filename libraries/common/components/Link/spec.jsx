import React from 'react';
import { shallow } from 'enzyme';
import { Disconnected as Link } from './index';

describe('<Link />', () => {
  const navigate = jest.fn();
  const location = '/';
  const state = { x: 5 };

  it('renders with children', () => {
    const wrapper = shallow((
      <Link href={location} navigate={navigate}><span /></Link>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('span').length).toBe(1);
  });

  it('handles a push', () => {
    const wrapper = shallow((
      <Link
        href={location}
        navigate={navigate}
        state={state}
      >
        <span />
      </Link>
    ));

    wrapper.find('div').simulate('click');

    expect(navigate).toHaveBeenLastCalledWith('PUSH', location, state);
  });

  it('handles a replace', () => {
    const wrapper = shallow((
      <Link
        href={location}
        navigate={navigate}
        state={state}
        replace
      >
        <span />
      </Link>
    ));

    wrapper.find('div').simulate('click');

    expect(navigate).toHaveBeenLastCalledWith('REPLACE', location, state);
  });
});
