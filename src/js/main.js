import {
  getDropboxDirectLink,
  getGoogleDriveDirectLink,
} from './parse.js';

const DEFAULT_OUTPUT_LINK = 'https://github.com/solusmax/direct-linker';

const inputLink = new URL(new URL(window.location.href).searchParams.get('link'));

let outputLink = DEFAULT_OUTPUT_LINK;

const updateOutputLink = (link) => {
  if (link.hostname.endsWith('dropbox.com')) {
    outputLink = getDropboxDirectLink(link);
  } else if (link.hostname.endsWith('drive.google.com')) {
    outputLink = getGoogleDriveDirectLink(link);
  }
};

updateOutputLink(inputLink);

const goToLink = (link) => {
  window.location.replace(link);
};

goToLink(outputLink);

