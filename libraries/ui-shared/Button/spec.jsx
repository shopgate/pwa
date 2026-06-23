import trim from 'lodash/trim';
import React from 'react';
import { shallow } from 'enzyme';
import Button from './index';

describe('<Button />', () => {
  it('should render as a regular button if type is omitted', () => {
    const wrapper = shallow(<Button>Press me</Button>);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.render().text()).toEqual('Press me');
  });

  it('should render as a regular button if type is explicitly defined', () => {
    const wrapper = shallow(<Button type="regular">Press me</Button>);

    expect(wrapper).toMatchSnapshot();
    expect(trim(wrapper.prop('className'))).toMatch(/^ui-shared__button\s+/);
  });

  it('should render as a primary button', () => {
    const wrapper = shallow(<Button type="primary">Press me</Button>);
    expect(trim(wrapper.prop('className'))).toMatch(/^ui-shared__button\s+/);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as a secondary button', () => {
    const wrapper = shallow(<Button type="secondary">Press me</Button>);
    expect(trim(wrapper.prop('className'))).toMatch(/^ui-shared__button\s+/);
    expect(wrapper).toMatchSnapshot();
  });
});
