import { lazy } from 'react';

export const StartPage = lazy(() => import('./StartPage'));
export const Page = lazy(() => import('./Page'));
export const Category = lazy(() => import('./Category'));
export const Filter = lazy(() => import('./Filter'));
export const Product = lazy(() => import('./Product'));
export const ProductGallery = lazy(() => import('./ProductGallery'));
export const Reviews = lazy(() => import('./Reviews'));
export const Cart = lazy(() => import('./Cart'));
export const Favorites = lazy(() => import('./Favorites'));
export const Search = lazy(() => import('./Search'));
export const Login = lazy(() => import('./Login'));
export const WriteReview = lazy(() => import('./WriteReview'));
export const Browse = lazy(() => import('./Browse'));
export const More = lazy(() => import('./More'));
export const Scanner = lazy(() => import('./Scanner'));
export const BackInStock = lazy(() => import('./BackInStock'));
export const PrivacySettings = lazy(() => import('./PrivacySettings'));
export const CheckoutAddressBook = lazy(() => import('./Checkout/CheckoutAddressBook'));
export const CheckoutAddressBookContact = lazy(() => import('./Checkout/CheckoutAddressBookContact'));
export const GuestCheckoutRegistration = lazy(() => import('./Checkout/GuestCheckoutRegistration'));
export const GuestCheckoutPayment = lazy(() => import('./Checkout/GuestCheckoutPayment'));
export const Checkout = lazy(() => import('./Checkout/Checkout'));
export const Register = lazy(() => import('./Register'));
export const OrderDetails = lazy(() => import('./OrderDetails'));
export const CheckoutConfirmationPage = lazy(() => import('./Checkout/CheckoutConfirmation'));
export const ForgotPassword = lazy(() => import('./ForgotPassword'));
export const Account = lazy(() => import('./Account'));
export const AccountContact = lazy(() => import('./Account/Contact'));
export const StoreFinder = lazy(() => import('./StoreFinder'));
export const StoreDetails = lazy(() => import('./StoreDetails'));
