import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { AccordionContainer, ChevronIcon } from '@shopgate/pwa-ui-shared';
import AccordionContent from './components/AccordionContent';
import * as styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Accordion = ({ renderLabel, children, testId }) => {
  if (!renderLabel || !children) {
    return null;
  }

  return (
    <AccordionContainer>
      {({ handleOpen, handleClose, open }) => (
        <Fragment>
          <div
            onClick={open ? handleClose : handleOpen}
            className={styles.toggle}
            data-test-id={testId}
            key="accordion-toggle"
            aria-hidden
          >
            {renderLabel({ open })}
            <div className={styles.chevronContainer}>
              <ChevronIcon className={open ? styles.chevronOpen : styles.chevronClosed} />
            </div>
          </div>
          <AccordionContent open={open} key="accordion-content">
            {children}
          </AccordionContent>
        </Fragment>
      )}
    </AccordionContainer>
  );
};

Accordion.propTypes = {
  children: PropTypes.node.isRequired,
  renderLabel: PropTypes.func.isRequired,
  testId: PropTypes.string,
};

Accordion.defaultProps = {
  testId: null,
};

export default Accordion;
