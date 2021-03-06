(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Doorman = factory());
}(this, (function () { 'use strict';

function extend() {
  var extended = {};
  var deep = false;

  if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
    deep = arguments[0];
    i++;
  }

  function merge(obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          extended[prop] = extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  }

  for (var i = 0; i < arguments.length; i++) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
}

function whichTransitionEvent(name) {
  var t = void 0;
  var el = document.createElement(name + '-transition');
  var transitions = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
  };
  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Doorman = function () {
  function Doorman() {
    var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Doorman);

    this.name = 'doorman';
    this.element = element;
    this.options = options;
    this.data = {};
    this.elementContent = {};
    this.elementTransform = {};
    this.state = null;
    this.default = {
      direction: 'lr', // lr (left to right) || rl (right to left) || tb (top to bottom) || bt (bottom to top).
      bgColor: 'rgb(000, 000, 000)',
      duration: '300', // ms
      delay: '0', // ms
      easing: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)', // easeInOutQuint
      reverse: false,
      begin: function begin(element) {},
      complete: function complete(element) {}
    };

    var dataReverse = this.element.getAttribute('data-doorman-reverse');
    var dataDirection = this.element.getAttribute('data-doorman-direction');
    var dataBgColor = this.element.getAttribute('data-doorman-bgColor');
    var dataDuration = this.element.getAttribute('data-doorman-duration');
    var dataDelay = this.element.getAttribute('data-doorman-delay');
    var dataEasing = this.element.getAttribute('data-doorman-easing');

    if (dataReverse !== null) this.data.reverse = dataReverse;
    if (dataDirection !== null) this.data.direction = dataDirection;
    if (dataBgColor !== null) this.data.bgColor = dataBgColor;
    if (dataDuration !== null) this.data.duration = dataDuration;
    if (dataDelay !== null) this.data.delay = dataDelay;
    if (dataEasing !== null) this.data.easing = dataEasing;

    this.options = extend(this.default, options, this.data);

    this.init();
  }

  createClass(Doorman, [{
    key: 'init',
    value: function init() {
      var elementInnerHtml = this.element.innerHTML;
      var elContentName = this.name + '-content';
      var elTransformName = this.name + '-transform';
      var elChilderen = '<div class="' + elContentName + '"></div><div class="' + elTransformName + '"></div>';

      this.state = 0;
      this.element.textContent = '';
      this.element.insertAdjacentHTML('beforeend', elChilderen);

      this.element.setAttribute('data-doorman', this.state);

      this.elementTransform = this.element.querySelector('.' + elTransformName);
      this.elementContent = this.element.querySelector('.' + elContentName);
      this.elementContent.innerHTML = elementInnerHtml;

      this.setStyle('init');
    }
  }, {
    key: 'start',
    value: function start(str) {
      if (this.isTransitioning) return;
      if (str) this.reverse();
      this.firstStep();
    }
  }, {
    key: 'firstStep',
    value: function firstStep() {
      var self = this;
      var transitionEvent = whichTransitionEvent(self.name);

      self.state = 1;

      setTimeout(function () {
        self.element.setAttribute('data-doorman', self.state);
        self.element.setAttribute('data-doorman-reverse', self.options.reverse);
        self.setStyle('start');
        self.options.begin(self.element);

        transitionEvent && self.element.addEventListener(transitionEvent, function (e) {
          e.stopImmediatePropagation();
          self.checkCurrentTransition();
        }, false);
      }, 1);
    }
  }, {
    key: 'secondStep',
    value: function secondStep() {
      this.state = 2;
      this.element.setAttribute('data-doorman', this.state);
      this.setStyle('end');
    }
  }, {
    key: 'complete',
    value: function complete() {
      this.state = 'complete';
      this.element.setAttribute('data-doorman', this.state);
      this.options.complete(this.element);
    }
  }, {
    key: 'checkCurrentTransition',
    value: function checkCurrentTransition() {
      if (this.state === 1) {
        this.secondStep();
      } else {
        this.complete();
      }
    }
  }, {
    key: 'reverse',
    value: function reverse() {
      this.options.reverse = true;
      this.element.setAttribute('data-doorman-reverse', true);

      switch (this.options.direction) {
        case 'lr':
          this.options.direction = 'rl';
          this.element.setAttribute('data-doorman-direction', 'rl');
          break;
        case 'rl':
          this.options.direction = 'lr';
          this.element.setAttribute('data-doorman-direction', 'lr');
          break;
        case 'tb':
          this.options.direction = 'bt';
          this.element.setAttribute('data-doorman-direction', 'bt');
          break;
        case 'bt':
          this.options.direction = 'tb';
          this.element.setAttribute('data-doorman-direction', 'tb');
          break;
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {}
  }, {
    key: 'setStyle',
    value: function setStyle(type) {
      var s = this.element.style;
      var t = this.elementTransform.style;
      var c = this.elementContent.style;

      switch (type) {
        case 'init':
          s.position = 'relative';

          c.visibility = 'hidden';

          t.position = 'absolute';
          t.top = 0;
          t.left = 0;
          t.width = '100%';
          t.height = '100%';
          t.pointerEvents = 'none';
          t.transitionProperty = 'transform';
          t.willChange = 'transform';

          t.backgroundColor = this.options.bgColor;
          t.transitionDuration = this.options.duration + 'ms';
          t.transitionDelay = this.options.delay + 'ms';
          t.transitionTimingFunction = this.options.easing;
          break;
        case 'start':
          this.element.style.visibility = 'visible';
          switch (this.options.reverse) {
            case true:
              c.visibility = 'visible';
              break;
            case false:
              c.visibility = 'hidden';
              break;
          }
          break;
        case 'end':
          switch (this.options.reverse) {
            case true:
              c.visibility = 'hidden';
              break;
            case false:
              c.visibility = 'visible';
              break;
          }
          break;
      }

      switch (this.options.direction) {
        case 'lr':
          switch (type) {
            case 'init':
              t.transform = 'scaleX(0)';
              break;
            case 'start':
              t.transform = 'scaleX(1)';
              t.transformOrigin = '0 0 0';
              break;
            case 'end':
              t.transform = 'scaleX(0)';
              t.transformOrigin = '100% 0 0';
              break;
          }
          break;
        case 'rl':
          switch (type) {
            case 'init':
              t.transform = 'scaleX(0)';
              break;
            case 'start':
              t.transform = 'scaleX(1)';
              t.transformOrigin = '100% 0 0';
              break;
            case 'end':
              t.transform = 'scaleX(0)';
              t.transformOrigin = '0 0 0';
              break;
          }
          break;
        case 'tb':
          switch (type) {
            case 'init':
              t.transform = 'scaleY(0)';
              break;
            case 'start':
              t.transform = 'scaleY(1)';
              t.transformOrigin = '0 0 0';
              break;
            case 'end':
              t.transform = 'scaleY(0)';
              t.transformOrigin = '0 100% 0';
              break;
          }
          break;
        case 'bt':
          switch (type) {
            case 'init':
              t.transform = 'scaleY(0)';
              break;
            case 'start':
              t.transform = 'scaleY(1)';
              t.transformOrigin = '0 100% 0';
              break;
            case 'end':
              t.transform = 'scaleY(0)';
              t.transformOrigin = '0 0 0';
              break;
          }
          break;
      }
    }
  }]);
  return Doorman;
}();

return Doorman;

})));
