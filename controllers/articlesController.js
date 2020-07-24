const Article = require('../models/article');
const jwt = require('jsonwebtoken');

const articlesPerPage = 5;  // Da impostare anche nelle funzioni lato client per implementare la paginazione

exports.getArticlesList_GET = async function(request, response, next) {
    /* La funzione restituisce la lista di tutti gli articoli presenti nel database.
     * Vengono restituiti 10 articoli per ogni pagina, ordinati dal più recente. */
    var articlesLimit = articlesPerPage;
    if(request.query.page == undefined) {
        articlesLimit = 10000;
    }
    await Article
        .find({},'id title subtitle imageURL imageCaption content author category pubblication likes url')
        .sort({'pubblication': -1})     // '-1' --> Ordine di pubblicazione dal più recente
        .skip((request.query.page - 1) * articlesPerPage)
        .limit(articlesLimit)
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            response.json(results);
        });
}

exports.getArticlesListByCategory_GET = async function(request, response, next) {
    /* Vengono restituiti gli articoli appartenenti alla categoria richiesta, ordinati dal più recente */
    await Article
        .find({'category': request.params.category}, 'id title subtitle imageURL imageCaption content author category pubblication likes url')
        .sort({'pubblication': -1})     // '-1' --> Ordine di pubblicazione dal più recente
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            response.json(results);
        });

}

exports.createArticle_GET = async function(request, response, next) {

}

exports.createArticle_POST = async function(request, response, next) {
    /* La funzione crea un nuovo articolo, impostando come data di pubblicazione quella dell' invio al server */
    var newArticle = new Article(
        {
            id: request.body.id,
            title: request.body.title,
            subtitle: request.body.subtitle,
            imageURL: request.body.imageURL,
            imageCaption: request.body.imageCaption,
            content: request.body.content,
            author: request.body.author,
            category: request.body.category,
            pubblication: Date.now(),
            likes: 0        // I likes vengono inizializzati a 0.
        }
    );
    await newArticle.save(function(errors) {
        if(errors) {
            return next(errors);
        }
        response.json({published: true});
    });

}

exports.getArticlesCount = async function(request, response, next) {
    /* La funzione restituisce il numero totale degli articoli pubblicati, in modo da creare, per il successivo, un id sequenziale*/
    await Article.countDocuments({})
        .exec(function (errors, results) {
            if(errors) {
                return next(errors);
            }
            response.json({totalArticles: results + 1});
        });
}

exports.getArticle_GET = async function(request, response, next) {
    /* Restituisce l'articolo passato come parametro nell' URL */
    await Article
        .findOne({'title': request.params.title}, 'id title subtitle imageURL imageCaption content author category pubblication likes url')
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                var NoResults = new Error('Articolo non trovato!');
                NoResults.status = 404;
                return next(NoResults);
            }
            response.json(results);
        });
}

exports.editArticle = async function(request, response, next) {
    /* La modifica sarà effettuata sull'articolo il cui titolo è passato come argomento dell'URL */
    await Article
        .findOne({'title': request.params.title})
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                var NoResults = new Error('Articolo non trovato!');
                NoResults.status = 404;
                return next(NoResults);
            }
            await jwt.verify(request.body.token, process.env.SECRET_KEY, async function (errors, decoded) {
                /* Viene verificato il token inviato dal client */
                if(errors) {
                    return next(errors);
                }
                if(decoded.username == results.author || decoded.isSuperUser == true) {
                    /* Il server consentirà la modifica dell'articolo solamente all'AUTORE o ad un utente SUPER USER */
                    results.id = request.body.id;
                    results.title = request.body.title;
                    results.subtitle = request.body.subtitle;
                    results.imageURL = request.body.imageURL;
                    results.imageCaption = request.body.imageCaption;
                    results.content = request.body.content;
                    results.author = request.body.author;
                    results.category = request.body.category;
                    results.pubblication = results.pubblication;
                    results.likes = results.likes;
                    await results.save(function(errors) {
                        if(errors) {
                            return next(errors);
                        }
                    });
                    response.json({edited: true});
                }
                else {
                    response.json({unhautorized: true});
                }
                    });
        });
}

exports.likeToArticle = async function(request, response, next) {
    /* La funzione incrementa il numero dei like ricevuti dall'articolo e li salva nel database */
    await Article
        .findOne({'title': request.params.title})
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                var NoResults = new Error('Articolo non trovato!');
                NoResults.status = 404;
                return next(NoResults);
            }
            results.likes = results.likes + 1;
            /* Viene recuperato il valore dei like e dopo averlo incrementato di uno viene salvato  */
            results.save(function (errors) {
                if(errors) {
                    return next(errors);
                }
                response.json({likes: results.likes});
                /* Viene inviato al client il valore aggiornato dei like */
            });
        });
}

exports.deleteArticle = async function(request, response, next) {
    /* La funzione eliminerà l'articolo il cui titolo è passato nell'URL */
    await Article
    .findOne({'title': request.params.title})
    .exec(async function(errors, results) {
        if(errors) {
            return next(errors);
        }
        if(results == null) {
            var NotFound = new Error('Articolo non trovato');
            NotFound.status = 404;
            return next(NotFound);
        }
        await jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
            /* Viene verificata la validità del token inviato dal client */
            if(errors) {
                return next(errors);
            }
            if(decoded.username == results.author || decoded.isSuperUser == true) {
                /* La cancellazione dell'articolo è consentita solamente all'AUTORE o ad un'utente SUPER USER */
                results.deleteOne(function (errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({deleted: true});
                }); 
            }
            else {
                response.json({unhautorized: true});
            }
        });
    });
}