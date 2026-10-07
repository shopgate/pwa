import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DefaultBar } from 'Components/AppBar/presets';
import { ArrowIcon } from '@shopgate/pwa-ui-shared';
import AppBar from './index';

jest.mock('Components/AppBar/presets', () => ({
  DefaultBar: jest.fn(({ left }) => left),
}));
jest.mock('@shopgate/pwa-ui-shared', () => ({
  ArrowIcon: jest.fn(() => null),
}));

jest.mock('@shopgate/engage/components');

const mockedStore = configureStore();

describe('<ProductGallery.Appbar> page', () => {
  it('should render a default app bar', () => {
    const store = mockedStore();

    render((
      <Provider store={store}>
        <AppBar />
      </Provider>
    ));

    expect(DefaultBar.mock.lastCall[0]).toEqual(expect.objectContaining({
      backgroundColor: 'rgba(0, 0, 0, 0)',
      textColor: 'var(--sg-palette-common-white)',
    }));

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(ArrowIcon.mock.lastCall[0]).toEqual({ shadow: true });
  });
});
