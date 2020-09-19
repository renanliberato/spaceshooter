import ReactDOM from 'react-dom';
import React from 'react';
import { useNavigation } from 'react-simple-stack-navigation';
import { MainScreen } from './screens/MainScreen';
import { GameScreen } from './screens/GameScreen';

const App = () => {
    const { currentScreen: { ScreenComponent, params }, navigateTo, navigateBack } = useNavigation(MainScreen);

    return (
        <>
            <ScreenComponent navigateTo={navigateTo} navigateBack={navigateBack} {...params} />
        </>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));