  /**
    Pseudodo Polyfill for animatable content properties on psuedo elements
    in non-supporting browsers (eg. Safari)
    
    Automatically detects psuedo elements with animations attached.
    Load after StyleSheets have been computed.
    
    Written by Eric D'Addio March 2019 https://twitter.com/oldnewstandard
  */

  module.exports = (function () {
      document.addEventListener("DOMContentLoaded", function () {

          document.createStyleSheet = (function () {
              function createStyleSheet(href) {
                  if (typeof href !== "undefined") {
                      var element = document.createElement("link");
                      element.type = "text/css";
                      element.rel = "stylesheet";
                      element.href = href;
                  } else {
                      var element = document.createElement("style");
                      element.type = "text/css";
                  }
                  document.getElementsByTagName("head")[0].appendChild(element);
                  var sheet = document.styleSheets[document.styleSheets.length - 1];
                  sheet.addRule = addRule;
                  return sheet;
              }

              function addRule(selectorText, cssText, index) {
                  if (typeof index === "undefined") index = this.cssRules.length;

                  let rule = selectorText + " {" + cssText + "}";
                  this.insertRule(rule, index);
              }

              return createStyleSheet;
          })();

          const sheet = document.createStyleSheet();

          let id = 0;
          document.querySelectorAll("body *").forEach(el => {
              el.pseudodo = {
                  beforeid: "beforepseudodoElement-" + id++,
                  afterid: "afterpseudodoElement-" + id++,
                  before: {
                      computedStyle: getComputedStyle(el, ":before")
                  },
                  after: {
                      computedStyle: getComputedStyle(el, ":after")
                  }
              };

              el.classList.add(el.pseudodo.beforeid);
              el.classList.add(el.pseudodo.afterid);

              el.pseudodo.before = {
                  added: false,
                  animationName: el.pseudodo.before.computedStyle.animationName,
                  animationDurationMs: 1000 *
                      Number(
                          el.pseudodo.before.computedStyle.animationDuration.replace("s", "")
                      ),
                  frames: []
              };

              el.pseudodo.after = {
                  added: false,
                  animationName: el.pseudodo.after.computedStyle.animationName,
                  animationDurationMs: 1000 *
                      Number(
                          el.pseudodo.after.computedStyle.animationDuration.replace("s", "")
                      ),
                  frames: []
              };

              for (let stylesheet of document.styleSheets) {
                  ["before", "after"].forEach(focus => {

                      try {
                          for (let rule of stylesheet.cssRules) {
                              if (rule.type !== 7) continue;

                              let animationName = rule.cssText.split("\n")[0].split(" ")[1];
                              if (animationName !== el.pseudodo[focus].animationName) continue;

                              for (let keyframe of rule.cssRules) {

                                  if (!el.pseudodo[focus].added) {
                                      sheet.addRule(
                                          "." + el.pseudodo.beforeid + ":before",
                                          "content: attr(data-beforepseudodo) !important;"
                                      );
                                      sheet.addRule(
                                          "." + el.pseudodo.afterid + ":after",
                                          "content: attr(data-afterpseudodo) !important;"
                                      );
                                      el.pseudodo[focus].added = true;
                                  }


                                  el.pseudodo[focus].frames.push({
                                      ms: Number(keyframe.keyText.replace("%", "")),
                                      content: keyframe.style.getPropertyValue("content")
                                  });
                              }

                              el.pseudodo[focus].perform = () => {
                                  el.pseudodo[focus].frames.forEach(frame => {
                                      let delay =
                                          frame.ms / 100 * el.pseudodo[focus].animationDurationMs;
                                      setTimeout(() => {
                                          let virtualElement = document.createElement("span");
                                          virtualElement.dataset[focus + "pseudodo"] = frame.content;
                                          el.dataset[focus + "pseudodo"] = virtualElement.dataset[
                                              focus + "pseudodo"
                                          ].replace(/"/g, "");
                                      }, delay);
                                  });
                              }; // end of perform

                              el.pseudodo[focus].loop = () => {
                                  setTimeout(() => {
                                      el.pseudodo[focus].perform();
                                      el.pseudodo[focus].loop();
                                  }, el.pseudodo[focus].animationDurationMs);
                              }; // end of loop

                              el.pseudodo[focus].perform();
                              el.pseudodo[focus].loop();
                          } // end of for each rule
                      } catch (error) {
                          /* sssshhhhhHHH be quiet */
                      }
                  }); // end of focus
              } // end of for stylesheets
          }); // end of for each in element in main
      });
  })();