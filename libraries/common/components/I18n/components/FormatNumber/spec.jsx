import React from 'react';
import { mount } from 'enzyme';
import { i18n } from '@shopgate/engage/core';
import I18n from '../../index';
import FormatNumber from './index';

jest.unmock('@shopgate/engage/core/helpers/i18n');

describe('<FormatNumber>', () => {
  describe('i18n not ready', () => {
    it('should return same number and className when i18n is not ready', () => {
      const component = mount(<FormatNumber number={1} fractions={2} className="some-class" />);
      expect(component.html().includes('some-class')).toBe(true);
      expect(component.text().includes('1')).toBe(true);
      expect(component).toMatchSnapshot();
    });
  });
  describe('i18n ready', () => {
    i18n.init({
      locales: {},
      lang: 'en-US',
    });

    const pairs = [
      [1, '1.00', 2],
      [0.1, '0.10', 2],
      [1, '1.000', 3],
      [1, '1', 0],
    ];

    /**
     * Makes a component.
     * @param {number} number Number
     * @param {number} fractions Decimal points.
     * @returns {Object}
     */
    const makeComponent = (number, fractions) => (mount((
      <I18n.Provider>
        <div>
          <FormatNumber number={number} fractions={fractions} />
        </div>
      </I18n.Provider>
    )));

    pairs.forEach(([input, expexted, fractions]) => {
      it(`should format ${input} into ${expexted}`, () => {
        const component = makeComponent(input, fractions);
        expect(component.text().includes(`${expexted}`)).toBe(true);
        expect(component).toMatchSnapshot();
      });
    });
  });
});
