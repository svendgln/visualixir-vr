
AFRAME.registerComponent('clicktest', {
    init: function () {
        console.log('CLICK INIT');
        var el = this.el;
        el.addEventListener('click', evt => {
            console.log(el);
            console.log('trigger pressed');
            el.setAttribute('visible', !el.getAttribute('visible'));
        });
    }
})