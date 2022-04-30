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

        this.channel.on('visualize_node', msg => this.visualizeNode(msg));
        this.channel.on('cleanup_node', msg => this.cleanupNode(msg));
        this.channel.on('spawn', msg => this.spawn(msg));
        this.channel.on('exit', msg => this.exit(msg));
        this.channel.on('name', msg => this.name(msg));
        this.channel.on('links', msg => this.links(msg));
        this.channel.on('unlink', msg => this.unlink(msg));
        this.channel.on('msg', msg => this.msg(msg));
    }

    visualizeNode(msg) {
        console.log('VISUALIZEEEE ', msg);
        $.each(msg.pids, (pid, info) => this.addProcess(pid, info));
        //this.nodes++;
        this.graph.update(true);
    }

    cleanupNode(msg) {
        console.log('cleanup node');
        //delete all processes from node
        $.each(this.processes, (pid, process) => {
            if (process.node == msg.node) {
                this.removeProcess(pid);
            }
        });
        delete this.grouping_processes[msg.node];
        this.graph.update(true); //no reload if false?
    }

    spawn(msg) {
        $.each(msg, (pid, info) => {
            this.addProcess(pid, info);
            // might need null check idk TODO yes it does lol
            window.app.Logger?.logOne(this.processes[pid], 'spawn');
        });
        this.graph.update(true);
    }

    exit(msg) {
        if (this.processes[msg.pid]) {
            window.app.Logger?.logOne(this.processes[msg.pid], 'exit');
            this.removeProcess(msg.pid);
            this.graph.update(true);
        }
    }

    name(msg) {
        console.log('name')
    }

    links(msg) {
        let from = this.processes[msg.from],
            to = this.processes[msg.to];

        if (from && to) {
            this.addLink(from, to);
            window.app.Logger?.logTwo(from, to, 'link');
            // from was unlinked so had an invisible link
            if (!msg.from_was_unlinked)
                this.removeInvisibleLink(from);

            if (!msg.to_was_unlinked)
                this.removeInvisibleLink(to);

            this.graph.update(true);
        }
    }

    unlink(msg) {
        let from = this.processes[msg.from],
            to = this.processes[msg.to];

        if (from && to) {
            this.graph.removeLink(from, to); //TODO
            window.app.Logger?.logTwo(from, to, 'unlink');
            // from now has no links, add invisible link
            if (!msg.from_any_links)
                this.addInvisibleLink(from);

            if (!msg.to_any_links)
                this.addInvisibleLink(to);

            this.graph.update(true);
        }
    }

    msg(msg) {
        // incoming msgs from traced processes
        let from = this.processes[msg.from_pid],
            to = this.processes[msg.to_pid]; // why tf different here lol

        window.app.Tracer?.logMessage(from, to, msg.msg);

        //TODO shit from 2D needed here??
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

    addLink(from, to) {
        if (from && to) {
            from.links[to.id] = to;
            to.links[from.id] = from;
            this.graph.addLink(from, to);
        }
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
            this.graph.addInvisibleLink(grouping_process, process);
        }
        // not yet seen, skip and add later..
    }

    removeInvisibleLink(process) {
        let grouping_processes = this.grouping_processes[process.node];

        if (grouping_processes) {
            delete grouping_processes.invisible_links[process.id];
            this.graph.removeInvisibleLink(grouping_processes, process);
        }
    }

    removeProcess(pid) {
        if (!this.processes[pid]) {
            console.log('tried to remove unknown process', pid);
            return;
        }
        let process = this.processes[pid];
        $.each(process.links, (_other_pid, other_process) => delete other_process.links[pid]);
        this.removeInvisibleLink(process);
        //difference between ↑ ↓ ? dafuq
        d3.values(process.links).forEach(linked_process => {
            delete linked_process.links[pid];

            //when a process exits, its linked ports also exit
            if (linked_process.id.match(/#Port<[\d\.]+>/)) {
                delete this.processes[linked_process.id];
            }
        });
        this.graph.removeProcess(process);
        delete this.processes[pid];
    }

    msgTracePID(id) {
        console.log('tracing: ', id);
        this.channel.push('msg_trace', id);
    }

    stopMsgTraceAll(node) {
        console.log('stop msg tracing');
        this.channel.push('stop_msg_trace_all', node);
        this.graph.stopMsgTraceAll();
        this.graph.update(false);
    }
    // TODO probs remove this shit no worky
    collapseNode(pid) {
        // not gonna work with menu button component
        // dont implement or use graph onclick instead..
        console.log('nothing yet');
    }
}