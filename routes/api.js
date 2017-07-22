var express = require('express');
var router = express.Router();
var mysql = require('../bin/mysql-pool');

//get recent certs
router.get('/cert/recent',function (req, res, next) {
    mysql.query(`select txHash from certs order by timestamp desc limit 10`, function (err, rows) {
        if(err) return next(err);
        res.json(rows);
    });
});
//get cert
router.get('/cert/:txHash',function (req, res, next) {
    mysql.query(`select certs.reg_no as regNo, certs.name, certs.percentile, certs.txHash, certs.cert_key as certKey,
    certs.timestamp, issuer.logo, issuer.sign, issuer.address as issuer from certs join issuer on certs.issuer_id=issuer.id
     where certs.txHash="${req.params.txHash}"`,function (err, rows) {
        if(err) return next(err);
        console.log(rows);
        res.json(rows[0]);
    });
});
//post cert
router.post('/cert',function (req, res, next) {
    if(req.user) {    
        let cert = req.body;
        console.log(cert);
        mysql.query(`select id from issuer where address="${cert.issuer}"`,function (err, rows) {
            if(err) return next(err);
            let issuerId = rows[0].id;
            console.log(issuerId);
            mysql.query(`insert into certs values(null,${issuerId},"${cert.regNo}","${cert.name}","${cert.percentile}",
                "${cert.txHash}","${cert.certKey}",null)`,function (err, result) {
                if(err) return next(err);
                res.json({insertId: result.insertId});
            });
        });
    }
    else {
        res.sendStatus(403);
    }
});

module.exports = router;
