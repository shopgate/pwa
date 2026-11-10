import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
import type { SwiperClass } from 'swiper/react';
import MediaThumbnails from './MediaThumbnails';
import type { ProductMediaItem } from '../../types';

jest.mock('@shopgate/pwa-common/components/Swiper');
jest.mock('@shopgate/engage/product/components', () => ({
  ProductImage: ({ src }: { src: string }) => <img src={src} alt="" />,
}));

const media: ProductMediaItem[] = [
  {
    type: 'image',
    url: 'https://example.com/a.jpg',
  },
  {
    type: 'video',
    url: 'https://example.com/b.mp4',
  },
];

/**
 * Creates a slider double that remembers its realIndexChange listeners.
 * @returns The slider and a function that moves it to another slide.
 */
const createSwiper = () => {
  const listeners: Array<() => void> = [];
  const swiper = {
    realIndex: 0,
    on: jest.fn((_event: string, listener: () => void) => listeners.push(listener)),
    off: jest.fn(),
    slideToLoop: jest.fn(),
  };

  return {
    swiper,
    slideTo: (index: number) => act(() => {
      swiper.realIndex = index;
      listeners.forEach(listener => listener());
    }),
  };
};

describe('<MediaThumbnails />', () => {
  it('renders nothing for a single media', () => {
    const { swiper } = createSwiper();
    render(<MediaThumbnails media={media.slice(0, 1)} swiper={swiper as unknown as SwiperClass} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('marks the visible media and moves the slider to a tapped one', () => {
    const { swiper, slideTo } = createSwiper();
    render(
      <MediaThumbnails media={media} swiper={swiper as unknown as SwiperClass} />
    );
    const image = screen.getByRole('button', { name: 'product.media_thumbnail_image' });
    const video = screen.getByRole('button', { name: 'product.media_thumbnail_video' });

    expect(image).toHaveAttribute('aria-current', 'true');
    expect(video).toHaveAttribute('aria-current', 'false');

    slideTo(1);

    expect(video).toHaveAttribute('aria-current', 'true');

    fireEvent.click(image);

    expect(swiper.slideToLoop).toHaveBeenCalledWith(0);
  });
});
