// Credits to user123444555621
if (!formatterLib) var formatterLib = {};

formatterLib.json = {
  replacer: function (match, pIndent, pKey, pVal, pEnd) {
    var key = "<span class=json-key>";
    var val = "<span class=json-value>";
    var str = "<span class=json-string>";
    var r = pIndent || "";
    if (pKey) r = r + key + pKey.replace(/[": ]/g, "") + "</span>: ";
    if (pVal) r = r + (pVal[0] == '"' ? str : val) + pVal + "</span>";
    return r + (pEnd || "");
  },
  prettyPrint: function (obj) {
    var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/gm;
    return JSON.stringify(obj, null, 3)
      .replace(/&/g, "&amp;")
      .replace(/\\"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(jsonLine, formatterLib.json.replacer);
  },
  defaults: {
    "json-key": "#659fe6",
    "json-string": "#8ecb68",
    "json-value": "#e49763",
    foreground: "#1b1b27",
    background: "#16161e",
    other:"#7D7D7D"
  },
};



function injectCss(filename) {
  
  var root = document.documentElement;

  Object.entries(formatterLib.json.defaults).forEach((entry) => {
    var [key, value] = entry, set;

    chrome.storage.sync.get([key], function (result) {
      if (!result[key]) {
        chrome.storage.sync.set(
          { [key]: value },
          () => {}
        );

        set = value
      } else {
        set = result[key] 
      }

      root.style.setProperty("--" + key, set);

    });
  });

  var link = document.createElement("link");
  link.href = chrome.extension.getURL(filename);
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

function prettifyBodyPre(bodyPre = document.querySelector("body > pre")) {
  bodyPre.innerHTML = formatterLib.json.prettyPrint(
    JSON.parse(bodyPre.textContent)
  );

  injectCss("theme.css");
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
