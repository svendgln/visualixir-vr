// UNTESTED
export default class {
    constructor() {
        this.isVR = false;
        this.tabIDs = ['#menu', /*'#cam2',*/ '#node-info', '#logger-info', '#logger-trace'];
        this.activeTab = 0;
        this.visible = false;
        //keep menu and node info classes here idk..
        this.nodeMenu = null; //initialized when components load
        this.nodeInfo = null;
        //this.init();
        // TODO fucking useless shite
        document.querySelector('body').onresize = () => {
            // resize only when in desktop mode
            if (this.isVR) return;
            console.log('resize');
            this.resizeTabs();
        }
    }
    // TODO FIX OR REMOVE
    resizeTabs() {
        const dims = document.querySelector('a-scene').getBoundingClientRect(); // or use window.innerHeight etc
        this.tabIDs.forEach(id => {
            //const scale = cfg.menuScale * dims.height; //% of scene height
            const dist = 0.01; // idk
            //const sceneH = dims.height;
            const el = document.querySelector(id);
            //const x = 
            // el.setAttribute('height', `${0.01 * scale}`); // ??? lol
            // el.setAttribute('width', `${0.01 * scale}`); // square tab
            // el.setAttribute('scale', `${0.01} ${0.01} ${0.01}`);
            // el.setAttribute('position', .);
        })
    }

    // attaches menu tabs to controllers
    initVR() {
        this.isVR = true;
        this.tabIDs.forEach(id => {
            let el = document.querySelector(id);
            let newParent = document.querySelector('#controllerRight');
            let copy = el.cloneNode(true);
            newParent.appendChild(copy);
            el.parentNode.removeChild(el);

            copy.setAttribute('scale', '0.5 0.5 0.5'); // set w/h instead
            copy.setAttribute('rotation', '-30 0 0');
            copy.setAttribute('position', '0 0.2 -0.2');
            copy.setAttribute('visible', 'false');
            //maybe remove raycastable idk
        })
    }
    // maybe change name, init normal 3D settings n shit..
    // init() {
    //     this.tabIDs.forEach(id => {
    //         let el = document.querySelector(id);
    //         let newParent = document.querySelector('#camera');
    //         let copy = el.cloneNode(true);
    //         newParent.appendChild(copy);
    //         el.parentNode.removeChild(el);

    //         // copy.removeAttribute('raycastable');
    //     })
    // }

    toggleMenu() {
        const activeID = this.tabIDs[this.activeTab];
        const el = document.querySelector(activeID);
        el.setAttribute('visible', !el.getAttribute('visible'));
        this.visible = el.getAttribute('visible');
        // if (this.visible) {
        //     console.log('show');
        //     el.setAttribute('raycastable', '');
        // } else {
        //     console.log('hide');
        //     el.removeAttribute('raycastable');
        // }
        console.log('tab is now', !el.getAttribute('visible') ? 'not visible' : 'visible');
    }

    cycleMenu() {
        if (this.visible) {
            const l = this.tabIDs.length;
            const oldEl = document.querySelector(this.tabIDs[this.activeTab]);
            this.activeTab = ++this.activeTab % l;
            const newEl = document.querySelector(this.tabIDs[this.activeTab]);
            console.log(this.activeTab);
            //still raycastable if invisible?
            oldEl.setAttribute('visible', 'false');
            // oldEl.removeAttribute('raycastable');
            newEl.setAttribute('visible', 'true');
            // newEl.setAttribute('raycastable', '');
        }
    }

    setActive(tab) {
        const idx = this.tabIDs.indexOf(tab);
        if (idx >= 0) {
            const oldEl = document.querySelector(this.tabIDs[this.activeTab]);
            this.activeTab = idx;
            const newEl = document.querySelector(this.tabIDs[this.activeTab]);

            oldEl.setAttribute('visible', 'false');
            newEl.setAttribute('visible', 'true');
            this.visible = true;
        }
    }
}