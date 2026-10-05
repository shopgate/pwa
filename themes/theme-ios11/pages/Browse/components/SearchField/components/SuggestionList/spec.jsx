import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { SurroundPortals } from '@shopgate/engage/components';
import { SEARCH_SUGGESTIONS } from '@shopgate/engage/search/constants';
import SuggestionList, { UnwrappedSuggestionList } from './index';

const store = createMockStore();

let mockedFetchingState;
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: jest.fn(({ children }) => children),
}));
jest.mock('@shopgate/pwa-common-commerce/search/selectors', () => ({
  getSuggestions: () => ([
    'foo',
    'foo bar',
    'foo bar buz',
    'foo bar buz quz',
  ]),
  getSuggestionsFetchingState: () => mockedFetchingState,
}));

const getRenderedSuggestions = () => screen.getAllByRole('button').map(button => button.value);

describe('<SuggestionList />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchingState = false;
  });

  it('should render a list of suggestions', () => {
    render((
      <Provider store={store}>
        <SuggestionList bottomHeight={10} onClick={() => {}} visible />
      </Provider>
    ));

    expect(getRenderedSuggestions()).toEqual(['foo', 'foo bar', 'foo bar buz', 'foo bar buz quz']);
  });

  it('should not update while suggestions are fetching', () => {
    const suggestionsOne = ['foo', 'foo bar', 'foo bar buz', 'foo bar buz quz'];
    const suggestionsTwo = ['foo bar buz quz', 'foo bar buz', 'foo bar', 'foo'];
    const props = {
      bottomHeight: 10,
      onClick: () => { },
      visible: true,
    };

    const { rerender } = render((
      <UnwrappedSuggestionList {...props} suggestions={suggestionsOne} fetching={false} />
    ));

    expect(getRenderedSuggestions()).toEqual(suggestionsOne);

    rerender(<UnwrappedSuggestionList {...props} suggestions={suggestionsTwo} fetching />);

    expect(getRenderedSuggestions()).toEqual(suggestionsOne);

    rerender(<UnwrappedSuggestionList {...props} suggestions={suggestionsTwo} fetching={false} />);

    expect(getRenderedSuggestions()).toEqual(suggestionsTwo);
  });

  it('should call onClick with suggestion', () => {
    const onClickMock = jest.fn();
    render((
      <Provider store={store}>
        <SuggestionList bottomHeight={10} onClick={onClickMock} visible />
      </Provider>
    ));

    fireEvent.click(screen.getAllByRole('button')[2]);

    expect(onClickMock).toHaveBeenCalledWith(expect.anything(), 'foo bar buz');
  });

  it('should render portal without suggestions', () => {
    const { container } = render((
      <UnwrappedSuggestionList bottomHeight={0} onClick={() => { }} suggestions={null} visible />
    ));

    expect(container).toBeEmptyDOMElement();
    expect(SurroundPortals.mock.lastCall[0]).toEqual(expect.objectContaining({
      portalName: SEARCH_SUGGESTIONS,
      portalProps: expect.objectContaining({
        suggestions: null,
        searchPhrase: '',
        visible: true,
        bottomHeight: 0,
      }),
    }));
  });
});
