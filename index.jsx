/**
 * -------------------------------------------------------------------------
 * ATTENTION:
 * Change this file with caution.
 * Your changes may break the react application!
 * -------------------------------------------------------------------------
 */
import '@shopgate/pwa-common/styles/reset';
import 'Styles/fonts';
import 'Extensions/portals';
import React from 'react';
import { render } from 'react-dom';
import onload from '@shopgate/pwa-core/commands/onload';
import Pages from './pages';

onload();
render(<Pages />, document.getElementById('root'));
