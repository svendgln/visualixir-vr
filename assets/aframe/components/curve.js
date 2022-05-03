// le epic test
AFRAME.registerComponent('curve', {
    schema: {
        start: { type: 'string', default: '0 0 0' },
        end: { type: 'string', default: '1 1 1' }
    },

    init: function () {
        this.timer = 0;
        this.done = false;
        const [x1, y1, z1] = this.data.start.split(' ').map(n => parseFloat(n));
        const [x2, y2, z2] = this.data.end.split(' ').map(n => parseFloat(n));
        const [xm, ym, zm] = [(x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2];

        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(x1, y1, z1),
            new THREE.Vector3(xm, ym + 3, zm), //const to make line curve upwards
            new THREE.Vector3(x2, y2, z2)
        );

        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0xff0000,
            opacity: 0
        });
        //object to add to the scene
        const curveObject = new THREE.Line(geometry, material);

        //direction cone
        const dir = curve.getTangent(0.5).normalize(); // range [0,1] -> middle of curve
        const mid = curve.getPoint(0.5);
        console.log('tangent:', dir, 'idk', mid);
        const arrowObject = new THREE.ArrowHelper(dir, mid, 0, 0xff0000, 0.8, 0.5);
        arrowObject.cone.material.opacity = 0.2;

        this.el.setObject3D('msgCone', arrowObject);
        this.el.setObject3D('msgCurve', curveObject);
    },
    //tock called after scene has rendered
    tock: function (time, timeDelta) {
        const duration = 1000; // milliseconds 
        //if (time < 5000) return;
        this.timer += timeDelta;
        // function was sometimes called after element was removed from DOM
        if (this.done) return;
        
        //let opacity = this.timer / duration;
        let opacity = Math.sin((this.timer / duration) * Math.PI);
        if (this.timer > duration) {
            this.el.flushToDOM(); //TODO not needed anymore ig
            this.el.removeAttribute('curve'); 
            this.done = true;
            return;
        }
        const { msgCone, msgCurve} = this.el.object3DMap;
        msgCurve.material.opacity = opacity;
        msgCone.cone.material.opacity = opacity;
    },

    remove: function () {
        this.el.removeObject3D('msgCone');
        this.el.removeObject3D('msgCurve');
    }
});
