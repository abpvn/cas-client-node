#CAS client node
###A cas client for nodejs

###Installation
```npm i cas-client-node --save```

###Example
```
import express from 'express';
import CAS from 'cas-client-node';
import session from 'express-session';
const port=80;
server=express();
const cas = CAS({
    cas_host: 'https://cas-server.com/cas',
    service: 'http://localhost/sso'
});
server.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))
server.get('/sso', cas.auth, async(req, res, next)=> {
    if (req.user) {
        let expires = new Date();
        expires.setDate(expires.getDate() + 90);
        res.cookie('user', req.user, {expires: expires});
        if (req.headers.referer)
            res.redirect(req.headers.referer);
        else res.redirect('/');
    }
    else {
        res.status(200).send('An error occur when login');
    }
});
server.get('/users/logout', cas.logout, async(req, res, next)=> {
    res.cookie('user', null, {expires: new Date(Date.now() - 1000)});
    res.redirect('/?ref=logout');
});
server.listen(port, () => {   
    console.log(`The server is running at http://localhost:${port}/`);
});
```

---
Made with ♥ by hoangrio