# Shopgate Connect user privacy extension

To comply to the new data privacy laws, we need to offer a button for the user to delete his account.
Delete account requests are later processed by shopgate backend system.

## Configuration

* `deleteAccountTarget` - (string) Target position for the Delete Account Button (choose one from the list below).



### Available target positions for Delete User Button

```json
  "nav-menu.logout.before",
  "nav-menu.logout.after",
  "nav-menu.shipping.before",
  "nav-menu.shipping.after",
  "nav-menu.payment.before",
  "nav-menu.payment.after",
  "nav-menu.terms.before",
  "nav-menu.terms.after",
  "nav-menu.privacy.before",
  "nav-menu.privacy.after",
  "nav-menu.return-policy.before",
  "nav-menu.return-policy.after",
  "nav-menu.imprint.before",
  "nav-menu.imprint.after",
  "nav-menu.quick-links.items.before",
  "nav-menu.quick-links.items.after"
```

### Example configuration

```json
{
  "deleteAccountTarget": "nav-menu.logout.after"
}
```

## About Shopgate
Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize native
apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.
## License
Shopgate Connect - cart extension is available under the Apache License, Version 2.0.
See the [LICENSE](./LICENSE) file for more information.
