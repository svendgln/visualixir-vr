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

//window.socket.channel("nodes", {}).join().receive("ok", () => console.log('FRFRFRF'));
// temp fix
const components = ['clicktest.js', 'customcontrols.js', 'debug.js', 'enterleave.js', 'menubutton.js', 'menu.js', 'camrender.js']
components.forEach(c => {
    console.log('importing ', c);
    require(`./components/${c}`);
});

class AframeApp {
    constructor() {
        this.menu = new Menu();
        this.cluster_view = new ClusterView('NOT USED');
    }
}
// on document load
$(() => {
    window.socket = socket;
    window.app = new AframeApp();
})
//import './test.js';

