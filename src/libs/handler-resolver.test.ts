import { handlerPath } from "./handler-resolver";

describe('handlerPath function', () => {
  it('returns a Unix-style relative path', () => {
    const absolutePath = `${process.cwd()}/src/functions/myFunction.ts`;
    const relativePath = handlerPath(absolutePath);
    expect(relativePath).toEqual('src/functions/myFunction.ts');
  });
});
