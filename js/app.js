/**
 * @fileoverview About this file
 */


ydn.debug.log('ydn.db', 'fine');
var db_name = 'sample-crypt-1';
var schema = {stores: [
  {
    name: 'st',
    encrypted: true
  }
]};
var db;
function loadDb() {
  var secrets = [];
  var key1 = document.getElementById('key1').value;
  var key2 = document.getElementById('key2').value;
  var passphase1 = document.getElementById('passphase1').value;
  var passphase2 = document.getElementById('passphase2').value;
  if (key1 && passphase1) {
    secrets.push({
      key: key1,
      passphase: passphase1
    });
  }
  if (key2 && passphase2) {
    secrets.push({
      key: key2,
      passphase: passphase2
    });
  }
  var options = {
    Encryption: {
      secrets: secrets
    }
  };
  db = new ydn.db.Storage(db_name, schema, options);
  db.onReady(function() {
    status('db ' + db_name + ' ready');
    showAll();
  });
}

function status(msg) {
  document.getElementById('msg').textContent = msg;
}

function showAll() {
  db.keys('st').done(function(keys) {
    db.values('st').done(function(values) {
      var html = '<ul>';
      for (var i = 0; i < keys.length; i++) {
        html += '<li><detail><summary>' + keys[i] + '</summary>' +
            JSON.stringify(values[i]) + '</detail></li>';
      }
      document.getElementById('listing').innerHTML = html;
    });
  });
}

function addRecord() {
  var id = document.getElementById('id').value;
  var value = document.getElementById('value').value;
  if (id && value) {
    var obj = {value: value};
    db.put('st', obj, id).done(function(x) {
      status(x + ' added');
      showAll();
    });
  } else if (!id) {
    status('record id must be specified.')
  } else {
    status('record value must be specified.')
  }
}

function getRecord() {
  var id = document.getElementById('get-id').value;
  if (id) {
    db.get('st', id).done(function(x) {
      if (x) {
        document.getElementById('listing').textContent = JSON.stringify(x);
      } else {
        document.getElementById('listing').textContent = id + ' not found';
      }
    });
  } else {
    status('record id must be specified.')
  }

}

function clear() {
  db.clear('st').done(function() {
    status('cleared');
    showAll();
  });
}
