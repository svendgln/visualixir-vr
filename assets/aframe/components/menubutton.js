console.log('MENU BUTTON LOADED');
AFRAME.registerComponent('menu-button', {
    init: function () {
        const el = this.el;
        // DOESNT WORK AFTER FIRST CLICK
        el.setAttribute('animation__click', {
            property: 'scale',
            from: { x: 1, y: 1, z: 1 },
            to: { x: 1.1, y: 1.1, z: 1.1 },
            startEvents: 'click',
            dur: 200,
            easing: 'linear'
        });

        el.setAttribute('animation__resetclick', {
            property: 'scale',
            to: { x: 1, y: 1, z: 1 },
            from: { x: 1.1, y: 1.1, z: 1.1 },
            startEvents: 'click',
            dur: 200,
            delay: 200,
            easing: 'linear'
        });
    }
});