import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './application/chat.service';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { IsString, IsUUID, Length } from 'class-validator';

export class ChatIdDto {
  @ApiProperty()
  @Expose()
  id: string;
}

export class CreateMessageDto {
  @ApiProperty()
  @IsUUID()
  chatId: string;

  @ApiProperty()
  @IsString()
  @Length(1, 500)
  text: string;
}

export class ActiveChatIdResponseDto {
  @ApiProperty({ type: ChatIdDto })
  @Expose()
  @Type(() => ChatIdDto)
  chat: ChatIdDto;
}

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
    return plainToInstance(ActiveChatIdResponseDto, activeChats, {
      excludeExtraneousValues: true,
    });
    // return activeChats.map((activeChat) => mapActiveChatWithDto(activeChat));
  }
  @Post()
  createMessage(@Body() dto: CreateMessageDto) {
    try {
      return { message: 'Message received', data: dto };
    } catch (err) {
      console.error(err);
      throw err; // Пусть Nest сам обработает
    }
  }
}
