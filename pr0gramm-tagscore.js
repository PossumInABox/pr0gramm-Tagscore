// ==UserScript==
// @name         pr0gramm Tagscore
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Userscript for the image board pr0gramm to get scores of posts tags into frontend
// @author       PossumInAbox
// @match        https://pr0gramm.com/
// @grant        none
// @downloadURL https://possuminabox.github.io/pr0gramm-Tagscore/pr0gramm-tagscore.js
// @updateURL https://possuminabox.github.io/pr0gramm-Tagscore/pr0gramm-tagscore.js
// ==/UserScript==

var $ = window.jQuery;

function getPostId() {
    let urlString = window.location.href;
    let urlList0 = urlString.split('/');
    let urlList1 = (urlList0[urlList0.length - 1]).split(':');
    return urlList1[0];
}

(function() {

    document.onreadystatechange = function() {


        let apiURL = ('https://pr0gramm.com/api/items/info?itemId=' + getPostId());


        $.get(apiURL, function(data) {
            let general0 = data;
            //console.log(data);
            //var general = JSON.parse(data);
            let tags = data.tags;
            //console.log(tags);

            let pageTags = $('.tags .tag');

            for (var k = 0; k < pageTags.length; k++) {

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
                        $(('#'+nodeId+' a')).append(confidenceString);

                        // setting css
                        $(".baseValue").css('color', 'yellow');
                        $(".upvotedTag").css('color', 'green');
                        $(".downvotedTag").css('color', 'red');

                    }
                }
            }

        });

    }



})();