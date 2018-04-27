var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// menu close:
// M 0 100 C 50 100 50 100 100 100 V 100 H 0
// menu open:
// M 0 0 V 100 C 50 100 50 100 100 100 V 0 H 0

// M: 初期値
// V: 垂直線
// C: 三次ベジェ曲線 x1 y1 x2 y2 x y
// V/H : 垂直水平


var UTIL = window.UTIL || {},
    CLASS_NAME = {
  OPEN: 'is-opened'
},
    SELECTOR = {
  OVERLAY: '.shape-overlays',
  HAMBURGER: '.hamburger',
  GLOVAL_NAVI: '.nav-global > .list > li'
};

UTIL.forLoopArr = function (num) {
  return new Array(num + 1).join('0').split('');
};

var ShapeOverlays = function () {
  function ShapeOverlays(elem) {
    _classCallCheck(this, ShapeOverlays);

    var _ = this;

    _.elem = elem;
    _.path = elem.querySelectorAll('path');
    _.numPoints = 2;
    _.duration = 600; // アニメーション速度
    _.delayPointsArray = [];
    _.delayPointsMax = 0;
    _.delayPerPath = 200; // 3つのレイヤーのモーション差
    _.timeStart = Date.now();
    _.isOpened = false;
    _.isAnimating = false;
  }

  _createClass(ShapeOverlays, [{
    key: 'toggle',
    value: function toggle() {
      var _ = this;

      _.isAnimationg = true;

      UTIL.forLoopArr(_.numPoints).forEach(function (value, index) {
        _.delayPointsArray[index] = 0;
      });

      _.isOpened === false ? _.open() : _.close();
    }
  }, {
    key: 'open',
    value: function open() {
      var _ = this;

      _.isOpened = true;
      _.elem.classList.add(CLASS_NAME.SVG_OPEN);
      _.timeStart = Date.now();
      _.renderLoop();
    }
  }, {
    key: 'close',
    value: function close() {
      var _ = this;

      _.isOpened = false;
      _.elem.classList.remove(CLASS_NAME.SVG_OPEN);
      _.timeStart = Date.now();
      _.renderLoop();
    }
  }, {
    key: 'updatePath',
    value: function updatePath(time) {
      var _this = this;

      var _ = this,
          points = [],
          cubicOut = function cubicOut(t) {
        // easing 
        var f = t - 1.0;
        return f * f * f + 1.0;
      },
          cubicInOut = function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
      };

      UTIL.forLoopArr(_.numPoints).forEach(function (value, index) {
        var thisEase = _.isOpened ? index == 1 ? cubicOut : cubicInOut : index == 1 ? cubicInOut : cubicOut;

        points[index] = thisEase(Math.min(Math.max(time - _this.delayPointsArray[index], 0) / _this.duration, 1)) * 100;
      });

      var str = '';

      str += _.isOpened ? 'M 0 0 V ' + points[0] + ' ' : 'M 0 ' + points[0] + ' ';

      UTIL.forLoopArr(_.numPoints - 1).forEach(function (value, index) {
        var p = (index + 1) / (_.numPoints - 1) * 100;
        var cp = p - 1 / (_.numPoints - 1) * 100 / 2;

        str += 'C ' + cp + ' ' + points[index] + ' ' + cp + ' ' + points[index + 1] + ' ' + p + ' ' + points[index + 1] + ' ';
      });

      str += _.isOpened ? 'V 0 H 0' : 'V 100 H 0';

      return str;
    }
  }, {
    key: 'render',
    value: function render() {
      var _ = this,
          loop = UTIL.forLoopArr(_.path.length),
          openStateLoop = function openStateLoop() {
        return loop.forEach(function (value, index) {
          _.path[index].setAttribute('d', _.updatePath(Date.now() - (_.timeStart + _.delayPerPath * index)));
        });
      },
          closeStateLoop = function closeStateLoop() {
        return loop.forEach(function (value, index) {
          _.path[index].setAttribute('d', _.updatePath(Date.now() - (_.timeStart + _.delayPerPath * (_.path.length - index - 1))));
        });
      };

      _.isOpened ? openStateLoop() : closeStateLoop();
    }
  }, {
    key: 'renderLoop',
    value: function renderLoop() {
      var _ = this,
          isAnimating = function isAnimating() {
        return Date.now() - _.timeStart < _.duration + _.delayPerPath * (_.path.length - 1) + _.delayPointsMax;
      };

      _.render();
      isAnimating ? requestAnimationFrame(function () {
        _.renderLoop();
      }) : _.isAnimating = false;
    }
  }]);

  return ShapeOverlays;
}();

(function () {
  var elmHamburger = document.querySelector(SELECTOR.HAMBURGER),
      elmOverlay = document.querySelector(SELECTOR.OVERLAY),
      gNavItems = document.querySelectorAll(SELECTOR.GLOVAL_NAVI),
      overlay = new ShapeOverlays(elmOverlay),
      forLoop = function forLoop() {
    return UTIL.forLoopArr(gNavItems.length);
  },
      openState = function openState() {
    elmHamburger.classList.add(CLASS_NAME.OPEN);
    forLoop().forEach(function (value, index) {
      gNavItems[index].classList.add(CLASS_NAME.OPEN);
    });
  },
      closeState = function closeState() {
    elmHamburger.classList.remove(CLASS_NAME.OPEN);
    forLoop().forEach(function (value, index) {
      gNavItems[index].classList.remove(CLASS_NAME.OPEN);
    });
  };

  elmHamburger.addEventListener('click', function () {
    if (overlay.isAnimating) return;
    overlay.toggle();
    overlay.isOpened ? openState() : closeState();
  });
})();