import fs from "fs";
import glob from "glob";
import { Options as AcornOptions } from "acorn";
import * as acorn from "acorn";

/* UTILS */

const globAsync = (pattern: string): Promise<string[]> =>
  new Promise((resolve, reject) => {
    glob(pattern, (err, matches) => {
      if (err) {
        reject(err);
      } else {
        resolve(matches);
      }
    });
  });

const readFile = (path: string) =>
  new Promise<string>((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

/* MAIN */

export interface ParseError extends Error {
  pos: number;
  loc: { line: number; column: number };
  raisedAt: number;
}

export type ParseObject = {
  error: ParseError;
  file: string;
};

export type Options = {
  glob: string;
  mode?: AcornOptions["ecmaVersion"];
} & Partial<Pick<AcornOptions, "allowHashBang">>;

export async function escheck({
  glob: pattern,
  allowHashBang,
  mode = 5,
}: Options): Promise<ParseObject[]> {
  const files = await globAsync(pattern);
  let errors: ParseObject[] = [];
  await Promise.all(
    files.map(async (file) => {
      const code = await readFile(file);
      try {
        acorn.parse(code, {
          ecmaVersion: mode,
          allowHashBang,
        });
      } catch (error: any) {
        const errorObj = {
          error,
          file,
        };
        errors.push(errorObj);
      }
    })
  );
  return errors;
}
