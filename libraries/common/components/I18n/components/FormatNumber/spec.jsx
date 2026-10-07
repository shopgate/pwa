import { render, screen } from '@testing-library/react';
import { i18n } from '@shopgate/engage/core';
import I18n from '../../index';
import FormatNumber from './index';

jest.unmock('@shopgate/engage/core/helpers/i18n');

describe('<FormatNumber>', () => {
  describe('i18n not ready', () => {
    it('should return same number and className when i18n is not ready', () => {
      render(<FormatNumber number={1} fractions={2} className="some-class" />);

      const number = screen.getByText('1');

      expect(number.tagName).toBe('SPAN');
      expect(number).toHaveClass('some-class', { exact: true });
    });
  });
  describe('i18n ready', () => {
    beforeAll(() => {
      i18n.init({
        locales: {},
        lang: 'en-US',
      });
    });

    const pairs = [
      [1, '1.00', 2],
      [0.1, '0.10', 2],
      [1, '1.000', 3],
      [1, '1', 0],
    ];

    /**
     * Renders a component.
     * @param {number} number Number
     * @param {number} fractions Decimal points.
     * @returns {Object}
     */
    const makeComponent = (number, fractions) => (render((
      <I18n.Provider>
        <div>
          <FormatNumber number={number} fractions={fractions} />
        </div>
      </I18n.Provider>
    )));

    pairs.forEach(([input, expexted, fractions]) => {
      it(`should format ${input} into ${expexted}`, () => {
        const { container } = makeComponent(input, fractions);
        expect(container.innerHTML).toBe(`<div><span>${expexted}</span></div>`);
      });
    });
  });
});
