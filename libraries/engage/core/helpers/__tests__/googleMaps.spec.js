import { generateGoogleMapsDirectionsUrl } from '../googleMaps';

describe('googleMaps', () => {
  it('should generate google maps directions link from address', () => {
    const expected = '';
    const address = {
      street: 'Schlossstraße 10',
      city: 'Butzbach',
      postalCode: 35510,
    };
    expect(generateGoogleMapsDirectionsUrl(address)).toEqual(expected);
  });
});
