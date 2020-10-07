import { Wall } from '../entities/wall';

export function getCanvas(height, width) {
    const canvas = document.getElementById('arena');
    canvas.setAttribute('height', height);
    canvas.setAttribute('width', width);

    canvas.style.backgroundColor = "#000";

    return canvas;
}

export function getGame(matchId, cancellationToken, height, width) {
    const canvas = getCanvas(height, width);
    const context = canvas.getContext('2d');

    var lastUpdate = Date.now();

    const game = {
        paused: false,
        dt: 0,
        time: 0,
        matchId: matchId,
        canvas: canvas,
        context: context,
        visibleArea: {
            x: 0,
            y: 0,
            x2: 0,
            y2: 0,
        },
        map: {
            height: 1000,
            width: 1000,
        },
        entities: [],
        withEntityFromId: (id, action) => {
            const entity = game.entities.find(e => e.id == id);
            if (entity)
                action(entity);
        },
        instantiateEntity: (entity) => {
            game.entities.push(entity);
        },
        destroyEntity: (entity) => {
            entity.destroyed = true;
            game.entities = game.entities.filter(e => e.id != entity.id);
        },
        height: height,
        width: width,
        sizeFromHeight: (unit) => unit,
        sizeFromWidth: (unit) => unit,
        paddingH: 10,
        paddingV: 10,
        render: () => {
            if (cancellationToken.isCancelled)
                return;

            if (game.paused) {
                window.requestAnimationFrame(game.render);
                return;
            }

            var now = Date.now();
            var dt = (now - lastUpdate) / 1000; // toSeconds
            lastUpdate = now;
            game.time += dt;
            game.dt = dt;

            game.visibleArea = {
                x: game.player.x + game.player.width / 2 - width / 2,
                x2: game.player.x + game.player.width / 2 + width / 2,
                y: game.player.y + game.player.height / 2 - height / 2,
                y2: game.player.y + game.player.height / 2 + height / 2,
            }

            game.entities.forEach(e => e.update());

            game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
            game.entities.forEach(e => e.render());

            window.requestAnimationFrame(game.render);
        },
        isConnected: false,
        connection: {
            invoke: () => { }
        }
    };

    game.instantiateEntity(new Wall(game, game.map.width / 2, game.map.height / 2, game.map.width + 50));

    window.game = game;

    return game;
}

export function renderGame(game, render) {

}