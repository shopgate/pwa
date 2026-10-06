import { render, screen } from '@testing-library/react';
import Accordion from './index';

jest.unmock('@shopgate/pwa-ui-shared');
jest.mock('@shopgate/engage/components');
jest.mock('react-spring', () => ({
  ...jest.requireActual('react-spring'),
  useSpring: jest.fn().mockReturnValue({ hook: 'useSpring return value' }),
}));

describe('<Accordion />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with renderLabel prop and children', () => {
    render((
      <Accordion renderLabel={() => <div>Some label</div>} testId="Some Thing">
        Some content.
      </Accordion>
    ));

    const toggle = screen.getByRole('button', { name: /Some label/ });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'Some-Thing-content');
    expect(screen.getByText('Some content.')).toBeInTheDocument();
  });

  it('should not render without a renderLabel prop', () => {
    const { container } = render(<Accordion testId="Some Thing" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should not render without children', () => {
    const { container } = render(<Accordion renderLabel={() => { }} testId="Some Thing" />);

    expect(container).toBeEmptyDOMElement();
  });
});
