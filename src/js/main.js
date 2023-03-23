import {
  getDropboxDirectLink,
  getGoogleDriveDirectLink,
  hasRightHostname,
  isCorrectDropboxLink,
  isCorrectGoogleDriveLink,
} from './parse.js';

const DEFAULT_OUTPUT_LINK = 'https://github.com/solusmax/direct-linker';

let outputLink = DEFAULT_OUTPUT_LINK;

const currentLink = new URL(window.location.href);

let inputLink;

try {
  inputLink = new URL(currentLink.searchParams.get('link'));
} catch (err) {
  inputLink = currentLink;
}

const updateOutputLink = (link) => {
  if (hasRightHostname(link, 'dropbox.com') && isCorrectDropboxLink(link)) {
    outputLink = getDropboxDirectLink(link);
  }

  if (hasRightHostname(link, 'drive.google.com') && isCorrectGoogleDriveLink(link)) {
    outputLink = getGoogleDriveDirectLink(link);
  }
};

updateOutputLink(inputLink);

const goToLink = (link) => {
  window.location.replace(link);
};

goToLink(outputLink);

