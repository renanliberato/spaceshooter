import React from 'react';
import { GameScreen } from './GameScreen';
import { SinglePlayerGameScreen } from './SinglePlayerGameScreen';
import { isMobile } from '../config';
import { ChatButton } from '../components/ChatButton';
import { SinglePlayerGameMode } from '../components/SinglePlayerGameMode';
import { MultiplayerPlayerGameMode } from '../components/MultiplayerPlayerGameMode';
import { ProfileHeader } from '../components/ProfileHeader';

export function MainScreen({ navigateTo }) {

    return (
        <div style={{
            flex: 1,
            padding: 20,
        }}>
            <ProfileHeader />
            <SinglePlayerGameMode navigateTo={navigateTo} />
            <MultiplayerPlayerGameMode navigateTo={navigateTo} />
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
            <ChatButton />
        </div>
    );
}