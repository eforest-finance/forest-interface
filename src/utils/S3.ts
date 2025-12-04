import S3 from 'aws-sdk/clients/s3';

export interface IAWSConfig {
  Bucket: string;
  Key?: string;
  Body?: File | null;
  ACL: string;
}

export type UploadFileType = {
  url: string;
  hash: string;
};

class AWSManager {
  private static instance: AWSManager | null = null;
  private bucket = 'forest-dev';
  private acl = 'public-read';
  private uploadBaseConfig: Required<IAWSConfig> = {
    Bucket: this.bucket,
    Key: '',
    Body: null,
    ACL: this.acl,
  };

  constructor(options?: IAWSConfig) {
    this.uploadBaseConfig = Object.assign(this.uploadBaseConfig, options);
  }
  static get() {
    if (!AWSManager.instance) {
      AWSManager.instance = new AWSManager();
    }
    return AWSManager.instance;
  }

  async uploadFile(file: File): Promise<UploadFileType> {
    const upload = new S3.ManagedUpload({
      params: {
        ...this.uploadBaseConfig,
        Key: `${Date.now()}-${file.name}`,
        Body: file,
        ContentType: file.type,
        ContentLength: file.size,
      },
    });
    try {
      const res = await upload.promise();
      return {
        url: res?.Location || '',
        hash: res?.ETag ? res.ETag.replaceAll('"', '') : '',
      };
    } catch (error) {
      console.error('=====uploadFile error:', error);
      return Promise.reject(null);
    }
  }

  updateConfigOfBucket(bucket?: string) {
    if (!bucket) return;
    this.uploadBaseConfig.Bucket = bucket;
  }
}

export default AWSManager.get();
