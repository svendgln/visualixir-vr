// We import the CSS which is extracted to its own file by esbuild.
// Remove this line if you add a your own CSS build pipeline (e.g postcss).
// probs not needed..
//import "../css/app.css"

// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "./vendor/some-package.js"
//
// Alternatively, you can `npm install some-package` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html";
import socket from "./user_socket.js";
// import $ from 'jquery';

import NodeSelector from "./node_selector.js";
import ClusterView from "./cluster_view.js";

class App {
    constructor(node_selector_container) {
        this.node_selector = new NodeSelector(node_selector_container, this.channel);
        this.cluster_view = new ClusterView($('#graph'), $('#log'));
        $('#stop_msg_tracing').click(e => {
            if (this.cluster_view) {
                this.cluster_view.stopMsgTraceAll();
            }
        });
    }
}
 
$( () => {
    window.socket = socket;
    //socket is connected in user_socket.js

    //test
//     let ch1 = socket.channel('nodes:lobby')
//     let ch2 = socket.channel('trace:lobby')
//     ch1.join()
//   .receive("ok", resp => { console.log("Joined successfully", resp) })
//   .receive("error", resp => { console.log("Unable to join", resp) })
//   ch2.join()
//   .receive("ok", resp => { console.log("Joined successfully", resp) })
//   .receive("error", resp => { console.log("Unable to join", resp) })

    window.app = new App($('#node_selector'));
    console.log('app loaded');
})
// Establish Phoenix Socket and LiveView configuration.
// import {Socket} from "phoenix"
// import {LiveSocket} from "phoenix_live_view"
// import topbar from "../vendor/topbar"

// let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
// let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}})

// Show progress bar on live navigation and form submits
// topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
// window.addEventListener("phx:page-loading-start", info => topbar.show())
// window.addEventListener("phx:page-loading-stop", info => topbar.hide())

// connect if there are any LiveViews on the page
// liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
// window.liveSocket = liveSocket
