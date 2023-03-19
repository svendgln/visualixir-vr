import cfg from '../config';
import { mod } from '../util'
// logs status messages
// TODO rename other menu tabs to ..-tab
AFRAME.registerComponent('logger-tab', {
    dependencies: ['geometry'],
    init: function () {
        const dims = document.querySelector('a-scene').getBoundingClientRect();
        const el = document.querySelector('#logger-info');
        //el.setAttribute('position', `${dims.x, }`);
        window.app.Logger = new Logger(el);
    }
});
// logs node communication
AFRAME.registerComponent('tracer-tab', {
    dependencies: ['geometry'],
    init: function () {
        console.log('LOADED TRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACER');
        const dims = document.querySelector('a-scene').getBoundingClientRect();
        const el = document.querySelector('#logger-trace');
        window.app.Tracer = new Tracer(el);
    }
});

// add some color shite..
AFRAME.registerComponent('selected', {

});

// logger just adds string to tab idk
// string generated by subclass method

export class MsgLogger {
    constructor(container) {
        this.container = container;
        this.maxMessages = cfg.maxMessages;
        this.messages = new Array(this.maxMessages); //circular array
        this.last = -1; //idx of last added msg
        this.window = -1; // start of visible window
        this.scrolling = false;

        // sliding window type shit
        // use window and size to slice msgs from array

        // TODO
        this.containerHeight = container.getAttribute('geometry').height;
        this.containerWidth = container.getAttribute('geometry').width;
        // msg config
        this.msgPadding = 0.02;
        this.msgHeight = cfg.msgHeight;
        this.msgWidth = this.containerWidth - this.msgPadding;
        // # of messages displayed
        this.wSize = Math.floor(this.containerHeight / (this.msgHeight + this.msgPadding));
        console.log(this.wSize);
    }

    scrollUp() {
        // cant sroll up when nothing added yet or window at top
        if (this.last < 0 || this.window == this.last) {
            console.log('at top');
            return;
        }
        this.window = mod((this.window + 1), this.messages.length);
        if (this.window == this.last) {
            // back to top
            this.scrolling = false;
        }

        this.render();
    }

    scrollDown() {
        if (this.last < 0) return;
        // window is at bottom
        if (mod((this.window - this.wSize), this.messages.length) == this.last
            || this.messages[mod((this.window - 1), this.messages.length)] == undefined) {
            console.log('at end');
            return;
        }
        this.window = mod((this.window - 1), this.messages.length);
        this.scrolling = true;

        this.render();
    }

    addMsg(msg) {
        this.last += 1;
        const l = this.messages.length;
        if (this.last == l) this.last = 0;
        this.messages[this.last] = msg; // will overide oldest msg if full
        // check if scrolling.. add explanation lol TODO

        if (!this.scrolling 
            || (this.scrolling && (mod(this.last-1, l) == mod((this.window - this.wSize), l)))) {
            console.log('moving window');
            this.window = mod((this.window + 1), l);
        } // else dont move -> scrolling

        // rerender
        this.render();
    }
    
    getWindow() {
        const start = this.window;
        let res = new Array(this.wSize);
        // cant use slice here, index wraps around
        for (let i = 0; i < this.wSize; i++) {
            let idx = mod(start - i, this.messages.length);
            res[i] = this.messages[idx];
        }
        return res;
    }

    render() { // TODO maybe add scrollbar (visual only)
        const xOffset = -this.msgWidth / 2 + this.msgPadding;
        // add messages in window to container

        d3.select('a-scene').select('#' + this.container.id)
            .selectAll('a-entity')
            .data(this.getWindow())
            //.join('a-entity')
            .join('a-entity')
            .filter(function (d, i) {
                return d != undefined;
            })
            .attr('geometry', (d, i) => {
                return `primitive: plane; width: ${this.msgWidth}; height: ${this.msgHeight}`;
            })
            .attr('position', (d, i) => {
                let first = (this.containerHeight / 2) - (this.msgHeight / 2) - this.msgPadding;
                let offset = (this.msgHeight + this.msgPadding) * -i;
                return `0 ${first + offset} 0.01`;
            })
            .attr('material', (d, i) => {
                return 'shader: flat; color: red'; //TODO temp color
            })// undefined test also probs
            .attr('text', (d, i) => { // test wrapCount and width..
                return `value: ${d}; align: left; color: white; anchor: align; xOffset: ${xOffset}`;
            });
    }

    reset() {
        this.messages.fill(undefined);
        d3.select('a-scene').select('#' + this.container.id)
            .selectAll('a-entity').remove();
        this.last = -1;
        this.window = -1;
        this.scrolling = false;
    }
}
// log one / 2
export class Logger extends MsgLogger {
    // all nodes
    static types = new Map(
        Object.entries({
            'spawn': 'spawned on',
            'exit': 'exited on',
            'link': 'linked with',
            'unlink': 'unlinked from'
        })
    );
    constructor(container) {
        super(container);
    }

    // render() {
    //     super.render();
    // }

    logOne(process, type) {
        const name = process.name;
        const action = Logger.types.get(type);
        const node = process.node;
        console.log(name, action, node);
        super.addMsg(`${name} ${action} ${node}`);
    }

    logTwo(from, to, type) {
        //console.log(from.name, Logger.types.get(type), to.name);
        const action = Logger.types.get(type);
        super.addMsg(`${from.name} ${action} ${to.name}`);
    }
}
// log 2
export class Tracer extends MsgLogger {
    // selected nodes
    constructor(container) {
        super(container);
        this.selected = new Map(); // idk map maybe.. TODO not needed
        this.nodeContainer = document.querySelector('#d3-nodes'); // parent of msg arrow elements
    }

    logMessage(from, to, msg) {
        const { x: x1, y: z1 } = from;
        const { x: x2, y: z2 } = to;
        this.nodeContainer.setAttribute('curve', `start: ${x1} 0 ${z1}; end: ${x2} 0 ${z2}`);
        console.log(from.name + '->' + to.name + ': ' + msg);
        super.addMsg(from.name + '->' + to.name + ': ' + msg);
    }
    // this shite even needed?
    // dont need to store traced nodes here..
    // selecting done in graph onclick
    select() { // traced component..

    }

    remove() {

    }
}