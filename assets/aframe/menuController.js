// UNTESTED
export default class {
    constructor() {
        this.tabIDs = ['#menu', '#cam2', '#node-info'];
        this.activeTab = 0;
        this.visible = false;
        //keep menu and node info classes here idk..
        this.nodeMenu = null;
        this.nodeInfo = null;
    }
    // attaches menu tabs to controllers
    initVR() {
        this.tabIDs.forEach(id => {
            let el = document.querySelector(id);
            let newParent = document.querySelector('#controllerRight');
            let copy = el.cloneNode(true);
            newParent.appendChild(copy);
            el.parentNode.removeChild(el);

            copy.setAttribute('scale', '0.5 0.5 0.5');
            copy.setAttribute('rotation', '-30 0 0');
            copy.setAttribute('position', '0 0.2 -0.2');
            copy.setAttribute('visible', 'false');
        })
    }

    toggleMenu() {
        const activeID = this.tabIDs[this.activeTab];
        const el = document.querySelector(activeID);
        el.setAttribute('visible', !el.getAttribute('visible'));
        this.visible = el.getAttribute('visible');
        console.log('tab is now', !el.getAttribute('visible') ? 'not visible' : 'visible');
    }

    cycleMenu() {
        if (this.visible) {
            const l = this.tabIDs.length();
            const oldEl = document.querySelector(this.tabIDs[this.activeTab]);
            this.activeTab = ++this.activeTab % l;
            const newEl = document.querySelector(this.tabIDs[this.activeTab]);
            console.log(this.activeTab);
            //still raycastable if invisible?
            oldEl.setAttribute('visible', 'false');
            newEl.setAttribute('visible', 'true');
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