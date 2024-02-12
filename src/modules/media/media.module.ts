import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { DatabaseModule } from '@app/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PictureRepository } from './repositories/picture.repository';
import { Picture } from '@app/media/entities';

@Module({
  imports: [
    DatabaseModule.forFeature([Picture]),
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService, PictureRepository],
  exports: [MediaService],
})
export class MediaModule {}
