import React from 'react';
import { initSinglePlayerGame } from '../singleplayergame';
import { PostGameScreen } from './PostGameScreen';
import { UserConsumer } from '../contexts/UserContext';

export function SinglePlayerGameScreen(props) {
    return (
        <UserConsumer>
            <SinglePlayerGameScreenComponent {...props} />
        </UserConsumer>
    );
}

export function SinglePlayerGameScreenComponent({ navigateBack, navigateTo, difficulty, user }) {
    const [uiState, setUiState] = React.useState({
        enemiesLeft: 0,
        health: 100
    });

    const cancellationTokenRef = React.useRef({
        isCancelled: false
    });

    const gameDisposer = React.useRef({dispose: () => {}});
    const gameContainerRef = React.useRef(null);

    React.useEffect(() => {
        const onPlayerDestroyed = (e) => {
            console.log('player_destroyed')
            user.addSingleplayerMatch(difficulty, false);
            navigateTo(PostGameScreen, { result: 'player_destroyed' });
        }

        const onGameStarted = (e) => {
            setUiState(state => ({
                ...state,
                enemiesLeft: e.detail.enemies
            }))
        }

        const onHealthUpdate = (e) => {
            setUiState(state => ({
                ...state,
                health: e.detail.health
            }))
        }

        const onEnemyDestroyed = (e) => {
            setUiState(state => ({
                ...state,
                enemiesLeft: e.detail.enemiesLeft
            }));

            if (e.detail.enemiesLeft == 0)
            {
                user.addSingleplayerMatch(difficulty, true);
                navigateTo(PostGameScreen, { result: 'enemy_destroyed' })
            }
        }
        document.addEventListener('game_started', onGameStarted);
        document.addEventListener('player_destroyed', onPlayerDestroyed);
        document.addEventListener('player_health_updated', onHealthUpdate);
        document.addEventListener('enemy_destroyed', onEnemyDestroyed);

        const height = Math.min(gameContainerRef.current.offsetHeight, window.innerHeight);
        gameDisposer.current.dispose = initSinglePlayerGame(
            cancellationTokenRef.current,
            difficulty,
            height
        );

        return () => {
            document.removeEventListener('game_started', onGameStarted);
            document.removeEventListener('player_destroyed', onPlayerDestroyed);
            document.removeEventListener('player_health_updated', onHealthUpdate);
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
                    <div style={{
                        position: 'absolute',
                        bottom: 10,
                        left: 10,
                        right: 10,
                        display: 'flex',
                    }}>
                        <div style={{
                            height: 20,
                            width: `${uiState.health}%`,
                            backgroundColor: 'red'
                        }}></div>
                    </div>
                </div>
            </div>
        </>
    );
}