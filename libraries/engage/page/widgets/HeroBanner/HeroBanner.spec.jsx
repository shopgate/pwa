import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroBanner from './HeroBanner';
import { useHeroBannerWidget } from './hooks';

const mockPush = jest.fn();

jest.mock('./hooks', () => ({
  useHeroBannerWidget: jest.fn(),
}));

jest.mock('@shopgate/engage/page/hooks', () => ({
  useWidget: () => ({ isPreview: false }),
}));

jest.mock('@shopgate/engage/core', () => ({
  useNavigation: () => ({ push: mockPush }),
}));

jest.mock('@shopgate/engage/components', () => ({
  /* eslint-disable react/prop-types */
  ConditionalWrapper: ({ condition, wrapper, children }) => (
    condition ? wrapper(children) : children
  ),
  Link: ({ href, children }) => <a href={href}>{children}</a>,
  /* eslint-enable react/prop-types */
}));

jest.mock('@shopgate/engage/page/components', () => ({
  // eslint-disable-next-line react/prop-types
  WidgetRichText: ({ content }) => <div>{content}</div>,
  ResponsiveWidgetImage: () => null,
}));

jest.mock('../../components/WidgetVideo', () => () => null);

describe('<HeroBanner />', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('links only the button when it has a button text and a link', () => {
    useHeroBannerWidget.mockReturnValue({
      text: 'Autumn sale',
      buttonText: 'Shop now',
      link: '/sale',
      mediaType: 'image',
    });
    render(<HeroBanner />);

    fireEvent.click(screen.getByRole('button', { name: 'Shop now' }));

    expect(mockPush).toHaveBeenCalledWith({ pathname: '/sale' });
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('links the whole banner when it has no button text', () => {
    useHeroBannerWidget.mockReturnValue({
      text: 'Autumn sale',
      link: '/sale',
      mediaType: 'image',
    });
    render(<HeroBanner />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/sale');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows no button without a link', () => {
    useHeroBannerWidget.mockReturnValue({
      text: 'Autumn sale',
      buttonText: 'Shop now',
      mediaType: 'image',
    });
    render(<HeroBanner />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
