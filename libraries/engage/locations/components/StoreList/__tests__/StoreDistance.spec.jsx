import React from 'react';
import { render, screen } from '@testing-library/react';
import formatDistance from '../../../helpers/formatDistance';
import { StoreDistance, UNIT_SYSTEM_METRIC, UNIT_SYSTEM_IMPERIAL } from '../StoreDistance';

jest.mock('../../../helpers/formatDistance', () => jest.fn());

describe('engage > locations > StoreList > StoreDistance', () => {
  beforeAll(() => {
    formatDistance.mockImplementation((distance, imperial) => (
      `${distance} ${imperial ? UNIT_SYSTEM_IMPERIAL : UNIT_SYSTEM_METRIC}`
    ));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when no distance was passed', () => {
    const { container } = render(<StoreDistance />);
    expect(container.firstChild).toBeNull();
  });

  it('should render when the distance is 0', () => {
    const distance = 0;
    const unitSystem = UNIT_SYSTEM_METRIC;
    const { container } = render(<StoreDistance distance={distance} />);
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByText(`${distance} ${unitSystem}`)).toBeTruthy();
    expect(formatDistance).toHaveBeenCalledTimes(1);
    expect(formatDistance).toHaveBeenCalledWith(distance, false);
  });

  it('should render when a unit system is set', () => {
    const distance = 5.4;
    const unitSystem = UNIT_SYSTEM_IMPERIAL;
    const { container } = render((
      <StoreDistance
        distance={distance}
        unitSystem={unitSystem}
      />
    ));
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByText(`${distance} ${unitSystem}`)).toBeTruthy();
    expect(formatDistance).toHaveBeenCalledTimes(1);
    expect(formatDistance).toHaveBeenCalledWith(distance, true);
  });
});
