var bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.loginPage_GET = async function(request, response, next) {

}

exports.loginPage_POST = async function(request, response, next) {
    /* Viene ricercato il profilo utente nel database in base allo username inserito */
    var privateKey = process.env.SECRET_KEY.replace(/\\n/gm, '\n');
    await User
        .findOne({'username': request.body.username})
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                /* L'utente inserito non è presente nel database, viene inviato l'errore al client */
                response.json({userNotFound: true});
            }
            else {
                /* L'utente esiste, si procede alla decriptazione dell'hash della password contenuta nel database */
                bcryptjs.compare(request.body.password, results.password, function(errors, comparison) {
                    if(errors) {
                        return next(errors);
                    }
                    if(comparison) {
                        /* La password inserita corrisponde, si procede con la generazione di un token JWT */
                        jwt.sign(
                            {
                                /* PAYLOAD del token */
                                id: results._id,
                                username: results.username,
                                isAdmin: results.isAdmin,
                                isSuperUser: results.isSuperUser
                            },
                            privateKey,
                            {expiresIn: process.env.JWT_EXPIRATION},  /* Il token ha validità di un'ora */
                            function(errors, token) {
                                if(errors) {
                                    return next(errors);
                                }
                                response.json({token});     /* Il token viene inviato al client, il quale lo salverà nel sessionStorage */
                            }       
                        );
                }
                    else {
                        /* L'utente è presente ma la password non corrisponde */
                        response.json({error: "Password errata!"});
                    }
                });
            }
            });
}

exports.verifyAuthentication_POST = async function(request, response, next) {
    /* Endpoint di verifica della validità dei token JWT generati dalle funzioni di login */
    await jwt.verify(request.body.token, process.env.SECRET_KEY, function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        response.json({valid: true, decoded: decoded});
        /* Il token inviato è valido, viene inviato al client un segname di conferma ed il payload decodificato del token */
    });
}