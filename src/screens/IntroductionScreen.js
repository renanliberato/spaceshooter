import React from 'react';
import { MainScreen } from './MainScreen';
import { isMobile, API_BASE_URL } from '../config';
import { UserConsumer } from '../contexts/UserContext';

export function IntroductionScreen(props) {
    return (
        <UserConsumer>
            <IntroductionScreenComponent {...props} />
        </UserConsumer>
    )
}

export function IntroductionScreenComponent({ navigateTo, user }) {
    const [username, setUsername] = React.useState(user.state.username);
    React.useEffect(() => {
        if (user.state.username != '')
        {
            navigateTo(MainScreen);
            return;
        }
    }, [user.state.username]);

    return (
        <div style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20
        }}>
            <h1 style={{ textAlign: 'center' }}>Space shooter</h1>
                <p style={{ textAlign: 'center' }}>Hello! How should we call you, pilot? You can change it later!</p>
                <input value={username} onChange={e => setUsername(e.target.value)} />
                <button style={{ marginBottom: 10 }} onClick={() => {
                    user.updateUsername(username);
                }}>Continue</button>
        </div>
    );
}