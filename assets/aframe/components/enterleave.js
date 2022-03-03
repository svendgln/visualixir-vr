// component needed?
AFRAME.registerComponent('enterleave', {
    init: function () {
        var el = this.el;
        console.log(this.el);
        console.log('enter/leave');
        el.addEventListener('enterleave', function (evt) {
            console.log('(╯°□°）╯︵ ┻━┻')
        })
    }
})