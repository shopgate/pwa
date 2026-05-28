import React from 'react';
import { fireEvent, render } from '@shopgate/pwa-unit-test/rtlUtils';
import { UnwrappedButtonLink as ButtonLink } from './index';

describe('<ButtonLink>', () => {
  describe('On click action', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should create component and open page on click', () => {
      const mockedNavigate = jest.fn();
      const link = 'https://example.com';
      const component = render((
        <ButtonLink href={link} navigate={mockedNavigate}>Text inside</ButtonLink>
      ));

      expect(component.container.firstChild).toMatchSnapshot();
      fireEvent.click(component.container.querySelector('button'));
      jest.runOnlyPendingTimers();

      expect(mockedNavigate).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).toHaveBeenCalledWith(link);
    });
  });
});
