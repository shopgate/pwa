import React from 'react';
import { shallow } from 'enzyme';
import { UnwrappedVariantSelectModal as VariantSelectModal } from './index';

const message = 'This is the message.';
const title = 'This is the title.';

describe('<VariantSelectModal />', () => {
  it('should render with minimal props', () => {
    const wrapper = shallow(<VariantSelectModal
      message={message}
      actions={[]}
      navigate={() => {}}
    />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatch(message);
  });

  it('should render the actions', () => {
    const mockConfirm = jest.fn();
    const mockNavigate = jest.fn();
    /**
     * Mocks named function
     */
    const onConfirm = () => {
      mockConfirm();
    };

    const actions = [{
      label: 'confirm',
      action: onConfirm,
    },
    {
      label: 'dismiss',
      action: () => {},
    }];

    const params = {
      productId: 'product_1',
    };

    const mockedProps = {
      message,
      title,
      params,
      actions: [...actions],
      navigate: mockNavigate,
    };

    const wrapper = shallow(<VariantSelectModal {...mockedProps} />);
    expect(wrapper).toMatchSnapshot();

    const reordered = wrapper.find('BasicDialog').props().actions;
    const last = reordered.slice(-1)[0];
    expect(last.label).toEqual(actions[0].label);

    last.action();
    expect(mockConfirm).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
