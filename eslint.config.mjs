import globals from "globals";
import babelParser from "@babel/eslint-parser";
import js from "@eslint/js";

export default [
    {
        files: ["**/*.js", "**/*.mjs", "**/*.jsx"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parser: babelParser,
            ecmaVersion: 2018,
            sourceType: "module",
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    babelrc: false,
                    configFile: false,
                    presets: ["@babel/preset-env"],
                },
                ecmaFeatures: {
                    modules: true,
                    destructuring: true,
                    classes: true,
                    forOf: true,
                    blockBindings: true,
                    arrowFunctions: true,
                },
            },
        },

        settings: {
            ecmascript: 7,
        },

        rules: {
            // Start with ESLint recommended rules
            ...js.configs.recommended.rules,

            // Apply our custom overrides (keeping original project preferences)
            "arrow-body-style": 0,
            "prefer-arrow-callback": 0,
            "arrow-parens": 0,
            "no-param-reassign": 0,
            "no-new": 0,
            "consistent-return": 0,
            "key-spacing": 0,
            "no-multi-spaces": 0,
            "no-underscore-dangle": 0,
            "one-var": 0,
            "global-require": 0,
            "class-methods-use-this": 0,
            "comma-dangle": ["error", {
                arrays: "always-multiline",
                objects: "always-multiline",
                imports: "always-multiline",
                exports: "always-multiline",
                functions: "never",
            }],
            "func-names": 0,
            "function-paren-newline": 0,
            "indent": ["error", 2],
            "new-cap": 0,
            "no-plusplus": 0,
            "no-return-assign": 0,
            "quote-props": 0,
            "template-curly-spacing": 0,
            "no-unused-expressions": 0,

            // Import rules (basic ones that don't require the import plugin)
            "no-duplicate-imports": "error",

            // Line ending for Unix/macOS (updated for current platform)
            "linebreak-style": ["error", "unix"],

            // Basic ES6+ rules that replace some airbnb functionality
            "prefer-const": "warn",
            "no-var": "error",
            "prefer-template": "warn",
            "object-shorthand": "warn",
        },
    },
    {
        // Global ignores
        ignores: ["dist/**/*", "node_modules/**/*", "*.min.js"],
    },
];
