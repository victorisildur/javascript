var pubsub = (function() {
    var _callbacks = {};
    var pubsub = {
        sub: function(name, callback) {
            if( !_callbacks.hasOwnProperty(name) ) {
                _callbacks[name] = [];
            }
            _callbacks[name].push(callback);                
        },
        pub: function(name) {
            var args = Array.prototype.slice.call(arguments,1)
            if( _callbacks.hasOwnProperty(name) ) {
                _callbacks[name].forEach( function(callback) {
                    callback.apply(this, args);
                });
            }
        }
    }
    return pubsub;
})();


// model change --> publish view.change event
var Model = function(controllerName) {
    var model = {
        controllerName:controllerName,
        props: {},
        set: function(propName, value) {
            this.props[propName] = value;
            pubsub.pub('view.change', propName, value, this.controllerName);
        },
        get: function(propName) {
            return this.props[propName];
        }
    }
    // model.change event --> model data change
    pubsub.sub('model.change',function(propName, newVal, controllerName) {
        if(controllerName !== model.controllerName)
            return;
        model.set(propName,newVal);
    });
    return model;
}
// listener capture view changes --> publish model.change event
var changeHandler = function(event) {
    var controllerRange = event.currentTarget,
        controllerName = controllerRange.getAttribute('isi-controller');
    console.debug(controllerRange);
    
    var target = event.target,
        propName = target.getAttribute('data-bind');
    if( propName && propName !== '' ) {
        pubsub.pub('model.change', propName, target.value, controllerName);
    }
    event.stopPropagation();
}

/*----------- Init --------------*/
window.onload = function() {
    /* first step: 
     * find controllers' dom
     */
    var controllerRanges = document.querySelectorAll('[isi-controller]');
    /* second step: 
     * bind listeners for each controllers' range,
     * view.change event --> change each controllers' range
     */
    for(var i=0, len=controllerRanges.length; i<len; i++) {
        controllerRanges[i].addEventListener('change', changeHandler, false);
        // view.change event --> change view
        (function(index){
            pubsub.sub('view.change', function(propName, newVal, controllerName) {
                var elements = controllerRanges[index].querySelectorAll('[data-bind=' + propName +']'),
                    thisControllerName = controllerRanges[index].getAttribute('isi-controller'),
                    tagName;
                if(thisControllerName !== controllerName)
                    return;
                for(var i=0,l=elements.length; i<l; i++) {
                    tagName = elements[i].tagName.toLowerCase();
                    if(tagName==='input' || tagName==='textarea' || tagName==='select') {
                        elements[i].value = newVal;
                    } else {
                        elements[i].innerHTML = newVal;
                    }
                }
            });
        })(i);
    }
    /* third step:
     * execute each controller function
     */
    for(var i=0, len=controllerRanges.length; i<len; i++) {
        var controllerName = controllerRanges[i].getAttribute('isi-controller');
        eval(controllerName+'()');
    }
}

