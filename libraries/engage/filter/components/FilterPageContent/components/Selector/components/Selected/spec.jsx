import React from 'react';
import { shallow } from 'enzyme';
import Selected from './index';

const values = [
  {
    id: 'foo',
    label: 'fooLabel',
  },
  {
    id: 'bar',
    label: 'barLabel',
  },
];

describe('Filter: <Selected />', () => {
  it('should not render without selected', () => {
    const wrapper = shallow(<Selected values={values} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with selected', () => {
    const wrapper = shallow(<Selected values={values} selected={['foo']} />);
    expect(wrapper).toMatchSnapshot();
  });
});
