/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import TextMessageDialog from './index';

const message = 'This is the message.';
const title = 'This is the title.';

describe('<TextMessageDialog />', () => {
  it('should render with minimal props', () => {
    const wrapper = shallow(
      <TextMessageDialog message={message} actions={[]} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatch(message);
  });

  it('should render with title and message', () => {
    const wrapper = shallow(
      <TextMessageDialog title={title} message={message} actions={[]} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatch(title);
  });

  it('should render the actions', () => {
    const actions = [{
      label: 'fooAction',
      action: () => {},
    }];

    const wrapper = shallow(
      <TextMessageDialog title={title} message={message} actions={actions} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatch(actions[0].label);
  });
});
