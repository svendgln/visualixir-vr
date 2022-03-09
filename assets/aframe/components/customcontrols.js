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