var models =require ('../models/models.js');
//autoload

exports.load =function(req,res,next ,quizId){
  models.Quiz.find({
      where: {id: Number(quizId)},
      include: [{model: models.Comment}]
    }).then(
    function(quiz){
      if(quiz){
        req.quiz =quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId));}
    }
  ).catch(function(error){ next(error);});
}

// GET/quizes/index
exports.index = function(req,res){
  if (req.query.search!= null){
    var search =("%" + req.query.search + "%").replace(/\s/g,"%");
    models.Quiz.findAll({where:["pregunta like?",search]}).then(function(quizes){
      res.render('quizes/index.ejs', {quizes:quizes, errors:[]});
    }).catch(function(error){ next(error);});
  } else {
    models.Quiz.findAll().then(function(quizes){
      res.render('quizes/index.ejs', {quizes:quizes, errors:[]});
    }).catch(function(error){ next(error);});
  }

};

// GET/quizes/show

exports.show = function(req,res){
  models.Quiz.find(req.params.quizId).then(function(quiz){
    res.render('quizes/show', {quiz: req.quiz, errors:[]});
  })
};
//GEWT/quizes/answer
exports.answer = function(req,res){
  var resultado ="Incorrecto";
  models.Quiz.find(req.params.quizId).then(function(quiz){
    if (req.query.respuesta === req.quiz.respuesta){
      resultado= "Correcto"
    }
    res.render('quizes/answer',{quiz:quiz,respuesta:resultado, errors:[]});
  })
};
exports.new = function(req,res){
  var quiz = models.Quiz.build(
    {pregunta:"Pregunta", respuesta: "Respuesta",tema: "Tema"}
  );
  res.render('quizes/new', {quiz:quiz, errors:[]});
};

exports.create = function(req,res){
  var quiz = models.Quiz.build(req.body.quiz);
  var errors = quiz.validate();
  if (errors){
    var i=0;
    var errores= new Array();
    for (a in errors){
      errores[i++]= {message:errors[a]};
    }
    res.render('quizes/new', {quiz: quiz, errors: errores});
  } else{
    quiz.save({fields:["pregunta", "respuesta","tema"]}).then(function(){
    res.redirect('/quizes')})
  }
};
exports.edit = function(req,res){
  var quiz = req.quiz;
  res.render ('quizes/edit', {quiz: quiz, errors: []});
};
exports.update =function(req,res){
  req.quiz.pregunta =req.body.quiz.pregunta;
  req.quiz.respuesta =req.body.quiz.respuesta;
  req.quiz.tema =req.body.quiz.tema;
  errors = req.quiz.validate();
  if (errors){
    var i=0;
    var errores= new Array();
    for (a in errors){
      errores[i++]= {message:errors[a]};
    }
    res.render('quizes/new', {quiz: quiz, errors: errores});
  } else {
    req.quiz
    .save( {fields:["pregunta", "respuesta", "tema"]})
    .then(function(){res.redirect('/quizes');});
  }
};
exports.destroy = function(req,res){
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
exports.author = function (req,res){
  var errores= new Array();
  res.render('author', {errors:errores});
};
