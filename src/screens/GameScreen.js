import React from 'react';
import { initGame, isMobile } from '../game';
import { PostGameScreen } from './PostGameScreen';

export function GameScreen({ navigateBack, navigateTo }) {
    const [uiState, setUiState] = React.useState({
        enemiesLeft: 0
    });

    const cancellationTokenRef = React.useRef({
        isCancelled: false
    });
    const gameContainerRef = React.useRef(null);

    React.useEffect(() => {
        const onPlayerDestroyed = (e) => {
            navigateTo(PostGameScreen, { result: 'player_destroyed' });
        }

        const onGameStarted = (e) => {
            setUiState({
                enemiesLeft: e.detail.enemies
            })
        }
        const onEnemyDestroyed = (e) => {
            setUiState({
                enemiesLeft: e.detail.enemiesLeft
            });

            if (e.detail.enemiesLeft == 0)
                navigateTo(PostGameScreen, { result: 'enemy_destroyed' })
        }
        document.addEventListener('game_started', onGameStarted);
        document.addEventListener('player_destroyed', onPlayerDestroyed);
        document.addEventListener('enemy_destroyed', onEnemyDestroyed);

        const height = Math.min(gameContainerRef.current.offsetHeight, window.innerHeight);
        initGame(
            cancellationTokenRef.current,
            height,
            isMobile ? document.body.clientWidth : height * 9 / 16
        );

        return () => {
            document.removeEventListener('game_started', onGameStarted);
            document.removeEventListener('player_destroyed', onPlayerDestroyed);
            document.removeEventListener('enemy_destroyed', onEnemyDestroyed);
            cancellationTokenRef.current.isCancelled = true;
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
                    <div style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                    }}>
                        <p style={{
                            color: 'white'
                        }}>Enemies: {uiState.enemiesLeft}</p>
                        <p></p>
                    </div>
                </div>
            </div>
        </>
    );
}