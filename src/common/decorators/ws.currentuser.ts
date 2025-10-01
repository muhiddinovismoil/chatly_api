import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const WSCurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const client = context.switchToWs().getClient();
    return client.user;
  },
);
