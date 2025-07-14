import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { mapActiveChatWithDto } from './helpers/mapActiveChatWithDto';

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
