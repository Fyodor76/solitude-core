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
} from '@nestjs/swagger';
import { TestService } from './tests.service';
import { Test } from './tests.entity';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { TestSwaggerDocs } from './tests.swagger.constants';

@ApiTags('tests')
@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @ApiOperation({ summary: TestSwaggerDocs.create.summary })
  @ApiBody({ type: CreateTestDto })
  @ApiResponse({
    status: 201,
    description: TestSwaggerDocs.create.responses[201].description,
    type: Test,
  })
  async create(@Body() createDto: CreateTestDto): Promise<Test> {
    return this.testService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: TestSwaggerDocs.findAll.summary })
  @ApiResponse({
    status: 200,
    description: TestSwaggerDocs.findAll.responses[200].description,
    type: [Test],
  })
  async findAll(): Promise<Test[]> {
    return this.testService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: TestSwaggerDocs.findOne.summary })
  @ApiParam(TestSwaggerDocs.findOne.param)
  @ApiResponse({
    status: 200,
    description: TestSwaggerDocs.findOne.responses[200].description,
    type: Test,
  })
  @ApiResponse({
    status: 404,
    description: TestSwaggerDocs.findOne.responses[404].description,
  })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Test> {
    return this.testService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: TestSwaggerDocs.update.summary })
  @ApiParam(TestSwaggerDocs.update.param)
  @ApiBody({ type: UpdateTestDto })
  @ApiResponse({
    status: 200,
    description: TestSwaggerDocs.update.responses[200].description,
    type: Test,
  })
  @ApiResponse({
    status: 404,
    description: TestSwaggerDocs.update.responses[404].description,
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateTestDto,
  ): Promise<Test> {
    return this.testService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: TestSwaggerDocs.remove.summary })
  @ApiParam(TestSwaggerDocs.remove.param)
  @ApiResponse({
    status: 204,
    description: TestSwaggerDocs.remove.responses[204].description,
  })
  @ApiResponse({
    status: 404,
    description: TestSwaggerDocs.remove.responses[404].description,
  })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.testService.remove(id);
  }
}
