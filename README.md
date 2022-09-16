# Cobrowse Agent UI

## Localization

### Change active locale at runtime

The project that's using the agent-ui can dictate which locale to use in our components. Below is an example of how to
achieve this from an app that's also using `i18next` to handle localization.

```js
// i18n.js

import i18n from 'i18next';
import i18nAgentUI from 'cobrowse-agent-ui/dist/i18n';

i18n.init({
  // ...
});

i18n.on('languageChanged', (language) => {
  i18nAgentUI.changeLanguage(language);
});

export default i18n;
```

### Adding new locales

To add a new locale follow these steps:

- Add a new entry to the `locales` array inside `i18next-parser.config.js`.
- Run the `npm run i18n` command to generate a new locale file.
- Import the new locale JSON file inside `src/i18n.js` and add it to the `resources` object (in the i18n instance
  configuration) keyed by the locale key.
- Import the relevant `moment` locale inside `src/i18n.js`.
- Add a new entry to the `SUPPORTED_LOCALES` constant inside `src/i18n.js`.

**Note:** ensure the locale code matches the ones provided by the
[moment library](https://github.com/moment/moment/tree/develop/locale) as these are used to localize dates as well.
