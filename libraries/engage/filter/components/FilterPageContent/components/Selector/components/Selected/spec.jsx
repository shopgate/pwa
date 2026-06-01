import React from 'react';
import { render } from '@testing-library/react';
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
    const wrapper = render(<Selected values={values} />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('should render with selected', () => {
    const wrapper = render(<Selected values={values} selected={['foo']} />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
