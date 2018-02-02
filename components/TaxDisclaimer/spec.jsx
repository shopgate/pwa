/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import I18n from '@shopgate/pwa-common/components/I18n';
import TaxDisclaimer from './index';

jest.mock('@shopgate/pwa-common-commerce/market/helpers/showTaxDisclaimer', () => true);

describe('<TaxDisclaimer />', () => {
  it('should display the component', () => {
    const wrapper = shallow(<TaxDisclaimer />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(I18n.Text).exists()).toBe(true);
  });
});