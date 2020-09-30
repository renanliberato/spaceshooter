import React from 'react';
import { GameScreen } from './GameScreen';
import { SinglePlayerGameScreen } from './SinglePlayerGameScreen';
import { MapEditorScreen } from './MapEditorScreen';
import { isMobile, API_BASE_URL } from '../index';

export function MainScreen({ navigateTo }) {
    const [matchId, setMatchId] = React.useState(Math.random().toString(36).substring(7));

    React.useEffect(() => {
        const urlMatchId = new URLSearchParams(document.location.search).get('matchid');
        if (urlMatchId) {
            fetch(`${API_BASE_URL}/matches/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(urlMatchId)
            })
            .then(res => {
                navigateTo(GameScreen, {
                    matchId: urlMatchId
                });
            });
        }

    }, []);

    return (
        <div style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1 style={{ textAlign: 'center' }}>Space shooter</h1>
            {!isMobile ? (<>
                <button style={{ marginTop: 20, marginBottom: 10 }} onClick={() => {
                    navigateTo(SinglePlayerGameScreen);
                }}>Play Singleplayer</button>
                <label style={{marginTop: 20}}>Match ID</label>
                <input value={matchId} onChange={e => setMatchId(e.target.value)} />
                <button style={{ marginBottom: 10 }} onClick={() => {
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
                }}>Play Multiplayer</button>
                <button style={{ marginTop: 20, marginBottom: 20 }} onClick={() => {
                    navigateTo(MapEditorScreen, {
                        mapId: Math.random().toString(36).substring(7)
                    });
                }}>Create Map</button>
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
                            <tr>
                                <td>Q</td>
                                <td>Dash left</td>
                            </tr>
                            <tr>
                                <td>E</td>
                                <td>Dash right</td>
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