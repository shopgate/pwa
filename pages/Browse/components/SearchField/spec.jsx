import React from 'react';
import { shallow } from 'enzyme';
import SearchField from './index';
import style from './style';

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => obj => obj);
jest.mock('@shopgate/pwa-core/commands/registerEvents', () => () => {});

/**
 * Converts a style class to a compatible selector.
 * @param {string} className The class name.
 * @returns {string} An enzyme selector for className.
 */
const getClassSelector = className => className.split(/\s+/).join('.');

jest.useFakeTimers();

describe('<SearchField />', () => {
  const defaultProps = {
    setSearchPhrase: () => {},
    submitSearch: () => {},
    searchPhrase: 'foo',
  };

  let element;

  beforeEach(() => {
    const props = {
      ...defaultProps,
      setSearchPhrase: jest.fn(),
      submitSearch: jest.fn(),
    };
    element = shallow(<SearchField {...props} />);
  });

  it('should render the search field', () => {
    expect(element).toMatchSnapshot();
  });

  it('should show the overlay when focused', () => {
    expect(element.find(`.${getClassSelector(style.overlay)}`).length).toBe(0);

    element.instance().handleFocusChange(true);
    jest.runAllTimers();
    element.update();
    const overlay = element.find(`.${getClassSelector(style.overlay)}`);
    expect(overlay.length).toBe(1);
  });

  it('should clear the overlay', () => {
    expect(element.find(`.${getClassSelector(style.overlay)}`).length).toBe(0);

    element.instance().handleFocusChange(false);
    jest.runAllTimers();
    element.update();
    const overlay = element.find(`.${getClassSelector(style.overlay)}`);
    expect(overlay.length).toBe(0);
  });
});
