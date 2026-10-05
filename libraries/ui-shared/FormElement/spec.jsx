import { render, screen } from '@testing-library/react';
import FormElement from './index';

const inputProps = {
  htmlFor: 'test-input',
};

describe('<FormElement />', () => {
  it('should render a form element with no children', () => {
    const { container } = render(<FormElement {...inputProps} />);

    const formElement = container.querySelector('.ui-shared__form-element');

    expect(formElement).toHaveClass('formElement');
    expect(formElement).not.toHaveClass('disabled');
    expect(formElement.children).toHaveLength(1);
    expect(formElement.firstElementChild).toHaveClass('underline');
    expect(formElement.firstElementChild.firstElementChild)
      .toHaveStyle({ transform: 'scale3d(0,1,1)' });
  });

  it('should render a form element with 1 child', () => {
    const { container } = render((
      <FormElement {...inputProps}>
        {[<input key="test-key" />]}
      </FormElement>
    ));

    const formElement = container.querySelector('.ui-shared__form-element');

    expect(formElement.children).toHaveLength(2);
    expect(formElement.firstElementChild).toBe(screen.getByRole('textbox'));
    expect(formElement.lastElementChild).toHaveClass('underline');
  });

  it('should render a focused form element', () => {
    const { container } = render(<FormElement {...inputProps} isFocused />);

    const underline = container.querySelector('.underline');

    expect(container.querySelector('.ui-shared__form-element').children).toHaveLength(1);
    expect(underline.firstElementChild.style.transform).toBe('');
  });

  it('should show the label', () => {
    const { container } = render(<FormElement {...inputProps} label="The label" />);

    const label = container.querySelector('label');

    expect(label).toHaveTextContent('The label');
    expect(label).toHaveAttribute('for', 'test-input');
    expect(label).not.toHaveClass('floating');
    expect(container.querySelector('.placeholder')).toHaveTextContent('The label');
  });

  it('should show the error message', () => {
    const { container } = render(<FormElement {...inputProps} errorText="The error text" />);

    const errorText = screen.getByText('The error text');

    expect(container.querySelector('.errorText')).toContainElement(errorText);
    expect(container.querySelector('.errorText')).toHaveAttribute('id', 'ariaError-test-input');
    expect(container.querySelector('.errorText')).toHaveAttribute('aria-live', 'assertive');
  });

  it('should show the placeholder text', () => {
    const { container } = render(<FormElement {...inputProps} placeholder="The placeholder" />);

    const placeholder = container.querySelector('.placeholder');

    expect(placeholder).toHaveTextContent('The placeholder');
    expect(placeholder).toHaveAttribute('aria-hidden', 'true');
    expect(placeholder).not.toHaveStyle({ opacity: 0 });
    expect(container.querySelector('label')).not.toBeInTheDocument();
  });

  it('Should hide placeholder with hasValue', () => {
    const { container } = render(<FormElement label="testlabel" {...inputProps} hasValue />);

    expect(container.querySelector('.placeholder')).toHaveTextContent('testlabel');
    expect(container.querySelector('.placeholder')).toHaveStyle({ opacity: 0 });
    expect(container.querySelector('label')).toHaveClass('floating');
  });
});
