import {
  render, screen, waitFor, within,
} from '@testing-library/react';
import '@shopgate/engage/components';
import BasicDialog from './index';

const props = {
  title: 'Hello World',
  children: <div>Dialog content</div>,
  actions: [
    {
      label: 'action0',
      action: jest.fn(),
    },
    {
      label: 'action1',
      action: jest.fn(),
    },
    {
      label: 'action2',
      action: jest.fn(),
    },
  ],
};

jest.mock('@shopgate/engage/a11y/components', () => {
  const FocusTrap = jest.requireActual('focus-trap-react');

  return {
    // eslint-disable-next-line react/prop-types
    FocusTrap: ({ focusTrapOptions, ...rest }) => (
      <FocusTrap
        {...rest}
        focusTrapOptions={{
          ...focusTrapOptions,
          tabbableOptions: { displayCheck: 'none' },
        }}
      />
    ),
  };
});

describe('<BasicDialog />', () => {
  it('should render with minimal props', () => {
    render(<BasicDialog actions={[]} />);

    const dialog = screen.getByRole('alertdialog');

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(within(dialog).queryByRole('heading')).not.toBeInTheDocument();
    expect(within(dialog).queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render as expected', () => {
    render(<BasicDialog {...props} />);

    const dialog = screen.getByRole('alertdialog', { name: 'Hello World Dialog content' });

    expect(within(dialog).getByRole('heading', { name: props.title })).toBeInTheDocument();
    expect(within(dialog).getByText('Dialog content')).toBeInTheDocument();
    expect(within(dialog).getAllByRole('button').map(button => button.textContent))
      .toEqual(props.actions.map(({ label }) => label));
  });

  it('should focus the dialog instead of its first button when it opens', async () => {
    render(<BasicDialog {...props} />);

    await waitFor(() => expect(screen.getByRole('alertdialog')).toHaveFocus());
  });
});
