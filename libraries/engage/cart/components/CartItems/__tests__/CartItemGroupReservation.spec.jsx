/* eslint-disable react/prop-types */
import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import CartItemGroupReservation from '../CartItemGroupReservation';

const mockAccordion = jest.fn(({ children }) => children);

jest.mock('@shopgate/engage/components', () => ({
  Accordion: props => mockAccordion(props),
  LocationIcon: () => <div data-testid="location-icon" />,
}));
jest.mock('@shopgate/engage/core');
jest.mock('@shopgate/engage/locations');
jest.mock('@shopgate/pwa-ui-shared/CardList/components/Item', () => props => (
  <div data-testid="card-list-item">{props.children}</div>
));
jest.mock('../CartItem.connector', () => cmp => cmp);

describe('engage > cart > components > CartItemGroupReservation', () => {
  const location = {
    name: 'Location name',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render null when no location is given', () => {
    const { container } = render(<CartItemGroupReservation />);
    expect(container.firstChild).toBeNull();
  });

  it('should render only label', () => {
    const { container } = render(<CartItemGroupReservation location={location} fulfillmentMethod="BOPIS" />);
    expect(container.firstChild).toMatchSnapshot();
    expect(screen.getByText('Location name')).toBeInTheDocument();
  });

  it('should render accordion', () => {
    const { container } = render((
      <CartItemGroupReservation
        // eslint-disable-next-line extra-rules/no-single-line-objects
        location={{ ...location, address: { phoneNumber: '012456789' } }}
        fulfillmentMethod="BOPIS"
      />
    ));

    expect(container.firstChild).toMatchSnapshot();
    const { renderLabel } = mockAccordion.mock.calls[0][0];
    const { container: labelContainer } = render(renderLabel());
    expect(labelContainer.firstChild).toMatchSnapshot();
    expect(container.firstChild).toHaveTextContent('012456789');
    expect(screen.getByText('Location name')).toBeInTheDocument();
  });
});
/* eslint-enable react/prop-types */
