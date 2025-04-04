import React from 'react';
import { shallow } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { OptionInfo } from './index';

const optionInfoText = 'Some Text';
const optionInfoId = 'some-id';

jest.mock('@shopgate/engage/components', () => {
  const { default: Grid } = jest.requireActual('@shopgate/pwa-common/components/Grid');
  const { default: I18n } = jest.requireActual('@shopgate/pwa-common/components/I18n');

  return {
    Grid,
    I18n,
  };
});

jest.mock('@shopgate/engage/product/contexts', () => ({
  ProductContext: {
    Consumer: ({ children }) => children({ currency: 'EUR' }),
  },
}));

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
