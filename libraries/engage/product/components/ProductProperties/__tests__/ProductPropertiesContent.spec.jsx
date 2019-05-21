import React from 'react';
import { shallow } from 'enzyme';
import { isBeta } from '../../../../core';
import ProductPropertiesContent from '../ProductPropertiesContent';

jest.mock('../../../../core', () => ({
  isBeta: jest.fn(),
}));

const properties = [
  {
    name: 'test1',
    label: 'Test 1',
    displayGroup: 'Group 1',
  },
  {
    name: 'test2',
    label: 'Test 2',
    displayGroup: 'Group 1',
  },
  {
    name: 'test3',
    label: 'Test 3',
    displayGroup: 'Group 2',
  },
  {
    name: 'test4',
    label: 'Test 4',
    displayGroup: 'Group 2',
  },
];

const propertiesSimple = [
  {
    name: 'test1',
    label: 'Test 1',
  },
];

describe('<ProductPropertiesContent />', () => {
  it('should not render if no props are passed', () => {
    const wrapper = shallow(<ProductPropertiesContent />);
    expect(wrapper.instance()).toEqual(null);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render simple rows if not in beta', () => {
    isBeta.mockReturnValueOnce(false);
    const wrapper = shallow(<ProductPropertiesContent properties={properties} />);
    expect(wrapper.find('ProductPropertiesWrapper').length).toEqual(1);
    expect(wrapper.find('ProductPropertiesRows').length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render simple rows of no groups could be found', () => {
    isBeta.mockReturnValueOnce(true);
    const wrapper = shallow(<ProductPropertiesContent properties={propertiesSimple} />);
    expect(wrapper.find('ProductPropertiesWrapper').length).toEqual(1);
    expect(wrapper.find('ProductPropertiesRows').length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render grouped properties', () => {
    isBeta.mockReturnValueOnce(true);
    const wrapper = shallow(<ProductPropertiesContent properties={properties} />);
    expect(wrapper.find('ProductPropertiesGrouped').length).toEqual(1);
    expect(wrapper.find('ProductPropertiesGrouped').prop('groups')).toEqual(['Group 1', 'Group 2']);
    expect(wrapper).toMatchSnapshot();
  });
});
