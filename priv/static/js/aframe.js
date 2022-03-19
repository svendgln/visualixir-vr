(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    var val = aliases[name];
    return (val && name !== val) ? expandAlias(val) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("aframe/aframeApp.js", function(exports, require, module) {
"use strict";

require("phoenix_html");

var _user_socket = _interopRequireDefault(require("./user_socket.js"));

var _menu = _interopRequireDefault(require("./components/menu.js"));

var _cluster_view = _interopRequireDefault(require("./cluster_view.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

console.log("loading aframe app"); // const fs = require('fs');
// function loadComponents() {
//     const path = './components';
//     let files = fs.readdirSync(path).filter(file => file.endsWith('.js'));
//     console.log(files)
// }

//window.socket.channel("nodes", {}).join().receive("ok", () => console.log('FRFRFRF'));
// temp fix
var components = ['clicktest.js', 'customcontrols.js', 'debug.js', 'enterleave.js', 'menubutton.js', 'menu.js', 'camrender.js'];
components.forEach(function (c) {
  console.log('importing ', c);

  require("./components/".concat(c));
});

var AframeApp = /*#__PURE__*/_createClass(function AframeApp() {
  _classCallCheck(this, AframeApp);

  this.menu = new _menu["default"]();
  this.cluster_view = new _cluster_view["default"]('NOT USED');
}); // on document load


$(function () {
  window.socket = _user_socket["default"];
  window.app = new AframeApp();
}); //import './test.js';
});

require.register("aframe/cluster_view.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _graph = _interopRequireDefault(require("./graph.js"));

var _process = _interopRequireDefault(require("./process.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var _default = /*#__PURE__*/function () {
  function _default(graph_container) {
    var _this = this;

    _classCallCheck(this, _default);

    console.log('CLUSTER CLASS loaded');
    this.processes = {};
    this.grouping_processes = {};
    this.graph = new _graph["default"](graph_container, this);
    this.channel = window.socket.channel('trace', {});
    this.channel.join();
    this.channel.on("visualize_node", function (msg) {
      return _this.visualizeNode(msg);
    });
  }

  _createClass(_default, [{
    key: "visualizeNode",
    value: function visualizeNode(msg) {
      var _this2 = this;

      console.log('VISUALIZEEEE ', msg);
      $.each(msg.pids, function (pid, info) {
        return _this2.addProcess(pid, info);
      });
      this.graph.update(true);
    }
  }, {
    key: "addProcess",
    value: function addProcess(pid, info) {
      var _this3 = this;

      if (this.processes[pid]) return; //exists

      var process = this.processes[pid] = new _process["default"](pid, info); // 1 grouping process per node

      if (process.isGroupingProcess()) {
        this.grouping_processes[process.node] = process; // since this is the first time the grouping process has been seen, go through all processes and create invisble links

        d3.values(this.processes).forEach(function (maybe_unlinked_process) {
          if (!maybe_unlinked_process.isGroupingProcess()) {
            _this3.addInvisibleLink(maybe_unlinked_process);
          }
        });
      } else {
        this.addInvisibleLink(process);
      }

      info.links.forEach(function (other_pid) {
        return _this3.addLink(process, _this3.processes[other_pid]);
      });
    } // if grouping process not yet seen, skip
    // grouping p seen -> add all skipped nodes
    // each node afterwards will be added right away
    // FIX LE EPIC EXPLANATION lol

  }, {
    key: "addInvisibleLink",
    value: function addInvisibleLink(process) {
      // 1 per node name
      var grouping_process = this.grouping_processes[process.node];

      if (grouping_process) {
        // process was added before
        grouping_process.invisible_links[process.id] = process;
        this.graph.addInvisibleLink(grouping_process, process); //TODO
      } // not yet seen, skip and add later..

    }
  }, {
    key: "addLink",
    value: function addLink(from, to) {
      if (from && to) {
        from.links[to.id] = to;
        to.links[from.id] = from;
        this.graph.addLink(from, to); //TODO
      }
    }
  }]);

  return _default;
}();

exports["default"] = _default;
});

;require.register("aframe/components/camrender.js", function(exports, require, module) {
"use strict";

//https://jgbarah.github.io/aframe-playground/camrender-01/
AFRAME.registerComponent('camrender', {
  schema: {
    fps: {
      type: 'number',
      "default": 90.0
    },
    cid: {
      type: 'string',
      "default": 'camRenderer'
    },
    height: {
      type: 'number',
      "default": 300
    },
    width: {
      type: 'number',
      "default": 400
    }
  },
  init: function init() {
    console.log('INIT CAM2'); // Counter for ticks since last render

    this.counter = 0; // Find canvas element to be used for rendering

    var canvasEl = document.getElementById(this.data.cid); // Create renderer

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvasEl
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.data.width, this.data.height); // Set properties for renderer DOM element

    this.renderer.domElement.crossorigin = "anonymous";
    this.renderer.domElement.height = this.data.height;
    this.renderer.domElement.width = this.data.width;
  },
  tick: function tick(time, timeDelta) {
    var loopFPS = 1000.0 / timeDelta;
    var hmdIsXFasterThanDesiredFPS = loopFPS / this.data.fps;
    var renderEveryNthFrame = Math.round(hmdIsXFasterThanDesiredFPS);

    if (this.counter % renderEveryNthFrame === 0) {
      this.renderer.render(this.el.sceneEl.object3D, this.el.object3DMap.camera);
    }

    this.counter += 1;
  }
});
AFRAME.registerComponent('canvas-updater', {
  dependencies: ['geometry', 'material'],
  tick: function tick() {
    var el = this.el;
    var material;
    material = el.getObject3D('mesh').material;

    if (!material.map) {
      return;
    }

    material.map.needsUpdate = true;
  }
});
});

require.register("aframe/components/clicktest.js", function(exports, require, module) {
"use strict";

AFRAME.registerComponent('clicktest', {
  init: function init() {
    console.log('CLICK INIT');
    var el = this.el;
    el.addEventListener('click', function (evt) {
      console.log(el);
      console.log('trigger pressed');
      el.setAttribute('visible', !el.getAttribute('visible'));
    });
  }
});
});

;require.register("aframe/components/customcontrols.js", function(exports, require, module) {
"use strict";

AFRAME.registerComponent('custom-controls', {
  schema: {
    cameraRig: {
      type: 'selector',
      "default": '#cameraRig'
    },
    camera: {
      type: 'selector',
      "default": '#camera'
    },
    speed: {
      type: 'number',
      "default": 0.1
    },
    controllerLeft: {
      'type': 'selector',
      "default": '#controllerLeft'
    },
    controllerRight: {
      'type': 'selector',
      "default": '#controllerRight'
    }
  },
  init: function init() {
    var _this = this;

    console.log('custom controls loaded');
    var el = this.el; //probs not needed

    var self = this;
    this.timer = 0;
    this.quat = new THREE.Quaternion();
    this.vecZ = new THREE.Vector3(0, 0, -1); //forward direction of camera -z

    this.vecX = new THREE.Vector3(1, 0, 0); // x axis for sideways movement

    this.axis = [0, 0]; //controller trackpad x,z axis
    // controller events
    // trigger

    controllerLeft.addEventListener('triggerdown', function (evt) {
      console.log('LEFT TRIGGER');
    });
    controllerRight.addEventListener('triggerdown', function (evt) {
      console.log('RIGHT TRIGGER');
    }); // grip button

    controllerLeft.addEventListener('gripdown', function (evt) {
      console.log('LEFT GRIP');
    });
    controllerRight.addEventListener('gripdown', function (evt) {
      console.log('RIGHT GRIP');
    }); // menu button

    controllerLeft.addEventListener('menudown', function (evt) {
      console.log('LEFT MENU'); // toggle overview cam, on hide: remove components to prevent updates
      // movable x/z when toggled?..
    });
    controllerRight.addEventListener('menudown', function (evt) {
      console.log('RIGHT MENU'); // call this.somefunction toggle menu idk

      var m = document.querySelector('#menu');
      m.setAttribute('visible', !m.getAttribute('visible'));
      console.log('menu is now', !m.getAttribute('visible') ? 'not visible' : 'visible');
    }); // trackpad

    controllerLeft.addEventListener('axismove', function (evt) {
      // position on trackpad, x,z values [-1,1]
      var axis = evt.detail.axis;
      _this.axis = axis;
    }); // right trackpad: use click and axis location to create arrow key functionality?.. for.. something..
  },
  tick: function tick(time, timeDelta) {
    var vecX = this.vecX;
    var vecZ = this.vecZ;
    var pos = this.data.cameraRig.object3D.position; // camera rotation quaternion

    this.quat.copy(this.data.camera.object3D.quaternion); //apply to direction vectors

    vecZ.applyQuaternion(this.quat);
    vecX.applyQuaternion(this.quat); // scale vecs with speed scalar, add to position..

    var axis = this.axis;
    var axisX = axis[0] * this.data.speed;
    var axisZ = axis[1] * this.data.speed; // length 1

    vecZ.normalize();
    vecX.normalize(); // closer to edge of trackpad = faster

    vecZ.multiplyScalar(axisZ);
    vecX.multiplyScalar(axisX);
    pos.add(vecZ); // add x and z component of vecX to position: only vecZ changes height

    this.data.cameraRig.object3D.position.set(pos.x + vecX.getComponent(0), pos.y, pos.z + vecX.getComponent(2)); // reset NEEDED?

    this.vecZ.set(0, 0, -1);
    this.vecX.set(1, 0, 0);
  }
});
});

require.register("aframe/components/debug.js", function(exports, require, module) {
"use strict";

console.log('more bullshit');
AFRAME.registerComponent('testing', {
  schema: {
    cameraRig: {
      type: 'selector',
      "default": '#cameraRig'
    },
    camera: {
      type: 'selector',
      "default": '#camera'
    }
  },
  init: function init() {
    console.log('testing component loaded');
    this.timer = 0;
  },
  tick: function tick(time, timeDelta) {
    this.timer += timeDelta;

    if (this.timer > 1000) {
      this.timer = 0; //console.log('log test')
      //TEST

      var rot = this.data.camera.object3D.rotation;
      var quat = this.data.camera.object3D.quaternion;
      var line = document.querySelectorAll('#LINE');
      var vecz = new THREE.Vector3(0, 0, -1);
      var vecx = new THREE.Vector3(1, 0, 0);
      vecx.applyQuaternion(quat); //cam rotation

      vecz.applyQuaternion(quat);
      line.forEach(function (l) {
        l.object3D.rotation.setFromQuaternion(quat);
      }); //var currentPos = this.data.cameraRig.object3D.position;
      //currentPos.add(vecz);
      //console.log(this.data.cameraRig.object3D.position, currentPos);
      //rando test
      //add 1.6 to height before pointing
      //maybe fixed x/z rotation..

      document.querySelector('#POINTER').object3D.lookAt(document.querySelector('#cameraRig').object3D.position);
    }
  }
});
});

require.register("aframe/components/enterleave.js", function(exports, require, module) {
"use strict";

// component needed?
AFRAME.registerComponent('enterleave', {
  init: function init() {
    var el = this.el;
    console.log(this.el);
    console.log('enter/leave');
    el.addEventListener('enterleave', function (evt) {
      console.log('(╯°□°）╯︵ ┻━┻');
    });
  }
});
});

;require.register("aframe/components/menu.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

AFRAME.registerComponent('menu', {
  init: function init() {
    console.log('menu init'); //let t = new Menu();

    document.querySelector('a-scene').addEventListener('enter-vr', function () {
      console.log("ENTERED VR"); // attach menu to controller

      var entity = document.querySelector('#menu');
      var newParent = document.querySelector('#controllerRight'); //entity.flushToDOM(); //not needed? dafuq

      var copy = entity.cloneNode(true);
      newParent.appendChild(copy);
      entity.parentNode.removeChild(entity); //resize

      copy.setAttribute('scale', '0.5 0.5 0.5');
      copy.setAttribute('rotation', '-30 0 0');
      copy.setAttribute('position', '0 0.2 -0.2');
    });
  }
});

var Menu = /*#__PURE__*/function () {
  function Menu() {
    var _this = this;

    _classCallCheck(this, Menu);

    console.log("MENU LOADED"); //TODO: scroll button when #nodes > max

    this.nodesContainer = document.querySelector('a-scene #menu-nodes');
    console.log('CONTAINER: ', this.nodesContainer);
    this.containerHeight = this.nodesContainer.getAttribute('geometry').height;
    this.containerWidth = this.nodesContainer.getAttribute('geometry').width;
    this.channel = window.socket.channel("nodes", {});
    this.nodes = [];
    this.nodeListSize = 3; //max visible nodes in the menu list at once

    this.nodePadding = 0.05; //test

    this.nodeWidth = this.containerWidth - this.nodePadding;
    this.nodeHeight = 0.1;
    this.maxNodes = Math.floor(this.containerHeight / (this.nodeHeight + this.nodePadding));
    console.log('container height: ', this.containerHeight, '\nnode height+padding: ', this.nodeHeight + this.nodePadding, 'max #nodes -> ', this.maxNodes);

    var updateNodes = function updateNodes(msg) {
      _this.update(msg.nodes);
    };

    this.channel.join().receive("ok", updateNodes); // update msg callback

    this.channel.on("update", updateNodes);
  }

  _createClass(Menu, [{
    key: "update",
    value: function update(nodes) {
      var _this2 = this;

      console.log('updating nodes: ', nodes);
      var l = nodes.length; //d3

      d3.select('a-scene').select('#menu-nodes').selectAll('a-entity').data(nodes).join('a-entity').attr('geometry', function (d, i) {
        return "primitive: plane; width: ".concat(_this2.nodeWidth, "; height: ").concat(_this2.nodeHeight, ";");
      }).attr('position', function (d, i) {
        console.log(_this2.containerHeight / 2 - _this2.nodeHeight / 2);
        var first = _this2.containerHeight / 2 - _this2.nodeHeight / 2 - _this2.nodePadding;
        var offset = (_this2.nodeHeight + _this2.nodePadding) * -i;
        return "0 ".concat(first + offset, " 0.01");
      }).attr('material', function (d, i) {
        return 'shader: flat; color: red';
      }).attr('text', function (d, i) {
        return "value: ".concat(d, "; align: center; wrapCount: 20");
      }).attr('menu-button', function (d, i) {
        return "name: nodeClick; args: ".concat(d);
      }).attr('raycastable', function (d, i) {
        return '';
      }).each(function (d, i) {
        //update DOM with correct attribute values
        this.flushToDOM();
        console.log('flushed: ', this);
      });
    }
  }, {
    key: "visualizeNode",
    value: function visualizeNode(node) {
      console.log('visualize callback');
      this.channel.push('visualize', node);
    }
  }, {
    key: "cleanupNode",
    value: function cleanupNode(node) {
      console.log('cleanup callback');
    }
  }]);

  return Menu;
}(); // temp :p
// create instance in aframeApp..
//let t = new Menu("aa");
//moved to menu component init
//t.update("a");


exports["default"] = Menu;
});

require.register("aframe/components/menubutton.js", function(exports, require, module) {
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

console.log('MENU BUTTON LOADED'); // move to file

function nodeClick(target, args) {
  var nodeName = args[0];
  console.log('clicked on', nodeName); //send websocket msg.. check target selected class..

  document.lol = target;

  if ($(target).hasClass('selected')) {
    $(target).removeClass('selected');
    target.setAttribute('text', 'color: white');
    window.app.menu.cleanupNode(nodeName); //target.flushToDOM();
  } else {
    $(target).addClass('selected');
    target.setAttribute('text', 'color: green');
    window.app.menu.visualizeNode(nodeName); //target.flushToDOM();
  }
}

AFRAME.registerSystem('menu-button', {
  init: function init() {
    //button name?/id -> click callbacks
    this.commands = new Map();

    function test(target, args) {
      console.log('custom callback on', target, 'with args: ', args);
      document.test();
    }

    this.addCommand('testRemove', document.test2);
    this.addCommand('test', test);
    this.addCommand('nodeClick', nodeClick);
    this.listCommands();
  },
  addCommand: function addCommand(name, func) {
    this.commands.set(name, func);
  },
  delCommand: function delCommand(name) {
    this.commands["delete"](name); //returns boolean
  },
  listCommands: function listCommands() {
    //testing
    var _iterator = _createForOfIteratorHelper(this.commands),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
            name = _step$value[0],
            func = _step$value[1];

        console.log(name, ' -> ', func);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  },
  run: function run(name, target, args) {
    var func = this.commands.get(name);

    if (func) {
      func(target, args);
    } else {
      console.log('invalid button callback on button ', target, 'with args: ', args);
    }
  }
});
AFRAME.registerComponent('menu-button', {
  /**
   * schema: color and text, idk what else
   */
  schema: {
    color: {
      type: 'color',
      "default": '#FF0000'
    },
    name: {
      type: 'string'
    },
    args: {
      type: 'array',
      "default": []
    }
  },
  init: function init() {
    var _this = this;

    var el = this.el;
    document.el = el; //system should be accessible through this.system?..

    var system = this.el.sceneEl.systems['menu-button'];
    console.log('ID: ', this.id, this.system); //console.log('test: ', makeButton('#00FF00'));

    var color = el.components.material.material.color;
    var r = color.r,
        g = color.g,
        b = color.b;
    var highlightColor = new THREE.Color(r, g, b);
    highlightColor.offsetHSL(0.5, 0, 0);
    var colorHex = "#".concat(color.getHexString());
    var highlightHex = "#".concat(highlightColor.getHexString());
    console.log(colorHex);
    el.setAttribute('animation__mouseenter', "property: components.material.material.color; type: color; to: " + highlightHex + "; startEvents: mouseenter; dur: 50");
    el.setAttribute('animation__mouseleave', "property: components.material.material.color; type: color; to: " + colorHex + "; startEvents: mouseleave; dur: 50");
    el.setAttribute('animation__click', "property: scale; from: 1 1 1; to: 1.1 1.1 1.1; startEvents: click; dur: 200; dir: alternate");
    el.setAttribute('animation__click2', "property: scale; from: 1.1 1.1 1.1; to: 1 1 1; startEvents: click; dur: 200; delay: 200");
    el.addEventListener('click', function (evt) {
      console.log(evt); // evt.target for clicked el

      console.log('SYSTEM: ', system);
      var target = evt.target;
      system.run(_this.data.name, target, _this.data.args);
    }); // test
    // let geometry = el.getObject3D('mesh').geometry;
    // console.log('geometry: ', geometry);
    // let edges = new THREE.EdgesGeometry(geometry);
    // let line = new THEE.lineSegments(edges, new THREE.LineBasicMaterial({
    //     color: 0xffffff
    // }));
  }
}); // function makeButton(color) {
//     const colorRegex = /^#([0-9a-f]{3}){1,2}$/i;
//     if (!colorRegex.test(color)) {
//         color = '#FF0000';
//     }
//     let el = document.createElement('a-entity');
//     return el;
//     return `
//     <a-entity
//         geometry="primitive: cylinder; height: 0.1; radius: 0.15"
//         material={\`shader: flat; color: ${color}; transparent: true; opacity: 0.5\`}
//         rotation="90 0 0"
//         position="-0.3 0.3 0"
//     ></a-entity>
//     `
// }
});

;require.register("aframe/graph.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var ALPHA_DECAY = 0.015,
    PID_RADIUS = 1,
    //node size in aframe
//LABEL_OFFSET_X = 
//LABEL_OFFSET_Y = 
INVISIBLE_LINK_STRENGTH = 0.01,
    LINK_LENGTH = 1,
    //aframe
REPULSION = -10,
    //-LINK_LENGTH,
CENTERING_STRENGTH = 0.5; // const nodes = [{ test: 'lol' }, {}, {}, {}, {}];

var _default = /*#__PURE__*/function () {
  function _default(container, cluster_view) {
    var _this = this;

    _classCallCheck(this, _default);

    console.log('GRAPH loaded', container); //this.container = container;

    this.cluster_view = cluster_view;
    this.nodeContainer = d3.select('a-scene').select('#d3-nodes');
    this.linkContainer = d3.select('a-scene').select('#d3-links');
    this.invisibleLinkContainer = d3.select('a-scene').select('#d3-invisible-links');
    this.forceCenter = d3.forceCenter(0, 0);
    this.forceLink = d3.forceLink().distance(LINK_LENGTH);
    this.forceInvisibleLink = d3.forceLink().strength(INVISIBLE_LINK_STRENGTH);
    this.forceManyBody = d3.forceManyBody().strength(REPULSION);
    this.forceSim = d3.forceSimulation().force('link', this.forceLink).force('invisiblelink', this.forceInvisibleLink).force('charge', this.forceManyBody).force('center', this.forceCenter).force('x', d3.forceX().strength(CENTERING_STRENGTH)).force('y', d3.forceY().strength(CENTERING_STRENGTH)).velocityDecay(0.2).alphaDecay(ALPHA_DECAY) // only change position in on tick?
    // call update only from websocket callbacks?..
    .on('tick', function () {
      return _this.update(false);
    });
    this.links = {};
    this.invisible_links = {};
    this.msgs = {}; //rest not needed yet
  } // Links


  _createClass(_default, [{
    key: "link_id",
    value: function link_id(from, to) {
      return [from.id, to.id].sort().join('-');
    }
  }, {
    key: "addLink",
    value: function addLink(source, target) {
      if (source && target) {
        var link = {
          source: source,
          target: target
        },
            id = this.link_id(source, target);
        this.links[id] = link;
      }
    }
  }, {
    key: "addInvisibleLink",
    value: function addInvisibleLink(source, target) {
      if (source && target) {
        var link = {
          source: source,
          target: target
        },
            id = this.link_id(source, target);
        this.invisible_links[id] = link;
      }
    }
  }, {
    key: "update",
    value: function update(force_restart) {
      var _this2 = this;

      var pids_list = d3.values(this.cluster_view.processes),
          links_list = d3.values(this.links),
          invisible_links_list = d3.values(this.invisible_links),
          self = this;
      var pids_by_node = d3.nest().key(function (d) {
        return d.node;
      }).map(pids_list),
          nodes_list = pids_by_node.keys();
      var processes = this.nodeContainer.selectAll('a-entity').data(pids_list, function (d) {
        return d.id;
      });
      var links = this.linkContainer.selectAll('a-entity').data(links_list, function (d) {
        return _this2.link_id(d.source, d.target);
      });
      var invisible_links = this.invisibleLinkContainer.selectAll('a-entity').data(invisible_links_list, function (d) {
        return _this2.link_id(d.source, d.target);
      }); //console.log('prcs', processes);

      this.forceSim.nodes(pids_list);
      this.forceSim.force('link').links(links_list);
      this.forceSim.force('invisiblelink').links(invisible_links_list); // update processes

      processes.join(function (enter) {
        enter.append('a-entity').merge(processes).attr('geometry', function (d, i) {
          //console.log('adding node');
          return "primitive: sphere; radius: 1";
        }).attr('position', function (d, i) {
          return "".concat(d.x, " 1 ").concat(d.y);
        }).attr('material', function (d, i) {
          return "shader: standard; color: red";
        });
      }, function (update) {
        return update;
      }, function (exit) {
        exit.remove();
      });
      links.join(function (enter) {
        enter.append('a-entity').merge(links).attr('line', function (d, i) {
          return "start: ".concat(d.source.x, " 0 ").concat(d.source.y, "; end: ").concat(d.target.x, " 0 ").concat(d.target.y, "; color: green");
        });
      });
      if (force_restart) this.forceSim.alpha(1).restart();
    }
  }]);

  return _default;
}();

exports["default"] = _default;
});

;require.register("aframe/process.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

// this is the name of the pid that otherwise unlinked pids will group around, to keep all of a node's pids together
var GROUPING_PID = "application_controller";

var _default = /*#__PURE__*/function () {
  function _default(pid, info) {
    _classCallCheck(this, _default);

    this.id = pid;
    this.links = {};
    this.name = info.name;
    this.node = info.node;
    this.application = info.application;
    this.type = info.type;
    this.msg_traced = info.msg_traced;

    if (this.isGroupingProcess()) {
      this.invisible_links = {};
    }
  }

  _createClass(_default, [{
    key: "isGroupingProcess",
    value: function isGroupingProcess() {
      return this.name == GROUPING_PID;
    }
  }, {
    key: "qualifiedName",
    value: function qualifiedName() {
      return this.name + "@" + this.node.replace(/@.*/, '');
    }
  }]);

  return _default;
}();

exports["default"] = _default;
});

;require.register("aframe/user_socket.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _phoenix = require("phoenix");

// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".
// Bring in Phoenix channels client library:
// And connect to the path in "lib/visualixir_vr_web/endpoint.ex". We pass the
// token for authentication. Read below how it should be used.
var socket = new _phoenix.Socket("/socket", {
  params: {
    token: window.userToken
  }
}); // When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/visualixir_vr_web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/visualixir_vr_web/templates/layout/app.html.heex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/3" function
// in "lib/visualixir_vr_web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket, _connect_info) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1_209_600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, connect to the socket:

socket.connect();
console.log('connected to websocket'); // Now that you are connected, you can join channels with a topic.
// Let's assume you have a channel with a topic named `room` and the
// subtopic is its id - in this case 42:
// let channel = socket.channel("nodes:lobby", {})

var _default = socket;
exports["default"] = _default;
});

;
require.register("phoenix_html/priv/static/phoenix_html.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "phoenix_html");
  (function() {
    "use strict";

(function() {
  var PolyfillEvent = eventConstructor();

  function eventConstructor() {
    if (typeof window.CustomEvent === "function") return window.CustomEvent;
    // IE<=9 Support
    function CustomEvent(event, params) {
      params = params || {bubbles: false, cancelable: false, detail: undefined};
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    return CustomEvent;
  }

  function buildHiddenInput(name, value) {
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    return input;
  }

  function handleClick(element, targetModifierKey) {
    var to = element.getAttribute("data-to"),
        method = buildHiddenInput("_method", element.getAttribute("data-method")),
        csrf = buildHiddenInput("_csrf_token", element.getAttribute("data-csrf")),
        form = document.createElement("form"),
        target = element.getAttribute("target");

    form.method = (element.getAttribute("data-method") === "get") ? "get" : "post";
    form.action = to;
    form.style.display = "hidden";

    if (target) form.target = target;
    else if (targetModifierKey) form.target = "_blank";

    form.appendChild(csrf);
    form.appendChild(method);
    document.body.appendChild(form);
    form.submit();
  }

  window.addEventListener("click", function(e) {
    var element = e.target;
    if (e.defaultPrevented) return;

    while (element && element.getAttribute) {
      var phoenixLinkEvent = new PolyfillEvent('phoenix.link.click', {
        "bubbles": true, "cancelable": true
      });

      if (!element.dispatchEvent(phoenixLinkEvent)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      if (element.getAttribute("data-method")) {
        handleClick(element, e.metaKey || e.shiftKey);
        e.preventDefault();
        return false;
      } else {
        element = element.parentNode;
      }
    }
  }, false);

  window.addEventListener('phoenix.link.click', function (e) {
    var message = e.target.getAttribute("data-confirm");
    if(message && !window.confirm(message)) {
      e.preventDefault();
    }
  }, false);
})();
  })();
});

require.register("phoenix/priv/static/phoenix.cjs.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "phoenix");
  (function() {
    var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// js/phoenix/index.js
__export(exports, {
  Channel: () => Channel,
  LongPoll: () => LongPoll,
  Presence: () => Presence,
  Serializer: () => serializer_default,
  Socket: () => Socket
});

// js/phoenix/utils.js
var closure = (value) => {
  if (typeof value === "function") {
    return value;
  } else {
    let closure2 = function() {
      return value;
    };
    return closure2;
  }
};

// js/phoenix/constants.js
var globalSelf = typeof self !== "undefined" ? self : null;
var phxWindow = typeof window !== "undefined" ? window : null;
var global = globalSelf || phxWindow || void 0;
var DEFAULT_VSN = "2.0.0";
var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
var DEFAULT_TIMEOUT = 1e4;
var WS_CLOSE_NORMAL = 1e3;
var CHANNEL_STATES = {
  closed: "closed",
  errored: "errored",
  joined: "joined",
  joining: "joining",
  leaving: "leaving"
};
var CHANNEL_EVENTS = {
  close: "phx_close",
  error: "phx_error",
  join: "phx_join",
  reply: "phx_reply",
  leave: "phx_leave"
};
var TRANSPORTS = {
  longpoll: "longpoll",
  websocket: "websocket"
};
var XHR_STATES = {
  complete: 4
};

// js/phoenix/push.js
var Push = class {
  constructor(channel, event, payload, timeout) {
    this.channel = channel;
    this.event = event;
    this.payload = payload || function() {
      return {};
    };
    this.receivedResp = null;
    this.timeout = timeout;
    this.timeoutTimer = null;
    this.recHooks = [];
    this.sent = false;
  }
  resend(timeout) {
    this.timeout = timeout;
    this.reset();
    this.send();
  }
  send() {
    if (this.hasReceived("timeout")) {
      return;
    }
    this.startTimeout();
    this.sent = true;
    this.channel.socket.push({
      topic: this.channel.topic,
      event: this.event,
      payload: this.payload(),
      ref: this.ref,
      join_ref: this.channel.joinRef()
    });
  }
  receive(status, callback) {
    if (this.hasReceived(status)) {
      callback(this.receivedResp.response);
    }
    this.recHooks.push({ status, callback });
    return this;
  }
  reset() {
    this.cancelRefEvent();
    this.ref = null;
    this.refEvent = null;
    this.receivedResp = null;
    this.sent = false;
  }
  matchReceive({ status, response, _ref }) {
    this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
  }
  cancelRefEvent() {
    if (!this.refEvent) {
      return;
    }
    this.channel.off(this.refEvent);
  }
  cancelTimeout() {
    clearTimeout(this.timeoutTimer);
    this.timeoutTimer = null;
  }
  startTimeout() {
    if (this.timeoutTimer) {
      this.cancelTimeout();
    }
    this.ref = this.channel.socket.makeRef();
    this.refEvent = this.channel.replyEventName(this.ref);
    this.channel.on(this.refEvent, (payload) => {
      this.cancelRefEvent();
      this.cancelTimeout();
      this.receivedResp = payload;
      this.matchReceive(payload);
    });
    this.timeoutTimer = setTimeout(() => {
      this.trigger("timeout", {});
    }, this.timeout);
  }
  hasReceived(status) {
    return this.receivedResp && this.receivedResp.status === status;
  }
  trigger(status, response) {
    this.channel.trigger(this.refEvent, { status, response });
  }
};

// js/phoenix/timer.js
var Timer = class {
  constructor(callback, timerCalc) {
    this.callback = callback;
    this.timerCalc = timerCalc;
    this.timer = null;
    this.tries = 0;
  }
  reset() {
    this.tries = 0;
    clearTimeout(this.timer);
  }
  scheduleTimeout() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.tries = this.tries + 1;
      this.callback();
    }, this.timerCalc(this.tries + 1));
  }
};

// js/phoenix/channel.js
var Channel = class {
  constructor(topic, params, socket) {
    this.state = CHANNEL_STATES.closed;
    this.topic = topic;
    this.params = closure(params || {});
    this.socket = socket;
    this.bindings = [];
    this.bindingRef = 0;
    this.timeout = this.socket.timeout;
    this.joinedOnce = false;
    this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
    this.pushBuffer = [];
    this.stateChangeRefs = [];
    this.rejoinTimer = new Timer(() => {
      if (this.socket.isConnected()) {
        this.rejoin();
      }
    }, this.socket.rejoinAfterMs);
    this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset()));
    this.stateChangeRefs.push(this.socket.onOpen(() => {
      this.rejoinTimer.reset();
      if (this.isErrored()) {
        this.rejoin();
      }
    }));
    this.joinPush.receive("ok", () => {
      this.state = CHANNEL_STATES.joined;
      this.rejoinTimer.reset();
      this.pushBuffer.forEach((pushEvent) => pushEvent.send());
      this.pushBuffer = [];
    });
    this.joinPush.receive("error", () => {
      this.state = CHANNEL_STATES.errored;
      if (this.socket.isConnected()) {
        this.rejoinTimer.scheduleTimeout();
      }
    });
    this.onClose(() => {
      this.rejoinTimer.reset();
      if (this.socket.hasLogger())
        this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`);
      this.state = CHANNEL_STATES.closed;
      this.socket.remove(this);
    });
    this.onError((reason) => {
      if (this.socket.hasLogger())
        this.socket.log("channel", `error ${this.topic}`, reason);
      if (this.isJoining()) {
        this.joinPush.reset();
      }
      this.state = CHANNEL_STATES.errored;
      if (this.socket.isConnected()) {
        this.rejoinTimer.scheduleTimeout();
      }
    });
    this.joinPush.receive("timeout", () => {
      if (this.socket.hasLogger())
        this.socket.log("channel", `timeout ${this.topic} (${this.joinRef()})`, this.joinPush.timeout);
      let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), this.timeout);
      leavePush.send();
      this.state = CHANNEL_STATES.errored;
      this.joinPush.reset();
      if (this.socket.isConnected()) {
        this.rejoinTimer.scheduleTimeout();
      }
    });
    this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
      this.trigger(this.replyEventName(ref), payload);
    });
  }
  join(timeout = this.timeout) {
    if (this.joinedOnce) {
      throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
    } else {
      this.timeout = timeout;
      this.joinedOnce = true;
      this.rejoin();
      return this.joinPush;
    }
  }
  onClose(callback) {
    this.on(CHANNEL_EVENTS.close, callback);
  }
  onError(callback) {
    return this.on(CHANNEL_EVENTS.error, (reason) => callback(reason));
  }
  on(event, callback) {
    let ref = this.bindingRef++;
    this.bindings.push({ event, ref, callback });
    return ref;
  }
  off(event, ref) {
    this.bindings = this.bindings.filter((bind) => {
      return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref));
    });
  }
  canPush() {
    return this.socket.isConnected() && this.isJoined();
  }
  push(event, payload, timeout = this.timeout) {
    payload = payload || {};
    if (!this.joinedOnce) {
      throw new Error(`tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
    }
    let pushEvent = new Push(this, event, function() {
      return payload;
    }, timeout);
    if (this.canPush()) {
      pushEvent.send();
    } else {
      pushEvent.startTimeout();
      this.pushBuffer.push(pushEvent);
    }
    return pushEvent;
  }
  leave(timeout = this.timeout) {
    this.rejoinTimer.reset();
    this.joinPush.cancelTimeout();
    this.state = CHANNEL_STATES.leaving;
    let onClose = () => {
      if (this.socket.hasLogger())
        this.socket.log("channel", `leave ${this.topic}`);
      this.trigger(CHANNEL_EVENTS.close, "leave");
    };
    let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), timeout);
    leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
    leavePush.send();
    if (!this.canPush()) {
      leavePush.trigger("ok", {});
    }
    return leavePush;
  }
  onMessage(_event, payload, _ref) {
    return payload;
  }
  isMember(topic, event, payload, joinRef) {
    if (this.topic !== topic) {
      return false;
    }
    if (joinRef && joinRef !== this.joinRef()) {
      if (this.socket.hasLogger())
        this.socket.log("channel", "dropping outdated message", { topic, event, payload, joinRef });
      return false;
    } else {
      return true;
    }
  }
  joinRef() {
    return this.joinPush.ref;
  }
  rejoin(timeout = this.timeout) {
    if (this.isLeaving()) {
      return;
    }
    this.socket.leaveOpenTopic(this.topic);
    this.state = CHANNEL_STATES.joining;
    this.joinPush.resend(timeout);
  }
  trigger(event, payload, ref, joinRef) {
    let handledPayload = this.onMessage(event, payload, ref, joinRef);
    if (payload && !handledPayload) {
      throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");
    }
    let eventBindings = this.bindings.filter((bind) => bind.event === event);
    for (let i = 0; i < eventBindings.length; i++) {
      let bind = eventBindings[i];
      bind.callback(handledPayload, ref, joinRef || this.joinRef());
    }
  }
  replyEventName(ref) {
    return `chan_reply_${ref}`;
  }
  isClosed() {
    return this.state === CHANNEL_STATES.closed;
  }
  isErrored() {
    return this.state === CHANNEL_STATES.errored;
  }
  isJoined() {
    return this.state === CHANNEL_STATES.joined;
  }
  isJoining() {
    return this.state === CHANNEL_STATES.joining;
  }
  isLeaving() {
    return this.state === CHANNEL_STATES.leaving;
  }
};

// js/phoenix/ajax.js
var Ajax = class {
  static request(method, endPoint, accept, body, timeout, ontimeout, callback) {
    if (global.XDomainRequest) {
      let req = new global.XDomainRequest();
      this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
    } else {
      let req = new global.XMLHttpRequest();
      this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
    }
  }
  static xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
    req.timeout = timeout;
    req.open(method, endPoint);
    req.onload = () => {
      let response = this.parseJSON(req.responseText);
      callback && callback(response);
    };
    if (ontimeout) {
      req.ontimeout = ontimeout;
    }
    req.onprogress = () => {
    };
    req.send(body);
  }
  static xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
    req.open(method, endPoint, true);
    req.timeout = timeout;
    req.setRequestHeader("Content-Type", accept);
    req.onerror = () => {
      callback && callback(null);
    };
    req.onreadystatechange = () => {
      if (req.readyState === XHR_STATES.complete && callback) {
        let response = this.parseJSON(req.responseText);
        callback(response);
      }
    };
    if (ontimeout) {
      req.ontimeout = ontimeout;
    }
    req.send(body);
  }
  static parseJSON(resp) {
    if (!resp || resp === "") {
      return null;
    }
    try {
      return JSON.parse(resp);
    } catch (e) {
      console && console.log("failed to parse JSON response", resp);
      return null;
    }
  }
  static serialize(obj, parentKey) {
    let queryStr = [];
    for (var key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) {
        continue;
      }
      let paramKey = parentKey ? `${parentKey}[${key}]` : key;
      let paramVal = obj[key];
      if (typeof paramVal === "object") {
        queryStr.push(this.serialize(paramVal, paramKey));
      } else {
        queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
      }
    }
    return queryStr.join("&");
  }
  static appendParams(url, params) {
    if (Object.keys(params).length === 0) {
      return url;
    }
    let prefix = url.match(/\?/) ? "&" : "?";
    return `${url}${prefix}${this.serialize(params)}`;
  }
};

// js/phoenix/longpoll.js
var LongPoll = class {
  constructor(endPoint) {
    this.endPoint = null;
    this.token = null;
    this.skipHeartbeat = true;
    this.onopen = function() {
    };
    this.onerror = function() {
    };
    this.onmessage = function() {
    };
    this.onclose = function() {
    };
    this.pollEndpoint = this.normalizeEndpoint(endPoint);
    this.readyState = SOCKET_STATES.connecting;
    this.poll();
  }
  normalizeEndpoint(endPoint) {
    return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
  }
  endpointURL() {
    return Ajax.appendParams(this.pollEndpoint, { token: this.token });
  }
  closeAndRetry() {
    this.close();
    this.readyState = SOCKET_STATES.connecting;
  }
  ontimeout() {
    this.onerror("timeout");
    this.closeAndRetry();
  }
  poll() {
    if (!(this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting)) {
      return;
    }
    Ajax.request("GET", this.endpointURL(), "application/json", null, this.timeout, this.ontimeout.bind(this), (resp) => {
      if (resp) {
        var { status, token, messages } = resp;
        this.token = token;
      } else {
        status = 0;
      }
      switch (status) {
        case 200:
          messages.forEach((msg) => {
            setTimeout(() => {
              this.onmessage({ data: msg });
            }, 0);
          });
          this.poll();
          break;
        case 204:
          this.poll();
          break;
        case 410:
          this.readyState = SOCKET_STATES.open;
          this.onopen();
          this.poll();
          break;
        case 403:
          this.onerror();
          this.close();
          break;
        case 0:
        case 500:
          this.onerror();
          this.closeAndRetry();
          break;
        default:
          throw new Error(`unhandled poll status ${status}`);
      }
    });
  }
  send(body) {
    Ajax.request("POST", this.endpointURL(), "application/json", body, this.timeout, this.onerror.bind(this, "timeout"), (resp) => {
      if (!resp || resp.status !== 200) {
        this.onerror(resp && resp.status);
        this.closeAndRetry();
      }
    });
  }
  close(_code, _reason) {
    this.readyState = SOCKET_STATES.closed;
    this.onclose();
  }
};

// js/phoenix/presence.js
var Presence = class {
  constructor(channel, opts = {}) {
    let events = opts.events || { state: "presence_state", diff: "presence_diff" };
    this.state = {};
    this.pendingDiffs = [];
    this.channel = channel;
    this.joinRef = null;
    this.caller = {
      onJoin: function() {
      },
      onLeave: function() {
      },
      onSync: function() {
      }
    };
    this.channel.on(events.state, (newState) => {
      let { onJoin, onLeave, onSync } = this.caller;
      this.joinRef = this.channel.joinRef();
      this.state = Presence.syncState(this.state, newState, onJoin, onLeave);
      this.pendingDiffs.forEach((diff) => {
        this.state = Presence.syncDiff(this.state, diff, onJoin, onLeave);
      });
      this.pendingDiffs = [];
      onSync();
    });
    this.channel.on(events.diff, (diff) => {
      let { onJoin, onLeave, onSync } = this.caller;
      if (this.inPendingSyncState()) {
        this.pendingDiffs.push(diff);
      } else {
        this.state = Presence.syncDiff(this.state, diff, onJoin, onLeave);
        onSync();
      }
    });
  }
  onJoin(callback) {
    this.caller.onJoin = callback;
  }
  onLeave(callback) {
    this.caller.onLeave = callback;
  }
  onSync(callback) {
    this.caller.onSync = callback;
  }
  list(by) {
    return Presence.list(this.state, by);
  }
  inPendingSyncState() {
    return !this.joinRef || this.joinRef !== this.channel.joinRef();
  }
  static syncState(currentState, newState, onJoin, onLeave) {
    let state = this.clone(currentState);
    let joins = {};
    let leaves = {};
    this.map(state, (key, presence) => {
      if (!newState[key]) {
        leaves[key] = presence;
      }
    });
    this.map(newState, (key, newPresence) => {
      let currentPresence = state[key];
      if (currentPresence) {
        let newRefs = newPresence.metas.map((m) => m.phx_ref);
        let curRefs = currentPresence.metas.map((m) => m.phx_ref);
        let joinedMetas = newPresence.metas.filter((m) => curRefs.indexOf(m.phx_ref) < 0);
        let leftMetas = currentPresence.metas.filter((m) => newRefs.indexOf(m.phx_ref) < 0);
        if (joinedMetas.length > 0) {
          joins[key] = newPresence;
          joins[key].metas = joinedMetas;
        }
        if (leftMetas.length > 0) {
          leaves[key] = this.clone(currentPresence);
          leaves[key].metas = leftMetas;
        }
      } else {
        joins[key] = newPresence;
      }
    });
    return this.syncDiff(state, { joins, leaves }, onJoin, onLeave);
  }
  static syncDiff(state, diff, onJoin, onLeave) {
    let { joins, leaves } = this.clone(diff);
    if (!onJoin) {
      onJoin = function() {
      };
    }
    if (!onLeave) {
      onLeave = function() {
      };
    }
    this.map(joins, (key, newPresence) => {
      let currentPresence = state[key];
      state[key] = this.clone(newPresence);
      if (currentPresence) {
        let joinedRefs = state[key].metas.map((m) => m.phx_ref);
        let curMetas = currentPresence.metas.filter((m) => joinedRefs.indexOf(m.phx_ref) < 0);
        state[key].metas.unshift(...curMetas);
      }
      onJoin(key, currentPresence, newPresence);
    });
    this.map(leaves, (key, leftPresence) => {
      let currentPresence = state[key];
      if (!currentPresence) {
        return;
      }
      let refsToRemove = leftPresence.metas.map((m) => m.phx_ref);
      currentPresence.metas = currentPresence.metas.filter((p) => {
        return refsToRemove.indexOf(p.phx_ref) < 0;
      });
      onLeave(key, currentPresence, leftPresence);
      if (currentPresence.metas.length === 0) {
        delete state[key];
      }
    });
    return state;
  }
  static list(presences, chooser) {
    if (!chooser) {
      chooser = function(key, pres) {
        return pres;
      };
    }
    return this.map(presences, (key, presence) => {
      return chooser(key, presence);
    });
  }
  static map(obj, func) {
    return Object.getOwnPropertyNames(obj).map((key) => func(key, obj[key]));
  }
  static clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};

// js/phoenix/serializer.js
var serializer_default = {
  HEADER_LENGTH: 1,
  META_LENGTH: 4,
  KINDS: { push: 0, reply: 1, broadcast: 2 },
  encode(msg, callback) {
    if (msg.payload.constructor === ArrayBuffer) {
      return callback(this.binaryEncode(msg));
    } else {
      let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
      return callback(JSON.stringify(payload));
    }
  },
  decode(rawPayload, callback) {
    if (rawPayload.constructor === ArrayBuffer) {
      return callback(this.binaryDecode(rawPayload));
    } else {
      let [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
      return callback({ join_ref, ref, topic, event, payload });
    }
  },
  binaryEncode(message) {
    let { join_ref, ref, event, topic, payload } = message;
    let metaLength = this.META_LENGTH + join_ref.length + ref.length + topic.length + event.length;
    let header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
    let view = new DataView(header);
    let offset = 0;
    view.setUint8(offset++, this.KINDS.push);
    view.setUint8(offset++, join_ref.length);
    view.setUint8(offset++, ref.length);
    view.setUint8(offset++, topic.length);
    view.setUint8(offset++, event.length);
    Array.from(join_ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
    Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
    Array.from(topic, (char) => view.setUint8(offset++, char.charCodeAt(0)));
    Array.from(event, (char) => view.setUint8(offset++, char.charCodeAt(0)));
    var combined = new Uint8Array(header.byteLength + payload.byteLength);
    combined.set(new Uint8Array(header), 0);
    combined.set(new Uint8Array(payload), header.byteLength);
    return combined.buffer;
  },
  binaryDecode(buffer) {
    let view = new DataView(buffer);
    let kind = view.getUint8(0);
    let decoder = new TextDecoder();
    switch (kind) {
      case this.KINDS.push:
        return this.decodePush(buffer, view, decoder);
      case this.KINDS.reply:
        return this.decodeReply(buffer, view, decoder);
      case this.KINDS.broadcast:
        return this.decodeBroadcast(buffer, view, decoder);
    }
  },
  decodePush(buffer, view, decoder) {
    let joinRefSize = view.getUint8(1);
    let topicSize = view.getUint8(2);
    let eventSize = view.getUint8(3);
    let offset = this.HEADER_LENGTH + this.META_LENGTH - 1;
    let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
    offset = offset + joinRefSize;
    let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    let event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    let data = buffer.slice(offset, buffer.byteLength);
    return { join_ref: joinRef, ref: null, topic, event, payload: data };
  },
  decodeReply(buffer, view, decoder) {
    let joinRefSize = view.getUint8(1);
    let refSize = view.getUint8(2);
    let topicSize = view.getUint8(3);
    let eventSize = view.getUint8(4);
    let offset = this.HEADER_LENGTH + this.META_LENGTH;
    let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
    offset = offset + joinRefSize;
    let ref = decoder.decode(buffer.slice(offset, offset + refSize));
    offset = offset + refSize;
    let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    let event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    let data = buffer.slice(offset, buffer.byteLength);
    let payload = { status: event, response: data };
    return { join_ref: joinRef, ref, topic, event: CHANNEL_EVENTS.reply, payload };
  },
  decodeBroadcast(buffer, view, decoder) {
    let topicSize = view.getUint8(1);
    let eventSize = view.getUint8(2);
    let offset = this.HEADER_LENGTH + 2;
    let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    let event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    let data = buffer.slice(offset, buffer.byteLength);
    return { join_ref: null, ref: null, topic, event, payload: data };
  }
};

// js/phoenix/socket.js
var Socket = class {
  constructor(endPoint, opts = {}) {
    this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
    this.channels = [];
    this.sendBuffer = [];
    this.ref = 0;
    this.timeout = opts.timeout || DEFAULT_TIMEOUT;
    this.transport = opts.transport || global.WebSocket || LongPoll;
    this.establishedConnections = 0;
    this.defaultEncoder = serializer_default.encode.bind(serializer_default);
    this.defaultDecoder = serializer_default.decode.bind(serializer_default);
    this.closeWasClean = false;
    this.binaryType = opts.binaryType || "arraybuffer";
    this.connectClock = 1;
    if (this.transport !== LongPoll) {
      this.encode = opts.encode || this.defaultEncoder;
      this.decode = opts.decode || this.defaultDecoder;
    } else {
      this.encode = this.defaultEncoder;
      this.decode = this.defaultDecoder;
    }
    let awaitingConnectionOnPageShow = null;
    if (phxWindow && phxWindow.addEventListener) {
      phxWindow.addEventListener("pagehide", (_e) => {
        if (this.conn) {
          this.disconnect();
          awaitingConnectionOnPageShow = this.connectClock;
        }
      });
      phxWindow.addEventListener("pageshow", (_e) => {
        if (awaitingConnectionOnPageShow === this.connectClock) {
          awaitingConnectionOnPageShow = null;
          this.connect();
        }
      });
    }
    this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 3e4;
    this.rejoinAfterMs = (tries) => {
      if (opts.rejoinAfterMs) {
        return opts.rejoinAfterMs(tries);
      } else {
        return [1e3, 2e3, 5e3][tries - 1] || 1e4;
      }
    };
    this.reconnectAfterMs = (tries) => {
      if (opts.reconnectAfterMs) {
        return opts.reconnectAfterMs(tries);
      } else {
        return [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][tries - 1] || 5e3;
      }
    };
    this.logger = opts.logger || null;
    this.longpollerTimeout = opts.longpollerTimeout || 2e4;
    this.params = closure(opts.params || {});
    this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
    this.vsn = opts.vsn || DEFAULT_VSN;
    this.heartbeatTimer = null;
    this.pendingHeartbeatRef = null;
    this.reconnectTimer = new Timer(() => {
      this.teardown(() => this.connect());
    }, this.reconnectAfterMs);
  }
  replaceTransport(newTransport) {
    this.disconnect();
    this.transport = newTransport;
  }
  protocol() {
    return location.protocol.match(/^https/) ? "wss" : "ws";
  }
  endPointURL() {
    let uri = Ajax.appendParams(Ajax.appendParams(this.endPoint, this.params()), { vsn: this.vsn });
    if (uri.charAt(0) !== "/") {
      return uri;
    }
    if (uri.charAt(1) === "/") {
      return `${this.protocol()}:${uri}`;
    }
    return `${this.protocol()}://${location.host}${uri}`;
  }
  disconnect(callback, code, reason) {
    this.connectClock++;
    this.closeWasClean = true;
    this.reconnectTimer.reset();
    this.teardown(callback, code, reason);
  }
  connect(params) {
    this.connectClock++;
    if (params) {
      console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
      this.params = closure(params);
    }
    if (this.conn) {
      return;
    }
    this.closeWasClean = false;
    this.conn = new this.transport(this.endPointURL());
    this.conn.binaryType = this.binaryType;
    this.conn.timeout = this.longpollerTimeout;
    this.conn.onopen = () => this.onConnOpen();
    this.conn.onerror = (error) => this.onConnError(error);
    this.conn.onmessage = (event) => this.onConnMessage(event);
    this.conn.onclose = (event) => this.onConnClose(event);
  }
  log(kind, msg, data) {
    this.logger(kind, msg, data);
  }
  hasLogger() {
    return this.logger !== null;
  }
  onOpen(callback) {
    let ref = this.makeRef();
    this.stateChangeCallbacks.open.push([ref, callback]);
    return ref;
  }
  onClose(callback) {
    let ref = this.makeRef();
    this.stateChangeCallbacks.close.push([ref, callback]);
    return ref;
  }
  onError(callback) {
    let ref = this.makeRef();
    this.stateChangeCallbacks.error.push([ref, callback]);
    return ref;
  }
  onMessage(callback) {
    let ref = this.makeRef();
    this.stateChangeCallbacks.message.push([ref, callback]);
    return ref;
  }
  onConnOpen() {
    if (this.hasLogger())
      this.log("transport", `connected to ${this.endPointURL()}`);
    this.closeWasClean = false;
    this.establishedConnections++;
    this.flushSendBuffer();
    this.reconnectTimer.reset();
    this.resetHeartbeat();
    this.stateChangeCallbacks.open.forEach(([, callback]) => callback());
  }
  heartbeatTimeout() {
    if (this.pendingHeartbeatRef) {
      this.pendingHeartbeatRef = null;
      if (this.hasLogger()) {
        this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
      }
      this.abnormalClose("heartbeat timeout");
    }
  }
  resetHeartbeat() {
    if (this.conn && this.conn.skipHeartbeat) {
      return;
    }
    this.pendingHeartbeatRef = null;
    clearTimeout(this.heartbeatTimer);
    setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
  }
  teardown(callback, code, reason) {
    if (!this.conn) {
      return callback && callback();
    }
    this.waitForBufferDone(() => {
      if (this.conn) {
        if (code) {
          this.conn.close(code, reason || "");
        } else {
          this.conn.close();
        }
      }
      this.waitForSocketClosed(() => {
        if (this.conn) {
          this.conn.onclose = function() {
          };
          this.conn = null;
        }
        callback && callback();
      });
    });
  }
  waitForBufferDone(callback, tries = 1) {
    if (tries === 5 || !this.conn || !this.conn.bufferedAmount) {
      callback();
      return;
    }
    setTimeout(() => {
      this.waitForBufferDone(callback, tries + 1);
    }, 150 * tries);
  }
  waitForSocketClosed(callback, tries = 1) {
    if (tries === 5 || !this.conn || this.conn.readyState === SOCKET_STATES.closed) {
      callback();
      return;
    }
    setTimeout(() => {
      this.waitForSocketClosed(callback, tries + 1);
    }, 150 * tries);
  }
  onConnClose(event) {
    let closeCode = event && event.code;
    if (this.hasLogger())
      this.log("transport", "close", event);
    this.triggerChanError();
    clearTimeout(this.heartbeatTimer);
    if (!this.closeWasClean && closeCode !== 1e3) {
      this.reconnectTimer.scheduleTimeout();
    }
    this.stateChangeCallbacks.close.forEach(([, callback]) => callback(event));
  }
  onConnError(error) {
    if (this.hasLogger())
      this.log("transport", error);
    let transportBefore = this.transport;
    let establishedBefore = this.establishedConnections;
    this.stateChangeCallbacks.error.forEach(([, callback]) => {
      callback(error, transportBefore, establishedBefore);
    });
    if (transportBefore === this.transport || establishedBefore > 0) {
      this.triggerChanError();
    }
  }
  triggerChanError() {
    this.channels.forEach((channel) => {
      if (!(channel.isErrored() || channel.isLeaving() || channel.isClosed())) {
        channel.trigger(CHANNEL_EVENTS.error);
      }
    });
  }
  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case SOCKET_STATES.connecting:
        return "connecting";
      case SOCKET_STATES.open:
        return "open";
      case SOCKET_STATES.closing:
        return "closing";
      default:
        return "closed";
    }
  }
  isConnected() {
    return this.connectionState() === "open";
  }
  remove(channel) {
    this.off(channel.stateChangeRefs);
    this.channels = this.channels.filter((c) => c.joinRef() !== channel.joinRef());
  }
  off(refs) {
    for (let key in this.stateChangeCallbacks) {
      this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
        return refs.indexOf(ref) === -1;
      });
    }
  }
  channel(topic, chanParams = {}) {
    let chan = new Channel(topic, chanParams, this);
    this.channels.push(chan);
    return chan;
  }
  push(data) {
    if (this.hasLogger()) {
      let { topic, event, payload, ref, join_ref } = data;
      this.log("push", `${topic} ${event} (${join_ref}, ${ref})`, payload);
    }
    if (this.isConnected()) {
      this.encode(data, (result) => this.conn.send(result));
    } else {
      this.sendBuffer.push(() => this.encode(data, (result) => this.conn.send(result)));
    }
  }
  makeRef() {
    let newRef = this.ref + 1;
    if (newRef === this.ref) {
      this.ref = 0;
    } else {
      this.ref = newRef;
    }
    return this.ref.toString();
  }
  sendHeartbeat() {
    if (this.pendingHeartbeatRef && !this.isConnected()) {
      return;
    }
    this.pendingHeartbeatRef = this.makeRef();
    this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
    this.heartbeatTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
  }
  abnormalClose(reason) {
    this.closeWasClean = false;
    if (this.isConnected()) {
      this.conn.close(WS_CLOSE_NORMAL, reason);
    }
  }
  flushSendBuffer() {
    if (this.isConnected() && this.sendBuffer.length > 0) {
      this.sendBuffer.forEach((callback) => callback());
      this.sendBuffer = [];
    }
  }
  onConnMessage(rawMessage) {
    this.decode(rawMessage.data, (msg) => {
      let { topic, event, payload, ref, join_ref } = msg;
      if (ref && ref === this.pendingHeartbeatRef) {
        clearTimeout(this.heartbeatTimer);
        this.pendingHeartbeatRef = null;
        setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
      }
      if (this.hasLogger())
        this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
      for (let i = 0; i < this.channels.length; i++) {
        const channel = this.channels[i];
        if (!channel.isMember(topic, event, payload, join_ref)) {
          continue;
        }
        channel.trigger(event, payload, ref, join_ref);
      }
      for (let i = 0; i < this.stateChangeCallbacks.message.length; i++) {
        let [, callback] = this.stateChangeCallbacks.message[i];
        callback(msg);
      }
    });
  }
  leaveOpenTopic(topic) {
    let dupChannel = this.channels.find((c) => c.topic === topic && (c.isJoined() || c.isJoining()));
    if (dupChannel) {
      if (this.hasLogger())
        this.log("transport", `leaving duplicate topic "${topic}"`);
      dupChannel.leave();
    }
  }
};
//# sourceMappingURL=phoenix.cjs.js.map
  })();
});
require.alias("phoenix/priv/static/phoenix.cjs.js", "phoenix");
require.alias("phoenix_html/priv/static/phoenix_html.js", "phoenix_html");require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('aframe/aframeApp.js');
//# sourceMappingURL=aframe.js.map