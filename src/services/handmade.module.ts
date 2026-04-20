import { Module } from '@nestjs/common';

import { PrismaModule } from '@prisma';

import { HandMadeService } from './handmade.service';

@Module({
  imports: [PrismaModule],
  providers: [HandMadeService],
  exports: [HandMadeService],
})
export class HandmadeModule {}
