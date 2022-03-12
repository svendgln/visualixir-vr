
AFRAME.registerComponent('menu', {
    init: function () {
        console.log('menu init');
        let t = new Menu("aa");

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
            copy.setAttribute('rotation', '-30 0 0');
            copy.setAttribute('position', '0 0.2 -0.2');
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

export default class Menu {
    constructor() {
        console.log("MENU LOADED")
        //container: menu element, split in node list and button panel
        //this.container = container;
        this.nodesContainer = document.querySelector('a-scene #menu-nodes');
        console.log('CONTAINER: ', this.nodesContainer);
            // .groups: d3 object
        this.containerHeight = this.nodesContainer.getAttribute('geometry').height;
        this.containerWidth = this.nodesContainer.getAttribute('geometry').width;
        this.channel = window.socket.channel("nodes", {});
        this.nodes = [];
        this.nodeListSize = 3; //max visible nodes in the menu list at once
        this.nodePadding = 0.05; //test
        this.nodeWidth = this.containerWidth - this.nodePadding;
        this.nodeHeight = 0.1;
        this.maxNodes = Math.floor(this.containerHeight / (this.nodeHeight + this.nodePadding));
        console.log(
            'container height: ', this.containerHeight,
            '\nnode height+padding: ', this.nodeHeight + this.nodePadding,
            'max #nodes -> ', this.maxNodes
        )

        let updateNodes = msg => {
            this.update(msg.nodes);
        };

        this.channel.join().receive("ok", updateNodes);
        // update msg callback
        this.channel.on("update", updateNodes);
    }

    update(nodes) {
        console.log('updating nodes: ', nodes);
        const l = nodes.length;


        //d3
        d3.select('a-scene').select('#menu-nodes')
            .selectAll('a-entity')
            .data(nodes)
            .join('a-entity')
            .attr('geometry', (d, i) => {
                return `primitive: plane; width: ${this.nodeWidth}; height: ${this.nodeHeight};`
            })
            .attr('position', (d, i) => {
                console.log((this.containerHeight / 2) - (this.nodeHeight / 2));
                let first = (this.containerHeight / 2) - (this.nodeHeight / 2) - this.nodePadding;
                let offset = (this.nodeHeight + this.nodePadding) * -i;
                return `0 ${first + offset} 0.01`
            })
            .attr('material', (d, i) => {
                return 'shader: flat; color: red'
            })
            .attr('text', (d, i) => {
                return `value: ${d}; align: center; wrapCount: 20`
            })
            .attr('menu-button', (d, i) => '')
            .attr('raycastable', (d, i) => '')
            .each(function (d, i) {
                //update DOM with correct attribute values
                this.flushToDOM();
                console.log('flushed: ', this);
            });
    }
}
// temp :p
// create instance in aframeApp..
//let t = new Menu("aa");
//moved to menu component init
//t.update("a");