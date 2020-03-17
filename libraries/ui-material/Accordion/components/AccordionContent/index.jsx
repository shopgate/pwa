// @flow
import * as React from 'react';
import classnames from 'classnames';
import * as styles from './style';

export type Props = {
  children: React.Node,
  id: string,
  open?: boolean,
  className?: string,
}

/**
 * The accordion content component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function AccordionContent({
  children, open, id, className,
}: Props) {
  const style = {
    height: !open ? 0 : 'auto',
  };

  return (
    <div className={styles.content} style={style} id={id} aria-hidden={!open}>
      <div className={classnames(styles.contentInner, className)}>
        {children}
      </div>
    </div>
  );
}

AccordionContent.defaultProps = {
  open: false,
  className: null,
};

export default AccordionContent;
