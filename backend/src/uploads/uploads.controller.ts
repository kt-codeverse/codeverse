import {
  Controller,
  Post,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  UploadedFiles,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  /**
   * 여러 이미지를 Cloudinary에 업로드합니다.
   * @param files - Express.Multer.File[]
   * @returns 업로드된 이미지 정보 배열
   */
  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10)) // 'files'는 form-data의 key, 10은 최대 파일 개수
  async uploadImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image' })],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    console.log('upload');
    return this.uploadsService.uploadImages(files);
  }
}
