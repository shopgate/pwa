import { render } from '@testing-library/react';
import SwiperItem from '.';

describe('<SwiperItem />', () => {
  it('should render its children in a slide', () => {
    const { container } = render((
      <SwiperItem>
        <div>Slide content</div>
      </SwiperItem>
    ));

    expect(container.firstChild).toHaveClass('swiper-slide');
    expect(container.firstChild).toHaveAttribute('data-test-id', 'Slider');
    expect(container.firstChild).toHaveTextContent('Slide content');
  });

  it('should add custom className', () => {
    const { container } = render((
      <SwiperItem className="test">
        <div />
      </SwiperItem>
    ));

    expect(container.firstChild).toHaveClass('swiper-slide', 'test');
  });
});
