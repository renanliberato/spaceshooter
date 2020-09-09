import React from 'react';
import { initGame, isMobile } from '../game';
import { PostGameScreen } from './PostGameScreen';

export function GameScreen({ navigateBack, navigateTo }) {
    const cancellationTokenRef = React.useRef({
        isCancelled: false
    });
    const gameContainerRef = React.useRef(null);

    React.useEffect(() => {
        const height = Math.min(gameContainerRef.current.offsetHeight, window.innerHeight);
        initGame(
            cancellationTokenRef.current,
            height,
            isMobile ? document.body.clientWidth : height * 9 / 16
        );
        const onPlayerDestroyed = () => {
            navigateTo(PostGameScreen, { result: 'player_destroyed'});
        }
        const onEnemyDestroyed = () => {
            navigateTo(PostGameScreen, { result: 'enemy_destroyed'});
        }
        document.addEventListener('player_destroyed', onPlayerDestroyed);
        document.addEventListener('enemy_destroyed', onEnemyDestroyed);

        return () => {
            document.removeEventListener('player_destroyed', onPlayerDestroyed);
            document.removeEventListener('enemy_destroyed', onEnemyDestroyed);
            cancellationTokenRef.current.isCancelled = true;
        };
    }, []);

    return (
        <>
            <div ref={gameContainerRef} style={{
                flex: 1,
                alignSelf: 'center'
            }}>
                <canvas id="arena"></canvas>
            </div>
        </>
    );
}