import { Player } from './entities/player';
import { Enemy } from './entities/enemy';
import { Wall } from './entities/wall';
import { PlayerSynchronizer } from './entities/components/playerSynchronizer';
import { getHubConnection } from './services/hub';
import { EnemyPlayer } from './entities/enemyPlayer';
import { API_BASE_URL } from './config';
import { HealthBehaviour } from './entities/components/healthBehaviour';
import { getGame } from './helpers/game';

export const initGame = (cancellationToken, username, matchId) => {
    const game = getGame(matchId, cancellationToken, window.innerHeight, window.innerWidth);

    window.game = game;

    game.player = new Player(game);
    game.player.username = username;
    game.player.addComponent(new PlayerSynchronizer(game.player, game));
    game.instantiateEntity(game.player);

    var simplerConnection = getHubConnection('simplermatchhub');

    simplerConnection.on("ShipAddedtoGame", function (id, theUsername) {
        var enemy = new EnemyPlayer(game);
        enemy.username = theUsername;
        enemy.id = id;
        game.instantiateEntity(enemy);
        document.dispatchEvent(new CustomEvent('player_entered'))
    });

    simplerConnection.on("ShipQuitTheGame", function (id) {
        const thePlayer = game.entities.find(e => e.id == id);

        if (thePlayer) {
            thePlayer.destroy();
            document.dispatchEvent(new CustomEvent('enemy_destroyed', {
                detail: {
                    enemiesLeft: game.entities.filter(e => e.tag == 'enemy' && !e.destroyed).length
                }
            }))
        }
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
            case "TookDamage":
                game.withEntityFromId(ev.id, (e) => e.onTookDamage(ev.id, ev.amount, ev.health))
        }
    })

    simplerConnection.on("ShotFired", function (id, x, y, angle) {
        var enemy = game.entities.find(e => e.id == id);
        if (!enemy)
            return;

        enemy.shipBehaviour.fireBehaviour.remoteFire(x, y, angle);
    });

    simplerConnection.start().then(function () {
        console.log('connected')
        game.isConnected = true;
        simplerConnection.invoke("AddShipToGame", game.matchId, game.player.id, username);
    }).catch(function (err) {
        return console.error(err.toString());
    });

    simplerConnection.onclose(err => {
        game.isConnected = false;
    });

    simplerConnection.onreconnected(connectionId => {
        game.isConnected = true;
        simplerConnection.invoke("AddShipToGame", game.matchId, game.player.id, username);
    });

    game.connection = simplerConnection;
    game.connection.sendEventsToOtherPlayers = (eventName, ev) => {
        game.connection.invoke("SendEventToOtherPlayers", game.matchId, {...ev, name: eventName});
    };

    document.dispatchEvent(new CustomEvent('game_started', {
        detail: {
            enemies: game.entities.filter(e => e.tag == 'enemy').length
        }
    }));

    game.render();    

    return () => {
        game.isConnected = false;
        game.connection.stop();
        game.entities.forEach(e => e.destroy());
    };
}