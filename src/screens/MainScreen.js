import React from 'react';
import { GameScreen } from './GameScreen';
import { isMobile } from '../game';
import { API_BASE_URL } from '../index';

export function MainScreen({ navigateTo }) {
    const [matchId, setMatchId] = React.useState(Math.random().toString(36).substring(7));

    return (
        <div style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1 style={{ textAlign: 'center' }}>Space shooter</h1>
            {!isMobile ? (<>
                <label style={{marginTop: 20}}>Match ID</label>
                <input value={matchId} onChange={e => setMatchId(e.target.value)} />
                <button style={{ marginBottom: 20 }} onClick={() => {
                    console.log('creating match');

                    fetch(`${API_BASE_URL}/matches/create`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(matchId)
                    })
                    .then(res => {
                        navigateTo(GameScreen, {
                            matchId: matchId
                        });
                    });
                }}>Play</button>
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
                <strong style={{textAlign: 'center', margin: 20}}>This game version is not currently available for mobile devices. Please, reach here from a desktop and enjoy!</strong>
            </>)}
        </div>
    );
}