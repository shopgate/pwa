import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import { getThemeSettings } from '../../../../core';
import { getAvailabilitySettings } from '../../../helpers';
import { StockInfo } from '../StockInfo';

/* eslint-disable react/prop-types */

jest.mock('react-redux', () => ({
  connect: () => component => component,
}));

jest.mock('../../../../../core', () => ({
  ...jest.requireActual('../../../../core'),
  getThemeSettings: jest.fn(),
}));
jest.mock('../../../helpers', () => ({
  getAvailabilitySettings: jest.fn(),
}));
jest.mock('../../../components', () => ({
  SurroundPortals: ({ children }) => children,
}));
jest.mock('../StockInfoInventory', () => ({
  StockInfoInventory: ({ availabilityText, location }) => (
    <span data-testid="stock-info-inventory">{`${location?.name || ''} ${availabilityText}`.trim()}</span>
  ),
}));

describe.skip('<StockInfo />', () => {
  it('should render availability text and store name', () => {
    getThemeSettings.mockReturnValueOnce({});
    getAvailabilitySettings.mockReturnValueOnce({
      availabilityText: 'demo_availability_text',
      availabilityTextColor: 'green',
    });

    render(<StockInfo
      location={{
        name: 'Test Store',
      }}
    />);

    expect(screen.getByTestId('stock-info-inventory')).toHaveTextContent('Test Store demo_availability_text');
  });

  it('should render without store name', () => {
    getThemeSettings.mockReturnValueOnce({});
    getAvailabilitySettings.mockReturnValueOnce({
      availabilityText: 'demo_availability_text',
      availabilityTextColor: 'green',
    });

    render(<StockInfo
      location={{
        name: 'Test Store',
      }}
      showStoreName={false}
    />);

    expect(screen.getByTestId('stock-info-inventory')).toHaveTextContent('demo_availability_text');
  });

  it('should render empty availability text when none is provided', () => {
    getThemeSettings.mockReturnValueOnce({});
    getAvailabilitySettings.mockReturnValueOnce({
      availabilityText: '',
      availabilityTextColor: 'green',
    });

    render(<StockInfo
      location={{
        name: 'Test Store',
      }}
    />);

    expect(screen.getByTestId('stock-info-inventory')).toHaveTextContent('Test Store');
  });
});

/* eslint-enable react/prop-types */
