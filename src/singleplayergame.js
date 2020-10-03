const fabric = require('fabric').fabric;
import { Player } from './entities/player';
import { Enemy } from './entities/enemy';
import { EnemyMark } from './entities/enemyMark';
import { getGame } from './helpers/game';

const enemiesPerDifficulty = {
    easy: 3,
    normal: 6,
    hard: 10
}

export const initSinglePlayerGame = (cancellationToken, difficulty, height, matchId) => {
    const width = height * 9 / 16;
    
    const game = getGame(matchId, cancellationToken, height, width);

    game.player = new Player(game);
    game.instantiateEntity(game.player);

    [...Array(enemiesPerDifficulty[difficulty]).keys()].forEach(element => {
        var enemy = new Enemy(game);
        enemy.x = Math.random() * game.map.width;
        enemy.y = Math.random() * game.map.height;
        game.instantiateEntity(enemy);
        game.instantiateEntity(new EnemyMark(game, game.player, enemy));
    });

    game.time = 0;
    var lastUpdate = Date.now();
    var enemyMarks = [];

    document.dispatchEvent(new CustomEvent('game_started', {
        detail: {
            enemies: game.entities.filter(e => e.tag == 'enemy').length
        }
    }));

    game.render();

    return () => {
    };
}