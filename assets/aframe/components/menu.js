
AFRAME.registerComponent('menu', {
    init: function () {
        console.log('menu init');

        document.querySelector('a-scene').addEventListener('enter-vr', function () {
            console.log("ENTERED VR");
            // attach menu to controller

            let entity = document.querySelector('#menu');
            let newParent = document.querySelector('#controllerRight');
            //entity.flushToDOM(); //not needed? dafuq
            let copy = entity.cloneNode(true);
            newParent.appendChild(copy);
            entity.parentNode.removeChild(entity);
            //resize
            copy.setAttribute('scale', '0.5 0.5 0.5');
        });



    }
});

// AFRAME.registerSystem('menu', {
//     init: function () {
//         console.log('CCCCCCCCCCCCCCCCCC');
//         this.commands = new Map();
//         this.channel = window.socket.channel("nodes", {});
//         this.nodesContainer = document.querySelector('#menu-nodes');

//         let updateNodes = msg => {
//             this.update(msg.nodes);
//         };

//         this.channel.join().receive("ok", updateNodes);
//         // update msg callback
//         this.channel.on("update", updateNodes);
//     },

//     updateNodes: function (nodes) {
//         console.log('yeet');
//     }
// });

export default class Test {
    constructor(container) {
        this.container = container;
        this.channel = window.socket.channel("nodes", {});

        let updateNodes = msg => {
            this.update(msg.nodes);
        };

        this.channel.join().receive("ok", updateNodes);
        // update msg callback
        this.channel.on("update", updateNodes);
    }

    update(nodes) {
        console.log('updating nodes: ', nodes);
    }
}
//temp :p
let t = new Test("aa");
//t.update("a");