import { Controller, Get } from '@nestjs/common';
import { ChatService } from './application/chat.service';
import { mapActiveChatWithDto } from './domain/helpers/mapActiveChatWithDto';

@Controller('chats')
export class ChatContoller {
  constructor(private readonly chatService: ChatService) {}

  @Get('test')
  getHello(): string {
    console.log('Get hello!');
    return 'Hello from socket module!';
  }

  @Get()
  async getAllChats() {
    const activeChats = await this.chatService.getAllActiveChats();
    return activeChats.map((activeChat) => mapActiveChatWithDto(activeChat));
  }
}
