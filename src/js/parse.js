
export const getDropboxDirectLink = (link) => `https://dl.dropboxusercontent.com/s/${link.pathname.replace(/^\/s\//, '')}`;

export const getGoogleDriveDirectLink = (link) => `https://drive.google.com/uc?id=${link.pathname.replace(/^\/file\/d\//, '').replace(/\/view$/, '')}`;
