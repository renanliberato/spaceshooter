import ReactDOM from 'react-dom';
import React from 'react';
import { useNavigation } from 'react-simple-stack-navigation';
import { IntroductionScreen } from './screens/IntroductionScreen';
import { MainScreen } from './screens/MainScreen';
import { GameScreen } from './screens/GameScreen';
import { SinglePlayerGameScreen } from './screens/SinglePlayerGameScreen';
import { UserProvider } from './contexts/Usercontext';

export const API_BASE_URL = 'https://localhost:5001';
//export const API_BASE_URL = 'https://renanliberato-spaceshooterserver.azurewebsites.net';

const App = () => {
    const { currentScreen: { ScreenComponent, params }, navigateTo, navigateBack } = useNavigation(IntroductionScreen);
    const height = window.innerHeight;
    const width = height * 9 / 16;

    return (
        <UserProvider>
            <div style={{
                alignSelf: 'center',
                height,
                width,
            }}>
                <ScreenComponent navigateTo={navigateTo} navigateBack={navigateBack} {...params} />
            </div>
        </UserProvider>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));