import React from 'react';
import { shallow } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import StarIcon from '../icons/StarIcon';
import StarHalfIcon from '../icons/StarHalfIcon';
import RatingStars from './index';

const numEmptyStars = 5;

describe('<RatingStars />', () => {
  it('renders with value of 50', () => {
    const wrapper = shallow(
      <RatingStars value={50} />,
      mockRenderOptions
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(StarIcon).length).toBe(numEmptyStars + 2);
    expect(wrapper.find(StarHalfIcon).length).toBe(1);
  });

  it('renders with value of 0', () => {
    const wrapper = shallow(
      <RatingStars value={0} />,
      mockRenderOptions
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(StarIcon).length).toBe(numEmptyStars);
    expect(wrapper.find(StarHalfIcon).length).toBe(0);
  });

  it('renders with value of 100', () => {
    const wrapper = shallow(
      <RatingStars value={100} />,
      mockRenderOptions
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(StarIcon).length).toBe(numEmptyStars + 5);
    expect(wrapper.find(StarHalfIcon).length).toBe(0);
  });

  it('should change rating on click', () => {
    const wrapper = shallow(
      <RatingStars value={100} isSelectable />,
      mockRenderOptions
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(StarIcon).length).toBe(10);
    wrapper.setProps({ value: 20 });
    expect(wrapper.find(StarIcon).length).toBe(6);
    wrapper.setProps({ value: 70 });
    expect(wrapper.find(StarIcon).length).toBe(8);
    expect(wrapper.find(StarHalfIcon).length).toBe(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onSelection with the clicked rating in selectable mode', () => {
    const selections = [];
    const wrapper = shallow(
      <RatingStars
        value={20}
        isSelectable
        onSelection={(e) => {
          selections.push(e.target.value);
          wrapper.setProps({ value: e.target.value });
        }}
      />,
      mockRenderOptions
    );

    // Only the empty-star layer is interactive: one button per position, always five.
    // The decorative filled overlay is pointer-transparent and carries no buttons.
    expect(wrapper.find('[role="button"]').length).toBe(numEmptyStars);

    // Regression: at a low rating the higher positions used to be covered by the
    // filled layer's invisible placeholders, which swallowed the click. Clicking the
    // 5th star must still raise the rating to the full 5 stars.
    wrapper.find('[role="button"]').at(4).simulate('click', { target: {} });
    expect(selections).toEqual([100]);

    // The interactive layer is unaffected by the rating; clicking the 1st star lowers it.
    expect(wrapper.find('[role="button"]').length).toBe(numEmptyStars);
    wrapper.find('[role="button"]').at(0).simulate('click', { target: {} });
    expect(selections).toEqual([100, 20]);
  });

  it('should NOT call onSelection callback when component is NOT selectable', () => {
    const spy = jest.fn();
    const wrapper = shallow(
      <RatingStars value={100} onSelection={spy} />,
      mockRenderOptions
    );

    wrapper.find(StarIcon).at(5).parent('div').simulate('click');
    expect(wrapper.find('[role="button"]').length).toBe(0);
    expect(spy.mock.calls.length).toBe(0);
  });
});
