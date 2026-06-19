import React from 'react';
import { render, screen } from '@testing-library/react';
import { isBeta } from '@shopgate/engage/core/helpers';
import { getGroupsFromProperties } from '../helpers/getGroupsFromProperties';
import Content from '../Content';
import GroupedProperties from '../GroupedProperties';

jest.mock('@shopgate/engage/core/helpers', () => ({
  isBeta: jest.fn(),
}));
jest.mock('@shopgate/engage/core/hooks/events');
jest.mock('../GroupedProperties', () => jest.fn(() => 'GroupedProperties'));

jest.mock('@shopgate/engage/components', () => ({
  Typography: ({ children }) => children,
  HtmlSanitizer: ({ children }) => children,
}));

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
    label: 'Test 3 HTML',
    type: 'html',
    displayGroup: 'Group 1',
    customDisplayGroupName: 'Custom Name Ignored',
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
  {
    name: 'html',
    label: 'Custom HTML',
    type: 'html',
    displayGroup: 'custom',
    customDisplayGroupName: 'Custom Name',
  },
];

const propertiesSimple = [
  {
    name: 'test1',
    label: 'Test 1',
  },
];

describe('<Content />', () => {
  it('should not render if no props are passed', () => {
    const { container } = render(<Content />);
    expect(container.firstChild).toBeNull();
  });

  it('should render simple rows if not in beta', () => {
    isBeta.mockReturnValueOnce(false);
    const { container } = render(<Content properties={properties} />);
    expect(container.querySelector('table')).not.toBeNull();
    expect(screen.getByText('Test 1')).toBeTruthy();
    expect(screen.getByText('Test 4')).toBeTruthy();
  });

  it('should render simple rows if no groups could be found', () => {
    isBeta.mockReturnValueOnce(true);
    const { container } = render(<Content properties={propertiesSimple} />);
    expect(container.querySelector('table')).not.toBeNull();
    expect(screen.getByText('Test 1')).toBeTruthy();
  });

  it('should render grouped properties', () => {
    isBeta.mockReturnValueOnce(true);
    const { container } = render(<Content properties={properties} />);
    expect(screen.getByText('GroupedProperties')).toBeTruthy();
    expect(GroupedProperties).toHaveBeenCalledWith(
      expect.objectContaining({ groups: getGroupsFromProperties(properties) }),
      {}
    );
    expect(container.firstChild).toBeTruthy();
  });
});
