import { Module } from '@nestjs/common';
import { PostImagesService } from './post-images.service';
import { PostImagesController } from './post-images.controller';

@Module({
  controllers: [PostImagesController],
  providers: [PostImagesService],
})
export class PostImagesModule {}
