import React from 'react';
import { initSinglePlayerGame } from '../singleplayergame';
import { PostGameScreen } from './PostGameScreen';
import { UserConsumer } from '../contexts/UserContext';
import { GameUI } from '../components/GameUI';
const keycode = require('keycode');

export function SinglePlayerGameScreen(props) {
    return (
        <UserConsumer>
            <SinglePlayerGameScreenComponent {...props} />
        </UserConsumer>
    );
}

export function SinglePlayerGameScreenComponent({ navigateBack, navigateTo, difficulty, user }) {
    const cancellationTokenRef = React.useRef({
        isCancelled: false
    });

    const gameDisposer = React.useRef({dispose: () => {}});
    const gameContainerRef = React.useRef(null);

    React.useEffect(() => {
        const onPlayerDestroyed = (e) => {
            user.addSingleplayerMatch(difficulty, false);
            setTimeout(() => navigateTo(PostGameScreen, { result: 'player_destroyed' }), 2000);
        }

        const onEnemyDestroyed = (e) => {
            if (e.detail.enemiesLeft == 0)
            {
                user.addSingleplayerMatch(difficulty, true);
                setTimeout(() => navigateTo(PostGameScreen, { result: 'enemy_destroyed' }), 2000);
            }
        }

        document.addEventListener('player_destroyed', onPlayerDestroyed);
        document.addEventListener('enemy_destroyed', onEnemyDestroyed);

        const height = Math.min(gameContainerRef.current.offsetHeight, window.innerHeight);
        gameDisposer.current.dispose = initSinglePlayerGame(
            cancellationTokenRef.current,
            user.state.username,
            user.state.ship,
            difficulty
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