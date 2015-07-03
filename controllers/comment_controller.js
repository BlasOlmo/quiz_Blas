var models = require('../models/models.js');

exports.new = function(req,res){
  res.render('comments/new.ejs',{quizid:req.params.quizId, errors:[]});
};

exports.create = function(req,res){
  var comment = models.Comment.build(
    { texto: req.body.comment.texto,
      QuizId:req.params.quizId
    });
    var error =comment.validate()
    if(error){
      var i=0;
      var errores= new Array();
      for (a in errors){
        errores[i++]= {message:errors[a]};
      }
      res.render('comments/new.ejs',
      {comment: comment, quizid:req.params.quizId, errors:errores});
    } else {
      comment
      .save()
      .then(function(){ res.redirect('/quizes/'+req.params.quizId)})
    }
};
