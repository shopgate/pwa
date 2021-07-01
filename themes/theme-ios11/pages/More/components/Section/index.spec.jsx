import React from 'react';
import { mount } from 'enzyme';
import Item from '../Item';
import Section from './index';
import styles from '../../style';

jest.mock('@shopgate/pwa-common/components/Link', () => {
  /* eslint-disable react/prop-types, require-jsdoc */
  const Link = ({ children }) => (
    <div>
      {children}
    </div>
  );

  /* eslint-enable react/prop-types require-jsdoc */
  return Link;
});

describe('<Section />', () => {
  it('should render with a headline and items', () => {
    const title = 'Headline';
    const wrapper = mount((
      <Section title={title}>
        <Item href="/link/one" label="Item One" />
        <Item href="/link/two" label="Item Two" />
      </Section>));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`div.${styles.list}`).exists()).toBe(true);
    expect(wrapper.find('Headline').exists()).toBe(true);
    expect(wrapper.find('Headline').prop('text')).toEqual(title);
    expect(wrapper.find('MoreMenuItem')).toHaveLength(2);
  });

  it('should render without a headline but items', () => {
    const wrapper = mount((
      <Section>
        <Item href="/link/one" label="Item One" />
        <Item href="/link/two" label="Item Two" />
      </Section>));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`div.${styles.list}`).exists()).toBe(true);
    expect(wrapper.find('Headline').isEmptyRender()).toBe(true);
    expect(wrapper.find('MoreMenuItem')).toHaveLength(2);
  });

  it('should not render without items', () => {
    const title = 'Headline';
    const wrapper = mount(<Section title={title} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`div.${styles.list}`).exists()).toBe(false);
  });
});
