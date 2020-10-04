const uuid = require('uuid')
;import React from 'react';
import { isMobile, API_BASE_URL } from '../config';
import { UserConsumer } from '../contexts/UserContext';
import { getHubConnection } from '../services/hub';

export function ChatButton(props) {
    return (
        <UserConsumer>
            <ChatButtonComponent {...props} />
        </UserConsumer>
    );
}

export function ChatButtonComponent({ navigateTo, user }) {
    const [isChatExpanded, setIsChatExpanded] = React.useState(false);
    const [canSendChatMessages, setCanSendChatMessages] = React.useState(false);
    const [chatList, setChatList] = React.useState([]);
    const [messageToSend, setMessageToSend] = React.useState('');
    const chatConnectionRef = React.useRef();

    React.useEffect(() => {
        fetch(`${API_BASE_URL}/chat`, {
                headers: {
                    "Accept": "application/json"
                },
            })
            .then(res => res.json())
            .then(res => {
                setChatList(res);
            });

        chatConnectionRef.current = getHubConnection('chathub');

        chatConnectionRef.current.on("MessageSent", function (id, username, message) {
            setChatList(list => list.concat({id, username, message}));
        });

        chatConnectionRef.current.start().then(function () {
            console.log('connected')
            setCanSendChatMessages(true);
            //entrou no jogo
        }).catch(function (err) {
            return console.error(err.toString());
        });

        chatConnectionRef.current.onclose(err => {
            setCanSendChatMessages(false);
        });

        chatConnectionRef.current.onreconnected(connectionId => {
        setCanSendChatMessages(true);
    });

        return () => {
            chatConnectionRef.current.stop();
        }
    }, []);

    if (!isChatExpanded)
        return (
            <div style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
            }}>
                <button onClick={() => setIsChatExpanded(true)}>Chat</button>
            </div>
        );

    return (
        <div style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            height: 400,
            width: 300,
            marginBottom: 0,
            borderRadius: 4,
            padding: '.6rem 1rem',
            background: 'var(--nc-bg-2)',
            border: '1px solid var(--nc-bg-3)',
        }}>
            <ul style={{
                flex: 1,
            }}>
                {chatList.map(message => (
                    <li key={message.id} style={{fontSize: 10}}>{message.username}: {message.message}</li>
                ))}
            </ul>
            <div style={{
                flexDirection: 'row',
            }}>
                <input disabled={!canSendChatMessages} style={{flex: 1}} value={messageToSend} onChange={e => setMessageToSend(e.target.value)} />
                <button disabled={!canSendChatMessages} style={{marginLeft: 10, width: 60, height: 30}} onClick={() => {
                    const messageId = uuid.v4();
                    setChatList(list => list.concat({id: messageId, username: user.state.username, message: messageToSend}));
                    chatConnectionRef.current.invoke("SendMessageAsync", messageId, user.state.username, messageToSend);
                    setMessageToSend('');
                }}>Send</button>
            </div>
            <button style={{
                position: 'absolute',
                bottom: -10,
                right: -10,
                width: 20,
                height: 20,
                padding: 0,
            }} onClick={() => setIsChatExpanded(false)}>X</button>
        </div>
    );
}