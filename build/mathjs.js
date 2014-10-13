/*
 * Utilities.
 *
 * Copyright (c) 2013 Kazuya Hiruma
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author   Kazuya Hiruma (http://css-eblog.com/)
 * @version  0.0.1
 */
(function (win, doc, ns, undefined) {

'use strict';

var objProto = Object.prototype,
    arrProto = Array.prototype,
    arrSlice = arrProto.slice,
    toString = objProto.toString;


/**
 * @namespace
 */
var util = {};

/* ----------------------------------------------------------------------------------------------
    FOR CHECKING UTILITES
------------------------------------------------------------------------------------------------- */
function hasProp(obj, prop) {
    return objProto.hasOwnProperty.call(obj, prop);
}

function isObject(obj) {
    return toString.call(obj) === '[object Object]';
}

function isFunction(obj) {
    return toString.call(obj) === '[object Function]';
}

function isString(obj) {
    return toString.call(obj) === '[object String]';
}

function isNumber(obj) {
    return toString.call(obj) === '[object Number]';
}

function isBoolean(obj) {
    return toString.call(obj) === '[object Boolean]';
}

function isNull(obj) {
    return obj === null;
}

function isUndefined(obj) {
    return obj === undefined;
}

var isArray = Array.isArray || function (obj) {
    return toString.call(obj) === '[object Array]';
};

function isReference(obj) {
    return (isFunction(obj) || isArray(obj) || isObject(obj));
}



function isEmpty(obj) {

    var key;

    if (isFunction(obj)) {
        return false;
    }
    else if (isNumber(obj)) {
        return obj === 0;
    }
    else if (isArray(obj) || isString(obj)) {
           return obj.length === 0;
    }
    else if (isNull(obj)) {
        return true;
    }
    else if (isUndefined(obj)) {
        return true;
    }
    else if (isBoolean(obj)) {
        return !obj;
    }

    for (key in obj) if (hasProp(obj, key)) {
        return false;
    }

    return true;
}

/**
 * Bind function to context.
 */
function bind(func, context) {
    return function () {
        func.apply(context, arguments);
    };
}

function each (arr, func) {
    if (!isArray(arr)) {
        return false;
    }

    if (arr.forEach) {
        arr.forEach(func);
    }
    else {
        for (var i = 0, l = arr.length; i < l; i++) {
            func(arr[i], i);
        }
    }
}

function every (arr, func) {
    if (!isArray(arr)) {
        return false;
    }

    if (arr.every) {
        return arr.every(func);
    }
    else {
        for (var i = 0, l; i < l; i++) {
            if (!func(arr[i], i, arr)) {
                return false;
            }
        }

        return true;
    }
}

function some (arr, func) {
    if (!isArray(arr)) {
        return false;
    }

    if (arr.some) {
        return arr.some(func);
    }
    else {
        for (var i = 0, l; i < l; i++) {
            if (func(arr[i], i)) {
                return true;
            }
        }

        return false;
    }
}

function filter (arr, func) {
    if (!isArray(arr)) {
        return false;
    }

    var ret = [];

    if (arr.filter) {
        return arr.filter(func);
    }
    else {
        for (var i = 0, l; i < l; i++) {
            if (func(arr[i], i)) {
                ret.push(arr[i]);
            }
        }

        return ret;
    }
}

function clone(obj) {

    var ret  = null;

    if (isObject(obj)) {
        ret = {};

        for (var key in obj) {
            if (isReference(obj[key])) {
                ret[key] = clone(obj[key]);
            }
            else {
                ret[key] = obj[key];
            }
        }
    }
    else if (isArray(obj)) {
        ret = [];

        for (var i = 0, l = obj.length; i < l; i++) {
            if (isReference(obj[i])) {
                ret.push(clone(obj[i]));
            }
            else {
                ret.push(obj[i]);
            }
        }
    }
    else if (isFunction(obj)) {
        var tmp = obj.toString().replace(/[\r\n]*/gm, ''),
            match = tmp.match(/function\s*(.*?)\s*\((.*?)\)\s*{(.*?)}/i),
            name = match[1],
            argList = match[2].replace(/\s+/g, ''),
            contents = match[3];

        ret = new Function(argList, contents);
    }
    else {
        ret = obj;
    }

    return ret;
}


/**
 * copy arguments object properties to `obj`
 * @param {Object} obj base to be copy of properties.
 */
function copyClone(obj) {

    var args  = arrProto.slice.call(arguments, 1),
        force = false,
        src;

    if (isBoolean(args[args.length - 1])) {
        force = args.pop();
    }

    for (var i = 0, l = args.length; i < l; i++) {
        src = args[i];

        for (var prop in src) {
            if (force || !obj[prop]) {
                obj[prop] = args[i][prop];
            }
        }
    }

    return obj;
}

/**
 * Make a new array.
 * @param {Array} arr
 * @returns {Array} A new array object.
 */
function makeArr(arr) {
    return arrSlice.call(arr);
}

/**
 * Gives you indexOf function.
 * If browser gives you this method, return value with native function.
 * @param {Array} arr target array.
 * @param {*} item target item.
 */
function indexOf (arr, item) {
    if (arr.indexOf) {
        return arr.indexOf(item);
    }
    else {
        for (var i = 0, l = arr; i < l; ++i) if (arr[i] === item) return i;
    }
    return -1;
}

/**
 * Make HTML node with html text.
 * @param {string} html
 */
function makeHTMLNode(html) {
    var range = null,
        node  = null;

    if (html instanceof HTMLElement) {
        return html;
    }

    range = doc.createRange();
    range.deleteContents();
    range.selectNodeContents(doc.body);
    node = range.createContextualFragment(html);

    return node;
}

/**
 * return object by split string within `&` and `=`.
 * @returns {Object} splited parameters.
 */
function getParams(str) {

    var ret = {},
        tmp,
        tmp2,
        i = 0,
        l = 0;

    tmp = str.split('&');
    for (l = tmp.length; i < l; i++) {
        tmp2 = tmp[i].split('=');
        ret[tmp2[0]] = tmp2[1];
    }

    return ret;
}

/**
 * Get template text.
 * @param {string} id
 * @param {?Object} param
 */
function getTemplate(id, param) {
    param || (param = {});
    var temp = doc.getElementById('template-' + id);
    return (!temp) ? null : template(temp.innerHTML, param);
}

/**
 * Make text from tempalte with parameter.
 * @param {string} text template text.
 * @param {Object} param template value.
 */
function template(text, param) {
    var reg1 = /#{(.*?)}/g,
        ret = '';
    //var reg2 = /##{(.*)}/g;

    ret = text.replace(reg1, function ($0, $1) {
        return param[$1];
    });

    return ret;
}

/**
 * As inner Deferred class.
 * This will be used as simple deferred function.
 */
function _Deferred(func) {
    var _queue = [],
        _data,
        ret = {
            isResolved: isResolved,
            done: done,
            resolve: resolve
        };

    function done(func) {
        if (isFunction(func)) {
            _queue ? _queue.push(func) : func(_data);
        }

        return this;
    }
    function resolve(data) {
        if (isResolved()) {
            return;
        }

        var arr = _queue,
            i = 0,
            l = arr.length;

        _data = data;
        _queue = null;

        for (; i < l; i++) {
            arr[i].apply(arr[i], arguments);
        }
    }
    function isResolved() {
        return !_queue;
    }

    if (isFunction(func)) {
        func(ret);
    }

    return ret;
}

/**
 * Ajax utility class.
 */
function ajax(url, opt) {

    opt || (opt = {});

    var type = opt.type || 'GET',
        data = opt.data || null,

        def = new util.Deferred(),
        xhr = new XMLHttpRequest(),

        value = '',
        param = '',
        params = null;

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 201) {
                def.resolve(xhr.responseText, xhr);
                def = null;
            }
            else {
                def.reject(xhr);
            }
        }
    };

    if (isObject(data)) {
        params = [];

        for (var name in data) {
            value = data[name];
            param = encodeURIComponent(name).replace(/%20/g, '+')
                + '=' + encodeURIComponent(value).replace(/%20/g, '+');
            params.push(param);
        }

        data = params.join('&');
    }

    xhr.open(type, url);

    if (/post/i.test(type)) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    xhr.send(data);

    return def;
}

/**
 * check property suppert with property name.
 * @param {string} prop css prop name.
 * @return {string} supported property name.
 */
var prefixList = ['-webkit-', '-moz-', '-ms-'];
function getCssPropSupport(prop) {

    var testDiv = doc.createElement('div'),
        propType = '',
        ch    = '',
        type1 = '',
        type2 = '',
        tmp = [],
        ret = null;

    if (prop in testDiv.style) {
        ret = prop;
    }
    else {
        for (var i = 0, l = prefixList.length; i < l; ++i) {
            propType = prefixList[i] + prop;
            tmp = /^(-)(\w+)-(\w)(\w+)$/.exec(propType);

            //e.g. webkitTransform
            type1 = tmp[2] + tmp[3].toUpperCase() + tmp[4];

            //e.g. WebkitTransform
            ch = tmp[2].slice(0, 1).toUpperCase();
            tmp[2] = tmp[2].slice(1);
            type2 = ch + tmp[2] + tmp[3].toUpperCase() + tmp[4];

            if (type1 in testDiv.style) {
                ret = type1;
                break;
            }
            else if (type2 in testDiv.style) {
                ret = type2;
                break;
            }
        }
    }

    testDiv = null;
    return ret;
}

function Deferred(func) {
    var _dSuccess = new _Deferred(),
        _dFail    = new _Deferred(),
        ret = {
            resolve: resolve,
            reject: reject,
            done: done,
            fail: fail
        };

    function resolve() {
        if (_dFail.isResolved()) {
            return false;
        }
        _dSuccess.resolve.apply(null, arguments);
    }

    function reject() {
        if (_dSuccess.isResolved()) {
            return false;
        }
        _dFail.resolve.apply(null, arguments);
    }

    function done() {
        _dSuccess.done.apply(null, arguments);
        return this;
    }

    function fail() {
        _dFail.done.apply(null, arguments);
        return this;
    }

    if (isFunction(func)) {
        func(ret);
    }

    return ret;
}

/////////////////////////////////////////////////////////////////////////

function when(arr) {

    var d = new Deferred(),
        i = arr.length,
        len = i,
        results = new Array(i);

    function _watch(result, index) {
        results[index] = result;

        if (!--len) {
            d.resolve(results);
            results = null;
            arr = null;
        }
    }

    while(i--) {
        (function (index) {
            arr[index].done(function (res) {
                _watch(res, index);
            });
        }(i));
    }

    return d;
}

/////////////////////////////////////////////////////////////////////////

/**
 * @class Throttle
 * @param {Number} ms millsecounds
 * @example
 * var throttle = new Throttle(1000);
 *
 * var i = 0;
 * var timer = setInterval(function () {
 *     i++;
 *     throttle.exec(function () {
 *         console.log(i);
 *     });
 * }, 32);
 */
function Throttle(ms) {

    var _timer,
        prevTime;

    function exec(func) {

        var now = +new Date(),
            delta;

        if (!isFunction(func)) {
            return false;
        }

        if (!prevTime) {
            func();
            prevTime = now;
            return;
        }

        clearTimeout(_timer);
        delta = now - prevTime;
        if (delta > ms) {
            func();
            prevTime = now;
        }
        else {
            _timer = setTimeout(function () {
                func();
                _timer = null;
                prevTime = now;
            }, ms);
        }
    }

    return {
        exec: exec
    };
}

/**
 * Chain callbacks.
 * @param {Function[]} [No arguments name] Call function objects as chain method.
 * @return undefined
 * @example
 *   chain(function (next) {... next(); }, function (next) {... next(); }, function (next) {... next(); }...);
 *       -> next is callback.
 */
function chain() {

    var actors = Array.prototype.slice.call(arguments);

    function next() {

        var actor = actors.shift(),
            arg = Array.prototype.slice.call(arguments);

        //push `next` method to argumetns to last.
        arg.push(next);

        //when `actor` is function, call it.
        (toString.call(actor) === '[object Function]') && actor.apply(actor, arg);
    }

    next();
}


/* --------------------------------------------------------------------
    EXPORT
----------------------------------------------------------------------- */
//for util
util.every       = every;
util.each        = each;
util.chain       = chain;
util.Throttle    = Throttle;
util.Deferred    = Deferred;
util.when        = when;
util.makeArr     = makeArr;
util.bind        = bind;
util.clone       = clone;
util.copyClone   = copyClone;
util.isObject    = isObject;
util.isFunction  = isFunction;
util.isString    = isString;
util.isNumber    = isNumber;
util.isArray     = isArray;
util.isReference = isReference;
util.isNull      = isNull;
util.isUndefined = isUndefined;
util.isEmpty     = isEmpty;
util.hasProp     = hasProp;
util.ajax        = ajax;
util.getParams   = getParams;
util.template    = template;
util.getTemplate = getTemplate;
util.makeHTMLNode = makeHTMLNode;
util.getCssPropSupport = getCssPropSupport;

util.nullFunction = function () {};
util.abstractFunction = function () {throw new Error('MUST BE IMPLEMENT THIS FUNCTION.');}

//export to global.
ns.util = util;

}(window, document, window));


(function (win, doc, exports) {

    var MathJS = {};

    MathJS.getEle1 = function () {
        return this[0];
    };
    MathJS.setEle1 = function (x) {
        this[0] = x;
    };
    MathJS.getEle2 = function () {
        return this[1];
    };
    MathJS.setEle2 = function (y) {
        this[1] = y;
    };
    MathJS.getEle3 = function () {
        return this[2];
    };
    MathJS.setEle3 = function (z) {
        this[2] = z;
    };
    MathJS.getEle4 = function () {
        return this[3];
    };
    MathJS.setEle4 = function (w) {
        this[3] = w;
    };
    MathJS.getEle12 = function () {
        return vec2(this.x, this.y);
    };
    MathJS.setEle12 = function (v) {
        this[0] = v[0];
        this[1] = v[1];
    };
    MathJS.getEle123 = function () {
        return vec3(this[0], this[1], this[2]);
    };
    MathJS.setEle123 = function (v) {
        this[0] = v[0];
        this[1] = v[1];
        this[2] = v[2];
    };

    /*! ------------------------------------------------------------
        EXPORTS
    ---------------------------------------------------------------- */
    exports.MathJS = MathJS;

}(window, document, window));

(function (win, doc, exports) {

    'use strict';


    //Import.
    var sin = Math.sin,
        cos = Math.cos,
        tan = Math.tan,
        sqrt = Math.sqrt,
        PI   = Math.PI,

        DEG_TO_RAD = PI / 180;

    /**
     * mat3
     */
    function mat3(elements) {
        var ele = [];

        if (elements === undefined) {
            return mat3.identity(mat3.create());
        }
        else if (Array.isArray(elements)) {
            return mat3.create(elements);
        }
        else {
            for (var i = 0; i < 9; i++) {
                ele.push(arguments[i] || 0);
            }
            return mat3.create(ele);
        }
    }

    mat3.create = function(elements) {
        elements || (elements = 9);
        return new Float32Array(elements);
    };

    mat3.identity = function(mat) {
        mat[0] = 1; mat[3] = 0; mat[6] = 0;
        mat[1] = 0; mat[4] = 1; mat[7] = 0;
        mat[2] = 0; mat[5] = 0; mat[8] = 1;
        return mat;
    };

    /**
     * Check equal matrix
     * @param {Float32Array} mat1
     * @param {Float32Array} mat2
     */
    mat3.equal = function(mat1, mat2) {
        return (
            (mat1[0] === mat2[0]) &&
            (mat1[1] === mat2[1]) &&
            (mat1[2] === mat2[2]) &&
            (mat1[3] === mat2[3]) &&
            (mat1[4] === mat2[4]) &&
            (mat1[5] === mat2[5]) &&
            (mat1[6] === mat2[6]) &&
            (mat1[7] === mat2[7]) &&
            (mat1[8] === mat2[8])
        );
    };

    /**
     * Transpose matrix.
     * @param {Float32Array} mat
     */
    mat3.transpose = function (mat) {
        var tmp;

        tmp = mat[1]; mat[1] = mat[3]; mat[3] = tmp;
        tmp = mat[2]; mat[2] = mat[6]; mat[6] = tmp;
        tmp = mat[5]; mat[5] = mat[7]; mat[7] = tmp;

        return mat;
    };

    /**
     * Get inverse matrix
     * @param {Float32Array} mat
     * @param {Float32Array} dest
     */
    mat3.inverse = function(mat, dest) {

        dest || (dest = mat3());

        var a11, a12, a13, a21, a22, a23, a31, a32, a33,
            b11, b12, b13, b21, b22, b23, b31, b32, b33,
            det;

        a11 = mat[0];
        a12 = mat[3];
        a13 = mat[6];
        a21 = mat[1];
        a22 = mat[4];
        a23 = mat[7];
        a31 = mat[2];
        a32 = mat[5];
        a33 = mat[8];

        det = (a11 * a22 * a33) + (a21 * a32 * a13) + (a31 * a12 * a23) - (a11 * a32 * a23) - (a31 * a22 * a13) - (a21 * a12 * a33);

        if ((0.0001 > det && det > -0.0001)) {
            return null;
        }

        b11 = (a22 * a33 - a23 * a32) / det;
        b12 = (a13 * a32 - a12 * a33) / det;
        b13 = (a12 * a23 - a13 * a22) / det;
        b21 = (a23 * a31 - a21 * a33) / det;
        b22 = (a11 * a33 - a13 * a31) / det;
        b23 = (a13 * a21 - a11 * a23) / det;
        b31 = (a21 * a32 - a22 * a31) / det;
        b32 = (a12 * a31 - a11 * a32) / det;
        b33 = (a11 * a22 - a12 * a21) / det;

        dest[0] = b11; dest[3] = b12; dest[6] = b13;
        dest[1] = b21; dest[4] = b22; dest[7] = b23;
        dest[2] = b31; dest[5] = b32; dest[8] = b33;

        return dest;
    };


    /**
     * Copy matrix
     * @param {Float32Array} mat
     * @param {Float32Array} dest
     */
    mat3.copy = function(mat, dest) {

        dest || (dest = mat3());

        dest[0] = mat[0]; dest[3] = mat[3]; dest[6] = mat[6];
        dest[1] = mat[1]; dest[4] = mat[4]; dest[7] = mat[7];
        dest[2] = mat[2]; dest[5] = mat[5]; dest[8] = mat[8];

        return dest;
    };

    /**
     * Multiply matries.
     * @param {Float32Array} A
     * @param {Float32Array} B
     * @param {Float32Array} dest
     */
    mat3.multiply = function(A, B, dest) {

        var A11, A12, A13, A21, A22, A23, A31, A32, A33,
            B11, B12, B13, B21, B22, B23, B31, B32, B33,
            ae, be;

        dest || (dest = mat3());

        ae = A;
        be = B;

        A11 = ae[0]; A12 = ae[3]; A13 = ae[6];
        A21 = ae[1]; A22 = ae[4]; A23 = ae[7];
        A31 = ae[2]; A32 = ae[5]; A33 = ae[8];

        B11 = be[0]; B12 = be[3]; B13 = be[6];
        B21 = be[1]; B22 = be[4]; B23 = be[7];
        B31 = be[2]; B32 = be[5]; B33 = be[8];

        dest[0] = A11 * B11 + A12 * B21 + A13 * B31;
        dest[3] = A11 * B12 + A12 * B22 + A13 * B32;
        dest[6] = A11 * B13 + A12 * B23 + A13 * B33;

        dest[1] = A21 * B11 + A22 * B21 + A23 * B31;
        dest[4] = A21 * B12 + A22 * B22 + A23 * B32;
        dest[7] = A21 * B13 + A22 * B23 + A23 * B33;

        dest[2] = A31 * B11 + A32 * B21 + A33 * B31;
        dest[5] = A31 * B12 + A32 * B22 + A33 * B32;
        dest[8] = A31 * B13 + A32 * B23 + A33 * B33;

        return dest;
    };

    /**
     * Create rotate matrix.
     * @param {number} rad
     * @param {Float32Array} dest
     */
    mat3.rotate = function (rad, dest) {

        /*!
        * OpenGLのZ軸による回転行列（の2次元版）
        * | cos(r) -sin(r)  0 |
        * | sin(r)  cos(r)  0 |
        * |      0      0   1 |
        */

        dest || (dest = mat3());

        var c = cos(rad);
        var s = sin(rad);

        dest[0] = c; dest[3] = -s; dest[6] = 0;
        dest[1] = s; dest[4] =  c; dest[7] = 0;
        dest[2] = 0; dest[5] =  0; dest[8] = 1;

        return dest;
    };

    /**
     * @param {Float32Array} v for scale
     * @param {Float32Array} dest
     */
    mat3.scale = function (v, dest) {

        dest || (dest = {});

        var x = v[0], y = v[1];

        dest[0] = x; dest[3] = 0; dest[6] = 0;
        dest[1] = 0; dest[4] = y; dest[7] = 0;
        dest[2] = 0; dest[5] = 0; dest[8] = 1;

        return dest;
    };


    /**
     * Apply translation to a matrix.
     * @param {Float32Array} mat An applied matrix.
     * @param {Float32Array} v A translate vector.
     * @param {Float32Array} dest
     */
    mat3.translate = function (v, dest) {
        
        dest || (dest = mat3());

        var x = v[0], y = v[1];

        dest[0] = 1; dest[3] = 0; dest[6] = x;
        dest[1] = 0; dest[4] = 1; dest[7] = y;
        dest[2] = 0; dest[5] = 0; dest[8] = 1;

        return dest;
    };

    mat3.translate2 = function (mat, v, dest) {
        
        dest || (dest = mat3());

        var x = v[0], y = v[1];

        dest[0] = mat[0]; dest[3] = mat[3];
        dest[1] = mat[1]; dest[4] = mat[4];
        dest[2] = mat[2]; dest[5] = mat[5];

        dest[6] = mat[0] * x + mat[3] * y + mat[6];
        dest[7] = mat[1] * x + mat[4] * y + mat[7];
        dest[8] = mat[2] * x + mat[5] * y + mat[8];

        return dest;
    };

    /*!--------------------------------------------------
      EXPORTS
      ----------------------------------------------------- */
    exports.mat3 = mat3;

}(window, document, window));

(function (win, doc, exports) {

    'use strict';


    var sin = Math.sin,
        cos = Math.cos,
        tan = Math.tan,
        sqrt = Math.sqrt,
        PI   = Math.PI,
        abs  = Math.abs,

        DEG_TO_RAD = PI / 180;

    /**
     * Epsilon
     */
    function  epsilon(value) {
		return abs(value) < 0.000001 ? 0 : value;
    }

    /**
     * mat4
     */
    function mat4(elements) {
        var ele = [];

        if (elements === undefined) {
            return mat4.identity(mat4.create());
        }
        else if (Array.isArray(elements)) {
            return mat4.create(elements);
        }
        else {
            for (var i = 0; i < 16; i++) {
                ele.push(arguments[i] || 0);
            }
            return mat4.create(ele);
        }
    }

    mat4.create = function(elements) {
        elements || (elements = 16);
        return new Float32Array(elements);
    };

    mat4.identity = function(mat) {
        mat[0] = 1; mat[4] = 0; mat[8]  = 0; mat[12] = 0;
        mat[1] = 0; mat[5] = 1; mat[9]  = 0; mat[13] = 0;
        mat[2] = 0; mat[6] = 0; mat[10] = 1; mat[14] = 0;
        mat[3] = 0; mat[7] = 0; mat[11] = 0; mat[15] = 1;
        return mat;
    };

    Object.defineProperty(mat4, 'projectiveTexture', {
        set: function (m) {},
        get: function () {
            return mat4(
                0.5,  0.0, 0.0, 0.0,
                0.0, -0.5, 0.0, 0.0,
                0.0,  0.0, 1.0, 0.0,
                0.5,  0.5, 0.0, 1.0
            );
        }
    });

    /////////////////////////////////////////////////////////////////////////////

    /**
     * Check equal matrix
     * @param {Float32Array} mat1
     * @param {Float32Array} mat2
     */
    mat4.equal = function(mat1, mat2) {
        return (mat1[0] === mat2[0]) && (mat1[4] === mat2[4]) && (mat1[8] === mat2[8]) && (mat1[12] === mat2[12]) && (mat1[1] === mat2[1]) && (mat1[5] === mat2[5]) && (mat1[9] === mat2[9]) && (mat1[13] === mat2[13]) && (mat1[2] === mat2[2]) && (mat1[6] === mat2[6]) && (mat1[10] === mat2[10]) && (mat1[14] === mat2[14]) && (mat1[3] === mat2[3]) && (mat1[7] === mat2[7]) && (mat1[11] === mat2[11]) && (mat1[15] === mat2[15]);
    };

    /**
     * Transpose matrix.
     * @param {Float32Array} mat
     */
    mat4.transpose = function (mat) {
        var tmp;
        tmp = mat[1]; mat[1] = mat[4]; mat[4] = tmp;
        tmp = mat[2]; mat[2] = mat[8]; mat[8] = tmp;
        tmp = mat[6]; mat[6] = mat[9]; mat[9] = tmp;

        tmp = mat[3];  mat[3]  = mat[12]; mat[12] = tmp;
        tmp = mat[7];  mat[7]  = mat[13]; mat[13] = tmp;
        tmp = mat[11]; mat[11] = mat[14]; mat[14] = tmp;

        return mat;
    };

    /**
     * Get inverse matrix
     * @param {Float32Array} mat
     * @param {Float32Array} dest
     */
    mat4.inverse = function(mat, dest) {

        dest || (dest = mat4());

        var a11, a12, a13, a14, a21, a22, a23, a24, a31, a32, a33, a34, a41, a42, a43, a44,
            b11, b12, b13, b14, b21, b22, b23, b24, b31, b32, b33, b34, b41, b42, b43, b44,
            det;

        a11 = mat[0];
        a12 = mat[4];
        a13 = mat[8];
        a14 = mat[12];
        a21 = mat[1];
        a22 = mat[5];
        a23 = mat[9];
        a24 = mat[13];
        a31 = mat[2];
        a32 = mat[6];
        a33 = mat[10];
        a34 = mat[14];
        a41 = mat[3];
        a42 = mat[7];
        a43 = mat[11];
        a44 = mat[15];

        det = (a11 * a22 * a33 * a44 + a11 * a23 * a34 * a42 + a11 * a24 * a32 * a43 + a12 * a21 * a34 * a43 + a12 * a23 * a31 * a44 + a12 * a24 * a33 * a41 + a13 * a21 * a32 * a44 + a13 * a22 * a34 * a41 + a13 * a24 * a31 * a42 + a14 * a21 * a33 * a42 + a14 * a22 * a31 * a43 + a14 * a23 * a32 * a41 - a11 * a22 * a34 * a43 - a11 * a23 * a32 * a44 - a11 * a24 * a33 * a42 - a12 * a21 * a33 * a44 - a12 * a23 * a34 * a41 - a12 * a24 * a31 * a43 - a13 * a21 * a34 * a42 - a13 * a22 * a31 * a44 - a13 * a24 * a32 * a41 - a14 * a21 * a32 * a43 - a14 * a22 * a33 * a41 - a14 * a23 * a31 * a42);

        if ((0.0001 > det && det > -0.0001)) {
            return null;
        }

        b11 = ((a22 * a33 * a44) + (a23 * a34 * a42) + (a24 * a32 * a43) - (a22 * a34 * a43) - (a23 * a32 * a44) - (a24 * a33 * a42)) / det;
        b12 = ((a12 * a34 * a43) + (a13 * a32 * a44) + (a14 * a33 * a42) - (a12 * a33 * a44) - (a13 * a34 * a42) - (a14 * a32 * a43)) / det;
        b13 = ((a12 * a23 * a44) + (a13 * a24 * a42) + (a14 * a22 * a43) - (a12 * a24 * a43) - (a13 * a22 * a44) - (a14 * a23 * a42)) / det;
        b14 = ((a12 * a24 * a33) + (a13 * a22 * a34) + (a14 * a23 * a32) - (a12 * a23 * a34) - (a13 * a24 * a32) - (a14 * a22 * a33)) / det;
        b21 = ((a21 * a34 * a43) + (a23 * a31 * a44) + (a24 * a33 * a41) - (a21 * a33 * a44) - (a23 * a34 * a41) - (a24 * a31 * a43)) / det;
        b22 = ((a11 * a33 * a44) + (a13 * a34 * a41) + (a14 * a31 * a43) - (a11 * a34 * a43) - (a13 * a31 * a44) - (a14 * a33 * a41)) / det;
        b23 = ((a11 * a24 * a43) + (a13 * a21 * a44) + (a14 * a23 * a41) - (a11 * a23 * a44) - (a13 * a24 * a41) - (a14 * a21 * a43)) / det;
        b24 = ((a11 * a23 * a34) + (a13 * a24 * a31) + (a14 * a21 * a33) - (a11 * a24 * a33) - (a13 * a21 * a34) - (a14 * a23 * a31)) / det;
        b31 = ((a21 * a32 * a44) + (a22 * a34 * a41) + (a24 * a31 * a42) - (a21 * a34 * a42) - (a22 * a31 * a44) - (a24 * a32 * a41)) / det;
        b32 = ((a11 * a34 * a42) + (a12 * a31 * a44) + (a14 * a32 * a41) - (a11 * a32 * a44) - (a12 * a34 * a41) - (a14 * a31 * a42)) / det;
        b33 = ((a11 * a22 * a44) + (a12 * a24 * a41) + (a14 * a21 * a42) - (a11 * a24 * a42) - (a12 * a21 * a44) - (a14 * a22 * a41)) / det;
        b34 = ((a11 * a24 * a32) + (a12 * a21 * a34) + (a14 * a22 * a31) - (a11 * a22 * a34) - (a12 * a24 * a31) - (a14 * a21 * a32)) / det;
        b41 = ((a21 * a33 * a42) + (a22 * a31 * a43) + (a23 * a32 * a41) - (a21 * a32 * a43) - (a22 * a33 * a41) - (a23 * a31 * a42)) / det;
        b42 = ((a11 * a32 * a43) + (a12 * a33 * a41) + (a13 * a31 * a42) - (a11 * a33 * a42) - (a12 * a31 * a43) - (a13 * a32 * a41)) / det;
        b43 = ((a11 * a23 * a42) + (a12 * a21 * a43) + (a13 * a22 * a41) - (a11 * a22 * a43) - (a12 * a23 * a41) - (a13 * a21 * a42)) / det;
        b44 = ((a11 * a22 * a33) + (a12 * a23 * a31) + (a13 * a21 * a32) - (a11 * a23 * a32) - (a12 * a21 * a33) - (a13 * a22 * a31)) / det;

        dest[0] = b11; dest[4] = b12; dest[8] = b13; dest[12] = b14;
        dest[1] = b21; dest[5] = b22; dest[9] = b23; dest[13] = b24;
        dest[2] = b31; dest[6] = b32; dest[10] = b33; dest[14] = b34;
        dest[3] = b41; dest[7] = b42; dest[11] = b43; dest[15] = b44;

        return dest;
    };


    /**
     * Copy matrix
     * @param {Float32Array} mat
     * @param {Float32Array} dest
     */
    mat4.copy = function(mat, dest) {

        dest || (dest = mat4());

        dest[0] = mat[0]; dest[4] = mat[4]; dest[8] = mat[8]; dest[12] = mat[12];
        dest[1] = mat[1]; dest[5] = mat[5]; dest[9] = mat[9]; dest[13] = mat[13];
        dest[2] = mat[2]; dest[6] = mat[6]; dest[10] = mat[10]; dest[14] = mat[14];
        dest[3] = mat[3]; dest[7] = mat[7]; dest[11] = mat[11]; dest[15] = mat[15];

        return dest;
    };

    
    /**
     * Matrix to string as CSS matrix.
     * @param {Float32Array} mat
     */
    mat4.toCSSMatrixString = function (mat) {
        return 'matrix3d('    +
            epsilon(mat[0])   + ',' +
            epsilon(mat[1])  + ',' +
            epsilon(mat[2])   + ',' +
            epsilon(mat[3])   + ',' +
            epsilon(mat[4])   + ',' +
            epsilon(mat[5])  + ',' +
            epsilon(mat[6])   + ',' +
            epsilon(mat[7])   + ',' +
            epsilon(mat[8])   + ',' +
            epsilon(mat[9])  + ',' +
            epsilon(mat[10])  + ',' +
            epsilon(mat[11])  + ',' +
            epsilon(mat[12])  + ',' +
            epsilon(mat[13]) + ',' +
            epsilon(mat[14])  + ',' +
            epsilon(mat[15])  +
        ')';
    };


    /**
     * Make frustum
     * @param {number} left
     * @param {number} right
     * @param {number} bottom
     * @param {number} top
     * @param {number} near
     * @param {number} far
     * @param {mat4} dest
     */
    mat4.makeFrustum = function(left, right, bottom, top, near, far, dest) {

        var a, b, c, d, vh, vw, x, y;
        dest || (dest = mat4());

        vw = right - left;
        vh = top - bottom;
        x = 2 * near / vw;
        y = 2 * near / vh;

        a = (right + left) / (right - left);
        b = (top + bottom) / (top - bottom);
        c = -(far + near) / (far - near);
        d = -(2 * near * far) / (far - near);

        dest[0] = x; dest[4] = 0; dest[8] = a; dest[12] = 0;
        dest[1] = 0; dest[5] = y; dest[9] = b; dest[13] = 0;
        dest[2] = 0; dest[6] = 0; dest[10] = c; dest[14] = d;
        dest[3] = 0; dest[7] = 0; dest[11] = -1; dest[15] = 0;

        return dest;
    };

    /**
     * Create perspective matrix.
     * @param {number} fov Field of View.
     * @param {number} aspect
     * @param {number} near
     * @param {number} far
     */
    mat4.perspective = function(fov, aspect, near, far, dest) {

        var xmax, xmin, ymax, ymin;
        dest || (dest = mat4());

        ymax = near * tan(fov * DEG_TO_RAD * 0.5);
        ymin = -ymax;
        xmin = ymin * aspect;
        xmax = ymax * aspect;

        return mat4.makeFrustum(xmin, xmax, ymin, ymax, near, far, dest);
    };

    /**
     * Multiply matries.
     * @param {Float32Array} A
     * @param {Float32Array} B
     * @param {Float32Array} dest
     */
    mat4.multiply = function(A, B, dest) {

        var A11, A12, A13, A14, A21, A22, A23, A24, A31, A32, A33, A34, A41, A42, A43, A44,
            B11, B12, B13, B14, B21, B22, B23, B24, B31, B32, B33, B34, B41, B42, B43, B44,
            ae, be;

        dest || (dest = mat4());

        ae = A;
        be = B;

        A11 = ae[0]; A12 = ae[4]; A13 = ae[8]; A14 = ae[12];
        A21 = ae[1]; A22 = ae[5]; A23 = ae[9]; A24 = ae[13];
        A31 = ae[2]; A32 = ae[6]; A33 = ae[10]; A34 = ae[14];
        A41 = ae[3]; A42 = ae[7]; A43 = ae[11]; A44 = ae[15];

        B11 = be[0]; B12 = be[4]; B13 = be[8]; B14 = be[12];
        B21 = be[1]; B22 = be[5]; B23 = be[9]; B24 = be[13];
        B31 = be[2]; B32 = be[6]; B33 = be[10]; B34 = be[14];
        B41 = be[3]; B42 = be[7]; B43 = be[11]; B44 = be[15];

        dest[0]  = A11 * B11 + A12 * B21 + A13 * B31 + A14 * B41;
        dest[4]  = A11 * B12 + A12 * B22 + A13 * B32 + A14 * B42;
        dest[8]  = A11 * B13 + A12 * B23 + A13 * B33 + A14 * B43;
        dest[12] = A11 * B14 + A12 * B24 + A13 * B34 + A14 * B44;
        dest[1]  = A21 * B11 + A22 * B21 + A23 * B31 + A24 * B41;
        dest[5]  = A21 * B12 + A22 * B22 + A23 * B32 + A24 * B42;
        dest[9]  = A21 * B13 + A22 * B23 + A23 * B33 + A24 * B43;
        dest[13] = A21 * B14 + A22 * B24 + A23 * B34 + A24 * B44;
        dest[2]  = A31 * B11 + A32 * B21 + A33 * B31 + A34 * B41;
        dest[6]  = A31 * B12 + A32 * B22 + A33 * B32 + A34 * B42;
        dest[10] = A31 * B13 + A32 * B23 + A33 * B33 + A34 * B43;
        dest[14] = A31 * B14 + A32 * B24 + A33 * B34 + A34 * B44;
        dest[3]  = A41 * B11 + A42 * B21 + A43 * B31 + A44 * B41;
        dest[7]  = A41 * B12 + A42 * B22 + A43 * B32 + A44 * B42;
        dest[11] = A41 * B13 + A42 * B23 + A43 * B33 + A44 * B43;
        dest[15] = A41 * B14 + A42 * B24 + A43 * B34 + A44 * B44;

        return dest;
    };

    /**
     * Multiply by scalar
     *
     * @param {mat4} mat
     * @param {number} scalar
     * @param {mat4?} dest
     *
     * @return {mat4}
     */
    mat4.multiplyScalar = function (mat, scalar, dest) {
        dest || (dest = mat4());

        dest[0] = mat[0] * scalar; dest[4] = mat[4] * scalar; dest[ 8] = mat[ 8] * scalar; dest[12] = mat[12] * scalar;
        dest[1] = mat[1] * scalar; dest[5] = mat[5] * scalar; dest[ 9] = mat[ 9] * scalar; dest[13] = mat[13] * scalar;
        dest[2] = mat[2] * scalar; dest[6] = mat[6] * scalar; dest[10] = mat[10] * scalar; dest[14] = mat[14] * scalar;
        dest[3] = mat[3] * scalar; dest[7] = mat[7] * scalar; dest[11] = mat[11] * scalar; dest[15] = mat[15] * scalar;

        return dest;
    };

    /**
     * @param {Float32Array} mat
     * @param {Float32Array} v
     * @param {Float32Array} dest
     */
    mat4.translate = function(mat, v, dest) {

        var x = v[0],
            y = v[1],
            z = v[2];

        dest || (dest = mat4());

        dest[0]  = mat[0]; dest[1] = mat[1]; dest[2]  = mat[2];  dest[3]  = mat[3];
        dest[4]  = mat[4]; dest[5] = mat[5]; dest[6]  = mat[6];  dest[7]  = mat[7];
        dest[8]  = mat[8]; dest[9] = mat[9]; dest[10] = mat[10]; dest[11] = mat[11];
        dest[12] = mat[0] * x + mat[4] * y + mat[8]  * z + mat[12];
        dest[13] = mat[1] * x + mat[5] * y + mat[9]  * z + mat[13];
        dest[14] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
        dest[15] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];

        return dest;
    };

    /**
     * Scale matrix
     * @param {Float32Array} mat
     * @param {Float32Array} v
     * @param {Float32Array} dest
     */
    mat4.scale = function(mat, v, dest) {

        var x = v[0],
            y = v[1],
            z = v[2];

        dest || (dest = mat4());

        dest[0]  = mat[0]  * x;
        dest[1]  = mat[1]  * x;
        dest[2]  = mat[2]  * x;
        dest[3]  = mat[3]  * x;
        dest[4]  = mat[4]  * y;
        dest[5]  = mat[5]  * y;
        dest[6]  = mat[6]  * y;
        dest[7]  = mat[7]  * y;
        dest[8]  = mat[8]  * z;
        dest[9]  = mat[9]  * z;
        dest[10] = mat[10] * z;
        dest[11] = mat[11] * z;
        dest[12] = mat[12];
        dest[13] = mat[13];
        dest[14] = mat[14];
        dest[15] = mat[15];
        
        return dest;
    };

    /**
     * Create rotation matrix with any axis.
     * @param {number} angle
     * @param {Float32Array} axis
     * @return {mat4} this
     */
    mat4.rotate = function(mat, angle, axis, dest) {

        var x = axis[0], y = axis[1], z = axis[2],
            sq = sqrt(x * x + y * y + z * z);

        dest || (dest = mat4());

        if(!sq){
            return null;
        }

        if(sq !== 1){
            sq = 1 / sq;
            x *= sq;
            y *= sq;
            z *= sq;
        }

        angle = angle * DEG_TO_RAD;

        var rot = mat4(),
            co = cos(angle),
            si = sin(angle),
            a = (1 - co),
            b = x * x,
            c = y * y,
            d = z * z,
            e = x * y,
            f = x * z,
            g = y * z,
            h = x * si,
            i = y * si,
            j = z * si;


        rot[0] = b * a + co; rot[4] = e * a - j;  rot[8]  = f * a + i;
        rot[1] = e * a + j;  rot[5] = c * a + co; rot[9]  = g * a - h;
        rot[2] = f * a - i;  rot[6] = g * a + h;  rot[10] = d * a + co;

        return mat4.multiply(mat, rot, dest);
    };


    /**
     * @param {Float32Array} eye
     * @param {Float32Array} target
     * @param {Float32Array} up
     * @param {mat4} dest
     */
    mat4.lookAt = function(eye, target, up, dest) {

        var x = vec3(),
            y = vec3(),
            z = vec3(),
            tx, ty, tz;

        dest || (dest = mat4());

        vec3.normalize(vec3.sub(eye, target, z));
        vec3.normalize(vec3.cross(up, z, x));
        vec3.normalize(vec3.cross(z, x, y));

        tx = vec3.dot(eye, x);
        ty = vec3.dot(eye, y);
        tz = vec3.dot(eye, z);

        var xx = x[0],
            xy = x[1],
            xz = x[2],

            yx = y[0],
            yy = y[1],
            yz = y[2],

            zx = z[0],
            zy = z[1],
            zz = z[2];

        dest[0] = xx; dest[4] = xy; dest[8]  = xz; dest[12] = -tx;
        dest[1] = yx; dest[5] = yy; dest[9]  = yz; dest[13] = -ty;
        dest[2] = zx; dest[6] = zy; dest[10] = zz; dest[14] = -tz;

        return dest;
    };


    /*!--------------------------------------------------
      EXPORTS
      ----------------------------------------------------- */
    exports.mat4 = mat4;

}(window, document, window));

(function (win, doc, exports) {

    'use strict';

    var sin  = Math.sin,
        cos  = Math.cos,
        acos = Math.acos,
        sqrt = Math.sqrt;

    ///////////////////////////////////////////////////////

    /**
     * Make rotation quat
     * @param {number} w Component of w.
     * @param {number} x Component of x.
     * @param {number} y Component of y.
     * @param {number} z Component of z.
     *
     * quatの中の数値の意味は以下。
     * q = [ cos(θ/2); sin(θ/2)n ] //nはベクトル。「;」の左が実部、右が虚部。
     *   = [ cos(θ/2); (sin(θ/2)nx, sin(θ/2)ny, sin(θ/2)nz ] //ベクトル成分を分解して表記
     */
    function quat(w, x, y, z) {
        return quat.create(w, x, y, z);
    }

    /**
     * Create a quaternion.
     * @param {number} w Component of w.
     * @param {number} x Component of x.
     * @param {number} y Component of y.
     * @param {number} z Component of z.
     * @return {Float32Array}
     */
    quat.create = function (w, x, y, z) {

        var elements = [],
            ret;

        if (Array.isArray(w) || Float32Array.prototype.isPrototypeOf(w)) {
            elements = w;
        }
        else if (w === undefined) {
            elements = [1, 0, 0, 0];
        }
        else if (x === undefined) {
            elements = [w, w, w, w];
        }
        else if (y === undefined) {
            elements = [w, x, 0, 0];
        }
        else if (z === undefined) {
            elements = [w, x, y, 0];
        }
        else {
            elements = [w, x, y, z];
        }

        ret = new Float32Array(elements);
        Object.defineProperties(ret, {
            'w': {
                get: MathJS.getEle1,
                set: MathJS.setEle1
            },
            'x': {
                get: MathJS.getEle2,
                set: MathJS.setEle2
            },
            'y': {
                get: MathJS.getEle3,
                set: MathJS.setEle3
            },
            'z': {
                get: MathJS.getEle4,
                set: MathJS.setEle4
            }
        });

        return ret;
    };

    /**
     * Check to equal values.
     * @param {quat} q1
     * @param {quat} q2
     */
    quat.equal = function(q1, q2) {

        var q1w = q1[0],
            q1x = q1[1],
            q1y = q1[2],
            q1z = q1[3],

            q2w = q2[0],
            q2x = q2[1],
            q2y = q2[2],
            q2z = q2[3];

        return (q1w === q2w) && (q1x === q2x) && (q1y === q2y) && (q1z === q2z);
    };

    /**
     * convert quatuernion to matrix4.
     * @param {Float32Array} qt
     * @param {Float32Array} dest as matrix4
     */
    quat.toMat = function (qt, dest) {

        dest || (dest = mat4());

        var qw, qx, qy, qz;
        var x2, y2, z2;
        var xy, yz, zx;
        var wx, wy, wz;

        qw = qt[0];
        qx = qt[1];
        qy = qt[2];
        qz = qt[3];

        x2 = 2 * qx * qx;
        y2 = 2 * qy * qy;
        z2 = 2 * qz * qz;

        xy = 2 * qx * qy;
        yz = 2 * qy * qz;
        zx = 2 * qz * qx;

        wx = 2 * qw * qx;
        wy = 2 * qw * qy;
        wz = 2 * qw * qz;

        dest[0]  = 1 - y2 - z2;
        dest[4]  = xy - wz;
        dest[8]  = zx + wy;
        dest[12] = 0;

        dest[1]  = xy + wz;
        dest[5]  = 1 - z2 - x2;
        dest[9]  = yz - wx;
        dest[13] = 0;

        dest[2]  = zx - wy;
        dest[6]  = yz + wx;
        dest[10] = 1 - x2 - y2;
        dest[14] = 0;

        dest[3]  = 0;
        dest[7]  = 0;
        dest[11] = 0;
        dest[15] = 1;

        return dest;
    };

    /**
     * Convert quaternion to a vec3.
     * @param {Float32Array} vec as vec3
     * @param {Float32Array} qt as quaternion
     * @param {Float32Array} dest as vec3
     * @return {Float32Array} dest
     */
    quat.toVec3 = function (vec, qt, dest) {
        var qp = quat();
        var qq = quat();
        var qr = quat();

        quat.inverse(qt, qr);

        qp[0] = vec[0];
        qp[1] = vec[1];
        qp[2] = vec[2];

        quat.multiply(qr, qp, qq);
        quat.multiply(qq, qt, qr);

        dest[0] = qr[0];
        dest[1] = qr[1];
        dest[2] = qr[2];

        return dest;
    };

    /**
     * Multiply quaternions.
     *
     *  quatの掛け算の公式は以下。
     *  ・は内積、×は外積、U, Vはともにベクトル。
     *  ;の左が実部、右が虚部。
     *  A = (a; U) 
     *  B = (b; V) 
     *  AB = (ab - U・V; aV + bU + U×V)
     */
    quat.multiply = function (pq, qq, dest) {
        
        dest || (dest = quat());

        var pqw, pqx, pqy, pqz;
        var qqw, qqx, qqy, qqz;

        pqw = pq[0];
        pqx = pq[1];
        pqy = pq[2];
        pqz = pq[3];

        qqw = qq[0];
        qqx = qq[1];
        qqy = qq[2];
        qqz = qq[3];

        dest[0] = pqw * qqw - pqx * qqx - pqy * qqy - pqz * qqz;
        dest[1] = pqw * qqx + pqx * qqw + pqy * qqz - pqz * qqy;
        dest[2] = pqw * qqy - pqx * qqz + pqy * qqw + pqz * qqx;
        dest[3] = pqw * qqz + pqx * qqy - pqy * qqx + pqz * qqw;

        return dest;
    };

    /**
     * Make a rotation quaternion.
     * @param {number} radian
     * @param {Float32Array} vec
     * @return {Float32Array}
     */
    quat.rotate = function (radian, vec, dest) {

        dest || (dest = quat());

        var hrad = 0.5 * radian;
        var s = sin(hrad);

        dest[0] = cos(hrad);
        dest[1] = s * vec[0];
        dest[2] = s * vec[1];
        dest[3] = s * vec[2];

        return dest;
    };

    /**
     * Rotate quaternion apply to a vector3.
     * @param {Float32Array} qt
     * @param {Float32Array} vec
     * @param {Float32Array} dest
     */
    quat.rotateQt = function (qt, vec, dest) {

        dest || (dest = vec3());

        var tmpX, tmpY, tmpZ, tmpW;

        tmpX = (((qt.w * vec.x) + (qt.y * vec.z)) - (qt.z * vec.y));
        tmpY = (((qt.w * vec.y) + (qt.z * vec.x)) - (qt.x * vec.z));
        tmpZ = (((qt.w * vec.z) + (qt.x * vec.y)) - (qt.y * vec.x));
        tmpW = (((qt.x * vec.x) + (qt.y * vec.y)) + (qt.z * vec.z));

        vec3.copy(
            vec3(
                ((((tmpW * qt.x) + (tmpX * qt.w)) - (tmpY * qt.z)) + (tmpZ * qt.y)),
                ((((tmpW * qt.y) + (tmpY * qt.w)) - (tmpZ * qt.x)) + (tmpX * qt.z)),
                ((((tmpW * qt.z) + (tmpZ * qt.w)) - (tmpX * qt.y)) + (tmpY * qt.x))
            ), dest);

        return dest;
    };


    /**
     * Inverse quaternion.
     * @param {Float32Array} qt
     * @param {Float32Array} dest
     * @return {Float32Array}
     */
    quat.inverse = function (qt, dest) {

        dest || (dest = quat());

        dest[0] =  qt[0];
        dest[1] = -qt[1];
        dest[2] = -qt[2];
        dest[3] = -qt[3];

        return dest;
    };

    /**
     * @param {Float32Array} q1
     * @param {Float32Array} q2
     * @param {number} time
     * @param {Float32Array} dest
     * @return {Float32Array}
     */
    quat.slerp = function (q1, q2, time, dest) {

        dest || (dest = quat());

        var qr = q1[0] * q2[0] + q1[1] * q2[1] + q1[2] * q2[2] + q1[3] * q2[3];
        var ss = 1.0 - qr * qr;

        if (ss <= 0.0) {
            dest[0] = q1[0];
            dest[1] = q1[1];
            dest[2] = q1[2];
            dest[3] = q1[3];
        }
        else {
            ss = sqrt(ss);
            var ph = acos(qr);
            var pt = ph * time;
            var t1 = sin(ph - pt) / ss;
            var t2 = sin(pt) / ss;

            dest[0] = q1[0] * t1 + q2[0] * t2;
            dest[1] = q1[1] * t1 + q2[1] * t2;
            dest[2] = q1[2] * t1 + q2[2] * t2;
            dest[3] = q1[3] * t1 + q2[3] * t2;
        }

        return dest;
    };

    /**
     * Copy quaternion.
     * @param {Float32Array} qt
     * @param {Float32Array} dest
     */
    quat.copy = function(qt, dest) {

        dest || (dest = quat());

        dest[0] = qt[0];
        dest[1] = qt[1];
        dest[2] = qt[2];
        dest[3] = qt[3];

        return dest;
    };

    /*!--------------------------------------------------
      EXPORTS
    ----------------------------------------------------- */
    exports.quat = quat;

}(window, document, window));

(function (win, doc, exports) {

    'use strict';

    var PI   = Math.PI,
        sqrt = Math.sqrt,
        acos = Math.acos;

    /**
     * vec2
     * @param {number|Array.<number>} x Position of x.
     * @param {?number} y Position of y.
     */
    function vec2() {
        return vec2.create.apply(vec2, arguments);
    }

    /////////////////////////////////////////////////////////////////////

    Object.defineProperty(vec2, 'zero', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec2(0, 0); }
    });

    Object.defineProperty(vec2, 'up', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec2(0, 1); }
    });

    Object.defineProperty(vec2, 'down', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec2(0, -1); }
    });

    Object.defineProperty(vec2, 'right', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec2(1, 0); }
    });

    Object.defineProperty(vec2, 'left', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec2(-1, 0); }
    });

    /////////////////////////////////////////////////////////////////////

    /**
     * Check to equal values.
     * @param {vec2} v
     */
    vec2.equal = function(v1, v2) {
        var v1x = v1[0],
            v1y = v1[1],

            v2x = v2[0],
            v2y = v2[1];

        return (v1x === v2x) && (v1y === v2y);
    };

    /**
     * Create values to x,y,z
     * @param {number|Array.<number>} x Position of x.
     * @param {?number} y Position of y.
     */
    vec2.create = function() {

        var elements = [],
            arr;

        for (var i = 0, l = arguments.length; i < l; i++) {
            arr = arguments[i];

            if (Float32Array.prototype.isPrototypeOf(arr)) {
                for (var j = 0, k = arr.length; j < k; j++) {
                    elements = elements.concat(arr[j]);
                }
            }
            else {
                elements = elements.concat(arguments[i]);
            }
        }

        if (elements.length > 2) {
            elements.length = 2;
        }

        switch (elements.length) {
            case 0:
                elements[0] = 0;
                elements[1] = 0;
                break;
            case 1:
                elements[1] = elements[0];
                break;
        }

        elements = new Float32Array(elements);

        //if (Array.isArray(x) || Float32Array.prototype.isPrototypeOf(x)) {
        //    elements = new Float32Array(x);
        //}
        //else if (x === undefined) {
        //    elements = [0, 0];
        //}
        //else if (y === undefined) {
        //    elements = [x, x];
        //}
        //else {
        //    elements = [x, y];
        //}
        //ret = new Float32Array(elements);
        
        Object.defineProperties(elements, {
            'x': {
                get: MathJS.getEle1,
                set: MathJS.setEle1
            },
            'y': {
                get: MathJS.getEle2,
                set: MathJS.setEle2
            }
        });

        return elements;
    };


    /**
     * Sub vectors
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec2.sub = function(v1, v2, dest) {

        dest || (dest = vec2());

        dest[0] = v1[0] - v2[0];
        dest[1] = v1[1] - v2[1];

        return dest;
    };

    /**
     * Add vectors
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec2.add = function(v1, v2, dest) {

        dest || (dest = vec2());

        dest[0] = v1[0] + v2[0];
        dest[1] = v1[1] + v2[1];

        return dest;
    };

    /**
     * Copy vector.
     * @param {Float32Array} v1
     * @param {Float32Array} dest
     */
    vec2.copy = function(v, dest) {

        dest || (dest = vec2());

        dest[0] = v[0];
        dest[1] = v[1];

        return dest;
    };

    /**
     * Calc norm from vector.
     * @param {Float32Array} v
     */
    vec2.norm = function(v) {
        var x = v[0], y = v[1];
        return sqrt(x * x + y * y);
    };

    /**
     * Calc norm from vector without sqrt.
     * @param {Float32Array} v
     */
    vec2.lengthSqr = function (v) {
        var x = v[0], y = v[1];
        return x * x + y * y;
    };

    /**
     * Normalized vector
     * @param {Float32Array} v
     * @param {Float32Array} dest
     */
    vec2.normalize = function(v, dest) {

        dest || (dest = vec2());

        var nrm = vec2.norm(v);

        if (nrm !== 0) {
            nrm = 1 / nrm;
            dest[0] = v[0] * nrm;
            dest[1] = v[1] * nrm;
        }

        return dest;
    };

    /**
     * Multiply vectors.
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec2.multiply = function(v1, v2, dest) {

        dest || (dest = vec2());

        dest[0] = v1[0] * v2[0];
        dest[1] = v1[1] * v2[1];

        return dest;
    };

    /**
     * Multiple scalar
     * @param {Float32Array} v
     * @param {number} s
     * @param {Float32Array} dest
     */
    vec2.multiplyScalar = function(v, s, dest) {

        dest || (dest = vec2());

        dest[0] = v[0] * s;
        dest[1] = v[1] * s;

        return dest;
    };

    /**
     * Multiple scalar with -1 to inverse vector sign.
     * @param {Float32Array} v vec2
     * @param {Float32Array} dest vec2
     */
    vec2.minus = function (v, dest) {

        dest || (dest = vec2());

        dest[0] = -v[0];
        dest[1] = -v[1];

        return dest;
    };

    /**
     * Calc dot
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     */
    vec2.dot = function(v1, v2) {

        var v1x = v1[0],
            v1y = v1[1],

            v2x = v2[0],
            v2y = v2[1];

        return v1x * v2x + v1y * v2y;
    };

    /**
     * Calc cross
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     */
    vec2.cross = function(v1, v2) {

        var v1x = v1[0],
            v1y = v1[1],

            v2x = v2[0],
            v2y = v2[1];

        return v1x * v2y - v1y * v2x;
    };

    /**
     * @param {Float32Array} from
     * @param {Float32Array} to
     * @return {number} angle number as radian.
     */
    vec2.lookAtRad = (function () {

        var zero = vec2.zero;

        function lookAtRad(from, to) {

            if (vec2.equal(from, zero)) {
                from = vec2.zero;
                from[0] = 0.00001;
            }

            var sub = vec2.normalize(vec2.sub(to, from));
            var fromCopy = vec2.normalize(vec2.copy(from));
            var rad = vec2.dot(sub, fromCopy);

            var dir = vec2.cross(sub, fromCopy);

            if (dir > 0) {
                return -acos(rad);
            }
            else {
                return acos(rad);
            }
        }

        return lookAtRad;
    }());

    /**
     * @param {Float32Array} from
     * @param {Float32Array} to
     * @return {number} angle number as degrees.
     */
    vec2.lookAtDeg = function (from, to) {
        var rad = vec2.lookAtRad(from, to);
        return rad * 180 / PI;
    };

    /**
     * Apply matrix3 for a vector.
     * @param {Float32Array} v vector2
     * @param {Float32Array} mat Matrix3
     * @param {Float32Array} dest vector2
     */
    vec2.applyMatrix3 = function (v, mat, dest) {

        dest || (dest = vec2());

        var x = v[0], y = v[1];

        dest[0] = mat[0] * x + mat[3] * y + mat[6];
        dest[1] = mat[1] * x + mat[4] * y + mat[7];

        return dest;
    };

    /**
     * To string vector.
     * @param {Float32Array} v
     * @return {string}
     */
    vec2.toString = function(v) {
        return '' + v[0] + ',' + v[1];
    };

    /*!--------------------------------------------------
      EXPORTS
      ----------------------------------------------------- */
    exports.vec2 = vec2;

}(window, document, window));

(function (win, doc, exports) {

    'use strict';

    var PI   = Math.PI,
        sqrt = Math.sqrt,
        acos = Math.acos;

    /**
     * vec3
     * @param {number|Array.<number>} x Position of x.
     * @param {?number} y Position of y.
     * @param {?number} z Position of z.
     */
    function vec3() {
        return vec3.create.apply(vec3, arguments);
    }

    ///////////////////////////////////////////////////////////////////

    Object.defineProperty(vec3, 'zero', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec3(0, 0, 0); }
    });

    Object.defineProperty(vec3, 'up', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec3(0, 1, 0); }
    });

    Object.defineProperty(vec3, 'down', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec3(0, -1, 0); }
    });

    Object.defineProperty(vec3, 'forward', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec3(0, 0, 1); }
    });

    Object.defineProperty(vec3, 'back', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec3(0, 0, -1); }
    });

    Object.defineProperty(vec3, 'right', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec3(1, 0, 0); }
    });

    Object.defineProperty(vec3, 'left', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec3(-1, 0, 0); }
    });

    ///////////////////////////////////////////////////////////////////

    /**
     * Check to equal values.
     * @param {vec3} v
     */
    vec3.equal = function(v1, v2) {
        var v1x = v1[0],
            v1y = v1[1],
            v1z = v1[2],

            v2x = v2[0],
            v2y = v2[1],
            v2z = v2[2];

        return (v1x === v2x) && (v1y === v2y) && (v1z === v2z);
    };

    /**
     * Create values to x,y,z
     * @param {number|Array.<number>} x Position of x.
     * @param {?number} y Position of y.
     * @param {?number} z Position of z.
     */
    vec3.create = function() {

        var elements = [],
            arr;

        for (var i = 0, l = arguments.length; i < l; i++) {
            arr = arguments[i];
            if (Float32Array.prototype.isPrototypeOf(arr)) {
                for (var j = 0, k = arr.length; j < k; j++) {
                    elements = elements.concat(arr[j]);
                }
            }
            else {
                elements = elements.concat(arguments[i]);
            }
        }

        if (elements.length > 3) {
            elements.length = 3;
        }

        switch (elements.length) {
            case 0:
                elements[0] = 0;
                elements[1] = 0;
                elements[2] = 0;
                break;
            case 1:
                elements[1] = elements[0];
                elements[2] = elements[0];
                break;
            case 2:
                elements[2] = 0;
                break;
        }

        elements = new Float32Array(elements);

        Object.defineProperties(elements, {
            'x': {
                get: MathJS.getEle1,
                set: MathJS.setEle1
            },
            'y': {
                get: MathJS.getEle2,
                set: MathJS.setEle2
            },
            'z': {
                get: MathJS.getEle3,
                set: MathJS.setEle3
            },
            'xy': {
                get: MathJS.getEle12,
                set: MathJS.setEle12
            },
            'r': {
                get: MathJS.getEle1,
                set: MathJS.setEle1
            },
            'g': {
                get: MathJS.getEle2,
                set: MathJS.setEle2
            },
            'b': {
                get: MathJS.getEle3,
                set: MathJS.setEle3
            },
            'rg': {
                get: MathJS.getEle12,
                set: MathJS.setEle12
            }
        });

        return elements;
    };


    /**
     * Sub vectors
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec3.sub = function(v1, v2, dest) {

        dest || (dest = vec3());

        dest[0] = v1[0] - v2[0];
        dest[1] = v1[1] - v2[1];
        dest[2] = v1[2] - v2[2];
        return dest;
    };

    /**
     * Add vectors
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec3.add = function(v1, v2, dest) {

        dest || (dest = vec3());

        dest[0] = v1[0] + v2[0];
        dest[1] = v1[1] + v2[1];
        dest[2] = v1[2] + v2[2];
        return dest;
    };

    /**
     * Copy vector.
     * @param {Float32Array} v1
     * @param {Float32Array} dest
     */
    vec3.copy = function(v, dest) {

        dest || (dest = vec3());

        dest[0] = v[0];
        dest[1] = v[1];
        dest[2] = v[2];

        return dest;
    };

    /**
     * Calc norm from vector.
     * @param {Float32Array} v
     */
    vec3.norm = function(v) {
        var x = v[0], y = v[1], z = v[2];
        return sqrt(x * x + y * y + z * z);
    };

    /**
     * Calc length no sqrt.
     * @param {Float32Array} v
     */
    vec3.lengthSqr = function (v) {
        var x = v[0], y = v[1], z = v[2];
        return x * x + y * y + z * z;
    };

    /**
     * Normalized vector
     * @param {Float32Array} v
     */
    vec3.normalize = function(v) {
        var nrm = vec3.norm(v);

        if (nrm !== 0) {
            nrm = 1 / nrm;
            v[0] *= nrm;
            v[1] *= nrm;
            v[2] *= nrm;
        }

        return v;
    };

    /**
     * Multiply vectors.
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec3.multiply = function(v1, v2, dest) {

        dest || (dest = vec3());

        dest[0] = v1[0] * v2[0];
        dest[1] = v1[1] * v2[1];
        dest[2] = v1[2] * v2[2];
        return dest;
    };

    /**
     * Multiple scalar
     * @param {Float32Array} v
     * @param {number} s
     * @param {Float32Array} dest
     */
    vec3.multiplyScalar = function(v, s, dest) {

        dest || (dest = vec3());

        dest[0] = v[0] * s;
        dest[1] = v[1] * s;
        dest[2] = v[2] * s;

        return dest;
    };

    /**
     * Multiple scalar with -1 to inverse vector sign.
     * @param {Float32Array} v vec3
     * @param {Float32Array} dest vec3
     */
    vec3.minus = function (v, dest) {

        dest || (dest = vec3());

        dest[0] = -v[0];
        dest[1] = -v[1];
        dest[2] = -v[2];

        return dest;
    };

    /**
     * Calc dot
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     */
    vec3.dot = function(v1, v2) {

        var v1x = v1[0],
            v1y = v1[1],
            v1z = v1[2],

            v2x = v2[0],
            v2y = v2[1],
            v2z = v2[2];

        return v1x * v2x + v1y * v2y + v1z * v2z;
    };

    /**
     * Calc cross
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec3.cross = function(v1, v2, dest) {

        dest || (dest = vec3());

        var v1x = v1[0],
            v1y = v1[1],
            v1z = v1[2],

            v2x = v2[0],
            v2y = v2[1],
            v2z = v2[2];

        dest[0] = (v1y * v2z) - (v1z * v2y);
        dest[1] = (v1z * v2x) - (v1x * v2z);
        dest[2] = (v1x * v2y) - (v1y * v2x);

        return dest;
    };

    /**
     * Applay matrix for the vector.
     * @param {Float32Array} v
     * @param {Float32Array} mat
     * @param {Float32Array} dest
     */
    vec3.applyMatrix3 = function(v, mat, dest) {

        dest || (dest = vec3());

        var x = v[0],
            y = v[1],
            z = v[2];

        dest[0] = mat[0] * x + mat[3] * y + mat[6] * z;
        dest[1] = mat[1] * x + mat[4] * y + mat[7] * z;
        dest[2] = mat[2] * x + mat[5] * y + mat[8] * z;

        return dest;
    };

    /**
     * Applay matrix for the vector.
     * @param {Float32Array} v
     * @param {Float32Array} mat
     * @param {Float32Array} dest
     */
    vec3.applyMatrix4 = function(v, mat, dest) {

        dest || (dest = vec3());

        var x = v[0],
            y = v[1],
            z = v[2];

        dest[0] = mat[0] * x + mat[4] * y + mat[8]  * z + mat[12];
        dest[1] = mat[1] * x + mat[5] * y + mat[9]  * z + mat[13];
        dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];

        return dest;
    };

    /**
     * 射影投影座標変換
     *
     * 計算された座標変換行列をスクリーンの座標系に変換するために計算する
     * 基本はスケーリング（&Y軸反転）と平行移動。
     * 行列で表すと
     * w = width  / 2
     * h = height / 2
     * とすると
     *             |w  0  0  0|
     * M(screen) = |0 -h  0  0|
     *             |0  0  1  0|
     *             |w  h  0  1|
     *
     * 4x4の変換行列を対象の1x4行列[x, y, z, 1]に適用する
     * 1x4行列と4x4行列の掛け算を行う
     *
     * |@_11 @_12 @_13 @_14|   |x|
     * |@_21 @_22 @_23 @_24| x |y|
     * |@_31 @_32 @_33 @_34|   |z|
     * |@_41 @_42 @_43 @_44|   |1|
     *
     * @_4nは1x4行列の最後が1のため、ただ足すだけになる
     *
     * @param {Float32Array} v
     * @param {Float32Array} mat
     * @param {Array} dest
     */
    vec3.applyProjection = function(v, mat, dest) {

        dest || (dest = vec3());

        var w, x, y, z, _w, _x, _y, _z;

        x = v[0];
        y = v[1];
        z = v[2];

        w = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];

        //wで除算するため、予め割った値を入れておく
        _w = 1 / w;

        _x = mat[0] * x + mat[4] * y + mat[8]  * z + mat[12] /* (* 1)のため省略 */;
        _y = mat[1] * x + mat[5] * y + mat[9]  * z + mat[13] /* (* 1)のため省略 */;
        _z = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] /* (* 1)のため省略 */;

        if (!(((-w <= _x && _x <= w)) || ((-w <= _y && _y <= w)) || ((-w <= _z && _z <= w)))) {
            return false;
        }

        dest[0] = _x * _w;
        dest[1] = _y * _w;
        dest[2] = _z * _w;

        return dest;
    };

    /**
     * @param {Float32Array} from
     * @param {Float32Array} to
     * @return {number} angle number as radian.
     */
    vec3.lookAtRad = (function () {

        var zero = vec3.zero;

        function lookAtRad(from, to) {

            if (vec3.equal(from, zero)) {
                from = vec3.zero;
                from[0] = 0.00001;
            }

            var sub = vec3.normalize(vec3.sub(to, from));
            var fromCopy = vec3.normalize(vec3.copy(from));
            var rad = vec3.dot(sub, fromCopy);

            return acos(rad);
        }

        return lookAtRad;
    }());

    /**
     * @param {Float32Array} from
     * @param {Float32Array} to
     * @return {number} angle number as degrees.
     */
    vec3.lookAtDeg = function (from, to) {
        var rad = vec3.lookAtRad(from, to);
        return rad * 180 / PI;
    };

    /**
     * To string vector.
     * @param {Float32Array} v
     * @return {string}
     */
    vec3.toString = function(v) {
        return '' + v[0] + ',' + v[1] + ',' + v[2];
    };

    /*!--------------------------------------------------
      EXPORTS
      ----------------------------------------------------- */
    exports.vec3 = vec3;

}(window, document, window));

(function (win, doc, exports) {

    'use strict';

    var sqrt = Math.sqrt;

    /**
     * vec4 class
     * @constructor
     * @class
     * @param {number} x Component of x.
     * @param {number} y Component of y.
     * @param {number} z Component of z.
     * @param {number} w Component of w.
     */
    function vec4() {
        return vec4.create.apply(vec4, arguments);
    }

    ///////////////////////////////////////////////////////////////////

    Object.defineProperty(vec4, 'zero', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec4(0, 0, 0, 1); }
    });

    Object.defineProperty(vec4, 'up', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec4(0, 1, 0, 1); }
    });

    Object.defineProperty(vec4, 'down', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec4(0, -1, 0, 1); }
    });

    Object.defineProperty(vec4, 'forward', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec4(0, 0, 1, 1); }
    });

    Object.defineProperty(vec4, 'back', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec4(0, 0, -1, 1); }
    });

    Object.defineProperty(vec4, 'right', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec4(1, 0, 0, 1); }
    });

    Object.defineProperty(vec4, 'left', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec4(-1, 0, 0, 1); }
    });

    ///////////////////////////////////////////////////////////////////

    /**
     * Check to equal values.
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     */
    vec4.equal = function(v1, v2) {
        var v1x = v1[0],
            v1y = v1[1],
            v1z = v1[2],
            v1w = v1[3],

            v2x = v2[0],
            v2y = v2[1],
            v2z = v2[2],
            v2w = v2[3];

        return (v1x === v2x) && (v1y === v2y) && (v1z === v2z) && (v1w === v2w);
    };

    /**
     * Create values to x,y,z
     * @param {number|Array.<number>} x
     * @param {?number} y
     * @param {?number} z
     * @param {?number} w
     */
    vec4.create = function() {

        var elements = [],
            arr;

        for (var i = 0, l = arguments.length; i < l; i++) {
            arr = arguments[i];
            if (Float32Array.prototype.isPrototypeOf(arr)) {
                for (var j = 0, k = arr.length; j < k; j++) {
                    elements = elements.concat(arr[j]);
                }
            }
            else {
                elements = elements.concat(arguments[i]);
            }
        }

        if (elements.length > 4) {
            elements.length = 4;
        }

        switch (elements.length) {
            case 0:
                elements[0] = 0;
                elements[1] = 0;
                elements[2] = 0;
                elements[3] = 0;
                break;
            case 1:
                elements[1] = elements[0];
                elements[2] = elements[0];
                elements[3] = elements[0];
                break;
            case 2:
                elements[2] = 0;
                elements[3] = 0;
                break;
            case 3:
                elements[3] = 0;
                break;
        }

        elements = new Float32Array(elements);

        //if (Array.isArray(x) || Float32Array.prototype.isPrototypeOf(x)) {
        //    elements = new Float32Array(x);
        //}
        //else if (x === undefined) {
        //    elements = [0, 0, 0, 0];
        //}
        //else if (y === undefined) {
        //    elements = [x, x, x, x];
        //}
        //else if (z === undefined) {
        //    elements = [x, y, 0, 0];
        //}
        //else if (w === undefined) {
        //    elements = [x, y, z, 0];
        //}
        //else {
        //    elements = [x, y, z, w];
        //}

        //ret = new Float32Array(elements);

        Object.defineProperties(elements, {
            'x': {
                get: MathJS.getEle1,
                set: MathJS.setEle1
            },
            'y': {
                get: MathJS.getEle2,
                set: MathJS.setEle2
            },
            'z': {
                get: MathJS.getEle3,
                set: MathJS.setEle3
            },
            'w': {
                get: MathJS.getEle4,
                set: MathJS.setEle4
            },
            'xy': {
                get: MathJS.getEle12,
                set: MathJS.setEle12
            },
            'xyz': {
                get: MathJS.getEle123,
                set: MathJS.setEle123
            },
            'r': {
                get: MathJS.getEle1,
                set: MathJS.setEle1
            },
            'g': {
                get: MathJS.getEle2,
                set: MathJS.setEle2
            },
            'b': {
                get: MathJS.getEle3,
                set: MathJS.setEle3
            },
            'rg': {
                get: MathJS.getEle12,
                set: MathJS.setEle12
            },
            'rgb': {
                get: MathJS.getEle123,
                set: MathJS.setEle123
            }
        });

        return elements;
    };


    vec4.sub = function(v1, v2, dest) {
        dest[0] = v1[0] - v2[0];
        dest[1] = v1[1] - v2[1];
        dest[2] = v1[2] - v2[2];
        dest[3] = v1[3] - v2[3];
        return deset;
    };

    vec4.add = function(v1, v2, dest) {
        dest[0] = v1[0] + v2[0];
        dest[1] = v1[1] + v2[1];
        dest[2] = v1[2] + v2[2];
        dest[3] = v1[3] + v2[3];
        return dest;
    };

    /**
     * Copy vector.
     * @param {vec4} v
     */
    vec4.copy = function(v, dest) {
        dest[0] = v[0];
        dest[1] = v[1];
        dest[2] = v[2];
        dest[3] = (v[3] !== undefined) ? v[3] : 1;
        return this;
    };

    /**
     * Calc length.
     * @param {Float32Array} v
     */
    vec4.norm = function(v) {
        var x = v[0], y = v[1], z = v[2], w = v[3];
        return sqrt(x * x + y * y + z * z + w * w);
    };

    /**
     * Calc length without sqrt function.
     * @param {Float32Array} v
     */
    vec4.lengthSqr = function (v) {
        var x = v[0], y = v[1], z = v[2], w = v[3];
        return x * x + y * y + z * z + w * w;
    };

    vec4.normalize = function(v) {

        var nrm = vec4.norm(v);

        if (nrm !== 0) {
            nrm = 1 / nrm;
            v[0] *= nrm;
            v[1] *= nrm;
            v[2] *= nrm;
            v[3] *= nrm;
        }
        else {
            v[0] = 0;
            v[1] = 0;
            v[2] = 0;
            v[3] = 1;
        }

        return v;
    };

    /**
     * Multiple scalar
     * @param {Float32Array} v
     * @param {number} s
     * @param {Float32Array} dest
     */
    vec4.multiplyScalar = function(v, s, dest) {

        dest || (dest = vec4());

        dest[0] = v[0] * s;
        dest[1] = v[1] * s;
        dest[2] = v[2] * s;
        dest[3] = v[3] * s;

        return dest;
    };

    /**
     * Multiple scalar with -1 to inverse vector sign.
     * @param {Float32Array} v vec4
     * @param {Float32Array} dest vec4
     */
    vec4.minus = function (v, dest) {

        dest || (dest = vec4());

        dest[0] = -v[0];
        dest[1] = -v[1];
        dest[2] = -v[2];
        dest[3] = -v[3];

        return dest;
    };

    /**
     * Calc dot
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     */
    vec4.dot = function(v1, v2) {

        var v1x = v1[0],
            v1y = v1[1],
            v1z = v1[2],
            v1w = v1[3],

            v2x = v2[0],
            v2y = v2[1],
            v2z = v2[2];
            v2w = v2[3];

        return v1x * v2x + v1y * v2y + v1z * v2z + v1w * v2w;
    };

    /**
     * Applay matrix for the vector.
     * @param {Float32Array} v
     * @param {Float32Array} mat
     * @param {Float32Array} dest
     */
    vec4.applyMatrix4 = function(v, mat, dest) {

        dest || (dest = mat4());

        var x = v[0],
            y = v[1],
            z = v[2],
            w = v[3];

        dest[0] = mat[0] * x + mat[4] * y + mat[8]  * z + mat[12] * w;
        dest[1] = mat[1] * x + mat[5] * y + mat[9]  * z + mat[13] * w;
        dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
        dest[3] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;

        return dest;
    };

    /**
     * To string vector.
     * @param {Float32Array} v
     * @return {string}
     */
    vec4.toString = function(v) {
        return '' + v[0] + ',' + v[1] + ',' + v[2] + ',' + v[3];
    };

    /*!--------------------------------------------------
      EXPORTS
      ----------------------------------------------------- */
    exports.vec4 = vec4;

}(window, document, window));

(function () {
    'use strict';

    function Plane(width, height, row, column, color) {
        var position = [];
        var normal   = [];
        var colorArr = [];
        var st       = [];
        var index    = [];

        for (var col_i = 0; col_i <= column; col_i++) {
            for (var row_i = 0; row_i <= row; row_i++) {
                var rowUnit = (row_i / row) * 2 - 1;
                var colUnit = -((col_i / column) * 2 - 1);
                var x = width  * colUnit;
                var z = height * rowUnit;
                var stx = -((1 / column) * col_i);
                var stz = (1 / row) * row_i;

                var tc = color ? color : [1, 1, 1, 1];

                position.push(x, 0, z);
                normal.push(0, 1, 0);
                colorArr.push(tc[0], tc[1], tc[2], tc[3]);
                st.push(stx, stz);
            }
        }

        // Generate indecies.
        for (col_i = 0; col_i < column; col_i++) {
            for (row_i = 0; row_i < row; row_i++) {
                var base = ((column + 1) * row_i) + col_i;
                var idx0 = base;
                var idx1 = base + 1;
                var idx2 = base + column + 1;
                var idx3 = base + column + 2;

                index.push(idx0, idx1, idx2);
                index.push(idx3, idx2, idx1);
            }
        }

        this.position     = position;
        this.normal       = normal;
        this.color        = colorArr;
        this.textureCoord = st;
        this.index        = index;
    }

    /*! ----------------------------------------------------
        EXPORTS.
    -------------------------------------------------------- */
    window.Plane = Plane;

}());

(function () {
    'use strict';

    /**
     * Create a sphere.
     *
     * 極地から順に徐々に赤道へ角度を増やしながら、
     * 球体の円周上に頂点を生成していく。
     *
     * @param {number} row
     * @param {number} column
     * @param {number} radius
     * @param {Array<number>} color
     *
     * @return {Object}
     */
    function Sphere(row, column, radius, color) {
        var position = [];
        var normal   = [];
        var colorArr = [];
        var st       = [];
        var index    = [];

        // Generate position, normal, color, texture coord.
        for (var row_i = 0; row_i <= row; row_i++) {
            var r  = Math.PI / row * row_i;
            var ry = Math.cos(r);
            var rr = Math.sin(r);

            for (var col_i = 0; col_i <= column; col_i++) {
                var tr = Math.PI * 2 / column * col_i;

                var tx = rr * radius * Math.cos(tr);
                var ty = ry * radius;
                var tz = rr * radius * Math.sin(tr);

                var rx = rr * Math.cos(tr);
                var rz = rr * Math.sin(tr);

                var tc = color ? color : [1, 1, 1, 1];

                position.push(tx, ty, tz);
                normal.push(rx, ry, rz);
                colorArr.push(tc[0], tc[1], tc[2], tc[3]);
                st.push(1 - 1 / column * col_i, 1 / row * row_i);
            }
        }

        // Generate indecies.
        for (r = 0, row_i = 0; row_i < row; row_i++) {
            for (col_i = 0; col_i < column; col_i++) {
                r = (column + 1) * row_i + col_i;
                var idx0 = r;
                var idx1 = r + 1;
                var idx2 = r + column + 2;
                var idx3 = r + column + 1;
                index.push(idx0, idx1, idx2);
                index.push(idx0, idx2, idx3);
            }
        }

        this.position     = position;
        this.normal       = normal;
        this.color        = colorArr;
        this.textureCoord = st;
        this.index        = index;
    }

    /*! ----------------------------------------------------
        EXPORTS.
    -------------------------------------------------------- */
    window.Sphere = Sphere;

}());

(function () {
    'use strict';

    function Torus(row, column, irad, orad, color) {
        var position = [];
        var normal   = [];
        var colorArr = [];
        var st       = [];
        var index    = [];

        for (var row_i = 0; row_i <= row; row_i++) {
            var r  = Math.PI * 2 / row * row_i;
            var rr = Math.cos(r);
            var ry = Math.sin(r);

            for (var col_i = 0; col_i <= column; col_i++) {
                var tr = Math.PI * 2 / column * col_i;
                var tx = (rr * irad + orad) * Math.cos(tr);
                var ty = ry * irad;
                var tz = (rr * irad + orad) * Math.sin(tr);

                var rx = rr * Math.cos(tr);
                var rz = rr * Math.sin(tr);

                var tc = color ? color : [1, 1, 1, 1];

                var rs = 1 / column * col_i;
                var rt = 1 / row * row_i + 0.5;

                if (rt > 1.0) {
                    rt -= 1.0;
                }

                rt = 1.0 - rt;

                position.push(tx, ty, tz);
                normal.push(rx, ry, rz);
                colorArr.push(tc[0], tc[1], tc[2], tc[3]);
                st.push(rs, rt);
            }
        }

        for (row_i = 0; row_i < row; row_i++) {
            for (col_i = 0; col_i < column; col_i++) {
                r = (column + 1) * row_i + col_i;
                var idx0 = r;
                var idx1 = r + column + 1;
                var idx2 = r + 1;
                var idx3 = r + column + 2;
                index.push(idx0, idx1, idx2);
                index.push(idx1, idx3, idx2);
            }
        }

        this.position     = position;
        this.normal       = normal;
        this.color        = colorArr;
        this.textureCoord = st;
        this.index        = index;
    }

    /*! --------------------------------------------------------
        EXPORTS.
    ------------------------------------------------------------ */
    window.Torus = Torus;

}());

(function (win, doc, exports) {

    'use strict';

    function Xorshift(seed) {

        var i, t, vec, w, x, y, z, _i;

        if (seed == null) {
            seed = +new Date();
        }

        x = 123456789;
        y = 362436069;
        z = 521288629;
        w = 88675123;
        t = 0;
        vec = [1812433254, 3713160357, 3109174145, 64984499];

        for (i = _i = 0; _i <= 4; i = ++_i) {
            vec[i - 1] = seed = 1812433253 * (seed ^ (seed >> 30)) + i;
        }

        this.random = function() {
            var _ref;
            t = vec[0];
            w = vec[3];
            _ref = [vec[1], vec[2], w], vec[0] = _ref[0], vec[1] = _ref[1], vec[2] = _ref[2];
            t ^= t << 11;
            t ^= t >> 8;
            w ^= w >> 19;
            w ^= t;
            vec[3] = w;
            return w * 2.3283064365386963e-10;
        };
    }

    ////////////////////////////////

    function PerlinNoise(seed, octave) {
        var i, p, _i, _j, _p;

        this.octave = octave != null ? octave : 1;

        random = new Xorshift(seed).random;

        _p = [];
        for (i = _i = 0; _i < 256; i = ++_i) {
            _p[i] = floor(random() * 256);
        }

        p = new Array(512);

        for (i = _j = 0; _j < 512; i = ++_j) {
            p[i] = _p[i & 255];
        }

        this.p = p;
    }

    PerlinNoise.prototype._noise = function(x, y, z) {
        var A, AA, AB, B, BA, BB, X, Y, Z, p, u, v, w;
        if (y == null) {
            y = 0;
        }
        if (z == null) {
            z = 0;
        }
        X = floor(x) & 255;
        Y = floor(y) & 255;
        Z = floor(z) & 255;
        x -= floor(x);
        y -= floor(y);
        z -= floor(z);
        u = this.fade(x);
        v = this.fade(y);
        w = this.fade(z);
        p = this.p;
        A = p[X + 0] + Y;
        AA = p[A] + Z;
        AB = p[A + 1] + Z;
        B = p[X + 1] + Y;
        BA = p[B] + Z;
        BB = p[B + 1] + Z;
        return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(p[AA + 0], x + 0, y + 0, z + 0), this.grad(p[BA + 0], x - 1, y + 0, z + 0)), this.lerp(u, this.grad(p[AB + 0], x + 0, y - 1, z + 0), this.grad(p[BB + 0], x - 1, y - 1, z + 0))), this.lerp(v, this.lerp(u, this.grad(p[AA + 1], x + 0, y + 0, z - 1), this.grad(p[BA + 1], x - 1, y + 0, z - 1)), this.lerp(u, this.grad(p[AB + 1], x + 0, y - 1, z - 1), this.grad(p[BB + 1], x - 1, y - 1, z - 1))));
    };

    PerlinNoise.prototype.fade = function(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    };

    PerlinNoise.prototype.lerp = function(t, a, b) {
        return a + t * (b - a);
    };

    PerlinNoise.prototype.grad = function(hash, x, y, z) {
        var h, u, v;
        h = hash & 15;
        u = h < 8 ? x : y;
        v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    };

    PerlinNoise.prototype.octaves = function(octave) {
        if (octave) {
            return this.octave = octave;
        } else {
            return this.octave;
        }
    };

    PerlinNoise.prototype.noise = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        switch (args.length) {
            case 1:
                return this.octaveNoise1.apply(this, arguments);
            case 2:
                return this.octaveNoise2.apply(this, arguments);
            case 3:
                return this.octaveNoise3.apply(this, arguments);
        }
    };

    PerlinNoise.prototype.octaveNoise1 = function(x) {
        var amp, i, result, _i, _ref;
        result = 0.0;
        amp = 1.0;
        for (i = _i = 0, _ref = this.octave; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            result += this._noise(x) * amp;
            x *= 2.0;
            amp *= 0.5;
        }
        return result;
    };

    PerlinNoise.prototype.octaveNoise2 = function(x, y) {
        var amp, i, result, _i, _ref;
        result = 0.0;
        amp = 1.0;
        for (i = _i = 0, _ref = this.octave; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            result += this._noise(x, y) * amp;
            x *= 2.0;
            y *= 2.0;
            amp *= 0.5;
        }
        return result;
    };

    PerlinNoise.prototype.octaveNoise3 = function(x, y, z) {
        var amp, i, result, _i, _ref;
        result = 0.0;
        amp = 1.0;
        for (i = _i = 0, _ref = this.octave; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            result += this._noise(x, y, z) * amp;
            x *= 2.0;
            y *= 2.0;
            z *= 2.0;
            amp *= 0.5;
        }
        return result;
    };

    /*!--------------------------------------------------
      EXPORTS
      ----------------------------------------------------- */
    exports.PerlinNoise = PerlinNoise;
    exports.Xorshift = Xorshift;

}(window, document, window));
