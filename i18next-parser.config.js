module.exports = {
  locales: ['en-us', 'es'],
  namespaceSeparator: false,
  keySeparator: false,
  useKeysAsDefaultValue: true,
  verbose: true,
  output: 'src/locales/$LOCALE/$NAMESPACE.json',
  lexers: {
    js: ['JsxLexer'],
  },
};
