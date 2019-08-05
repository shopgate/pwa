import React from 'react';
import { shallow } from 'enzyme';
import TextMessageDialog from './index';

const message = 'This is the message.';
const title = 'This is the title.';

describe('<TextMessageDialog />', () => {
  it('should render with minimal props', () => {
    const wrapper = shallow(<TextMessageDialog message={message} actions={[]} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatch(message);
  });

  it('should render with title and message', () => {
    const wrapper = shallow(<TextMessageDialog title={title} message={message} actions={[]} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatch(title);
  });

  it('should render with title, message and messageParams', () => {
    const wrapper = shallow((
      <TextMessageDialog
        title={title}
        message="Message with {name}"
        params={{ name: 'Placeholder' }}
        actions={[]}
      />
    ));
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the actions', () => {
    const actions = [{
      label: 'fooAction',
      action: () => {},
    }];

    const wrapper = shallow((
      <TextMessageDialog title={title} message={message} actions={actions} />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatch(actions[0].label);
  });

  it('should pass title through', () => {
    const customTitle = <div>Title</div>;
    const wrapper = shallow((
      <TextMessageDialog
        title={customTitle}
        message={message}
        params={{}}
        actions={[]}
      />
    ));
    expect(wrapper.find('BasicDialog').prop('title')).toEqual(customTitle);
  });
});
