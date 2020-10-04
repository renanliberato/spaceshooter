import React from 'react';
import { Provider, Subscribe, Container } from 'unstated';

const USER_KEY = 'spaceshooter_user';

function getPersistedUser() {
    const userString = localStorage.getItem(USER_KEY); 
    return userString ? JSON.parse(userString) : {};
}

function persistUser(userObject) {
    localStorage.setItem(USER_KEY, JSON.stringify(userObject));
}

class UserContainer extends Container {
    constructor() {
        super();
        this.state = {
            username: '',
            matches: {
                singleplayer: {
                    easy: {
                        wins: 0,
                        losses: 0,
                    },
                    normal: {
                        wins: 0,
                        losses: 0,
                    },
                    hard: {
                        wins: 0,
                        losses: 0,
                    },
                },
                multiplayer: {
                    wins: 0,
                    losses: 0,
                },
            },
            ...getPersistedUser()
        };

        this.updateUsername = this.updateUsername.bind(this)
        this.addSingleplayerMatch = this.addSingleplayerMatch.bind(this)
        this.addMultiplayerMatch = this.addMultiplayerMatch.bind(this)
        this.updateAndPersistState = this.updateAndPersistState.bind(this)
    }

    updateAndPersistState(updater) {
        this.setState(state => {
            const newState = { ...state };

            updater(newState);
            
            persistUser(newState);

            return newState;
        });
    }

    updateUsername(username) {
        this.updateAndPersistState(state => {
            state.username = username
        });
    }

    addSingleplayerMatch(difficulty, won) {
        this.updateAndPersistState(state => {
            if (won)
                state.matches.singleplayer[difficulty].wins++;
            else
                state.matches.singleplayer[difficulty].losses++;
        });
    }

    addMultiplayerMatch(won) {
        this.updateAndPersistState(state => {
            if (won)
                state.matches.multiplayer.wins++;
            else
                state.matches.multiplayer.losses++;
        });
    }
}

export function UserConsumer(props) {
    return (
        <Subscribe to={[UserContainer]}>
            {user => (
                React.cloneElement(props.children, { user })
            )}
        </Subscribe>
    )
}

export function UserProvider(props) {
    return (
        <Provider>
            {props.children}
        </Provider>
    );
}