import React from 'react';
import { useRoute, useTheme } from '@shopgate/engage/core';
import { ScannerContainer, ScannerOverlay } from '@shopgate/engage/components';
import { SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE } from '@shopgate/engage/scanner';

/**
 * The scanner page component.
 * @returns {JSX}
 */
const ScannerView = () => {
  const { View, AppBar } = useTheme();
  const { query: { scope = SCANNER_SCOPE_DEFAULT, type = SCANNER_TYPE_BARCODE } } = useRoute();

  return (
    <View background="transparent">
      <AppBar title="titles.scanner" right={null} />
      <ScannerContainer scope={scope} type={type}>
        <ScannerOverlay />
      </ScannerContainer>
    </View>
  );
};

export default ScannerView;
