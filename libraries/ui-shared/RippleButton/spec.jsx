import trim from 'lodash/trim';
import React from 'react';
import { mount } from 'enzyme';
import BaseButton from '@shopgate/pwa-common/components/Button';
import Ripple from '../Ripple';
import RippleButton from './index';

describe('<RippleButton />', () => {
  it('should render as a regular ripple button effect if type is omitted', () => {
    const wrapper = mount(<RippleButton>Press me</RippleButton>);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Ripple).text()).toEqual('Press me');
  });

  it('should render as a regular ripple button if type is explicitly defined', () => {
    const wrapper = mount(<RippleButton type="regular">Press me</RippleButton>);

    const base = wrapper.find(BaseButton);
    expect(base.exists()).toBe(true);
    expect(trim(base.props().className)).toMatch(/^ui-shared__button /);
    expect(trim(base.props().className)).toContain('ui-shared__ripple-button');
    expect(wrapper.find(Ripple).render().text()).toEqual('Press me');
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as a primary ripple button', () => {
    const wrapper = mount(<RippleButton type="primary">Press me</RippleButton>);
    const base = wrapper.find(BaseButton);
    expect(trim(base.props().className)).toMatch(/^ui-shared__button /);
    expect(trim(base.props().className)).toContain('ui-shared__ripple-button');
    expect(wrapper.find(Ripple).render().text()).toEqual('Press me');
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as a secondary ripple button', () => {
    const wrapper = mount(<RippleButton type="secondary">Press me</RippleButton>);
    const base = wrapper.find(BaseButton);
    expect(trim(base.props().className)).toMatch(/^ui-shared__button /);
    expect(trim(base.props().className)).toContain('ui-shared__ripple-button');
    expect(wrapper.find(Ripple).render().text()).toEqual('Press me');
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as a disabled ripple button', () => {
    const wrapper = mount(<RippleButton disabled>Press me</RippleButton>);
    expect(wrapper.find(BaseButton).props().disabled).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });
});
