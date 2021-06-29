// ==UserScript==
// @name         pr0gramm Tagscore
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Userscript for the image board pr0gramm to get scores of posts tags into frontend
// @author       PossumInABox
// @grant        none
// @include		 https://pr0gramm.com*
// @exclude      http://full.pr0gramm.com*
// @exclude		 https://full.pr0gramm.com*
// @downloadURL  https://possuminabox.github.io/pr0gramm-Tagscore/pr0gramm-tagscore.user.js
// @updateURL    https://possuminabox.github.io/pr0gramm-Tagscore/pr0gramm-tagscore.user.js
// ==/UserScript==

(function tagScoreUserScript() {
  console.debug("Loaded module: pr0gramm Tagscore")

  function getPostId() {
    let urlString = window.location.href;
    let urlList0 = urlString.split('/');
    let urlList1 = (urlList0[urlList0.length - 1]).split(':');
    let postNumber = urlList1[0]

    if (postNumber.match("[0-9]+")) {
      return postNumber
    } else {
      return false
    }
  }


  async function initTagScore() {

    let apiURL = ('https://pr0gramm.com/api/items/info?itemId=' + getPostId());
    if (!apiURL) {
      return;
    }

    let data = await fetch(apiURL, {
      method: 'GET',
      'headers': {}
    })
    data = await data.json();

    let tags = data.tags;

    let pageTags = document.querySelectorAll('.tags .tag');

    for (let k = 0; k < pageTags.length; k++) {

      let currentItem = pageTags[k];
      let nodeId = currentItem.id;


      for (let i = 0; i < tags.length; i++) {
        let currentTagMatch = 'tag-' + tags[i].id;
        if (currentTagMatch == nodeId) {
          let roundedConfidence = (tags[i].confidence * 100).toFixed(3);
          let tagClass = 'baseValue';
          if (roundedConfidence > 20.654) {
            tagClass = 'upvotedTag';
          } else if (roundedConfidence < 20.654) {
            tagClass = 'downvotedTag'
          }
          let confidenceString = (' | <span class="' + tagClass + '">' + roundedConfidence + ' %</span>');
          currentItem.querySelector("a").innerHTML += confidenceString;

          document.querySelectorAll(".baseValue").forEach(element => {
            element.style.color = "yellow"
          })
          document.querySelectorAll(".upvotedTag").forEach(element => {
            element.style.color = "green"
          })
          document.querySelectorAll(".downvotedTag").forEach(element => {
            element.style.color = "red"
          })
        }
      }
    }
  }

  var oldURL = "";
  var currentURL = window.location.href;

  function checkURLchange(currentURL) {
    if (currentURL != oldURL) {
      initTagScore();
      oldURL = currentURL;
    }

    oldURL = window.location.href;
    setTimeout(function() {
      checkURLchange(window.location.href);
    }, 500);
  }
  checkURLchange();

  // update on reload
  document.onreadystatechange = () => {
    initTagScore()
  }
})();
