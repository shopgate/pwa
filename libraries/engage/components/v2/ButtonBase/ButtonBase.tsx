import React, { forwardRef, useEffect } from 'react';
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
 * Whether a pointer position sits within the bounds of an element.
 * @param element The element to measure.
 * @param clientX Horizontal position of the pointer.
 * @param clientY Vertical position of the pointer.
 * @returns Whether the position is inside the element.
 */
const containsPoint = (element: HTMLElement, clientX: number, clientY: number) => {
  const {
    top, right, bottom, left,
  } = element.getBoundingClientRect();

  return clientX >= left && clientX <= right && clientY >= top && clientY <= bottom;
};

/**
 * Props read off the resolved element rather than declared on `ButtonBaseOwnProps`. Typed loosely
 * because the element type is generic - `React.ComponentPropsWithRef<C>` keeps consumers exact.
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
    disableBaseClassName = false,
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
  const {
    ripples, start, end, clearAll,
  } = usePressRipple();
  const reduceMotion = useReduceMotion();
  const { push, replace } = useNavigation();

  const disableRipple = disableRippleProp || reduceMotion;

  // A button that disables itself on click gets `pointer-events: none`, which makes the browser
  // drop the pointer capture. The pointer up then lands somewhere else and the ripple would never
  // be told to finish, so it's cleared here instead.
  useEffect(() => {
    if (disabled) {
      clearAll();
    }
  }, [disabled, clearAll]);

  // A real anchor is only safe on web builds. Inside the app webview `preventDefault()` sometimes
  // fails and the page navigates for real, so link buttons stay `<button>` there.
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
      event.preventDefault();
      return;
    }

    // The pointer capture taken on pointer down redirects the release to this element, so a pointer
    // that went up somewhere else still arrives here as a click. Without the capture the browser
    // would have dropped it. Keyboard activation reports no button presses and carries no position,
    // so it never takes this path.
    if (event.detail > 0 && !containsPoint(event.currentTarget, event.clientX, event.clientY)) {
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
    if (disabled) {
      return;
    }

    onKeyDown?.(event);

    if (isButtonElement || event.defaultPrevented) {
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
    if (disabled) {
      return;
    }

    if (!disableRipple) {
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

    if (disabled) {
      return;
    }

    onPointerUp?.(event);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLElement>) => {
    releaseCapture(event);

    if (!disableRipple) {
      end(event.pointerId);
    }

    if (disabled) {
      return;
    }

    onPointerCancel?.(event);
  };

  /**
   * Fires whenever the capture taken on pointer down ends - including when the browser drops it
   * because the element stopped being hit testable. Without this the ripple would stay behind.
   * @param event The pointer event.
   */
  const handleLostPointerCapture = (event: React.PointerEvent<HTMLElement>) => {
    if (!disableRipple) {
      end(event.pointerId);
    }
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    if (!disableRipple && event.buttons === 1) {
      end(event.pointerId);
    }

    if (disabled) {
      return;
    }

    onPointerLeave?.(event);
  };

  return (
    <Component
      ref={ref}
      data-test-id={testId}
      className={cx(classes.root, !disableBaseClassName && 'engage__button-base', className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
      onLostPointerCapture={handleLostPointerCapture}
      {...(isButtonElement ? {
        disabled,
        type: supportedButtonTypes.includes(type) ? type : 'button',
      } : {
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
    '&:disabled': {
      cursor: 'not-allowed',
    },
    '&[aria-disabled="true"]': {
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
   * If true, the `engage__button-base` css hook is not rendered. Set by wrappers that provide a
   * hook of their own, such as `Button`.
   * @default false
   */
  disableBaseClassName?: boolean;
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
