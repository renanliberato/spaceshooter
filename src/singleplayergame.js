const fabric = require('fabric').fabric;
import { Player } from './entities/player';
import { Enemy } from './entities/enemy';
import { Wall } from './entities/wall';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { EnemyPlayer } from './entities/enemyPlayer';
import { API_BASE_URL } from './index';
import { HealthBehaviour } from './entities/components/healthBehaviour';
import { FireBehaviour } from './entities/components/fireBehaviour';

export const initSinglePlayerGame = (cancellationToken, height, matchId) => {
    const width = height * 9 / 16;
    const canvas = document.getElementById('arena');
    canvas.setAttribute('height', height);
    canvas.setAttribute('width', width);

    canvas.style.backgroundColor = "#000";

    const context = canvas.getContext('2d');

    const game = {
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
        instantiateEntity: (entity) => {
            game.entities.push(entity);
        },
        destroyEntity: (entity) => {
            entity.destroyed = true;
            game.entities = game.entities.filter(e => e.id != entity.id);
        },
        ui: {
            playerHealthBar: null,
            coordsText: null,
        },
        height: height,
        width: width,
        sizeFromHeight: (unit) => unit * height / 100,
        sizeFromWidth: (unit) => unit * width / 100,
        paddingH: 10,
        paddingV: 10,
    };

    window.game = game;

    /*
    game.ui.playerHealthBar = new fabric.Rect({
        selectable: false,
        top: game.height - game.sizeFromHeight(2) - game.paddingV,
        left: game.paddingH,
        width: game.width - game.paddingH * 2,
        height: game.sizeFromHeight(2),
        fill: 'red',
    });

    game.ui.coordsText = new fabric.Text('x: 0, y: 0', {
        selectable: false,
        top: 100,
        left: 20,
        fill: '#fff',
        fontSize: 12
    });
    game.canvas.add(game.ui.coordsText);

    game.canvas.add(game.ui.playerHealthBar);
    */
    game.player = new Player(game);
    game.instantiateEntity(game.player);
    game.instantiateEntity(new Wall(game, game.map.width / 2, game.map.height / 2, game.map.width + 50));
    /*;
    // top wall
    var i = -45;
    while (i <= game.map.width + 45) {
        game.instantiateEntity(new Wall(game, i, -45));
        i += 25;
    }

    // // bottom wall
    var i = -45;
    while (i <= game.map.width + 45) {
        game.instantiateEntity(new Wall(game, i, game.map.height + 45));
        i += 25;
    }

    // // left wall
    var i = -45;
    while (i <= game.map.height + 45) {
        game.instantiateEntity(new Wall(game, -45, i));
        i += 25;
    }

    // // right wall
    var i = -45;
    while (i <= game.map.height + 45) {
        game.instantiateEntity(new Wall(game, game.map.width + 45, i));
        i += 25;
    }
    */

    [...Array(5).keys()].forEach(element => {
        var enemy = new Enemy(game);
        enemy.x = Math.random() * game.map.width;
        enemy.y = Math.random() * game.map.height;
        game.instantiateEntity(enemy);
    });

    game.time = 0;
    var lastUpdate = Date.now();
    var enemyMarks = [];

    document.dispatchEvent(new CustomEvent('game_started', {
        detail: {
            enemies: game.entities.filter(e => e.tag == 'enemy').length
        }
    }))
    const render = () => {
        if (cancellationToken.isCancelled)
            return;

        var now = Date.now();
        var dt = (now - lastUpdate) / 1000; // toSeconds
        lastUpdate = now;
        game.time += dt;

        game.visibleArea = {
            x: game.player.x + game.player.width / 2 - width / 2,
            x2: game.player.x + game.player.width / 2 + width / 2,
            y: game.player.y + game.player.height / 2 - height / 2,
            y2: game.player.y + game.player.height / 2 + height / 2,
        }

        /*
        game.canvas.remove(game.ui.coordsText);
        game.ui.coordsText = new fabric.Text(
            `enemies id: ${game.entities.filter(e => e.isShip && e.id != game.player.id).map(e => e.id).join('\n')}\n\nfps: ${((1000 / dt) / 1000).toFixed(0)}`,
            {
                selectable: false,
                top: 100,
                left: 20,
                fill: 'white',
                fontSize: 12
            });
        game.canvas.add(game.ui.coordsText);
        */
        game.entities.forEach(e => e.update());

        context.clearRect(0, 0, canvas.width, canvas.height);
        game.entities.forEach(e => e.render());

        enemyMarks.forEach(m => game.canvas.remove(m));
        enemyMarks = [];

        /*
        game.entities.filter(e => e.tag == 'enemy').forEach(e => {
            var angle = game.player.getAngleTowardsObject(e);
            var mark = new fabric.Triangle({
                top: game.player.object.top + Math.cos(angle * Math.PI / 180) * -1 * 40,
                left: game.player.object.left + Math.sin(angle * Math.PI / 180) * 40,
                fill: 'red',
                width: 6,
                height: 6,
                originX: 'center',
                originY: 'center'
            });
            mark.rotate(angle);
            enemyMarks.push(mark);
            game.canvas.add(mark);
        });

        game.ui.playerHealthBar.set('width', game.sizeFromWidth((game.player.getHealth().health / game.player.getHealth().maxHealth) * 100) - game.paddingH * 2);
        game.ui.playerHealthBar.setCoords();
        */
        window.requestAnimationFrame(render);
    };

    window.requestAnimationFrame(render);

    return () => {
    };
}