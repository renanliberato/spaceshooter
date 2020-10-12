import React from 'react';
import { MatchMenu } from './MatchMenu';

export function GameUI({navigateBack}) {
    const [uiState, setUiState] = React.useState({
        enemiesLeft: 0,
        health: 100,
        isDisplayingMenu: false
    });

    React.useEffect(() => {
        const onGameStarted = (e) => {
            setUiState(state => ({
                ...state,
                enemiesLeft: e.detail.enemies
            }))
        }

        const onPlayerEntered = (e) => {
            setUiState(state => ({
                enemiesLeft: ++state.enemiesLeft
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
        }

        document.addEventListener('game_started', onGameStarted);
        document.addEventListener('player_entered', onPlayerEntered);
        document.addEventListener('player_health_updated', onHealthUpdate);
        document.addEventListener('enemy_destroyed', onEnemyDestroyed);

        return () => {
            document.removeEventListener('game_started', onGameStarted);
            document.removeEventListener('player_entered', onPlayerEntered);
            document.removeEventListener('player_health_updated', onHealthUpdate);
            document.removeEventListener('enemy_destroyed', onEnemyDestroyed);
        };
    }, []);

    return (
        <>
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
            <MatchMenu navigateBack={navigateBack} />
        </>
    );
}