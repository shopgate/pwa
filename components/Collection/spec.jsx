/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import { shallow, mount } from 'enzyme';
import Collection from './index';

/**
 * Test element component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const TestElement = props => (<li>
  {props.testData}
  Item no. {props.myIndex}
  {props.amIFirst ? (<span className="first">(First element)</span>) : ''}
  {props.amILast ? (<span className="last">(Last element)</span>) : ''}
</li>);

TestElement.propTypes = {
  amIFirst: PropTypes.bool,
  amILast: PropTypes.bool,
  myIndex: PropTypes.number,
  testData: PropTypes.string,
};

TestElement.defaultProps = {
  amIFirst: false,
  amILast: false,
  myIndex: 0,
  testData: '',
};

describe('<Collection />', () => {
  it('renders with children', () => {
    const numChildren = 5;
    const wrapper = mount(
      <Collection elementIndexProp="myIndex" lastElementProp="amILast">
        <TestElement />
        <TestElement />
        <TestElement />
        <TestElement />
        <TestElement />
      </Collection>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(TestElement).length).toBe(numChildren);
  });

  it('renders without children', () => {
    const wrapper = shallow(
      <Collection />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(TestElement).length).toBe(0);
  });

  it('renders the correct container tag', () => {
    const wrapper = shallow(
      <Collection container="ol" />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ol').length).toBe(1);
  });

  it('correctly forwards the element props and merges the additional props', () => {
    const wrapper = mount(
      <Collection elementIndexProp="myIndex">
        <TestElement testData="first" />
        <TestElement testData="second" />
        <TestElement testData="third" />
      </Collection>
    );

    const testElements = wrapper.find(TestElement);

    expect(wrapper).toMatchSnapshot();

    expect(testElements.get(0).props.testData).toBe('first');
    expect(testElements.get(1).props.testData).toBe('second');
    expect(testElements.get(2).props.testData).toBe('third');

    expect(testElements.get(0).props.myIndex).toBe(0);
    expect(testElements.get(1).props.myIndex).toBe(1);
    expect(testElements.get(2).props.myIndex).toBe(2);
  });

  it('receives the first/last props', () => {
    const wrapper = mount(
      <Collection elementIndexProp="myIndex" lastElementProp="amILast" firstElementProp="amIFirst">
        <TestElement testData="first" />
        <TestElement testData="second" />
        <TestElement testData="third" />
      </Collection>
    );

    const testElements = wrapper.find(TestElement);

    expect(wrapper).toMatchSnapshot();

    expect(testElements.get(0).props.amIFirst).toBe(true);
    expect(testElements.get(0).props.amILast).toBe(false);

    expect(testElements.get(1).props.amIFirst).toBe(false);
    expect(testElements.get(1).props.amILast).toBe(false);

    expect(testElements.get(2).props.amIFirst).toBe(false);
    expect(testElements.get(2).props.amILast).toBe(true);
  });
});
