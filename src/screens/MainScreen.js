const uuid = require('uuid')
;import React from 'react';
import { GameScreen } from './GameScreen';
import { SinglePlayerGameScreen } from './SinglePlayerGameScreen';
import { MapEditorScreen } from './MapEditorScreen';
import { isMobile, API_BASE_URL } from '../config';
import { UserConsumer } from '../contexts/UserContext';
import { getHubConnection } from '../services/hub';

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
    const [isChatExpanded, setIsChatExpanded] = React.useState(false);
    const [canSendChatMessages, setCanSendChatMessages] = React.useState(false);
    const [chatList, setChatList] = React.useState([]);
    const [messageToSend, setMessageToSend] = React.useState('');
    const chatConnectionRef = React.useRef();

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

        fetch(`${API_BASE_URL}/chat`, {
                headers: {
                    "Accept": "application/json"
                },
            })
            .then(res => res.json())
            .then(res => {
                setChatList(res);
            });

        chatConnectionRef.current = getHubConnection('chathub');

        chatConnectionRef.current.on("MessageSent", function (username, message) {
            setChatList(list => list.concat({username, message}));
        });

        chatConnectionRef.current.start().then(function () {
            console.log('connected')
            setCanSendChatMessages(true);
            //entrou no jogo
        }).catch(function (err) {
            return console.error(err.toString());
        });

        chatConnectionRef.current.onclose(err => {
            setCanSendChatMessages(false);
        });

        chatConnectionRef.current.onreconnected(connectionId => {
        setCanSendChatMessages(true);
    });

        return () => {
            chatConnectionRef.current.stop();
        }
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
            <div style={{
                flexDirection: 'row',
                alignSelf: 'flex-start',
                alignItems: 'center'
            }}>
                {editingName === false
                ? (
                    <>
                        <span style={{marginRight: 20}}>Hello, {user.state.username}</span>
                        <button onClick={(e) => {
                            setEditingName(user.state.username);
                        }}>Change username</button>
                    </>
                )
                : (
                    <>
                        <input maxlength={13} style={{marginRight: 20, marginBottom: 0}} value={editingName} onChange={e => setEditingName(e.target.value)} />
                        <button onClick={(e) => {
                            e.preventDefault();
                            user.updateUsername(editingName);
                            setEditingName(false);
                        }}>Done</button>
                    </>
                )}
            </div>
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
            {!isMobile && (
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
            )}
            {!isChatExpanded
            ? (
                <div style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                }}>
                    <button onClick={() => setIsChatExpanded(true)}>Chat</button>
                </div>
            ) : (
                <div style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    height: 400,
                    width: 300,
                    marginBottom: 0,
                    borderRadius: 4,
                    padding: '.6rem 1rem',
                    background: 'var(--nc-bg-2)',
                    border: '1px solid var(--nc-bg-3)',
                }}>
                    <button style={{
                        position: 'absolute',
                        bottom: -10,
                        right: -10,
                        width: 20,
                        height: 20,
                        padding: 0,
                    }} onClick={() => setIsChatExpanded(false)}>X</button>
                    <ul style={{
                        flex: 1,
                    }}>
                        {chatList.map(message => (
                            <li key={message.id} style={{fontSize: 10}}>{message.username}: {message.message}</li>
                        ))}
                    </ul>
                    <div style={{
                        flexDirection: 'row',
                    }}>
                        <input disabled={!canSendChatMessages} style={{flex: 1}} value={messageToSend} onChange={e => setMessageToSend(e.target.value)} />
                        <button disabled={!canSendChatMessages} style={{marginLeft: 10, width: 60, height: 30}} onClick={() => {
                            const messageId = uuid.v4();
                            setChatList(list => list.concat({id: messageId, username: user.state.username, message: messageToSend}));
                            chatConnectionRef.current.invoke("SendMessageAsync", messageId, user.state.username, messageToSend);
                            setMessageToSend('');
                        }}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}