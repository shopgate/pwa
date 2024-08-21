import React from 'react';
import PropTypes from 'prop-types';
import {
  SurroundPortals, ConditionalWrapper,
} from '@shopgate/engage/components';
import {
  NAV_MENU_IMPRINT,
  NAV_MENU_PRIVACY,
  NAV_MENU_TERMS,
} from '@shopgate/engage/core';
import {
  NAV_MENU_RETURN_POLICY,
} from '@shopgate/engage/market';
import {
  IMPRINT_PATH,
  PRIVACY_PATH,
  RETURN_POLICY_PATH,
  TERMS_PATH,
} from '@shopgate/engage/page/constants';
import portalProps from '../../../../portalProps';
import Item from '../../../Item';
import connect from './connector';

const pagePortalMapping = {
  [IMPRINT_PATH]: NAV_MENU_IMPRINT,
  [PRIVACY_PATH]: NAV_MENU_PRIVACY,
  [RETURN_POLICY_PATH]: NAV_MENU_RETURN_POLICY,
  [TERMS_PATH]: NAV_MENU_TERMS,
};

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const LegalPages = ({ legalPages }) => {
  if (!legalPages) {
    return null;
  }

  return (
    legalPages.map(({ url, label }) => {
      const portalName = pagePortalMapping[url];

      return (
        <ConditionalWrapper
          key={url}
          condition={portalName}
          wrapper={children =>
            <SurroundPortals portalName={portalName} portalProps={portalProps}>
              {children}
            </SurroundPortals>
          }
        >
          <Item
            label={label}
            href={url}
          />
        </ConditionalWrapper>
      );
    })
  );
};

LegalPages.propTypes = {
  legalPages: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string,
    label: PropTypes.string,
  })),
};

LegalPages.defaultProps = {
  legalPages: null,
};

export default connect(LegalPages);
