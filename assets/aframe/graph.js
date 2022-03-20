
const ALPHA_DECAY = 0.015,
    PID_RADIUS = 1, //node size in aframe
    //LABEL_OFFSET_X = 
    //LABEL_OFFSET_Y = 
    INVISIBLE_LINK_STRENGTH = 0.01,
    LINK_LENGTH = 0.15,//0.15, //aframe
    REPULSION = -0.5,//-0.15,//-LINK_LENGTH,
    CENTERING_STRENGTH = 0.2;


// const nodes = [{ test: 'lol' }, {}, {}, {}, {}];

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

    addInvisibleLink(source, target) {
        if (source && target) {
            let link = { source: source, target: target },
                id = this.link_id(source, target);
            this.invisible_links[id] = link;
        }
    }

    update(force_restart) {
        let pids_list = d3.values(this.cluster_view.processes),
            links_list = d3.values(this.links),
            invisible_links_list = d3.values(this.invisible_links),
            self = this;

        let pids_by_node = d3.nest().key(d => d.node).map(pids_list),
            nodes_list = pids_by_node.keys();

        let processes = this.nodeContainer.selectAll('a-entity').data(pids_list, d => d.id);
        let links = this.linkContainer.selectAll('a-entity').data(links_list, d => this.link_id(d.source, d.target));
        let invisible_links = this.invisibleLinkContainer.selectAll('a-entity').data(invisible_links_list, d => this.link_id(d.source, d.target));
        //console.log('prcs', processes);

        this.forceSim.nodes(pids_list);
        this.forceSim.force('link').links(links_list);
        this.forceSim.force('invisiblelink').links(invisible_links_list);

        // update processes 
        
        let testo = d3.values(this.cluster_view.grouping_processes);
        let shit = d3.select('a-scene').select('#d3-test')
        .selectAll('a-entity').data(testo, d => d.id);

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
                .attr('geometry', function (d, i) {
                    //return 'primitive: sphere'
                    return 'primitive: plane; width: 20; height: auto;';
                })
                .attr('position', function (d, i) {
                    //console.log(d);
                    return `${d.x} 5 ${d.y}`
                })
                //make bg transparent
                .attr('material', function(d, i) {
                    return 'color: yellow'
                })
                .attr('text', function (d, i) {
                    return `wrapCount: 20; value: ${d.node}; align: center; color: blue`
                })
                // .each(function(d, i) {
                //     this.flushToDOM()
                // })
                
            },
            update => {
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
                    .merge(processes)
                    .attr('geometry', function (d, i) {
                        //console.log('adding node');
                        return `primitive: sphere; radius: 0.2`;
                    })
                    .attr('position', function (d, i) {
                        //console.log(d)
                        return `${d.x} 0 ${d.y}`
                    })
                    .attr('material', function (d, i) {
                        let color = 'red';
                        if (d.node == 'TEST@CORSAIR') color = 'green';
                        return `shader: standard; color: ${color}`;
                    });
            },
            update => {
                return update;
            },
            exit => {
                exit.remove();
            }
        );

        links.join(
            enter => {
                enter
                    .append('a-entity')
                    .merge(links)
                    .attr('line', function (d, i) {
                        return `start: ${d.source.x} 0 ${d.source.y}; end: ${d.target.x} 0 ${d.target.y}; color: green`;
                    })
            }
        );

        invisible_links.exit().remove();
        let new_invisible_links = invisible_links.enter()
        invisible_links = new_invisible_links.merge(invisible_links);







        if (force_restart)
            this.forceSim.alpha(1).restart();
    }
}