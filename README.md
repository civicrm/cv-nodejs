## civicrm-cv-node

This is a wrapper for interacting with a local CiviCRM instance (in the
current folder).  You may call `cv` subcommands such as `api`, `vars:show`,
or `url`.

Results may be returned as promises:

```javascript
var cv = require('civicrm-cv')({mode: 'promise'});
cv('api contact.get id=1').then(function(result){
  console.log("Found records: " + result.count);
});
```

Alternatively, you may execute subcommands synchronously:

```javascript
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
var cv = require('civicrm-cv')({mode: 'sync'});
var result = cv(['php:eval', '$x = 2; return [$x * $x];']);
console.log("Received value: " + result);
```
