/**
 * Created by Hoàng on 05/07/2016.
 */
import fetch from 'node-fetch';
let cas_host;
let service;
const CAS = (options)=> {
    cas_host = options.cas_host.replace('/login', '');
    service = options.service;
    return CAS;
};
CAS.auth = async(req, res, next)=> {
    if (req.user) {
        next();
    }
    else {
        let ticket = req.query.ticket;
        if (ticket) {
            let re = await fetch(cas_host + '/serviceValidate?service=' + service + '&ticket=' + ticket);
            let data = await re.text();
            let list_user = data.match(/(<cas:user>)(.+?)(<\/cas:user>)/i);
            let user = list_user[0];
            user = user.replace('<cas:user>', '');
            user = user.replace('<\/cas:user>', '');
            req.user = user;
            next();
        }
        else {
            res.redirect(cas_host + '/login?service=' + service);
        }
    }
};
CAS.logout = async(req, res, next)=> {
    let url = cas_host + '/logout';
    fetch(url);
    req.user = null;
    next();
};
export default CAS;