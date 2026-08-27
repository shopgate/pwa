# Widgets

Widgets are the building blocks of a CMS page. The core renders a flat list of containers and each
widget renders inside one, without knowing anything about its surroundings.

## Widget config

A widget can tell the core a few things about itself. It does that in a `config.json` inside its
own folder:

```
libraries/engage/page/widgets/Video/
  config.json     <- the config of this widget
  Video.tsx
  hooks.ts
  index.ts
```

Widgets that need no configuration ship no file.

The file is read **at build time** and its content is passed to the app together with the widget
mapping, so its values are known before the widget itself is loaded. A running build watches the
config files, which means editing one is picked up without a restart. Adding a whole new widget
still needs one, because that also changes the component mapping of the app.

A config that does not match the schema, or that cannot be parsed, **fails the build** with a
message that names the widget.

### Media widget margins

Merchants configure margins around media widgets in the theme settings. They arrive in the app
settings as `widgets.mediaMargins` and are applied to the container of every widget that asks for
them:

```json
{
  "$schema": "../../widget.config.schema.json",
  "layout": {
    "applyMediaMargins": true
  }
}
```

`true` applies the margin on all four sides. To take part on some sides only, name them:

```json
{
  "$schema": "../../widget.config.schema.json",
  "layout": {
    "applyMediaMargins": {
      "top": true,
      "bottom": true
    }
  }
}
```

Widgets that bring their own spacing should not ask for the margins, otherwise the two add up. A
widget that is meant to touch the screen edges leaves out `left` and `right`.

Margins that a merchant configures for a single widget instance in the page builder always win over
the media widget margins.

### Editor support

The optional `"$schema"` entry gives autocompletion and inline validation while editing. It is an
editor feature only - the build never follows it, and it is stripped from the config before it
reaches the app. What guards a config is the validation the build runs against
[widget.config.schema.json](../widget.config.schema.json), which happens with or without the entry.

Widgets in this package point at the schema with a path relative to their own folder:

```json
{
  "$schema": "../../widget.config.schema.json",
  "layout": {
    "applyMediaMargins": true
  }
}
```

**Widgets in extensions leave the entry out.** There is no relative path that works for them: an
extension is developed in its own repository, where this package is not present at all, and in an
app it depends on whether the theme or the app carries `@shopgate/engage`. A wrong path is not
dangerous - the editor just offers no help - but it is noise that never starts working. Extension
authors who want the same support can map the schema in their editor instead, for example through
`json.schemas` in the workspace settings of their repository.

### Widgets of extensions

The config of an extension widget belongs to the repository of that extension. `extensions/` is not
part of this repository, so a file that is only added to a local checkout never ships.
