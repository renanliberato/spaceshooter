import React from 'react';
import { UserConsumer } from '../contexts/UserContext';

export function ProfileHeader(props) {
    return (
        <UserConsumer>
            <ProfileHeaderComponent {...props} />
        </UserConsumer>
    );
}

export function ProfileHeaderComponent({ user }) {
    const [editingName, setEditingName] = React.useState(false);

    if (editingName === false)
        return (
            <div style={{
                flexDirection: 'row',
                alignSelf: 'flex-start',
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
            alignSelf: 'flex-start',
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