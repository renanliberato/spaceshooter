import React from 'react';
import { UserConsumer } from '../contexts/UserContext'
import { GameScreen } from './GameScreen';
import { SinglePlayerGameScreen } from './SinglePlayerGameScreen';
import { isMobile } from '../config';
import { ChatButton } from '../components/ChatButton';
import { SinglePlayerGameMode } from '../components/SinglePlayerGameMode';
import { MultiplayerPlayerGameMode } from '../components/MultiplayerPlayerGameMode';
import { ProfileHeader } from '../components/ProfileHeader';
import { EventsService } from '../services/api';

export function MainScreen(props) {
    return (
        <UserConsumer>
            <MainScreenComponent {...props} />
        </UserConsumer>
    );
}

export function MainScreenComponent({ user, navigateTo }) {
    const [aggregatedUserData, setAggregatedUserData] = React.useState(null);
    const [selectedRankingMode, setSelectedRankingMode] = React.useState('hard');

    React.useEffect(() => {
        EventsService.getAggregatedUserData().then(data => setAggregatedUserData(data));
        user.updateUsername(user.state.username);
    }, []);

    const rankingMapper = {
        easy: (users) => {
            const sortedUser = users.map(u => ({ username: u.username, wins: u.matches.singleplayer.easy.wins }))
            sortedUser.sort((a, b) => b.wins - a.wins);

            return sortedUser;
        },
        normal: (users) => {
            const sortedUser = users.map(u => ({ username: u.username, wins: u.matches.singleplayer.normal.wins }))
            sortedUser.sort((a, b) => b.wins - a.wins);

            return sortedUser;
        },
        hard: (users) => {
            const sortedUser = users.map(u => ({ username: u.username, wins: u.matches.singleplayer.hard.wins }))
            sortedUser.sort((a, b) => b.wins - a.wins);

            return sortedUser;
        },
        multiplayer: (users) => {
            const sortedUser = users.map(u => ({ username: u.username, wins: u.matches.multiplayer.wins }))
            sortedUser.sort((a, b) => b.wins - a.wins);

            return sortedUser;
        },
    }

    return (
        <div style={{
            flex: 1,
            padding: 20,
            alignSelf: 'center'
        }}>
            <ProfileHeader />
            <SinglePlayerGameMode navigateTo={navigateTo} />
            <MultiplayerPlayerGameMode navigateTo={navigateTo} />
            <details style={{ marginTop: 10 }} open>
                <summary>Ranking</summary>
                {aggregatedUserData == null && (
                    <span>No data yet</span>
                )}
                {aggregatedUserData != null && (
                    <div>
                        <select value={selectedRankingMode} onChange={e => setSelectedRankingMode(e.target.value)}>
                            <option value='easy'>Singleplayer - easy</option>
                            <option value='normal'>Singleplayer - normal</option>
                            <option value='hard'>Singleplayer - hard</option>
                            <option value='multiplayer'>Multiplayer</option>
                        </select>
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Wins</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankingMapper[selectedRankingMode](aggregatedUserData['users']).map(user => (
                                    <tr>
                                        <td>{user.username}</td>
                                        <td>{user.wins}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </details>
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
            {isMobile && (
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
                            <tr>
                                <td>Touch twice left side</td>
                                <td>Dash left</td>
                            </tr>
                            <tr>
                                <td>Touch twice right side</td>
                                <td>Dash right</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
            <ChatButton />
        </div>
    );
}