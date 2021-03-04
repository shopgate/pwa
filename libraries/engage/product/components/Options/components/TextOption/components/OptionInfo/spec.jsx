import React from 'react';
import { shallow } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { OptionInfo } from './index';

const optionInfoText = 'Some Text';
const optionInfoId = 'some-id';

describe('<OptionInfo />', () => {
  it('should not render when not required and no price', () => {
    const wrapper = shallow(
      (
        <OptionInfo required={false} label="" price={0} currency="EUR" info={optionInfoText} optionInfoId={optionInfoId} />
      ), mockRenderOptions
    );

    expect(wrapper).toBeEmptyRender();
  });
  it('should render required element', () => {
    const wrapper = shallow(
      (
        <OptionInfo required label="" price={0} currency="EUR" info={optionInfoText} optionInfoId={optionInfoId} />
      ), mockRenderOptions
    ).dive();
    expect(wrapper).toMatchSnapshot();
  });
  it('should render price element', () => {
    const wrapper = shallow(
      (
        <OptionInfo required={false} label="Label" price={10} currency="EUR" info={optionInfoText} optionInfoId={optionInfoId} />
      ), mockRenderOptions
    ).dive();
    expect(wrapper).toMatchSnapshot();
  });
});
