import React, { useEffect, useMemo, useState } from 'react'; // Import useState
import { useLocation } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
  ChannelList,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';
import Loading from '../components/shared/loadingScreen';
import { FIREBASE_AUTH } from '../firebase.config';

/**
 * Functional React component for messaging page.
 * This component utilizes StreamChat for chat features, enabling real-time messaging between users.
 * It provides a user interface for messaging, including a chat window, message list, and message input.
 * Users can view different channels, send messages, and view message threads.
 * The component handles user authentication and connects to the StreamChat client.
 * It fetches and displays chat channels based on the current user's memberships.
 * 
 * @component
 * @example
 * <MessagePage />
 *
 * @returns {React.ReactElement} A React component for the messaging page.
 */

const MessagePage = () => {
    const apiKey = '4mfkcgqvz3ym';
    const location = useLocation();
    const { userId, chatUser, chatname } = location.state || {};
    const [client, setClient] = useState<StreamChat | null>(null);
    const [userToken, setUserToken] = useState<string | undefined>("");
    const currentUser = FIREBASE_AUTH.currentUser && FIREBASE_AUTH.currentUser.uid ? 
    FIREBASE_AUTH.currentUser.uid: ""

    const filters = useMemo(() => ({
        members: { $in: [currentUser] }, 
        type: 'messaging'
    }), [currentUser]);
    const options = { presence: true, state: true };



    useEffect(() => {
        const fetchStreamToken = async () => {
            const url = userId && userId.length > 0 ? "addNewChat" : "getChats"
            try {
                const chatData = userId ?{
                    userId: userId,
                    chatUser: chatUser,
                } : {
                    chatUser: FIREBASE_AUTH?.currentUser?.uid
                };
    
                const serverResponse = await fetch(`http://localhost:3001/messages/${url}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(chatData),
                });
    
                const data = await serverResponse.json();
                if (serverResponse.ok) {
                    setUserToken(data.token);
                    return data.token;
                } else {
                    throw new Error(data.message || 'Updating failed');
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        };
    
        const init = async () => {
            if (currentUser.length > 0) {
                const streamToken = await fetchStreamToken();
                setUserToken(streamToken); // Set the Stream token in state
    
                if (streamToken) {
                    const chatClient = StreamChat.getInstance(apiKey);
                    await chatClient.connectUser({ id: (userId && userId.length 
                        > 0 ? userId : currentUser )}, streamToken);

                    
                    userId && userId.length 
                    > 0 ? await chatClient.channel('messaging', chatname, {
                        name: chatname,
                        members: [userId, chatUser]
                    }).watch() : await chatClient.queryChannels(filters);
                   
                    setClient(chatClient); // Set the client in state
                }
            }
        };
    
        init();
    
        return () => {
            if (client) {
                client.disconnectUser().then(() => setClient(null));
            }
        };
    }, [userId, chatUser, chatname, client, currentUser, filters]);

    if (!client || !userToken) { // Check if the client and userToken are not set
        return <Loading />;
    }

    return (
        <div className='mt-12 mb-5 w-full h-1/3'>
            <Chat client={client} theme="messaging light">
                {!userId ? (
                    <> <ChannelList filters={filters} options={options} />
                    <Channel>
                        <Window>
                            <ChannelHeader />
                            <MessageList />
                            <MessageInput />
                        </Window>
                        <Thread />
                    </Channel></>
                ) : (
                    <Channel channel={client.channel('messaging', chatname)}>
                        <Window>
                            <ChannelHeader />
                            <MessageList />
                            <MessageInput />
                        </Window>
                        <Thread />
                    </Channel>
                )}
            </Chat>
        </div>
    );
}

export default MessagePage;
