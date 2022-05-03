console.log("loading aframe app");

// const fs = require('fs');

// function loadComponents() {
//     const path = './components';
//     let files = fs.readdirSync(path).filter(file => file.endsWith('.js'));
//     console.log(files)
// }

import "phoenix_html";
import socket from "./user_socket.js";
import Menu from "./components/menu.js";
import ClusterView from "./cluster_view.js";
import menuController from "./menuController.js";
import Controls from "./components/customcontrols.js";

//window.socket.channel("nodes", {}).join().receive("ok", () => console.log('FRFRFRF'));
// temp fix
const components = ['clicktest.js', 'customcontrols.js', 'debug.js', 'enterleave.js',
 'menubutton.js', 'menu.js', 'camrender.js', 'nodeinfo.js', 'logger.js', 'curve.js'];
components.forEach(c => {
    console.log('importing ', c);
    require(`./components/${c}`);
});

class AframeApp {
    constructor() {
        //this.controls = new Controls(); //callbacks for keyboard presses and vr controllers
        //this.menu = new Menu();
        this.clusterView = new ClusterView('NOT USED');// TODO it is used ig lol
        //this.menu = new Menu();
        this.menuController = new menuController();
    }
}
// on document load
// $(() => {
//     window.socket = socket;
//     console.log('SOCKET LOADED')
//     window.app = new AframeApp();
// })

(() => {
    window.socket = socket;
    console.log('SOCKET LOADED')
    window.app = new AframeApp();
})()
//import './test.js';

