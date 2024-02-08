import { PICTURE_FORMAT } from '@app/common/config/picture-options.config';

export const UploadOptionsConfig: object = {
  return_delete_token: true,
  resource_type: 'image',
  allowed_formats: PICTURE_FORMAT,
};
