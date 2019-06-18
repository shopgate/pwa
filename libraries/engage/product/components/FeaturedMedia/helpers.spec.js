import { buildFeaturedImageUrl } from './helpers';

jest.mock('@shopgate/pwa-common/collections/Configuration', () => ({
  get: jest.fn(),
}));

describe('FeaturedMedia/helpers', () => {
  describe('buildFeaturedImageUrl', () => {
    it('should build feature image url default params', () => {
      const url = 'https://images.shopgate.services/v2/images/scale/https://gonzo.shopgatepg.com/pub/media/catalog/product/m/j/mj01-yellow_main_1.jpg?Expires=1561244400&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9pbWFnZXMuc2hvcGdhdGUuc2VydmljZXMvdjIvaW1hZ2VzL3NjYWxlL2h0dHBzOi8vZ29uem8uc2hvcGdhdGVwZy5jb20vcHViL21lZGlhL2NhdGFsb2cvcHJvZHVjdC9tL2ovbWowMS15ZWxsb3dfbWFpbl8xLmpwZz8qIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTYxMjQ0NDAwfX19XX0_&Signature=e-0ijbS51pnXt6tu6DE22pYu4%7EvP-WCD%7EVtjS1%7ERA-TA-9KXp-vV7BBa06-aPxhCf7ikqlRHlPBxSl1lIepFrKppR5GJ6uUZeUWHWhD0YvQviO8sAQRFRAwCE%7E9NdS8Yi%7EuyKVmk%7E4LwruQQN6eefuDA67yKqWn4VUrItNGtC7RGfNpkvv%7Ekykhh5Z2Ou%7EiQkercpKV0ZDASJ0nZsFMqso2Q0BB7%7ERus9Tg0dIPSoWWqAA8tAKoyXd0eeFwG1WcAFI21MUnaN6k3Xnw0a8Lh2qG3yKNBvmGSZnT-wZrSVDjyiKPqMdra86GT13QYkLdcwAn7CDj01Vr1TIQS14fqhw__&Key-Pair-Id=APKAINMNDAWPE3XM2H7Q&version=1';
      const expected = `${url}&width=440&height=440&quality=75&fill=fff&format=jpeg`;

      expect(buildFeaturedImageUrl(url)).toEqual(expected);
    });

    it('should build feature image url custom params', () => {
      const url = 'https://images.shopgate.services/v2/images/scale/https://gonzo.shopgatepg.com/pub/media/catalog/product/m/j/mj01-yellow_main_1.jpg?Expires=1561244400&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9pbWFnZXMuc2hvcGdhdGUuc2VydmljZXMvdjIvaW1hZ2VzL3NjYWxlL2h0dHBzOi8vZ29uem8uc2hvcGdhdGVwZy5jb20vcHViL21lZGlhL2NhdGFsb2cvcHJvZHVjdC9tL2ovbWowMS15ZWxsb3dfbWFpbl8xLmpwZz8qIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTYxMjQ0NDAwfX19XX0_&Signature=e-0ijbS51pnXt6tu6DE22pYu4%7EvP-WCD%7EVtjS1%7ERA-TA-9KXp-vV7BBa06-aPxhCf7ikqlRHlPBxSl1lIepFrKppR5GJ6uUZeUWHWhD0YvQviO8sAQRFRAwCE%7E9NdS8Yi%7EuyKVmk%7E4LwruQQN6eefuDA67yKqWn4VUrItNGtC7RGfNpkvv%7Ekykhh5Z2Ou%7EiQkercpKV0ZDASJ0nZsFMqso2Q0BB7%7ERus9Tg0dIPSoWWqAA8tAKoyXd0eeFwG1WcAFI21MUnaN6k3Xnw0a8Lh2qG3yKNBvmGSZnT-wZrSVDjyiKPqMdra86GT13QYkLdcwAn7CDj01Vr1TIQS14fqhw__&Key-Pair-Id=APKAINMNDAWPE3XM2H7Q&version=1';
      const expected = `${url}&width=440&height=440&quality=100&fill=fff&format=webp`;

      // eslint-disable-next-line extra-rules/no-single-line-objects
      expect(buildFeaturedImageUrl(url, { quality: 100, format: 'webp' })).toEqual(expected);
    });

    it('should build quality from format', () => {
      const url = 'https://images.shopgate.services/v2/images/scale/https://gonzo.shopgatepg.com/pub/media/catalog/product/m/j/mj01-yellow_main_1.jpg?Expires=1561244400&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9pbWFnZXMuc2hvcGdhdGUuc2VydmljZXMvdjIvaW1hZ2VzL3NjYWxlL2h0dHBzOi8vZ29uem8uc2hvcGdhdGVwZy5jb20vcHViL21lZGlhL2NhdGFsb2cvcHJvZHVjdC9tL2ovbWowMS15ZWxsb3dfbWFpbl8xLmpwZz8qIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTYxMjQ0NDAwfX19XX0_&Signature=e-0ijbS51pnXt6tu6DE22pYu4%7EvP-WCD%7EVtjS1%7ERA-TA-9KXp-vV7BBa06-aPxhCf7ikqlRHlPBxSl1lIepFrKppR5GJ6uUZeUWHWhD0YvQviO8sAQRFRAwCE%7E9NdS8Yi%7EuyKVmk%7E4LwruQQN6eefuDA67yKqWn4VUrItNGtC7RGfNpkvv%7Ekykhh5Z2Ou%7EiQkercpKV0ZDASJ0nZsFMqso2Q0BB7%7ERus9Tg0dIPSoWWqAA8tAKoyXd0eeFwG1WcAFI21MUnaN6k3Xnw0a8Lh2qG3yKNBvmGSZnT-wZrSVDjyiKPqMdra86GT13QYkLdcwAn7CDj01Vr1TIQS14fqhw__&Key-Pair-Id=APKAINMNDAWPE3XM2H7Q&version=1';
      const expected = `${url}&width=440&height=440&quality=100&fill=fff&format=png`;

      // eslint-disable-next-line extra-rules/no-single-line-objects
      expect(buildFeaturedImageUrl(url, { quality: 100, format: 'png' })).toEqual(expected);
    });
  });
});
