export const hasRightHostname = (link, hostname) => link.hostname.endsWith(hostname);

// Dropbox

export const isCorrectDropboxLink = (link) => link.pathname.startsWith('/s/') && link.pathname.match(/^\/s\/.+\/.+/) !== null;

export const getDropboxDirectLink = (link) => `https://dl.dropboxusercontent.com/s/${link.pathname.replace(/^\/s\//, '')}`;

// Google Drive

export const isCorrectGoogleDriveLink = (link) => link.pathname.startsWith('/file/d/') && link.pathname.match(/^\/file\/d\/.+/) !== null;

export const getGoogleDriveDirectLink = (link) => `https://drive.google.com/uc?id=${link.pathname.replace(/^\/file\/d\//, '').replace(/\/.*/, '')}`;
