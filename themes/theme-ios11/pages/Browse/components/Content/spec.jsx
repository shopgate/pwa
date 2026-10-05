import { render, screen } from '@testing-library/react';
import Headline from 'Components/Headline';
import SearchField from '../SearchField';
import Content from './index';

jest.mock('../SearchField', () => jest.fn(() => <div>SearchField</div>));
jest.mock('../RootCategories', () => function RootCategories() { return <div>RootCategories</div>; });
jest.mock('Components/Headline', () => jest.fn(() => null));
jest.mock('Components/AppBar/presets', () => ({
  BackBar: () => <div>BackBar</div>,
}));

describe('<Content />', () => {
  it('should render', () => {
    render(<Content pageId="1234" query="foo" />);

    expect(screen.getByText('BackBar')).toBeInTheDocument();
    expect(screen.getByText('SearchField')).toBeInTheDocument();
    expect(screen.getByText('RootCategories')).toBeInTheDocument();
    expect(Headline.mock.lastCall[0]).toEqual({
      text: 'titles.browse',
      tag: 'h1',
    });
    expect(SearchField.mock.lastCall[0]).toEqual({
      pageId: '1234',
      query: 'foo',
    });
  });
});
