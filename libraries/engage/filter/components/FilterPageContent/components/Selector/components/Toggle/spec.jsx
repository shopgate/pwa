import React from 'react';
import { render } from 'enzyme';
import Toggle from './index';

describe('<Toggle />', () => {
  it('should render without selected', () => {
    const wrapper = render(<Toggle label="somelabel" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render without selected as open', () => {
    const wrapper = render(<Toggle label="somelabel" open />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with selected', () => {
    const wrapper = render(<Toggle label="somelabel" selected="Some, Thing, Selected" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with selected as open', () => {
    const wrapper = render(<Toggle label="somelabel" selected="Some, Thing, Selected" open />);
    expect(wrapper).toMatchSnapshot();
  });
});
