/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { MODAL_PIPELINE_ERROR } from '@shopgate/pwa-common/constants/ModalTypes';
import Dialog from './index';

describe('<Dialog />', () => {
  it('should render without props', () => {
    const wrapper = shallow(
      <Dialog modal={{ message: 'msg' }} />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('TextMessageDialog').length).toBe(1);
  });

  it('should render a special dialog', () => {
    const params = {
      errorCode: '',
      message: '',
      pipelineName: '',
      request: {},
    };

    const wrapper = shallow(
      <Dialog
        modal={{
          type: MODAL_PIPELINE_ERROR,
          params,
        }}
      />
    );

    expect(wrapper).toMatchSnapshot();

    expect(wrapper.find('DefaultDialog').length).toBe(0);
    expect(wrapper.find('PipelineErrorDialog').length).toBe(1);
  });
});
