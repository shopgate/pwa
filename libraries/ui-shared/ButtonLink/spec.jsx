import React from 'react';
import { shallow } from 'enzyme';
import ActionButton from '../ActionButton';
import ButtonLink from './index';

describe.skip('<ButtonLink>', () => {
  describe('On click action', () => {
    beforeAll(() => {
      ActionButton.clickDelay = 0;
    });
    it('should create component and open page on click', () => {
      const component = shallow((
        <ButtonLink href="https://example.com">Text inside</ButtonLink>
      ));
      expect(component).toMatchSnapshot();
    });
  });
});
