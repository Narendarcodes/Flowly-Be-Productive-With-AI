var S = { exports: {} }, q = S.exports, F;
function W() {
  return F || (F = 1, (function(m, o) {
    (function(l, f) {
      f(m);
    })(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : q, function(l) {
      if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id))
        throw new Error("This script should only be loaded in a browser extension.");
      if (globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)
        l.exports = globalThis.browser;
      else {
        const f = "The message port closed before a response was received.", b = (a) => {
          const h = {
            alarms: {
              clear: {
                minArgs: 0,
                maxArgs: 1
              },
              clearAll: {
                minArgs: 0,
                maxArgs: 0
              },
              get: {
                minArgs: 0,
                maxArgs: 1
              },
              getAll: {
                minArgs: 0,
                maxArgs: 0
              }
            },
            bookmarks: {
              create: {
                minArgs: 1,
                maxArgs: 1
              },
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              getChildren: {
                minArgs: 1,
                maxArgs: 1
              },
              getRecent: {
                minArgs: 1,
                maxArgs: 1
              },
              getSubTree: {
                minArgs: 1,
                maxArgs: 1
              },
              getTree: {
                minArgs: 0,
                maxArgs: 0
              },
              move: {
                minArgs: 2,
                maxArgs: 2
              },
              remove: {
                minArgs: 1,
                maxArgs: 1
              },
              removeTree: {
                minArgs: 1,
                maxArgs: 1
              },
              search: {
                minArgs: 1,
                maxArgs: 1
              },
              update: {
                minArgs: 2,
                maxArgs: 2
              }
            },
            browserAction: {
              disable: {
                minArgs: 0,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              enable: {
                minArgs: 0,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              getBadgeBackgroundColor: {
                minArgs: 1,
                maxArgs: 1
              },
              getBadgeText: {
                minArgs: 1,
                maxArgs: 1
              },
              getPopup: {
                minArgs: 1,
                maxArgs: 1
              },
              getTitle: {
                minArgs: 1,
                maxArgs: 1
              },
              openPopup: {
                minArgs: 0,
                maxArgs: 0
              },
              setBadgeBackgroundColor: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              setBadgeText: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              setIcon: {
                minArgs: 1,
                maxArgs: 1
              },
              setPopup: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              setTitle: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              }
            },
            browsingData: {
              remove: {
                minArgs: 2,
                maxArgs: 2
              },
              removeCache: {
                minArgs: 1,
                maxArgs: 1
              },
              removeCookies: {
                minArgs: 1,
                maxArgs: 1
              },
              removeDownloads: {
                minArgs: 1,
                maxArgs: 1
              },
              removeFormData: {
                minArgs: 1,
                maxArgs: 1
              },
              removeHistory: {
                minArgs: 1,
                maxArgs: 1
              },
              removeLocalStorage: {
                minArgs: 1,
                maxArgs: 1
              },
              removePasswords: {
                minArgs: 1,
                maxArgs: 1
              },
              removePluginData: {
                minArgs: 1,
                maxArgs: 1
              },
              settings: {
                minArgs: 0,
                maxArgs: 0
              }
            },
            commands: {
              getAll: {
                minArgs: 0,
                maxArgs: 0
              }
            },
            contextMenus: {
              remove: {
                minArgs: 1,
                maxArgs: 1
              },
              removeAll: {
                minArgs: 0,
                maxArgs: 0
              },
              update: {
                minArgs: 2,
                maxArgs: 2
              }
            },
            cookies: {
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              getAll: {
                minArgs: 1,
                maxArgs: 1
              },
              getAllCookieStores: {
                minArgs: 0,
                maxArgs: 0
              },
              remove: {
                minArgs: 1,
                maxArgs: 1
              },
              set: {
                minArgs: 1,
                maxArgs: 1
              }
            },
            devtools: {
              inspectedWindow: {
                eval: {
                  minArgs: 1,
                  maxArgs: 2,
                  singleCallbackArg: !1
                }
              },
              panels: {
                create: {
                  minArgs: 3,
                  maxArgs: 3,
                  singleCallbackArg: !0
                },
                elements: {
                  createSidebarPane: {
                    minArgs: 1,
                    maxArgs: 1
                  }
                }
              }
            },
            downloads: {
              cancel: {
                minArgs: 1,
                maxArgs: 1
              },
              download: {
                minArgs: 1,
                maxArgs: 1
              },
              erase: {
                minArgs: 1,
                maxArgs: 1
              },
              getFileIcon: {
                minArgs: 1,
                maxArgs: 2
              },
              open: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              pause: {
                minArgs: 1,
                maxArgs: 1
              },
              removeFile: {
                minArgs: 1,
                maxArgs: 1
              },
              resume: {
                minArgs: 1,
                maxArgs: 1
              },
              search: {
                minArgs: 1,
                maxArgs: 1
              },
              show: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              }
            },
            extension: {
              isAllowedFileSchemeAccess: {
                minArgs: 0,
                maxArgs: 0
              },
              isAllowedIncognitoAccess: {
                minArgs: 0,
                maxArgs: 0
              }
            },
            history: {
              addUrl: {
                minArgs: 1,
                maxArgs: 1
              },
              deleteAll: {
                minArgs: 0,
                maxArgs: 0
              },
              deleteRange: {
                minArgs: 1,
                maxArgs: 1
              },
              deleteUrl: {
                minArgs: 1,
                maxArgs: 1
              },
              getVisits: {
                minArgs: 1,
                maxArgs: 1
              },
              search: {
                minArgs: 1,
                maxArgs: 1
              }
            },
            i18n: {
              detectLanguage: {
                minArgs: 1,
                maxArgs: 1
              },
              getAcceptLanguages: {
                minArgs: 0,
                maxArgs: 0
              }
            },
            identity: {
              launchWebAuthFlow: {
                minArgs: 1,
                maxArgs: 1
              }
            },
            idle: {
              queryState: {
                minArgs: 1,
                maxArgs: 1
              }
            },
            management: {
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              getAll: {
                minArgs: 0,
                maxArgs: 0
              },
              getSelf: {
                minArgs: 0,
                maxArgs: 0
              },
              setEnabled: {
                minArgs: 2,
                maxArgs: 2
              },
              uninstallSelf: {
                minArgs: 0,
                maxArgs: 1
              }
            },
            notifications: {
              clear: {
                minArgs: 1,
                maxArgs: 1
              },
              create: {
                minArgs: 1,
                maxArgs: 2
              },
              getAll: {
                minArgs: 0,
                maxArgs: 0
              },
              getPermissionLevel: {
                minArgs: 0,
                maxArgs: 0
              },
              update: {
                minArgs: 2,
                maxArgs: 2
              }
            },
            pageAction: {
              getPopup: {
                minArgs: 1,
                maxArgs: 1
              },
              getTitle: {
                minArgs: 1,
                maxArgs: 1
              },
              hide: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              setIcon: {
                minArgs: 1,
                maxArgs: 1
              },
              setPopup: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              setTitle: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              },
              show: {
                minArgs: 1,
                maxArgs: 1,
                fallbackToNoCallback: !0
              }
            },
            permissions: {
              contains: {
                minArgs: 1,
                maxArgs: 1
              },
              getAll: {
                minArgs: 0,
                maxArgs: 0
              },
              remove: {
                minArgs: 1,
                maxArgs: 1
              },
              request: {
                minArgs: 1,
                maxArgs: 1
              }
            },
            runtime: {
              getBackgroundPage: {
                minArgs: 0,
                maxArgs: 0
              },
              getPlatformInfo: {
                minArgs: 0,
                maxArgs: 0
              },
              openOptionsPage: {
                minArgs: 0,
                maxArgs: 0
              },
              requestUpdateCheck: {
                minArgs: 0,
                maxArgs: 0
              },
              sendMessage: {
                minArgs: 1,
                maxArgs: 3
              },
              sendNativeMessage: {
                minArgs: 2,
                maxArgs: 2
              },
              setUninstallURL: {
                minArgs: 1,
                maxArgs: 1
              }
            },
            sessions: {
              getDevices: {
                minArgs: 0,
                maxArgs: 1
              },
              getRecentlyClosed: {
                minArgs: 0,
                maxArgs: 1
              },
              restore: {
                minArgs: 0,
                maxArgs: 1
              }
            },
            storage: {
              local: {
                clear: {
                  minArgs: 0,
                  maxArgs: 0
                },
                get: {
                  minArgs: 0,
                  maxArgs: 1
                },
                getBytesInUse: {
                  minArgs: 0,
                  maxArgs: 1
                },
                remove: {
                  minArgs: 1,
                  maxArgs: 1
                },
                set: {
                  minArgs: 1,
                  maxArgs: 1
                }
              },
              managed: {
                get: {
                  minArgs: 0,
                  maxArgs: 1
                },
                getBytesInUse: {
                  minArgs: 0,
                  maxArgs: 1
                }
              },
              sync: {
                clear: {
                  minArgs: 0,
                  maxArgs: 0
                },
                get: {
                  minArgs: 0,
                  maxArgs: 1
                },
                getBytesInUse: {
                  minArgs: 0,
                  maxArgs: 1
                },
                remove: {
                  minArgs: 1,
                  maxArgs: 1
                },
                set: {
                  minArgs: 1,
                  maxArgs: 1
                }
              }
            },
            tabs: {
              captureVisibleTab: {
                minArgs: 0,
                maxArgs: 2
              },
              create: {
                minArgs: 1,
                maxArgs: 1
              },
              detectLanguage: {
                minArgs: 0,
                maxArgs: 1
              },
              discard: {
                minArgs: 0,
                maxArgs: 1
              },
              duplicate: {
                minArgs: 1,
                maxArgs: 1
              },
              executeScript: {
                minArgs: 1,
                maxArgs: 2
              },
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              getCurrent: {
                minArgs: 0,
                maxArgs: 0
              },
              getZoom: {
                minArgs: 0,
                maxArgs: 1
              },
              getZoomSettings: {
                minArgs: 0,
                maxArgs: 1
              },
              goBack: {
                minArgs: 0,
                maxArgs: 1
              },
              goForward: {
                minArgs: 0,
                maxArgs: 1
              },
              highlight: {
                minArgs: 1,
                maxArgs: 1
              },
              insertCSS: {
                minArgs: 1,
                maxArgs: 2
              },
              move: {
                minArgs: 2,
                maxArgs: 2
              },
              query: {
                minArgs: 1,
                maxArgs: 1
              },
              reload: {
                minArgs: 0,
                maxArgs: 2
              },
              remove: {
                minArgs: 1,
                maxArgs: 1
              },
              removeCSS: {
                minArgs: 1,
                maxArgs: 2
              },
              sendMessage: {
                minArgs: 2,
                maxArgs: 3
              },
              setZoom: {
                minArgs: 1,
                maxArgs: 2
              },
              setZoomSettings: {
                minArgs: 1,
                maxArgs: 2
              },
              update: {
                minArgs: 1,
                maxArgs: 2
              }
            },
            topSites: {
              get: {
                minArgs: 0,
                maxArgs: 0
              }
            },
            webNavigation: {
              getAllFrames: {
                minArgs: 1,
                maxArgs: 1
              },
              getFrame: {
                minArgs: 1,
                maxArgs: 1
              }
            },
            webRequest: {
              handlerBehaviorChanged: {
                minArgs: 0,
                maxArgs: 0
              }
            },
            windows: {
              create: {
                minArgs: 0,
                maxArgs: 1
              },
              get: {
                minArgs: 1,
                maxArgs: 2
              },
              getAll: {
                minArgs: 0,
                maxArgs: 1
              },
              getCurrent: {
                minArgs: 0,
                maxArgs: 1
              },
              getLastFocused: {
                minArgs: 0,
                maxArgs: 1
              },
              remove: {
                minArgs: 1,
                maxArgs: 1
              },
              update: {
                minArgs: 2,
                maxArgs: 2
              }
            }
          };
          if (Object.keys(h).length === 0)
            throw new Error("api-metadata.json has not been included in browser-polyfill");
          class P extends WeakMap {
            constructor(s, n = void 0) {
              super(n), this.createItem = s;
            }
            get(s) {
              return this.has(s) || this.set(s, this.createItem(s)), super.get(s);
            }
          }
          const O = (e) => e && typeof e == "object" && typeof e.then == "function", M = (e, s) => (...n) => {
            a.runtime.lastError ? e.reject(new Error(a.runtime.lastError.message)) : s.singleCallbackArg || n.length <= 1 && s.singleCallbackArg !== !1 ? e.resolve(n[0]) : e.resolve(n);
          }, y = (e) => e == 1 ? "argument" : "arguments", $ = (e, s) => function(t, ...i) {
            if (i.length < s.minArgs)
              throw new Error(`Expected at least ${s.minArgs} ${y(s.minArgs)} for ${e}(), got ${i.length}`);
            if (i.length > s.maxArgs)
              throw new Error(`Expected at most ${s.maxArgs} ${y(s.maxArgs)} for ${e}(), got ${i.length}`);
            return new Promise((A, c) => {
              if (s.fallbackToNoCallback)
                try {
                  t[e](...i, M({
                    resolve: A,
                    reject: c
                  }, s));
                } catch (r) {
                  console.warn(`${e} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, r), t[e](...i), s.fallbackToNoCallback = !1, s.noCallback = !0, A();
                }
              else s.noCallback ? (t[e](...i), A()) : t[e](...i, M({
                resolve: A,
                reject: c
              }, s));
            });
          }, N = (e, s, n) => new Proxy(s, {
            apply(t, i, A) {
              return n.call(i, e, ...A);
            }
          });
          let k = Function.call.bind(Object.prototype.hasOwnProperty);
          const v = (e, s = {}, n = {}) => {
            let t = /* @__PURE__ */ Object.create(null), i = {
              has(c, r) {
                return r in e || r in t;
              },
              get(c, r, x) {
                if (r in t)
                  return t[r];
                if (!(r in e))
                  return;
                let g = e[r];
                if (typeof g == "function")
                  if (typeof s[r] == "function")
                    g = N(e, e[r], s[r]);
                  else if (k(n, r)) {
                    let w = $(r, n[r]);
                    g = N(e, e[r], w);
                  } else
                    g = g.bind(e);
                else if (typeof g == "object" && g !== null && (k(s, r) || k(n, r)))
                  g = v(g, s[r], n[r]);
                else if (k(n, "*"))
                  g = v(g, s[r], n["*"]);
                else
                  return Object.defineProperty(t, r, {
                    configurable: !0,
                    enumerable: !0,
                    get() {
                      return e[r];
                    },
                    set(w) {
                      e[r] = w;
                    }
                  }), g;
                return t[r] = g, g;
              },
              set(c, r, x, g) {
                return r in t ? t[r] = x : e[r] = x, !0;
              },
              defineProperty(c, r, x) {
                return Reflect.defineProperty(t, r, x);
              },
              deleteProperty(c, r) {
                return Reflect.deleteProperty(t, r);
              }
            }, A = Object.create(e);
            return new Proxy(A, i);
          }, T = (e) => ({
            addListener(s, n, ...t) {
              s.addListener(e.get(n), ...t);
            },
            hasListener(s, n) {
              return s.hasListener(e.get(n));
            },
            removeListener(s, n) {
              s.removeListener(e.get(n));
            }
          }), L = new P((e) => typeof e != "function" ? e : function(n) {
            const t = v(n, {}, {
              getContent: {
                minArgs: 0,
                maxArgs: 0
              }
            });
            e(t);
          }), I = new P((e) => typeof e != "function" ? e : function(n, t, i) {
            let A = !1, c, r = new Promise((p) => {
              c = function(d) {
                A = !0, p(d);
              };
            }), x;
            try {
              x = e(n, t, c);
            } catch (p) {
              x = Promise.reject(p);
            }
            const g = x !== !0 && O(x);
            if (x !== !0 && !g && !A)
              return !1;
            const w = (p) => {
              p.then((d) => {
                i(d);
              }, (d) => {
                let E;
                d && (d instanceof Error || typeof d.message == "string") ? E = d.message : E = "An unexpected error occurred", i({
                  __mozWebExtensionPolyfillReject__: !0,
                  message: E
                });
              }).catch((d) => {
                console.error("Failed to send onMessage rejected reply", d);
              });
            };
            return w(g ? x : r), !0;
          }), j = ({
            reject: e,
            resolve: s
          }, n) => {
            a.runtime.lastError ? a.runtime.lastError.message === f ? s() : e(new Error(a.runtime.lastError.message)) : n && n.__mozWebExtensionPolyfillReject__ ? e(new Error(n.message)) : s(n);
          }, R = (e, s, n, ...t) => {
            if (t.length < s.minArgs)
              throw new Error(`Expected at least ${s.minArgs} ${y(s.minArgs)} for ${e}(), got ${t.length}`);
            if (t.length > s.maxArgs)
              throw new Error(`Expected at most ${s.maxArgs} ${y(s.maxArgs)} for ${e}(), got ${t.length}`);
            return new Promise((i, A) => {
              const c = j.bind(null, {
                resolve: i,
                reject: A
              });
              t.push(c), n.sendMessage(...t);
            });
          }, B = {
            devtools: {
              network: {
                onRequestFinished: T(L)
              }
            },
            runtime: {
              onMessage: T(I),
              onMessageExternal: T(I),
              sendMessage: R.bind(null, "sendMessage", {
                minArgs: 1,
                maxArgs: 3
              })
            },
            tabs: {
              sendMessage: R.bind(null, "sendMessage", {
                minArgs: 2,
                maxArgs: 3
              })
            }
          }, C = {
            clear: {
              minArgs: 1,
              maxArgs: 1
            },
            get: {
              minArgs: 1,
              maxArgs: 1
            },
            set: {
              minArgs: 1,
              maxArgs: 1
            }
          };
          return h.privacy = {
            network: {
              "*": C
            },
            services: {
              "*": C
            },
            websites: {
              "*": C
            }
          }, v(a, B, h);
        };
        l.exports = b(chrome);
      }
    });
  })(S)), S.exports;
}
W();
const U = {
  score: 50,
  status: "passive",
  streak: 0,
  sessionStart: Date.now(),
  lastIntervention: 0
};
let u = { ...U };
const _ = {
  calculateScore: (m) => {
    const { typingCadence: o, errors: l, mouseSmoothness: f, switchCount: b } = m;
    let a = 50;
    return a += o * 0.5, a -= l * 2, a += f * 0.2, a -= b * 5, Math.max(0, Math.min(100, a));
  },
  updateState: async (m) => {
    const o = _.calculateScore(m);
    return u.score = o, o > 80 ? u.status = "flow" : o > 50 ? u.status = "active" : o < 30 ? u.status = "distracted" : u.status = "passive", u.status === "flow" ? u.streak += 10 : u.streak = 0, await chrome.storage.local.set({ flowState: u }), u;
  },
  getState: () => u
}, D = "YOUR_GEMINI_API_KEY", z = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${D}`, G = {
  analyzeFlowState: async (m) => {
    const o = {
      contents: [{
        parts: [{
          text: `
            Analyze the following user behavior metrics and classify their flow state.
            
            Metrics:
            ${JSON.stringify(m, null, 2)}
            
            Return a JSON object with the following structure:
            {
              "classification": "passive work" | "active work" | "deep flow" | "decreasing focus" | "focus break",
              "action": "block distraction" | "micro-break" | "subtle nudge" | "continue flow" | "amplify flow",
              "reasoning": "short explanation"
            }
          `
        }]
      }]
    };
    try {
      const a = (await (await fetch(z, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(o)
      })).json()).candidates[0].content.parts[0].text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(a);
    } catch (l) {
      return console.error("AI Agent Error:", l), {
        classification: "passive work",
        action: "continue flow",
        reasoning: "Fallback due to error"
      };
    }
  }
};
console.log("Flow State Background Service Started");
chrome.runtime.onMessage.addListener((m, o, l) => {
  m.type === "FLOW_METRICS" && J(m.payload);
});
async function J(m) {
  const o = await _.updateState(m);
  console.log("Updated Flow State:", o);
  const l = Date.now(), f = o.lastIntervention || 0;
  if (l - f > 6e4) {
    console.log("Requesting AI Analysis...");
    const b = await G.analyzeFlowState(m);
    console.log("AI Response:", b), o.lastIntervention = l, chrome.tabs.query({ active: !0, currentWindow: !0 }, (a) => {
      var h;
      (h = a[0]) != null && h.id && chrome.tabs.sendMessage(a[0].id, {
        type: "AI_INTERVENTION",
        payload: b
      });
    });
  }
}
