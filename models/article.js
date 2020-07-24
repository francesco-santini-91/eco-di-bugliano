var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const articleSchema = new Schema(
    {
        id: {
            type: String
        },
        title: {
            type: String
        },
        subtitle: {
            type: String
        },
        imageURL: {
            type: String
        },
        imageCaption: {
            type: String
        },
        content: {
            type: String
        },
        author: {
            type: String
        },
        category: {
            type: String
        },
        pubblication: {
            type: Date
        },
        likes: {
            type: Number
    }
});

articleSchema
    .virtual('url')
    .get(function () {
        return '/articles/' + this.title;
    });

module.exports = mongoose.model('Article', articleSchema);