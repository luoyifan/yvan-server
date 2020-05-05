"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var ServiceBeans = {};
    var deferList = [];

    function IdField(name, type, option) {
        return function (targetPrototype, propertyKey) {
            if (!targetPrototype.__cols) {
                targetPrototype.__cols = {};
            }
            option = Object.assign({
                insertIgnore: false,
                updateIgnore: false,
            }, option)
            targetPrototype.__cols[propertyKey] = { field: name, type: type, isId: true, option: option };
        }
    };

    function TableField(name, type, option) {
        return function (targetPrototype, propertyKey) {
            if (!targetPrototype.__cols) {
                targetPrototype.__cols = {};
            }
            option = Object.assign({
                insertIgnore: false,
                updateIgnore: false,
            }, option)
            targetPrototype.__cols[propertyKey] = { field: name, type: type, isId: false, option: option };
        }
    };

    function TableName(name) {
        return function (target) {
            target.prototype._tableName = name;
        }
    };

    function ApiDector(typeName) {
        return (targetPrototype, propName) => {
            if (!Object.hasOwnProperty(targetPrototype, typeName)) {
                targetPrototype[typeName] = [propName];
            } else {
                targetPrototype[typeName].push(propName);
            }
        }
    }

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

    function javaToJsEntityList(prototype, javaListMap) {
        var ret = [];

        for (var idx in javaListMap) {
            var javaMap = javaListMap.get(idx);
            // console.debugIt(idx, javaMap);
            ret.push(javaToJsEntity(prototype, javaMap));
        }
        return ret;
    };

    function javaToJsEntity(entityFunction, javaMap) {
        var entity = new entityFunction();
        var prototype = entityFunction.prototype;

        // 根据声明类型转换目标
        // var targetFunction = Reflect.getMetadata("design:type", prototype, fieldName);

        for (var fieldName in prototype.__cols) {
            const meta = prototype.__cols[fieldName];
            if (!meta || !javaMap.containsKey(meta.field)) {
                continue;
            }

            let value = javaMap.get(meta.field);

            switch (meta.type) {
                case 'Double':
                    value = new exports.Double(value);
                    break

                case 'String':
                    value = (value ? value.toString() : '')
                    break

                case 'JodaTime':
                    value = new exports.JodaTime(value);
                    break

                case 'BigDecimal':
                    value = exports.BigDecimal.valueOf(value);
                    break

                case 'Boolean':
                    value = (value && value !== 'false' && value !== 'N' && value !== '0')
                    break

                case 'Integer':
                    value = parseInt(value)
                    break
            }
            /*
            // 根据声明类型转换目标. Reflect.getMetadata 有性能问题
            var targetFunction = Reflect.getMetadata("design:type", prototype, fieldName);
            if (Java.typeName(targetFunction) === 'java.math.BigDecimal') {
                try {
                    value = exports.BigDecimal.valueOf(value);
                } catch (e) {
                    value = exports.BigDecimal.ZERO;
                }

            } else if (Java.typeName(targetFunction) === 'org.joda.time.DateTime') {
                try {
                    value = new exports.JodaTime(value);
                } catch (e) {
                    value = undefined;
                }

            } else if (Java.typeName(targetFunction) === 'java.lang.Double') {
                value = new exports.Double(value);

            } else if (targetFunction.name === 'String') {
                value = (value ? value.toString() : '')

            } else if (targetFunction.name === 'Number') {
                value = parseInt(value)

            } else if (targetFunction.name === 'Boolean') {
                value = (!value || value === 'N' || value === '0')

            } else {
                // 什么都不做
                // value = _.toJavaObject(targetFunction.name);
            }
            */
            entity[fieldName] = value;
        }

        return entity;
    };

    exports.Dao = Java.type('com.yvan.serverless.dao.DaoFunctions').INSTANCE;
    exports.ES = Java.type('com.yvan.serverless.es.ESFunction').INSTANCE;
    exports.Server = Java.type('com.yvan.serverless.ServerUtils').INSTANCE;
    exports.Utils = Java.type('com.yvan.serverless.JavaUtils').INSTANCE;
    exports.Request = Java.type('com.yvan.serverless.RequestUtils').INSTANCE;
    exports.ModelOps = Java.type('com.yvan.serverless.model.ModelOpsGraalvm');
    exports.Model = Java.type('com.yvan.serverless.model.ModelGraalvm');
    exports.ModelPage = Java.type('com.yvan.serverless.model.ModelPageGraalvm');
    exports.TableName = TableName
    exports.TableField = TableField
    exports.IdField = IdField
    exports.Service = Service
    exports.Repository = Service
    exports.Component = Service
    exports.Autowired = Autowired
    exports.Api = ApiDector('__apis')
    exports.ApiDataSource = ApiDector('__apids')
    exports.Transactional = {}
    exports.Cacheable = {}
    exports.CacheEvict = {}
    exports.Desc = {}
    exports.BigDecimal = Java.type('java.math.BigDecimal');
    exports.JodaTime = Java.type('org.joda.time.DateTime');
    exports.Double = Java.type('java.lang.Double');
    exports.PageDb = Java.type('com.yvan.mybatis.PageDb');
    exports.console = Java.type('com.yvan.serverless.console.ConsoleFunctions').INSTANCE;
    exports.ServiceBeans = ServiceBeans;
    exports.javaToJsEntityList = javaToJsEntityList;
    exports.javaToJsEntity = javaToJsEntity;
    exports.defer = defer;
    exports._runAndClearDefer = _runAndClearDefer;
})();