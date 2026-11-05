import type { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ReviewMediaItem } from '@shopgate/pwa-common-commerce/reviews/types/reviews';
import { useTrackModalState } from '@shopgate/engage/a11y/hooks';
import ReviewMedia from './ReviewMedia';

jest.mock('@shopgate/engage/a11y/hooks', () => ({
  ...jest.requireActual('@shopgate/engage/a11y/hooks'),
  useTrackModalState: jest.fn(),
}));
jest.mock('@shopgate/engage/a11y/components/FocusTrap', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => children,
}));
jest.mock('@shopgate/engage/components/ConnectedReactPortal', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => children,
}));
jest.mock('@shopgate/engage/components/VideoPlayer', () => ({
  __esModule: true,
  default: ({ url }: { url: string }) => <div data-testid="video-player" data-url={url} />,
}));
jest.mock('@shopgate/pwa-common/components/Swiper', () => {
  /**
   * @param props The component props.
   * @returns The slides with the initial slide exposed for assertions.
   */
  const Swiper = ({
    children,
    initialSlide,
    onSlideChange,
  }: {
    children: ReactNode;
    initialSlide: number;
    onSlideChange: (index: number) => void;
  }) => (
    <div data-testid="swiper" data-initial-slide={initialSlide}>
      <button type="button" aria-label="slide to first" onClick={() => onSlideChange(0)} />
      {children}
    </div>
  );
  Swiper.Item = ({ children }: { children: ReactNode }) => <div>{children}</div>;

  return {
    __esModule: true,
    default: Swiper,
  };
});

const media: ReviewMediaItem[] = [
  {
    type: 'image',
    url: 'https://example.com/a.jpg',
  },
  {
    type: 'video',
    url: 'https://example.com/b.mp4',
  },
  {
    type: 'image',
    url: 'https://example.com/c.jpg',
  },
];

describe('<ReviewMedia />', () => {
  it('should render nothing without attachments', () => {
    const { container, rerender } = render(<ReviewMedia />);
    expect(container).toBeEmptyDOMElement();

    rerender(<ReviewMedia media={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render the attachments in the given order and load images lazily', () => {
    const { container } = render(<ReviewMedia media={media} />);

    const items = Array.from(container.querySelectorAll('.engage__reviews__review-media__item'));
    expect(items.map(item => item.getAttribute('data-type'))).toEqual(['image', 'video', 'image']);
    expect(container.querySelectorAll('img')).toHaveLength(2);
    container.querySelectorAll('img').forEach((image) => {
      expect(image).toHaveAttribute('loading', 'lazy');
    });
    expect(screen.queryByTestId('video-player')).not.toBeInTheDocument();
  });

  it('should skip attachments without a url or with an unknown type', () => {
    const { container } = render(<ReviewMedia media={[
      media[0],
      {
        type: 'image',
        url: '',
      },
      {
        type: 'audio',
        url: 'https://example.com/d.mp3',
      } as unknown as ReviewMediaItem,
      null as unknown as ReviewMediaItem,
    ]}
    />);

    expect(container.querySelectorAll('.engage__reviews__review-media__item')).toHaveLength(1);
  });

  it('should remove an image that failed to load', () => {
    const { container } = render(<ReviewMedia media={media} />);

    fireEvent.error(container.querySelectorAll('img')[0]);

    const items = Array.from(container.querySelectorAll('.engage__reviews__review-media__item'));
    expect(items.map(item => item.getAttribute('data-type'))).toEqual(['video', 'image']);
  });

  it('should render nothing when the only image failed to load', () => {
    const { container } = render(<ReviewMedia media={[media[0]]} />);

    fireEvent.error(container.querySelectorAll('img')[0]);

    expect(container).toBeEmptyDOMElement();
  });

  it('should open the tapped attachment enlarged and close it again', () => {
    render(<ReviewMedia media={media} />);

    fireEvent.click(screen.getByRole('button', { name: 'reviews.media_video' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('swiper')).toHaveAttribute('data-initial-slide', '1');
    expect(screen.getByTestId('video-player')).toHaveAttribute('data-url', media[1].url);
    expect(useTrackModalState).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'common.close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should mount a video only while its slide is active', () => {
    render(<ReviewMedia media={media} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'reviews.media_image' })[0]);
    expect(screen.queryByTestId('video-player')).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'common.close' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'reviews.media_video' }));
    expect(screen.getByTestId('video-player')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'slide to first' }));
    expect(screen.queryByTestId('video-player')).not.toBeInTheDocument();
  });

  it('should keep the enlarged attachments when a thumbnail fails afterwards', () => {
    const { container } = render(<ReviewMedia media={media} />);

    fireEvent.click(screen.getByRole('button', { name: 'reviews.media_video' }));
    fireEvent.error(container.querySelector('.engage__reviews__review-media__item img') as Element);

    expect(screen.getByTestId('swiper')).toHaveAttribute('data-initial-slide', '1');
    expect(screen.getByTestId('video-player')).toHaveAttribute('data-url', media[1].url);
  });

  it('should keep the enlarged view open when the only thumbnail fails afterwards', () => {
    const { container } = render(<ReviewMedia media={[media[0]]} />);

    fireEvent.click(screen.getByRole('button', { name: 'reviews.media_image' }));
    fireEvent.error(container.querySelector('.engage__reviews__review-media__item img') as Element);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should render attachments that share a url', () => {
    const { container } = render(<ReviewMedia media={[media[0], media[0]]} />);

    expect(container.querySelectorAll('.engage__reviews__review-media__item')).toHaveLength(2);
  });

  it('should focus the tapped thumbnail so that focus can return to it', () => {
    render(<ReviewMedia media={media} />);

    const thumbnail = screen.getByRole('button', { name: 'reviews.media_video' });
    fireEvent.click(thumbnail);

    expect(thumbnail).toHaveFocus();
  });

  it('should close the enlarged view with the escape key', () => {
    render(<ReviewMedia media={media} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'reviews.media_image' })[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
