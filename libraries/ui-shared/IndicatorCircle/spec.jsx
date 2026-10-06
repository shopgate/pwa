import { render } from '@testing-library/react';
import IndicatorCircle from './index';

describe('<IndicatorCircle />', () => {
  it('should apply the given size', () => {
    const { container } = render(<IndicatorCircle size={32} />);

    const svg = container.querySelector('[data-test-id="loadingIndicator"]');

    expect(svg).toHaveClass('ui-shared__indicator-circle');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
    expect(svg).toHaveAttribute('viewBox', '25 25 50 50');
  });

  it('should apply the given color', () => {
    const { container } = render(<IndicatorCircle size={32} color="#fff" strokeWidth={4} />);

    const circle = container.querySelector('circle');

    expect(circle).toHaveAttribute('class');
    expect(circle).toHaveStyle({
      stroke: '#fff',
      strokeWidth: 4,
    });
  });
});
