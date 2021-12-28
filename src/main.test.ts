import { escheck } from "./main";

describe(`escheck`, () => {
  it(`Passes on ok file`, async () => {
    const result = await escheck({ glob: "./test_files/ok.js" });
    expect(result.length).toBeFalsy();
  });
  it(`Fails on const file`, async () => {
    const result = await escheck({ glob: "./test_files/const.js" });
    expect(result.length).toBeTruthy();
  });
  it(`Fails on arrow file`, async () => {
    const result = await escheck({ glob: "./test_files/arrow.js" });
    expect(result.length).toBeTruthy();
  });
});
