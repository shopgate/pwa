export default {
  userMenuAddressBook: "[data-test-id='menuAddressBookButton']",

  addressListPage: "[data-test-id='UserAddressBookPage']",
  addressListPageText: "[data-test-id='UserAddressBookPage'] > span",
  addressListAddButton: "[data-test-id='link: /user/address/0']",
  addressListPageAddress: (addressId) => `[data-test-id='link: /user/address/${addressId}']`,

  userAddressBookAddPage: "[data-test-id='UserAddressBookAddPage']",
  userAddressBookAddPageForm: "[data-test-id='UserAddressBookAddPage'] > form",
  userAddressBookAddPageBottomButton: "[data-test-id='UserAddressBookAddPage'] [data-test-id='Button']",

  modal: "[data-test-id='basicDialog']",
}
