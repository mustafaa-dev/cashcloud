import { Test, TestingModule } from '@nestjs/testing';
import { DController } from './d.controller';

describe('DController', () => {
  let controller: DController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DController],
    }).compile();

    controller = module.get<DController>(DController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
