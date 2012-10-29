(function() {
    
    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype;

    var toString = ObjProto.toString,
        slice = ArrayProto.slice;
        
    var ctor = function(){};

    var _ = {};

    var breaker = {};

    // 返回对象的类型
    var type = _.type = function(obj) {
        var type;
        if (obj === null) {
            type = String(obj);
        } else if(typeof obj === 'undefined') {
            return 'undefined';
        } else {
            type = toString.call(obj).toLowerCase();
            type = type.substring(8, type.length - 1);
        }
        return type;
    };

    // 是否是数组
    // 委派给原生Array.isArray处理
    var isArray = _.isArray = Array.isArray;

    // 是否是对象
    var isObject = _.isObject = function(obj) {
        return obj === Object(obj);
    };

    // 是否是arguments对象
    var isArguments = _.isArguments = function(obj) {
        return type(obj) === 'arguments';
    };

    // 是否是函数
    var isFunction = _.isFunction = function(obj) {
        return type(obj) === 'function';
    };

    // 是否字符串
    var isString = _.isString = function(obj) {
        return type(obj) == 'string';
    };

    // 是否数值
    var isNumber = _.isNumber = function(obj) {
        return type(obj) === 'number';
    };

    // 是否数字是有穷的
    // 无穷 false，有穷 true
    var isFinite = _.isFinite = function(obj) {
        return isNumber(obj) && window.isFinite(obj);
    };

    // 是否不是数值
    var isNaN = _.isNaN = function(obj) {
        // `NaN` is the only value for which `===` is not reflexive.
        return obj !== obj;
    };

    // 是否是布尔值
    var isBoolean = _.isBoolean = function(obj) {
        return obj === true || obj === false || type(obj) === 'boolean';
    };

    // 是否是日期类型
    var isDate = _.isDate = function(obj) {
        return type(obj) === 'date';
    };

    // 是否是正则表达式
    var isRegExp = _.isRegExp = function(obj) {
        return type(obj) === 'regexp';
    };

    // 是否等于null
    var isNull = _.isNull = function(obj) {
        return obj === null;
    };

    // 是否未定义
    var isUndef = _.isUndef = _.isUndefined = function(obj) {
        return obj === void 0;
    };

    // 是否已经定义
    var isDef = _.isDef = _.isDefined = function(obj) {
        return !isUndef(obj);
    };

    // 遍历
    var each = _.each = _.forEach = function(obj, iterator, context) {
        if (obj === null) {
            return;
        }
        if (ObjProto.forEach && obj.forEach === ObjProto.forEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
            }
        } else {
            for (var key in obj) {
                if (iterator.call(context, obj[key], key, obj) === breaker) return;
            }
        }
    };

    // 扩展方法
    var extend = _.extend = function(obj) {
        each(slice.call(arguments, 1), function(source) {
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        });
        return obj;
    };

    // 将方法的 this 绑定为指定的对象
    var bind = _.bind = function(fn, context) {
        var args;
        if (FuncProto.bind) {
            return FuncProto.bind.apply(fn, slice.call(arguments, 1));
        } else {
            args = slice.call(arguments, 2);
            var bound = function() {
                if (!(this instanceof bound)) return fn.apply(context, args.concat(slice.call(arguments)));
                ctor.prototype = func.prototype;
                var self = new ctor;
                var result = func.apply(self, args.concat(slice.call(arguments)));
                if (Object(result) === result) return result;
                return self;
            };
            return bound;
        }
    };

    window._ = _;

})();