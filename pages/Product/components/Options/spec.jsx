/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import I18n from '@shopgate/pwa-common/components/I18n';
import Picker from 'Components/Picker';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import Options from './index';

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => (obj) => {
  const newObj = obj;

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

  newObj.defaultProps = {
    options: mockOptions,
    currentOptions: {},
  };

  return newObj;
});

describe('<Options />', () => {
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

    renderedElement = mount((
      <I18n.Provider lang="en" locales={{}}>
        <Options setProductOption={mockSetProductOption} {...props} />
      </I18n.Provider>),
      mockRenderOptions
    );
  };

  describe('Given the component was mounted to the DOM', () => {
    beforeEach(() => {
      renderComponent({ currentOptions: {} });
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
