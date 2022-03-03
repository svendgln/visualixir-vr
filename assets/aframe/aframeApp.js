console.log("loading aframe app");

// const fs = require('fs');

// function loadComponents() {
//     const path = './components';
//     let files = fs.readdirSync(path).filter(file => file.endsWith('.js'));
//     console.log(files)
// }

// temp fix
const components = ['clicktest.js', 'customcontrols.js', 'debug.js', 'enterleave.js', 'menubutton.js']
components.forEach(c => require(`./components/${c}`))

require('./test.js');
