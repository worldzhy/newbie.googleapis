import {Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {Prisma} from '@generated/prisma/client';
import {PrismaService} from '@framework/prisma/prisma.service';
import {GoogleDriveFileService} from '@microservices/googleapis/google-drive/google-drive-file.service';
import {ApiBearerAuth, ApiResponse, ApiTags} from '@nestjs/swagger';
import {
  CreateGoogleDriveFileRequestDto,
  CreateGoogleDriveFileResponseDto,
  GetFilePathResponseDto,
  GetGoogleDriveFileRequestDto,
  ListGoogleDriveFilesRequestDto,
  ListGoogleDriveFilesResponseDto,
  RenameGoogleDriveFileRequestDto,
  RenameGoogleDriveFileResponseDto,
} from './google-drive-file.dto';
import {FileInterceptor} from '@nestjs/platform-express';
import {Express} from 'express';

@ApiTags('Google Drive / File')
@ApiBearerAuth()
@Controller('google-drive/files')
export class GoogleDriveFileController {
  constructor(
    private readonly googleDriveFile: GoogleDriveFileService,
    private readonly prisma: PrismaService
  ) {}

  @Post()
  @ApiResponse({type: ListGoogleDriveFilesResponseDto})
  async listFiles(@Body() body: ListGoogleDriveFilesRequestDto) {
    return await this.prisma.findManyInManyPages({
      model: Prisma.ModelName.GoogleDriveFile,
      pagination: {page: body.page, pageSize: body.pageSize},
      findManyArgs: {where: {parentId: body.parentId ?? null}},
    });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    // @UploadedFile(
    //   new ParseFilePipeBuilder()
    //     .addFileTypeValidator({
    //       fileType:
    //         'text/csv|application/vnd.ms-excel|application/msexcel|application/xls|application/x-xls|application/x-excel|application/x-dos_ms_excel|application/x-ms-excel|application/x-msexcel|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //     })
    //     .build()
    // ) file: Express.Multer.File,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: {parentId?: string}
  ) {
    await this.googleDriveFile.uploadFile({file, parentId: body.parentId});
  }

  @Post('folder')
  @ApiResponse({type: CreateGoogleDriveFileResponseDto})
  async createFolder(@Body() body: CreateGoogleDriveFileRequestDto) {
    return await this.googleDriveFile.createFolder(body);
  }

  @Post('document')
  @ApiResponse({type: CreateGoogleDriveFileResponseDto})
  async createDocument(@Body() body: CreateGoogleDriveFileRequestDto) {
    return await this.googleDriveFile.createDocument({
      name: body.name,
      parentId: body.parentId,
    });
  }

  @Post('spreadsheet')
  @ApiResponse({type: CreateGoogleDriveFileResponseDto})
  async createSpreadsheet(@Body() body: CreateGoogleDriveFileRequestDto) {
    return await this.googleDriveFile.createSheet({
      name: body.name,
      parentId: body.parentId,
    });
  }

  @Patch(':fileId/rename')
  @ApiResponse({type: RenameGoogleDriveFileResponseDto})
  async renameFile(@Param() params: GetGoogleDriveFileRequestDto, @Body() body: RenameGoogleDriveFileRequestDto) {
    return await this.googleDriveFile.renameFile({fileId: params.fileId, name: body.name});
  }

  @Delete(':fileId')
  async deleteFile(@Param() params: GetGoogleDriveFileRequestDto) {
    return await this.googleDriveFile.deleteFile(params.fileId);
  }

  @Get(':fileId/path')
  @ApiResponse({type: [GetFilePathResponseDto]})
  async getFilePath(@Param() params: GetGoogleDriveFileRequestDto) {
    return await this.googleDriveFile.getFilePath(params.fileId);
  }

  /* End */
}
