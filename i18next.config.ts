import { defineConfig } from 'i18next-cli';

export default defineConfig({
  "locales": [
    "en-us",
    "ar",
    "cs",
    "da",
    "de",
    "es",
    "et",
    "fi",
    "fr",
    "hi",
    "it",
    "ja",
    "kk",
    "ko",
    "lt",
    "mr",
    "ms",
    "nl",
    "pl",
    "pt",
    "ro",
    "ru",
    "sk",
    "sl",
    "sv",
    "th",
    "uk",
    "vi",
    "zh"
  ],
  "extract": {
    "input": "lib/**/*.{js,jsx,ts,tsx}",
    "output": "lib/locales/{{language}}/{{namespace}}.json",
    "defaultNS": "translation",
    "keySeparator": false,
    "nsSeparator": false,
    "functions": [
      "t",
      "*.t"
    ],
    "transComponents": [
      "Trans"
    ]
  },
  "types": {
    "input": [
      "locales/{{language}}/{{namespace}}.json"
    ],
    "output": "lib/types/i18next.d.ts"
  }
});
