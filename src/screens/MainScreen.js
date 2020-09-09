import React from 'react';
import { GameScreen } from './GameScreen';
import { isMobile } from '../game';

export function MainScreen({ navigateTo }) {
    return (
        <div style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1 style={{ textAlign: 'center' }}>Space shooter</h1>
            <button style={{ marginTop: 20, marginBottom: 20 }} onClick={() => navigateTo(GameScreen)}>Play</button>
            {!isMobile ? (<>
                <strong>Controls</strong>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td>A</td>
                                <td>Move left</td>
                            </tr>
                            <tr>
                                <td>D</td>
                                <td>Move right</td>
                            </tr>
                            <tr>
                                <td>Space</td>
                                <td>Shoot</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>) : (<>
                <strong>Controls</strong>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td>Touch left side</td>
                                <td>Move left</td>
                            </tr>
                            <tr>
                                <td>Touch right side</td>
                                <td>Move right</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>)}
        </div>
    );
}