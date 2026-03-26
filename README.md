# Cobrowse Agent UI

## Localization

### Change active locale at runtime

The project that's using the agent-ui can dictate which locale to use in our components. Below is an example of how to
achieve this from an app that's also using `i18next` to handle localization.

```js
// i18n.js

import i18n from 'i18next';
import { bindI18n } from 'cobrowse-agent-ui';

i18n.init({
  // ...
});

bindI18n(i18n);

export default i18n;
```

### Adding new locales

To add a new locale follow these steps:

- Add a new entry to the `locales` array inside `i18next.config.ts`.
- Run the `npm run i18n` command to generate a new locale file.
- Import the new locale JSON file inside `lib/i18n/instance.ts` and add it to the `resources` object (in the i18n instance
  configuration) keyed by the locale key.
- Import the relevant `date-fns` locale inside `lib/i18n/instance.ts`.
- Add a new entry to `dateLocales` inside `lib/i18n/instance.ts`.

**Note:** ensure the locale code matches the ones provided by the
[date-fns library](https://github.com/date-fns/date-fns/tree/main/src/locale) as these are used to localize dates as well.
