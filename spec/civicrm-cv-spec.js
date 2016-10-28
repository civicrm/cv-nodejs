describe("civicrm-cv promise api", function() {
  var cv = require('../civicrm-cv.js')();

  it('calls API functions', function(done) {
    cv.api('Contact', 'get', {rowCount: 1}).then(function(result){
      expect(result.count).toBe(1);
      done();
    });
  });

  it('returns a URL for the dashboard', function(done) {
    cv.url('civicrm/dashboard?reset=1').then(function(dashboardUrl) {
      expect(dashboardUrl).toMatch(/^https?:.*dashboard.*reset=1/);
      done();
    })
  });

  it('shows site variables', function(done) {
    cv.varsShow()
      .then(function(vars) {
        expect(vars.CIVI_UF).toBeDefined();
        expect(vars.CIVI_DB_DSN).toMatch(/^mysql:/);
        done();
      })
    ;
  });

  it('evaluates PHP code', function(done) {
    cv.phpEval('return array("ab"=>"123", \'c\\\'"d\' => 456);').then(function(result) {
      expect(result.ab).toBe("123");
      expect(result['c\'"d']).toBe(456);
      done();
    });
  });

});

describe("civicrm-cv synchronous api", function() {
  var cv = require('../civicrm-cv.js')({mode: 'sync'});

  it('calls API functions', function() {
    var result = cv.api('Contact', 'get', {rowCount: 1});
    expect(result.count).toBe(1);
  });

  it('returns a URL for the dashboard', function() {
    var dashboardUrl = cv.url('civicrm/dashboard?reset=1');
    expect(dashboardUrl).toMatch(/^https?:.*dashboard.*reset=1/);
  });

  it('shows site variables', function() {
    var vars = cv.varsShow();
    expect(vars.CIVI_UF).toBeDefined();
    expect(vars.CIVI_DB_DSN).toMatch(/^mysql:/);
  });

  it('evaluates PHP code', function() {
    var result = cv.phpEval('return array("ab"=>"123", \'c\\\'"d\' => 456);');
    expect(result.ab).toBe("123");
    expect(result['c\'"d']).toBe(456);

    var result = cv.phpEval('return "\$\'"');
    expect(result).toBe("$'");

    var result = cv.phpEval('return "\\""');
    expect(result).toBe("\"");

    var result = cv.phpEval('$x = \'"\'; return [$x . 123 . $x];');
    expect(result[0]).toBe('"123"');
  });

});
