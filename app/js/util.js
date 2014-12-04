/**
 * @fileOverview util.js
 * @authors @Bubblins(http://weibo.com/607768123)
 * @version 0.1.0
 */

var util = (function (window, document, undefined) {

    /**
     * Prevent console error in ie6
     */
    if (!window.console) {
        window.console = {
            log: function() {},
            error: function () {}
        };
    }

    /**
     * trim
     * \uFEFF\xa0\u3000\u00A0: Compatible with the low version of IE
     */
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xa0\u3000\u00A0]+|[\s\uFEFF\xa0\u3000\u00A0]+$/g, '');
        };
    }    

    /**
     * g description
     * @param  {Object} ele  dom element
     * @param  {String} attr attribute
     */
    function getStyle(ele, attr) {
        return ele.currentStyle ? ele.currentStyle[attr] : getComputedStyle(ele, false)[attr];
    }

    /**
     * get elements by className
     * @param  {String} cls    className
     * @param  {Object} parent parent element
     */
    function getByClass(cls, parent) {
        parent = parent || document;
        if (parent.getElementsByClassName) {
            return parent.getElementsByClassName(cls);
        }
        var reg = new RegExp('(^|\\s)' + cls + '($|\\s)', 'i');
        var res = [];
        var nodes = parent.getElementsByTagName('*');
        for (var i = 0, len = nodes.length; i < len; i++) {
            if (reg.test(nodes[i].className)) {
                res.push(nodes[i]);
            }
        }
        return res;
    }


    /**
     * bindEvent
     * @param {Object}     ele     dom element
     * @param {String}     type    event type
     * @param {Function} callback  callback
     */
    function bindEvent(ele, type, callback) {
        if (ele.addEventListener) {
            ele.addEventListener(type, callback, false);
        } else if (ele.attachEvent) {
            ele.attachEvent('on' + type, function () {
                callback.call(ele, event);
            });
        } else {
            ele['on'+type] = function (ev) {
                var oEvent = ev || event;
                callback(oEvent);
            };
        }
    }


    /**
     * hasClass
     * @param  {Object}    ele dom element
     * @param  {String}    cls className
     * @return {Boolean}     Boolean
     */
    function hasClass(ele, cls) {
        if (ele.classList) {
            return ele.classList.contains(cls);
        } else {
            var reg = new RegExp('(^|\\s)' + cls + '($|\\s)', 'i');
            return reg.test(ele.className);
        }
    }

    /**
     * addClass
     * @param  {Object}    ele dom element
     * @param  {String}    cls className
     */
    function addClass(ele, cls) {
        if (!hasClass(ele, cls)) {
            if (ele.classList) {
                ele.classList.add(cls);
            } else {
                ele.className = (ele.className.trim() + ' ' + cls).trim();
            }
        }
    }

    /**
     * removeClass
     * @param  {Object}    ele dom element
     * @param  {String}    cls className
     */
    function removeClass(ele, cls) {
        if (hasClass(ele, cls)) {
            if (ele.classList) {
                ele.classList.remove(cls);
            } else {
                var reg = new RegExp('(^|\\s+)'+ cls + '($|\\s+)', 'ig');
                ele.className = ele.className.replace(reg, ' ').trim();
            }
        }
    }

    /**
     * toggleClass
     * @param  {Object}    ele dom element
     * @param  {String}    cls className
     */
    function toggleClass(ele, cls) {
        if (hasClass(ele, cls)) {
            removeClass(ele, cls);
        } else {
            addClass(ele, cls);
        }
    }

    /**
     * animate description
     * @param  {type} ele  dom element
     * @param  {type} json json
     * @param  {type} opts options
     */
    function animate(ele, json, opts) {
        opts = opts || {};
        opts.time = opts.time || 800;
        opts.type = opts.type || 'buffer';

        var count = Math.round(opts.time/30);
        var start = {};
        var dis = {};
        var n = 0;

        for (var attr in json) {  
            if (attr === 'opacity') {
                start[attr] = parseInt(getStyle(ele, attr)*100, 10);
            } else {
                start[attr] = parseInt(getStyle(ele, attr), 10);
            }
            dis[attr] = json[attr] - start[attr];
        }

        clearInterval(ele.timer);
        ele.timer = setInterval(function () {
            n++;
            var cur, a;
            for (var attr in json) {
                switch(opts.type) {
                    case 'linear': 
                        cur = start[attr] + dis[attr] * n /count;
                        break;
                    case 'buffer':
                        a = 1 - n / count;
                        cur = start[attr] + dis[attr] * (1 - a * a * a);
                        break;
                    case 'easeIn':
                        a = n /count;
                        cur = start[attr] + dis[attr] * a * a * a;
                        break;
                }
                if (attr === 'opacity') {
                    ele.style.filter = 'alpha(opacity' + cur + ')';
                    ele.style.opacity = cur/100;
                } else {
                    ele.style[attr] = cur + 'px';
                }
            }

            if (n === count) {
                clearInterval(ele.timer);
                opts.end && opts.end();
            }
        }, 30);
    }

    return {
        getStyle: getStyle,
        getByClass: getByClass,
        bindEvent: bindEvent,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        animate: animate
    };

})(window, document);