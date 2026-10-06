import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, screen } from '@testing-library/react';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import { mockedState } from './mock';
import FormButtons from './index';

const mockedStore = configureStore();

describe('<FormButtons />', () => {
  it('should render submit and cancel button', () => {
    render((
      <Provider store={mockedStore(mockedState)}>
        <LoadingProvider>
          <FormButtons />
        </LoadingProvider>
      </Provider>
    ));

    const submitButton = screen.getByRole('button', { name: 'common.submit' });
    const cancelButton = screen.getByRole('button', { name: 'common.cancel' });

    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(submitButton).toHaveAttribute('data-test-id', 'sendReviewButton');
    expect(submitButton).toHaveAttribute('type', 'submit');
    expect(submitButton).toBeEnabled();
    expect(cancelButton).toHaveAttribute('data-test-id', 'reviewCancelButton');
    expect(cancelButton).toHaveAttribute('type', 'button');
  });
});
