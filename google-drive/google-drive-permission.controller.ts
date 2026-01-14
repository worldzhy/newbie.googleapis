import {Body, Controller, Delete, Get, Param, Post, Query} from '@nestjs/common';
import {ApiBearerAuth, ApiResponse, ApiTags} from '@nestjs/swagger';
import {Prisma} from '@generated/prisma/client';
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
