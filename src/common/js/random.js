export function createRandom() {
    let str = '';
    for (let i = 0; i < 16; i++) {
        str += Math.floor(Math.random() * 10);
    }
    return str;
}