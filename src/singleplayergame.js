import { Player } from './entities/player';
import { Enemy } from './entities/enemy';
import { EnemyMark } from './entities/enemyMark';
import { getGame } from './helpers/game';

import { Wall } from './entities/wall';
import { InofensiveStaticMeteor } from './entities/meteor';

const enemiesPerDifficulty = {
    easy: 3,
    normal: 6,
    hard: 10
}

export const initSinglePlayerGame = (cancellationToken, username, ship, difficulty, matchId) => {
    
    const game = getGame(matchId, cancellationToken, window.innerHeight, window.innerWidth);

    game.player = new Player(game, ship);
    game.player.username = username;
    game.instantiateEntity(game.player);

    [...Array(enemiesPerDifficulty[difficulty]).keys()].forEach(element => {
        var enemy = new Enemy(game);
        enemy.transform.x = Math.random() * game.map.width;
        enemy.transform.y = Math.random() * game.map.height;
        game.instantiateEntity(enemy);
        game.instantiateEntity(new EnemyMark(game, game.player, enemy));
    });

    [...Array(10).keys()].forEach(k => {
        game.instantiateEntity(new InofensiveStaticMeteor(game, parseInt(Math.random() * 1000), parseInt(Math.random() * 1000), 1));
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
        game.entities.forEach(e => e.destroy());
    };
}