/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { Swiper } from '@shopgate/engage/components';
import ImageSliderWidget from './index';

jest.mock('@shopgate/engage/components', () => {
  // eslint-disable-next-line no-shadow
  const Swiper = jest.fn(({ children }) => children);
  Swiper.Item = jest.fn(({ children }) => children);

  return {
    Swiper,
    Link: ({ href, children }) => <a href={href}>{children}</a>,
  };
});

/**
 * Renders the component
 * @param {Object} props Component props.
 * @return {Object}
 */
const renderComponent = (props = {}) => render(<ImageSliderWidget {...props} />);

describe('<ImageSliderWidget />', () => {
  const testImage = {
    image: 'http://placehold.it/350x150',
    link: 'http://example.com',
  };

  const testImage2 = {
    image: 'http://placehold.it/10x10',
    link: 'http://other.example.com',
  };

  const testSettings = {
    autostart: false,
    delay: 7000,
    pagination: true,
    loop: false,
    images: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the slider with the correct number of images', () => {
    const settings = {
      ...testSettings,
      images: [
        testImage,
        testImage2,
      ],
    };

    const { container } = renderComponent({ settings });

    expect(Swiper.mock.lastCall[0]).toEqual(expect.objectContaining({
      indicators: true,
      loop: false,
    }));
    expect(Swiper.mock.lastCall[0].autoplay).toBeUndefined();
    expect(container.querySelectorAll('img')).toHaveLength(settings.images.length);
  });

  it('should map the correct image settings to the components', () => {
    expect.assertions(3);
    const settings = {
      ...testSettings,
      images: [
        testImage,
        testImage2,
      ],
    };

    const { container } = renderComponent({ settings });

    const images = container.querySelectorAll('img');

    expect(images).toHaveLength(settings.images.length);
    images.forEach((image, index) => {
      const imageSettings = settings.images[index];

      expect(image).toHaveAttribute('src', imageSettings.image);
    });
  });

  it('should render no slider with just a single image', () => {
    const settings = {
      ...testSettings,
      images: [
        testImage,
      ],
    };

    const { container } = renderComponent({ settings });

    expect(Swiper).not.toHaveBeenCalled();
    expect(Swiper.Item).not.toHaveBeenCalled();
    expect(container.querySelectorAll('img')).toHaveLength(1);
    expect(screen.getByRole('link')).toHaveAttribute('href', testImage.link);
    expect(screen.getByRole('link')).toContainElement(container.querySelector('img'));
  });

  it('should render the images unlinked if no link is set', () => {
    const settings = {
      ...testSettings,
      images: [
        {
          ...testImage,
          link: null,
        },
      ],
    };

    const { container } = renderComponent({ settings });

    expect(screen.queryByRole('link', { hidden: true })).not.toBeInTheDocument();
    expect(container.querySelectorAll('img')).toHaveLength(1);
    expect(container.querySelector('img')).toHaveAttribute('src', testImage.image);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('should render the images with links', () => {
    const settings = {
      ...testSettings,
      images: [
        {
          // Add an image without a link
          ...testImage,
          link: null,
        },
        testImage2,
      ],
    };

    const { container } = renderComponent({ settings });

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(settings.images.length - 1);
    expect(links[0]).toHaveAttribute('href', testImage2.link);
    expect(links[0]).toContainElement(container.querySelector(`img[src="${testImage2.image}"]`));
    expect(Swiper.Item.mock.calls[0][0]).toMatchObject({ 'aria-hidden': true });
  });
});
/* eslint-enable react/prop-types */
