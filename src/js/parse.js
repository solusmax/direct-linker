export const hasRightHostname = (link, hostname) => link.hostname.endsWith(hostname);


// Dropbox (/s/)

export const isCorrectDropboxLink = (link) => link.pathname.startsWith('/s/') && link.pathname.match(/^\/s\/.+\/.+/) !== null;

export const getDropboxDirectLink = (link) => `https://dl.dropboxusercontent.com/s/${link.pathname.replace(/^\/s\//, '')}`;


// Dropbox (/scl/fi/)

export const isCorrectDropbox2Link = (link) => link.pathname.startsWith('/scl/fi/') && link.pathname.match(/^\/scl\/fi\/.+\/.+/) !== null && link.searchParams.has('rlkey');

export const getDropbox2DirectLink = (link) => `https://dl.dropboxusercontent.com/scl/fi/${link.pathname.replace(/^\/scl\/fi\//, '')}?rlkey=${link.searchParams.get('rlkey')}`;


// Google Drive

export const isCorrectGoogleDriveLink = (link) => link.pathname.startsWith('/file/d/') && link.pathname.match(/^\/file\/d\/.+/) !== null;

export const getGoogleDriveDirectLink = (link) => `https://drive.google.com/uc?id=${link.pathname.replace(/^\/file\/d\//, '').replace(/\/.*/, '')}`;
