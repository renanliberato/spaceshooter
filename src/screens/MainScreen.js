import React from 'react';
import { GameScreen } from './GameScreen';

export function MainScreen({ navigateTo }) {
    return (
        <div style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1 style={{ textAlign: 'center' }}>Super Space Shooter</h1>
            <button style={{ marginTop: 20 }} onClick={() => navigateTo(GameScreen)}>Play</button>
            <div style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', margin: 30 }}>
                <div>
                    <span>Controls (computer):</span>
                    <span>- A: move left</span>
                    <span>- D: move right</span>
                    <span>- Space: shoot</span>
                </div>
                <div>
                    <span>Controls (mobile):</span>
                    <span>- A: move left</span>
                    <span>- D: move right</span>
                </div>
            </div>
        </div>
    );
}