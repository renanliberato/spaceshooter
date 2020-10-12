import React from 'react';
import { initGame } from '../game';
import { PostGameScreen } from './PostGameScreen';
import { UserConsumer } from '../contexts/UserContext';
import { GameUI } from '../components/GameUI';
import { UI_BASE_URL } from '../config';

export function GameScreen(props) {
    return (
        <UserConsumer>
            <GameScreenComponent {...props} />
        </UserConsumer>
    );
}

export function GameScreenComponent({ navigateBack, navigateTo, matchId, user }) {
    window.history.replaceState("", "", `${UI_BASE_URL}?matchid=${matchId}`);

    const cancellationTokenRef = React.useRef({
        isCancelled: false
    });
    const gameDisposer = React.useRef({dispose: () => {}});
    const gameContainerRef = React.useRef(null);

    React.useEffect(() => {
        const onPlayerDestroyed = (e) => {
            user.addMultiplayerMatch(false);
            setTimeout(() => navigateTo(PostGameScreen, { result: 'player_destroyed' }), 2000);
        }

        const onEnemyDestroyed = (e) => {
            if (e.detail.enemiesLeft == 0) {
                user.addMultiplayerMatch(true);
                setTimeout(() => navigateTo(PostGameScreen, { result: 'enemy_destroyed' }), 2000);
            }
        }
        document.addEventListener('player_destroyed', onPlayerDestroyed);
        document.addEventListener('enemy_destroyed', onEnemyDestroyed);

        gameDisposer.current.dispose = initGame(
            cancellationTokenRef.current,
            user.state.username,
            user.state.ship,
            matchId
        );

        return () => {
            document.removeEventListener('player_destroyed', onPlayerDestroyed);
            document.removeEventListener('enemy_destroyed', onEnemyDestroyed);
            cancellationTokenRef.current.isCancelled = true;
            gameDisposer.current.dispose();
        };
    }, []);

    return (
        <>
            <div ref={gameContainerRef} style={{
                flex: 1,
                alignSelf: 'center',
            }}>
                <div style={{
                    position: 'relative'
                }}>
                    <canvas id="arena"></canvas>
                    <GameUI navigateBack={navigateBack} />
                </div>
            </div>
        </>
    );
}