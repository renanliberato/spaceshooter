import React from 'react';
import { GameScreen } from '../screens/GameScreen';
import { API_BASE_URL } from '../config';
import { UserConsumer } from '../contexts/UserContext'

export function MultiplayerPlayerGameMode(props) {
    return (
        <UserConsumer>
            <MultiplayerPlayerGameModeComponent {...props} />
        </UserConsumer>
    );
}

export function MultiplayerPlayerGameModeComponent({ navigateTo, user }) {
    const [isConnected, setIsConnected] = React.useState(false);
    const [matchId, setMatchId] = React.useState(Math.random().toString(36).substring(7));
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
                setIsConnected(true);
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
                                    <tr key={match.matchId}>
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
                <button disabled={!isConnected} style={{ marginTop: 10, marginBottom: 10 }} onClick={() => {

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
    );
}