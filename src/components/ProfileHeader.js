import React from 'react';
import { UserConsumer } from '../contexts/UserContext';

export function ProfileHeader(props) {
    return (
        <UserConsumer>
            <ProfileNameHeaderComponent {...props} />
            <div style={{marginTop: 10}}></div>
            <ProfileShipHeaderComponent {...props} />
        </UserConsumer>
    );
}

export function ProfileNameHeaderComponent({ user }) {
    const [editingName, setEditingName] = React.useState(false);
    const [selectingShip, setSelectingShip] = React.useState('shipA');

    if (editingName === false)
        return (
            <div style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <span style={{marginRight: 20}}>Hello, {user.state.username}</span>
                <button onClick={(e) => {
                    setEditingName(user.state.username);
                }}>Change username</button>
            </div>
        );

    return (
        <div style={{
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <input maxLength={13} style={{marginRight: 20, marginBottom: 0}} value={editingName} onChange={e => setEditingName(e.target.value)} />
            <button onClick={(e) => {
                e.preventDefault();
                user.updateUsername(editingName);
                setEditingName(false);
            }}>Done</button>
        </div>
    );
}

export function ProfileShipHeaderComponent({ user }) {
    const [selectingShip, setSelectingShip] = React.useState(false);

    if (selectingShip === false)
        return (
            <div style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <span style={{marginRight: 20}}>Selected ship: {user.state.ship}</span>
                <button onClick={(e) => {
                    setSelectingShip(user.state.ship);
                }}>Change ship</button>
            </div>
        );

    return (
        <div style={{
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <select style={{marginRight: 20}} value={selectingShip} onChange={e => setSelectingShip(e.target.value)}>
                <option value='Alpha'>Alpha</option>
                <option value='Beta'>Beta</option>
                <option value='Ovni'>Ovni</option>
            </select>
            <button onClick={(e) => {
                e.preventDefault();
                user.updateShip(selectingShip);
                setSelectingShip(false);
            }}>Done</button>
        </div>
    );
}