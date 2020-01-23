import React, { useContext } from 'react';
import { shallow } from 'enzyme';
import Store from '../Store';

const context = {
  selectLocation: jest.fn(),
};

const store = {
  code: 'store',
  name: 'SomeStore',
  operationHours: {
    mon: '8:00am - 4:00pm',
  },
  inventory: {
    visible: 10,
  },
  addresses: [
    {
      code: 'address',
      phoneNumber: '000-000-0000',
    },
  ],
};

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

describe('<Store />', () => {
  it('should not render if no store is passed', () => {
    useContext.mockReturnValueOnce(context);
    const wrapper = shallow(<Store />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance()).toEqual(null);
  });

  it('should render as expected', () => {
    useContext.mockReturnValueOnce(context);
    const wrapper = shallow(<Store store={store} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('[data-test-id="store-name"]').text()).toEqual(store.name);
    expect(wrapper.find('StoreHoursToday').props().hours).toEqual(store.operationHours);
    expect(wrapper.find('OpeningHours').props().hours).toEqual(store.operationHours);
    expect(wrapper.find('Address').props().address).toEqual(store.addresses[0]);
    expect(wrapper.find('PhoneNumber').props().phone).toEqual(store.addresses[0].phoneNumber);
  });

  it('should handle the store selection', () => {
    useContext.mockReturnValueOnce(context);
    const wrapper = shallow(<Store store={store} />);
    expect(wrapper).toMatchSnapshot();
    wrapper.find('div[role="button"]').simulate('click');
    expect(context.selectLocation).toHaveBeenCalledWith({
      code: store.code,
      name: store.name,
      addressCode: store.addresses[0].code,
      visibleInventory: store.inventory.visible,
    });
  });
});
