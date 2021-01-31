# Vite Tailwind JS Template

Quickly prototype tailwind sites using Vite build tool.

## Get Started

> Install the packages

`yarn`

## Local Development

> Start the development server

`yarn dev`

## Build

> Build the site into `dist` folder

`yarn build`

## Serve Production app in local

> Serve the built site

`yarn serve`

## Eslint

> Uses **Airbnb Base** configs

> Check for the linting errors

`yarn lint`

> Check & automatically fix the linting errors

`yarn lint:fix`

## Prettier

> Used in conjuction with Eslint with `eslint-plugin-prettier` &
> `eslint-config-prettier`

> Format the workspace files

`yarn format`

> Format the `package.json` file

`yarn format:package`

## Commit

`git add . && yarn commit`

> Uses **[gacp](https://github.com/vivaxy/gacp#readme)**

- Runs [Husky](https://github.com/typicode/husky) to improve the commits.
- Husky runs [Lint Staged](https://github.com/okonet/lint-staged) as a
  pre-commit hook to run lintes & formatters
- Husky lints the commit message with
  [Commitlint](https://github.com/conventional-changelog/commitlint)
