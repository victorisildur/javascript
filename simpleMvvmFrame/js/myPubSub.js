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

// listener capture view changes --> publish model.change event
var changeHandler = function(event) {
    var target = event.target,
        propName = target.getAttribute('data-bind');
    if( propName && propName !== '' ) {
        pubsub.pub('model.change', propName, target.value);
    }
}
document.addEventListener('change', changeHandler, false);

// view.change event --> change view
pubsub.sub('view.change', function(propName, newVal) {
    var elements = document.querySelectorAll('[data-bind=' + propName +']'),
        tagName;
    for(var i=0,l=elements.length; i<l; i++) {
        tagName = elements[i].tagName.toLowerCase();
        if(tagName==='input' || tagName==='textarea' || tagName==='select') {
            elements[i].value = newVal;
        } else {
            elements[i].innerHTML = newVal;
        }
    }
});

// model change --> publish view.change event
var Model = function() {
    var model = {
        props: {},
        set: function(propName, value) {
            this.props[propName] = value;
            pubsub.pub('view.change', propName, value);
        },
        get: function(propName) {
            return this.props[propName];
        }
    }
    // model.change event --> model data change
    pubsub.sub('model.change',function(propName, newVal) {
        model.set(propName,newVal);
    });
    return model;
}
