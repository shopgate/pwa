import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from './index';

/**
 * Checked Icon
 * @returns {JSX}
 */
const Checked = () => <div>checked icon</div>;

/**
 * Unchecked Icon
 * @returns {JSX}
 */
const Unchecked = () => <div>unchecked icon</div>;

/**
 * @returns {string[]} The text of each child node of the checkbox.
 */
const getCheckboxContent = () => Array.from(screen.getByRole('checkbox').childNodes)
  .map(node => node.textContent);

describe('<Checkbox />', () => {
  it('should render the checkbox with the label before the icon', () => {
    render((
      <Checkbox
        label={<span>Test Label Deluxe</span>}
        labelPosition="left"
        checkedIcon={<Checked />}
        uncheckedIcon={<Unchecked />}
        checked={false}
      />
    ));

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox).toHaveAttribute('tabindex', '0');
    expect(checkbox).toHaveClass('checkbox', 'common__checkbox');
    expect(getCheckboxContent()).toEqual(['Test Label Deluxe', 'unchecked icon']);
  });

  it('should render the checkbox with the label after the icon', () => {
    render((
      <Checkbox
        label={<span>Test Label Deluxe</span>}
        labelPosition="right"
        checkedIcon={<Checked />}
        uncheckedIcon={<Unchecked />}
        checked={false}
      />
    ));

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox).toHaveAttribute('tabindex', '0');
    expect(checkbox).toHaveClass('checkbox', 'common__checkbox');
    expect(getCheckboxContent()).toEqual(['unchecked icon', 'Test Label Deluxe']);
  });

  it('should render the unchecked icon if "checked" is false', () => {
    render((
      <Checkbox
        checked={false}
        label="Test Label Deluxe"
        checkedIcon={<Checked />}
        uncheckedIcon={<Unchecked />}
      />
    ));

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
    expect(getCheckboxContent()).toEqual(['Test Label Deluxe', 'unchecked icon']);
  });

  it('should render the checked icon if "checked" is true', () => {
    render((
      <Checkbox
        checked
        label="Test Label Deluxe"
        checkedIcon={<Checked />}
        uncheckedIcon={<Unchecked />}
      />
    ));

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
    expect(getCheckboxContent()).toEqual(['Test Label Deluxe', 'checked icon']);
  });

  it('should call the callback with the inverted value', () => {
    const spy = jest.fn();

    render((
      <Checkbox
        label="Test Label Deluxe"
        checkedIcon={<Checked />}
        uncheckedIcon={<Unchecked />}
        checked={false}
        onCheck={spy}
      />
    ));

    fireEvent.click(screen.getByRole('checkbox'));
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should render an <input> element if a name prop is provided', () => {
    const { container } = render((
      <Checkbox
        label="Test Label Deluxe"
        checkedIcon={<Checked />}
        uncheckedIcon={<Unchecked />}
        defaultChecked={false}
        name="myCheckbox"
      />
    ));

    const inputs = container.querySelectorAll('input');
    expect(inputs).toHaveLength(1);
    expect(inputs[0]).toHaveAttribute('name', 'myCheckbox');
    expect(inputs[0]).toHaveValue('0');
  });

  it('should work as an uncontrolled input', () => {
    render((
      <Checkbox
        label="Test Label Deluxe"
        checkedIcon={<Checked />}
        uncheckedIcon={<Unchecked />}
        defaultChecked={false}
      />
    ));

    expect(screen.getByText('unchecked icon')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox'));

    expect(screen.getByText('checked icon')).toBeInTheDocument();
    expect(screen.queryByText('unchecked icon')).not.toBeInTheDocument();
  });
});
