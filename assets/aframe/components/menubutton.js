console.log('MENU BUTTON LOADED');
AFRAME.registerComponent('menu-button', {
    /**
     * schema: color and text, idk what else
     */
    schema: {
        color: { type: 'color', default: '#FF0000' },
        text: { type: 'string', default: 'button' }
    },

    init: function () {
        const el = this.el;
        console.log('ID: ', this.id);
        //console.log('test: ', makeButton('#00FF00'));

        const color = el.components.material.material.color;
        const { r, g, b } = color;
        const highlightColor = new THREE.Color(r, g, b);
        highlightColor.offsetHSL(0.5, 0, 0);

        const colorHex = `#${color.getHexString()}`;
        const highlightHex = `#${highlightColor.getHexString()}`;

        console.log(colorHex);

        el.setAttribute('animation__mouseenter', "property: components.material.material.color; type: color; to: " + highlightHex + "; startEvents: mouseenter; dur: 50");
        el.setAttribute('animation__mouseleave', "property: components.material.material.color; type: color; to: " + colorHex + "; startEvents: mouseleave; dur: 50");
        el.setAttribute('animation__click', "property: scale; from: 1 1 1; to: 1.1 1.1 1.1; startEvents: click; dur: 200; dir: alternate");
        el.setAttribute('animation__click2', "property: scale; from: 1.1 1.1 1.1; to: 1 1 1; startEvents: click; dur: 200; delay: 200");

        el.addEventListener('click', evt => {
            console.log(evt);
            // evt.target for clicked el
        });

        // test
        // let geometry = el.getObject3D('mesh').geometry;
        // console.log('geometry: ', geometry);

        // let edges = new THREE.EdgesGeometry(geometry);
        // let line = new THEE.lineSegments(edges, new THREE.LineBasicMaterial({
        //     color: 0xffffff
        // }));

    }
});




// function makeButton(color) {
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