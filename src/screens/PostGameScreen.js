import React from 'react';
import { GameScreen } from './GameScreen';
import { UI_BASE_URL } from '../config';

export function PostGameScreen({ playerWon, navigateBack, navigateTo }) {
    return (
        <div style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1 style={{ textAlign: 'center' }}>{!playerWon ? 'You lose!' : 'You win!'}</h1>
            <div style={{
                marginTop: 20,
                flexDirection: 'row',

            }}>
                <button style={{marginLeft: 5}} onClick={() => {
                    window.history.replaceState("", "", UI_BASE_URL);
                    navigateBack();
                    navigateBack();
                }}>Return to main menu</button>
            </div>
        </div>
    );
}