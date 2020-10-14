import { EVENTS_BASE_URL } from '../config';

export const EventsService = {
    sendUserData: (user) => {
        fetch(`${EVENTS_BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                timestamp: new Date(),
                app: 'spaceshooter',
                data: user
            })
        })
        .then(res => console.log('sent state to server'))
        .catch(err => console.error(err));
    },
    getAggregatedUserData: (user) => {
        return fetch(`${EVENTS_BASE_URL}spaceshooter`, {
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .catch(err => console.error(err));
    }
}