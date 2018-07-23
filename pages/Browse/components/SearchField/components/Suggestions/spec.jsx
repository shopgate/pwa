import React from 'react';
import { shallow } from 'enzyme';
import SearchSuggestions from './index';

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => obj => obj);

describe('<SearchSuggestions />', () => {
  const defaultProps = {
    getSearchSuggestions: () => {},
    fetchSearchSuggestions: () => {},
    setSearchPhrase: () => {},
    submitSearch: () => {},
    suggestions: [],
    isFetching: false,
    bottomHeight: 0,
  };

  it('should render without props', () => {
    const wrapper = shallow((
      <SearchSuggestions
        {...defaultProps}
        searchPhrase="foo"
        isFecthing={false}
      />));

    expect(wrapper).toMatchSnapshot();
  });

  it('should update the search phrase when selected a suggestion', () => {
    const searchPhrase = 'foo';

    const props = {
      ...defaultProps,
      setSearchPhrase: jest.fn(),
      fetchSearchSuggestions: jest.fn(),
      submitSearch: jest.fn(),
      getSearchSuggestions: jest.fn(),
      searchPhrase,
    };

    const wrapper = shallow(<SearchSuggestions {...props} />);

    wrapper.instance().handleSelect(searchPhrase);

    expect(props.setSearchPhrase).toHaveBeenCalledWith(searchPhrase);
    expect(props.submitSearch).toHaveBeenCalled();
    expect(props.fetchSearchSuggestions).toHaveBeenCalled();
  });

  it('should render the suggestions', () => {
    const props = {
      ...defaultProps,
      searchPhrase: 'foo',
      suggestions: [
        'foo',
        'bar',
        'baz',
      ],
    };

    const wrapper = shallow(<SearchSuggestions {...props} />);

    expect(wrapper.find('SearchSuggestion').length).toBe(props.suggestions.length);

    props.suggestions.forEach((item) => {
      expect(wrapper.find(`SearchSuggestion[suggestion="${item}"]`).length).toBe(1);
    });
  });

  it('should not render suggestions with too few characters typed', () => {
    const props = {
      ...defaultProps,
      searchPhrase: '',
      suggestions: [
        'foo',
        'bar',
        'baz',
      ],
    };

    const wrapper = shallow(<SearchSuggestions {...props} />);

    expect(wrapper.find('SearchSuggestion').length).toBe(0);

    wrapper.setProps({ searchPhrase: 'bar' });

    expect(wrapper.find('SearchSuggestion').length).toBe(props.suggestions.length);
  });
});
