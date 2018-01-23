/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { mockedState } from './mock';
import FormButtons from './index';

const mockedStore = configureStore();

beforeEach(() => {
  jest.resetModules();
});

/**
 * Creates component with provided store state.
 * @param {Object} mockedState Mocked stage.
 * @return {ReactWrapper}
 */
const createComponent = () => mount(
  <Provider store={mockedStore(mockedState)}>
    <FormButtons />
  </Provider>
);

describe('<FormButtons />', () => {
  it('should render submit and cancel button', () => {
    const comp = createComponent();
    expect(comp).toMatchSnapshot();

    const submitButton = comp.find('Button').at(0);
    const cancelButton = comp.find('button').at(0);
    expect(submitButton.find('Translate').prop('string')).toEqual('common.submit');
    expect(cancelButton.length).toEqual(1);
    expect(cancelButton.find('Translate').prop('string')).toEqual('common.cancel');
  });
});
