import trim from 'lodash/trim';
import React from 'react';
import { shallow, mount } from 'enzyme';
import Button from '@shopgate/pwa-common/components/Button';
import Ripple from '../Ripple';
import styles from '../Button/style';
import RippleButton from './index';

describe('<RippleButton />', () => {
  it('should render as a regular ripple button effect if type is omitted', () => {
    const wrapper = shallow(<RippleButton>Press me</RippleButton>);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Ripple).render().text()).toEqual('Press me');
  });

  it('should render as a regular ripple button if type is explicitly defined', () => {
    const wrapper = mount(<RippleButton type="regular">Press me</RippleButton>);

    expect(trim(wrapper.find(Button).props().className)).toEqual(styles.regular(false).button);
    expect(wrapper.find(Ripple).render().text()).toEqual('Press me');
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as a primary ripple button', () => {
    const wrapper = mount(<RippleButton type="primary">Press me</RippleButton>);
    expect(trim(wrapper.find(Button).props().className)).toEqual(styles.primary(false).button);
    expect(wrapper.find(Ripple).render().text()).toEqual('Press me');
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as a secondary ripple button', () => {
    const wrapper = mount(<RippleButton type="secondary">Press me</RippleButton>);
    expect(trim(wrapper.find(Button).props().className)).toEqual(styles.secondary(false).button);
    expect(wrapper.find(Ripple).render().text()).toEqual('Press me');
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as a disabled ripple button', () => {
    const wrapper = mount(<RippleButton disabled>Press me</RippleButton>);
    expect(wrapper.find(Button).props().disabled).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });
});
