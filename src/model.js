"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostedMessage = void 0;
class PostedMessage {
    constructor(premium, sender, text) {
        this.premium = premium;
        this.sender = sender;
        this.text = text;
    }
    serialize() {
        return JSON.stringify({
            premium: this.premium,
            sender: this.sender,
            text: this.text
        });
    }
    isValid() {
        return this.sender !== '' && this.text !== '';
    }
}
exports.PostedMessage = PostedMessage;
