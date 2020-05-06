import React from 'react';
import { wrapper } from './style';

type Props = {
  shortDescription?: string,
}

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ShortDescription = ({ shortDescription }: Props) => {
  if (!shortDescription) {
    return null;
  }

  return (
    <div className={wrapper} dangerouslySetInnerHTML={{ __html: shortDescription }} />
  );
};

ShortDescription.defaultProps = {
  shortDescription: null,
};

export default ShortDescription;
