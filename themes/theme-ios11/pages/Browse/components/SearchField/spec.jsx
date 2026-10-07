import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
import SuggestionList from './components/SuggestionList';
import SearchField from './index';

jest.mock('@virtuous/conductor', () => ({
  router: {
    update: jest.fn(),
  },
}));
jest.mock('@shopgate/engage/components', () => {
  const Input = jest.requireActual('@shopgate/pwa-common/components/Input');

  return {
    I18n: {
      Text: () => 'I18n.Text',
      Placeholder: () => null,
      Price: () => null,
    },
    Input: Input.default,
    SurroundPortals: ({ children }) => children,
    MagnifierIcon: () => null,
    BarcodeScannerIcon: () => null,
  };
});
jest.mock('./components/SuggestionList', () => jest.fn(() => null));
jest.mock('./connector', () => cmp => cmp);

describe('pages / Browse / components / SearchField', () => {
  let submitSearch;
  let openScanner;
  let fetchSuggestions;

  const renderComponent = props => render((
    <SearchField
      pageId="1234"
      query="foo"
      fetchSuggestions={fetchSuggestions}
      openScanner={openScanner}
      submitSearch={submitSearch}
      showScannerIcon={false}
      {...props}
    />
  ));

  const getCancelButton = () => document.querySelector('[data-test-id="search-field-cancel"]');

  const getScannerButton = () => document.querySelector('[data-test-id="search-field-scanner"]');

  beforeEach(() => {
    jest.clearAllMocks();
    submitSearch = jest.fn();
    fetchSuggestions = jest.fn();
    openScanner = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Check search field', () => {
    it('should render with initial search query', () => {
      renderComponent();

      expect(screen.getByRole('searchbox')).toHaveValue('foo');
      expect(getCancelButton()).toHaveAttribute('aria-hidden', 'true');
      expect(SuggestionList.mock.lastCall[0]).toEqual(expect.objectContaining({
        visible: false,
        searchPhrase: 'foo',
      }));
    });

    it('should show suggestions when focused', () => {
      jest.useFakeTimers();
      renderComponent({ showScannerIcon: true });

      expect(getScannerButton()).toBeInTheDocument();

      fireEvent.focus(screen.getByRole('searchbox'));
      act(() => {
        jest.runAllTimers();
      });

      expect(SuggestionList.mock.lastCall[0]).toEqual(expect.objectContaining({
        visible: true,
        searchPhrase: 'foo',
      }));
      expect(getScannerButton()).not.toBeInTheDocument();
      expect(getCancelButton()).toHaveAttribute('aria-hidden', 'false');
    });

    it('should submit search', () => {
      jest.useFakeTimers();
      const { container } = renderComponent();

      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'foo bar' } });
      fireEvent.submit(container.querySelector('form'));
      act(() => {
        jest.runAllTimers();
      });

      expect(submitSearch).toHaveBeenCalledWith('foo bar');
    });
  });

  describe('Check scanner icon and action', () => {
    it('should not render when the scanner is not supported', () => {
      renderComponent();

      expect(getScannerButton()).not.toBeInTheDocument();
    });

    it('should open the scanner', () => {
      renderComponent({
        showScannerIcon: true,
      });

      expect(getScannerButton()).toHaveAttribute('aria-label', 'titles.scanner');
      fireEvent.click(getScannerButton());

      expect(openScanner).toHaveBeenCalledTimes(1);
    });
  });
});
