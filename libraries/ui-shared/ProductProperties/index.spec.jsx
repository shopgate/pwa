import React from 'react';
import {
  render,
  screen,
  within,
} from '@shopgate/pwa-unit-test/rtlUtils';
import ProductProperties from './index';

const properties = [{
  label: 'Label One',
  value: 'Value One',
}, {
  label: 'Label Two',
  value: 'Value Two',
}];

describe('<ProductProperties />', () => {
  it('should not render when no properties are passed', () => {
    const { container } = render(<ProductProperties />);

    expect(container.firstChild).toMatchSnapshot();
    expect(container.firstChild).toBeNull();
  });

  it('should not render when an empty list of properties is passed', () => {
    const { container } = render(<ProductProperties properties={[]} />);

    expect(container.firstChild).toMatchSnapshot();
    expect(container.firstChild).toBeNull();
  });

  it('should render as expected when properties are passed', () => {
    expect.assertions(5);

    const { container } = render(<ProductProperties properties={properties} />);
    expect(container.firstChild).toMatchSnapshot();

    expect(document.querySelector('.common__ellipsis')).toBeNull();

    const listElements = screen.getAllByRole('listitem');
    expect(listElements).toHaveLength(2);

    listElements.forEach((listElement, index) => {
      expect(
        within(listElement).getByText(`${properties[index].label}: ${properties[index].value}`)
      ).toBeInTheDocument();
    });
  });

  it('should use the ellipsis component when the lineClamp prop is passed ', () => {
    expect.assertions(7);

    const lineClamp = 2;
    const { container } = render(
      <ProductProperties properties={properties} lineClamp={lineClamp} />
    );
    expect(container.firstChild).toMatchSnapshot();

    const listElements = screen.getAllByRole('listitem');
    expect(listElements).toHaveLength(2);

    const ellipsisElements = document.querySelectorAll('.common__ellipsis');
    expect(ellipsisElements).toHaveLength(2);

    ellipsisElements.forEach((element, index) => {
      expect(element.style.webkitLineClamp).toBe(String(lineClamp));
      expect(element).toHaveTextContent(`${properties[index].label}: ${properties[index].value}`);
    });
  });
});
