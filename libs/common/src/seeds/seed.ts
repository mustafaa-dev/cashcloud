// seed.ts
import { NestFactory } from '@nestjs/core';
import { SeedsService } from '@app/common';
import { AppModule } from '@app/app.module';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.get(SeedsService);
}

seed().catch((error) => {
  console.error('Error seeding database', error);
  process.exit(1);
});
