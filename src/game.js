const fabric = require('fabric').fabric;
import { Player } from './entities/player';
import { Enemy } from './entities/enemy';

export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const initGame = (cancellationToken, height, width) => {
    const canvasEl = document.getElementById('arena');
    canvasEl.setAttribute('height', height);
    canvasEl.setAttribute('width', width);
    
    const canvas = new fabric.Canvas('arena');
    canvas.selection = false;
    canvas.backgroundColor = "#fff";
    
    const game = {
        canvas: canvas,
        entities: [],
        instantiateEntity: (entity) => {
            game.entities.push(entity);
            game.canvas.add(entity.object);
        },
        destroyEntity: (entity) => {
            game.entities = game.entities.filter(e => e.id != entity.id);
            game.canvas.remove(entity.object);
        },
        ui: {
            playerHealthBar: null,
            enemyHealthBar: null,
        },
        height: height,
        width: width,
        sizeFromHeight: (unit) => unit * height / 100,
        sizeFromWidth: (unit) => unit * width / 100,
        paddingH: 10,
        paddingV: 10,
        player: null,
        enemy: null
    };

    game.ui.playerHealthBar = new fabric.Rect({
        top: game.height - game.sizeFromHeight(2) - game.paddingV,
        left: game.paddingH,
        width: game.width - game.paddingH * 2,
        height: game.sizeFromHeight(2),
        fill: 'red'
    });

    game.ui.enemyHealthBar = new fabric.Rect({
        top: game.paddingV,
        left: game.paddingH,
        width: game.width - game.paddingH * 2,
        height: game.sizeFromHeight(2),
        fill: 'red'
    });

    game.canvas.add(game.ui.playerHealthBar);
    game.canvas.add(game.ui.enemyHealthBar);
    game.player = new Player(game);
    game.enemy = new Enemy(game);
    game.instantiateEntity(game.player);
    game.instantiateEntity(game.enemy);

    game.time = 0;
    var lastUpdate = Date.now();
    const render = () => {
        if (cancellationToken.isCancelled)
            return;

        var now = Date.now();
        var dt = (now - lastUpdate) / 1000; // toSeconds
        lastUpdate = now;
        game.time += dt;
        
        game.player.fire();
        game.player.move();
        game.player.processBullets();

        game.entities.filter(e => e.tag == 'enemy').forEach(enemy => {
            enemy.fire();
            enemy.move();
            enemy.processBullets();
        });
        
        game.ui.playerHealthBar.set('width', game.sizeFromWidth((game.player.health / game.player.maxHealth) * 100) - game.paddingH * 2);
        game.ui.playerHealthBar.setCoords();
        game.ui.enemyHealthBar.set('width', game.sizeFromWidth((game.enemy.health / game.enemy.maxHealth) * 100) - game.paddingH * 2);
        game.ui.enemyHealthBar.setCoords();
        
        game.canvas.renderAll();

        window.requestAnimationFrame(render);
    };

    window.requestAnimationFrame(render);
}