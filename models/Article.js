var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');

var ArticleSchema = new mongoose.Schema({
  slug: {type: String, lowercase: true, unique: true},
  title: String,
  description: String,
  body: String,
  favoritesCount: {type: Number, default: 0},
  comments : [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  tagList: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

ArticleSchema.plugin(uniqueValidator, {message: 'is already taken'});

ArticleSchema.pre('validate', function(next){
  this.slugify();

  next();
});

ArticleSchema.methods.slugify = function() {
  this.slug = slug(this.title);
};

ArticleSchema.methods.toJSONFor = function(user){
  return { 
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user)
  };
};

ArticleSchema.methods.updateFavoritesCount = function(){
    var article = this;
    return User.count({ favorites: {$in: [article._id] }}).then(function(count){
        article.favoritesCount = count;
        return article.save();
    })

}
mongoose.model('Article', ArticleSchema);