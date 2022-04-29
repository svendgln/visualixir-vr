export default class Controls {

    static cycleMenu() {
        window.app.menuController.cycleMenu();
    }

    static toggleMenu() {
        window.app.menuController.toggleMenu();
    }
}

window.addEventListener('keydown', function (e) {
    switch (e.key) {
        case 'm':
            Controls.toggleMenu();
            break;
        case 'r':
            Controls.cycleMenu();
            break;
        default:
            break;
    }
})


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
        // dont use triggers for clicking, raycaster fires click event
        // also wont click non vr
        controllerLeft.addEventListener('triggerdown', evt => {
            console.log('LEFT TRIGGER');
            //console.log(evt)
            // could differentiate between left/right controller..
            // for now just using click event..
            //
            // on click check intersection
            // fire left/right click event on intersected el..?
        });
        controllerRight.addEventListener('triggerdown', evt => {
            console.log('RIGHT TRIGGER');
        });

        // grip button
        controllerLeft.addEventListener('gripdown', evt => {
            console.log('LEFT GRIP');
            // cycle controller mode and show popup thingy..
            // HMM ??
            // doesnt work non vr.. 
        });

        controllerRight.addEventListener('gripdown', evt => {
            console.log('RIGHT GRIP');
            Controls.cycleMenu();
            //window.app.menuController.cycleMenu(); // added to class
            // diff between left and right menus idk
        });

        // menu button
        controllerLeft.addEventListener('menudown', evt => {
            console.log('LEFT MENU');
            // toggle mode or some shit
        });

        controllerRight.addEventListener('menudown', evt => {
            console.log('RIGHT MENU');
            // call this.somefunction toggle menu idk

            //get active tab id, cycle to next on side grip etc
            Controls.toggleMenu();
            //window.app.menuController.toggleMenu(); // added to class
            // const m = document.querySelector('#menu');
            // m.setAttribute('visible', !m.getAttribute('visible'));
            // console.log('menu is now', !m.getAttribute('visible')? 'not visible' : 'visible');
        });

        // trackpad
        controllerLeft.addEventListener('axismove', evt => {
            // position on trackpad, x,z values [-1,1]
            // TODO just yeet this.axis = evt...
            const axis = evt.detail.axis;
            this.axis = axis;
        });

        // right trackpad: use click and axis location to create arrow key functionality?.. for.. something..
        // can be different depending on active menu tab
    },

    tick: function (time, timeDelta) {
        const vecX = this.vecX;
        const vecZ = this.vecZ;

        const pos = this.data.cameraRig.object3D.position;
        // camera rotation quaternion
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
        // add x and z component of vecX to position: only vecZ changes height
        this.data.cameraRig.object3D.position.set(pos.x + vecX.getComponent(0), pos.y, pos.z + vecX.getComponent(2));
        // reset NEEDED?
        this.vecZ.set(0, 0, -1);
        this.vecX.set(1, 0, 0);
    }
});