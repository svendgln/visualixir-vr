
AFRAME.registerComponent('node-info', {
    dependencies: ['geometry'], //wait for object to load
    init: function () {
        console.log('node menu init');

        window.app.menuController.nodeInfo = new NodeInfo();
    }
});

export default class NodeInfo {
    constructor() {
        console.log('NODEINFO LOADED');

        this.container = document.querySelector('a-scene #node-info');
        this.activeNode = false; //false or active node(process) idk

        this.titleField = document.querySelector('#node-info-title');
        this.nodeField  = document.querySelector('#node-info-node');
        this.applField  = document.querySelector('#node-info-appl');
        this.typeField  = document.querySelector('#node-info-type');
        this.linksField = document.querySelector('#node-info-links');
        this.killBtn = document.querySelector('#btn-collapse');
    }

    displayNodeInfo(info) {
        //id = pid, used to collapse node..
        //will need checks if pids can disconnect etc
        console.log('displaying node info', info.id);
        const { application, id, links, name, node, type } = info;
        const numLinks = (Object.keys(links).length).toString();
        
        this.titleField.setAttribute('value', `Node Info: ${name}`);// append id somewhere
        this.nodeField.setAttribute('value', `Node: ${node}`);
        this.applField.setAttribute('value', `Application: ${application}`);
        this.typeField.setAttribute('value', `Type: ${type}`);
        this.linksField.setAttribute('value', `#Links: ${numLinks}`);
        // set collapse button callback
        this.activeNode = info;
        //temp
        this.killBtn.setAttribute('menu-button', `name: kill; args: ${id}`)
    }
}