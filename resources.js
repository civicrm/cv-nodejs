/**
 * @file
 *
 * The submodule `civicrm-cv/resources` allows you to load resource files provided by
 * CiviCRM extensions (or core). For example:
 *
 * var cvRes = require('civicrm-cv/resources')();
 * var LoginPage = cvRes.require('civicrm', 'tests/protractor/lib/LoginPage.js');
 *
 * To improve performance, it retains an in-memory cache of extension paths. If you perform
 * existential actions (such as downloading new extension code), then you may need to explicitly
 * flush that cache.
 */

var scanCache = null, pathIndex = null;
var cv = require('civicrm-cv')({mode: 'sync'});

module.exports = function() {
  var api = {
    /**
     * Lookup the path to a CiviCRM extension.
     *
     * @param ext String, required, e.g. "civicrm" or "org.civicrm.civivolunteer".
     * @param file String, optional
     * @returns String
     */
    getPath: function(ext, file) {
      if (pathIndex === null) api.scan();
      if (!pathIndex[ext]) {
        throw "[civicrm-cv/resources] Failed to locate extension: " + ext;
      }
      if (file === undefined || file === null) {
        return pathIndex[ext];
      }
      else {
        return pathIndex[ext] + '/' + file; // FIXME: windows?
      }
    },

    hasPath: function(ext) {
      if (pathIndex === null) api.scan();
      return !!pathIndex[ext];
    },

    require: function(ext, file) {
      if (!ext || !file) {
        throw "[civicrm-cv/resources] require() must have extension and file";
      }
      return require(api.getPath(ext, file));
    },

    flush: function() {
      scanCache = null;
      pathIndex = null;
    },

    /**
     * Scan the CiviCRM system for resources
     *
     * @return Object
     *   Each item is an object with keys:
     *     - key: string, e.g. "civicrm" or "org.civicrm.civivolunteer".
     *     - path: string, e.g. "/var/www/sites/all/modules/civicrm".
     */
    scan: function() {
      scanCache = cv([
        'php:eval',
        "$r = array();" +
        "$c = CRM_Extension_System::singleton()->getFullContainer();" +
        "foreach ($c->getKeys() as $k) {" +
        "  $r[] = array(" +
        "    'key' => $k," +
        "    'path' => $c->getPath($k)," +
        // "    'url' => $c->getUrl($k)," +
        "  );" +
        "}" +
        "$res = CRM_Core_Resources::singleton();" +
        "$r[] = array(" +
        "  'key' => 'civicrm'," +
        "  'path' => $res->getPath('civicrm')," +
        // "  'url' => $res->getUrl('civicrm')," +
        ");" +
        "return $r;"
      ]);
      pathIndex = {};
      for (var i = 0; i < scanCache.length; i++) {
        pathIndex[scanCache[i].key] = scanCache[i].path;
      }
    }
  };
  return api;
};
