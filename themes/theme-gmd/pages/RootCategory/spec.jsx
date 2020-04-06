import React from 'react';
import { shallow } from 'enzyme';
import RootCategory from './index';

jest.mock('@shopgate/engage/components');
jest.mock('Components/AppBar/presets');
jest.mock('Components/CategoryList', () => 'CategoryList');
jest.mock('./connector', () => Component => (
  <Component categories={[{
    id: 'cat1',
    name: 'Cat Name',
  }]}
  />
));

describe('Pages: <RootCategory />', () => {
  it('should render ', () => {
    const wrapper = shallow(RootCategory);
    expect(wrapper).toMatchSnapshot();
  });
});
