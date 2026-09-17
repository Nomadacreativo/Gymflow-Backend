import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  {
    ignores: ['dist/**/*', 'node_modules/**/*', '.gemini/**/*', '.agents/**/*']
  },
  firebaseRulesPlugin.configs['flat/recommended']
];
