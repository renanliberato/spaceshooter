import React from 'react';
import { GameScreen } from './GameScreen';

export function PostGameScreen({ result, navigateBack, navigateTo }) {
    return (
        <div style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1 style={{ textAlign: 'center' }}>{result == 'player_destroyed' ? 'You lose!' : 'You win!'}</h1>
            <div style={{
                marginTop: 20,
                flexDirection: 'row',

            }}>
                <button style={{marginLeft: 5}} onClick={() => {
                    window.history.replaceState("", "", '/');
                    navigateBack();
                    navigateBack();
                }}>Return to main menu</button>
            </div>
        </div>
    );
}