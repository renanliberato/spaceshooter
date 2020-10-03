import React from 'react';
import { GameScreen } from './GameScreen';
import { SinglePlayerGameScreen } from './SinglePlayerGameScreen';
import { MapEditorScreen } from './MapEditorScreen';
import { isMobile, API_BASE_URL } from '../index';
import { UserConsumer } from '../contexts/UserContext';

export function MainScreen(props) {
    return (
        <UserConsumer>
            <MainScreenComponent {...props} />
        </UserConsumer>
    );
}

export function MainScreenComponent({ navigateTo, user }) {
    const [matchId, setMatchId] = React.useState(Math.random().toString(36).substring(7));
    const [difficulty, setDifficulty] = React.useState("easy");
    const [editingName, setEditingName] = React.useState(false);
    const [matches, setMatches] = React.useState([]);

    React.useEffect(() => {
        fetch(`${API_BASE_URL}/matches/list`, {
                headers: {
                    "Accept": "application/json"
                },
            })
            .then(res => res.json())
            .then(res => {
                setMatches(res);
            });
    }, []);

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
            padding: 20,
        }}>
            {editingName === false
            ? (
                <div style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                }}>
                    <span style={{marginRight: 20}}>Hello, {user.state.username}</span>
                    <a onClick={(e) => {
                        e.preventDefault();
                        setEditingName(user.state.username);
                    }}>Change username</a>
                </div>
            )
            : (
                <div style={{
                    alignSelf: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <input style={{marginRight: 20, marginBottom: 0}} value={editingName} onChange={e => setEditingName(e.target.value)} />
                    <a onClick={(e) => {
                        e.preventDefault();
                        user.updateUsername(editingName);
                        setEditingName(false);
                    }}>Done</a>
                </div>
            )}
            <details open style={{marginTop: 20}}>
                <summary>Play Singleplayer</summary>
                <div>
                    <select style={{marginTop: 20, marginBottom: 0}} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                        <option value="easy">Easy</option>
                        <option value="normal">Normal</option>
                        <option value="hard">Hard</option>
                    </select>
                    <div style={{
                        flexDirection: 'row',
                        marginTop: 10
                    }}>
                        <i style={{flex: 1, textAlign: 'center'}}>Wins: {user.state.matches.singleplayer[difficulty].wins}</i>
                        <i style={{flex: 1, textAlign: 'center'}}>Losses: {user.state.matches.singleplayer[difficulty].losses}</i>
                    </div>
                    <button style={{ marginTop: 20, marginBottom: 10 }} onClick={() => {
                        navigateTo(SinglePlayerGameScreen, {
                            difficulty
                        });
                    }}>Play Singleplayer</button>
                </div>
            </details>
            <details open style={{marginTop: 10}}>
                <summary>Play Multiplayer</summary>
                <div>
                    {matches.length == 0
                    ? (
                        <label style={{marginTop: 10}}>No live matches yet</label>
                    ) : (
                        <>
                            <label style={{marginTop: 10}}>Live matches</label>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Players</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matches.map(match => (
                                        <tr>
                                            <td>{match.matchId}</td>
                                            <td>{match.connectionIds.length}</td>
                                            <td><a onClick={(e) => {
                                                e.preventDefault();
                                                fetch(`${API_BASE_URL}/matches/create`, {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    },
                                                    body: JSON.stringify(match.matchId)
                                                })
                                                .then(res => {
                                                    navigateTo(GameScreen, {
                                                        matchId: match.matchId
                                                    });
                                                });
                                            }}>Enter</a></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                    <label style={{marginTop: 10}}>Match ID</label>
                    <input style={{marginTop: 10}} value={matchId} onChange={e => setMatchId(e.target.value)} />
                    <div style={{
                        flexDirection: 'row',
                        marginTop: 10
                    }}>
                        <i style={{flex: 1, textAlign: 'center'}}>Wins: {user.state.matches.multiplayer.wins}</i>
                        <i style={{flex: 1, textAlign: 'center'}}>Losses: {user.state.matches.multiplayer.losses}</i>
                    </div>
                    <button style={{ marginTop: 10, marginBottom: 10 }} onClick={() => {
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
                </div>
            </details>
            {/*<button style={{ marginTop: 20, marginBottom: 20 }} onClick={() => {
                navigateTo(MapEditorScreen, {
                    mapId: Math.random().toString(36).substring(7)
                });
            }}>Create Map</button>*/}
            <strong style={{marginTop: 10}}>Controls</strong>
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
        </div>
    );
}