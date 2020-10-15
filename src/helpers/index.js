export function collides(obj1, obj2) {
    return obj1.transform.x < obj2.transform.x + obj2.collider.width &&
        obj1.transform.x + obj1.collider.width > obj2.transform.x &&
        obj1.transform.y < obj2.transform.y + obj2.collider.height &&
        obj1.transform.y + obj1.collider.height > obj2.transform.y;
}