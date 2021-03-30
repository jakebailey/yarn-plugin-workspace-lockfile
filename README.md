# yarn-plugin-workspace-lockfile

**EXPERIMENTAL!**

## Changed from upstream:

- At Splitgraph, we have a private monorepo, which includes a nested, public
  monorepo (github.com/splitgraph/splitgraph.com)
- By default, running `yarn install` in the private monorepo will only create a single
  `yarn.lock` file at the root, which is problematic, because we need to run separate
  CI jobs in the public repo, which is hard to do without having its own lockfile
- This fork modifies this awesome yarn plugin to suit our purposes
- Specifically, add support for `lockWorkspaces` key of `package.json`. If this is set
  in the top level `package.json` e.g. `lockWorkspaces: ["splitgraph.com"]`, then the
  plugin will generate a single `yarn.lock` for each listed workspace
  (to use another name, specify `lockRootFilename` in `package.json`)
- Change the plugin so that it does not recurse, and only creates a single `yarn.lock`
  instead of one for every child workspace also (we only need one lockfile for the
  whole public repo, not one for each individual workspace of that repo)

## Usage:

```
yarn plugin import https://raw.githubusercontent.com/milesforks/yarn-plugin-workspace-lockfile/main/packages/plugin/bundles/%40yarnpkg/plugin-workspace-lockfile.js

yarn install
```

Creates a separate lockfile named `yarn.lock-workspace` in each workspace in a yarn 2+ project, containing only dependencies pertaining to that specific workspace.

This can be useful if you need to partition a big monorepo into smaller repos which you can share with individual developers, without giving them access to the entire code base.

You can set-up git submodules in the root monorepo, so that each workspace directory is an individual git repository.

Developers can then clone the repository they need to work on, and either rename `yarn.lock-workspace` to `yarn.lock` before installing, or they can create a `.yarnrc.yml` file that contains `lockfileFilename: yarn.lock-workspace`.
