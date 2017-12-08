var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');

var ArticleSchema = mongoose.Schema({
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    title: String,
    description: String,
    body: String,
    favoritesCount: {
        type: Number,
        default: 0
    },
    tagList: [{ type: String }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

}, { timestamps: true });

mongoose.plugin(uniqueValidator, { message: 'is Already Taken' });

ArticleSchema.pre('validate', function (next) {
    this.slugify();
    next();
});

ArticleSchema.methods.toJSONFor = function (user) { 
    return {
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        tagList: this.tagList,
        favoritesCount: this.favoritesCount,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: this.author.toProfileJSONFor(user),  
    };
}
