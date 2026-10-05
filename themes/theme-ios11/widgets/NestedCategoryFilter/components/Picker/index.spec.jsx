/* eslint-disable react/prop-types */
import {
  render, screen, fireEvent, within,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { ThemeContext } from '@shopgate/pwa-common/context';
import { fetchCategoryOrRootCategories } from '@shopgate/engage/category';
import { Sheet as MockSheet } from '@shopgate/pwa-ui-shared';
import { mockedState, categoriesById, emptyRootCategories } from '../../mockData';
import Picker from './index';

jest.unmock('@shopgate/pwa-common/context');
jest.unmock('@shopgate/pwa-ui-shared');

jest.mock('@shopgate/engage/components', () => ({
  Typography: ({ children, 'data-test-id': testId }) => (
    <div data-test-id={testId}>{children}</div>
  ),
  SheetDrawer: props => <MockSheet {...props} />,
  SheetList: ({ children }) => <div role="listbox">{children}</div>,
}));

jest.mock('@shopgate/engage/category', () => ({
  fetchCategoryOrRootCategories: jest.fn(() => () => { }),
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
      <ThemeContext.Provider value={{ }}>
        <Picker {...props} />
      </ThemeContext.Provider>
    </Provider>
  ));
};

const getTrigger = container => container.querySelector('[data-test-id="nested-picker-trigger"]');
const getLabel = container => container.querySelector('[data-test-id="nested-picker-label"]');
const getSelection = container => container.querySelector('[data-test-id="nested-picker-selection"]');
const getOptions = () => within(screen.getByRole('listbox')).getAllByRole('button');

describe('<NestedCategoryFilterPicker />', () => {
  const onSelect = jest.fn();

  const props = {
    onSelect,
    categoryId: '1',
    label: 'Picker Label',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the picker with no initial category selection', () => {
    const { container } = renderComponent(props);

    expect(getLabel(container)).toHaveTextContent(props.label);
    expect(getSelection(container)).toHaveTextContent('common.please_choose');
    expect(getTrigger(container)).toHaveAttribute('aria-disabled', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(fetchCategoryOrRootCategories).not.toHaveBeenCalled();
  });

  it('should render the picker without a label', () => {
    const { container } = renderComponent({
      ...props,
      label: '',
    });

    expect(getLabel(container)).not.toBeInTheDocument();
    expect(getSelection(container)).toHaveTextContent('common.please_choose');
  });

  it('should handle user interaction as expected', () => {
    const { container } = renderComponent(props);

    fireEvent.click(getTrigger(container));

    const dialog = screen.getByRole('dialog');

    expect(within(dialog).getByRole('heading')).toHaveTextContent(props.label);

    const subcategoryList = getOptions();
    expect(subcategoryList).toHaveLength(2);
    expect(subcategoryList[0]).toHaveTextContent(categoriesById['1-1'].name);
    expect(subcategoryList[1]).toHaveTextContent(categoriesById['1-2'].name);

    fireEvent.click(subcategoryList[1]);
    fireEvent.animationEnd(dialog);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(props.categoryId, categoriesById['1-2']);
    expect(fetchCategoryOrRootCategories).not.toHaveBeenCalled();
  });

  it('should not accept user interaction when no categoryId was passed', () => {
    const { container } = renderComponent({
      ...props,
      categoryId: undefined,
    });

    fireEvent.click(getTrigger(container));

    expect(getTrigger(container)).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(fetchCategoryOrRootCategories).not.toHaveBeenCalled();
  });

  it('should accept user interaction when the categoryId is an empty string', () => {
    const { container } = renderComponent({
      ...props,
      categoryId: '',
    });

    fireEvent.click(getTrigger(container));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(getOptions().map(option => option.textContent)).toEqual([
      categoriesById['1'].name,
      categoriesById['2'].name,
    ]);
    expect(fetchCategoryOrRootCategories).not.toHaveBeenCalled();
  });

  it('should highlight the preselected subcategory within the sheet ', () => {
    const { container } = renderComponent({
      ...props,
      selectedId: '1-1',
    });

    expect(getSelection(container)).toHaveTextContent(categoriesById['1-1'].name);

    fireEvent.click(getTrigger(container));

    const [selected, unselected] = getOptions();

    expect(selected).toHaveTextContent(categoriesById['1-1'].name);
    expect(selected.className).toContain('buttonSelected');
    expect(unselected.className).not.toContain('buttonSelected');
    expect(fetchCategoryOrRootCategories).not.toHaveBeenCalled();
  });

  it('should request category data when it is not available yet', () => {
    const categoryId = '3';
    renderComponent({
      ...props,
      categoryId,
    });

    expect(fetchCategoryOrRootCategories).toHaveBeenCalledTimes(1);
    expect(fetchCategoryOrRootCategories).toHaveBeenCalledWith(categoryId);
  });

  it('should request root category data when it is not available yet', () => {
    const categoryId = '';
    renderComponent({
      ...props,
      categoryId,
    }, {
      category: {
        ...mockedState.category,
        rootCategories: emptyRootCategories,
      },
    });

    expect(fetchCategoryOrRootCategories).toHaveBeenCalledTimes(1);
    expect(fetchCategoryOrRootCategories).toHaveBeenCalledWith(categoryId);
  });
});
/* eslint-enable react/prop-types */
