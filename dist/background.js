var P = { exports: {} }, D = P.exports, O;
function G() {
  return O || (O = 1, (function(r, a) {
    (function(n, l) {
      l(r);
    })(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : D, function(n) {
      if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id))
        throw new Error("This script should only be loaded in a browser extension.");
      if (globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)
        n.exports = globalThis.browser;
      else {
        const l = "The message port closed before a response was received.", u = (m) => {
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
          class k extends WeakMap {
            constructor(s, o = void 0) {
              super(o), this.createItem = s;
            }
            get(s) {
              return this.has(s) || this.set(s, this.createItem(s)), super.get(s);
            }
          }
          const C = (e) => e && typeof e == "object" && typeof e.then == "function", v = (e, s) => (...o) => {
            m.runtime.lastError ? e.reject(new Error(m.runtime.lastError.message)) : s.singleCallbackArg || o.length <= 1 && s.singleCallbackArg !== !1 ? e.resolve(o[0]) : e.resolve(o);
          }, T = (e) => e == 1 ? "argument" : "arguments", $ = (e, s) => function(i, ...A) {
            if (A.length < s.minArgs)
              throw new Error(`Expected at least ${s.minArgs} ${T(s.minArgs)} for ${e}(), got ${A.length}`);
            if (A.length > s.maxArgs)
              throw new Error(`Expected at most ${s.maxArgs} ${T(s.maxArgs)} for ${e}(), got ${A.length}`);
            return new Promise((d, f) => {
              if (s.fallbackToNoCallback)
                try {
                  i[e](...A, v({
                    resolve: d,
                    reject: f
                  }, s));
                } catch (t) {
                  console.warn(`${e} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, t), i[e](...A), s.fallbackToNoCallback = !1, s.noCallback = !0, d();
                }
              else s.noCallback ? (i[e](...A), d()) : i[e](...A, v({
                resolve: d,
                reject: f
              }, s));
            });
          }, F = (e, s, o) => new Proxy(s, {
            apply(i, A, d) {
              return o.call(A, e, ...d);
            }
          });
          let R = Function.call.bind(Object.prototype.hasOwnProperty);
          const E = (e, s = {}, o = {}) => {
            let i = /* @__PURE__ */ Object.create(null), A = {
              has(f, t) {
                return t in e || t in i;
              },
              get(f, t, h) {
                if (t in i)
                  return i[t];
                if (!(t in e))
                  return;
                let c = e[t];
                if (typeof c == "function")
                  if (typeof s[t] == "function")
                    c = F(e, e[t], s[t]);
                  else if (R(o, t)) {
                    let p = $(t, o[t]);
                    c = F(e, e[t], p);
                  } else
                    c = c.bind(e);
                else if (typeof c == "object" && c !== null && (R(s, t) || R(o, t)))
                  c = E(c, s[t], o[t]);
                else if (R(o, "*"))
                  c = E(c, s[t], o["*"]);
                else
                  return Object.defineProperty(i, t, {
                    configurable: !0,
                    enumerable: !0,
                    get() {
                      return e[t];
                    },
                    set(p) {
                      e[t] = p;
                    }
                  }), c;
                return i[t] = c, c;
              },
              set(f, t, h, c) {
                return t in i ? i[t] = h : e[t] = h, !0;
              },
              defineProperty(f, t, h) {
                return Reflect.defineProperty(i, t, h);
              },
              deleteProperty(f, t) {
                return Reflect.deleteProperty(i, t);
              }
            }, d = Object.create(e);
            return new Proxy(d, A);
          }, I = (e) => ({
            addListener(s, o, ...i) {
              s.addListener(e.get(o), ...i);
            },
            hasListener(s, o) {
              return s.hasListener(e.get(o));
            },
            removeListener(s, o) {
              s.removeListener(e.get(o));
            }
          }), j = new k((e) => typeof e != "function" ? e : function(o) {
            const i = E(o, {}, {
              getContent: {
                minArgs: 0,
                maxArgs: 0
              }
            });
            e(i);
          }), B = new k((e) => typeof e != "function" ? e : function(o, i, A) {
            let d = !1, f, t = new Promise((S) => {
              f = function(b) {
                d = !0, S(b);
              };
            }), h;
            try {
              h = e(o, i, f);
            } catch (S) {
              h = Promise.reject(S);
            }
            const c = h !== !0 && C(h);
            if (h !== !0 && !c && !d)
              return !1;
            const p = (S) => {
              S.then((b) => {
                A(b);
              }, (b) => {
                let N;
                b && (b instanceof Error || typeof b.message == "string") ? N = b.message : N = "An unexpected error occurred", A({
                  __mozWebExtensionPolyfillReject__: !0,
                  message: N
                });
              }).catch((b) => {
                console.error("Failed to send onMessage rejected reply", b);
              });
            };
            return p(c ? h : t), !0;
          }), W = ({
            reject: e,
            resolve: s
          }, o) => {
            m.runtime.lastError ? m.runtime.lastError.message === l ? s() : e(new Error(m.runtime.lastError.message)) : o && o.__mozWebExtensionPolyfillReject__ ? e(new Error(o.message)) : s(o);
          }, _ = (e, s, o, ...i) => {
            if (i.length < s.minArgs)
              throw new Error(`Expected at least ${s.minArgs} ${T(s.minArgs)} for ${e}(), got ${i.length}`);
            if (i.length > s.maxArgs)
              throw new Error(`Expected at most ${s.maxArgs} ${T(s.maxArgs)} for ${e}(), got ${i.length}`);
            return new Promise((A, d) => {
              const f = W.bind(null, {
                resolve: A,
                reject: d
              });
              i.push(f), o.sendMessage(...i);
            });
          }, q = {
            devtools: {
              network: {
                onRequestFinished: I(j)
              }
            },
            runtime: {
              onMessage: I(B),
              onMessageExternal: I(B),
              sendMessage: _.bind(null, "sendMessage", {
                minArgs: 1,
                maxArgs: 3
              })
            },
            tabs: {
              sendMessage: _.bind(null, "sendMessage", {
                minArgs: 2,
                maxArgs: 3
              })
            }
          }, L = {
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
              "*": L
            },
            services: {
              "*": L
            },
            websites: {
              "*": L
            }
          }, E(m, q, x);
        };
        n.exports = u(chrome);
      }
    });
  })(P)), P.exports;
}
G();
const H = {
  score: 50,
  status: "passive",
  streak: 0,
  sessionStart: Date.now(),
  lastIntervention: 0,
  focusQuality: 0,
  totalActiveSecs: 0,
  metricsHistory: []
};
let g = { ...H };
const U = {
  calculateScore: (r) => {
    const { typingCadence: a, errors: n, mouseSmoothness: l, switchCount: u } = r;
    console.log("📊 Calculating score from metrics:", { typingCadence: a, errors: n, mouseSmoothness: l, switchCount: u });
    let m = 50;
    const x = Math.min(100, a / 60 * 100);
    m += (x - 50) * 0.4;
    const k = Math.min(20, n * 3);
    m -= k, m += (l - 50) * 0.3;
    const C = Math.min(30, u * 10);
    m -= C;
    const v = Math.max(0, Math.min(100, m));
    return console.log("✅ Final score:", v, "(typing:", x.toFixed(1), "errors:", -k, "mouse:", l, "switches:", -C, ")"), v;
  },
  calculateFocusQuality: (r) => {
    if (r.metricsHistory.length === 0) return 0;
    const a = r.metricsHistory.map((u) => u.score || 50), n = a.reduce((u, m) => u + m, 0) / a.length, l = Math.min(20, r.streak / 300 * 20);
    return Math.min(100, n + l);
  },
  updateState: async (r) => {
    const a = U.calculateScore(r);
    g.score = a, g.metricsHistory.push({ score: a, timestamp: Date.now(), ...r }), g.metricsHistory.length > 10 && g.metricsHistory.shift();
    const n = g.status;
    return a > 80 ? g.status = "flow" : a > 60 ? g.status = "active" : a < 30 ? g.status = "distracted" : a < 50 && (g.status = "passive"), n !== g.status && console.log("🔄 Status changed:", n, "→", g.status), g.totalActiveSecs += 10, g.status === "flow" || g.status === "active" ? g.streak += 10 : (g.streak > 0 && console.log("❌ Streak broken at", g.streak, "seconds"), g.streak = 0), g.focusQuality = U.calculateFocusQuality(g), console.log("💾 Saving state:", {
      score: g.score,
      status: g.status,
      streak: g.streak,
      focusQuality: g.focusQuality.toFixed(1) + "%"
    }), await chrome.storage.local.set({ flowState: g }), g;
  },
  getState: () => g
}, z = "", Q = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${z}`, M = {
  analyzeFlowState: async (r) => {
    const a = {
      contents: [{
        parts: [{
          text: `
            Analyze the following user behavior metrics and classify their flow state.
            
            Metrics:
            ${JSON.stringify(r, null, 2)}
            
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
      const m = (await (await fetch(Q, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(a)
      })).json()).candidates[0].content.parts[0].text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(m);
    } catch (n) {
      return console.error("AI Agent Error:", n), {
        classification: "passive work",
        action: "continue flow",
        reasoning: "Fallback due to error"
      };
    }
  },
  checkUrlRelevance: async (r, a) => (console.log("⚠️ No API key - using heuristic blocking"), M.heuristicUrlCheck(r)),
  heuristicUrlCheck: (r) => {
    const a = new URL(r).hostname.toLowerCase(), l = [
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
      (x) => a.includes(x)
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
      (x) => a.includes(x)
    ) ? !0 : !l;
  }
};
console.log("Flow State Background Service Started");
let w = null, y = [];
chrome.runtime.onMessage.addListener((r, a, n) => r.type === "FLOW_METRICS" ? (J(r.payload), !1) : r.type === "SET_GOAL" ? (Z(r.payload.goal), !1) : r.type === "CLEAR_GOAL" ? (K(), !1) : r.type === "CHECK_URL" ? (V(r.payload.url, a, n), !0) : !1);
const J = async (r) => {
  const a = await U.updateState(r);
  console.log("Updated Flow State:", a);
  const n = Date.now(), l = a.lastIntervention || 0;
  if (n - l > 6e4) {
    console.log("Requesting AI Analysis...");
    const u = await M.analyzeFlowState(r);
    console.log("AI Response:", u), a.lastIntervention = n, chrome.tabs.query({ active: !0, currentWindow: !0 }, (m) => {
      var x;
      (x = m[0]) != null && x.id && chrome.tabs.sendMessage(m[0].id, {
        type: "AI_INTERVENTION",
        payload: u
      });
    });
  }
}, Z = async (r) => {
  w = r, console.log("🎯 Goal set:", r), y = [], console.log("✅ AI-based URL filtering activated");
}, K = () => {
  w = null, y = [], console.log("❌ Goal cleared, URL filtering deactivated");
}, V = async (r, a, n) => {
  if (!w) {
    n({ shouldBlock: !1 });
    return;
  }
  const l = new URL(r).hostname;
  if (y.includes(l)) {
    n({ shouldBlock: !0, reason: "Previously identified as distraction" });
    return;
  }
  console.log("🤖 Checking URL relevance:", l, "for goal:", w), await M.checkUrlRelevance(r, w) ? (console.log("✅ Allowed:", l), n({ shouldBlock: !1 })) : (y.push(l), console.log("🚫 Blocked:", l), n({ shouldBlock: !0, reason: `Not relevant to your goal: "${w}"` }));
};
chrome.webNavigation.onBeforeNavigate.addListener(async (r) => {
  if (r.frameId !== 0 || !w) return;
  const a = r.url;
  if (!(a.startsWith("chrome://") || a.startsWith("chrome-extension://")))
    try {
      const n = new URL(a).hostname;
      if (y.includes(n)) {
        chrome.tabs.update(r.tabId, {
          url: chrome.runtime.getURL("blocked.html") + "?site=" + encodeURIComponent(n) + "&goal=" + encodeURIComponent(w)
        });
        return;
      }
      await M.checkUrlRelevance(a, w) || (y.push(n), console.log("🚫 Navigation blocked:", n), chrome.tabs.update(r.tabId, {
        url: chrome.runtime.getURL("blocked.html") + "?site=" + encodeURIComponent(n) + "&goal=" + encodeURIComponent(w)
      }));
    } catch (n) {
      console.error("Error checking URL:", n);
    }
});
