import Papa, { ParseConfig } from 'papaparse';

interface ParseCSVProps extends ParseConfig {
  file?: File;
  worker?: boolean | undefined;
  chunkSize?: number | undefined;
  encoding?: string | undefined;
}

export const parseCSV = ({ file, ...props }: ParseCSVProps) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject('no file');
    Papa.parse(file, {
      skipEmptyLines: true,
      error(err) {
        reject(`Parse error:${err?.message}`);
      },
      ...props,
      complete(result) {
        try {
          const list: string[] = [];
          const { data } = result;
          data?.map((line) => {
            if (line instanceof Array) {
              line.map((row) => {
                if (row) {
                  list.push(row);
                }
              });
            }
          });
          resolve(list);
          return list;
        } catch (e) {
          reject(`${e}`);
        }
      },
    });
  });
};
