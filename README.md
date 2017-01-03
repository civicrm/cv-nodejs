# civicrm-cv (nodejs binding)

This is a wrapper for interacting with a local CiviCRM instance (in the
current folder).  You may call [`cv`](https://github.com/civicrm/cv)
sub-commands such as `api`, `url`, `vars:show`, or `php:eval`.

It aims to be a shim enabling `grunt`, `gulp`, `protractor` or other
node-based CLI tools to manipulate the local Civi site (without any extra configuration
or hard-coded paths).

## Requirements

Install [`cv`](https://github.com/civicrm/cv) somewhere in the `PATH`.

Check that `cv` works with your local build (e.g. run `cv api system.get` or ``cv api system.get -vvv`).

## Installation

```
npm install civicrm/cv-nodejs --save
```

## Usage: cv()

Use the main `civicrm-cv` helper to call `cv` subcommands.  Results may be
returned as promises:

```javascript
// Call the Contact.get API for contact #100. Return a promise.

var cv = require('civicrm-cv')({mode: 'promise'});
cv('api contact.get id=100').then(function(result){
  console.log("Found records: " + result.count);
});
```

Alternatively, you may execute subcommands synchronously:

```javascript
// Lookup the general site metadata. Return the data synchronously (blocking I/O).

var cv = require('civicrm-cv')({mode: 'sync'});
var result = cv('vars:show');
console.log("The Civi database is " + result.CIVI_DB_DSN);
console.log("The CMS database is " + result.CMS_DB_DSN);
```

Note that the previous examples specify the full subcommand (i.e.  all
options are passed in one string).  If wish you to break them up, pass an
array.  Each array item will be automatically escaped.

This is particularly useful with the `php:eval` subcommand -- which often
involves passing unusual characters, e.g.

```javascript
// Execute a small fragment of PHP code. Return the data synchronously (blocking I/O).

var cv = require('civicrm-cv')({mode: 'sync'});
var result = cv(['php:eval', '$x = 2; return [$x * $x];']);
console.log("Received value: " + result);
```

## Usage: cvRes

`civicrm-cv` provides access to the local CiviCRM instance. If there are any
resource files (such as CSS or JS) provided by CiviCRM, you can access them
with through `resources`:

```javascript
var cvRes = require('civicrm-cv/resources')();
console.log('The CiviCRM copy of lodash is: ', cvRes.getPath('civicrm', 'bower_components/lodash-compat/lodash.js'));
cvRes.require('civicrm', 'bower_components/lodash-compat/lodash.js');
```

## Testing

```
npm test
```

## Comparison

Depending on the use-case, you may be better served with Xavier Dutoit's https://www.npmjs.com/package/civicrm . For comparison:

 * The `civicrm` package goes through the REST API. It works remotely and requires login credentials. It can take advantage of load-balancers, opcode caching, etc. It focuses on APIv3. It’s probably intended for data-integrations.

 * The `civicrm-cv` package starts Civi via CLI. It works locally and can autodiscover the site. It includes some API support (`api contact.get id=3`) — but it can also execute PHP code and load metadata about the site-build. It’s intended more for testing and site-building.
