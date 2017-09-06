/*
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint global-require: "off" */
import chai from 'chai';
import mochaJsdom from 'mocha-jsdom';

const expect = chai.expect;

describe('SGLink helper', () => {
  let SGLink;
  mochaJsdom();

  before(() => {
    window.SGEvent = {};
    SGLink = require('../helpers/helper').SGLink;
  });

  it('should handle regular links', () => {
    const source = 'http://testshop.shopgate.com/item/abc123?one=123';
    const link = new SGLink(source);

    // Check if it ouputs the same url
    expect(link.toString()).to.equal(source);

    // Update the parameters
    link.setParam('one', '321');
    link.setParam('two', 'äpfel');

    expect(link.toString())
      .to.equal('http://testshop.shopgate.com/item/abc123?one=321&two=%C3%A4pfel');

    // Remove the params
    link.setParam('one');
    link.setParam('two');

    expect(link.toString())
      .to.equal('http://testshop.shopgate.com/item/abc123');

    // Add a new param
    link.setParam('three', '2342');

    expect(link.toString())
      .to.equal('http://testshop.shopgate.com/item/abc123?three=2342');
  });

  it('should handle deeplinks', () => {
    const source = 'shopgate-1234://item/abc123?one=123';
    const link = new SGLink(source);

    // Check if it ouputs the same url
    expect(link.toString()).to.equal(source);

    // Update the parameters
    link.setParam('one', '321');
    link.setParam('two', 'äpfel');

    expect(link.toString())
      .to.equal('shopgate-1234://item/abc123?one=321&two=%C3%A4pfel');

    // Remove the params
    link.setParam('one');
    link.setParam('two');

    expect(link.toString())
      .to.equal('shopgate-1234://item/abc123');

    // Add a new param
    link.setParam('three', '2342');

    expect(link.toString())
      .to.equal('shopgate-1234://item/abc123?three=2342');
  });

  it('should handle push notification links', () => {
    const source = '/item/abc123?one=123';
    const link = new SGLink(source);

    // Check if it ouputs the same url
    expect(link.toString()).to.equal(source);

    // Update the parameters
    link.setParam('one', '321');
    link.setParam('two', 'äpfel');

    expect(link.toString())
      .to.equal('/item/abc123?one=321&two=%C3%A4pfel');

    // Remove the params
    link.setParam('one');
    link.setParam('two');

    expect(link.toString())
      .to.equal('/item/abc123');

    // Add a new param
    link.setParam('three', '2342');

    expect(link.toString())
      .to.equal('/item/abc123?three=2342');
  });
});
