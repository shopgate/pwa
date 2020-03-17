// @flow
import * as React from 'react';
import classnames from 'classnames';
import { AccordionContainer, ChevronIcon } from '@shopgate/pwa-ui-shared';
import AccordionContent from './components/AccordionContent';
import * as styles from './style';

type Props = {
  renderLabel: ({ open: boolean }) => void,
  children: React.Node,
  handleLabel?: string,
  testId?: string,
  className?: string,
  contentClassName?: string,
}

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function Accordion(props: Props) {
  const {
    renderLabel, handleLabel, children, testId, className, contentClassName,
  } = props;

  if (!renderLabel || !children) {
    return null;
  }

  const controlsId = testId ? `${testId}-content`.replace(/[^\w\s]/gi, '-').replace(' ', '-') : 'accordion-content';

  return (
    <AccordionContainer>
      {({ handleOpen, handleClose, open }) => (
        <React.Fragment>
          <div
            onClick={open ? handleClose : handleOpen}
            onKeyDown={open ? handleClose : handleOpen}
            role="button"
            tabIndex="0"
            className={classnames(className, styles.toggle.toString())}
            data-test-id={testId}
            key="accordion-toggle"
            aria-expanded={open}
            aria-controls={controlsId}
            aria-label={handleLabel}
          >
            {renderLabel({ open })}
            <div className={styles.chevronContainer}>
              <ChevronIcon className={open ? styles.chevronOpen : styles.chevronClosed} />
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
        </React.Fragment>
      )}
    </AccordionContainer>
  );
}

Accordion.defaultProps = {
  className: null,
  contentClassName: null,
  handleLabel: null,
  testId: null,
};

export default Accordion;
