import React from 'react';
import { shallow, mount } from 'enzyme';
import Locations from '../Locations';
import StoreSelectorContext from '../context';

const locations = [
  {
    code: 1,
    name: 'test1',
  },
  {
    code: 2,
    name: 'test2',
  },
];

describe('<Locations />', () => {
  it('should not render if no locations have been passed', () => {
    const wrapper = shallow((
      <StoreSelectorContext.Provider>
        <Locations />
      </StoreSelectorContext.Provider>
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance()).toEqual(null);
  });

  it('should render locations', () => {
    const wrapper = mount((
      <StoreSelectorContext.Provider value={locations}>
        <Locations />
      </StoreSelectorContext.Provider>
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Locations').getElements().length).toEqual(1);
  });
});
