import * as React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { AccordionContainer, ChevronIcon } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import AccordionContent from './components/AccordionContent';

const useStyles = makeStyles()({
  toggle: {
    padding: '12px 16px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  clickable: {
    cursor: 'pointer',
  },
  toggleLeftAligned: {
    flexDirection: 'row-reverse',
  },
  chevronContainer: {
    display: 'flex',
    flexShrink: 0,
    fontSize: '1.5rem',
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      borderRadius: 32,
      padding: 8,
    },
  },
  labelContainer: {
    marginRight: 'auto',
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  chevronClosed: {
    transformOrigin: 'center center',
    transition: 'transform 250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    transform: 'rotateZ(-90deg)',
  },
  chevronOpen: {
    transformOrigin: 'center center',
    transition: 'transform 250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    transform: 'rotateZ(90deg)',
  },
});

/**
 * Accordion component
 * @param {Object} props The component props.
 * @param {Function} props.renderLabel Function that returns a React component used as header label
 * @param {string} [props.handleLabel] Aria label for the header label
 * @param {string} [props.role] Aria role (default `"button"`)
 * @param {boolean} [props.openWithChevron] Whether to toggle the accordion only with the chevron
 * (default `false`)
 * @param {boolean} [props.startOpened] Whether to render initially open (default `false`)
 * @param {"left"|"right"} [props.chevronPosition] Position of the chevron icon (default `"right"`)
 * @param {string} [props.className] Class name for the header section
 * @param {string} [props.chevronClassName] Class name for the chevron
 * @param {string} [props.contentClassName] Class name for the content wrapper
 * @param {string} [props.testId] Test ID for the component
 * @param {React.ReactNode} props.children Children used for the content section of the accordion
 * @param {Function} props.renderAdditionalHeaderContent optional additional content
 * for the accordion header
 * @returns {JSX.Element}
 */
const Accordion = (props) => {
  const {
    renderLabel,
    handleLabel,
    role,
    children,
    testId,
    className,
    contentClassName,
    chevronClassName,
    openWithChevron,
    startOpened,
    chevronPosition,
    renderAdditionalHeaderContent,
  } = props;

  const { classes, cx } = useStyles();

  if (!renderLabel || !children) {
    return null;
  }

  const controlsId = testId ? `${testId}-content`.replace(/[^\w\s]/gi, '-').replace(' ', '-') : 'accordion-content';

  return (
    <div className="ui-material__accordion-container">
      <AccordionContainer open={startOpened}>
        {({ handleOpen, handleClose, open }) => {
          const clickHandlers = {
            onClick: open ? handleClose : handleOpen,
            onKeyDown: open ? handleClose : handleOpen,
            role,
          };

          return (
            <>
              <div
                className={cx(
                  'ui-material__accordion-title',
                  classes.toggle,
                  className
                )}
                data-test-id={testId}
              >
                <div
                  {... (openWithChevron ? {} : clickHandlers)}
                  key="accordion-toggle"
                  aria-expanded={open}
                  aria-controls={controlsId}
                  aria-label={handleLabel}
                  className={cx(
                    classes.labelContainer,
                    {
                      [classes.toggleLeftAligned]: chevronPosition === 'left',
                    }
                  )}
                >
                  {renderLabel({ open })}
                  <div
                    className={cx(
                      classes.chevronContainer,
                      chevronClassName,
                      { [classes.clickable]: openWithChevron }
                    )}
                    {... (openWithChevron ? clickHandlers : {})}
                    aria-label={i18n.text(open ? 'favorites.close_list' : 'favorites.open_list')}
                  >
                    <ChevronIcon className={open ? classes.chevronOpen : classes.chevronClosed} />
                  </div>
                </div>
                {renderAdditionalHeaderContent && (
                  <div>{renderAdditionalHeaderContent()}</div>
                )}
              </div>
              <AccordionContent
                open={open}
                id={controlsId}
                key={controlsId}
                className={contentClassName}
              >
                {children}
              </AccordionContent>
            </>
          );
        }}
      </AccordionContainer>
    </div>
  );
};

Accordion.propTypes = {
  chevronClassName: PropTypes.string,
  chevronPosition: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  handleLabel: PropTypes.string,
  openWithChevron: PropTypes.bool,
  renderAdditionalHeaderContent: PropTypes.func,
  renderLabel: PropTypes.func,
  role: PropTypes.string,
  startOpened: PropTypes.bool,
  testId: PropTypes.string,
};

Accordion.defaultProps = {
  children: null,
  renderAdditionalHeaderContent: null,
  renderLabel: noop,
  className: null,
  contentClassName: null,
  chevronClassName: null,
  handleLabel: null,
  role: 'button',
  testId: null,
  openWithChevron: false,
  chevronPosition: 'right',
  startOpened: false,
};

export default Accordion;
