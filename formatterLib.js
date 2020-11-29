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