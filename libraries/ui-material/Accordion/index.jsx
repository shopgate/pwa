import * as React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import noop from 'lodash/noop';
import { AccordionContainer, ChevronIcon } from '@shopgate/pwa-ui-shared';
import { i18n } from '@shopgate/engage/core';
import AccordionContent from './components/AccordionContent';
import * as styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function Accordion(props) {
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
  } = props;

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
            tabIndex: '0',
          };

          return (
            <>
              <div
                {... (openWithChevron ? {} : clickHandlers)}
                className={classnames(
                  'ui-material__accordion-title',
                  className,
                  styles.toggle,
                  {
                    [styles.toggleLeftAligned]: chevronPosition === 'left',
                    [styles.clickable]: !openWithChevron,
                  }
                )}
                data-test-id={testId}
                key="accordion-toggle"
                aria-expanded={open}
                aria-controls={controlsId}
                aria-label={handleLabel}
              >
                <div className={styles.labelContainer}>
                  {renderLabel({ open })}
                </div>
                <div
                  className={classnames(
                    styles.chevronContainer,
                    chevronClassName,
                    {
                      [styles.clickable]: openWithChevron,
                    }
                  )}
                  {... (openWithChevron ? clickHandlers : {})}
                  aria-label={i18n.text(open ? 'favorites.close_list' : 'favorites.open_list')}
                >
                  <ChevronIcon
                    className={open ? styles.chevronOpen : styles.chevronClosed}
                  />
                </div>
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
}

Accordion.propTypes = {
  chevronClassName: PropTypes.string,
  chevronPosition: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  handleLabel: PropTypes.string,
  openWithChevron: PropTypes.bool,
  renderLabel: PropTypes.func,
  role: PropTypes.string,
  startOpened: PropTypes.bool,
  testId: PropTypes.string,
};

Accordion.defaultProps = {
  children: null,
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
