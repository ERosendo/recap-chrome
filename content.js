// This file is part of RECAP for Chrome.
// Copyright 2013 Ka-Ping Yee <ping@zesty.ca>
//
// RECAP for Chrome is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option)
// any later version.
// 
// RECAP for Chrome is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
// or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
// for more details.
// 
// You should have received a copy of the GNU General Public License along with
// RECAP for Chrome.  If not, see: http://www.gnu.org/licenses/

// -------------------------------------------------------------------------
// Content script to run when the DOM finishes loading (at "document_end").


// Scan the document for all the links and collect the URLs we care about.
var links = document.body.getElementsByTagName('a');
var urls = [];
for (var i = 0; i < links.length; i++) {
  if (links[i].href.match(/\/doc1\/\d+/)) {
    urls.push(links[i].href);
  }
}
if (urls.length) {
  // Ask the server whether any of these documents are available from RECAP.
  callBackgroundPage('queryUrls', urls, function (result) {
    // When we get a reply, update all the links that have documents available.
    for (var i = 0; i < links.length; i++) {
      if (links[i].href in result) {
        // Make a RECAP download button...
        var recapButton = document.createElement('img');
        recapButton.src = chrome.extension.getURL('recap-32x32.png');
        recapButton.style.marginBottom = '-2px';
        recapButton.style.paddingLeft = '4px';
        recapButton.style.width = '16px';
        recapButton.style.height = '16px';

        // ...link it to the free copy of the document from RECAP...
        var recapLink = document.createElement('a');
        recapLink.href = result[links[i].href].filename;
        recapLink.appendChild(recapButton);
        recapLink.title = 'Available for free from RECAP.';

        // ...and insert the button just after the original link.
        links[i].parentNode.insertBefore(recapLink, links[i].nextSibling);
      }
    }
  });
}
