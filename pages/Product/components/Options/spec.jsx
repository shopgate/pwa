/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Picker from 'Components/Picker';
import Options from './index';

describe('<Options />', () => {
  const mockRenderOptions = {
    context: {
      i18n: () => ({
        __: () => '',
        _p: () => '',
      }),
    },
  };
  const mockOptions = [{
    id: 'test-id',
    type: 'select',
    label: 'label',
    items: [
      {
        currency: 'USD',
        price: 10,
      },
      {
        currency: 'USD',
        price: 10,
      },
    ],
  }];
  let mockSetProductOption;
  let renderedElement;

  /**
   * Renders the component.
   * @param {Object} props The component props.
   */
  const renderComponent = (props) => {
    mockSetProductOption = jest.fn();

    renderedElement = mount(
      <Options setProductOption={mockSetProductOption} {...props} />,
      mockRenderOptions
    );
  };

  describe('Given the component was mounted to the DOM', () => {
    beforeEach(() => {
      renderComponent({});
    });

    it('should match snapshot', () => {
      expect(renderedElement).toMatchSnapshot();
    });

    describe('Given the component receives option props', () => {
      beforeEach(() => {
        renderedElement.setProps({
          options: mockOptions,
        });
      });

      it('should set first option values initially', () => {
        expect(mockSetProductOption).toBeCalled();
      });

      it('should render correct number of options', () => {
        const picker = renderedElement.find(Picker);
        expect(picker.length).toBe(mockOptions.length);
      });
    });
  });
});
