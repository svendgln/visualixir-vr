
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