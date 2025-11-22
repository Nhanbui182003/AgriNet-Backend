export const getContentType = (path: string) => {
  // Get file extension
  const ext = path.split('.').pop()?.toLowerCase();

  // Map extensions to MIME types
  const mimeTypes = {
    // Images
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    avif: 'image/avif',
    svg: 'image/svg+xml',

    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

    // Media
    mp4: 'video/mp4',
    mpeg: 'video/mpeg',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
  };

  // Set Content-Type header based on file extension
  const contentType = ext && mimeTypes[ext] ? mimeTypes[ext] : 'application/octet-stream';

  return contentType;
};
