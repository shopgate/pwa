import type { ReactNode } from 'react';
import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
import { useProductGallerySettings } from '@shopgate/engage/product/hooks';
import MediaViewer from './MediaViewer';
import type { ProductMediaItem } from '../../types';

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
jest.mock('@shopgate/pwa-common/components/Image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
jest.mock('@shopgate/pwa-common/components/Swiper', () => {
  /**
   * Renders the slides with a control that shows the video.
   * @param props The component props.
   * @param props.children The slides.
   * @param props.initialSlide The index of the first visible slide.
   * @param props.onSlideChange Called with the index of the visible slide.
   * @returns The slides.
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
      <button type="button" aria-label="show video" onClick={() => onSlideChange(1)} />
      {children}
    </div>
  );
  Swiper.Item = ({ children }: { children: ReactNode }) => <div>{children}</div>;

  return {
    __esModule: true,
    default: Swiper,
  };
});
jest.mock('@shopgate/engage/product/components', () => ({
  ProductImage: ({ src }: { src: string }) => <img src={src} alt="" />,
}));
jest.mock('@shopgate/engage/core/hooks', () => ({
  useWidgetSettings: () => ({}),
}));
jest.mock('@shopgate/engage/product/hooks', () => ({
  useProductGallerySettings: jest.fn(() => ({ thumbnails: false })),
}));
jest.mock('@shopgate/engage/settings/hooks', () => ({
  useProductImageSettings: () => ({
    gallery: {
      resolutions: [],
      ratio: null,
    },
  }),
}));
jest.mock('../../../../../ProductGallery/hooks', () => ({
  useGalleryPagination: () => ({
    ref: { current: null },
    style: {},
    paginationType: 'bullets',
    className: '',
  }),
}));

const media: ProductMediaItem[] = [
  {
    type: 'image',
    url: 'https://example.com/a.jpg',
    altText: 'Front',
  },
  {
    type: 'video',
    url: 'https://example.com/b.mp4',
  },
];

/**
 * Dispatches a pointer event. jsdom has no PointerEvent, so it is a mouse event with pointer fields.
 * @param target The element that receives the event.
 * @param type The pointer event type.
 * @param clientX The horizontal position of the pointer.
 * @param clientY The vertical position of the pointer.
 * @param pointerId The id of the pointer, 1 for the primary one.
 * @param buttons The pressed buttons, 0 once the mouse button is released.
 */
const pointer = (
  target: Element,
  type: string,
  clientX: number,
  clientY: number,
  pointerId = 1,
  buttons = 1
) => {
  const event = new MouseEvent(type, {
    bubbles: true,
    clientX,
    clientY,
    buttons,
  });
  Object.defineProperties(event, {
    pointerId: { value: pointerId },
    isPrimary: { value: pointerId === 1 },
  });
  fireEvent(target, event);
};

/** Lets the fade out of the viewer finish. */
const finishFadeOut = () => act(() => {
  jest.advanceTimersByTime(200);
});

describe('<MediaViewer />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('opens at the initial media and plays only the visible video', () => {
    render(<MediaViewer media={media} initialIndex={0} onClose={jest.fn()} />);

    expect(screen.getByRole('dialog', { name: 'product.media_viewer' })).toBeInTheDocument();
    expect(screen.getByTestId('swiper')).toHaveAttribute('data-initial-slide', '0');
    expect(screen.getByRole('img', { name: 'Front' })).toHaveAttribute('src', 'https://example.com/a.jpg');
    expect(screen.queryByTestId('video-player')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'show video' }));

    expect(screen.getByTestId('video-player')).toHaveAttribute('data-url', 'https://example.com/b.mp4');
  });

  it('shows the thumbnails below the media when they are switched on', () => {
    jest.mocked(useProductGallerySettings).mockReturnValueOnce({
      pagination: 'bullets',
      thumbnails: true,
    });
    render(<MediaViewer media={media} initialIndex={0} onClose={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'product.media_thumbnail_image' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'product.media_thumbnail_video' })).toBeInTheDocument();
  });

  it('closes with the visible media after fading out', () => {
    const onClose = jest.fn();
    render(<MediaViewer media={media} initialIndex={0} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'show video' }));
    fireEvent.click(screen.getByRole('button', { name: 'common.close' }));

    expect(onClose).not.toHaveBeenCalled();

    finishFadeOut();

    expect(onClose).toHaveBeenCalledWith(1);
  });

  it('closes on Escape', () => {
    const onClose = jest.fn();
    render(<MediaViewer media={media} initialIndex={0} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    finishFadeOut();

    expect(onClose).toHaveBeenCalledWith(0);
  });

  it('closes after a long vertical drag', () => {
    const onClose = jest.fn();
    render(<MediaViewer media={media} initialIndex={0} onClose={onClose} />);
    const dialog = screen.getByRole('dialog');

    pointer(dialog, 'pointerdown', 0, 0);
    pointer(dialog, 'pointermove', 0, 200);
    pointer(dialog, 'pointerup', 0, 200);
    finishFadeOut();

    expect(onClose).toHaveBeenCalledWith(0);
  });

  it('closes when the mouse reports the release with a move before the pointerup', () => {
    const onClose = jest.fn();
    render(<MediaViewer media={media} initialIndex={0} onClose={onClose} />);
    const dialog = screen.getByRole('dialog');

    pointer(dialog, 'pointerdown', 0, 0);
    pointer(dialog, 'pointermove', 0, 200);
    pointer(dialog, 'pointermove', 0, 200, 1, 0);
    pointer(dialog, 'pointerup', 0, 200, 1, 0);
    finishFadeOut();

    expect(onClose).toHaveBeenCalledWith(0);
  });

  it('stays open after a short or a horizontal drag', () => {
    const onClose = jest.fn();
    render(<MediaViewer media={media} initialIndex={0} onClose={onClose} />);
    const dialog = screen.getByRole('dialog');

    pointer(dialog, 'pointerdown', 0, 0);
    pointer(dialog, 'pointermove', 0, 50);
    pointer(dialog, 'pointerup', 0, 50);
    pointer(dialog, 'pointerdown', 0, 0);
    pointer(dialog, 'pointermove', 300, 120);
    pointer(dialog, 'pointerup', 300, 120);
    finishFadeOut();

    expect(onClose).not.toHaveBeenCalled();
    expect(dialog.style.getPropertyValue('--media-viewer-drag-offset')).toBe('0px');
  });

  it('keeps the browser from dragging the image away from the gesture', () => {
    render(<MediaViewer media={media} initialIndex={0} onClose={jest.fn()} />);

    expect(fireEvent.dragStart(screen.getByRole('img', { name: 'Front' }))).toBe(false);
  });

  it('cancels a drag when a second finger touches the screen', () => {
    render(<MediaViewer media={media} initialIndex={0} onClose={jest.fn()} />);
    const dialog = screen.getByRole('dialog');

    pointer(dialog, 'pointerdown', 0, 0);
    pointer(dialog, 'pointermove', 0, 60);
    pointer(dialog, 'pointerdown', 100, 100, 2);

    expect(dialog.style.getPropertyValue('--media-viewer-drag-offset')).toBe('0px');
    expect(dialog).not.toHaveAttribute('data-dragging');
  });
});
