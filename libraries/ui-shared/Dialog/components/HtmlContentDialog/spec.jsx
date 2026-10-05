import {
  render, screen, fireEvent, within,
} from '@testing-library/react';
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

  function Typography({ children }) {
    return mockReact.createElement('span', null, children);
  }

  return {
    I18n,
    Ellipsis,
    Button,
    Typography,
  };
});

describe('<HtmlContentDialog />', () => {
  it('should render with minimal props', () => {
    render(<HtmlContentDialog message={message} actions={[]} />);

    const dialog = screen.getByRole('alertdialog');
    const text = within(dialog).getByText('This is a html message.');

    expect(text.tagName).toBe('I');
    expect(text.parentElement.tagName).toBe('P');
    expect(within(dialog).queryByRole('heading')).not.toBeInTheDocument();
    expect(within(dialog).queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render with title and html message', () => {
    render(<HtmlContentDialog title={title} message={message} actions={[]} />);

    const dialog = screen.getByRole('alertdialog');

    expect(within(dialog).getByText(title)).toBeInTheDocument();
    expect(within(dialog).getByText('This is a html message.')).toBeInTheDocument();
    expect(within(dialog).queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render the actions', () => {
    const actions = [{
      label: 'fooAction',
      action: jest.fn(),
    }];

    render((
      <HtmlContentDialog title={title} message={message} actions={actions} />
    ));

    const dialog = screen.getByRole('alertdialog');

    expect(within(dialog).getByText(title)).toBeInTheDocument();
    expect(within(dialog).getAllByRole('button')).toHaveLength(1);

    fireEvent.click(within(dialog).getByRole('button', { name: actions[0].label }));

    expect(actions[0].action).toHaveBeenCalledTimes(1);
  });

  it('should pass title through', () => {
    render((
      <HtmlContentDialog
        title={<div>Custom title</div>}
        message={message}
        params={{}}
        actions={[]}
      />
    ));

    expect(within(screen.getByRole('alertdialog')).getByText('Custom title')).toBeInTheDocument();
  });
});
