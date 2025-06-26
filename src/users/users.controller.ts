import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  getSchemaPath,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ResponseUserDto } from './dto/response-user.dto';
import { RequestUserDto } from './dto/request-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: RequestUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: ResponseUserDto,
  })
  create(@Body() createDto: RequestUserDto): Promise<ResponseUserDto> {
    return this.usersService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(ResponseUserDto) },
    },
  })
  findAll(): Promise<ResponseUserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the user' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ResponseUserDto> {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the user' })
  @ApiBody({ type: RequestUserDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateDto: RequestUserDto,
  ): Promise<ResponseUserDto> {
    return this.usersService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
    schema: {
      example: { id: '123e4567-e89b-12d3-a456-426614174000' },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ id: string }> {
    return this.usersService.remove(id);
  }
}
