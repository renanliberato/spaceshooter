import React from 'react';
const keycode = require('keycode');
import { UI_BASE_URL } from '../config';

export function MatchMenu({ navigateBack }) {
    const [uiState, setUiState] = React.useState({
        isDisplayingMenu: false
    });

    React.useEffect(() => {
        const onKeyPress = (e) => {
            switch (keycode(e)) {
                case 'esc':
                    setUiState(state => ({
                        ...state,
                        isDisplayingMenu: !state.isDisplayingMenu
                    }));
                    break;
            }
        }

        document.addEventListener('keydown', onKeyPress);

        return () => {
            document.removeEventListener('keydown', onKeyPress);
        };
    }, []);

    if (!uiState.isDisplayingMenu)
        return null;

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff55'
        }}>
            <div style={{
                borderRadius: 4,
                padding: 30,
                background: 'var(--nc-bg-2)',
                border: '1px solid var(--nc-bg-3)',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <h1 style={{ marginBottom: 20 }}>Menu</h1>
                <button onClick={() => {
                    window.history.replaceState("", "", UI_BASE_URL);
                    navigateBack();
                }}>Return to main menu</button>
            </div>
        </div>
    );
}