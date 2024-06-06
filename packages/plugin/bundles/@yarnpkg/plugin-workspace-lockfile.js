/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-workspace-lockfile",
factory: function (require) {
var plugin = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // sources/index.ts
  var sources_exports = {};
  __export(sources_exports, {
    default: () => sources_default
  });
  var import_core = __require("@yarnpkg/core");
  var import_cli = __require("@yarnpkg/cli");
  var import_fslib = __require("@yarnpkg/fslib");
  var createLockfile = async (configuration, { cwd }, subWorkspaces) => {
    const { project, workspace } = await import_core.Project.find(configuration, cwd);
    const cache = await import_core.Cache.find(configuration);
    let requiredWorkspaces = [workspace, ...subWorkspaces];
    for (let i = project.workspaces.length - 1; i >= 0; i--) {
      const currentWorkspace = project.workspaces[i];
      if (!requiredWorkspaces.find((w) => currentWorkspace.anchoredLocator.identHash === w.anchoredLocator.identHash)) {
        project.workspaces.splice(i, 1);
      }
    }
    await project.resolveEverything({
      cache,
      report: new import_core.ThrowReport()
    });
    for (const w of project.workspaces) {
      const pkg = Array.from(project.originalPackages.values()).find(
        (p) => p.identHash === w.anchoredLocator.identHash
      );
      if (pkg?.reference.startsWith("workspace:")) {
        if (w.cwd.startsWith(cwd)) {
          const newReference = `workspace:${w.cwd !== cwd ? w.cwd.slice(workspace.cwd.length + 1) : "."}`;
          pkg.reference = newReference;
          Array.from(project.storedDescriptors.values()).find(
            (v) => v.identHash === pkg.identHash
          ).range = newReference;
        }
      }
    }
    return project.generateLockfile();
  };
  var green = (text) => `\x1B[32m${text}\x1B[0m`;
  var plugin = {
    hooks: {
      afterAllInstalled: async (project) => {
        const configuration = await import_core.Configuration.find(
          project.cwd,
          (0, import_cli.getPluginConfiguration)()
        );
        await import_core.StreamReport.start(
          {
            configuration,
            stdout: process.stdout,
            includeLogs: true
          },
          async (report) => {
            const packageJson = await import_fslib.xfs.readJsonPromise(import_fslib.ppath.join(project.topLevelWorkspace.cwd, "package.json"));
            const lockWorkspaces = packageJson.lockWorkspaces;
            const lockRootFilename = packageJson.lockRootFilename ?? "yarn.lock";
            if (!lockWorkspaces) {
              return;
            }
            for (const lockWorkspace of lockWorkspaces) {
              const focusWorkspaces = project.workspaces.filter((w) => w.anchoredLocator.name === lockWorkspace);
              for (const workspace of focusWorkspaces) {
                const targetWorkspaces = project.workspaces.filter((w) => w.relativeCwd.startsWith(workspace.relativeCwd));
                const lockPath = import_fslib.ppath.join(
                  workspace.cwd,
                  lockRootFilename
                );
                let contents = await createLockfile(configuration, workspace, targetWorkspaces);
                try {
                  const existing = await import_fslib.xfs.readFilePromise(lockPath, "utf8");
                  if (existing.indexOf("\r\n") !== -1) {
                    contents = contents.replace(/\n/g, "\r\n");
                  }
                  if (existing === contents) {
                    continue;
                  }
                } catch (e) {
                }
                await import_fslib.xfs.writeFilePromise(
                  lockPath,
                  contents
                );
                report.reportInfo(null, `${green(`\u2713`)} Wrote ${lockPath}`);
              }
            }
          }
        );
      }
    }
  };
  var sources_default = plugin;
  return __toCommonJS(sources_exports);
})();
return plugin;
}
};
