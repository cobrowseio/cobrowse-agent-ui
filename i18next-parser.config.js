module.exports = {
  locales: ['en-us', 'es', 'fr'],
  namespaceSeparator: false,
  keySeparator: false,
  useKeysAsDefaultValue: true,
  verbose: true,
  output: 'src/locales/$LOCALE/$NAMESPACE.json',
  lexers: {
    js: ['JsxLexer']
  }
}
