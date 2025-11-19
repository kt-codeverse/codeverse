import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadsService {
  /**
   * Cloudinary에 이미지를 업로드합니다.
   * @param file - Express.Multer.File
   * @returns Cloudinary 업로드 결과
   */
  async uploadImages(
    files: Array<Express.Multer.File>,
  ): Promise<UploadApiResponse[]> {
    const uploadPromises = files.map((file) => {
      return new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'uploads' },
          (error, result) => {
            if (error) {
              console.error(error);
              return reject(
                new InternalServerErrorException(
                  '이미지 업로드에 실패했습니다.',
                ),
              );
            }
            if (!result) {
              return reject(
                new InternalServerErrorException(
                  'Cloudinary로부터 응답을 받지 못했습니다.',
                ),
              );
            }
            resolve(result);
          },
        );
        Readable.from(file.buffer).pipe(uploadStream);
      });
    });

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new InternalServerErrorException(
        '하나 이상의 이미지 업로드에 실패했습니다.',
      );
    }
  }
}
