import React from 'react';
import {
  render,
  screen,
} from '@testing-library/react';
import NavDrawerSection from './index';

const mockNavDrawerItem = jest.fn(() => <div data-testid="nav-drawer-item" />);

jest.mock('../Divider', () => () => <div data-testid="nav-drawer-divider" />);

const mockNavDrawerTitle = jest.fn(() => <div data-testid="nav-drawer-title" />);

jest.mock('../Item', () => props => mockNavDrawerItem(props));
jest.mock('../Title', () => props => mockNavDrawerTitle(props));

describe('<NavDrawerSection />', () => {
  beforeEach(() => {
    mockNavDrawerItem.mockClear();
    mockNavDrawerTitle.mockClear();
  });

  it('should render with a title and dividers', () => {
    const sectionTitle = 'Section title';
    const itemLabel = 'Item Label';

    const { container } = render((
      <NavDrawerSection title={sectionTitle} dividerTop dividerBottom>
        <div data-testid="passed-child" data-label={itemLabel} />
      </NavDrawerSection>
    ));

    expect(container.firstChild).toMatchSnapshot();
    expect(screen.getAllByTestId('nav-drawer-divider')).toHaveLength(2);
    expect(screen.getByTestId('nav-drawer-title')).toBeInTheDocument();
    expect(mockNavDrawerTitle)
      .toHaveBeenCalledWith(expect.objectContaining({ text: sectionTitle }));
    expect(screen.getByTestId('passed-child')).toHaveAttribute('data-label', itemLabel);
  });

  it('should render without a title and one divider at the top', () => {
    const itemLabel = 'Item Label';
    render((
      <NavDrawerSection>
        <div data-testid="passed-child" data-label={itemLabel} />
      </NavDrawerSection>
    ));

    expect(screen.getAllByTestId('nav-drawer-divider')).toHaveLength(1);
    expect(mockNavDrawerTitle).toHaveBeenCalledWith(expect.objectContaining({ text: '' }));
    expect(screen.getByTestId('passed-child')).toHaveAttribute('data-label', itemLabel);
  });

  it('should render without a title and one divider at the top', () => {
    const itemLabel = 'Item Label';
    render((
      <NavDrawerSection dividerTop={false} dividerBottom>
        <div data-testid="passed-child" data-label={itemLabel} />
      </NavDrawerSection>
    ));

    expect(screen.getAllByTestId('nav-drawer-divider')).toHaveLength(1);
    expect(mockNavDrawerTitle).toHaveBeenCalledWith(expect.objectContaining({ text: '' }));
    expect(screen.getByTestId('passed-child')).toHaveAttribute('data-label', itemLabel);
  });

  it('should render without a title and dividers', () => {
    const itemLabel = 'Item Label';
    render((
      <NavDrawerSection dividerTop={false}>
        <div data-testid="passed-child" data-label={itemLabel} />
      </NavDrawerSection>
    ));

    expect(screen.queryByTestId('nav-drawer-divider')).not.toBeInTheDocument();
    expect(mockNavDrawerTitle).toHaveBeenCalledWith(expect.objectContaining({ text: '' }));
    expect(screen.getByTestId('passed-child')).toHaveAttribute('data-label', itemLabel);
  });

  it('should not render without children', () => {
    const { container } = render(<NavDrawerSection />);
    expect(container.firstChild).toBeNull();
  });
});
