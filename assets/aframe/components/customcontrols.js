export default class Controls {

    static cycleMenu() {
        window.app.menuController.cycleMenu();
    }

    static toggleMenu() {
        window.app.menuController.toggleMenu();
    }

    static scrollUp() {
        // check active window first
        const activeTab = window.app.menuController.activeTab;
        const tab = window.app.menuController.tabIDs[activeTab];
        switch (tab) {
            case '#logger-info':
                window.app.Logger.scrollUp();
                break;
            case '#logger-trace':
                window.app.Tracer.scrollUp();
                break;
            default:
                break;
        }
    }

    static scrollDown() {
        const activeTab = window.app.menuController.activeTab;
        const tab = window.app.menuController.tabIDs[activeTab];
        switch (tab) {
            case '#logger-info':
                window.app.Logger.scrollDown();
                break;
            case '#logger-trace':
                window.app.Tracer.scrollDown();
                break;
            default:
                break;
        }
    }
}

window.addEventListener('keydown', function (e) {
    //console.log(e.key);
    switch (e.key) {
        case 'm':
            Controls.toggleMenu();
            break;
        case 'r':
            Controls.cycleMenu();
            break;
        case 'i':
            Controls.scrollUp();
            break;
        case 'k':
            Controls.scrollDown();
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
        const el = this.el; //TODO idk if needed
        const self = this;
        this.timer = 0;
        this.quat = new THREE.Quaternion();
        this.vecZ = new THREE.Vector3(0, 0, -1); //forward direction of camera -z
        this.vecX = new THREE.Vector3(1, 0, 0); // x axis for sideways movement
        this.axisL = [0, 0]; //controller trackpad x,z axis
        this.axisR = [0, 0];
        this.trackpadPressedR = false;
        this.intervalID = null; // scrolling interval id

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
            document.querySelector('a-scene').components.screenshot.capture('perspective');
        });

        controllerRight.addEventListener('menudown', evt => {
            console.log('RIGHT MENU');
            // call this.somefunction toggle menu idk

            //get active tab id, cycle to next on side grip etc
            Controls.toggleMenu();
        });

        // trackpad
        controllerLeft.addEventListener('axismove', evt => {
            // position on trackpad, x,z values [-1,1]
            // TODO just yeet this.axis = evt...
            const axis = evt.detail.axis;
            this.axisL = axis;
        });

        controllerRight.addEventListener('axismove', evt => {
            const axis = evt.detail.axis;
            this.axisR = axis;
        });
        // right trackpad: use click and axis location to create arrow key functionality?.. for.. something..
        // can be different depending on active menu tab
        controllerRight.addEventListener('trackpaddown', evt => {
            // trackpad position not available in this event
            this.trackpadPressedR = true;
            console.log(this.axisR);
            const posX = this.axisR[0];
            const posY = this.axisR[1];
            if (posX == 0 && posY == 0) return; //position not updated when clicking fast
            let type;

            if (Math.abs(posX) < 0.4 && Math.abs(posY) < 0.4) {
                type = 'middle';
            } else {
                if (Math.abs(posX) > Math.abs(posY)) {
                    //left or right
                    (posX > 0) ? type = 'right' : type = 'left';
                } else {
                    // up or down
                    (posY > 0) ? type = 'up' : type = 'down';
                }
            }
            const clickEvent = new CustomEvent('trackpadclick', { detail: type });
            controllerRight.dispatchEvent(clickEvent);
            //test
            this.intervalID = setTimeout(() => {
                if (this.trackpadPressedR) {
                    console.log('starting auto scroll');
                    this.intervalID = setInterval(() => controllerRight.dispatchEvent(clickEvent), 50);
                }
            }, 1000);
        });

        // set timeout for auto scroll
        // on let go: cancel timeout
        // if fired: cancel interval

        controllerRight.addEventListener('trackpadup', evt => {
            this.trackpadPressedR = false;
            console.log('stop scrolling');
            clearInterval(this.intervalID); // also clears timeout if not reached yet
        })

        controllerRight.addEventListener('trackpadclick', evt => {
            console.log('detail: ', evt.detail);
            switch (evt.detail) {
                case 'up':
                    Controls.scrollUp();
                    break;
                case 'down':
                    Controls.scrollDown();
                    break;
                case 'left':

                    break;
                case 'right':

                    break;
                case 'middle':

                    break;
                default:
                    break;
            }
        })
    },

    tick: function (time, timeDelta) {
        //console.log(this.axis); // TODO test if axis resets to 0,0 on release, then return here ig
        const vecX = this.vecX;
        const vecZ = this.vecZ;

        const pos = this.data.cameraRig.object3D.position;
        // camera rotation quaternion
        this.quat.copy(this.data.camera.object3D.quaternion);
        //apply to direction vectors
        vecZ.applyQuaternion(this.quat);
        vecX.applyQuaternion(this.quat);

        // scale vecs with speed scalar, add to position..
        const axis = this.axisL;
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