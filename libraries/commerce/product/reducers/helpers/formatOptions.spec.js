import { OPTION_TYPE_SELECT, OPTION_TYPE_TEXT } from '../../constants';
import formatOptions from './formatOptions';

describe('libraries/commerce/product/reducers/helpers/formatOptions.js', () => {
  it('should format options with unitPriceModifier', () => {
    const expected = [
      {
        id: 10,
        type: OPTION_TYPE_SELECT,
        label: 'Select option',
        values: [
          {
            id: 100,
            unitPriceModifier: 1,
          },
        ],
      },
      {
        id: 11,
        type: OPTION_TYPE_TEXT,
        label: 'Text option',
        unitPriceModifier: 2,
      },
    ];
    const options = [
      {
        id: 10,
        type: OPTION_TYPE_SELECT,
        label: 'Select option',
        values: [
          {
            id: 100,
            unitPriceModifier: 1,
          },
        ],
      },
      {
        id: 11,
        type: OPTION_TYPE_TEXT,
        label: 'Text option',
        unitPriceModifier: 2,
      },
    ];
    expect(formatOptions(options)).toEqual(expected);
  });

  it('should format options without unitPriceModifier', () => {
    const expected = [
      {
        id: 10,
        type: OPTION_TYPE_SELECT,
        label: 'Select option',
        values: [
          {
            id: 100,
            unitPriceModifier: 0,
          },
        ],
      },
      {
        id: 11,
        type: OPTION_TYPE_TEXT,
        label: 'Text option',
        unitPriceModifier: 0,
      },
    ];
    const options = [
      {
        id: 10,
        type: OPTION_TYPE_SELECT,
        label: 'Select option',
        values: [
          {
            id: 100,
          },
        ],
      },
      {
        id: 11,
        type: OPTION_TYPE_TEXT,
        label: 'Text option',
      },
    ];
    expect(formatOptions(options)).toEqual(expected);
  });
});
