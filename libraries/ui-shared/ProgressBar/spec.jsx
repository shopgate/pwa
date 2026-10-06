import { render } from '@testing-library/react';
import ProgressBar from './index';

describe('<ProgressBar />', () => {
  it('renders an indeterminate progress bar.', () => {
    const { container } = render(<ProgressBar isVisible />);

    const bars = container.querySelectorAll('.ui-shared__progress-bar');

    expect(bars).toHaveLength(1);
    expect(bars[0]).toHaveStyle({ transform: 'scale(1, 1)' });
    expect(bars[0].firstElementChild.className).toContain('animating');
  });
});
