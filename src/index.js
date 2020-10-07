import ReactDOM from 'react-dom';
import React from 'react';
import { useNavigation } from 'react-simple-stack-navigation';
import { IntroductionScreen } from './screens/IntroductionScreen';
import { MainScreen } from './screens/MainScreen';
import { GameScreen } from './screens/GameScreen';
import { SinglePlayerGameScreen } from './screens/SinglePlayerGameScreen';
import { UserProvider } from './contexts/Usercontext';
import { isMobile } from './config';

window.oncontextmenu = function(event) {
     event.preventDefault();
     event.stopPropagation();
     return false;
};


const DesktopApp = () => {
    const { currentScreen: { ScreenComponent, params }, navigateTo, navigateBack } = useNavigation(MainScreen);

    return (
        <UserProvider>
            <div style={{
                alignSelf: 'center',
                height: '100%',
                width: '100%',
            }}>
                <ScreenComponent navigateTo={navigateTo} navigateBack={navigateBack} {...params} />
            </div>
        </UserProvider>
    );
}

const MobileApp = () => {
    const { currentScreen: { ScreenComponent, params }, navigateTo, navigateBack } = useNavigation(MainScreen);

    return (
        <UserProvider>
            <div style={{
                alignSelf: 'center',
                height: '100%',
                width: '100%',
            }}>
                <ScreenComponent navigateTo={navigateTo} navigateBack={navigateBack} {...params} />
            </div>
        </UserProvider>
    );
}

if (isMobile)
    ReactDOM.render(<MobileApp />, document.getElementById('root'));
else
    ReactDOM.render(<DesktopApp />, document.getElementById('root'));