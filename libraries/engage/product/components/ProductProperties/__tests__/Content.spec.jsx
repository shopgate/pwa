import React from 'react';
import { shallow } from 'enzyme';
import { isBeta } from '../../../../core';
import Content from '../Content';

jest.mock('../../../../core', () => ({
  isBeta: jest.fn(),
}));

jest.mock('../GroupedProperties', () => function GroupedProperties() { return 'GroupedProperties'; });

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

describe('<Content />', () => {
  it('should not render if no props are passed', () => {
    const wrapper = shallow(<Content />);
    expect(wrapper.instance()).toEqual(null);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render simple rows if not in beta', () => {
    isBeta.mockReturnValueOnce(false);
    const wrapper = shallow(<Content properties={properties} />);
    expect(wrapper.find('Wrapper').length).toEqual(1);
    expect(wrapper.find('Rows').length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render simple rows of no groups could be found', () => {
    isBeta.mockReturnValueOnce(true);
    const wrapper = shallow(<Content properties={propertiesSimple} />);
    expect(wrapper.find('Wrapper').length).toEqual(1);
    expect(wrapper.find('Rows').length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render grouped properties', () => {
    isBeta.mockReturnValueOnce(true);
    const wrapper = shallow(<Content properties={properties} />);
    expect(wrapper.find('GroupedProperties').length).toEqual(1);
    expect(wrapper.find('GroupedProperties').prop('groups')).toEqual(['Group 1', 'Group 2']);
    expect(wrapper).toMatchSnapshot();
  });
});
