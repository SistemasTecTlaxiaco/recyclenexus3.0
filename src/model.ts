// src/model.ts
export class PostedMessage {
  premium: boolean;
  sender: string;
  text: string;

  constructor(premium: boolean, sender: string, text: string) {
      this.premium = premium;
      this.sender = sender;
      this.text = text;
  }

  serialize(): string {
      return JSON.stringify({
          premium: this.premium,
          sender: this.sender,
          text: this.text
      });
  }

  isValid(): boolean {
      return this.sender !== '' && this.text !== '';
  }
}

