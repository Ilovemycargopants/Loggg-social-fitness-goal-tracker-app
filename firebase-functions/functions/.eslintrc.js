module.exports = {
    env: {
        es6: true,
        node: true,
    },
    parserOptions: {
        'ecmaVersion': 2018,
    },
    extends: [
        'eslint:recommended',
        'google',
    ],
    rules: {
        'quotes': ['error', 'single'],
        'no-unused-vars': 'off',
        'indent': ['error', 4],
        'max-len': ['error', 300],
        'object-curly-spacing': ['error', 'always'],
    // add other rule adjustments here
    },
    overrides: [
        {
            files: ['**/*.spec.*'],
            env: {
                mocha: true,
            },
            rules: {},
        },
    ],
    globals: {},
};
