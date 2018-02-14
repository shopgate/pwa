/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import VariantSelectModal from './index';

const message = 'This is the message.';
const title = 'This is the title.';
const mockOpen = jest.fn();

jest.mock('@shopgate/pwa-common/components/Router/helpers/parsed-link', () => (
  class {
    open = mockOpen;
  }));

describe('<VariantSelectModal />', () => {
  it('should render with minimal props', () => {
    const wrapper = shallow(<VariantSelectModal message={message} actions={[]} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatch(message);
  });

  it('should render the actions', () => {
    const mockConfirm = jest.fn();
    /**
     * Mocks named function
     */
    const onConfirm = () => {
      mockConfirm();
    };

    const actions = [{
      label: 'confirm',
      action: onConfirm,
    },
    {
      label: 'dismiss',
      action: () => {},
    }];

    const params = {
      productId: 'product_1',
    };

    const mockedProps = {
      message,
      title,
      actions: [...actions],
      params,
    };

    const wrapper = shallow(<VariantSelectModal {...mockedProps} />);
    expect(wrapper).toMatchSnapshot();

    const reordered = wrapper.find('BasicDialog').props().actions;
    const last = reordered.slice(-1)[0];
    expect(last.label).toEqual(actions[0].label);

    last.action();
    expect(mockConfirm).toHaveBeenCalledTimes(1);
    expect(mockOpen).toHaveBeenCalledTimes(1);
  });
});
