import React from 'react';
import { shallow, mount } from 'enzyme';
import I18n from '../I18n';
import ScreenReaderLabel from './index';

describe('<ScreenReaderLabel />', () => {
  const locales = {
    common: {
      menu: 'Menu',
    },
  };
  it('should not render if no label is passed', () => {
    const wrapper = shallow(<ScreenReaderLabel />);
    expect(wrapper.instance()).toEqual(null);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a plain string', () => {
    const wrapper = mount(<ScreenReaderLabel label="Test Label" />);
    expect(wrapper.find('Translate')).toBeTruthy();
    expect(wrapper.find('Translate').text()).toEqual('Test Label');
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a tranlation string', () => {
    const wrapper = mount((
      <I18n.Provider locales={locales} lang="en-US">
        <ScreenReaderLabel label="common.menu" />
      </I18n.Provider>
    ));
    expect(wrapper.find('Translate')).toBeTruthy();
    expect(wrapper.find('Translate').text()).toEqual('Menu');
    expect(wrapper).toMatchSnapshot();
  });
});
