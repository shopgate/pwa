import React from 'react';
import { shallow } from 'enzyme';
import HtmlContentDialog from './index';

const message = '<p><i>This is a html message.</i></p>';
const title = 'This is the title.';

describe('<HtmlContentDialog />', () => {
  it('should render with minimal props', () => {
    const wrapper = shallow(<HtmlContentDialog message={message} actions={[]} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatch(message);
  });

  it('should render with title and html message', () => {
    const wrapper = shallow(<HtmlContentDialog title={title} message={message} actions={[]} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatch(title);
  });

  it('should render with title, html message and messageParams', () => {
    const wrapper = shallow((
      <HtmlContentDialog
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
      <HtmlContentDialog title={title} message={message} actions={actions} />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatch(actions[0].label);
  });

  it('should pass title through', () => {
    const customTitle = <div>Title</div>;
    const wrapper = shallow((
      <HtmlContentDialog
        title={customTitle}
        message={message}
        params={{}}
        actions={[]}
      />
    ));
    expect(wrapper.find('BasicDialog').prop('title')).toEqual(customTitle);
  });
});
