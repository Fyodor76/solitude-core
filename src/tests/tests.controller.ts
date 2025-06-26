import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  getSchemaPath,
} from '@nestjs/swagger';
import { TestService } from './tests.service';
import { TestSwaggerDocs } from './tests.swagger.constants';
import {
  RequestTestWithQuestionsDto,
  UpdateRequestTestWithQuestionsDto,
} from './dto/request-test.dto';
import { ResponseTestWithQuestionsDto } from './dto/response-test.dto';

@ApiTags('tests')
@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @ApiOperation({ summary: TestSwaggerDocs.create.summary })
  @ApiBody({ type: RequestTestWithQuestionsDto })
  @ApiResponse({
    status: 201,
    description: TestSwaggerDocs.create.responses[201].description,
    type: ResponseTestWithQuestionsDto,
  })
  async create(
    @Body() createDto: RequestTestWithQuestionsDto,
  ): Promise<ResponseTestWithQuestionsDto> {
    return this.testService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: TestSwaggerDocs.findAll.summary })
  @ApiResponse({
    status: 200,
    description: TestSwaggerDocs.findAll.responses[200].description,
    type: [ResponseTestWithQuestionsDto],
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(ResponseTestWithQuestionsDto) },
    },
  })
  async findAll(): Promise<ResponseTestWithQuestionsDto[]> {
    return this.testService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: TestSwaggerDocs.findOne.summary })
  @ApiParam(TestSwaggerDocs.findOne.param)
  @ApiResponse({
    status: 200,
    description: TestSwaggerDocs.findOne.responses[200].description,
  })
  @ApiResponse({
    status: 404,
    description: TestSwaggerDocs.findOne.responses[404].description,
    type: ResponseTestWithQuestionsDto,
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ResponseTestWithQuestionsDto> {
    return this.testService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: TestSwaggerDocs.update.summary })
  @ApiParam(TestSwaggerDocs.update.param)
  @ApiResponse({
    status: 200,
    description: TestSwaggerDocs.update.responses[200].description,
    type: UpdateRequestTestWithQuestionsDto,
  })
  @ApiResponse({
    status: 404,
    description: TestSwaggerDocs.update.responses[404].description,
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: RequestTestWithQuestionsDto,
  ): Promise<ResponseTestWithQuestionsDto> {
    return this.testService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: TestSwaggerDocs.remove.summary })
  @ApiParam(TestSwaggerDocs.remove.param)
  @ApiResponse({
    status: 200,
    description: `Successfully deleted test with id`,
    schema: {
      example: { id: '123e4567-e89b-12d3-a456-426614174002' },
    },
  })
  @ApiResponse({
    status: 404,
    description: TestSwaggerDocs.remove.responses[404].description,
  })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ id: string }> {
    const deletedId = await this.testService.remove(id);
    return { id: deletedId };
  }
}
