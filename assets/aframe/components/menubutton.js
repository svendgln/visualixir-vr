import { offsetColor } from "../util";

console.log('MENU BUTTON LOADED');
// move to file + rename to nodeSelect maybe idk
function nodeClick(target, args) {
    let nodeName = args[0]
    console.log('clicked on', nodeName);
    //send websocket msg.. check target selected class..
    document.lol = target;
    if ($(target).hasClass('selected')) {
        $(target).removeClass('selected');
        target.setAttribute('text', 'color: white');
        window.app.menuController.nodeMenu.cleanupNode(nodeName);
        //target.flushToDOM();
    } else {
        $(target).addClass('selected');
        target.setAttribute('text', 'color: green');
        window.app.menuController.nodeMenu.visualizeNode(nodeName);
        //target.flushToDOM();
    }
}

function noOp(target, args) {
    console.log('no op function');
    return null;
}

//move to file
function nodeInfo(target, args) {
    const data = target.__data__;
    //console.log('Node Info TARGET: ', target);
    console.log('Node Info Command Data: ', data);
    //console.log('TEST', data.children);
    window.app.menuController.nodeInfo.displayNodeInfo(data);
}
// use D3 shit for this
function collapseNode(target, args) {
    const pid = args[0];
    console.log('collapse',pid);
    console.log('target = ', target);
    if (pid) {
        window.app.clusterView.collapseNode(pid);
    } else {
        console.log('no active node or node disconnected');
    }
}
// maybe rename to clickable or idk
AFRAME.registerSystem('menu-button', {

    init: function () {
        //button name?/id -> click callbacks
        this.commands = new Map();
        function test(target, args) {
            console.log('custom callback on', target, 'with args: ', args);
            document.test();
        }
        //temp
        //TODO change to just map.set idk
        this.addCommand('testRemove', document.test2);
        this.addCommand('test', test);
        this.addCommand('nodeClick', nodeClick);
        //this.addCommand('nodeInfo', nodeInfo);
        this.addCommand('collapseNode', collapseNode);
        this.addCommand('noOp', noOp);
        this.listCommands();
    },

    addCommand: function (name, func) {
        this.commands.set(name, func);
    },

    delCommand: function (name) {
        this.commands.delete(name); //returns boolean
    },

    listCommands: function () {
        //testing
        for (let [name, func] of this.commands) {
            console.log(name, ' -> ', func);
        }
    },

    run: function (name, target, args) {
        let func = this.commands.get(name);
        if (func) {
            func(target, args);
        } else {
            console.log('invalid button callback on button', name, 'with args:', args);
        }
    }
})

//NEEDS TO BE RENAMED TO.. idk just button / custom-button
AFRAME.registerComponent('menu-button', {
    /**
     * schema: color and text, idk what else
     */
    schema: {
        offset: { type: 'number', default: 0.5 },
        name: { type: 'string', default: 'noOp' },
        args: { type: 'array', default: [] },
        clickable: { type: 'boolean', default: true } //why lol
    },

    init: function () {
        const el = this.el;
        document.el = el;
        //system should be accessible through this.system?..
        const system = this.el.sceneEl.systems['menu-button'];
        //console.log('ID: ', this.id, this.system);
        //console.log('test: ', makeButton('#00FF00'));

        const color = el.components.material.material.color;
        //const { r, g, b } = color;
        //const highlightColor = new THREE.Color(r, g, b);
        //highlightColor.offsetHSL(0.5, 0, 0);

        const colorHex = `#${color.getHexString()}`;
        const highlightHex = `#${offsetColor(color, this.data.offset).getHexString()}`;

        //console.log(colorHex);


        if (this.data.clickable) {
            //prevent clicking on children to trigger events/animations
            this.el.childNodes.forEach(node => {
                node.addEventListener('mouseenter', evt => {
                    //console.log('HELP');
                    //evt.preventDefault();
                    evt.stopPropagation();
                });
                node.addEventListener('click', evt => {
                    //console.log('no click lolol');
                    evt.stopPropagation();
                });
            });

            el.setAttribute('raycastable', '');

            //only when clickable? -> unclickable buttons possible..
            el.setAttribute('animation__mouseenter', "property: components.material.material.color; type: color; to: " + highlightHex + "; startEvents: mouseenter; dur: 50");
            el.setAttribute('animation__mouseleave', "property: components.material.material.color; type: color; to: " + colorHex + "; startEvents: mouseleave; dur: 50");
            el.setAttribute('animation__click', "property: scale; from: 1 1 1; to: 1.1 1.1 1.1; startEvents: click; dur: 200; dir: alternate");
            el.setAttribute('animation__click2', "property: scale; from: 1.1 1.1 1.1; to: 1 1 1; startEvents: click; dur: 200; delay: 200");

            el.addEventListener('click', evt => {
                console.log(evt);
                // evt.target for clicked el
                //console.log('SYSTEM: ', system);
                let target = evt.target;
                system.run(this.data.name, target, this.data.args);
            });
        }
        // test
        // let geometry = el.getObject3D('mesh').geometry;
        // console.log('geometry: ', geometry);

        // let edges = new THREE.EdgesGeometry(geometry);
        // let line = new THEE.lineSegments(edges, new THREE.LineBasicMaterial({
        //     color: 0xffffff
        // }));

    },

    update: function (oldData) {
        console.log(oldData);
        console.log(this.data);
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