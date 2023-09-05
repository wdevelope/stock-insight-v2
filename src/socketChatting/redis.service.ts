import { Injectable } from '@nestjs/common';
import * as redis from 'redis';
import { promisify } from 'util';

@Injectable()
export class RedisService {
  private readonly client: redis.RedisClient;
  private readonly getAsync: (key: string) => Promise<string>;
  private readonly rpushAsync: (key: string, value: string) => Promise<number>;

  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.rpushAsync = promisify(this.client.rpush).bind(this.client);
  }

  async addMessage(message: string): Promise<number> {
    return this.rpushAsync('chat_messages', message);
  }

  async getMessages(): Promise<string[]> {
    const messages = await this.getAsync('chat_messages');
    return messages ? JSON.parse(messages) : [];
  }
}
