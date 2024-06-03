"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestBook = void 0;
const near_sdk_as_1 = require("near-sdk-as");
const near_sdk_as_2 = require("near-sdk-as");
const model_1 = require("./model");
class GuestBook {
    constructor() {
        this.messages = new near_sdk_as_2.PersistentVector("m");
        this.users = new near_sdk_as_2.PersistentVector("u");
        this.userTokens = new near_sdk_as_2.PersistentMap("t");
    }
    addMessage(text) {
        const premium = near_sdk_as_1.context.attachedDeposit >= near_sdk_as_1.u128.from("100000000000000000000000");
        const sender = near_sdk_as_1.context.sender;
        const message = new model_1.PostedMessage(premium, sender, text);
        if (!message.isValid()) {
            near_sdk_as_1.logging.log("Invalid message");
            return;
        }
        this.messages.push(message);
    }
    getMessages(fromIndex = 0, limit = 10) {
        const messagesArray = [];
        for (let i = fromIndex; i < Math.min(fromIndex + limit, this.messages.length); i++) {
            messagesArray.push(this.messages[i]);
        }
        return messagesArray;
    }
    totalMessages() {
        return this.messages.length;
    }
    registerUser(username) {
        let userExists = false;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i] === username) {
                userExists = true;
                break;
            }
        }
        if (userExists) {
            near_sdk_as_1.logging.log("User already exists");
            return;
        }
        this.users.push(username);
        this.userTokens.set(username, 0);
    }
    uploadEvidence(username, materialType, amount) {
        let userExists = false;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i] === username) {
                userExists = true;
                break;
            }
        }
        if (!userExists) {
            near_sdk_as_1.logging.log("User does not exist");
            return;
        }
        const currentTokens = this.userTokens.getSome(username);
        this.userTokens.set(username, currentTokens + amount);
    }
    getUserTokens(username) {
        let userExists = false;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i] === username) {
                userExists = true;
                break;
            }
        }
        if (!userExists) {
            near_sdk_as_1.logging.log("User does not exist");
            return 0;
        }
        return this.userTokens.getSome(username);
    }
    verifyEvidence(evidenceId) {
        // Implementación del método verificar evidencia
    }
}
exports.GuestBook = GuestBook;
