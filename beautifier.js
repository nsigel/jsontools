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
