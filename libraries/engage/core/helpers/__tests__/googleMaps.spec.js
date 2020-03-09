import { generateGoogleMapsDirectionsUrl } from '../googleMaps';

describe('googleMaps', () => {
  it('should generate google maps directions link from address', () => {
    const expected = 'https://www.google.com/maps/dir/?api=1&destination=Schlossstra%C3%9Fe%2010%2C%20Butzbach%2035510';
    const address = {
      street: 'Schlossstraße 10',
      city: 'Butzbach',
      postalCode: 35510,
    };
    expect(generateGoogleMapsDirectionsUrl(address)).toEqual(expected);
  });
});
