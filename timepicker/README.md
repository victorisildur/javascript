# Install

```npm install zepto-timepicker```

# Usage

```javascript
$('#timepicker').timePicker(function(hour, min) {
    /* Callback when you click positive button.
       Now do whatever you want with hour and minutes!
     */
     console.debug('selected hour:min is %s:%s', hour, min);
});
```

Yes, that's all!
No css is required because they are built in by webpack.

It's webpack, browserify compatible, the plugin only depends on '$'.

# Prerequisites

* zepto.js
* zepto.js data module
* body should be 100% width and height, and its position shall not be static
* phone width be greater than 300px

# Comments

Sorry for no pictures and demos, coming soon.

However, $ needs to be a global symbol now, so it has some problem with webpack.