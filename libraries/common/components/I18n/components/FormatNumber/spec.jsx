import React from 'react';
import { mount } from 'enzyme';
import I18n from '../../index';
import FormatNumber from './index';

describe('<FormatNumber>', () => {
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
    <I18n.Provider lang="de-DE" locales={{}}>
      <div>
        <FormatNumber number={number} fractions={fractions} />)
      </div>
    </I18n.Provider>
  )));

  pairs.forEach((p) => {
    it(`should format ${p[0]} into ${p[1]}`, () => {
      const component = makeComponent(p[0], p[2]);
      expect(component.html().includes(`>${p[1]}<`)).toBe(true);
      expect(component).toMatchSnapshot();
    });
  });

  it('should return same number and className when no context is available', () => {
    const component = mount(<FormatNumber number={1} fractions={2} className="some-class" />);
    expect(component.html().includes('some-class')).toBe(true);
    expect(component.html().includes('>1<')).toBe(true);
    expect(component).toMatchSnapshot();
  });
});
