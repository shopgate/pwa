import React from 'react';
import { shallow, ReactWrapper } from 'enzyme';
import { MODAL_PIPELINE_ERROR } from '@shopgate/pwa-common/constants/ModalTypes';
import { MODAL_VARIANT_SELECT } from './constants';
import Dialog from './index';

jest.mock('./components/VariantSelectModal', () => {
  /**
   * VariantSelectModal mock.
   * @return {JSX}
   */
  const VariantSelectModal = () => <div />;
  return VariantSelectModal;
});

describe('<Dialog />', () => {
  it('should render without props', () => {
    const wrapper = shallow(<Dialog modal={{ message: 'msg' }} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('TextMessageDialog').length).toBe(1);
  });

  it('should render BasicDialog when no message given', () => {
    const wrapper = shallow(<Dialog modal={{ message: null }} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('BasicDialog').length).toBe(1);
  });

  it('should render a special dialog', () => {
    const params = {
      errorCode: '',
      message: '',
      pipeline: '',
      request: {},
    };

    const wrapper = shallow(<Dialog
      modal={{
        type: MODAL_PIPELINE_ERROR,
        params,
      }}
    />);

    expect(wrapper).toMatchSnapshot();

    expect(wrapper.find('DefaultDialog').length).toBe(0);
    expect(wrapper.find('PipelineErrorDialog').length).toBe(1);
  });

  it('should render variant select dialog', () => {
    const params = {
      productId: 'product_1',
    };

    const wrapper = shallow(<Dialog
      modal={{
        message: 'Test',
        type: MODAL_VARIANT_SELECT,
        params,
      }}
    />);

    expect(wrapper).toMatchSnapshot();

    expect(wrapper.find('DefaultDialog').length).toBe(0);
    expect(wrapper.find('VariantSelectModal').length).toBe(1);
  });

  it('should convert title into translatable element', () => {
    const title = 'translate.me';
    const titleParams = {
      foo: 'bar',
    };

    // eslint-disable-next-line extra-rules/no-single-line-objects
    const wrapper = shallow(<Dialog modal={{ title, titleParams }} />);
    const i18n = new ReactWrapper(wrapper.find('BasicDialog').prop('title'));

    expect(i18n.prop('string')).toEqual(title);
    expect(i18n.prop('params')).toEqual(titleParams);
  });
});
