import { render, screen, fireEvent } from '@testing-library/react';
import Buttons from './index';

const actions = [
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
];

describe('<Buttons />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render if no actions are passed', () => {
    const { container } = render(<Buttons />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render buttons', () => {
    render(<Buttons actions={actions} />);

    expect(screen.getAllByRole('button')).toHaveLength(actions.length);
    actions.forEach(({ label }) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });
  });

  it('should invoke the action of the pressed button', () => {
    render(<Buttons actions={actions} />);

    fireEvent.click(screen.getByRole('button', { name: 'action1' }));

    expect(actions[1].action).toHaveBeenCalledTimes(1);
    expect(actions[0].action).not.toHaveBeenCalled();
    expect(actions[2].action).not.toHaveBeenCalled();
  });
});
