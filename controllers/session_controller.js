exports.loginRequerided = function (req, res, next){
  if (req.session.user){
    next();
  } else {
    res.redirect('/login');
  }
};
exports.new = function(req,res){
  var errors = req.session.errors || {};
  req.session.errors={};
  res.render ('sessions/new.ejs', {sesion:"normal",errors:errors});
};
 exports.create = function(req,res){
   var login = req.body.login;
   var password = req.body.password;
   var userController = require('./user_controller');
   userController.autenticar(login, password,function(error,user){
     if(error){
       req.session.errors =[{"message":'se ha producido un error: ' + error}];
       res.redirect("/login");
       return;
     }
     fecha = new Date();
     req.session.user ={id:user.id, username: user.username,fecha:fecha.getTime()};
     res.redirect(req.session.redir.toString());
   });
 };
 exports.destroy = function (req,res) {
   delete req.session.user;
   res.redirect(req.session.redir.toString());
 };
