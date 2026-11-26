import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PAGE_PREVIEW_PATTERN, RECEIVE_PAGE_CONFIG_V2 } from '@shopgate/engage/page/constants';
import { registerWidgetAliases } from '@shopgate/engage/page/helpers';
import { pageV2 } from '../../reducers';
import Widgets from './Widgets';
import type { WidgetDefinition } from './types';

const mockRoute = { pattern: '/page/:pageCode' };
const mockWidgetProps = jest.fn();

const mockThemeWidgets = {
  'core/Plain': () => <div>plain widget</div>,
  'new/Widget': ({ settings }: { settings?: Record<string, unknown> }) => (
    <div>{`target widget ${JSON.stringify(settings ?? null)}`}</div>
  ),
};

jest.mock('react-redux', () => ({
  useSelector: (selector: (state: unknown) => unknown) => selector({
    settings: {
      appSettings: {
        widgets: {
          mediaMargins: {
            top: 16,
            bottom: 16,
            left: 8,
            right: 8,
          },
        },
      },
    },
  }),
}));

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  ...jest.requireActual('@shopgate/pwa-common/helpers/config'),
  componentsConfig: {
    widgetsV2: {
      'new/Widget': { config: { layout: { applyMediaMargins: true } } },
    },
  },
}));

jest.mock('@shopgate/engage/components', () => ({
  ConditionalWrapper: ({
    condition,
    wrapper,
    children,
  }: {
    condition: boolean;
    wrapper: (content: ReactNode) => ReactNode;
    children: ReactNode;
  }) => (condition ? wrapper(children) : children),
  Loading: () => null,
  TimeIcon: () => null,
  VisibilityOffIcon: () => null,
}));

jest.mock('@shopgate/engage/core/hooks', () => ({
  usePressHandler: () => ({}),
  useRoute: () => mockRoute,
  useThemeWidgets: () => mockThemeWidgets,
}));

jest.mock('./hooks', () => ({
  usePreviewIframeCommunication: jest.fn(),
  useWidgetsPreview: () => ({
    activeWidget: null,
    setActiveWidget: jest.fn(),
  }),
}));

jest.mock('./Overlay', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('./WidgetsPreviewProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => children,
}));

jest.mock('./Widget', () => {
  const { createElement } = jest.requireActual('react');
  const { default: ActualWidget } = jest.requireActual('./Widget');

  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => {
      mockWidgetProps(props);
      return createElement(ActualWidget, props);
    },
  };
});

const createDefinition = (
  widgetConfigDefinitionCode: string,
  overrides: Partial<WidgetDefinition> = {}
) => ({
  code: 'w1',
  widgetConfigDefinitionCode,
  widgetConfig: {},
  visibility: {
    isHidden: false,
    scheduleStartDate: '',
    scheduleEndDate: '',
  },
  layout: {
    marginTop: null,
    marginBottom: null,
    marginLeft: null,
    marginRight: null,
  },
  ...overrides,
}) as WidgetDefinition;

describe('<Widgets /> with widget aliases', () => {
  beforeAll(() => {
    registerWidgetAliases({
      'old/Widget': 'new/Widget',
      'old/MissingTarget': 'new/NotInstalled',
    });
  });

  beforeEach(() => {
    mockRoute.pattern = '/page/:pageCode';
    mockWidgetProps.mockClear();
  });

  it('renders the target of an alias', () => {
    render(<Widgets widgets={[createDefinition('old/Widget')]} />);

    expect(screen.getByText('target widget null')).toBeInTheDocument();
  });

  it('hides a widget whose alias target is not installed', () => {
    const { container } = render(
      <Widgets widgets={[createDefinition('old/MissingTarget')]} />
    );

    expect(container).toBeEmptyDOMElement();
    expect(mockWidgetProps).not.toHaveBeenCalled();
  });

  it('keeps the object identity of a widget without an alias', () => {
    const definition = createDefinition('core/Plain');

    render(<Widgets widgets={[definition]} />);

    expect(mockWidgetProps.mock.calls[0][0].definition).toBe(definition);
  });

  it('does not change the definition of an aliased widget', () => {
    const definition = createDefinition('old/Widget');

    render(<Widgets widgets={[definition]} />);

    expect(definition.widgetConfigDefinitionCode).toBe('old/Widget');
    expect(mockWidgetProps.mock.calls[0][0].definition.widgetConfigDefinitionCode)
      .toBe('new/Widget');
  });

  it('passes the settings of custom markup to the target', () => {
    render(<Widgets
      widgets={[createDefinition('old/Widget', {
        isCustomLegacyWidget: true,
        widgetConfig: { title: 'Deals' },
      })]}
    />);

    expect(screen.getByText('target widget {"title":"Deals"}')).toBeInTheDocument();
  });

  it('renders a custom HTML widget through its alias and keeps the old code in the state', () => {
    const state = pageV2({}, {
      type: RECEIVE_PAGE_CONFIG_V2,
      pageType: 'cms',
      pageSlug: 'home',
      data: {
        dropzones: {
          cmsWidgetList: [createDefinition('@shopgate/widgets/htmlWidget', {
            widgetConfig: {
              html: '&lt;!--Widget{&quot;type&quot;:&quot;old/Widget&quot;,&quot;settings&quot;:{&quot;title&quot;:&quot;Deals&quot;}}--&gt;',
            },
          })],
        },
      },
    });
    const { cms } = state as {
      cms: { home: { data: { dropzones: { cmsWidgetList: WidgetDefinition[] } } } };
    };
    const [storedWidget] = cms.home.data.dropzones.cmsWidgetList;

    render(<Widgets widgets={[storedWidget]} />);

    expect(storedWidget.widgetConfigDefinitionCode).toBe('old/Widget');
    expect(screen.getByText('target widget {"title":"Deals"}')).toBeInTheDocument();
  });

  it('applies the media margins of the target', () => {
    const { container } = render(<Widgets widgets={[createDefinition('old/Widget')]} />);
    const section = container.querySelector('#widget-code-w1');

    expect(section).toHaveAttribute('data-widget-name', 'new/Widget');
    expect(section).toHaveStyle({
      'margin-top': '16px',
      'margin-bottom': '16px',
      'margin-left': '8px',
      'margin-right': '8px',
    });
  });

  it('resolves aliases in the admin preview', () => {
    mockRoute.pattern = PAGE_PREVIEW_PATTERN;

    render(<Widgets widgets={[createDefinition('old/Widget')]} />);

    expect(screen.getByText('target widget null')).toBeInTheDocument();
  });

  it('still renders nothing in the preview without a widget list', () => {
    mockRoute.pattern = PAGE_PREVIEW_PATTERN;

    const { container } = render(
      <Widgets widgets={null as unknown as WidgetDefinition[]} />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
