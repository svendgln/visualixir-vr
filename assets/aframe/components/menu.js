import cfg from '../config';
import { offsetColor } from '../util';

AFRAME.registerComponent('menu', {
    dependencies: ['geometry'],
    init: function () {
        console.log('menu init');
        //let t = new Menu();
        window.app.menuController.nodeMenu = new Menu();
        //load menuController here? idk consistency
        const scene = document.querySelector('a-scene');

        scene.addEventListener('enter-vr', function () {
            console.log("ENTERED VR");
            window.app.menuController.initVR();
        });

        // scene.addEventListener('exit-vr', function () {
        //     window.app.menuController.exitVR();
        // })

    }
});


export default class Menu {
    constructor() {
        console.log("MENU LOADED")
        //TODO: scroll button when #nodes > max
        this.nodesContainer = document.querySelector('a-scene #menu-nodes');
        console.log('CONTAINER: ', this.nodesContainer);
        console.log(window.socket)
        console.log(this.nodesContainer.getAttribute('geometry'));
        this.containerHeight = this.nodesContainer.getAttribute('geometry').height;
        this.containerWidth = this.nodesContainer.getAttribute('geometry').width;
        this.channel = window.socket.channel("nodes", {});
        this.nodeColors = new Map();
        this.nodeListSize = 3; //max visible nodes in the menu list at once
        this.nodePadding = 0.05; //test
        this.nodeWidth = this.containerWidth - this.nodePadding;
        this.nodeHeight = 0.2;
        this.maxNodes = Math.floor(this.containerHeight / (this.nodeHeight + this.nodePadding));
        console.log( //TODO maxNodes is unused lol
            'container height: ', this.containerHeight,
            '\nnode height+padding: ', this.nodeHeight + this.nodePadding,
            '\nmax #nodes -> ', this.maxNodes
        )

        let updateNodes = msg => {
            //update this.nodes here idk, for scroll shit.. eventually..
            this.update(msg.nodes);
        };

        this.channel.join().receive("ok", updateNodes);
        // update msg callback
        this.channel.on("update", updateNodes);
    }

    update(nodes) {
        console.log('updating nodes: ', nodes);
        const l = nodes.length;
        const self = this;

        //d3
        d3.select('a-scene').select('#menu-nodes')
            .selectAll('a-entity')
            .data(nodes)
            .join(
                enter => {
                    enter
                        .append('a-entity')
                        .attr('geometry', (d, i) => {
                            console.log('HERE HERE HERE');
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
                            //??split node string at @ idk
                            return `value: ${d}; align: center; wrapCount: 20`
                        })
                        .attr('menu-button', (d, i) => `name: nodeClick; args: ${d}; clickable: true`)
                        //.attr('raycastable', (d, i) => '')
                        .each(function (d, i) {
                            self.nodeColors.set(d, cfg.COLORS[i % cfg.COLORS.length]);
                            self.appendColorLegend(this, d);
                            // update DOM with correct attribute values
                            // TODO needed?
                            this.flushToDOM();
                            console.log('flushed: ', this);
                            console.log(d);
                        });
                },
                update => {
                    console.log('UPDATEDARAUPDATAUPDATEDAUPTEUPDA');
                    return update;
                },
                exit => {
                    console.log('ADADADADADADADADADADADADADADADADA');
                    exit.remove();
                }
            );
    }

    visualizeNode(node) {
        console.log('visualize callback');
        this.channel.push('visualize', node);
    }

    cleanupNode(node) {
        console.log('cleanup callback')
    }

    appendColorLegend(node, key) {
        console.log(node)
        let radius = (this.nodeHeight / 3) / 2; //3 node types
        let offsetY = this.nodeHeight / 2;
        let offsetX = (this.nodeWidth / 2) + radius;

        let baseColor = new THREE.Color(this.nodeColors.get(key));
        let values = {
            process: baseColor,
            supervisor: offsetColor(baseColor, cfg.supervisorOffset),
            port: offsetColor(baseColor, cfg.portOffset)
        }
        Object.entries(values).forEach(([key, color], i) => {
            console.log('ADDED legend button', key);
            let el = document.createElement('a-entity');
            el.setAttribute('position', `${offsetX + this.nodePadding} ${offsetY - radius - (i * radius * 2)} 0.01`);
            el.setAttribute('geometry', `primitive: cylinder; height: 0.01; radius: ${radius}`);
            el.setAttribute('material', `shader: flat; color: #${color.getHexString()}`); //probs change
            el.setAttribute('rotation', '90 0 0');
            //text
            let t = document.createElement('a-entity');
            //t.setAttribute('geometry', 'primitive: plane; width: auto; height: auto');
            //t.setAttribute('material', 'transparent: true; opacity: 0');
            t.setAttribute('text', `wrapCount: 20; value: ${key}; align: left; color: blue; anchor: left; opacity: 1; width: ${this.containerWidth - radius}`);
            t.setAttribute('position', `${radius} -0.02 0`);
            t.setAttribute('rotation', '-90 0 0');
            el.appendChild(t);

            node.appendChild(el);
        })
    }
}
