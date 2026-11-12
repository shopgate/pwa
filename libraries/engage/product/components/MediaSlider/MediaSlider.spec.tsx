import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactNode } from 'react';
import MediaSlider from './MediaSlider';
import type { ProductMedia } from './MediaSlider';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) => selector({}),
}));
jest.mock('../../selectors/media', () => ({
  makeGetProductMedia: () => () => [
    {
      type: 'image',
      url: 'first.jpg',
      altText: 'First',
    },
    {
      type: 'image',
      url: 'second.jpg',
      altText: 'Second',
    },
  ],
}));
jest.mock('../../selectors/product', () => ({ makeGetProductFeaturedMedia: () => () => null }));
jest.mock('@shopgate/engage/core/actions', () => ({ historyPush: (params: unknown) => params }));
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: ({ children }: { children: ReactNode }) => children,
  Swiper: () => null,
}));
jest.mock('./components/MediaImage', () => (
  { media, onClick }: { media: ProductMedia; onClick: () => void }
) => (
  <button type="button" onClick={onClick}>{media.altText}</button>
));
jest.mock('./components/MediaVideo', () => () => null);
jest.mock('../Media/MediaImage', () => () => null);

describe('<MediaSlider />', () => {
  it('lists all media when stacked and opens the gallery at the clicked one', () => {
    render(<MediaSlider productId="1234" stacked />);

    expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Second' }));

    expect(mockDispatch).toHaveBeenCalledWith({ pathname: '/item/31323334/gallery/1' });
  });

  it('renders replaced slide components and reports clicks to onSlideClick', () => {
    const onSlideClick = jest.fn();
    const Slide = ({ media, onClick }: { media: ProductMedia; onClick: () => void }) => (
      <button type="button" onClick={onClick}>{`Custom ${media.altText}`}</button>
    );

    render(
      <MediaSlider productId="1234" stacked onSlideClick={onSlideClick} slideComponents={{ image: Slide }} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Custom Second' }));

    expect(onSlideClick).toHaveBeenCalledWith(1);
  });
});
