import { render, screen } from '@testing-library/react';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import CategoryContent from './components/Content';
import Category from './index';

jest.mock('@shopgate/engage/components');
jest.mock('./components/Content', () => jest.fn(() => <div>CategoryContent</div>));

describe('Pages: <Category />', () => {
  it('should render', () => {
    render(<Category />);

    expect(screen.getByText('CategoryContent')).toBeInTheDocument();
    expect(CategoryContent.mock.lastCall[0]).toEqual({ categoryId: hex2bin('1234') });
  });
});
