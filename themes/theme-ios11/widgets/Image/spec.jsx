/* eslint-disable react/prop-types */
import { render, screen, within } from '@testing-library/react';
import ImageWidget from './index';

jest.mock('@shopgate/pwa-common/components/Link', () => {
  /**
   * Mocked LinkComponent
   * @return {JSX}
   */
  const Link = ({ href, children }) => <a href={href}>{children}</a>;
  return Link;
});

describe('<ImageWidget />', () => {
  it('should render the ImageWidget', () => {
    const settings = {
      id: '81452',
      alt: 'Alt text',
      image: 'https://data.shopgate.com/shop_widget_images/22874/1a2a3d3.min.jpeg',
      link: '/category/3339',
    };

    render(<ImageWidget settings={settings} />);

    const link = screen.getByRole('link', { name: 'Alt text' });

    expect(link).toHaveAttribute('href', '/category/3339');
    expect(within(link).getByRole('img', { name: 'Alt text' })).toHaveAttribute('src', settings.image);
  });

  it('should render the ImageWidget without link', () => {
    const settings = {
      id: '81452',
      alt: 'Alt text',
      image: 'https://data.shopgate.com/shop_widget_images/22874/1a2a3d3.min.jpeg',
      link: '',
    };

    render(<ImageWidget settings={settings} />);

    const image = screen.getByRole('img', { name: 'Alt text' });

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(image).toHaveAttribute('src', settings.image);
    expect(image).toHaveAttribute('data-test-id', 'imageWidget: ');
  });
});
/* eslint-enable react/prop-types */
