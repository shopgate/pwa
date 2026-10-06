/* eslint-disable extra-rules/no-single-line-objects, react/prop-types */
import {
  render, screen, fireEvent, within,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { ThemeContext, RouteContext } from '@shopgate/pwa-common/context';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { Sheet as MockSheet } from '@shopgate/pwa-ui-shared';
import { mockedState } from './mockData';
import { UnwrappedNestedCategoryFilter as Widget } from './index';

jest.unmock('@shopgate/pwa-common/context');
jest.unmock('@shopgate/pwa-ui-shared');

jest.mock('@shopgate/engage/components', () => ({
  Typography: ({ children, component: Component = 'div', 'data-test-id': testId }) => (
    <Component data-test-id={testId}>{children}</Component>
  ),
  SheetDrawer: props => <MockSheet {...props} />,
  SheetList: jest.requireActual('@shopgate/engage/components/SheetList').default,
  I18n: {
    Text: ({ string }) => string,
  },
}));

jest.mock('@shopgate/engage/components/v2', () => ({
  Button: ({ href, disabled, children }) => (
    <a href={href} aria-disabled={disabled}>{children}</a>
  ),
}));

jest.mock('@virtuous/conductor', () => ({
  router: {
    update: jest.fn(),
  },
}));

/**
 * Renders the component.
 * @param {Object} props The component props.
 * @param {Object} [state=mockedState] A mocked Redux state.
 * @return {Object} The render result.
 */
const renderComponent = (props = {}, state = mockedState) => {
  const store = configureStore([thunk])(state);

  return render((
    <Provider store={store}>
      <ThemeContext.Provider value={{}}>
        <RouteContext.Provider value={{ id: 'route-id', state: {} }}>
          <Widget {...props} />
        </RouteContext.Provider>
      </ThemeContext.Provider>
    </Provider>
  ));
};

const id = 'widget-id';
const settings = {
  categoryNumber: '',
  limit: '4',
  headline: 'Widget Headline',
  label_1: 'Label One',
  label_2: 'Label Two',
  label_3: '',
  label_4: '',
};

const props = {
  id,
  settings,
};

const getPickers = container => Array.from(container.querySelectorAll('[data-test-id="nested-picker-trigger"]'));

/**
 * @param {HTMLElement} container The container of the rendered widget.
 * @param {Array} expectedSelections A list of expected selection texts for the pickers.
 * @param {string} [buttonCategoryId=null] A categoryId for the button link.
 */
const checkWidget = (container, expectedSelections, buttonCategoryId = null) => {
  const pickers = getPickers(container);

  expect(pickers).toHaveLength(expectedSelections.length);
  pickers.forEach((picker, index) => {
    const label = settings[`label_${index + 1}`];
    const selection = picker.querySelector('[data-test-id="nested-picker-selection"]');

    expect(picker).toHaveTextContent(`${label}${expectedSelections[index]}`);
    expect(selection).toHaveTextContent(expectedSelections[index]);
  });

  const button = screen.getByRole('link', { name: 'common.show_products' });

  expect(button).toHaveAttribute('href', `${CATEGORY_PATH}/${bin2hex(buttonCategoryId)}`);
  expect(button).toHaveAttribute('aria-disabled', `${!buttonCategoryId}`);
};

/**
 * Opens the sheet of a picker and selects one of its options.
 * @param {HTMLElement} picker The picker trigger.
 * @param {number} optionIndex The index of the option to select.
 * @returns {string[]} The names of the options that were offered.
 */
const selectOption = (picker, optionIndex) => {
  fireEvent.click(picker);

  const dialog = screen.getByRole('dialog');
  const options = within(within(dialog).getByRole('listbox')).getAllByRole('button');
  const names = options.map(option => option.textContent);

  fireEvent.click(options[optionIndex]);
  fireEvent.animationEnd(dialog);

  return names;
};

describe('<NestedCategoryFilterWidget />', () => {
  it('should render the widget with a persisted state and handle user interaction as expected', () => {
    const persistedState = {
      pickers: [
        { categoryId: '', selectedId: '1' },
        { categoryId: '1', selectedId: '1-2' },
        { categoryId: '1-2', selectedId: '1-2-1' },
      ],
      buttonCategoryId: '1-2-1',
    };

    const { container } = renderComponent({
      ...props,
      persistedState,
    });

    expect(screen.getByRole('heading', { name: settings.headline })).toBeInTheDocument();

    checkWidget(container, ['Category 1', 'Category 1-2', 'Category 1-2-1'], '1-2-1');

    expect(selectOption(getPickers(container)[0], 0)).toEqual(['Category 1', 'Category 2']);

    checkWidget(container, ['Category 1', 'common.please_choose']);

    expect(selectOption(getPickers(container)[1], 0)).toEqual(['Category 1-1', 'Category 1-2']);

    checkWidget(container, ['Category 1', 'Category 1-1'], '1-1');
  });

  it('should render the widget without a headline and persisted state', () => {
    const { container } = renderComponent({
      ...props,
      settings: {
        ...props.settings,
        headline: '',
        limit: '3',
      },
    });

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();

    checkWidget(container, ['common.please_choose']);

    expect(selectOption(getPickers(container)[0], 1)).toEqual(['Category 1', 'Category 2']);

    checkWidget(container, ['Category 2'], '2');
  });

  it('should render the widget for a category which is not the root category', () => {
    const { container } = renderComponent({
      ...props,
      settings: {
        ...props.settings,
        categoryNumber: '1',
      },
    });

    checkWidget(container, ['common.please_choose']);

    expect(selectOption(getPickers(container)[0], 0)).toEqual(['Category 1-1', 'Category 1-2']);

    checkWidget(container, ['Category 1-1'], '1-1');
  });
});

/* eslint-enable extra-rules/no-single-line-objects, react/prop-types */
