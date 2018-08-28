import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { AccordionContainer } from '@shopgate/pwa-ui-shared';
import * as styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Accordion = ({ label, children }) => {
  if (!label || !children) {
    return null;
  }

  return (
    <AccordionContainer>
      {({ handleOpen, handleClose, isOpen }) => (
        <Fragment>
          <div onClick={isOpen ? handleClose : handleOpen} aria-hidden className={styles.container}>
            {label}
          </div>
          {isOpen && (
            <section className={styles.content}>
              {children}
            </section>
          )}
        </Fragment>
      )}
    </AccordionContainer>
  );
};

Accordion.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.node.isRequired,
};

export default Accordion;
