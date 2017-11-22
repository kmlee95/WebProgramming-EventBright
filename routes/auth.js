module.exports = (app, passport) => {
  app.get('/signin', (req, res, next) => {
    res.render('signin');
  });

  app.post('/signin', passport.authenticate('local-signin', {
    successRedirect : '/questions', // redirect to the secure profile section
    failureRedirect : '/signin', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));
//페이스북 로그인
  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope : 'email' })
  );
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect : '/signin',
      failureFlash : true // allow flash messages
    }), (req, res, next) => {
      req.flash('success', 'Welcome!');
      res.redirect('/questions');
    }
  );

  
//카카오톡 로그인
  app.get('/auth/kakao',
    passport.authenticate('kakao-login')
  );
  app.get('/auth/kakao/callback',
    passport.authenticate('kakao-login', {
      failureRedirect : '/signin',
      failureFlash : true // allow flash messages
    }), (req, res, next) => {
      req.flash('success', 'Welcome!');
      res.redirect('/questions');
    }
  );


  //로그아웃
  app.get('/signout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully signed out');
    res.redirect('/');
  });

};

