import {
  getDropboxDirectLink,
  getDropbox2DirectLink,
  getGoogleDriveDirectLink,
  hasRightHostname,
  isCorrectDropboxLink,
  isCorrectDropbox2Link,
  isCorrectGoogleDriveLink,
} from './parse.js';

const outputLinkNode = document.querySelector('.output__link');

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
  // Dropbox (/s/)
  if (hasRightHostname(link, 'dropbox.com') && isCorrectDropboxLink(link)) {
    outputLink = getDropboxDirectLink(link);
  }

  // Dropbox (/scl/fi/)
  if (hasRightHostname(link, 'dropbox.com') && isCorrectDropbox2Link(link)) {
    outputLink = getDropbox2DirectLink(link);
  }

  // Google Drive
  if (hasRightHostname(link, 'drive.google.com') && isCorrectGoogleDriveLink(link)) {
    outputLink = getGoogleDriveDirectLink(link);
  }
};

updateOutputLink(inputLink);

const renderOutputLink = (link) => {
  outputLinkNode.textContent = link;
  outputLinkNode.href = link;
};

const goToLink = (link) => {
  window.location.replace(link);
};

renderOutputLink(outputLink);

goToLink(outputLink);
