import React from 'react';
import { render } from '@testing-library/react';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { I18n } from '@shopgate/engage/components';
import { OptionInfo } from './index';

const optionInfoText = 'Some Text';
const optionInfoId = 'some-id';

jest.mock('@shopgate/engage/components', () => {
  const { default: Grid } = jest.requireActual('@shopgate/pwa-common/components/Grid');
  const { default: I18nComponent } = jest.requireActual('@shopgate/pwa-common/components/I18n');

  return {
    Grid,
    I18n: I18nComponent,
  };
});

jest.mock('@shopgate/engage/product/contexts', () => ({
  ProductContext: {
    Consumer: ({ children }) => children({ currency: 'EUR' }),
  },
}));

const createComponent = props => render(
  (
    <I18n.Provider>
      <OptionInfo {...props} />
    </I18n.Provider>
  ),
  mockRenderOptions
);

describe('<OptionInfo />', () => {
  it('should not render when not required and no price', () => {
    const wrapper = createComponent({
      required: false,
      label: '',
      price: 0,
      currency: 'EUR',
      info: optionInfoText,
      optionInfoId,
    });

    expect(wrapper.container.firstChild).toBeNull();
  });

  it('should render required element', () => {
    const wrapper = createComponent({
      required: true,
      label: '',
      price: 0,
      currency: 'EUR',
      info: optionInfoText,
      optionInfoId,
    });

    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it('should render price element', () => {
    const wrapper = createComponent({
      required: false,
      label: 'Label',
      price: 10,
      currency: 'EUR',
      info: optionInfoText,
      optionInfoId,
    });

    expect(wrapper.container.firstChild).toMatchSnapshot();
  });
});
