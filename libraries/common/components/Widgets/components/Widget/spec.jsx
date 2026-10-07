import { render, screen } from '@testing-library/react';
import Widget from './index';

const MyComponent = jest.fn(() => <div>My widget</div>);

const widgets = {
  '@shopgate/commerce-widgets/image': MyComponent,
};

describe('<Widget />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render an image widget', () => {
    const config = {
      type: '@shopgate/commerce-widgets/image',
      col: 1,
      row: 1,
      width: 12,
      height: 6,
    };

    const { container } = render((
      <Widget config={config} component={widgets[config.type]} />
    ));

    expect(container.childNodes).toHaveLength(1);
    expect(container.firstChild.tagName).toBe('DIV');
    expect(container.firstChild).toHaveClass('common__widgets__widget');
    expect(container.firstChild).toContainElement(screen.getByText('My widget'));
    expect(MyComponent.mock.lastCall[0]).toEqual(expect.objectContaining({ ratio: [12, 6] }));
  });

  it('should pass the ratio of the config to the widget', () => {
    const config = {
      type: '@shopgate/commerce-widgets/image',
      col: 1,
      row: 1,
      width: 6,
      height: 6,
    };

    const { container } = render((
      <Widget config={config} component={widgets[config.type]} />
    ));

    expect(container.childNodes).toHaveLength(1);
    expect(container.firstChild.tagName).toBe('DIV');
    expect(container.firstChild).toHaveClass('common__widgets__widget');
    expect(container.firstChild).toContainElement(screen.getByText('My widget'));
    expect(MyComponent.mock.lastCall[0]).toEqual(expect.objectContaining({ ratio: [6, 6] }));
  });

  it('should not render when the `type` prop is invalid', () => {
    const config = {
      type: 'some_widget',
      col: 1,
      row: 1,
      width: 12,
      height: 6,
    };

    const { container } = render((
      <Widget config={config} component={widgets[config.type]} />
    ));

    expect(container).toBeEmptyDOMElement();
    expect(MyComponent).not.toHaveBeenCalled();
  });
});
