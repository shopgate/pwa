import { render, screen } from '@testing-library/react';
import Headline from 'Components/Headline';
import Content from './index';

jest.mock('../../../../components/Search/SearchTrigger', () => function SearchTrigger() { return <div>SearchTrigger</div>; });
jest.mock('../RootCategories', () => function RootCategories() { return <div>RootCategories</div>; });
jest.mock('Components/Headline', () => jest.fn(() => null));
jest.mock('Components/AppBar/presets', () => ({
  BackBar: () => <div>BackBar</div>,
}));

describe('<Content />', () => {
  it('should render', () => {
    render(<Content />);

    expect(screen.getByText('BackBar')).toBeInTheDocument();
    expect(screen.getByText('SearchTrigger')).toBeInTheDocument();
    expect(screen.getByText('RootCategories')).toBeInTheDocument();
    expect(Headline.mock.lastCall[0]).toEqual({
      text: 'titles.browse',
      tag: 'h1',
    });
  });
});
