import React from 'react';
import { mount } from 'enzyme';
import FormElement from './index';

const inputProps = {
  htmlFor: 'test-input',
};

describe('<FormElement />', () => {
  // Simple tests for snapshots
  const tests = {
    'should render a form element with no children': { props: {} },
    'should render a form element with 1 child': { props: { children: [<input key="test-key" />] } },
    'should render a focused form element': { props: { isFocused: true } },
    'should show the label': { props: { label: 'The label' }, find: 'Label', equal: 'The label' },
    'should show the error message': { props: { errorText: 'The error text' }, find: 'ErrorText', equal: 'The error text' },
    'should show the placeholder text': { props: { placeholder: 'The placeholder' }, find: 'Placeholder', equal: 'The placeholder' },
  };

  Object.keys(tests).forEach((test) => {
    it(test, () => {
      const testFixtures = tests[test];
      const wrapper = mount(<FormElement {...{ ...inputProps, ...testFixtures.props }} />);
      expect(wrapper).toMatchSnapshot();
      if (testFixtures.find) {
        expect(wrapper.find(testFixtures.find).find('Translate').props().string).toEqual(testFixtures.equal);
      }
    });
  });

  it('Should hide placeholder with hasValue', () => {
    const wrapper = mount(<FormElement label="testlabel" {...inputProps} hasValue />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Placeholder').props().visible).toEqual(false);
  });
});
