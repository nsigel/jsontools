// Credits to user123444555621
if (!formatterLib)
   var formatterLib = {};

formatterLib.json = {
   replacer: function(match, pIndent, pKey, pVal, pEnd) {
      var key = '<span class=json-key>';
      var val = '<span class=json-value>';
      var str = '<span class=json-string>';
      var r = pIndent || '';
      if (pKey)
         r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
      if (pVal)
         r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
      return r + (pEnd || '');
      },
   prettyPrint: function(obj) {
      var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
      return JSON.stringify(obj, null, 3)
         .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
         .replace(/</g, '&lt;').replace(/>/g, '&gt;')
         .replace(jsonLine, formatterLib.json.replacer);
      }
};
//

function injectCss(filename) {
  var link = document.createElement("link");
  link.href = chrome.extension.getURL(filename);
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

function prettifyBodyPre(bodyPre = document.querySelector("body > pre")) {
  bodyPre.innerHTML = formatterLib.json.prettyPrint(JSON.parse(bodyPre.textContent))

  injectCss("defaultTheme.css");
}

(function checkContentType() {
  try {
    var bodyPre = document.querySelector("body > pre");
    if (
      document.contentType == "application/json" ||
      (bodyPre &&
        bodyPre.textContent[0] == "{" &&
        bodyPre.textContent[bodyPre.textContent.length - 1] == "}")
    ) {
      bodyPre ? prettifyBodyPre(bodyPre) : prettifyBodyPre();
    }
  } catch (err) {
    console.log("Oops! Something didn't want me to prettify this page!");
    console.log(err);
  }
})();
