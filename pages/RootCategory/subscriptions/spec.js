import fetchRootCategories from '@shopgate/pwa-common-commerce/category/actions/fetchRootCategories';
import { rootCategoryWillEnter$ } from '../streams';
import subscriptions from '.';

jest.mock('@shopgate/pwa-common-commerce/category/actions/fetchRootCategories', () => jest.fn());
jest.mock('../streams', () => jest.fn());

describe('RootCategory subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn();

  subscriptions(subscribe);

  it('should fetch categories when page is entered', () => {
    const [stream$, subscription] = subscribe.mock.calls[0];

    expect(stream$).toBe(rootCategoryWillEnter$);

    fetchRootCategories.mockImplementation(() => 'fetchRootCategories');

    subscription({ dispatch });
    expect(dispatch).toBeCalledWith('fetchRootCategories');
  });
});
