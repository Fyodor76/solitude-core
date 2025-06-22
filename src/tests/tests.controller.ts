import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TestService } from './tests.service';
import { Test } from './tests.entity';

@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  create(@Body() createDto: any): Promise<Test> {
    return this.testService.create(createDto);
  }

  @Get()
  findAll(): Promise<Test[]> {
    return this.testService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Test> {
    return this.testService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.testService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testService.remove(id);
  }
}
