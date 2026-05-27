/* eslint-disable extra-rules/no-single-line-objects */
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@shopgate/pwa-unit-test/rtlUtils';
import StoreListSearch from '../StoreListSearch';
import { FulfillmentContext } from '../../../locations.context';

/* eslint-disable react/prop-types */

jest.mock('@shopgate/engage/core/helpers', () => ({
  i18n: {
    text: key => key,
  },
}));
jest.mock('@shopgate/engage/components', () => ({
  InfoIcon: () => null,
  LocatorIcon: () => null,
  MagnifierIcon: () => null,
  SurroundPortals: ({ children }) => children,
  MessageBar: ({ messages }) => <div data-testid="message-bar">{messages[0]?.message}</div>,
}));
jest.mock('@shopgate/engage/i18n', () => ({
  useCountriesNames: jest.fn(codes => codes.reduce((acc, code) => ({ ...acc, [code]: code }), {})),
}));
jest.mock('../StoreListSearchRadius', () => function StoreListSearchRadius() {
  return <div data-testid="store-list-search-radius" />;
});
jest.mock('../StoreListSearch.connector', () => cmp => cmp);

describe.skip('engage > locations > components > StoreListSearch', () => {
  const setCountryCode = jest.fn();
  const setPostalCode = jest.fn();
  const setGeolocation = jest.fn(() => Promise.resolve());
  const setIsLoading = jest.fn();

  const productId = 'ABC123';
  const countryCode = 'DE';
  const postalCode = 'ACME';

  const defaultProps = {
    setCountryCode,
    setPostalCode,
    setGeolocation,
    countryCode,
    postalCode: null,
  };

  const context = {
    isLoading: false,
    setIsLoading,
    product: { id: productId },
    locations: [{ code: 'LOCCODE' }],
    shopSettings: { supportedCountries: [countryCode, countryCode] },
  };

  const renderWithContext = (props = {}, contextValue = context) => render(
    <FulfillmentContext.Provider value={contextValue}>
      <StoreListSearch {...defaultProps} {...props} />
    </FulfillmentContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render as expected', () => {
    renderWithContext();

    expect(screen.getByRole('searchbox', { name: 'locations.search_placeholder' })).toBeTruthy();
    expect(screen.getByRole('searchbox', { name: 'locations.search_placeholder' })).not.toBeDisabled();
  });

  it('should call setPostalCode with a postal code after filling the input and pressing enter', async () => {
    renderWithContext();
    const input = screen.getByRole('searchbox', { name: 'locations.search_placeholder' });

    fireEvent.change(input, {
      target: {
        name: 'postalCode',
        value: postalCode,
      },
    });
    fireEvent.keyDown(input, { keyCode: 13 });

    await waitFor(() => {
      expect(setPostalCode).toHaveBeenCalledWith(postalCode, productId, false);
    });

    expect(setCountryCode).not.toHaveBeenCalled();
    expect(input).toHaveValue(postalCode);
  });

  it('should call setCountryCode after changing country', async () => {
    renderWithContext({ postalCode });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { name: 'countryCode', value: 'AT' } });

    await waitFor(() => {
      expect(setCountryCode).toHaveBeenCalledWith('AT', productId, false);
    });

    expect(setPostalCode).not.toHaveBeenCalled();
    expect(select).toHaveValue('AT');
  });

  it('should not trigger postal search updates when country changes and postal code is empty', async () => {
    renderWithContext({ postalCode: '' });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { name: 'countryCode', value: 'AT' } });

    await waitFor(() => {
      expect(setCountryCode).toHaveBeenCalledWith('AT', productId, false);
    });

    expect(setPostalCode).not.toHaveBeenCalled();
    expect(setGeolocation).not.toHaveBeenCalled();
  });

  it('should call setGeolocation after clicking the locate button', async () => {
    renderWithContext();
    const input = screen.getByRole('searchbox', { name: 'locations.search_placeholder' });

    fireEvent.change(input, { target: { name: 'postalCode', value: postalCode } });
    fireEvent.click(screen.getByRole('button', { name: 'locations.stores_near.location' }));

    await waitFor(() => {
      expect(setGeolocation).toHaveBeenCalledWith({
        productId,
        isStoreFinder: false,
      });
    });

    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setIsLoading).toHaveBeenCalledWith(false);
    expect(input).toHaveValue('');
  });
});

/* eslint-enable react/prop-types */
/* eslint-enable extra-rules/no-single-line-objects */
