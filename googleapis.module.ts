import {Global, Module} from '@nestjs/common';
import {GoogleFormService} from './google-form.service';
import {GoogleSheetService} from './google-sheet.service';
import {GoogleTimezoneService} from './google-timezone.service';
import {GoogleDriveService} from './google-drive/google-drive.service';
import {GoogleDrivePermissionService} from './google-drive/google-drive-permission.service';

@Global()
@Module({
  providers: [
    GoogleDriveService,
    GoogleDrivePermissionService,
    GoogleFormService,
    GoogleSheetService,
    GoogleTimezoneService,
  ],
  exports: [
    GoogleDriveService,
    GoogleDrivePermissionService,
    GoogleFormService,
    GoogleSheetService,
    GoogleTimezoneService,
  ],
})
export class GoogleAPIsModule {}
