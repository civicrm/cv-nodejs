describe("civicrm-cv resource api", function() {
  var cvRes = require('../resources.js')();

  it('loads resources from CiviCRM extensions', function(done) {
    var lodash = cvRes.require('civicrm', 'bower_components/lodash-compat/lodash.js');
    var x = lodash.extend({}, {a: 1}, {b: 2});
    expect(x.a).toBe(1);
    expect(x.b).toBe(2);
    done();
  });

});

