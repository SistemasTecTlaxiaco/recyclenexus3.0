import { NearBindgen, call, view, Vector, near } from 'near-sdk-js';
import { PostedMessage } from './model.js';

@NearBindgen({})
class GuestBook {
  messages: Vector<PostedMessage> = new Vector<PostedMessage>("v-uid");
  users: Vector<string> = new Vector<string>("users");
  userTokens: Map<string, number> = new Map<string, number>();

  @call({ payableFunction: true })
  addMessage({ text }: { text: string }): void {
    const premium = near.attachedDeposit() >= BigInt('100000000000000000000000');
    const sender = near.predecessorAccountId();
    const message = new PostedMessage(premium, sender, text);

    if (!message.isValid()) {
      throw new Error("Invalid message");
    }

    this.messages.push(message);
  }

  @view({})
  getMessages({ fromIndex = 0, limit = 10 }: { fromIndex: number, limit: number }): PostedMessage[] {
    return this.messages.toArray().slice(fromIndex, fromIndex + limit);
  }

  @view({})
  totalMessages(): number {
    return this.messages.length;
  }

  @call({})
  registerUser({ username, email }: { username: string, email: string }): void {
    if (this.users.toArray().includes(username)) {
      throw new Error("User already exists");
    }
    this.users.push(username);
    this.userTokens.set(username, 0);
  }

  @call({})
  uploadEvidence({ username, materialType, amount }: { username: string, materialType: string, amount: number }): void {
    if (!this.users.toArray().includes(username)) {
      throw new Error("User does not exist");
    }
    const currentTokens = this.userTokens.get(username) || 0;
    this.userTokens.set(username, currentTokens + amount);
  }

  @view({})
  getUserTokens({ username }: { username: string }): number {
    if (!this.users.toArray().includes(username)) {
      throw new Error("User does not exist");
    }
    return this.userTokens.get(username) || 0;
  }

  @call({})
  verifyEvidence({ evidenceId }: { evidenceId: string }): void {
    // Implementación del método verificar evidencia
  }
}
