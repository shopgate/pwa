import { render, screen } from '@testing-library/react';
import AccordionContent from './index';

jest.mock('react-spring', () => ({
  ...jest.requireActual('react-spring'),
  useSpring: jest.fn().mockReturnValue({ hook: 'useSpring return value' }),
}));

describe('<AccordionContent />', () => {
  it('should render as closed', () => {
    const { container } = render((
      <AccordionContent id="some-id">
        <div>Some Child</div>
      </AccordionContent>
    ));

    expect(screen.getByText('Some Child')).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('id', 'some-id');
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('should render as open', () => {
    const { container } = render((
      <AccordionContent open id="some-id">
        <div>Some Child</div>
      </AccordionContent>
    ));

    expect(screen.getByText('Some Child')).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('id', 'some-id');
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'false');
  });
});
