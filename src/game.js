const fabric = require('fabric').fabric;
import { Player } from './entities/player';
import { Enemy } from './entities/enemy';
import { Wall } from './entities/wall';
import { PlayerSynchronizer } from './entities/components/playerSynchronizer';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { EnemyPlayer } from './entities/enemyPlayer';
import { API_BASE_URL } from './index';
import { HealthBehaviour } from './entities/components/healthBehaviour';
import { FireBehaviour } from './entities/components/fireBehaviour';
import { getGame } from './helpers/game';

export const initGame = (cancellationToken, height, matchId) => {
    const width = height * 9 / 16;
    
    const game = getGame(matchId, cancellationToken, height, width);

    window.game = game;

    game.player = new Player(game);
    game.player.addComponent(new PlayerSynchronizer(game.player));
    game.instantiateEntity(game.player);

    var simplerConnection = new HubConnectionBuilder()
        .withUrl(`${API_BASE_URL}/simplermatchhub`)
        //.withUrl("https://renanliberato-spaceshooterserver.azurewebsites.net/simplermatchhub")
        .withAutomaticReconnect()
        .build();

    simplerConnection.on("ShipAddedtoGame", function (id) {
        var enemy = new EnemyPlayer(game);
        enemy.id = id;
        game.instantiateEntity(enemy);
        document.dispatchEvent(new CustomEvent('player_entered'))
    });

    simplerConnection.on("PlayerDestroyed", function (id, remainingPlayers) {
        document.dispatchEvent(new CustomEvent('enemy_destroyed', {
            detail: {
                enemiesLeft: remainingPlayers - 1
            }
        }));
    });

    simplerConnection.on("EventBroadcasted", function(ev) {
        switch (ev.name) {
            case "ShipPositionUpdated":
                const { name, shipId, health, ...filteredProps } = ev;

                var enemy = game.entities.find(e => e.id == shipId);

                if (!enemy)
                    return;

                enemy.getHealth().health = health;

                Object.keys(filteredProps).forEach(key => enemy[key] = filteredProps[key]);
        }
    })

    simplerConnection.on("ShotFired", function (id, x, y, angle) {
        var enemy = game.entities.find(e => e.id == id);
        if (!enemy)
            return;

        enemy.getComponent(FireBehaviour).remoteFire(x, y, angle);
    });

    simplerConnection.start().then(function () {
        console.log('connected')
        game.isConnected = true;
        simplerConnection.invoke("AddShipToGame", game.matchId, game.player.id);
    }).catch(function (err) {
        return console.error(err.toString());
    });

    simplerConnection.onclose(err => {
        game.isConnected = false;
    });

    simplerConnection.onreconnected(connectionId => {
        game.isConnected = true;
    });

    game.connection = simplerConnection;

    document.dispatchEvent(new CustomEvent('game_started', {
        detail: {
            enemies: game.entities.filter(e => e.tag == 'enemy').length
        }
    }));

    game.render();    

    return () => {
        game.isConnected = false;
        game.connection.stop();
    };
}