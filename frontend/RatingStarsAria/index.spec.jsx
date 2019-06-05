import React from 'react';
import { shallow } from 'enzyme';
import { NUMBER_OF_STARS } from '../constants';
import RatingStarsAria from './index';

jest.mock('./connector', () => obj => obj);

const mockTranslate = jest.fn(key => key);

const mockRenderOptions = {
  context: {
    i18n: () => ({
      __: mockTranslate,
    }),
  },
};

const product = {
  rating: {
    average: 70,
  },
};

describe('<RatingStars />', () => {
  it('should render as expected for 3.4 stars', () => {
    const wrapper = shallow(<RatingStarsAria product={product} />, mockRenderOptions);
    expect(wrapper).toMatchSnapshot();
    expect(mockTranslate).toHaveBeenCalledWith('reviews.rating_stars', {
      rate: 3.5,
      maxRate: NUMBER_OF_STARS,
    });
  });
});
