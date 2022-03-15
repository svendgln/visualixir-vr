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

//window.socket.channel("nodes", {}).join().receive("ok", () => console.log('FRFRFRF'));
// temp fix
const components = ['clicktest.js', 'customcontrols.js', 'debug.js', 'enterleave.js', 'menubutton.js', 'menu.js']
components.forEach(c => {
    console.log('importing ', c);
    require(`./components/${c}`);
});

class AframeApp {
    constructor() {
        this.menu = new Menu();
        //test
        this.channel = window.socket.channel("trace", {});
        this.channel.join();
        this.channel.on("visualize_node", msg => console.log('visualize ', msg));
    }
}
// on document load
$(() => {
    window.socket = socket;
    window.app = new AframeApp();
})
import './test.js';