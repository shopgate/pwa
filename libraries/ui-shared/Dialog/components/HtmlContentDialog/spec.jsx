import React from 'react';
import { shallow } from 'enzyme';
import HtmlContentDialog from './index';

const message = '<p><i>This is a html message.</i></p>';
const title = 'This is the title.';

jest.mock('@shopgate/engage/a11y/components');
jest.mock('@shopgate/engage/components', () => {
  const mockReact = jest.requireActual('react');

  function Text({ string }) {
    return mockReact.createElement('span', null, string);
  }
  Text.propTypes = { params: () => null };
  Text.defaultProps = { params: {} };

  const I18n = { Text };

  function Ellipsis({ children }) {
    return mockReact.createElement('span', null, children);
  }

  function Button({
    children, onClick, disabled, className,
  }) {
    return mockReact.createElement('button', {
      onClick,
      disabled,
      className,
    }, children);
  }

  return {
    I18n,
    Ellipsis,
    Button,
  };
});

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
