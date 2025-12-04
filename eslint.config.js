import love from 'eslint-config-love'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

const reactRecommended = react.configs.flat.recommended
const reactHooksRecommended = reactHooks.configs.flat.recommended

export default [
  {
    ignores: ['dist/**', 'src/**', 'types/**'],
  },
  {
    ...love,
    files: ['lib/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      ...love.plugins,
      ...reactRecommended.plugins,
      ...reactHooksRecommended.plugins,
    },
    languageOptions: {
      ...love.languageOptions,
      parserOptions: {
        ...love.languageOptions.parserOptions,
        ...reactRecommended.languageOptions?.parserOptions,
        ecmaFeatures: {
          ...(love.languageOptions.parserOptions?.ecmaFeatures ?? {}),
          ...(reactRecommended.languageOptions?.parserOptions?.ecmaFeatures ?? {}),
          jsx: true,
        },
      },
    },
    rules: {
      ...love.rules,
      ...reactRecommended.rules,
      ...reactHooksRecommended.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
    settings: {
      ...(love.settings ?? {}),
      ...(reactRecommended.settings ?? {}),
      react: { version: 'detect' },
    },
  },
]
