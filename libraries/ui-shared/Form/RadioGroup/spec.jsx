import { render, screen, fireEvent } from '@testing-library/react';
import RadioItem from './components/Item';
import RadioGroup from '.';

const defProps = {
  name: 'radio',
};

jest.mock('@shopgate/engage/components');

describe('<RadioGroup />', () => {
  it('should render empty group', () => {
    const { container } = render(<RadioGroup {...defProps} />);

    const group = container.querySelector('.ui-shared__form__radio-group');

    expect(group).toHaveClass('radioGroup');
    expect(group).not.toHaveClass('disabled');
    expect(group.querySelector('.radioGroup')).toBeEmptyDOMElement();
    expect(group.querySelector('.underline')).not.toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  });

  it('should render column group with items', () => {
    const onChange = jest.fn();

    const { container } = render((
      <RadioGroup {...defProps} onChange={onChange}>
        <RadioItem name="foo" label="foo" />
      </RadioGroup>
    ));

    const radio = screen.getByRole('radio', { name: 'foo' });

    expect(screen.getAllByRole('radio')).toEqual([radio]);
    expect(radio).not.toBeChecked();
    expect(container.querySelector('.ui-shared__form__radio-group .radioGroup'))
      .toHaveStyle({ flexDirection: 'column' });

    fireEvent.click(radio);

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should render rows group with items', () => {
    const { container } = render((
      <RadioGroup {...defProps} direction="row">
        <RadioItem name="foo" label="foo" />
      </RadioGroup>
    ));

    expect(screen.getAllByRole('radio')).toHaveLength(1);
    expect(screen.getByRole('radio', { name: 'foo' })).not.toBeChecked();
    expect(container.querySelector('.ui-shared__form__radio-group .radioGroup'))
      .toHaveStyle({ flexDirection: 'row' });
  });

  it('should use default value', () => {
    render((
      <RadioGroup {...defProps} value="foo">
        <RadioItem name="foo" label="foo" />
      </RadioGroup>
    ));

    expect(screen.getAllByRole('radio')).toHaveLength(1);
    expect(screen.getByRole('radio', { name: 'foo' })).toBeChecked();
  });

  it('should have on value at a time', () => {
    render((
      <RadioGroup {...defProps}>
        <RadioItem name="foo" label="foo" />
        <RadioItem name="bar" label="bar" />
      </RadioGroup>
    ));

    expect(screen.getAllByRole('radio')).toHaveLength(2);

    const radio1 = screen.getByRole('radio', { name: 'foo' });
    const radio2 = screen.getByRole('radio', { name: 'bar' });

    expect(radio1).not.toBeChecked();
    expect(radio2).not.toBeChecked();

    fireEvent.click(radio1);
    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();

    fireEvent.click(radio2);
    expect(radio1).not.toBeChecked();
    expect(radio2).toBeChecked();
  });

  it('should call onChange callback', () => {
    const onChange = jest.fn();
    render((
      <RadioGroup {...defProps} onChange={onChange}>
        <RadioItem name="foo" label="foo" />
      </RadioGroup>
    ));

    expect(screen.getAllByRole('radio')).toHaveLength(1);

    fireEvent.click(screen.getByRole('radio', { name: 'foo' }));

    expect(onChange).toHaveBeenCalledWith('foo');
  });
});
