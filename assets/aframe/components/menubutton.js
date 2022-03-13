console.log('MENU BUTTON LOADED');

function nodeClick(target, args) {
    console.log('clicked on', args[0]);
    //send websocket msg.. check target selected class..
    document.lol = target;
    if($(target).hasClass('selected')) {
         $(target).removeClass('selected');
         target.setAttribute('text', 'color: white');
         //target.flushToDOM();
    } else {
        $(target).addClass('selected');
        target.setAttribute('text', 'color: green');
        //target.flushToDOM();
    }
}

AFRAME.registerSystem('menu-button', {
    
    init: function() {
        //button name?/id -> click callbacks
        this.commands = new Map();
        function test(target, args) {
            console.log('custom callback on', target, 'with args: ', args);
        }
        this.addCommand('test', test);
        this.addCommand('nodeClick', nodeClick);
        this.listCommands();
    },

    addCommand: function(name, func) {
        this.commands.set(name, func);
    },

    delCommand: function(name) {
        this.commands.delete(name); //returns boolean
    },

    listCommands: function() {
        //testing
        for (let [name, func] of this.commands) {
            console.log(name, ' -> ', func);
        }
    },

    run: function(name, target, args) {
        let func = this.commands.get(name);
        if (func) {
            func(target, args);
        } else {
            console.log('invalid button callback on button ', target, 'with args: ', args);
        }
    }
})

AFRAME.registerComponent('menu-button', {
    /**
     * schema: color and text, idk what else
     */
    schema: {
        color: { type: 'color', default: '#FF0000' },
        name: { type: 'string' },
        args: { type: 'array', default: [] }
    },

    init: function () {
        const el = this.el;
        document.el = el;
        //system should be accessibe through this.system?..
        const system = this.el.sceneEl.systems['menu-button'];
        console.log('ID: ', this.id, this.system);
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
            console.log('SYSTEM: ', system);
            let target = evt.target;
            system.run(this.data.name, target, this.data.args);
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