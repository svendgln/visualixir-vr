import Graph from './graph.js';
import Process from './process.js';
import { shiftColor } from './util.js';
import cfg from './config';

export default class {
    constructor(graph_container) {
        console.log('CLUSTER CLASS loaded')
        console.log('CFG', cfg)
        console.log(cfg.linkColor)
        this.processes = {};
        this.grouping_processes = {};
        //this.nodes = 0; //active nodes, used to assign each a different color

        this.graph = new Graph(graph_container, this);

        this.channel = window.socket.channel('trace', {});
        this.channel.join();

        this.channel.on("visualize_node", msg => this.visualizeNode(msg));
    }

    visualizeNode(msg) {
        console.log('VISUALIZEEEE ', msg);
        $.each(msg.pids, (pid, info) => this.addProcess(pid, info));
        //this.nodes++;
        this.graph.update(true);
    }

    addProcess(pid, info) {
        if (this.processes[pid]) return; //exists

        //let color = cfg.COLORS[this.nodes % cfg.COLORS.length];
        let color = window.app.menuController.nodeMenu.nodeColors.get(info.node);
        info.color = new THREE.Color(color);
        let process = this.processes[pid] = new Process(pid, info);

        // 1 grouping process per node
        if (process.isGroupingProcess()) {
            this.grouping_processes[process.node] = process;
            console.log(process)

            // since this is the first time the grouping process has been seen, go through all processes and create invisble links
            d3.values(this.processes).forEach(maybe_unlinked_process => {
                if (!maybe_unlinked_process.isGroupingProcess()) {
                    this.addInvisibleLink(maybe_unlinked_process);
                }
            });
        } else {
            this.addInvisibleLink(process);
        }
        info.links.forEach(other_pid => this.addLink(process, this.processes[other_pid]));
    }

    // if grouping process not yet seen, skip
    // grouping p seen -> add all skipped nodes
    // each node afterwards will be added right away
    // FIX LE EPIC EXPLANATION lol
    addInvisibleLink(process) {
        // 1 per node name
        let grouping_process = this.grouping_processes[process.node];
        if (grouping_process) {
            // process was added before
            grouping_process.invisible_links[process.id] = process;
            this.graph.addInvisibleLink(grouping_process, process); //TODO
        }
        // not yet seen, skip and add later..
    }

    addLink(from, to) {
        if (from && to) {
            from.links[to.id] = to;
            to.links[from.id] = from;
            this.graph.addLink(from, to); //TODO
        }
    }

    collapseNode(pid) {
        console.log('nothing yet');
    }
}