import React from 'react';
import { render, screen } from '@testing-library/react';
import { getGroupsFromProperties } from '../helpers/getGroupsFromProperties';
import GroupedProperties from '../GroupedProperties';

/* eslint-disable react/prop-types */
jest.mock('@shopgate/pwa-ui-material', () => ({
  Accordion: ({ renderLabel, testId, children }) => (
    <section data-testid={testId}>
      <h3>{renderLabel()}</h3>
      {children}
    </section>
  ),
}));
jest.mock('@shopgate/engage/components', () => ({
  Typography: ({
    children, component: Component = 'div', variant, align, color, display,
    gutterBottom, noWrap, paragraph, classes, variantMapping, ...rest
  }) => <Component {...rest}>{children}</Component>,
  HtmlSanitizer: ({ children }) => children,
}));
/* eslint-enable react/prop-types */

const properties = [
  {
    name: 'test1',
    label: 'Test 1',
    displayGroup: 'Group 1',
  },
  {
    name: 'test2',
    label: 'Test 2',
    displayGroup: 'Group 1',
  },
  {
    name: 'test3',
    label: 'Test 3',
    displayGroup: 'Group 2',
  },
  {
    name: 'test4',
    label: 'Test 4',
    displayGroup: 'Group 2',
  },
];

describe('<GroupedProperties />', () => {
  it('should render as expected', () => {
    const { container } = render(
      <GroupedProperties groups={getGroupsFromProperties(properties)} />
    );
    expect(container.querySelectorAll('[data-testid^="product-properties-group-"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-group-name]')).toHaveLength(2);
    expect(screen.getByText('product.displayGroups.Group 1')).toBeTruthy();
    expect(screen.getByText('product.displayGroups.Group 2')).toBeTruthy();
  });
});
