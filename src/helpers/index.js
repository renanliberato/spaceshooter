export function collides(obj1, obj2) {
    const innerObj1 = {...obj1};
    innerObj1.width *= 0.7;
    innerObj1.height *= 0.7;
    innerObj1.x = obj1.x - innerObj1.width / 2;
    innerObj1.y = obj1.y - innerObj1.height / 2;

    const innerObj2 = {...obj2};
    innerObj2.width *= 0.7;
    innerObj2.height *= 0.7;
    innerObj2.x = obj2.x - innerObj2.width / 2;
    innerObj2.y = obj2.y - innerObj2.height / 2;
    return innerObj1.x < innerObj2.x + innerObj2.width &&
        innerObj1.x + innerObj1.width > innerObj2.x &&
        innerObj1.y < innerObj2.y + innerObj2.height &&
        innerObj1.y + innerObj1.height > innerObj2.y;
}