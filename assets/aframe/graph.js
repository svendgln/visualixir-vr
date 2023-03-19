import process from './process';
import { offsetColor } from './util';
import cfg from './config';

const ALPHA_DECAY = 0.015,
    PID_RADIUS = 1, //node size in aframe
    //LABEL_OFFSET_X = 
    //LABEL_OFFSET_Y = 
    INVISIBLE_LINK_STRENGTH = 0.01,
    LINK_LENGTH = 0.15,//0.15, //aframe
    REPULSION = -0.5,//-0.15,//-LINK_LENGTH,
    CENTERING_STRENGTH = 0.2;



export default class {
    constructor(container, cluster_view) {
        console.log('GRAPH loaded', container);
        //this.container = container;
        this.cluster_view = cluster_view;
        this.nodeContainer = d3.select('a-scene').select('#d3-nodes');
        this.linkContainer = d3.select('a-scene').select('#d3-links');
        this.invisibleLinkContainer = d3.select('a-scene').select('#d3-invisible-links');

        this.forceCenter = d3.forceCenter(0, 0);
        this.forceLink = d3.forceLink().distance(LINK_LENGTH);
        this.forceInvisibleLink = d3.forceLink().strength(INVISIBLE_LINK_STRENGTH);
        this.forceManyBody = d3.forceManyBody().strength(REPULSION);

        this.forceSim =
            d3.forceSimulation()
                .force('link', this.forceLink)
                .force('invisiblelink', this.forceInvisibleLink)
                .force('charge', this.forceManyBody)
                .force('center', this.forceCenter)
                .force('x', d3.forceX().strength(CENTERING_STRENGTH))
                .force('y', d3.forceY().strength(CENTERING_STRENGTH))
                .velocityDecay(0.2)
                .alphaDecay(ALPHA_DECAY)
                // only change position in on tick?
                // call update only from websocket callbacks?..
                .on('tick', () => this.update(false));

        this.links = {};
        this.invisible_links = {};
        this.msgs = {};
        //rest not needed yet

        //TEST
        this.cameraRig = document.querySelector('#cameraRig');
        this.processes = null;
        setInterval(() => { console.log('LOL'); this.testFunc() }, 1000)
    }

    // Links
    link_id(from, to) {
        return [from.id, to.id].sort().join('-');
    }

    addLink(source, target) {
        if (source && target) {
            let link = { source: source, target: target },
                id = this.link_id(source, target);
            this.links[id] = link;
        }
    }

    removeLink(source, target) {
        let id = this.link_id(source, target);
        delete this.links[id];
    }

    addInvisibleLink(source, target) {
        if (source && target) {
            let link = { source: source, target: target },
                id = this.link_id(source, target);
            this.invisible_links[id] = link;
        }
    }

    removeInvisibleLink(source, target) {
        if (source && target) {
            let id = this.link_id(source, target);
            delete this.invisible_links[id];
        }
    }

    removeProcess(process) {
        d3.values(process.links).forEach(linked_process => {
            delete this.links[this.link_id(process, linked_process)];
        });

        let grouping_process = this.cluster_view.grouping_processes[process.node];
        if (grouping_process) {
            this.removeInvisibleLink(process, grouping_process);
        }

        if (process == grouping_process) {
            d3.keys(process.invisible_links).forEach(other_process => {
                this.removeInvisibleLink(process, other_process);
            });
        }
    }

    msgTraceProcess(d, node) {
        console.log('traceProcess: ', d);
        d.msg_traced = true;
        this.cluster_view.msgTracePID(d.id);
        // TODO add traced component to node..
    }

    stopMsgTraceAll() {
        d3.values(this.cluster_view.processes).forEach(pid => {
            pid.msg_traced = false;
        });
    }

    update(force_restart) {
        let pids_list = d3.values(this.cluster_view.processes),
            links_list = d3.values(this.links),
            invisible_links_list = d3.values(this.invisible_links),
            self = this;

        let pids_by_node = d3.nest().key(d => d.node).map(pids_list),
            nodes_list = pids_by_node.keys();

        let processes = this.nodeContainer.selectAll('a-entity').data(pids_list, d => d.id);
        //test
        this.processes = processes;
        //
        let links = this.linkContainer.selectAll('a-entity').data(links_list, d => this.link_id(d.source, d.target));
        let invisible_links = this.invisibleLinkContainer.selectAll('a-entity').data(invisible_links_list, d => this.link_id(d.source, d.target));
        //console.log('prcs', processes);

        this.forceSim.nodes(pids_list);
        this.forceSim.force('link').links(links_list);
        this.forceSim.force('invisiblelink').links(invisible_links_list);

        // update processes 

        let grouping_pids_list = d3.values(this.cluster_view.grouping_processes);
        let shit = d3.select('a-scene').select('#d3-test')
            .selectAll('a-entity').data(grouping_pids_list, d => d.id);
        //rename lol TODO
        shit.join(
            enter => {
                enter
                    // .append('a-entity')
                    // .attr('geometry', function (d, i) {
                    //     return 'primitive: sphere' 
                    // })
                    // .merge(shit)
                    .append('a-entity')
                    //.merge(shit)
                    // .attr('geometry', function (d, i) {
                    //     //return 'primitive: sphere'
                    //     return 'primitive: plane; width: 20; height: auto;';
                    // })
                    .attr('position', function (d, i) {
                        //console.log(d);
                        return `${d.x} 5 ${d.y}`
                    })
                    //make bg transparent
                    // .attr('material', function (d, i) {
                    //     return 'color: yellow; transparent: true; opacity: 0'
                    // })
                    .attr('text', function (d, i) {
                        return `wrapCount: 20; value: ${d.node}; align: center; color: blue; side: double; width: 20`
                    })
                // .each(function(d, i) {
                //     this.flushToDOM()
                // })

            },
            update => {
                //needed?
                update
                    .attr('position', function (d, i) {
                        //console.log(d);
                        return `${d.x} 5 ${d.y}`
                    })
            }
        )





        processes.join(
            enter => {
                enter
                    .append('a-entity')
                    //.merge(processes)
                    .attr('geometry', function (d, i) {
                        console.log('adding node');
                        return `primitive: sphere; radius: 0.2`;
                    })
                    .attr('position', function (d, i) {
                        console.log('a')
                        return `${d.x} 0 ${d.y}`
                    })
                    .attr('material', function (d, i) {
                        let type = d.type;
                        //hex value to string
                        //let color = `#${d.color.getHexString()}`;
                        let color = d.color; //THREE.Color
                        //could be switch but only 2..
                        if (type == "supervisor") {
                            let offset = cfg.supervisorOffset;
                            color = offsetColor(color, offset);
                        } else if (type == "port") {
                            let offset = cfg.portOffset;
                            color = offsetColor(color, offset);
                        }
                        //console.log(`#${color.getHexString()}`);
                        return `shader: flat; color: #${color.getHexString()};`;
                    })
                    .on('click', function (d, i) {
                        //if (d3.event.defaultPrevented) return;
                        //    console.log('clicked graph node CALLBACK');
                        //    console.log(this.__data__, d);
                        let mc = window.app.menuController;
                        let activeMenu = mc.tabIDs[mc.activeTab];
                        let visible = mc.visible;
                        console.log(activeMenu, visible);

                        if (!visible) return;
                        switch (activeMenu) {
                            case "#node-info":
                                console.log(this);
                                mc.nodeInfo.displayNodeInfo(this.__data__);
                                console.log('display from graph');
                                break;
                            case "#logger-trace":
                                // add to selected nodes..?
                                //d: event, this: dom el? TODO check tf this is lol
                                self.msgTraceProcess(this.__data__, d.target);
                                break;
                            default:
                                break;
                        }


                        // d is click event?
                        // NO ON CLICK.. -> DELETE IG LOL
                        // set menubutton component with nodeInfo callback
                        // data can be accessed through event.target
                    })
                    // .attr('raycastable', function (d, i) {
                    //     return '';
                    // })
                    //no op function but still highlights nodes
                    .attr('menu-button', function (d, i) {
                        return 'name: noOp; offset: 0.1';
                    })
                    // add node information text
                    .each(function (d, i) {
                        console.log('b')
                        //cant be entity.. selectAll entity error, maybe change to select by class..
                        let name = document.createElement('a-plane');
                        name.setAttribute('material', 'transparent: true; opacity: 0');
                        name.setAttribute('geometry', 'primitive: plane; width: 2; height: auto');
                        name.setAttribute('text', `wrapCount: 20; value: ${d.name}; align: center; color: blue; side: double`);
                        name.setAttribute('position', `0 0.5 0`);

                        this.appendChild(name);
                    })
            },
            update => {
                //return update
                update
                    .attr('position', function (d, i) {

                        return `${d.x} 0 ${d.y}`
                    })
                    // .each(function (d) {
                    //     d.element = this; 
                    // })
            },
            exit => {
                exit.remove();
            }
        );



        //move to node update maybe
        //node info when distance < x
        //     let nodeList = processes._groups[0];
        //    // console.log(nodeList[0])
        //     let camPos = this.cameraRig.object3D.position;
        //     for (let i = 0; i < nodeList.length; i++) {
        //         const data = nodeList[i].__data__;
        //         const dist = Math.sqrt((data.x - camPos.x)^2 + (data.y - camPos.y)^2);

        //     }

        links.join(
            enter => {
                enter
                    .append('a-entity')
                    .merge(links)
                    .attr('line', function (d, i) {
                        let color = new THREE.Color(cfg.linkColor);
                        color = `#${color.getHexString()}`;
                        return `start: ${d.source.x} 0 ${d.source.y}; end: ${d.target.x} 0 ${d.target.y}; color: ${color}`;
                    })
            }
        );

        invisible_links.exit().remove();
        let new_invisible_links = invisible_links.enter()
        invisible_links = new_invisible_links.merge(invisible_links);





        this.testFunc();

        if (force_restart)
            this.forceSim.alpha(1).restart();
    }


    // kinda shit.. idk
    testFunc = () => {
        let rig = document.querySelector('#cameraRig');
        let camPos = rig.object3D.position;
        let nodeList = this.processes._groups[0];
        for (let i = 0; i < nodeList.length; i++) {
            let node = nodeList[i];
            if (node) {
                let d = node.__data__;
                let dist = Math.sqrt((d.x - camPos.x) ** 2 + (d.y - camPos.z) ** 2);
                // console.log(d.x, d.y, camPos.x, camPos.z, dist)

                // let line = document.querySelector('#LINETEST');
                // line.setAttribute('line', `start: ${d.x} 0 ${d.y}; end: ${camPos.x} 0 ${camPos.z}; color: green`)

                let text = node.firstChild;
                //add showAllNodes boolean controlled by menu button idk..
                if (dist < 20) { // TODO change dist in menu?? + - buttons or smth
                    // console.log(node);
                    text.setAttribute('visible', true);
                    //add user height to position
                    let v = new THREE.Vector3(camPos.x, camPos.y + 1.6, camPos.z);
                    text.object3D.lookAt(v);
                    //node.setAttribute('material', 'color: green')
                } else {
                    text.setAttribute('visible', false);
                    //node.setAttribute('material', 'color: red')
                }
            }
            //console.log(camPos.x ) 
        }
    }
}