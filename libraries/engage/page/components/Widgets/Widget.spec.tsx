import { useContext } from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Widget from './Widget';
import { WidgetContext } from './WidgetContext';
import { type WidgetDefinition } from './types';

const mediaMargins = {
  top: 16,
  bottom: 16,
  left: 8,
  right: 8,
};

jest.mock('react-redux', () => ({
  useSelector: (selector: (state: unknown) => unknown) => selector({
    settings: { appSettings: { widgets: { mediaMargins } } },
  }),
}));

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  ...jest.requireActual('@shopgate/pwa-common/helpers/config'),
  componentsConfig: {
    widgetsV2: {
      allSides: { config: { layout: { applyMediaMargins: true } } },
      verticalOnly: {
        config: {
          layout: {
            applyMediaMargins: {
              top: true,
              bottom: true,
            },
          },
        },
      },
      noDeclaration: {},
    },
  },
}));

jest.mock('@shopgate/engage/components', () => ({
  Loading: () => null,
  TimeIcon: () => null,
  VisibilityOffIcon: () => null,
}));

jest.mock('@shopgate/engage/core/hooks', () => ({
  usePressHandler: () => ({}),
}));

jest.mock('./hooks', () => ({
  useWidgetsPreview: () => ({
    activeWidget: null,
    setActiveWidget: jest.fn(),
  }),
}));

const NO_LAYOUT = {
  marginTop: null,
  marginBottom: null,
  marginLeft: null,
  marginRight: null,
};

/**
 * Renders a widget and returns its container element.
 * @param name The name of the widget.
 * @param layout The layout configuration of the widget instance.
 * @returns The container element of the widget.
 */
const renderWidget = (
  name: string,
  layout: WidgetDefinition['layout'] = NO_LAYOUT
): HTMLElement => {
  const definition = {
    code: 'w1',
    widgetConfigDefinitionCode: name,
    widgetConfig: {},
    visibility: {
      isHidden: false,
      scheduleStartDate: '',
      scheduleEndDate: '',
    },
    layout,
  } as WidgetDefinition;

  const { container } = render(
    <Widget component={() => <div>content</div>} definition={definition} isPreview={false} />
  );

  return container.querySelector('#widget-code-w1') as HTMLElement;
};

describe('<Widget />', () => {
  it('applies the default margins a widget asked for', () => {
    expect(renderWidget('allSides')).toHaveStyle({
      'margin-top': '16px',
      'margin-bottom': '16px',
      'margin-left': '8px',
      'margin-right': '8px',
    });
  });

  it('only applies the defaults for the sides a widget asked for', () => {
    const section = renderWidget('verticalOnly');

    expect(section).toHaveStyle({
      'margin-top': '16px',
      'margin-bottom': '16px',
    });
    expect(section.style.marginLeft).toBe('');
    expect(section.style.marginRight).toBe('');
  });

  it('renders no inline margins for a widget without a declaration', () => {
    expect(renderWidget('noDeclaration').getAttribute('style')).toBeNull();
  });

  it('lets the configuration of the widget win over the defaults', () => {
    const section = renderWidget('allSides', {
      ...NO_LAYOUT,
      marginTop: 24,
    });

    expect(section).toHaveStyle({
      'margin-top': '24px',
      'margin-bottom': '16px',
    });
  });

  it('leaves out a side the widget configured to zero', () => {
    const section = renderWidget('allSides', {
      ...NO_LAYOUT,
      marginTop: 0,
    });

    expect(section.style.marginTop).toBe('');
    expect(section).toHaveStyle({ 'margin-bottom': '16px' });
  });

  it('hands the resolved margins to the widget', () => {
    let layout;

    const Consumer = () => {
      ({ layout } = useContext(WidgetContext));
      return null;
    };

    const definition = {
      code: 'w1',
      widgetConfigDefinitionCode: 'allSides',
      widgetConfig: {},
      visibility: {
        isHidden: false,
        scheduleStartDate: '',
        scheduleEndDate: '',
      },
      layout: {
        ...NO_LAYOUT,
        marginTop: 24,
      },
    } as WidgetDefinition;

    render(<Widget component={Consumer} definition={definition} isPreview={false} />);

    expect(layout).toEqual({
      marginTop: 24,
      marginBottom: 16,
      marginLeft: 8,
      marginRight: 8,
    });
  });
});
