import React, { forwardRef } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
// Imported from the defining modules instead of the `core` barrels on purpose: `core/hooks` imports
// from `engage/components`, so going through a barrel would create a circular import.
import { useNavigation } from '@shopgate/engage/core/hooks/useNavigation';
import { hasWebBridge } from '@shopgate/engage/core/helpers/bridge';
import type { NavigationState } from '@shopgate/engage/core/router/helpers';
import Ripple from './Ripple';
import { usePressRipple } from './hooks';

const supportedButtonTypes = ['button', 'submit', 'reset'] as const;

/**
 * Props that are read off the resolved element rather than declared on `ButtonBaseOwnProps`. They
 * are typed loosely here because the element type is generic - consumers still get exact typing
 * through `React.ComponentPropsWithRef<C>`.
 */
interface ResolvedElementProps {
  type?: (typeof supportedButtonTypes)[number];
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  onPointerDown?: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerUp?: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave?: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerCancel?: (event: React.PointerEvent<HTMLElement>) => void;
}

/**
 * The ButtonBase component serves as a foundational button element that can be extended with
 * additional styles and functionality. It handles basic button behavior, including disabled
 * state and type validation.
 */
function ButtonBase<C extends React.ElementType = 'button'>(
  props: ButtonBaseProps<C>,
  ref: React.Ref<Element>
) {
  const {
    component,
    href,
    linkOptions,
    disabled = false,
    disableRipple: disableRippleProp = false,
    className,
    classes: classesProp,
    testId,
    children,
    ...rest
  } = props as ButtonBaseOwnProps<C>;

  const {
    type = 'button',
    onClick,
    onKeyDown,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    ...other
  } = rest as ResolvedElementProps;

  const { classes, cx } = useStyles(undefined, { props: { classes: classesProp } });
  const { ripples, start, end } = usePressRipple();
  const reduceMotion = useReduceMotion();
  const { push, replace } = useNavigation();

  const disableRipple = disableRippleProp || reduceMotion;

  /**
   * A real anchor is only safe on web builds. Inside the app webview `preventDefault()` sometimes
   * fails and the page navigates for real, so link buttons stay `<button>` there.
   */
  const Component: React.ElementType = component || ((href && hasWebBridge()) ? 'a' : 'button');
  const isButtonElement = Component === 'button';

  /**
   * Hands the target over to the app router. Deferred like the `Link` component does, so the
   * current event finishes dispatching before the route changes.
   */
  const navigate = () => {
    if (!href) {
      return;
    }

    const state: NavigationState = {
      ...linkOptions?.state,
      ...(linkOptions?.target ? { target: linkOptions.target } : {}),
    };

    const params = {
      pathname: href,
      ...(Object.keys(state).length ? { state } : {}),
    };

    setTimeout(() => {
      if (linkOptions?.replace) {
        replace(params);
      } else {
        push(params);
      }
    }, 0);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      // A native disabled button ignores this already, every other element needs the guard.
      event.preventDefault();
      return;
    }

    onClick?.(event);

    if (!href || event.defaultPrevented) {
      return;
    }

    event.preventDefault();
    navigate();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);

    if (isButtonElement || disabled || event.defaultPrevented) {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    // Only buttons activate on Enter and Space. Preventing the default also stops an anchor from
    // firing its own click on Enter, so the element is activated exactly once.
    event.preventDefault();
    event.currentTarget.click();
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (!disabled && !disableRipple) {
      event.currentTarget.setPointerCapture?.(event.pointerId);
      start(event);
    }

    onPointerDown?.(event);
  };

  /**
   * Gives up pointer capture that was taken on pointer down. While an element captures the pointer,
   * hit testing is redirected to it, so it keeps matching `:hover` and never receives a leave event.
   * @param event The pointer event.
   */
  const releaseCapture = (event: React.PointerEvent<HTMLElement>) => {
    const target = event.currentTarget;

    if (target.hasPointerCapture?.(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    releaseCapture(event);

    if (!disableRipple) {
      end(event.pointerId);
    }

    onPointerUp?.(event);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLElement>) => {
    releaseCapture(event);

    if (!disableRipple) {
      end(event.pointerId);
    }

    onPointerCancel?.(event);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    if (!disableRipple && event.buttons === 1) {
      end(event.pointerId);
    }

    onPointerLeave?.(event);
  };

  return (
    <Component
      ref={ref}
      data-test-id={testId}
      className={cx(classes.root, className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
      {...(isButtonElement ? {
        disabled,
        // `type` is a content hint on an anchor, so it's only emitted for real buttons.
        type: supportedButtonTypes.includes(type) ? type : 'button',
      } : {
        // `:disabled` and the native click suppression don't exist off a button.
        'aria-disabled': disabled || undefined,
        ...(href ? { href } : {}),
      })}
      {...other}
    >
      {children}
      {!disableRipple && <Ripple ripples={ripples} />}
    </Component>
  );
}

const useStyles = makeStyles({
  name: 'ButtonBase',
})({
  root: {
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    outline: 0,
    border: 0,
    margin: 0,
    borderRadius: 0,
    padding: 0,
    cursor: 'pointer',
    userSelect: 'none',
    verticalAlign: 'middle',
    MozAppearance: 'none',
    WebkitAppearance: 'none',
    textDecoration: 'none',
    color: 'inherit',
    '&::-moz-focus-inner': {
      borderStyle: 'none',
    },
    '&:focus-visible': {
      outline: '2px solid currentColor',
      outlineOffset: 2,
    },
    '&:disabled, &[aria-disabled="true"]': {
      pointerEvents: 'none',
      cursor: 'default',
    },
  },
});

export interface LinkOptions {
  /**
   * Meta state to attach to the target route.
   */
  state?: NavigationState;
  /**
   * Where to open the target, e.g. `_blank`. Read by the router when the target is an external
   * or a native link.
   */
  target?: string;
  /**
   * If true, the current route is replaced instead of a new one being pushed.
   * @default false
   */
  replace?: boolean;
}

export interface ButtonBaseOwnProps<C extends React.ElementType = 'button'> {
  /**
   * The element or component rendered as the root node. Defaults to `button`, or to `a` on web
   * builds when `href` is set. Note that a non focusable element (e.g. `div`) needs its own
   * `tabIndex` to stay keyboard operable.
   */
  component?: C;
  /**
   * Renders the button as a link to this path. Navigation goes through the app router rather than
   * the browser, so external and native URLs are handled as well.
   */
  href?: string;
  /**
   * Navigation options. Only meaningful together with `href`.
   */
  linkOptions?: LinkOptions;
  /**
   * If true, the button will be disabled and not respond to user interactions. Rendered as the
   * native attribute on a button, and as `aria-disabled` on any other element.
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, the ripple effect will be disabled on button interactions.
   * @default false
   */
  disableRipple?: boolean;
  /**
   * Custom class name for the button.
   */
  className?: string;
  /**
   * Value for the `data-test-id` attribute of the button.
   */
  testId?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ReturnType<typeof useStyles>['classes']>;
  children: React.ReactNode;
}

export type ButtonBaseProps<C extends React.ElementType = 'button'> =
  ButtonBaseOwnProps<C> &
  Omit<React.ComponentPropsWithRef<C>, keyof ButtonBaseOwnProps<C>>;

const ButtonBaseWithRef = forwardRef(ButtonBase);

ButtonBaseWithRef.displayName = 'ButtonBase';

// `forwardRef` erases the generic, so the call signature is restored with a cast. Same approach as
// the Typography component.
export default ButtonBaseWithRef as <C extends React.ElementType = 'button'>(
  props: ButtonBaseProps<C> & { ref?: React.ComponentPropsWithRef<C>['ref'] }
) => React.ReactElement | null;
