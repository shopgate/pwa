import React from 'react';
import { render } from '@testing-library/react';
import { I18n } from '@shopgate/engage/components';
import Label from './index';

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/core');

beforeEach(() => {
  I18n.Text = ({ children }) => children;
  I18n.Placeholder = ({ children }) => children;
});

describe('PriceSlider: <Label />', () => {
  it('should render', () => {
    const wrapper = render(<Label onChange={() => { }} priceLength="5" priceMax={999} priceMin={25} />);
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });
});
