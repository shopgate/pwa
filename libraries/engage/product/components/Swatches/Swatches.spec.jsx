import React from 'react';
import { mount } from 'enzyme';
import { swatchesEnabled, useWidgetSettings } from '../../../core';
import Swatches from './Swatches';

jest.mock('@shopgate/engage/components');
jest.mock('../../../core', () => ({
  swatchesEnabled: jest.fn(),
  useWidgetSettings: jest.fn(() => ({})),
}));
// Render the unconnected component by turning the connector into a pass-through HOC.
jest.mock('./connector', () => Component => Component);
jest.mock('../Swatch', () => ({
  // eslint-disable-next-line react/prop-types
  Swatch: ({ swatch }) => <div data-test-swatch={swatch.id} />,
}));

const characteristics = [
  {
    id: 'color',
    label: 'Color',
    swatch: true,
    values: [
      {
        id: 'red',
        label: 'Red',
        swatch: { color: '#ff0000' },
      },
      {
        id: 'blue',
        label: 'Blue',
        swatch: { color: '#0000ff' },
      },
    ],
  },
  {
    id: 'size',
    label: 'Size',
    swatch: false,
    values: [
      {
        id: 's',
        label: 'S',
      },
      {
        id: 'm',
        label: 'M',
      },
    ],
  },
];

describe('<Swatches />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useWidgetSettings.mockReturnValue({});
  });

  it('should render one Swatch per swatch characteristic when enabled', () => {
    swatchesEnabled.mockReturnValue(true);

    const wrapper = mount(<Swatches productId="123" characteristics={characteristics} />);

    expect(wrapper.find('Swatch').length).toBe(1);
  });

  it('should render nothing when enabled but no characteristic is a swatch', () => {
    swatchesEnabled.mockReturnValue(true);

    const noSwatchCharacteristics = [
      {
        id: 'size',
        label: 'Size',
        swatch: false,
        values: [
          {
            id: 's',
            label: 'S',
          },
        ],
      },
    ];

    const wrapper = mount(
      <Swatches productId="123" characteristics={noSwatchCharacteristics} />
    );

    expect(wrapper.find('Swatch').length).toBe(0);
    expect(wrapper.find('SurroundPortals').length).toBe(0);
  });

  it('should render nothing when swatches are disabled', () => {
    swatchesEnabled.mockReturnValue(false);

    const wrapper = mount(<Swatches productId="123" characteristics={characteristics} />);

    expect(wrapper.find('Swatch').length).toBe(0);
    expect(wrapper.find('SurroundPortals').length).toBe(0);
  });
});
