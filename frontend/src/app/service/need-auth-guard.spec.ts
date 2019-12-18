import {NeedAuthGuard} from './need-auth-guard';

describe('NeedAuthGuard', () => {
  it('should create an instance', () => {
    expect(new NeedAuthGuard()).toBeTruthy();
  });
});
