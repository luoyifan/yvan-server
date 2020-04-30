"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var ServiceBeans = {};
    var deferList = [];

    function IdField(name, option) {
        return function (targetPrototype, propertyKey) {
            if (!targetPrototype.__cols) {
                targetPrototype.__cols = {};
            }
            option = Object.assign({
                insertIgnore: false,
                updateIgnore: false,
            }, option)
            targetPrototype.__cols[propertyKey] = { field: name, isId: true, option: option };
        }
    };

    function TableField(name, option) {
        return function (targetPrototype, propertyKey) {
            if (!targetPrototype.__cols) {
                targetPrototype.__cols = {};
            }
            option = Object.assign({
                insertIgnore: false,
                updateIgnore: false,
            }, option)
            targetPrototype.__cols[propertyKey] = { field: name, isId: false, option: option };
        }
    };

    function TableName(name) {
        return function (target) {
            target.prototype._tableName = name;
        }
    };

    function Service(options) {
        function body(targetFunction) {
            var newInstance = new targetFunction();
            var beanName = exports.Utils.getClassName(newInstance);
            // console.log(__LINE__, __FILE__, "@Service [" + beanName + "]");
            ServiceBeans[beanName.toUpperCase()] = newInstance;
            targetFunction.prototype._instance = newInstance;
        }

        if (typeof options === 'function') {
            return body(options);
        }
        return body
    };

    function Autowired(targetPrototype, propName) {
        defer(function () {

            var serviceInstance;
            // 从反射中获取
            var targetFunction = Reflect.getMetadata("design:type", targetPrototype, propName);
            if (targetFunction) {
                serviceInstance = targetFunction.prototype._instance
            } else {
                // 反射中没有找到，就按 propName 从 ServiceBeans 中找
                serviceInstance = ServiceBeans[propName.toUpperCase()];
            }
            //console.log(__LINE__, __FILE__,
            //    "@Inject " + Server.getClassName(targetPrototype._instance) +
            //    "[" + propName + "] = " + Server.getClassName(serviceInstance));
            targetPrototype._instance[propName] = serviceInstance;
        })
    };

    function defer(func, args) {
        deferList.push({ func: func, args: args });
    }

    function _runAndClearDefer() {
        var obj = deferList.shift();
        while (obj) {
            obj.func.apply(null, obj.args);
            obj = deferList.shift();
        }
    }

    exports.Dao = Java.type('com.yvan.serverless.dao.DaoFunctions').INSTANCE;
    exports.ES = Java.type('com.yvan.serverless.es.ESFunction').INSTANCE;
    exports.Server = Java.type('com.yvan.serverless.ServerUtils').INSTANCE;
    exports.Utils = Java.type('com.yvan.serverless.JavaUtils').INSTANCE;
    exports.TableName = TableName
    exports.TableField = TableField
    exports.IdField = IdField
    exports.Service = Service
    exports.Repository = Service
    exports.Component = Service
    exports.Autowired = Autowired
    exports.Api = {}
    exports.Transactional = {}
    exports.Cacheable = {}
    exports.CacheEvict = {}
    exports.Desc = {}
    exports.BigDecimal = Java.type('java.math.BigDecimal');
    exports.JodaTime = Java.type('org.joda.time.DateTime');
    exports.PageDb = Java.type('com.yvan.mybatis.PageDb');
    exports.console = Java.type('com.yvan.serverless.console.ConsoleFunctions').INSTANCE;
    exports.ServiceBeans = ServiceBeans;
    exports.defer = defer;
    exports._runAndClearDefer = _runAndClearDefer;
})();