const fabric = require('fabric').fabric;
import { Player } from './entities/player';
import { Enemy } from './entities/enemy';
import { Wall } from './entities/wall';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { EnemyPlayer } from './entities/enemyPlayer';

export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const initGame = (cancellationToken, height) => {
    const width = height * 9 / 16;
    const canvasEl = document.getElementById('arena');
    canvasEl.setAttribute('height', height);
    canvasEl.setAttribute('width', width);

    const canvas = new fabric.Canvas('arena');
    canvas.selection = false;
    canvas.backgroundColor = "#000";
    const game = {
        canvas: canvas,
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
            game.canvas.add(entity.object);
        },
        destroyEntity: (entity) => {
            entity.destroyed = true;
            game.entities = game.entities.filter(e => e.id != entity.id);
            game.canvas.remove(entity.object);
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
        isConnected: false,
        connection: {
            invoke: () => { }
        }
    };

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
    game.player = new Player(game);
    game.instantiateEntity(game.player);

    var simplerConnection = new HubConnectionBuilder()
        .withUrl("https://renanliberato-spaceshooterserver.azurewebsites.net/simplermatchhub")
        .withAutomaticReconnect()
        .build();

    simplerConnection.on("ShipAddedtoGame", function (id) {
        var enemy = new EnemyPlayer(game);
        enemy.id = id;
        game.instantiateEntity(enemy);
    });

    simplerConnection.on("ShipPositionUpdated", function (id, x, y, angle, health) {
        var enemy = game.entities.find(e => e.id == id);
        enemy.moveTo(x, y);
        enemy.rotateToAngle(angle);
        enemy.updateHealth(health);
    });

    simplerConnection.start().then(function () {
        game.isConnected = true;
        simplerConnection.invoke("AddShipToGame", game.player.id);
        console.log('connected')
    }).catch(function (err) {
        return console.error(err.toString());
    });

    game.connection = simplerConnection;

    // var connection = new HubConnectionBuilder()
    //     .withUrl("https://localhost:5001/match")
    //     .withAutomaticReconnect()
    //     .build();

    // connection.on("MatchStateUpdated", function (state) {
    //     const stateAsObject = JSON.parse(state);
    //     game.player.moveTo(stateAsObject.PlayerState.X, stateAsObject.PlayerState.Y);
    //     game.player.rotateToAngle(stateAsObject.PlayerState.Angle);
    // });

    // connection.start().then(function () {
    //     console.log('connected')
    // }).catch(function (err) {
    //     return console.error(err.toString());
    // });

    // game.connection = connection;

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

    // [...Array(5).keys()].forEach(element => {
    //     var enemy = new Enemy(game);
    //     enemy.x = Math.random() * game.map.width;
    //     enemy.y = Math.random() * game.map.height;
    //     game.instantiateEntity(enemy);
    // });

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
            x: game.player.x - game.canvas.getWidth() / 2,
            x2: game.player.x + game.canvas.getWidth() / 2,
            y: game.player.y - game.canvas.getHeight() / 2,
            y2: game.player.y + game.canvas.getHeight() / 2,
        }

        game.canvas.remove(game.ui.coordsText);
        game.ui.coordsText = new fabric.Text(
            `x: ${game.visibleArea.x.toFixed(0)}, x2: ${game.visibleArea.x2.toFixed(0)}\ny: ${game.visibleArea.y.toFixed(0)}, y2: ${game.visibleArea.y2.toFixed(0)}\n\nplayerx: ${game.player.x.toFixed(0)}, playery: ${game.player.y.toFixed(0)}\n\nfps: ${((1000 / dt) / 1000).toFixed(0)}`,
            {
                selectable: false,
                top: 100,
                left: 20,
                fill: 'white',
                fontSize: 12
            });
        game.canvas.add(game.ui.coordsText);

        game.entities.forEach(e => e.update());

        enemyMarks.forEach(m => game.canvas.remove(m));
        enemyMarks = [];

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

        game.ui.playerHealthBar.set('width', game.sizeFromWidth((game.player.health / game.player.maxHealth) * 100) - game.paddingH * 2);
        game.ui.playerHealthBar.setCoords();

        game.canvas.renderAll();
        window.requestAnimationFrame(render);
    };

    window.requestAnimationFrame(render);
}