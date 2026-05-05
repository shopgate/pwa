import { assert } from "./assert";
import { typeGuard } from "./typeGuard";

/**
 * Checks whether an argument exposes a non-native custom toString implementation.
 *
 * @param {any} arg Potential value passed to classnames.
 * @returns {boolean} True when a custom toString can be used to derive a class name.
 */
function hasCustomToString(arg) {
  return (
    typeof arg.toString === 'function' &&
    arg.toString !== Object.prototype.toString &&
    !String(arg.toString).includes('[native code]')
  );
}

/** Copy pasted from
 * https://github.com/emotion-js/emotion/blob/23f43ab9f24d44219b0b007a00f4ac681fe8712e/packages/react/src/class-names.js#L17-L63
 **/
export const classnames = (args) => {
    const len = args.length;
    let i = 0;
    let cls = "";
    for (; i < len; i++) {
        const arg = args[i];
        if (arg == null)
            continue;
        let toAdd;
        switch (typeof arg) {
            case "boolean":
                break;
            case "object": {
                if (Array.isArray(arg)) {
                    toAdd = classnames(arg);
                }
                else {
                    assert(!typeGuard(arg, false));

                    // Handle glamor style objects passed to cx() without explicit toString invocation.
                    if (hasCustomToString(arg)) {
                      toAdd = arg.toString();
                      break;
                    }

                    if (process.env.NODE_ENV !== "production" &&
                        arg.styles !== undefined &&
                        arg.name !== undefined) {
                        console.error("You have passed styles created with `css` from `@emotion/react` package to the `cx`.\n" +
                            "`cx` is meant to compose class names (strings) so you should convert those styles to a class name by passing them to the `css` received from <ClassNames/> component.");
                    }
                    toAdd = "";
                    for (const k in arg) {
                        if (arg[k] && k) {
                            toAdd && (toAdd += " ");
                            toAdd += k;
                        }
                    }
                }
                break;
            }
            default: {
                toAdd = arg;
            }
        }
        if (toAdd) {
            cls && (cls += " ");
            cls += toAdd;
        }
    }
    return cls;
};
