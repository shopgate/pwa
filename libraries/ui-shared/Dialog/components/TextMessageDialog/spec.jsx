import {
  render, screen, fireEvent, within,
} from '@testing-library/react';
import { i18n } from '@shopgate/engage/core/helpers';
import TextMessageDialog from './index';
import BasicDialog from '../BasicDialog';

const message = 'This is the message.';
const title = 'This is the title.';

jest.mock('@shopgate/engage/a11y/components');
jest.mock('../BasicDialog', () => {
  const ActualBasicDialog = jest.requireActual('../BasicDialog').default;
  const BasicDialogMock = jest.fn(props => <ActualBasicDialog {...props} />);
  BasicDialogMock.propTypes = ActualBasicDialog.propTypes;
  BasicDialogMock.defaultProps = ActualBasicDialog.defaultProps;

  return {
    __esModule: true,
    default: BasicDialogMock,
  };
});

describe('<TextMessageDialog />', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render with minimal props', () => {
    render(<TextMessageDialog message={message} actions={[]} />);

    const dialog = screen.getByRole('alertdialog');

    expect(within(dialog).getByText(message)).toBeInTheDocument();
    expect(within(dialog).queryByRole('heading')).not.toBeInTheDocument();
    expect(within(dialog).queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render with title and message', () => {
    render(<TextMessageDialog title={title} message={message} actions={[]} />);

    const dialog = screen.getByRole('alertdialog');

    expect(within(dialog).getByRole('heading', { name: title })).toBeInTheDocument();
    expect(within(dialog).getByText(message)).toBeInTheDocument();
    expect(within(dialog).queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render with title, message and messageParams', () => {
    const text = jest.spyOn(i18n, 'text');

    render((
      <TextMessageDialog
        title={title}
        message="Message with {name}"
        params={{ name: 'Placeholder' }}
        actions={[]}
      />
    ));

    const dialog = screen.getByRole('alertdialog');

    expect(within(dialog).getByRole('heading', { name: title })).toBeInTheDocument();
    expect(within(dialog).getByText('Message with {name}')).toBeInTheDocument();
    expect(text).toHaveBeenCalledWith('Message with {name}', { name: 'Placeholder' });
  });

  it('should render the actions', () => {
    const actions = [{
      label: 'fooAction',
      action: jest.fn(),
    }];

    render((
      <TextMessageDialog title={title} message={message} actions={actions} />
    ));

    const dialog = screen.getByRole('alertdialog');

    expect(within(dialog).getByRole('heading', { name: title })).toBeInTheDocument();
    expect(within(dialog).getAllByRole('button')).toHaveLength(1);

    fireEvent.click(within(dialog).getByRole('button', { name: actions[0].label }));

    expect(actions[0].action).toHaveBeenCalledTimes(1);
  });

  it('should pass title through', () => {
    const customTitle = <div>Title</div>;
    BasicDialog.mockImplementationOnce(() => null);

    render((
      <TextMessageDialog
        title={customTitle}
        message={message}
        params={{}}
        actions={[]}
      />
    ));

    expect(BasicDialog.mock.lastCall[0]).toEqual(expect.objectContaining({ title: customTitle }));
  });
});
