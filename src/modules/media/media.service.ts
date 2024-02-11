import { Injectable } from '@nestjs/common';
import { PictureRepository } from './repositories/picture.repository';
import { v2 as cloudinary } from 'cloudinary';
import * as stream from 'stream';
import { UploadOptionsConfig } from '@app/common';
import { Picture } from './entities/picture.entity';

@Injectable()
export class MediaService {
  constructor(private readonly pictureRepository: PictureRepository) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadPicture(picture: Express.Multer.File) {
    const {
      public_id,
      width,
      height,
      format,
      bytes,
      secure_url,
      delete_token,
    } = await this.uploadStream(picture.buffer);
    const newPicture = new Picture();
    Object.assign(newPicture, {
      public_id,
      width,
      height,
      format,
      bytes,
      secure_url,
      delete_token,
      originalname: picture.originalname,
    });
    return newPicture;
  }

  async uploadStream(pictureBuffer: Buffer): Promise<any> {
    return new Promise((res, rej) => {
      const theTransformStream = cloudinary.uploader.upload_stream(
        UploadOptionsConfig,
        (err: any, result: any) => {
          if (err) return rej(err);
          res(result);
        },
      );
      const pictureStream = stream.Readable.from(pictureBuffer);
      pictureStream.pipe(theTransformStream);
    });
  }

  async deleteImage(public_id: string) {
    return await cloudinary.uploader.destroy(public_id);
  }
}
