import {
  render, screen, fireEvent, within,
} from '@testing-library/react';
import { UnwrappedVariantSelectModal as VariantSelectModal } from './index';

const message = 'This is the message.';
const title = 'This is the title.';

jest.mock('@shopgate/engage/a11y/components');

describe('<VariantSelectModal />', () => {
  it('should render with minimal props', () => {
    render(<VariantSelectModal
      message={message}
      actions={[]}
      navigate={() => {}}
    />);

    const dialog = screen.getByRole('alertdialog');

    expect(within(dialog).getByText(message)).toBeInTheDocument();
    expect(within(dialog).queryByRole('heading')).not.toBeInTheDocument();
    expect(within(dialog).queryByRole('button')).not.toBeInTheDocument();
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

    render(<VariantSelectModal {...mockedProps} />);

    const dialog = screen.getByRole('alertdialog');
    const buttons = within(dialog).getAllByRole('button');

    expect(within(dialog).getByRole('heading', { name: title })).toBeInTheDocument();
    expect(within(dialog).getByText(message)).toBeInTheDocument();
    expect(buttons.map(button => button.textContent)).toEqual(['dismiss', actions[0].label]);

    fireEvent.click(buttons[buttons.length - 1]);
    expect(mockConfirm).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
