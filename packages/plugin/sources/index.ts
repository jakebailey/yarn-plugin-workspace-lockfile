import {
  Plugin,
  Hooks,
  Project,
  Configuration,
  Cache,
  Workspace,
  StreamReport,
  ThrowReport,
} from "@yarnpkg/core";
import { getPluginConfiguration } from "@yarnpkg/cli";

import { xfs, ppath, Filename } from "@yarnpkg/fslib";

const createLockfile = async (
  configuration: Configuration,
  { cwd }: Workspace,
  subWorkspaces: Workspace[]
) => {
  const { project, workspace } = await Project.find(configuration, cwd);
  const cache = await Cache.find(configuration);

  let requiredWorkspaces = [workspace, ...subWorkspaces]

  // remove any workspace that isn't a dependency, iterate in reverse so we can splice it
  for (let i = project.workspaces.length - 1; i >= 0; i--) {
    const currentWorkspace = project.workspaces[i];
    if (!requiredWorkspaces.find(w => currentWorkspace.locator.identHash === w.locator.identHash)) {
      project.workspaces.splice(i, 1);
    }
  }

  await project.resolveEverything({
    cache,
    report: new ThrowReport(),
  });

  for (const w of project.workspaces) {
    const pkg = Array.from(project.originalPackages.values()).find(
      (p) => p.identHash === w.locator.identHash
    );
    if (pkg?.reference.startsWith("workspace:")) {
      // ensure we replace the path in the lockfile from `workspace:packages/somepath` to `workspace:.`
      if (w.cwd.startsWith(cwd)) {
        // e.g. For workspace "packages", we want to replace references as so:
        //
        //    "packages" === cwd            --> workspace:.
        //    "packages/child-package"      --> workspace:child-package
        //
        // slice len +1 to include the slash, e.g. replace "packages/"
        const newReference = `workspace:${w.cwd !== cwd ? w.cwd.slice(workspace.cwd.length + 1) : '.'}`

        pkg.reference = newReference;
        Array.from(project.storedDescriptors.values()).find(
          (v) => v.identHash === pkg.identHash
        ).range = newReference;
      }
    }
  }

  return project.generateLockfile();
};

const green = (text: string) => `\x1b[32m${text}\x1b[0m`;

const plugin: Plugin<Hooks> = {
  hooks: {
    afterAllInstalled: async (project) => {
      const configuration = await Configuration.find(
        project.cwd,
        getPluginConfiguration()
      );

      await StreamReport.start(
        {
          configuration,
          stdout: process.stdout,
          includeLogs: true,
        },
        async (report: StreamReport) => {
          const packageJson = await xfs.readJsonPromise(ppath.join(project.topLevelWorkspace.cwd, "package.json" as Filename))
          const lockWorkspaces = packageJson.lockWorkspaces
          const lockRootFilename = packageJson.lockRootFilename ?? "yarn.lock"

          if (!lockWorkspaces) {
            return
          }

          for (const lockWorkspace of lockWorkspaces) {
            const focusWorkspaces = project.workspaces.filter(w => w.locator.name === lockWorkspace)

            for (const workspace of focusWorkspaces) {
              const targetWorkspaces = project.workspaces.filter(w => w.relativeCwd.startsWith(workspace.relativeCwd))
              const lockPath = ppath.join(
                workspace.cwd,
                lockRootFilename as Filename
              );

              let contents = await createLockfile(configuration, workspace, targetWorkspaces);

              try {
                const existing = await xfs.readFilePromise(lockPath, "utf8");
                if (existing.indexOf('\r\n')) {
                  contents = contents.replace(/\n/g, '\r\n')
                }
              } catch (e) {}

              await xfs.writeFilePromise(
                lockPath,
                contents
              );
              report.reportInfo(null, `${green(`✓`)} Wrote ${lockPath}`);
            }
          }
        }
      );
    },
  },
};

export default plugin;
