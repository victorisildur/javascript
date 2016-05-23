/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var timerHtml = __webpack_require__(1),
	    timerStyle = __webpack_require__(2);


	var clickedComponent = null;

	$.fn.timePicker = function(callback) {
	    var shallBindEvt = false;
	    if ($('body').find('.js-timepicker').length === 0) {
	        $('body').append(timerHtml);
	        shallBindEvt = true;
	    }
	    
	    var timer = $('.js-timepicker'),
	        negBtn = timer.find('.js-neg-btn'),
	        posBtn = timer.find('.js-pos-btn'),
	        timeColContainers = timer.find('.time-col-container'),
	        itemHeight = 0;


	    this.data('callback', callback);
	    
	    this.on('click', function(e) {
	        timer.show();
	        if (!timer.data('itemHeight'))
	            timer.data('itemHeight', timer.find('.hour-col ul li').first().height());
	        clickedComponent = $(this);
	        e.preventDefault();
	    });
	    
	    if (!shallBindEvt) {
	        return;
	    }
	    
	    timer.data('hour', 0);
	    timer.data('min', 0);
	    posBtn.on('click', function() {
	        var hour = timer.data('hour'),
	            min = timer.data('min');
	        clickedComponent.data('callback')(hour, min);
	        timer.hide();
	    });

	    
	    timeColContainers.on('scroll', function(e) {
	        var timeColContainer = $(this);
	        // if container is auto-pitting
	        if (timeColContainer.data('isTailing')) {
	            return;
	        }
	        // set the scrolling direction
	        if (timeColContainer.data('lastScroll') < this.scrollTop) {
	            timeColContainer.data('scrollDir', 'down');
	        } else {
	            timeColContainer.data('scrollDir', 'up');
	        }
	        timeColContainer.data('lastScroll', this.scrollTop);
	        
	        // clear the timer if scrolled in 100ms
	        if (timeColContainer.data('timerId'))
	            window.clearTimeout(timeColContainer.data('timerId'));

	        // set the timer, it'll only run when there is no scroll event in 100ms
	        timeColContainer.data('timerId', window.setTimeout(function() {
	            var remainder = 0,
	                intervalId = 0,
	                step = 0,
	                itemHeight = timer.data('itemHeight');
	            if (this.scrollTop % itemHeight === 0)
	                return;
	            if (timeColContainer.data('scrollDir') === 'up') {
	                remainder = this.scrollTop % itemHeight;
	                step = -1 * remainder / 4;
	                // reversely auto-pitting
	                if (remainder > (itemHeight / 2)) {
	                    remainder = itemHeight - remainder;
	                    step = remainder / 4;
	                }
	                timeColContainer.data('isTailing', true);
	            } else {
	                remainder = itemHeight - (this.scrollTop % itemHeight);
	                step = remainder / 4;
	                timeColContainer.data('isTailing', true);
	                // reversely auto-pitting
	                if (remainder > (itemHeight / 2)) {
	                    remainder = itemHeight - remainder;
	                    step = -1 * remainder / 4;
	                }
	            }
	            
	            // calc hour, min from this.scrollTop
	            var val = Math.round((this.scrollTop + step*4)/itemHeight);
	            if (timeColContainer.hasClass('hour-col')) {
	                timer.data('hour', val);
	            } else {
	                timer.data('min', val);
	            }

	            console.debug("auto-pitting begins, remainder:" + remainder + ", scrollTop:" + this.scrollTop + ', step: ' + step);
	            // auto-pitting
	            intervalId = window.setInterval(function() {
	                this.scrollTop = (this.scrollTop + step);
	                remainder = remainder - Math.abs(step);
	                if (remainder <= 0) {
	                    console.debug("auto-pitting ends, item height:" + itemHeight + ", scrollTop:" + this.scrollTop + ', setp: ' + step);
	                    window.clearInterval(intervalId);
	                    window.setTimeout(function() {
	                        timeColContainer.data('isTailing', false);
	                    }.bind(this), 150);
	                }
	            }.bind(this), 100);
	        }.bind(this), 100));
	    });
	    
	    negBtn.on('click', function() {
	        timer.hide();
	    });
	    
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = "<div class=\"timepicker js-timepicker\">\n    <div class=\"tp-dialog\">\n        <div class=\"tp-content\">\n            <div class=\"time-col-container  hour-col\">\n                <ul class=\"time-col\">\n                    <li></li> <li>00</li> <li>01</li> <li>02</li> <li>03</li> <li>04</li> <li>05</li> <li>06</li> <li>07</li> <li>08</li> <li>09</li> <li>10</li> <li>11</li> <li>12</li> <li>13</li> <li>14</li> <li>15</li> <li>16</li> <li>17</li> <li>18</li> <li>19</li> <li>20</li> <li>21</li> <li>22</li> <li>23</li> <li></li>\n                </ul>\n            </div>\n            <div class=\"time-col-container  min-col\">\n                <ul class=\"time-col\">\n                    <li></li> <li>00</li> <li>01</li> <li>02</li> <li>03</li> <li>04</li> <li>05</li> <li>06</li> <li>07</li> <li>08</li> <li>09</li> <li>10</li> <li>11</li> <li>12</li> <li>13</li> <li>14</li> <li>15</li> <li>16</li> <li>17</li> <li>18</li> <li>19</li> <li>20</li> <li>21</li> <li>22</li> <li>23</li> <li>24</li> <li>25</li> <li>26</li> <li>27</li> <li>28</li> <li>29</li> <li>30</li> <li>31</li> <li>32</li> <li>33</li> <li>34</li> <li>35</li> <li>36</li> <li>37</li> <li>38</li> <li>39</li> <li>40</li> <li>41</li> <li>42</li> <li>43</li> <li>44</li> <li>45</li> <li>46</li> <li>47</li> <li>48</li> <li>49</li> <li>50</li> <li>51</li> <li>52</li> <li>53</li> <li>54</li> <li>55</li> <li>56</li> <li>57</li> <li>58</li> <li>59</li> <li></li>\n                </ul>\n            </div>\n            <i class=\"time-line is-top is-left\"></i>\n            <i class=\"time-line is-top is-right\"></i>\n            <i class=\"time-line is-bottom is-left\"></i>\n            <i class=\"time-line is-bottom is-right\"></i>\n        </div>\n        <div class=\"tp-op\">\n            <div class=\"op js-neg-btn\">取消</div><div class=\"op js-pos-btn\">确定</div>\n        </div>\n    </div>\n</div>\n";

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./timepicker.less", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./timepicker.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".timepicker {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: none;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n.timepicker .tp-dialog {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 300px;\n  height: 180px;\n  /* 50*3 + 30*/\n  margin-left: -150px;\n  margin-top: -90px;\n  background-color: rgba(0, 0, 0, 0.95);\n}\n.timepicker .tp-dialog .tp-content {\n  position: absolute;\n  top: 0;\n  bottom: 30px;\n  width: 100%;\n}\n.timepicker .tp-dialog .tp-content .time-col-container {\n  position: absolute;\n  width: 50%;\n  height: 100%;\n  box-sizing: border-box;\n  overflow: auto;\n}\n.timepicker .tp-dialog .tp-content .time-col-container .time-col {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  font-size: 40px;\n  color: white;\n  text-align: center;\n}\n.timepicker .tp-dialog .tp-content .time-col-container .time-col li {\n  height: 50px;\n  line-height: 50px;\n  box-sizing: border-box;\n}\n.timepicker .tp-dialog .tp-content .time-col-container.hour-col {\n  left: 0;\n}\n.timepicker .tp-dialog .tp-content .time-col-container.min-col {\n  left: 50%;\n}\n.timepicker .tp-dialog .tp-content .time-line {\n  position: absolute;\n  display: block;\n  width: 40%;\n  height: 5px;\n  background-color: #12b7f5;\n}\n.timepicker .tp-dialog .tp-content .time-line.is-left {\n  left: 5%;\n}\n.timepicker .tp-dialog .tp-content .time-line.is-right {\n  left: 55%;\n}\n.timepicker .tp-dialog .tp-content .time-line.is-top {\n  top: 45px;\n  /* 50-5 */\n}\n.timepicker .tp-dialog .tp-content .time-line.is-bottom {\n  top: 100px;\n  /* 100 */\n}\n.timepicker .tp-dialog .tp-op {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  height: 30px;\n}\n.timepicker .tp-dialog .tp-op .op {\n  display: inline-block;\n  width: 50%;\n  height: 100%;\n  line-height: 30px;\n  box-sizing: border-box;\n  text-align: center;\n  border-top: 1px solid #ccc;\n  color: white;\n}\n", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);