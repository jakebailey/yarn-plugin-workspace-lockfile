/* eslint-disable */
module.exports = {
name: "@yarnpkg/plugin-workspace-lockfile",
factory: function (require) {
var plugin;plugin =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _yarnpkg_cli__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _yarnpkg_cli__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_yarnpkg_cli__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_2__);




const createLockfile = async (configuration, {
  cwd
}, subWorkspaces) => {
  const {
    project,
    workspace
  } = await _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__.Project.find(configuration, cwd);
  const cache = await _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__.Cache.find(configuration);
  let requiredWorkspaces = [workspace, ...subWorkspaces]; // remove any workspace that isn't a dependency, iterate in reverse so we can splice it

  for (let i = project.workspaces.length - 1; i >= 0; i--) {
    const currentWorkspace = project.workspaces[i];

    if (!requiredWorkspaces.find(w => currentWorkspace.locator.identHash === w.locator.identHash)) {
      project.workspaces.splice(i, 1);
    }
  }

  await project.resolveEverything({
    cache,
    report: new _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__.ThrowReport()
  });

  for (const w of project.workspaces) {
    const pkg = Array.from(project.originalPackages.values()).find(p => p.identHash === w.locator.identHash);

    if (pkg === null || pkg === void 0 ? void 0 : pkg.reference.startsWith("workspace:")) {
      // ensure we replace the path in the lockfile from `workspace:packages/somepath` to `workspace:.`
      if (w.cwd.startsWith(cwd)) {
        // e.g. For workspace "packages", we want to replace references as so:
        //
        //    "packages" === cwd            --> workspace:.
        //    "packages/child-package"      --> workspace:child-package
        //
        // slice len +1 to include the slash, e.g. replace "packages/"
        const newReference = `workspace:${w.cwd !== cwd ? w.cwd.slice(workspace.cwd.length + 1) : '.'}`;
        pkg.reference = newReference;
        Array.from(project.storedDescriptors.values()).find(v => v.identHash === pkg.identHash).range = newReference;
      }
    }
  }

  return project.generateLockfile();
};

const green = text => `\x1b[32m${text}\x1b[0m`;

const plugin = {
  hooks: {
    afterAllInstalled: async project => {
      const configuration = await _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__.Configuration.find(project.cwd, (0,_yarnpkg_cli__WEBPACK_IMPORTED_MODULE_1__.getPluginConfiguration)());
      await _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__.StreamReport.start({
        configuration,
        stdout: process.stdout,
        includeLogs: true
      }, async report => {
        var _a;

        const packageJson = await _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_2__.xfs.readJsonPromise(_yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_2__.ppath.join(project.topLevelWorkspace.cwd, "package.json"));
        const lockWorkspaces = packageJson.lockWorkspaces;
        const lockRootFilename = (_a = packageJson.lockRootFilename) !== null && _a !== void 0 ? _a : "yarn.lock";

        if (!lockWorkspaces) {
          return;
        }

        for (const lockWorkspace of lockWorkspaces) {
          const focusWorkspaces = project.workspaces.filter(w => w.locator.name === lockWorkspace);

          for (const workspace of focusWorkspaces) {
            const targetWorkspaces = project.workspaces.filter(w => w.relativeCwd.startsWith(workspace.relativeCwd));
            const lockPath = _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_2__.ppath.join(workspace.cwd, lockRootFilename);
            let contents = await createLockfile(configuration, workspace, targetWorkspaces);

            try {
              const existing = await _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_2__.xfs.readFilePromise(lockPath, "utf8");

              if (existing.indexOf('\r\n') !== -1) {
                contents = contents.replace(/\n/g, '\r\n');
              }

              if (existing === contents) {
                continue;
              }
            } catch (e) {}

            await _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_2__.xfs.writeFilePromise(lockPath, contents);
            report.reportInfo(null, `${green(`✓`)} Wrote ${lockPath}`);
          }
        }
      });
    }
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);

/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("@yarnpkg/core");;

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@yarnpkg/cli");;

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@yarnpkg/fslib");;

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })()
;
return plugin;
}
};