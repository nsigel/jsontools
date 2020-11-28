function injectCss(filename) {
  var link = document.createElement("link");
  link.href = chrome.extension.getURL(filename);
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

function prettifyBody(bodyPre = document.querySelector("body > pre")) {
    
  // Parses the text from <pre> and replaces it
  bodyPre.textContent = JSON.stringify(
    JSON.parse(bodyPre.textContent),
    undefined,
    2
  );

  // Injects Theme
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
      bodyPre ? prettifyBody(bodyPre) : prettifyBody();
    }
  } catch (err) {
    console.log("Oops! Something didn't want me to prettify this page!");
    console.log(err);
  }
})();
