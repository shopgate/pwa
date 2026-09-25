// Class components are intentional here: this HOC exists specifically to serve
// legacy class components that cannot use the `useTheme` hook.
/* eslint-disable react/prefer-stateless-function */
import { Component } from 'react';
import { render } from '@testing-library/react';
import type { Theme } from '../../createTheme';
import { withTheme, type WithThemeProps } from '../withTheme';

// Uses the manual mock at theme/hooks/__mocks__/useTheme.ts (returns createTheme({})).
jest.mock('../../hooks/useTheme');

describe('engage > styles > theme > hocs > withTheme', () => {
  it('should inject the theme as a prop into a class component', () => {
    let receivedTheme: Theme | undefined;

    class LegacyComponent extends Component<WithThemeProps> {
      render() {
        const { theme } = this.props;
        receivedTheme = theme;
        return <div>{theme.palette.primary.main}</div>;
      }
    }

    const Wrapped = withTheme(LegacyComponent);
    render(<Wrapped />);

    expect(receivedTheme).toBeDefined();
    expect(receivedTheme?.palette?.primary?.main).toBeTruthy();
  });

  it('should set a descriptive displayName', () => {
    class LegacyComponent extends Component<WithThemeProps> {
      render() {
        return null;
      }
    }

    const Wrapped = withTheme(LegacyComponent);
    expect(Wrapped.displayName).toBe('WithTheme(LegacyComponent)');
  });

  it('should preserve the wrapped component`s own props', () => {
    let receivedLabel: string | undefined;

    interface Props extends WithThemeProps {
      label: string;
    }

    class LegacyComponent extends Component<Props> {
      render() {
        receivedLabel = this.props.label;
        return <div>{this.props.label}</div>;
      }
    }

    const Wrapped = withTheme(LegacyComponent);
    render(<Wrapped label="hello" />);

    expect(receivedLabel).toBe('hello');
  });
});
/* eslint-enable react/prefer-stateless-function */
