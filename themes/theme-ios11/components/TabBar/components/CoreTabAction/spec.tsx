import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TAB_BROWSE } from '../../constants';
import { createCoreTabAction } from './index';

jest.mock('@shopgate/engage/core/hooks/useAppDispatch', () => ({ useAppDispatch: () => jest.fn() }));
jest.mock('@shopgate/engage/components', () => ({
  I18n: { Text: ({ string }: { string: string }) => string },
}));
jest.mock('../../hooks', () => ({ useTabBarSettings: () => ({}) }));

const BrowseTab = createCoreTabAction(TAB_BROWSE);

describe('createCoreTabAction', () => {
  it('draws the default icon in a 24 px box that it may extend past', () => {
    render(<BrowseTab />);
    const svg = screen.getByRole('tab').querySelector('svg') as SVGSVGElement;
    const style = getComputedStyle(svg);

    expect(style.width).toBe('24px');
    expect(style.height).toBe('24px');
    expect(style.overflow).toBe('visible');
    expect(svg).toHaveAttribute('viewBox', '2.6977 2.6977 18.6047 18.6047');
  });
});
