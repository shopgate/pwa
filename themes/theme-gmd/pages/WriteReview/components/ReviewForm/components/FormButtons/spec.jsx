import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import { mockedState } from './mock';
import FormButtons from './index';

const mockedStore = configureStore();

beforeEach(() => {
  jest.resetModules();
});

/**
 * Creates component with provided store state.
 * @return {ReactWrapper}
 */
const createComponent = () => mount((
  <Provider store={mockedStore(mockedState)}>
    <LoadingProvider>
      <FormButtons />
    </LoadingProvider>
  </Provider>
));

describe('<FormButtons />', () => {
  it('should render submit and cancel button', () => {
    const comp = createComponent();
    expect(comp).toMatchSnapshot();

    const submitButton = comp.find('button[data-test-id="sendReviewButton"]');
    const cancelButton = comp.find('button[data-test-id="reviewCancelButton"]');
    expect(submitButton.find('Translate').prop('string')).toEqual('common.submit');
    // The form is submitted implicitly - the button has no onClick of its own.
    expect(submitButton.prop('type')).toEqual('submit');
    expect(cancelButton.length).toEqual(1);
    expect(cancelButton.find('Translate').prop('string')).toEqual('common.cancel');
  });
});
