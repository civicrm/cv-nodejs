## node-civicrm-cv

This is a wrapper for interacting with a local CiviCRM instance (in the
current folder).  You may call `cv` subcommands such as `api` or `url`

By default, results are returned as promises:

```javascript
var cv = require('civicrm-cv')({mode: 'promise'});
cv('api contact.get id=1').then(function(result){
  console.log("Found records: " + result.count);
});
```

Alternatively, you may execute subcommands synchronously:

```javascript
var cvSync = require('civicrm-cv')({mode: 'sync'});
var result = cvSync('api contact.get id=1');
console.log("Found records: " + result.count);
```

Note that the previous examples specify the full subcommand all options as
one string. If wish you to break them up, pass an array. Each item will be
escaped.

```javascript
var cvSync = require('civicrm-cv')({mode: 'sync'});
var result = cvSync(['api', 'contact.get', 'id=1']);
console.log("Found records: " + result.count);
```
