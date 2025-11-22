var M = { exports: {} }, z = M.exports, G;
function Q() {
  return G || (G = 1, (function(s, n) {
    (function(t, l) {
      l(s);
    })(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : z, function(t) {
      if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id))
        throw new Error("This script should only be loaded in a browser extension.");
      if (globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)
        t.exports = globalThis.browser;
      else {
        const l = "The message port closed before a response was received.", u = (c) => {
          const x = {
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
          if (Object.keys(x).length === 0)
            throw new Error("api-metadata.json has not been included in browser-polyfill");
          class p extends WeakMap {
            constructor(r, a = void 0) {
              super(a), this.createItem = r;
            }
            get(r) {
              return this.has(r) || this.set(r, this.createItem(r)), super.get(r);
            }
          }
          const v = (e) => e && typeof e == "object" && typeof e.then == "function", y = (e, r) => (...a) => {
            c.runtime.lastError ? e.reject(new Error(c.runtime.lastError.message)) : r.singleCallbackArg || a.length <= 1 && r.singleCallbackArg !== !1 ? e.resolve(a[0]) : e.resolve(a);
          }, E = (e) => e == 1 ? "argument" : "arguments", D = (e, r) => function(i, ...A) {
            if (A.length < r.minArgs)
              throw new Error(`Expected at least ${r.minArgs} ${E(r.minArgs)} for ${e}(), got ${A.length}`);
            if (A.length > r.maxArgs)
              throw new Error(`Expected at most ${r.maxArgs} ${E(r.maxArgs)} for ${e}(), got ${A.length}`);
            return new Promise((d, h) => {
              if (r.fallbackToNoCallback)
                try {
                  i[e](...A, y({
                    resolve: d,
                    reject: h
                  }, r));
                } catch (o) {
                  console.warn(`${e} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, o), i[e](...A), r.fallbackToNoCallback = !1, r.noCallback = !0, d();
                }
              else r.noCallback ? (i[e](...A), d()) : i[e](...A, y({
                resolve: d,
                reject: h
              }, r));
            });
          }, B = (e, r, a) => new Proxy(r, {
            apply(i, A, d) {
              return a.call(A, e, ...d);
            }
          });
          let P = Function.call.bind(Object.prototype.hasOwnProperty);
          const L = (e, r = {}, a = {}) => {
            let i = /* @__PURE__ */ Object.create(null), A = {
              has(h, o) {
                return o in e || o in i;
              },
              get(h, o, b) {
                if (o in i)
                  return i[o];
                if (!(o in e))
                  return;
                let m = e[o];
                if (typeof m == "function")
                  if (typeof r[o] == "function")
                    m = B(e, e[o], r[o]);
                  else if (P(a, o)) {
                    let C = D(o, a[o]);
                    m = B(e, e[o], C);
                  } else
                    m = m.bind(e);
                else if (typeof m == "object" && m !== null && (P(r, o) || P(a, o)))
                  m = L(m, r[o], a[o]);
                else if (P(a, "*"))
                  m = L(m, r[o], a["*"]);
                else
                  return Object.defineProperty(i, o, {
                    configurable: !0,
                    enumerable: !0,
                    get() {
                      return e[o];
                    },
                    set(C) {
                      e[o] = C;
                    }
                  }), m;
                return i[o] = m, m;
              },
              set(h, o, b, m) {
                return o in i ? i[o] = b : e[o] = b, !0;
              },
              defineProperty(h, o, b) {
                return Reflect.defineProperty(i, o, b);
              },
              deleteProperty(h, o) {
                return Reflect.deleteProperty(i, o);
              }
            }, d = Object.create(e);
            return new Proxy(d, A);
          }, N = (e) => ({
            addListener(r, a, ...i) {
              r.addListener(e.get(a), ...i);
            },
            hasListener(r, a) {
              return r.hasListener(e.get(a));
            },
            removeListener(r, a) {
              r.removeListener(e.get(a));
            }
          }), W = new p((e) => typeof e != "function" ? e : function(a) {
            const i = L(a, {}, {
              getContent: {
                minArgs: 0,
                maxArgs: 0
              }
            });
            e(i);
          }), _ = new p((e) => typeof e != "function" ? e : function(a, i, A) {
            let d = !1, h, o = new Promise((R) => {
              h = function(w) {
                d = !0, R(w);
              };
            }), b;
            try {
              b = e(a, i, h);
            } catch (R) {
              b = Promise.reject(R);
            }
            const m = b !== !0 && v(b);
            if (b !== !0 && !m && !d)
              return !1;
            const C = (R) => {
              R.then((w) => {
                A(w);
              }, (w) => {
                let F;
                w && (w instanceof Error || typeof w.message == "string") ? F = w.message : F = "An unexpected error occurred", A({
                  __mozWebExtensionPolyfillReject__: !0,
                  message: F
                });
              }).catch((w) => {
                console.error("Failed to send onMessage rejected reply", w);
              });
            };
            return C(m ? b : o), !0;
          }), q = ({
            reject: e,
            resolve: r
          }, a) => {
            c.runtime.lastError ? c.runtime.lastError.message === l ? r() : e(new Error(c.runtime.lastError.message)) : a && a.__mozWebExtensionPolyfillReject__ ? e(new Error(a.message)) : r(a);
          }, O = (e, r, a, ...i) => {
            if (i.length < r.minArgs)
              throw new Error(`Expected at least ${r.minArgs} ${E(r.minArgs)} for ${e}(), got ${i.length}`);
            if (i.length > r.maxArgs)
              throw new Error(`Expected at most ${r.maxArgs} ${E(r.maxArgs)} for ${e}(), got ${i.length}`);
            return new Promise((A, d) => {
              const h = q.bind(null, {
                resolve: A,
                reject: d
              });
              i.push(h), a.sendMessage(...i);
            });
          }, H = {
            devtools: {
              network: {
                onRequestFinished: N(W)
              }
            },
            runtime: {
              onMessage: N(_),
              onMessageExternal: N(_),
              sendMessage: O.bind(null, "sendMessage", {
                minArgs: 1,
                maxArgs: 3
              })
            },
            tabs: {
              sendMessage: O.bind(null, "sendMessage", {
                minArgs: 2,
                maxArgs: 3
              })
            }
          }, U = {
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
          return x.privacy = {
            network: {
              "*": U
            },
            services: {
              "*": U
            },
            websites: {
              "*": U
            }
          }, L(c, H, x);
        };
        t.exports = u(chrome);
      }
    });
  })(M)), M.exports;
}
Q();
const K = {
  score: 50,
  status: "passive",
  streak: 0,
  sessionStart: Date.now(),
  lastIntervention: 0,
  focusQuality: 0,
  totalActiveSecs: 0,
  metricsHistory: []
};
let g = { ...K };
const $ = {
  calculateScore: (s) => {
    const { typingCadence: n, errors: t, mouseSmoothness: l, switchCount: u } = s;
    console.log("📊 Calculating score from metrics:", { typingCadence: n, errors: t, mouseSmoothness: l, switchCount: u });
    let c = 50;
    const x = Math.min(100, n / 60 * 100);
    c += (x - 50) * 0.4;
    const p = Math.min(20, t * 3);
    c -= p, c += (l - 50) * 0.3;
    const v = Math.min(30, u * 10);
    c -= v;
    const y = Math.max(0, Math.min(100, c));
    return console.log("✅ Final score:", y, "(typing:", x.toFixed(1), "errors:", -p, "mouse:", l, "switches:", -v, ")"), y;
  },
  calculateFocusQuality: (s) => {
    if (s.metricsHistory.length === 0) return 0;
    const n = s.metricsHistory.map((u) => u.score || 50), t = n.reduce((u, c) => u + c, 0) / n.length, l = Math.min(20, s.streak / 300 * 20);
    return Math.min(100, t + l);
  },
  updateState: async (s) => {
    const n = $.calculateScore(s);
    g.score = n, g.metricsHistory.push({ score: n, timestamp: Date.now(), ...s }), g.metricsHistory.length > 10 && g.metricsHistory.shift();
    const t = g.status;
    return n > 80 ? g.status = "flow" : n > 60 ? g.status = "active" : n < 30 ? g.status = "distracted" : n < 50 && (g.status = "passive"), t !== g.status && console.log("🔄 Status changed:", t, "→", g.status), g.totalActiveSecs += 10, g.status === "flow" || g.status === "active" ? g.streak += 10 : (g.streak > 0 && console.log("❌ Streak broken at", g.streak, "seconds"), g.streak = 0), g.focusQuality = $.calculateFocusQuality(g), console.log("💾 Saving state:", {
      score: g.score,
      status: g.status,
      streak: g.streak,
      focusQuality: g.focusQuality.toFixed(1) + "%"
    }), await chrome.storage.local.set({ flowState: g }), g;
  },
  getState: () => g
}, Y = "", J = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${Y}`, I = {
  analyzeFlowState: async (s) => {
    const n = {
      contents: [{
        parts: [{
          text: `
            Analyze the following user behavior metrics and classify their flow state.
            
            Metrics:
            ${JSON.stringify(s, null, 2)}
            
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
      const c = (await (await fetch(J, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(n)
      })).json()).candidates[0].content.parts[0].text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(c);
    } catch (t) {
      return console.error("AI Agent Error:", t), {
        classification: "passive work",
        action: "continue flow",
        reasoning: "Fallback due to error"
      };
    }
  },
  checkUrlRelevance: async (s, n) => (console.log("⚠️ No API key - using heuristic blocking"), I.heuristicUrlCheck(s)),
  heuristicUrlCheck: (s) => {
    const n = new URL(s).hostname.toLowerCase(), l = [
      "facebook.com",
      "twitter.com",
      "x.com",
      "instagram.com",
      "tiktok.com",
      "youtube.com",
      "reddit.com",
      "netflix.com",
      "twitch.tv",
      "pinterest.com",
      "snapchat.com",
      "linkedin.com/feed",
      "news",
      "sports",
      "gaming",
      "entertainment"
    ].some(
      (x) => n.includes(x)
    );
    return [
      "github.com",
      "stackoverflow.com",
      "docs.",
      "developer.",
      "learn",
      "tutorial",
      "documentation",
      "api",
      "notion.so",
      "trello.com",
      "asana.com",
      "slack.com"
    ].some(
      (x) => n.includes(x)
    ) ? !0 : !l;
  }
};
console.log("Flow State Background Service Started");
let f = null, k = [], j = 0, T = 0;
chrome.storage.local.get(["currentGoal", "blockedSites"], (s) => {
  s.currentGoal && (f = s.currentGoal, console.log("🎯 Loaded goal from storage:", f)), s.blockedSites && (k = s.blockedSites, console.log("🚫 Loaded", k.length, "blocked sites"));
});
const S = (s, n, t = "info") => {
  const l = Date.now();
  if (l - j < 6e4) return;
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon-128.png",
    title: s,
    message: n,
    priority: 2
  }), j = l, console.log("🔔 Notification:", s, "-", n);
};
chrome.runtime.onMessage.addListener((s, n, t) => s.type === "FLOW_METRICS" ? (Z(s.payload), !1) : s.type === "SET_GOAL" ? (V(s.payload.goal), !1) : s.type === "CLEAR_GOAL" ? (X(), !1) : s.type === "CHECK_URL" ? (ee(s.payload.url, n, t), !0) : !1);
const Z = async (s) => {
  const n = await $.updateState(s);
  console.log("Updated Flow State:", n);
  const t = n.status, l = n.score, u = Math.floor(n.streak / 60);
  t === "distracted" || l < 30 ? (T++, T >= 3 && (S(
    "⚠️ Focus Alert",
    `You've been distracted for ${T} intervals. Take a deep breath and refocus on your goal!`,
    "warning"
  ), T = 0)) : t === "flow" || l >= 80 ? (T = 0, u > 0 && u % 15 === 0 && S(
    "🎉 Amazing Focus!",
    `You've been in flow state for ${u} minutes! Keep up the excellent work!`,
    "success"
  )) : t === "active" && (T = 0), n.totalActiveSecs > 3600 && n.totalActiveSecs % 3600 < 10 && S(
    "⏰ Time for a Break",
    "You've been working for an hour. Consider taking a 5-minute break to recharge!",
    "info"
  );
  const c = Date.now(), x = n.lastIntervention || 0;
  if (c - x > 6e4) {
    console.log("Requesting AI Analysis...");
    const p = await I.analyzeFlowState(s);
    console.log("AI Response:", p), n.lastIntervention = c, chrome.tabs.query({ active: !0, currentWindow: !0 }, (v) => {
      var y;
      (y = v[0]) != null && y.id && chrome.tabs.sendMessage(v[0].id, {
        type: "AI_INTERVENTION",
        payload: p
      });
    });
  }
}, V = async (s) => {
  f = s, k = [], await chrome.storage.local.set({
    currentGoal: s,
    blockedSites: [],
    goalSetAt: Date.now()
  }), console.log("🎯 Goal set:", s), console.log("✅ AI-based URL filtering activated"), S(
    "🎯 Goal Set!",
    `Your goal: "${s.substring(0, 50)}${s.length > 50 ? "..." : ""}". AI is now protecting your focus!`,
    "success"
  );
}, X = async () => {
  f = null, k = [], await chrome.storage.local.remove(["currentGoal", "blockedSites", "goalSetAt"]), console.log("❌ Goal cleared, URL filtering deactivated"), S(
    "Goal Cleared",
    "Website blocking has been disabled. Set a new goal to re-enable focus protection.",
    "info"
  );
}, ee = async (s, n, t) => {
  if (!f) {
    t({ shouldBlock: !1 });
    return;
  }
  const l = new URL(s).hostname;
  if (k.includes(l)) {
    t({ shouldBlock: !0, reason: "Previously identified as distraction" });
    return;
  }
  console.log("🤖 Checking URL relevance:", l, "for goal:", f), await I.checkUrlRelevance(s, f) ? (console.log("✅ Allowed:", l), t({ shouldBlock: !1 })) : (k.push(l), await chrome.storage.local.set({ blockedSites: k }), console.log("🚫 Blocked:", l), t({ shouldBlock: !0, reason: `Not relevant to your goal: "${f}"` }));
};
chrome.webNavigation.onBeforeNavigate.addListener(async (s) => {
  if (s.frameId !== 0 || !f) return;
  const n = s.url;
  if (!(n.startsWith("chrome://") || n.startsWith("chrome-extension://")))
    try {
      const t = new URL(n).hostname;
      if (k.includes(t)) {
        chrome.tabs.update(s.tabId, {
          url: chrome.runtime.getURL("blocked.html") + "?site=" + encodeURIComponent(t) + "&goal=" + encodeURIComponent(f)
        }), S(
          "🚫 Site Blocked",
          `${t} is not relevant to your goal. Stay focused!`,
          "warning"
        );
        return;
      }
      console.log("🔍 Checking URL with AI/heuristic:", t), await I.checkUrlRelevance(n, f) ? console.log("✅ URL allowed:", t) : (k.push(t), await chrome.storage.local.set({ blockedSites: k }), console.log("🚫 Navigation blocked:", t), S(
        "🚫 Distraction Blocked",
        `${t} was blocked. Keep working on: "${f.substring(0, 40)}..."`,
        "warning"
      ), chrome.tabs.update(s.tabId, {
        url: chrome.runtime.getURL("blocked.html") + "?site=" + encodeURIComponent(t) + "&goal=" + encodeURIComponent(f)
      }));
    } catch (t) {
      console.error("Error checking URL:", t);
    }
});
