console.log("loading aframe app");

// const fs = require('fs');

// function loadComponents() {
//     const path = './components';
//     let files = fs.readdirSync(path).filter(file => file.endsWith('.js'));
//     console.log(files)
// }

//import "phoenix_html";
import socket from "./user_socket.js";
window.socket = socket;
//window.socket.channel("nodes", {}).join().receive("ok", () => console.log('FRFRFRF'));
// temp fix
const components = ['clicktest.js', 'customcontrols.js', 'debug.js', 'enterleave.js', 'menubutton.js', 'menu.js']
components.forEach(c => require(`./components/${c}`))

import './test.js';
