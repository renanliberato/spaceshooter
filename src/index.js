import ReactDOM from 'react-dom';
import React from 'react';
import { useNavigation } from 'react-simple-stack-navigation';
import { MainScreen } from './screens/MainScreen';
import { GameScreen } from './screens/GameScreen';

export const API_BASE_URL = 'https://localhost:5001';
//export const API_BASE_URL = 'https://renanliberato-spaceshooterserver.azurewebsites.net';

const App = () => {
    const { currentScreen: { ScreenComponent, params }, navigateTo, navigateBack } = useNavigation(MainScreen);

    return (
        <>
            <ScreenComponent navigateTo={navigateTo} navigateBack={navigateBack} {...params} />
        </>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));