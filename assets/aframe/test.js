console.log('test loaded');

const DATA = [
    { x: 10, y: 10 },
    { x: 2, y: 2 },
    { x: 4, y: 4 },
    { x: 6, y: 6 },
    { x: 8, y: 8 }
];

document.querySelector('a-scene #d3-container')
    .addEventListener('loaded', console.log('el loaded'))

// old tests
function renderData() {

    d3.select('a-scene').select('#d3-container').selectAll('a-entity')
        .data(DATA)
        .enter()
        .append('a-entity')
        .attr('geometry', function (d, i) {
            return `primitive: sphere; radius: 1`
        })
        .attr('position', function (d, i) {
            console.log('adding sphere on pos', d.x, d.y);
            return `${d.x} 1 ${d.y}`
        })
        .attr('material', function (d, i) {
            return `shader: standard; color: red`
        });
}


// test force simulation:
const nodes = [{ test: 'lol' }, {}, {}, {}, {}];
const linksOLD = [
    { source: 0, target: 1 },
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 3, target: 4 }
];

const links = [
    { source: 0, target: 3 },
    { source: 2, target: 4 },
]

// temp testing function
function addNode() {
    nodes.unshift({});
    sim.nodes(nodes);
    sim.alpha(1).restart();
}

function addLink(source, target) {
    if (source && target) {
        let link = {source: source.index, target: target.index}
        links.push(link)
        console.log(links)
        sim.force('link').links(links);
        // no check if exists..
        sim.alpha(1).restart();
   }
}

const sim = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-10)) //default
    .force('center', d3.forceCenter(0, 0))
    .force('link', d3.forceLink().distance(1).links(links))
    .force('x', d3.forceX().strength(0.5))
    .force('y', d3.forceY().strength(0.5))
    .velocityDecay(0.2)
    .alphaDecay(0.02)
    .on('tick', ticked);


function ticked() {
    const container = d3.select('a-scene').select('#d3-nodes')
        .selectAll('a-entity')
        .data(nodes)
        .join('a-entity')
        .attr('geometry', function (d, i) {
            return `primitive: sphere; radius: 1`
        })
        .attr('position', function (d, i) {
            return `${d.x} 1 ${d.y}`
        })
        .attr('material', function (d, i) {
            return `shader: standard; color: red`
        });

    let test = d3.select('#d3-links').selectAll('a-entity').data(links, d => `${d.source}-${d.target}`)
        .join('a-entity');
        test.attr('line', function (d, i) {
            let source = nodes[d.source.index];
            let target = nodes[d.target.index];
            //console.log(d);
            return `start: ${source.x} 0 ${source.y}; end: ${target.x} 0 ${target.y}; color: green`
        });

    // links.enter()
    //     .append('a-entity')
    //     .attr('line', function (d, i) {
    //         let source = nodes[d.source];
    //         let target = nodes[d.target];
    //         return `start: ${source.x} 0 ${source.y}; end: ${target.x} 0 ${target.y}; color: green`
    //     })
}

function test() {
    console.log('adding node..');
    addNode();
    setTimeout(() => console.log('adding link..'), 1000);
    setTimeout(() => addLink(nodes[0], nodes[5]), 1000);
}
//..
document.test = test;