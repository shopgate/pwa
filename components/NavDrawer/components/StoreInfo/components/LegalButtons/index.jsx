import React from 'react';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import {
  SurroundPortals, ConditionalWrapper, NavDrawer, Icon,
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
} from '../../../../constants';
import portalProps from '../../../../portalProps';
import connect from '../../../../connector';

const { icons } = themeConfig;

const pagePortalMapping = {
  [IMPRINT_PATH]: NAV_MENU_IMPRINT,
  [PRIVACY_PATH]: NAV_MENU_PRIVACY,
  [RETURN_POLICY_PATH]: NAV_MENU_RETURN_POLICY,
  [TERMS_PATH]: NAV_MENU_TERMS,
};

const pageTestIdMapping = {
  [IMPRINT_PATH]: 'navDrawerImprintButton',
  [PRIVACY_PATH]: 'navDrawerPrivacyButton',
  [RETURN_POLICY_PATH]: 'navDrawerReturnsButton',
  [TERMS_PATH]: 'navDrawerTermsButton',
};

type Props = {
  legalLinks?: Array,
  navigate: () => any
}

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const LegalButtons = ({ legalPages, navigate }: Props) => {
  if (!legalPages) {
    return null;
  }

  /**
   * Creates an icon component.
   * @param {string} icon The icon name.
   * @returns {JSX}
   */
  const getIcon = (icon) => {
    const content = icons?.[icon] || icons.description;
    return props => (<Icon {...props} content={content} />);
  };

  return (
    legalPages.map(({ url, label, icon }) => {
      const portalName = pagePortalMapping[url];
      const testId = pageTestIdMapping[url] || null;

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
          <NavDrawer.Item
            label={label}
            icon={getIcon(icon)}
            onClick={navigate(url, label)}
            testId={testId}
          />
        </ConditionalWrapper>
      );
    })
  );
};

LegalButtons.defaultProps = {
  legalPages: null,
};

export default connect(LegalButtons);
