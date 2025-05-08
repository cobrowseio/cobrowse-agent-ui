module.exports = {
  locales: [
    'en-us',
    'ar',
    'cs',
    'da',
    'de',
    'es',
    'et',
    'fi',
    'fr',
    'hi',
    'it',
    'ja',
    'kk',
    'ko',
    'lt',
    'mr',
    'ms',
    'nl',
    'pl',
    'pt',
    'ro',
    'ru',
    'sk',
    'sl',
    'sv',
    'th',
    'uk',
    'vi',
    'zh'
  ],
  namespaceSeparator: false,
  keySeparator: false,
  defaultValue: function (locale, namespace, key, value) {
    return key
  },
  verbose: true,
  output: 'src/locales/$LOCALE/$NAMESPACE.json',
  lexers: {
    js: ['JsxLexer']
  }
}
