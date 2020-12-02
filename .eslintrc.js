module.exports = {
  env: {
    'node': true,
    'browser': true,
    'es6': true
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended', 
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript'
  ],
  globals: {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  parserOptions: {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  plugins: [
    'react',
    'react-hooks'
  ],
  settings: {
    'react': {
      'version': 'detect'
    },
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.jsx', '.ts', '.tsx'],
        'moduleDirectory': ['node_modules', 'src/'],
      },
    }
  },
  ignorePatterns: ['webpack.*', 'config-overrides.js', 'node_modules/'],
  rules: {
    '@typescript-eslint/ban-types': [
      'warn',
    ],
    '@typescript-eslint/indent': ['error', 2, { 'SwitchCase': 1 }], 
    'max-len': ['warn', { 
      'code': 115, 
      'ignoreUrls': true, 
      'ignoreStrings': true, 
      'ignoreComments': true, 
      'ignoreTemplateLiterals': true 
    }],
    'no-extra-semi': 'off',
    'keyword-spacing': 'error',
    'arrow-spacing': 'error',
    'space-infix-ops': 'error',
    'space-before-blocks': ['error', { 
      'functions': 'always', 
      'keywords': 'always', 
      'classes': 'always' 
    }], 
    'no-multi-spaces': 'error',
    'object-curly-spacing': ['warn', 'always'],
    'semi': 'error',
    'no-console': 'warn',
    'no-multiple-empty-lines': 'error',
    'no-empty': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'import/no-unresolved': 'off',
    'jsx-quotes': 'error',
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
    'react/jsx-max-depth': ['warn', { 'max': 5 }],
    'react-hooks/rules-of-hooks': 'error', 
    'react/jsx-no-comment-textnodes': 'warn',
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'], 
      'newlines-between': 'always-and-inside-groups', 
      'alphabetize': {
        'order': 'asc',
        'caseInsensitive': true
      }, 
      'pathGroups': [
        {
          'pattern': 'pages/**',
          'group': 'internal'
        },
        {
          'pattern': 'models/**',
          'group': 'internal'
        },
        {
          'pattern': 'redux/**',
          'group': 'internal'
        },
        {
          'pattern': 'scss/**',
          'group': 'index'
        },
        {
          'pattern': 'shared/**',
          'group': 'internal'
        },
        {
          'pattern': 'stories/**',
          'group': 'internal'
        },
        {
          'pattern': 'plugins/**',
          'group': 'internal'
        }, 
      ],
    }], 
    'import/newline-after-import': ['error', { 'count': 1 }]
  }
};