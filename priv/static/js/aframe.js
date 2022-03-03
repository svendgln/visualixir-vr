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
console.log("loading aframe app");

// const fs = require('fs');

// function loadComponents() {
//     const path = './components';
//     let files = fs.readdirSync(path).filter(file => file.endsWith('.js'));
//     console.log(files)
// }

// temp fix
const components = ['clicktest.js', 'customcontrols.js', 'debug.js', 'enterleave.js', 'menubutton.js']
components.forEach(c => require(`./components/${c}`))

require('./test.js');

});

require.register("aframe/components/clicktest.js", function(exports, require, module) {

AFRAME.registerComponent('clicktest', {
    init: function () {
        console.log('CLICK INIT');
        var el = this.el;
        el.addEventListener('click', evt => {
            console.log(el);
            console.log('trigger pressed');
            el.setAttribute('visible', !el.getAttribute('visible'));
        });
    }
})
});

;require.register("aframe/components/customcontrols.js", function(exports, require, module) {
AFRAME.registerComponent('custom-controls', {
    schema: {
        cameraRig: { type: 'selector', default: '#cameraRig' }, 
        camera: { type: 'selector', default: '#camera' },
        speed: { type: 'number', default: 0.1 },
        controllerLeft: { 'type': 'selector', default: '#controllerLeft' },
        controllerRight: { 'type': 'selector', default: '#controllerRight' }
    },

    init: function () {
        console.log('custom controls loaded');
        const el = this.el; //probs not needed
        const self = this;
        this.timer = 0;
        this.quat = new THREE.Quaternion();
        this.vecZ = new THREE.Vector3(0, 0, -1); //forward direction of camera -z
        this.vecX = new THREE.Vector3(1, 0, 0); // x axis for sideways movement
        this.axis = [0, 0]; //controller trackpad x,z axis


        // controller events
        // trigger
        controllerLeft.addEventListener('triggerdown', evt => {
            console.log('LEFT TRIGGER');

        });
        controllerRight.addEventListener('triggerdown', evt => {
            console.log('RIGHT TRIGGER');
        });

        // grip button
        controllerLeft.addEventListener('gripdown', evt => {
            console.log('LEFT GRIP');
        });

        controllerRight.addEventListener('gripdown', evt => {
            console.log('RIGHT GRIP');
        });

        // menu button
        controllerLeft.addEventListener('menudown', evt => {
            console.log('LEFT MENU');
        });

        controllerRight.addEventListener('menudown', evt => {
            console.log('RIGHT MENU');
            //call this.somefunction toggle menu idk
        });

        // trackpad
        controllerLeft.addEventListener('axismove', evt => {
            //position on trackpad, x,z values [-1,1]
            const axis = evt.detail.axis;
            this.axis = axis;
        });

        //right trackpad: use click and axis location to create arrow key functionality?.. for.. something..
    },

    tick: function (time, timeDelta) {
        const vecX = this.vecX;
        const vecZ = this.vecZ;

        const pos = this.data.cameraRig.object3D.position;
        //camera rotation quaternion
        this.quat.copy(this.data.camera.object3D.quaternion);
        //apply to direction vectors
        vecZ.applyQuaternion(this.quat);
        vecX.applyQuaternion(this.quat);

        // scale vecs with speed scalar, add to position..
        const axis = this.axis;
        const axisX = axis[0] * this.data.speed;
        const axisZ = axis[1] * this.data.speed;
        // length 1
        vecZ.normalize();
        vecX.normalize();
        // closer to edge of trackpad = faster
        vecZ.multiplyScalar(axisZ);
        vecX.multiplyScalar(axisX);

        pos.add(vecZ);
        // add x component of vecX to position: only vecZ changes height
        this.data.cameraRig.object3D.position.set(pos.x + vecX.getComponent(0), pos.y, pos.z);
        // reset NEEDED?
        this.vecZ.set(0, 0, -1);
        this.vecX.set(1, 0, 0);
    }
});
});

require.register("aframe/components/debug.js", function(exports, require, module) {

AFRAME.registerComponent('testing', {
    schema: {
        cameraRig: { type: 'selector', default: '#cameraRig' },
        camera: { type: 'selector', default: '#camera' }
    },
    init: function () {
        console.log('testing component loaded');
        this.timer = 0;
    },
    tick: function (time, timeDelta) {
        this.timer += timeDelta
        if (this.timer > 1000) {
            this.timer = 0
            //console.log('log test')
            //TEST
            const rot = this.data.camera.object3D.rotation;
            const quat = this.data.camera.object3D.quaternion;

            const line = document.querySelectorAll('#LINE');
            var vecz = new THREE.Vector3(0, 0, -1);
            var vecx = new THREE.Vector3(1, 0, 0);
            vecx.applyQuaternion(quat); //cam rotation
            vecz.applyQuaternion(quat);
            line.forEach(l => {
                l.object3D.rotation.setFromQuaternion(quat);
            });
            //var currentPos = this.data.cameraRig.object3D.position;
            //currentPos.add(vecz);
            //console.log(this.data.cameraRig.object3D.position, currentPos);
        }
    }
});
});

require.register("aframe/components/enterleave.js", function(exports, require, module) {
// component needed?
AFRAME.registerComponent('enterleave', {
    init: function () {
        var el = this.el;
        console.log(this.el);
        console.log('enter/leave');
        el.addEventListener('enterleave', function (evt) {
            console.log('(╯°□°）╯︵ ┻━┻')
        })
    }
})
});

;require.register("aframe/components/menubutton.js", function(exports, require, module) {
console.log('MENU BUTTON LOADED');
AFRAME.registerComponent('menu-button', {
    init: function () {
        const el = this.el;
        // DOESNT WORK AFTER FIRST CLICK
        el.setAttribute('animation__click', {
            property: 'scale',
            from: { x: 1, y: 1, z: 1 },
            to: { x: 1.1, y: 1.1, z: 1.1 },
            startEvents: 'click',
            dur: 200,
            easing: 'linear'
        });

        el.setAttribute('animation__resetclick', {
            property: 'scale',
            to: { x: 1, y: 1, z: 1 },
            from: { x: 1.1, y: 1.1, z: 1.1 },
            startEvents: 'click',
            dur: 200,
            delay: 200,
            easing: 'linear'
        });
    }
});
});

require.register("aframe/test.js", function(exports, require, module) {
console.log('test loaded');

const DATA = [
    { x: 10, y: 10 },
    { x: 2, y: 2 },
    { x: 4, y: 4 },
    { x: 6, y: 6 },
    { x: 8, y: 8 }
];

document.querySelector('a-scene #d3-container')
    .addEventListener('loaded', console.log('el loaded'))

// old tests
function renderData() {

    d3.select('a-scene').select('#d3-container').selectAll('a-entity')
        .data(DATA)
        .enter()
        .append('a-entity')
        .attr('geometry', function (d, i) {
            return `primitive: sphere; radius: 1`
        })
        .attr('position', function (d, i) {
            console.log('adding sphere on pos', d.x, d.y);
            return `${d.x} 1 ${d.y}`
        })
        .attr('material', function (d, i) {
            return `shader: standard; color: red`
        });
}


// test force simulation:
const nodes = [{ test: 'lol' }, {}, {}, {}, {}];
const linksOLD = [
    { source: 0, target: 1 },
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 3, target: 4 }
];

const links = [
    { source: 0, target: 3 },
    { source: 2, target: 4 },
]

// temp testing function
function addNode() {
    nodes.unshift({});
    sim.nodes(nodes);
    sim.alpha(1).restart();
}

function addLink(source, target) {
    if (source && target) {
        let link = {source: source.index, target: target.index}
        links.push(link)
        console.log(links)
        sim.force('link').links(links);
        // no check if exists..
        sim.alpha(1).restart();
   }
}

const sim = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-10)) //default
    .force('center', d3.forceCenter(0, 0))
    .force('link', d3.forceLink().distance(1).links(links))
    .force('x', d3.forceX().strength(0.5))
    .force('y', d3.forceY().strength(0.5))
    .velocityDecay(0.2)
    .alphaDecay(0.02)
    .on('tick', ticked);


function ticked() {
    const container = d3.select('a-scene').select('#d3-nodes')
        .selectAll('a-entity')
        .data(nodes)
        .join('a-entity')
        .attr('geometry', function (d, i) {
            return `primitive: sphere; radius: 1`
        })
        .attr('position', function (d, i) {
            return `${d.x} 1 ${d.y}`
        })
        .attr('material', function (d, i) {
            return `shader: standard; color: red`
        });

    let test = d3.select('#d3-links').selectAll('a-entity').data(links, d => `${d.source}-${d.target}`)
        .join('a-entity');
        test.attr('line', function (d, i) {
            let source = nodes[d.source.index];
            let target = nodes[d.target.index];
            //console.log(d);
            return `start: ${source.x} 0 ${source.y}; end: ${target.x} 0 ${target.y}; color: green`
        });

    // links.enter()
    //     .append('a-entity')
    //     .attr('line', function (d, i) {
    //         let source = nodes[d.source];
    //         let target = nodes[d.target];
    //         return `start: ${source.x} 0 ${source.y}; end: ${target.x} 0 ${target.y}; color: green`
    //     })
}

function test() {
    console.log('adding node..');
    addNode();
    setTimeout(() => console.log('adding link..'), 1000);
    setTimeout(() => addLink(nodes[0], nodes[5]), 1000);
}
//..
document.test = test;
});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('aframe/aframeApp.js');
//# sourceMappingURL=aframe.js.map