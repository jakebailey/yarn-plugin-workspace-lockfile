# yarn-plugin-workspace-lockfile

**EXPERIMENTAL!**

Forked by @RyanMartin-Carewell to fix for Yarn 4+

Note that this plugin will generate `yarn.lock` files in each lockWorkspaces named workspace directory. These will
interfere with Yarn 4 operations, as the node_module state file will not be found to match.

The use case for this plugin is only to produce a yarn.lock file per workspace suitable for a deployment. The plugin
would likely need to be removed and the per-workspace yarn.lock files cleaned up after such a deploy.

TODO: remove references to lockRootFilename as this configuration is removed from Yarn 4
TODO: additional work needed to convert from a plugin on afterAllInstalled to a custom command, e.g. deploy   

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
  ~~(to use another name, specify `lockRootFilename` in `package.json`)~~
- Change the plugin so that it does not recurse, and only creates a single `yarn.lock`
  instead of one for every child workspace also (we only need one lockfile for the
  whole public repo, not one for each individual workspace of that repo)


## Changed from splitgraph

- The splitgraph change assumed subpackages are stored in the workspace root, and broke
  when packages were in a subfolder like `packages/`. Fixed here.
- If a lockfile is to be overwritten, ensure we replace it with a file with the same line endings.
- If a lockfile is to be overwritten, skip writing if the file hasn't changed.

## Usage:

```
yarn plugin import https://raw.githubusercontent.com/jakebailey/yarn-plugin-workspace-lockfile/main/packages/plugin/bundles/%40yarnpkg/plugin-workspace-lockfile.js

yarn install
```

Creates a separate lockfile named `yarn.lock-workspace` in each workspace in a yarn 2+ project, containing only dependencies pertaining to that specific workspace.

This can be useful if you need to partition a big monorepo into smaller repos which you can share with individual developers, without giving them access to the entire code base.

You can set-up git submodules in the root monorepo, so that each workspace directory is an individual git repository.

~~Developers can then clone the repository they need to work on, and either rename `yarn.lock-workspace` to `yarn.lock` before installing, or they can create a `.yarnrc.yml` file that contains `lockfileFilename: yarn.lock-workspace`.~~
