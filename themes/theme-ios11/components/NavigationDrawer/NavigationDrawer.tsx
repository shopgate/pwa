import ClientInformation from '@shopgate/engage/development/components/ClientInformation';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import Header from './components/Header';
import Main from './components/Main';
import QuickLinks from './components/QuickLinks';
import StoreInfo from './components/StoreInfo';
import LogoutButton from './components/LogoutButton';

export type NavigationDrawerProps = {
  /** Called once the drawer finished opening. */
  onOpen?: () => void;
  /** Called once the drawer finished closing. */
  onClose?: () => void;
};

/**
 * The app navigation drawer. Opens and closes through `NavDrawer.open()` / `NavDrawer.close()`.
 * @param props The component props.
 * @param props.onOpen Called once the drawer finished opening.
 * @param props.onClose Called once the drawer finished closing.
 * @returns The rendered drawer.
 */
const NavigationDrawer = ({ onOpen, onClose }: NavigationDrawerProps) => (
  <NavDrawer onOpen={onOpen} onClose={onClose}>
    <Header />
    <Main />
    <QuickLinks />
    <StoreInfo />
    <LogoutButton />
    <ClientInformation />
  </NavDrawer>
);

export default NavigationDrawer;
