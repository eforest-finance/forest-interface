import Papa from 'papaparse';

export const csvToArray = (file: any): Promise<Array<string>> => {
  return new Promise((resolve) => {
    const fReader = new FileReader();
    fReader.readAsDataURL(file);
    fReader.onload = function () {
      Papa.parse(file, {
        complete: function (results) {
          const res = results.data as unknown as string[];
          const lastItem = res[res.length - 1] as unknown as Array<string>;
          if (!lastItem[0]) {
            res.pop();
          }
          resolve(res);
        },
      });
    };
  });
};

export const getTheFirstFrame = (file: any, onSuccess?: (src: string) => void): Promise<string> => {
  return new Promise((resolve) => {
    const fReader = new FileReader();

    fReader.readAsArrayBuffer(file);

    fReader.onload = function (e) {
      const videoResult = e.target?.result as string;
      const url = URL.createObjectURL(new Blob([videoResult]));

      const videoElement = document.createElement('video');
      videoElement.src = url;
      videoElement.muted = true;
      videoElement.currentTime = (1 / 60) * 2;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', {
        willReadFrequently: true,
      });

      videoElement.oncanplay = () => {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        ctx!.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        const imageDataURL = canvas.toDataURL('image/png');

        onSuccess && onSuccess(imageDataURL);
        resolve(imageDataURL);
      };

      videoElement.load();
    };
  });
};

export const getBase64 = (file: Blob, callback?: Function): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      resolve(reader.result as string);
      callback && callback(reader.result);
    });
    reader.readAsDataURL(file);
  });
};
