//https://jgbarah.github.io/aframe-playground/camrender-01/
AFRAME.registerComponent('camrender', {
    schema: {
        fps: {
            type: 'number',
            default: 90.0
        },
        cid: {
            type: 'string',
            default: 'camRenderer'
        },
        height: {
            type: 'number',
            default: 300
        },
        width: {
            type: 'number',
            default: 400
        }
    },

    init: function() {
        console.log('INIT CAM2');
        // Counter for ticks since last render
        this.counter = 0;
        // Find canvas element to be used for rendering
        let canvasEl = document.getElementById(this.data.cid);
        // Create renderer
        this.renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvasEl } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( this.data.width, this.data.height );
        // Set properties for renderer DOM element
        this.renderer.domElement.crossorigin = "anonymous"
        this.renderer.domElement.height = this.data.height;
        this.renderer.domElement.width = this.data.width;
    },

    tick: function(time, timeDelta) {
        let loopFPS = 1000.0 / timeDelta;
        let hmdIsXFasterThanDesiredFPS = loopFPS / this.data.fps;
        let renderEveryNthFrame = Math.round(hmdIsXFasterThanDesiredFPS);
        if(this.counter % renderEveryNthFrame === 0){
            this.renderer.render( this.el.sceneEl.object3D , this.el.object3DMap.camera );
            }
        this.counter += 1;
    },
});

AFRAME.registerComponent('canvas-updater', {
    dependencies: ['geometry', 'material'],

    tick: function () {
	    let el = this.el;
	    let material;
	    material = el.getObject3D('mesh').material;
	    if (!material.map) { return; }
        material.map.needsUpdate = true;
    }
});