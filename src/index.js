import ReactDOM from 'react-dom';
import React from 'react';
import { useNavigation } from 'react-simple-stack-navigation';
import { MainScreen } from './screens/MainScreen';

const App = () => {
    const { currentScreen: { ScreenComponent, params }, navigateTo, navigateBack } = useNavigation(MainScreen);

    return (
        <div style={{
            alignSelf: 'center',
            width: 600,
            maxWidth: '100%',
            flex: 1,
        }}>
            <ScreenComponent navigateTo={navigateTo} navigateBack={navigateBack} {...params} />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));