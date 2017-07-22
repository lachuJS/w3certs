var pool = require('./mysql-pool');
var institution = new Object();

institution.findByCred = function(username, password, done) {
    pool.query(`select id, name, address from institution where user_name="${username}" 
    and password="${password}"`,function (err, rows) {
        if(err) return done(err);
        done(null,rows[0]);
    });
}
institution.findById = function(id,done) {
    pool.query(`select id,name,address from institution where id="${id}"`, function (err, rows) {
        if(err) return done(err);
        done(null, rows[0]);
    });
}
institution.allIssuers = function(institutionId, done) {
    pool.query(`select address, name from issuer where institution_id="${institutionId}"`, function (err, rows, fields) {
        if(err) return done(err);
        done(null, rows);
    });
}
institution.issuer = function (issuerId, done) {
    pool.query(`select id, logo, sign from issuer where address="${issuerId}"`, function (err, rows) {
        if(err) return done(err);
        done(null, rows[0])
    });
}
institution.recentIssued = function (issuerId, done) {
    pool.query(`select txHash from certs join issuer on 
        certs.issuer_id=issuer.id where issuer.institution_id="${issuerId}"`, function (err, rows) {
        if(err) return done(err);
        //to array
        let txHashes = [];
        for(var i = 0;i < rows.length; i++) {
            txHashes.push(rows[i].txHash);
        }
        done(null,txHashes);
    });
}
institution.issue = function (institutionId, cert, done) {
    pool.query(`insert into certs values(null,${institutionId},"${cert.regNo}","${cert.name}","${cert.percentile}",
    "${cert.txHash}","${cert.certKey}",null)`, function (err, rows) {
        if(err) return done(err);
        done(null, rows.insertId);
    });
}
institution.cert = function (txHash, done) {
    pool.query(`select reg_no as regNo, name, percentile, txHash, cert_key as certKey,
    timestamp from certs where txHash="${txHash}"`, function (err, rows) {
        if(err) return done(err);
        done(null, rows[0]);
    })
}

module.exports = institution;