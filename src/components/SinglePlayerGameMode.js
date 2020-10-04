const uuid = require('uuid')
;import React from 'react';
import { SinglePlayerGameScreen } from '../screens/SinglePlayerGameScreen';
import { UserConsumer } from '../contexts/UserContext';

export function SinglePlayerGameMode(props) {
    return (
        <UserConsumer>
            <SinglePlayerGameModeComponent {...props} />
        </UserConsumer>
    );
}

export function SinglePlayerGameModeComponent({ navigateTo, user }) {
    const [difficulty, setDifficulty] = React.useState("easy");

    return (
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
    );
}