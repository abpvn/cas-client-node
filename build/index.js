'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Created by Hoàng on 05/07/2016.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */


let cas_host;
let service;
let CAS = options => {
    cas_host = options.cas_host.replace('/login', '');
    service = options.service;
    return CAS;
};
CAS.auth = (() => {
    var _ref = _asyncToGenerator(function* (req, res, next) {
        if (req.user) {
            next();
        } else {
            let ticket = req.query.ticket;
            if (ticket) {
                let re = yield (0, _nodeFetch2.default)(cas_host + '/serviceValidate?service=' + service + '&ticket=' + ticket);
                let data = yield re.text();
                let list_user = data.match(/(<cas:user>)(.+?)(<\/cas:user>)/i);
                let user = list_user[0];
                user = user.replace('<cas:user>', '');
                user = user.replace('<\/cas:user>', '');
                req.user = user;
                next();
            } else {
                res.redirect(cas_host + '/login?service=' + service);
            }
        }
    });

    return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
})();
CAS.logout = (() => {
    var _ref2 = _asyncToGenerator(function* (req, res, next) {
        let url = cas_host + '/logout';
        (0, _nodeFetch2.default)(url);
        req.user = null;
        next();
    });

    return function (_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
    };
})();
exports.default = CAS;