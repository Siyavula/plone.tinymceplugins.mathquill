tinyMCEPopup.requireLangPack();

var latexMath = $('#editable-math'), latexSource = $('#latex-source');

$(function() {
  latexMath.bind('keydown keypress', function() {
    setTimeout(function() {
      var latex = latexMath.mathquill('latex');
      latexSource.val(latex);
//      location.hash = '#'+latex; //extremely performance-crippling in Chrome for some reason
    });
  }).keydown().focus();

  latexSource.bind('keydown keypress', function() {
    var oldtext = latexSource.val();
    setTimeout(function() {
      var newtext = latexSource.val();
      if(newtext !== oldtext) {
        latexMath.mathquill('latex', newtext);
      }
    });
  });

  if(location.hash && location.hash.length > 1)
    latexMath.mathquill('latex', decodeURIComponent(location.hash.slice(1))).focus();
});

function insertMath() {
    val = $('#editable-math').html()
    alert(val);
    tinyMCEPopup.restoreSelection();
    // Insert the contents from the input into the document
    tinyMCEPopup.editor.execCommand('mceInsertMath', val);
    tinyMCEPopup.close();
};


function initPopup() {
    var inputText = document.getElementById("latex-source");
    inputText.focus();
    inputText.value = tinyMCEPopup.getWindowArg('latex');
}

tinyMCEPopup.onInit.add(initPopup);

