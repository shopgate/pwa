import React from 'react';
import { mount } from 'enzyme';
import { MockedView } from 'Components/View/mock';

const mockedView = MockedView;
jest.mock('Components/View', () => mockedView);

jest.mock('../ClearButton/connector.js', () => Component => Component);

describe.skip('FilterAttribute: MultiSelect', () => {
  const defaultProps = {
    mergeTemporaryFilters: jest.fn(),
    removeTemporaryFilter: jest.fn(),
    temporaryFilters: {},
  };
  /**
   * Creates component.
   * @param {Object} [props=defaultProps] Props.
   * @returns {Object}
   */
  const createComponent = (props = defaultProps) => {
    // eslint-disable-next-line global-require
    const MultiSelect = require('./index').default;

    return mount(<MultiSelect {...props} />);
  };

  it('should render nothing', () => {
    const wrapper = createComponent();
    expect(wrapper.find('Attribute').exists()).toBe(false);
  });

  it('should render single selection', () => {
    const temporaryFilters = {
      category: {
        values: ['foo'],
      },
    };
    const currentAttribute = {
      id: 'category',
      label: 'Category',
      values: [
        {
          id: 'foo',
          label: 'Foo',
          value: 'foo',
        },
        {
          id: 'bar',
          label: 'Boo',
          value: 'bar',
        },
      ],
    };
    const wrapper = createComponent({
      ...defaultProps,
      currentAttribute,
      temporaryFilters,
    });

    expect(wrapper).toMatchSnapshot();
    wrapper.find('Item').at(1).simulate('click');
    expect(defaultProps.mergeTemporaryFilters.mock.calls[0][0].category.values)
      .toEqual(['foo', 'bar']);

    wrapper.find('Item').at(0).simulate('click');
    expect(defaultProps.removeTemporaryFilter.mock.calls[0][0]).toEqual('category');
    expect(defaultProps.removeTemporaryFilter.mock.calls[0][1]).toEqual(0);
  });
});
