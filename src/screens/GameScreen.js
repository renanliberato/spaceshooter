import React from 'react';
import { initGame } from '../game';
import { PostGameScreen } from './PostGameScreen';
import { UserConsumer } from '../contexts/UserContext';

export function GameScreen(props) {
    return (
        <UserConsumer>
            <GameScreenComponent {...props} />
        </UserConsumer>
    );
}

export function GameScreenComponent({ navigateBack, navigateTo, matchId, user }) {
    window.history.replaceState("", "", '?matchid='+matchId);
    const [uiState, setUiState] = React.useState({
        enemiesLeft: 0
    });

    const cancellationTokenRef = React.useRef({
        isCancelled: false
    });
    const gameDisposer = React.useRef({dispose: () => {}});
    const gameContainerRef = React.useRef(null);

    React.useEffect(() => {
        const onPlayerDestroyed = (e) => {
            user.addMultiplayerMatch(false);
            navigateTo(PostGameScreen, { result: 'player_destroyed' });
        }

        const onGameStarted = (e) => {
            setUiState({
                enemiesLeft: e.detail.enemies
            })
        }

        const onPlayerEntered = (e) => {
            setUiState(state => ({
                enemiesLeft: ++state.enemiesLeft
            }))
        }

        const onHealthUpdate = (e) => {
            setUiState({
                health: e.detail.health
            })
        }

        const onEnemyDestroyed = (e) => {
            setUiState({
                enemiesLeft: e.detail.enemiesLeft
            });

            if (e.detail.enemiesLeft == 0) {
                user.addMultiplayerMatch(true);
                navigateTo(PostGameScreen, { result: 'enemy_destroyed' })
            }
        }
        document.addEventListener('game_started', onGameStarted);
        document.addEventListener('player_entered', onPlayerEntered);
        document.addEventListener('player_destroyed', onPlayerDestroyed);
        document.addEventListener('player_health_updated', onHealthUpdate);
        document.addEventListener('enemy_destroyed', onEnemyDestroyed);

        console.log(user.state.username);
        gameDisposer.current.dispose = initGame(
            cancellationTokenRef.current,
            user.state.username,
            matchId
        );

        return () => {
            document.removeEventListener('game_started', onGameStarted);
            document.removeEventListener('player_entered', onPlayerEntered);
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