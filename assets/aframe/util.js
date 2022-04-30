
function offsetColor(color, offset = 0.5) {
    if (typeof(color) == 'object' && color.isColor) {
        const { r, g, b } = color;
        const shifted = new THREE.Color(r, g, b);
        shifted.offsetHSL(offset, 0, 0);
        return shifted;
    } else {
        return new THREE.Color(0xff0000)
    }
}
// returns the positive modulo //TODO used? :p
function mod(n, m) {
    return ((n % m) + m) % m;
}

export { offsetColor, mod };