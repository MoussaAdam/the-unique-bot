export function random(a: number, b: number = null) {
    const { random, floor } = Math;
    if (b === null) { b = a; a = 0; }
    return floor(random() * (b - a)) + a
}

export function oneof(list: Array<any>) {
    const { length } = list;
    return list[random(length)];
}
