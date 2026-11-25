import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useWidget } from '@shopgate/engage/page/hooks';
import ImageWithText from './ImageWithText';

const mockPush = jest.fn();

jest.mock('@shopgate/engage/page/hooks', () => ({
  useWidget: jest.fn(),
}));
jest.mock('@shopgate/engage/core', () => ({
  useNavigation: () => ({ push: mockPush }),
}));
jest.mock('@shopgate/engage/components', () => ({
  Link: ({ href, children }: { href: string; children?: ReactNode }) => (
    <div role="link" data-href={href}>{children}</div>
  ),
  Typography: ({ children }: { children: ReactNode }) => <h3>{children}</h3>,
}));
jest.mock('@shopgate/engage/page/components', () => ({
  ResponsiveWidgetImage: ({ src, alt, borderRadius }: {
    src: string; alt: string; borderRadius: string;
  }) => (
    <img src={src} alt={alt} data-border-radius={borderRadius} />
  ),
  WidgetRichText: ({ content }: { content?: string }) => (content ? <div>{content}</div> : null),
}));

const image = {
  url: 'https://example.com/collection.jpg',
  altText: 'New collection',
};

const renderImageWithText = (config: object) => {
  (useWidget as jest.Mock).mockReturnValue({
    config: {
      image,
      borderRadius: 'default',
      ...config,
    },
    isPreview: false,
  });
  return render(<ImageWithText />);
};

describe('<ImageWithText />', () => {
  it('renders nothing without an image', () => {
    const { container } = renderImageWithText({ image: null });

    expect(container).toBeEmptyDOMElement();
  });

  it('shows only the image without headline, text and button', () => {
    const { container } = renderImageWithText({
      headline: { text: '' },
      text: '',
      buttonText: 'Discover',
    });

    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(container.querySelector('.widget__image-with-text__body')).not.toBeInTheDocument();
  });

  it('shows the image with its alt text, the headline and the text', () => {
    renderImageWithText({
      headline: { text: 'The new collection' },
      text: 'Warm jackets for cold days',
    });

    expect(screen.getByRole('img')).toHaveAttribute('alt', 'New collection');
    expect(screen.getByRole('heading')).toHaveTextContent('The new collection');
    expect(screen.getByText('Warm jackets for cold days')).toBeInTheDocument();
  });

  it('shows the button with a button text and a link and opens the link on click', () => {
    renderImageWithText({
      buttonText: 'Discover',
      link: '/category/new',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Discover' }));

    expect(mockPush).toHaveBeenCalledWith({ pathname: '/category/new' });
  });

  it('shows no button without a button text', () => {
    renderImageWithText({
      buttonText: '  ',
      link: '/category/new',
    });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows no button without a link', () => {
    renderImageWithText({ buttonText: 'Discover' });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('links the image when a link is set', () => {
    renderImageWithText({ link: '/category/new' });

    expect(screen.getByRole('link')).toHaveAttribute('data-href', '/category/new');
    expect(screen.getByRole('link')).toContainElement(screen.getByRole('img'));
  });

  it('does not link the image without a link', () => {
    renderImageWithText({});

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('rounds the image corners with the configured radius', () => {
    renderImageWithText({
      borderRadius: 'custom',
      borderRadiusCustom: 24,
    });

    expect(screen.getByRole('img')).toHaveAttribute('data-border-radius', '24px');
  });

  it('puts the image left with half the width by default', () => {
    const { container } = renderImageWithText({});

    expect(container.firstChild).toHaveAttribute('data-image-position', 'left');
    expect(container.firstChild).toHaveAttribute('data-image-width', 'half');
  });

  it('follows the configured image position and width', () => {
    const { container } = renderImageWithText({
      imagePosition: 'right',
      imageWidth: 'third',
    });

    expect(container.firstChild).toHaveAttribute('data-image-position', 'right');
    expect(container.firstChild).toHaveAttribute('data-image-width', 'third');
  });
});
