import React from 'react';
import { shallow } from 'enzyme';
import Image from '@shopgate/pwa-common/components/Image';
import ZoomPanSlider from './index';
import { MockedComponent } from './../../mock';

const mockedHammer = MockedComponent;
jest.mock('@shopgate/react-hammerjs/src/Hammer', () => mockedHammer);

/**
 * Test element component.
 * @returns {JSX}
 */
const TestElement = () => <Image src="http://placekitten.com/300/300" />;

describe('<ZoomPanSlider />', () => {
  it('renders with children', () => {
    const numChildren = 5;

    const wrapper = shallow((
      <ZoomPanSlider>
        <TestElement />
        <TestElement />
        <TestElement />
        <TestElement />
        <TestElement />
      </ZoomPanSlider>
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(TestElement).length).toBe(numChildren);
  });

  it('wraps children in zoom containers', () => {
    const numChildren = 2;

    const wrapper = shallow((
      <ZoomPanSlider>
        <TestElement />
        <TestElement />
      </ZoomPanSlider>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ZoomPanContainer').length).toBe(numChildren);
  });
});
