import express from 'express';
import { StreamChat } from 'stream-chat'; // Import the Stream Chat server SDK
import { FIREBASE_AUTH } from '../firebase.config';


const messagesRouter = express.Router();
const streamClient = new StreamChat("4mfkcgqvz3ym", "szx7p6att4k8ewhcdau3n69eramv8g7g2up5bkr9b3y75p8peertpjj4tt3gtd6s");

/**
 * This module configures the message routing for a chat application using Express and Stream Chat.
 * It provides endpoints to add new chats and retrieve existing chat information.
 * 
 * @module messagesRouter
 */

/**
  * Endpoint to create a new chat between two users.
 * 
 * @namespace messagesRouter
 * @route POST /addNewChat
 * @param {typeOf streamClient} Initialize a client
 * @param {express.Request} req Express request object, expects the chatUser (current user) and the userId (user Id from post).
 * @param {express.Response} res Express response object.
 * @returns {void} Responds with success status and a stream Token from  StreamChat, or an error message upon failure.
 */

messagesRouter.post('/addNewChat', async (req, res) => {
    const { chatUser, userId } = req.body; 

    try {
        const userRecord = await FIREBASE_AUTH.getUser(userId);
        const chatUserRecord = await FIREBASE_AUTH.getUser(chatUser);

        if (!userRecord || !chatUserRecord) {
            return res.status(403).send('Unauthorized');
        }

        await streamClient.upsertUsers([
            { id: userId, role:"user" },
            { id: chatUser, role:"user" }
        ]);
        
        const streamToken = streamClient.createToken(userId);

        res.json({ token: streamToken });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).send('Authentication failed');
    }
});


/**
  * Endpoint to retrieve chat sessions for a user.
 * 
 * @namespace messagesRouter
 * @route POST /getChats
 * @param {typeOf streamClient} Initialize a client
 * @param {express.Request} req Express request object, expects the chatUser (current user).
 * @param {express.Response} res Express response object.
 * @returns {void} Responds with success status and a stream Token from  StreamChat, or an error message upon failure.
 */

messagesRouter.post('/getChats', async (req, res) => {
    const { chatUser } = req.body;

    try {
        const userRecord = await FIREBASE_AUTH.getUser(chatUser);
        if (!userRecord) {
            return res.status(404).send('User not found');
        }

        await streamClient.upsertUser({ id: chatUser, role: "user" });

        const token = streamClient.createToken(chatUser);
        res.json({ token, chatUser });
    } catch (error) {
        console.error('Error in getChats:', error);
        res.status(500).send('Server error');
    }
});

module.exports = { messagesRouter };

export { 
    messagesRouter
};
