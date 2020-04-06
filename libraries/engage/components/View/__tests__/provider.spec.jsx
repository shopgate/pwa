import React from 'react';
import { shallow } from 'enzyme';
import Provider from '../provider';

jest.mock('../context');

describe('engage > components > view > provider', () => {
  it('should initialize and provider context', () => {
    const wrapper = shallow((
      <Provider>
        <div>Page #1</div>
      </Provider>
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
