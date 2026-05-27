import React from 'react';
import { render } from '@shopgate/pwa-unit-test/rtlUtils';
import ActionButton from '../ActionButton';
import { UnwrappedButtonLink as ButtonLink } from './index';

describe('<ButtonLink>', () => {
  describe('On click action', () => {
    beforeAll(() => {
      ActionButton.clickDelay = 0;
    });

    it('should create component and open page on click', () => {
      const mockedNavigate = jest.fn();
      const link = 'https://example.com';
      const component = render((
        <ButtonLink href={link} navigate={mockedNavigate}>Text inside</ButtonLink>
      ));
      expect(component.asFragment()).toMatchSnapshot();
      component.simulate('click');
      expect(mockedNavigate).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).toHaveBeenCalledWith(link);
    });
  });
});
