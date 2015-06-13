(function(exports) {
    var registsMap = {},
        vModels = {},
        PREFIX = "isi-",
        SUB_NAME = "isi-subscribers",
        REG_NAME = "isi-regists";

    /*----------- define ------------------*/
    var MVVM = function() {};
    MVVM.define = function(name, factory) {
        var scope = {};
        factory(scope);
        var model = modelFactory(scope);
        factory(model);
        model.$id = name;
        return vModels[name] = model;
    }
    /* @param scope {object}: vm工厂方法生成的对象
     * @return vModel {object}: scope各property的set,get方法被劫持了后的对象。
     */
    function modelFactory(scope) {
        var vModel = {},
            originalModel = {},
            accessingProperties = {};
        // originalModel保存vm的属性, accessingProperties保存属性的accessor(及属性的订阅者)
        for(var prop in scope) {
            resolveAccess(prop, scope[prop], originalModel, accessingProperties);
        }
        // 关键！劫持需要access的属性的set,get方法！vModel = {prop1:{set:...,get:...},...}
        vModel = Object.defineProperties(vModel,withValue(accessingProperties));
        // 
        vModel.$id = generateId();
        vModel.$accessors = accessingProperties;
        vModel.$originalModel = originalModel;
        vModel[SUB_NAME] = [];
        return vModel;
    }
    /* @param prop {string}: property name of vm
     * @param val {number,function,string...}: value of vm[prop]
     * @param originalModel {object}: 真正存vm值的对象
     * @param accessingProperties {object}: 
     */
    function resolveAccess(prop, val, originalModel, accessingProperties) {
        originalModel[prop] = val;
        var valueType = typeof val;
        if(valueType === 'function') {
            return;
        }
        if(valueType === 'number') {
            accessor = function(newVal) {
                var preVal = originalModel[prop];
                if(arguments.length) { //set
                    if( preVal !== newVal ) {
                        originalModel[prop] = newVal;
                        notifySubscribers(accessor);
                    }
                } else { //get
                    collectSubscribers(accessor);
                    return accessor.$vmodel || preVal;
                }
            };
            accessor[SUB_NAME] = [];
            originalModel[prop] = val;
        }
        accessingProperties[prop] = accessor;
    }
    /* @param: accessor
     * @func: 把accessor[SUB_NAME]里的依赖binding object, 一个个执行data.evaluator,data.handler
     */
    function notifySubscribers(accessor) {
        var list = accessor[SUB_NAME];
        if(list && list.length) {
            var args = Array.prototype.slice.call(arguments,1);
            for(var i = list.length, binding; binding=list[--i]; ) {
                var elem = binding.element;
                binding.handler(binding.evaluator.apply(0, binding.args||[] ), elem, binding);
            }
        }
    }
    /* @param accessor {function} : getter,setter of a prop
     * @func: push binding object in registsMap into accessor[SUB_NAME]
     */
    function collectSubscribers(accessor) {
        if(registsMap[REG_NAME]) {
            var list = accessor[SUB_NAME];
            if(!list) {
                // 把注册的binding object加到accessor[SUB_NAME]里去
                ensure(list, registsMap[REG_NAME]);
            } else {
                list.push(registsMap[REG_NAME]);
            }
        }
    }
    /* @param accessingProperties {object}: {propX:accessorX, propY:accessorY}
     * @return descriptorsMap {object}: {propX:{set:accessorX,get:accessorY},..}
     * @func: 给每个需要access的属性，创建set,get方法
     */
    function withValue(accessingProperties) {
        var descriptorsMap = {};
        for(var prop in accessingProperties) {
            descriptorsMap[prop] = {
                get: accessingProperties[prop],
                set: accessingProperties[prop],
                enumerable: true,
                configurable: true
            }
        }
        return descriptorsMap;
    }
    /* @param targetArr {array}: array of subscribers
     * @param item: newly registed subscriber
     * @return targetArr {array}: array of subscribers
     */
    function ensure(targetArr, item) {
        if(targetArr.indexOf(item) === -1)
            targetArr.push(item);
        return targetArr;
    }
    function generateId() {
        return "id-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }    
    /*---------------------------------------------------------*/
    /*----------- scanTag ----------*/
    MVVM.scanTag = function(element, vModel) {
        // 假使通过parse, 取到了包含{{}}的元素<p>
        var myP = document.getElementById('my-p');
        var myBox = document.getElementById('my-box');
        binding1= {
            filters: undefined,
            element: myP,
            nodeType: 3,
            type: "text",
            value: "width"
        };
        binding2 = {
            type: "css",
            param: "width",
            name: "isi-css-width",
            value: "width",
            element: myBox
        };
        binding3 = {
            type: "click",
            param: "",
            name: "isi-click",
            value: "click",
            element: myBox,
        }
        executeBindings([binding1, binding2, binding3], vModels["MainController"]);
    };
    /* @param bindings {array} : bindings
     * @param vModel {object} : vModel
     * @func: exec bindingHandlers of text
     */
    function executeBindings(bindings, vModel) {
        bindings.forEach( function(binding){
            bindingHandlers[binding.type](binding,vModel);
        });
    }
    /* @param data {object} : binding object
     * @param vModel {object} : vModel
     * @func: parse expression of the binding
     */
    var bindingHandlers = {
        text : function(binding, vModel) {
            parseExprProxy(binding.value, vModel, binding);
        },
        css : function(binding, vModel) {
            parseExprProxy(binding.value, vModel, binding);
        },
        click : function(binding, vModel) {
            parseExprProxy(binding.value, vModel, binding);
        }
    };
    /* @param propName {string} : property name of the vm
     * @param scopes {object} : vModel
     * @param data {object} : binding object
     * @func: 1.生成data.evaluator 2.生成data.handler 3.注册事件
     * data.evaluator {function} : 获取vm中的值
     * data.handler {function} : 设置视图的值
     */
    function parseExprProxy(propName, scopes, binding) {
        // 生成data.evaluator
        parseExpr(propName, scopes, binding);
        if( binding.evaluator ) {
            binding.handler = bindingExcutors[binding.type];
            registerSubscriber(binding);
        }
    }
    /* @param propName {string} : property name of vm
     * @func: 1.vModel赋值给data.args 2.生成data.evaluator
     * data.evaluator {function}: 获取vm中的值 
     */
    function parseExpr(propName, scopes, binding) {
        var bindingType = binding.type, name = 'vm',
            prefix = 'var ' + binding.value + '=' + name + '.' + binding.value;
        binding.args = [scopes];
        if( bindingType === 'click' ) {
            var code = '\nreturn '  + binding.value + ';';
            var fn = Function.apply( function() {}, [name].concat("'use strict';\n" + prefix + ';' + code) );
            binding.args = [scopes];
        } else {
            var code = '\nreturn '  + binding.value + ';';
            var fn = Function.apply( function() {}, [name].concat("'use strict';\n" + prefix + ';' + code) );
        }
        // fn = function(vm) { var width = vm.width; return width; }
        binding.evaluator = fn;
    }
    /* @param val {number, string} : true value of html attr/innerHTML/text
     * @param elem {HTMLElement} : element that our frame dealing with
     * @param binding {object} : binding object
     * @func: 依靠binding object的设置，把elem的指定属性赋值为val
     */
    var bindingExcutors = {
        text : function(val, elem, binding) {
            elem.innerHTML= val;
        },
        css : function(val, elem, binding) {
            elem.style[binding.param] = val;
        },
        click: function(val, elem, binding) {
            var callback = function(e) {
                return binding.evaluator.apply(0, binding.args).call(this,e);
            }
            elem.addEventListener('click', callback, false);
            //binding.evaluator = binding.handler = function() {};
        }
    }
    /* @param binding {object} : binding object
     * @func: 1.registsMap持有data的引用 2.执行data.evaluator, data.handler
     */
    function registerSubscriber(binding) {
        registsMap[REG_NAME] = binding;
        var fn = binding.evaluator;
        if(fn) {
            binding.handler(fn.apply(0, binding.args), binding.element, binding);
        }
        delete registsMap[REG_NAME];
    }

    exports.MVVM = MVVM;
})(window);
