import React from 'react';
import { initSinglePlayerGame } from '../singleplayergame';
import { GameEndBehaviour } from '../components/GameEndBehaviour';
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

    const onLose = () => {
        user.addSingleplayerMatch(difficulty, false);
    };

    const onWin = () => {
        user.addSingleplayerMatch(difficulty, true);
    };

    React.useEffect(() => {
        const height = Math.min(gameContainerRef.current.offsetHeight, window.innerHeight);
        gameDisposer.current.dispose = initSinglePlayerGame(
            cancellationTokenRef.current,
            user.state.username,
            user.state.ship,
            difficulty
        );

        return () => {
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
            <GameEndBehaviour onWin={onWin} onLose={onLose} navigateTo={navigateTo} navigateBack={navigateBack} />
        </>
    );
}