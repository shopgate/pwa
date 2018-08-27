/* eslint-disable extra-rules/no-single-line-objects, require-jsdoc */
import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import cloneDeep from 'lodash/cloneDeep';
import {
  mockedState as mockedProductState,
  mockedVariantStateAllFetching,
  mockedVariantStateVariantDataFetching,
  mockedVariantStateVariantsFetching,
  mockedVariantStateComplete,
} from '@shopgate/pwa-common-commerce/product/selectors/product.mock';
import ProductContent from './index';

const UPADTE_STATE = 'UPDATE_STATE';
const mockedStore = configureStore([thunk]);
jest.mock('@shopgate/react-hammerjs/src/Hammer', () => ({ children }) => children);
jest.mock('./../../context');

// Mock all child components to keep the snapshots small. The tests only check the applied props.
jest.mock('../ImageSlider', () => {
  const ImageSlider = () => <div />;
  return ImageSlider;
});
jest.mock('../Header', () => {
  const ProductHeader = () => <div />;
  return ProductHeader;
});
jest.mock('../Characteristics', () => {
  const Characteristics = () => <div />;
  return Characteristics;
});
jest.mock('../Options', () => {
  const Options = () => <div />;
  return Options;
});
jest.mock('../Description', () => {
  const Description = () => <div />;
  return Description;
});
jest.mock('../Properties', () => {
  const Properties = () => <div />;
  return Properties;
});
jest.mock('Components/Reviews', () => {
  const Reviews = () => <div />;
  return Reviews;
});
jest.mock('@shopgate/pwa-ui-shared/TaxDisclaimer', () => {
  const TaxDisclaimer = () => <div />;
  return TaxDisclaimer;
});

// Create a deep copy of the state to avoid unintended selector caching.
const createState = state => ({
  ...cloneDeep(state),
});

/**
 * Creates new component instance.
 * @param {Object} initialState A mocked initial state.
 * @param {Object} props A props object.
 * @return {JSX}
 */
const createComponent = (initialState, props = {}) => {
  /**
   * The component relies on a mixture of props which come from its parent component, and
   * some which some from its connector. So we use a mocked store here, which is updated via an
   * artificial action.
   */
  const store = mockedStore(() => {
    const actions = store.getActions();
    const lastAction = actions[actions.length - 1] || {};

    if (lastAction.type === UPADTE_STATE) {
      return createState(lastAction.state);
    }

    return createState(initialState);
  });

  const component = mount(<ProductContent {...props} store={store} />);

  return {
    store,
    component,
  };
};

/**
 * Triggers an update of the mocked store state.
 * @param {Object} state The new state.
 * @return {Object}
 */
const updateState = state => ({
  type: UPADTE_STATE,
  state,
});

/**
 * Runs a bunch of tests to check if the component created props for its children in the right way.
 * @param {JSX} component The component to test.
 * @param {Object} props The expected state / child component props.
 */
const runComponentTests = (component, props) => {
  const { productId, variantId } = props;

  expect(component).toMatchSnapshot();

  // Check the generated component state.
  const { state } = component.find('ProductContent').instance();
  expect(state).toEqual({
    productId,
    variantId,
    options: {},
  });

  const children = [
    component.find('ImageSlider'),
    component.find('ProductHeader'),
    component.find('Characteristics'),
    component.find('Options'),
    component.find('Description'),
    component.find('Properties'),
    component.find('Reviews'),
    component.find('TaxDisclaimer'),
  ];

  // Check if all expected children where rendered.
  children.forEach((child) => {
    expect(child.exists()).toBeTruthy();
  });

  const [
    ImageSlider,
    ProductHeader,
    Characteristics,
    Options,
    Description,
    Properties,
    Reviews,
    TaxDisclaimer,
  ] = children;

  // Perform a check if all props where assigned in the right way.
  expect(ImageSlider.props()).toMatchObject({ productId, variantId });
  expect(ProductHeader.props()).toMatchObject({});
  expect(Characteristics.props()).toMatchObject({ productId, variantId });
  expect(Description.props()).toMatchObject({ productId, variantId });
  expect(Properties.props()).toMatchObject({ productId, variantId });
  expect(TaxDisclaimer.props()).toEqual({});

  // Options do not accept props with a variantId yet
  const optionsProps = Options.props();
  expect(optionsProps).toMatchObject({ productId: variantId || productId });
  expect(optionsProps.variantId).toBeUndefined();

  // Reviews only relate to a base product. So a variantId should be never passed.
  const reviewsProps = Reviews.props();
  expect(reviewsProps).toMatchObject({ productId });
  expect(reviewsProps.variantId).toBeUndefined();
};

describe('<ProductContent />', () => {
  let mockedState;

  beforeEach(() => {
    mockedState = createState(mockedProductState);
  });

  describe('rendering when all relevant data is available inside the store', () => {
    it('should render a product without variants', () => {
      const productId = 'product_5';
      const variantId = null;

      const { component } = createComponent(mockedState, { productId });
      runComponentTests(component, { productId, variantId });
    });

    it('should render a variant product', () => {
      const productId = 'product_1';
      const variantId = 'product_2';

      const { component } = createComponent(mockedState, { productId: variantId });
      runComponentTests(component, { productId, variantId });
    });

    it('should handle variant product updates', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      const variantIdUpdate = 'product_3';

      const { component } = createComponent(mockedState, { productId: variantId });
      runComponentTests(component, { productId, variantId });

      component.setProps({ productId: variantIdUpdate });
      runComponentTests(component, { productId, variantId: variantIdUpdate });
    });
  });

  describe('rendering when product data is not available inside the store', () => {
    describe('simple products', () => {
      describe('initialization', () => {
        const productId = 'product_5';
        const variantId = null;

        let component;
        let store;

        beforeAll(() => {
          delete mockedState.product.productsById[productId];
          ({ component, store } = createComponent(mockedState, { productId }));
        });

        it('should initialize as expected when product data is not available yet', () => {
          runComponentTests(component, { productId, variantId });
        });

        it('should update as expected when data became available', () => {
          store.dispatch(updateState(mockedProductState));
          component.update();

          runComponentTests(component, { productId, variantId });
        });
      });
    });

    describe('products with variant products', () => {
      describe('initialization with a variant product', () => {
        const productId = 'product_1';
        const variantId = 'product_2';

        let component;
        let store;

        beforeAll(() => {
          // Prepare state with no product data available.
          ({ component, store } = createComponent(
            mockedVariantStateAllFetching,
            { productId: variantId }
          ));
        });

        it('should initialize as expected when no data is available at all', () => {
          // The variantId is still used as productId since real productId can't be determined yet.
          runComponentTests(component, { productId: variantId, variantId: null });
        });

        it('should render as expected when base product data came in but the rest is still fetching', () => {
          // Update the store with fetching variant data.
          store.dispatch(updateState(mockedVariantStateVariantDataFetching));
          component.update();

          // The variantId is still used as productId since real productId can't be determined yet.
          runComponentTests(component, { productId: variantId, variantId: null });
        });

        it('should render as expected when variant data came in but the variant product data is still fetching', () => {
          store.dispatch(updateState(mockedVariantStateVariantsFetching));
          component.update();

          // The variantId is still used as productId since real productId can't be determined yet.
          runComponentTests(component, { productId: variantId, variantId: null });
        });

        it('should render as expected when all data comes available', () => {
          store.dispatch(updateState(mockedVariantStateComplete));
          component.update();

          runComponentTests(component, { productId, variantId });
        });
      });

      describe('switch from a base product to a variant product whose data is not fetched yet', () => {
        const productId = 'product_1';
        const variantId = 'product_2';

        let component;
        let store;

        beforeAll(() => {
          ({ component, store } = createComponent(
            mockedVariantStateVariantsFetching,
            { productId }
          ));
        });

        it('should initialize with the base product', () => {
          runComponentTests(component, { productId, variantId: null });
        });

        it('should render as expected when switching to the variant product whose data is not available yet', () => {
          component.setProps({ productId: variantId, isVariant: true });
          runComponentTests(component, { productId, variantId });
        });

        it('should render as expected when the variant product data comes available', () => {
          store.dispatch(updateState(mockedVariantStateComplete));
          component.update();

          runComponentTests(component, { productId, variantId });
        });
      });

      describe('switch from one variant product to another one', () => {
        const productId = 'product_1';
        const variantId = 'product_2';
        const variantIdUpdate = 'product_3';

        let component;
        let store;

        beforeAll(() => {
          const initialState = createState(mockedVariantStateComplete);
          delete initialState.product.productsById[variantIdUpdate];

          ({ component, store } = createComponent(
            initialState,
            { productId, variantId }
          ));
        });

        it('should initialize with the initial variant product', () => {
          runComponentTests(component, { productId, variantId });
        });

        it('should render as expected when switching to another variant product whose data is not fetched yet', () => {
          component.setProps({ productId: variantIdUpdate, isVariant: true });
          runComponentTests(component, { productId, variantId: variantIdUpdate });
        });

        it('should render as expected when the variant product data comes available ', () => {
          store.dispatch(updateState(mockedVariantStateComplete));
          component.update();
          runComponentTests(component, { productId, variantId: variantIdUpdate });
        });
      });
    });
  });
});

/* eslint-enable extra-rules/no-single-line-objects, require-jsdoc */
