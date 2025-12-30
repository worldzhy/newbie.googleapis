import {Post, Body, Controller, Delete, Param, Get, Query} from '@nestjs/common';
import {ApiTags, ApiBearerAuth, ApiResponse} from '@nestjs/swagger';
import {Prisma} from '@prisma/client';
import {PrismaService} from '@framework/prisma/prisma.service';
import {GoogleDrivePermissionService} from '@microservices/googleapis/google-drive/google-drive-permission.service';
import {
  CreateGoogleDrivePermissionRequestDto,
  CreateGoogleDrivePermissionResponseDto,
  GetGoogleDrivePermissionRequestDto,
  ListGoogleDrivePermissionsRequestDto,
  ListGoogleDrivePermissionsResponseDto,
} from './google-drive-permission.dto';

@ApiTags('Google Drive / Permission')
@ApiBearerAuth()
@Controller('google-drive/permissions')
export class GoogleDrivePermissionController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly googleDrivePermission: GoogleDrivePermissionService
  ) {}

  @Get()
  @ApiResponse({type: ListGoogleDrivePermissionsResponseDto})
  async listPermissions(@Query() query: ListGoogleDrivePermissionsRequestDto) {
    return await this.prisma.findManyInOnePage({
      model: Prisma.ModelName.GoogleDrivePermission,
      findManyArgs: {where: {fileId: query.fileId}},
    });
  }

  @Post()
  @ApiResponse({type: CreateGoogleDrivePermissionResponseDto})
  async createPermission(@Body() body: CreateGoogleDrivePermissionRequestDto) {
    return await this.googleDrivePermission.createPermission(body);
  }

  @Delete(':permissionId')
  async deletePermission(@Param() params: GetGoogleDrivePermissionRequestDto) {
    return await this.googleDrivePermission.deletePermission(params.permissionId);
  }

  /* End */
}
