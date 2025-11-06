/** @jest-environment jsdom */
/* eslint global-require: "off" */
describe('SGLink helper', () => {
  let SGLink;

  beforeAll(() => {
    window.SGEvent = {};
    ({ SGLink } = require('../helpers/helper'));
  });

  it('should handle regular links', () => {
    const source = 'http://testshop.shopgate.com/item/abc123?one=123';
    const link = new SGLink(source);

    expect(link.toString()).toBe(source);

    link.setParam('one', '321');
    link.setParam('two', 'äpfel');

    expect(link.toString())
      .toBe('http://testshop.shopgate.com/item/abc123?one=321&two=%C3%A4pfel');

    link.setParam('one');
    link.setParam('two');

    expect(link.toString())
      .toBe('http://testshop.shopgate.com/item/abc123');

    link.setParam('three', '2342');

    expect(link.toString())
      .toBe('http://testshop.shopgate.com/item/abc123?three=2342');
  });

  it('should handle deeplinks', () => {
    const source = 'shopgate-1234://item/abc123?one=123';
    const link = new SGLink(source);

    expect(link.toString()).toBe(source);

    link.setParam('one', '321');
    link.setParam('two', 'äpfel');

    expect(link.toString())
      .toBe('shopgate-1234://item/abc123?one=321&two=%C3%A4pfel');

    link.setParam('one');
    link.setParam('two');

    expect(link.toString())
      .toBe('shopgate-1234://item/abc123');

    link.setParam('three', '2342');

    expect(link.toString())
      .toBe('shopgate-1234://item/abc123?three=2342');
  });

  it('should handle push notification links', () => {
    const source = '/item/abc123?one=123';
    const link = new SGLink(source);

    expect(link.toString()).toBe(source);

    link.setParam('one', '321');
    link.setParam('two', 'äpfel');

    expect(link.toString())
      .toBe('/item/abc123?one=321&two=%C3%A4pfel');

    link.setParam('one');
    link.setParam('two');

    expect(link.toString())
      .toBe('/item/abc123');

    link.setParam('three', '2342');

    expect(link.toString())
      .toBe('/item/abc123?three=2342');
  });
});
