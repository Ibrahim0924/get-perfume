import { getDetails, localPhoto, photoFillsFrame } from '@/entities/fragrance';
import { uploadedPhoto, useUploadedPhoto } from './uploadedPhotos';

export interface PhotoSources {
  /** Candidate URLs in order: uploaded photo, our copy, then the remote reference ones. */
  sources: (string | null | undefined)[];
  /** Fill the frame edge to edge (studio shot with its own backdrop); uploaded photos sit on the plate. */
  fills: boolean;
}

function resolve(fragranceId: string, uploaded: string | null): PhotoSources {
  const d = getDetails(fragranceId);
  return {
    sources: [uploaded, localPhoto(fragranceId), d?.image, d?.imageFallback, d?.imageTransparent],
    fills: !uploaded && photoFillsFrame(fragranceId),
  };
}

/** Where a fragrance's photo comes from; an uploaded photo, once loaded, takes over everywhere. */
export function usePhotoSources(fragranceId: string): PhotoSources {
  return resolve(fragranceId, useUploadedPhoto(fragranceId));
}

/** Same, outside React. */
export const photoSources = (fragranceId: string): PhotoSources => resolve(fragranceId, uploadedPhoto(fragranceId));
