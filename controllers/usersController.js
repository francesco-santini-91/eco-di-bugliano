const User = require('../models/user');
const Article = require('../models/article');
const jwt = require('jsonwebtoken');
const { findOne } = require('../models/user');

exports.getUsersList_GET = async function(request, response, next) {
    /* Viene restituita la lista degli utenti, ordinata in ordine di importanza */
    await User
        .find({}, 'username isAdmin isSuperUser')
        .sort({'isSuperUser': -1, 'isAdmin': -1})
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                var NoResults = new Error('Nessun utente!');
                NoResults.status = 444;
                return next(NoResults);
            }
            response.json(results);
        });
}

exports.getUserDetails_GET = async function(request, response, next) {
    await User
        .findOne({'username': request.params.userId})
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                var NotFound = new Error('Utente non trovato!');
                NotFound.status = 404;
                return next(NotFound); 
            }
            response.json(results);
        })
}

exports.getArticlesByAuthor_GET = async function(request, response, next) {
    await Article
        .find({'author': request.params.userId}, '_id title subtitle imageURL author')
        .sort({'pubblication': -1})
        .exec(function (errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                var NoResults = new Error('Nessun articolo per questo autore!');
                NoResults.status = 404;
                return next(NoResults);
            }
            response.json(results);
        })
}

exports.createNewUser_GET = async function(request, response, next) {

}

exports.createNewUser_POST = async function(request, response, next) {
    await User
        .findOne({'username': request.body.username})
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                await jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
                    if (errors) {
                        return next(errors);
                    }
                    if(decoded.isSuperUser) {
                        var newUser = new User(
                            {
                                username: request.body.username,
                                password: request.body.password,
                                isAdmin: request.body.isAdmin,
                                isSuperUser: request.body.isSuperUser
                            }
                        );
                            newUser.save(function(errors) {
                                if(errors) {
                                    return next(errors);
                                }
                                response.json({created: true});
                            });
                    }
                    else {
                        response.json({unhautorized: true});
                    }
                });
            }
            else {
                response.json({userAlreadyExist: true});
            }
        });
    }


exports.editUser = async function(request, response, next) {
    await User
        .findOne({'username': request.params.userId})
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                var NoResults = new Error('Utente non trovato!');
                NoResults.status = 404;
                return next(NoResults);
            }
            await jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
                if (errors) {
                    return next(errors);
                }
                if(decoded.username == results.username) { 
                    results.username = request.body.username;
                    results.password = request.body.password;
                    results.isAdmin = request.body.isAdmin;
                    results.isSuperUser = request.body.isSuperUser;
                    await results.save(function(errors) {
                        if(errors) {
                            return next(errors);
                        }
                        response.json({success: true});
                    });
                }
                else if(decoded.isSuperUser == true) {
                    results.username = request.body.username;
                    results.isAdmin = request.body.isAdmin;
                    results.isSuperUser = request.body.isSuperUser;
                    await results.save(function(errors) {
                        if(errors) {
                            return next(errors);
                        }
                        response.json({success: true});
                    });
                }
                else {
                    response.json({unhautorized: true});
                }
            });
});
}

exports.deleteUser = async function(request, response, next) {
    await jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.username == request.params.userId || decoded.isSuperUser == true) {
            await User
            .findOneAndDelete({'username': request.params.userId})
            .exec(function(errors, results) {
                if(errors) {
                    return next(errors);
                }
                if(results == null) {
                    var NotFound = new Error('Utente non trovato!');
                    NotFound.status = 404;
                    return next(NotFound);
                }
                response.json({deleted: true});
            });
        }
        else {
            response.json({unhautorized: true});
        }
    });
    
}
