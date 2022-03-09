/*
Node Selector: container = top left table
*/

export default class {
  constructor(container) {
    this.container = container;
    this.channel = window.socket.channel("nodes", {});

    let updateNodes = msg => {
      this.update(msg.nodes);
    };

    this.channel.join().receive("ok", updateNodes);
    // update msg callback
    this.channel.on("update", updateNodes);

    let self = this; // node selector instance
    $(this.container).find("input").keypress(function (event) {
      if (event.keyCode === 13) { // enter key
        self.add(this.value.trim());
        this.value = ""; // clear input
      }
    });
  }

  update(nodes) {
    let self = this;
    // update node table
    let node_els = d3.select(this.container.find("ul").get(0)).selectAll("li.node_name").data(nodes);
    console.log('updating nodes: ', nodes);
    node_els.exit().remove(); //IDK LOOK UP delete??

    let node =
        node_els.enter()
        .insert("li")
        .attr("class", "node_name")
        .html(n => n)
        .on("click", function(d) {
          if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            self.cleanupNode(d);
          } else {
            $(this).addClass("selected");
            self.visualizeNode(d);
          }
        });

    node_els.merge(node);
  }
  // when adding new node from input
  add(node) {
    // websocket add msg
    this.channel.push("add", node);
  }
  // when selecting node from table
  visualizeNode(node) {
    this.channel.push("visualize", node);
  }
  // when deselecting node from table
  cleanupNode(node) {
    this.channel.push("cleanup", node);
  }
}
