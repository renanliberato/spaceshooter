import React from 'react';
import { initGame } from '../game';
import { GameEndBehaviour } from '../components/GameEndBehaviour';
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

    const onLose = () => {
        user.addMultiplayerMatch(false);
    };

    const onWin = () => {
        user.addMultiplayerMatch(true);
    };

    React.useEffect(() => {
        gameDisposer.current.dispose = initGame(
            cancellationTokenRef.current,
            user.state.username,
            user.state.ship,
            matchId
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
            <GameEndBehaviour onLose={onLose} onWin={onWin} navigateTo={navigateTo} navigateBack={navigateBack} />
        </>
    );
}