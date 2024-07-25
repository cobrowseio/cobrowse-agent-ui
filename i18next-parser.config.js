module.exports = {
  locales: ['en-us', 'es', 'fr'],
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
