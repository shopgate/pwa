import React from 'react';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { TiersUnconnected as Tiers } from './index';

jest.mock('@shopgate/engage/core/helpers/i18n', () => ({
  i18n: {
    text: input => input,
  },
}));

describe('<Tiers />', () => {
  const store = configureStore()({});

  describe('Rendering', () => {
    describe('Rendering with data', () => {
      it('should render tier prices when tier prices are available', () => {
        const price = {
          tiers: [
            {
              from: 1,
              to: 10,
              unitPrice: 99.99,
            },
            {
              from: 11,
              to: 9999,
              unitPrice: 80,
            },
          ],
          currency: 'USD',
        };

        const wrapper = mount((
          <Tiers price={price} store={store} />
        ));

        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('Rendering without data', () => {
      it('should render nothing when price data are not available ({})', () => {
        const wrapper = mount((
          <Tiers price={{}} store={store} />
        ));

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.exists()).toBe(true);
      });

      it('should render nothing when price data are not available (null)', () => {
        const wrapper = mount((
          <Tiers price={null} store={store} />
        ));

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.exists()).toBe(true);
      });

      it('should render nothing when tier prices are empty ([])', () => {
        const price = {
          tiers: [],
          currency: 'USD',
        };

        const wrapper = mount((
          <Tiers price={price} store={store} />
        ));

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.exists()).toBe(true);
      });

      it('should render nothing when tier prices are not available (field missing)', () => {
        const price = {
          currency: 'USD',
        };

        const wrapper = mount((
          <Tiers price={price} store={store} />
        ));

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.exists()).toBe(true);
      });
    });
  });
});

