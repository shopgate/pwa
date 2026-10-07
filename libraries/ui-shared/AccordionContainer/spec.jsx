import { render, screen, fireEvent } from '@testing-library/react';
import AccordionContainer from './index';

const Child = jest.fn(({ open, handleOpen, handleClose }) => (
  <div>
    <span>{open ? 'opened' : 'closed'}</span>
    <button type="button" onClick={handleOpen}>open</button>
    <button type="button" onClick={handleClose}>close</button>
  </div>
));

describe('<AccordionContainer />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children with props', () => {
    render((
      <AccordionContainer>
        {props => <Child {...props} />}
      </AccordionContainer>
    ));

    expect(Child).toHaveBeenCalledTimes(1);
    expect(Child.mock.lastCall[0]).toEqual({
      open: false,
      handleOpen: expect.any(Function),
      handleClose: expect.any(Function),
    });
    expect(screen.getByText('closed')).toBeInTheDocument();
  });

  it('should update children props when state changes', () => {
    render((
      <AccordionContainer>
        {props => <Child {...props} />}
      </AccordionContainer>
    ));

    fireEvent.click(screen.getByRole('button', { name: 'open' }));

    expect(Child.mock.lastCall[0]).toEqual(expect.objectContaining({ open: true }));
    expect(screen.getByText('opened')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'close' }));

    expect(screen.getByText('closed')).toBeInTheDocument();
  });
});
