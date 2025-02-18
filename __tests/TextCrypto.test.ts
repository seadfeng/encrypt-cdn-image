import { appConfig } from '@/config';
import { TextCrypto } from '@/lib/textCrypto';

describe('TextCrypto', () => {
  let crypto: TextCrypto;

  beforeEach(() => {
    crypto = new TextCrypto();
  });

  it('encrypt, decrypt: abc', async () => {
    const msg = await crypto.encrypt("abc", appConfig.cryptoPassword);
    const cn = await crypto.encrypt("你好", appConfig.cryptoPassword);
    const abc = await crypto.decrypt(msg, appConfig.cryptoPassword);
    const cnde = await crypto.decrypt(cn, appConfig.cryptoPassword);
    expect(abc).toEqual("abc");
    expect(cnde).toEqual("你好");
  });

});
