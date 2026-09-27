# Cobrowse Agent UI

## Development

This project uses [Vite+](https://viteplus.dev/guide/) (`vp`) as its toolchain for the dev server, builds, linting and type
checking.

### Setup

1. Install the global `vp` CLI:

   ```bash
   # macOS / Linux
   curl -fsSL https://vite.plus | bash

   # Windows (PowerShell)
   irm https://vite.plus/ps1 | iex
   ```

   Open a new shell and run `vp help` to confirm it's on your `PATH`. `vp` manages the Node.js runtime and package manager
   for you. The npm version is pinned through `devEngines` in `package.json` and is downloaded automatically if it's missing.

2. Install dependencies:

   ```bash
   vp install
   ```

   This runs the `prepare` script, which builds the library and runs `vp config` to install the Git hooks in
   `.vite-hooks`. The pre-commit hook runs `vp check --fix` on staged files.

If Node.js or npm behave unexpectedly, run `vp env doctor`.

### Commands

| Command       | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| `vp dev`      | Start the dev server with the kitchen sink app from `src/`   |
| `vp build`    | Build the library into `dist/`                               |
| `vp check`    | Lint and type check (formatting is disabled for now)         |
| `vp run lint` | Lint, plus i18n lint via `i18next-cli`. This is what CI runs |
| `vp run i18n` | Extract translation keys into the locale files               |

**Note:** `vp <name>` runs a built-in Vite+ command, while `vp run <name>` runs a `package.json` script. The two can do
different things, so use `vp run` for the scripts defined in this project.

The npm equivalents (`npm install`, `npm run <script>`) still work, even without the global `vp` CLI, since the scripts
use the project-local `vp` from the `vite-plus` package. CI uses them too. Prefer `vp` for local development, though, so
commands run with the Node.js and npm versions Vite+ manages.

For linting in your editor, install the [Oxc extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)
for VS Code or the equivalent for [other editors](https://viteplus.dev/guide/ide-integration).

## Localization

### Change active locale at runtime

The project that's using the agent-ui can dictate which locale to use in our components. Below is an example of how to
achieve this from an app that's also using `i18next` to handle localization.

```js
// i18n.js

import i18n from "i18next";
import { bindI18n } from "cobrowse-agent-ui";

i18n.init({
  // ...
});

bindI18n(i18n);

export default i18n;
```

### Adding new locales

To add a new locale follow these steps:

- Add a new entry to the `locales` array inside `i18next.config.ts`.
- Run the `vp run i18n` command to generate a new locale file.
- Import the new locale JSON file inside `lib/i18n/instance.ts` and add it to the `resources` object (in the i18n instance
  configuration) keyed by the locale key.
- Import the relevant `date-fns` locale inside `lib/i18n/instance.ts`.
- Add a new entry to `dateLocales` inside `lib/i18n/instance.ts`.

**Note:** ensure the locale code matches the ones provided by the
[date-fns library](https://github.com/date-fns/date-fns/tree/main/src/locale) as these are used to localize dates as well.
