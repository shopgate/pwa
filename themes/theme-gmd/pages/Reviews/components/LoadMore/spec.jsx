import React from 'react';
import { mount } from 'enzyme';
import LoadMore from './index';

jest.mock('./connector', () => Component => Component);

describe('LoadMore', () => {
  it('should render button when reviews number is lower than total reviews count', () => {
    const component = mount(<LoadMore
      currentReviewCount={2}
      fetchReviews={() => {}}
      productId="foo"
      totalReviewCount={4}
    />);
    expect(component.find('Button').exists()).toBe(true);
  });
  it('should render nothing when reviews number is same as total reviews count', () => {
    const component = mount(<LoadMore
      currentReviewCount={2}
      fetchReviews={() => {}}
      productId="foo"
      totalReviewCount={2}
    />);
    expect(component.find('Button').exists()).toBe(false);
  });
  it('should render nothing when reviews number is higher than total reviews count', () => {
    const component = mount(<LoadMore
      currentReviewCount={3}
      fetchReviews={() => {}}
      productId="foo"
      totalReviewCount={2}
    />);
    expect(component.find('Button').exists()).toBe(false);
  });
  it('should render nothing when productId is not passed', () => {
    const component = mount(<LoadMore
      currentReviewCount={1}
      fetchReviews={() => {}}
      totalReviewCount={2}
    />);
    expect(component.find('Button').exists()).toBe(false);
  });
  it('should call fetchReviews on click', () => {
    const fetchReviewsMock = jest.fn();
    const component = mount(<LoadMore
      currentReviewCount={1}
      fetchReviews={fetchReviewsMock}
      productId="foo"
      totalReviewCount={2}
    />);
    component.find('button').simulate('click');
    expect(component.find('Button').exists()).toBe(true);
    expect(fetchReviewsMock).toHaveBeenCalled();
  });
});
