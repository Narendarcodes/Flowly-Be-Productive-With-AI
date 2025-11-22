var N = { exports: {} }, z = N.exports, W;
function J() {
  return W || (W = 1, (function(e, s) {
    (function(r, n) {
      n(e);
    })(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : z, function(r) {
      if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id))
        throw new Error("This script should only be loaded in a browser extension.");
      if (globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)
        r.exports = globalThis.browser;
      else {
        const n = "The message port closed before a response was received.", g = (m) => {
          const f = {
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
          if (Object.keys(f).length === 0)
            throw new Error("api-metadata.json has not been included in browser-polyfill");
          class k extends WeakMap {
            constructor(t, l = void 0) {
              super(l), this.createItem = t;
            }
            get(t) {
              return this.has(t) || this.set(t, this.createItem(t)), super.get(t);
            }
          }
          const S = (o) => o && typeof o == "object" && typeof o.then == "function", y = (o, t) => (...l) => {
            m.runtime.lastError ? o.reject(new Error(m.runtime.lastError.message)) : t.singleCallbackArg || l.length <= 1 && t.singleCallbackArg !== !1 ? o.resolve(l[0]) : o.resolve(l);
          }, I = (o) => o == 1 ? "argument" : "arguments", K = (o, t) => function(i, ...d) {
            if (d.length < t.minArgs)
              throw new Error(`Expected at least ${t.minArgs} ${I(t.minArgs)} for ${o}(), got ${d.length}`);
            if (d.length > t.maxArgs)
              throw new Error(`Expected at most ${t.maxArgs} ${I(t.maxArgs)} for ${o}(), got ${d.length}`);
            return new Promise((h, b) => {
              if (t.fallbackToNoCallback)
                try {
                  i[o](...d, y({
                    resolve: h,
                    reject: b
                  }, t));
                } catch (a) {
                  console.warn(`${o} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, a), i[o](...d), t.fallbackToNoCallback = !1, t.noCallback = !0, h();
                }
              else t.noCallback ? (i[o](...d), h()) : i[o](...d, y({
                resolve: h,
                reject: b
              }, t));
            });
          }, $ = (o, t, l) => new Proxy(t, {
            apply(i, d, h) {
              return l.call(d, o, ...h);
            }
          });
          let L = Function.call.bind(Object.prototype.hasOwnProperty);
          const R = (o, t = {}, l = {}) => {
            let i = /* @__PURE__ */ Object.create(null), d = {
              has(b, a) {
                return a in o || a in i;
              },
              get(b, a, w) {
                if (a in i)
                  return i[a];
                if (!(a in o))
                  return;
                let A = o[a];
                if (typeof A == "function")
                  if (typeof t[a] == "function")
                    A = $(o, o[a], t[a]);
                  else if (L(l, a)) {
                    let T = K(a, l[a]);
                    A = $(o, o[a], T);
                  } else
                    A = A.bind(o);
                else if (typeof A == "object" && A !== null && (L(t, a) || L(l, a)))
                  A = R(A, t[a], l[a]);
                else if (L(l, "*"))
                  A = R(A, t[a], l["*"]);
                else
                  return Object.defineProperty(i, a, {
                    configurable: !0,
                    enumerable: !0,
                    get() {
                      return o[a];
                    },
                    set(T) {
                      o[a] = T;
                    }
                  }), A;
                return i[a] = A, A;
              },
              set(b, a, w, A) {
                return a in i ? i[a] = w : o[a] = w, !0;
              },
              defineProperty(b, a, w) {
                return Reflect.defineProperty(i, a, w);
              },
              deleteProperty(b, a) {
                return Reflect.deleteProperty(i, a);
              }
            }, h = Object.create(o);
            return new Proxy(h, d);
          }, P = (o) => ({
            addListener(t, l, ...i) {
              t.addListener(o.get(l), ...i);
            },
            hasListener(t, l) {
              return t.hasListener(o.get(l));
            },
            removeListener(t, l) {
              t.removeListener(o.get(l));
            }
          }), q = new k((o) => typeof o != "function" ? o : function(l) {
            const i = R(l, {}, {
              getContent: {
                minArgs: 0,
                maxArgs: 0
              }
            });
            o(i);
          }), D = new k((o) => typeof o != "function" ? o : function(l, i, d) {
            let h = !1, b, a = new Promise((E) => {
              b = function(p) {
                h = !0, E(p);
              };
            }), w;
            try {
              w = o(l, i, b);
            } catch (E) {
              w = Promise.reject(E);
            }
            const A = w !== !0 && S(w);
            if (w !== !0 && !A && !h)
              return !1;
            const T = (E) => {
              E.then((p) => {
                d(p);
              }, (p) => {
                let B;
                p && (p instanceof Error || typeof p.message == "string") ? B = p.message : B = "An unexpected error occurred", d({
                  __mozWebExtensionPolyfillReject__: !0,
                  message: B
                });
              }).catch((p) => {
                console.error("Failed to send onMessage rejected reply", p);
              });
            };
            return T(A ? w : a), !0;
          }), V = ({
            reject: o,
            resolve: t
          }, l) => {
            m.runtime.lastError ? m.runtime.lastError.message === n ? t() : o(new Error(m.runtime.lastError.message)) : l && l.__mozWebExtensionPolyfillReject__ ? o(new Error(l.message)) : t(l);
          }, _ = (o, t, l, ...i) => {
            if (i.length < t.minArgs)
              throw new Error(`Expected at least ${t.minArgs} ${I(t.minArgs)} for ${o}(), got ${i.length}`);
            if (i.length > t.maxArgs)
              throw new Error(`Expected at most ${t.maxArgs} ${I(t.maxArgs)} for ${o}(), got ${i.length}`);
            return new Promise((d, h) => {
              const b = V.bind(null, {
                resolve: d,
                reject: h
              });
              i.push(b), l.sendMessage(...i);
            });
          }, Y = {
            devtools: {
              network: {
                onRequestFinished: P(q)
              }
            },
            runtime: {
              onMessage: P(D),
              onMessageExternal: P(D),
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
          }, M = {
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
          return f.privacy = {
            network: {
              "*": M
            },
            services: {
              "*": M
            },
            websites: {
              "*": M
            }
          }, R(m, Y, f);
        };
        r.exports = g(chrome);
      }
    });
  })(N)), N.exports;
}
J();
const Q = {
  score: 50,
  status: "passive",
  streak: 0,
  sessionStart: Date.now(),
  lastIntervention: 0,
  focusQuality: 0,
  totalActiveSecs: 0,
  metricsHistory: []
};
let c = { ...Q };
const F = {
  calculateScore: (e) => {
    const { typingCadence: s, errors: r, mouseSmoothness: n, switchCount: g } = e;
    console.log("📊 Calculating score from metrics:", { typingCadence: s, errors: r, mouseSmoothness: n, switchCount: g });
    let m = 50;
    const f = Math.min(100, s / 60 * 100);
    m += (f - 50) * 0.4;
    const k = Math.min(20, r * 3);
    m -= k, m += (n - 50) * 0.3;
    const S = Math.min(30, g * 10);
    m -= S;
    const y = Math.max(0, Math.min(100, m));
    return console.log("✅ Final score:", y, "(typing:", f.toFixed(1), "errors:", -k, "mouse:", n, "switches:", -S, ")"), y;
  },
  calculateFocusQuality: (e) => {
    if (e.metricsHistory.length === 0) return 0;
    const s = e.metricsHistory.map((g) => g.score || 50), r = s.reduce((g, m) => g + m, 0) / s.length, n = Math.min(20, e.streak / 300 * 20);
    return Math.min(100, r + n);
  },
  updateState: async (e) => {
    const s = F.calculateScore(e);
    c.score = s, c.metricsHistory.push({ score: s, timestamp: Date.now(), ...e }), c.metricsHistory.length > 10 && c.metricsHistory.shift();
    const r = c.status;
    return s > 80 ? c.status = "flow" : s > 60 ? c.status = "active" : s < 30 ? c.status = "distracted" : s < 50 && (c.status = "passive"), r !== c.status && console.log("🔄 Status changed:", r, "→", c.status), c.totalActiveSecs += 10, c.status === "flow" || c.status === "active" ? c.streak += 10 : (c.streak > 0 && console.log("❌ Streak broken at", c.streak, "seconds"), c.streak = 0), c.focusQuality = F.calculateFocusQuality(c), console.log("💾 Saving state:", {
      score: c.score,
      status: c.status,
      streak: c.streak,
      focusQuality: c.focusQuality.toFixed(1) + "%"
    }), await chrome.storage.local.set({ flowState: c }), c;
  },
  getState: () => c
}, Z = "AIzaSyAVPtnPerbCGMplZJH6jNZ-PwKgr3Ud1Fc", H = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${Z}`, U = {
  analyzeFlowState: async (e) => {
    const s = {
      contents: [{
        parts: [{
          text: `
            Analyze the following user behavior metrics and classify their flow state.
            
            Metrics:
            ${JSON.stringify(e, null, 2)}
            
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
      const n = await (await fetch(H, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(s)
      })).json();
      if (console.log("🤖 Raw AI Response:", n), !n.candidates || !n.candidates[0] || !n.candidates[0].content)
        throw console.error("❌ Invalid AI response structure:", n), new Error("Invalid response structure");
      const g = n.candidates[0].content.parts[0].text;
      console.log("📝 AI Response Text:", g);
      const m = g.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(m);
    } catch (r) {
      return console.error("❌ AI Agent Error:", r), console.log("🔄 Using fallback classification"), {
        classification: "passive work",
        action: "continue flow",
        reasoning: "Fallback due to error"
      };
    }
  },
  checkUrlRelevance: async (e, s) => {
    const r = {
      contents: [{
        parts: [{
          text: `
            User's work goal: "${s}"
            Website URL: ${e}
            
            Determine if this website is relevant to achieving the user's goal.
            
            Consider:
            - Is it a distraction (social media, news, entertainment)?
            - Does it help with the stated goal?
            - Is it a productivity tool or resource?
            
            Respond with only "RELEVANT" or "DISTRACTION" and a brief reason.
            
            Format: RELEVANT|reason or DISTRACTION|reason
          `
        }]
      }]
    };
    try {
      console.log("🔍 Checking URL with AI:", e), console.log("🎯 Goal:", s);
      const n = await fetch(H, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(r)
      });
      if (!n.ok)
        throw console.error("❌ AI API Error:", n.status, n.statusText), new Error(`API returned ${n.status}`);
      const g = await n.json();
      if (console.log("🤖 Raw URL Check Response:", g), !g.candidates || !g.candidates[0] || !g.candidates[0].content)
        throw console.error("❌ Invalid AI response structure:", g), new Error("Invalid response structure");
      const m = g.candidates[0].content.parts[0].text.trim();
      console.log("📝 AI URL Decision:", m);
      const f = m.toUpperCase().startsWith("RELEVANT");
      return console.log(f ? "✅ URL is RELEVANT" : "🚫 URL is DISTRACTION"), f;
    } catch (n) {
      return console.error("❌ URL Check Error:", n), console.log("🔄 Falling back to heuristic check"), U.heuristicUrlCheck(e);
    }
  },
  heuristicUrlCheck: (e) => {
    console.log("🧠 Heuristic check for:", e);
    const s = new URL(e).hostname.toLowerCase();
    console.log("🌐 Hostname:", s);
    const n = [
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
      (f) => s.includes(f)
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
      (f) => s.includes(f)
    ) ? (console.log("✅ Heuristic: PRODUCTIVITY site - ALLOW"), !0) : n ? (console.log("🚫 Heuristic: DISTRACTION site - BLOCK"), !1) : (console.log("❓ Heuristic: Unknown site - ALLOW by default"), !0);
  }
};
console.log("Flow State Background Service Started");
let u = null, x = [], j = 0, v = 0;
chrome.storage.local.get(["currentGoal", "blockedSites"], async (e) => {
  if (e.currentGoal ? (u = e.currentGoal, console.log("🎯 Loaded goal from storage:", u), console.log("✅ URL BLOCKING IS NOW ACTIVE")) : console.log("⚠️ NO GOAL SET - URL blocking is disabled. Open new tab to set a goal."), e.blockedSites && (x = e.blockedSites, console.log("🚫 Loaded", x.length, "blocked sites:", x)), console.log("═══════════════════════════════════════"), console.log("🔧 FLOW STATE AI - DEBUG MODE"), console.log("═══════════════════════════════════════"), console.log("Goal:", u || "NOT SET"), console.log("Blocked sites:", x.length), console.log("Listeners registered:", {
    "webNavigation.onCommitted": "YES",
    "tabs.onUpdated": "YES",
    "runtime.onMessage": "YES"
  }), console.log("═══════════════════════════════════════"), u) {
    console.log("🔍 Scanning all open tabs for blocked sites...");
    const s = await chrome.tabs.query({});
    console.log(`📋 Found ${s.length} open tabs`);
    for (const r of s)
      if (r.url && r.id) {
        console.log(`
🔎 Checking tab ${r.id}: ${r.url}`);
        const n = await O(r.url);
        n.block ? (console.log(`🚫 BLOCKING EXISTING TAB: ${n.hostname}`), G(r.id, n.hostname)) : console.log(`✅ Tab allowed: ${n.hostname}`);
      }
    console.log(`✅ Tab scan complete
`);
  }
});
const C = (e, s, r = "info") => {
  const n = Date.now();
  if (n - j < 6e4) return;
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon-128.png",
    title: e,
    message: s,
    priority: 2
  }), j = n, console.log("🔔 Notification:", e, "-", s);
};
chrome.runtime.onMessage.addListener((e, s, r) => (console.log("📨 Message received:", e.type), e.type === "FLOW_METRICS" ? (X(e.payload), !1) : e.type === "SET_GOAL" ? (ee(e.payload.goal), !1) : e.type === "CLEAR_GOAL" ? (se(), !1) : e.type === "CHECK_URL" ? (oe(e.payload.url, s, r), !0) : e.type === "CHECK_URL_STATUS" ? ((async () => {
  const n = await O(e.payload.url);
  r({ shouldBlock: n.block, hostname: n.hostname });
})(), !0) : !1));
const X = async (e) => {
  const s = await F.updateState(e);
  console.log("Updated Flow State:", s);
  const r = s.status, n = s.score, g = Math.floor(s.streak / 60);
  r === "distracted" || n < 30 ? (v++, v >= 3 && (C(
    "⚠️ Focus Alert",
    `You've been distracted for ${v} intervals. Take a deep breath and refocus on your goal!`,
    "warning"
  ), v = 0)) : r === "flow" || n >= 80 ? (v = 0, g > 0 && g % 15 === 0 && C(
    "🎉 Amazing Focus!",
    `You've been in flow state for ${g} minutes! Keep up the excellent work!`,
    "success"
  )) : r === "active" && (v = 0), s.totalActiveSecs > 3600 && s.totalActiveSecs % 3600 < 10 && C(
    "⏰ Time for a Break",
    "You've been working for an hour. Consider taking a 5-minute break to recharge!",
    "info"
  );
  const m = Date.now(), f = s.lastIntervention || 0;
  if (m - f > 6e4) {
    console.log("Requesting AI Analysis...");
    const k = await U.analyzeFlowState(e);
    console.log("AI Response:", k), s.lastIntervention = m, chrome.tabs.query({ active: !0, currentWindow: !0 }, (S) => {
      var y;
      (y = S[0]) != null && y.id && chrome.tabs.sendMessage(S[0].id, {
        type: "AI_INTERVENTION",
        payload: k
      });
    });
  }
}, ee = async (e) => {
  console.log("═══════════════════════════════════════"), console.log("🎯 SET_GOAL MESSAGE RECEIVED"), console.log("New Goal:", e), u = e, x = [], await chrome.storage.local.set({
    currentGoal: e,
    blockedSites: [],
    goalSetAt: Date.now()
  }), console.log("✅ Goal saved to storage"), console.log("🔓 URL BLOCKING IS NOW ACTIVE"), console.log("All future navigations will be checked"), console.log("═══════════════════════════════════════"), C(
    "🎯 Goal Set!",
    `Your goal: "${e.substring(0, 50)}${e.length > 50 ? "..." : ""}". AI is now protecting your focus!`,
    "success"
  );
}, se = async () => {
  u = null, x = [], await chrome.storage.local.remove(["currentGoal", "blockedSites", "goalSetAt"]), console.log("❌ Goal cleared, URL filtering deactivated"), C(
    "Goal Cleared",
    "Website blocking has been disabled. Set a new goal to re-enable focus protection.",
    "info"
  );
}, oe = async (e, s, r) => {
  if (!u) {
    r({ shouldBlock: !1 });
    return;
  }
  const n = new URL(e).hostname;
  if (x.includes(n)) {
    r({ shouldBlock: !0, reason: "Previously identified as distraction" });
    return;
  }
  console.log("🤖 Checking URL relevance:", n, "for goal:", u), await U.checkUrlRelevance(e, u) ? (console.log("✅ Allowed:", n), r({ shouldBlock: !1 })) : (x.push(n), await chrome.storage.local.set({ blockedSites: x }), console.log("🚫 Blocked:", n), r({ shouldBlock: !0, reason: `Not relevant to your goal: "${u}"` }));
}, O = async (e) => {
  if (console.log("───────────────────────────────────────"), console.log("🔍 shouldBlockUrl() called"), console.log("URL:", e), console.log("Current Goal:", u || "NOT SET"), !u)
    return console.log("⚠️ NO GOAL - Skipping check"), console.log("───────────────────────────────────────"), { block: !1, hostname: "" };
  if (e.startsWith("chrome://") || e.startsWith("chrome-extension://"))
    return console.log("⚪ Chrome internal URL - Skipping"), console.log("───────────────────────────────────────"), { block: !1, hostname: "" };
  try {
    const s = new URL(e).hostname;
    if (console.log("🌐 Hostname extracted:", s), x.includes(s))
      return console.log("🚫 ALREADY IN BLOCKED LIST"), console.log("───────────────────────────────────────"), { block: !0, hostname: s };
    console.log("🤖 Checking with AI/heuristic...");
    const r = await U.checkUrlRelevance(e, u);
    return console.log("AI Result:", r ? "RELEVANT ✅" : "DISTRACTION 🚫"), r ? (console.log("✅ ALLOWING THIS SITE"), console.log("───────────────────────────────────────"), { block: !1, hostname: s }) : (x.push(s), await chrome.storage.local.set({ blockedSites: x }), console.log("🚫 BLOCKING THIS SITE"), console.log("Updated blocked list:", x), console.log("───────────────────────────────────────"), { block: !0, hostname: s });
  } catch (s) {
    return console.error("❌ Error checking URL:", s), console.log("───────────────────────────────────────"), { block: !1, hostname: "" };
  }
}, G = (e, s) => {
  if (console.log("🔴 blockUrl() - Redirecting tab", e), console.log("Blocked hostname:", s), !u) {
    console.log("⚠️ No goal set, cannot block");
    return;
  }
  const r = chrome.runtime.getURL("blocked.html") + "?site=" + encodeURIComponent(s) + "&goal=" + encodeURIComponent(u);
  console.log("Redirect URL:", r), chrome.tabs.update(e, { url: r }, () => {
    chrome.runtime.lastError ? console.error("❌ Failed to redirect tab:", chrome.runtime.lastError) : console.log("✅ Tab redirected successfully");
  }), C(
    "🚫 Distraction Blocked",
    `${s} was blocked. Keep working on: "${u.substring(0, 40)}..."`,
    "warning"
  );
};
chrome.webNavigation.onCommitted.addListener(async (e) => {
  if (console.log("🌍 webNavigation.onCommitted fired"), console.log("Tab ID:", e.tabId), console.log("URL:", e.url), console.log("Frame ID:", e.frameId), console.log("Transition Type:", e.transitionType), e.frameId !== 0) {
    console.log("⚪ Skipping - Not main frame");
    return;
  }
  if (!u) {
    console.log("⚠️ Skipping - No goal set");
    return;
  }
  console.log("✓ Processing navigation...");
  const s = await O(e.url);
  s.block ? (console.log("🛑 WILL BLOCK THIS NAVIGATION"), G(e.tabId, s.hostname)) : console.log("✓ Navigation allowed");
});
chrome.tabs.onUpdated.addListener(async (e, s) => {
  if (console.log("📑 tabs.onUpdated fired"), console.log("Tab ID:", e), console.log("Change Info:", s), !u) {
    console.log("⚠️ Skipping - No goal set");
    return;
  }
  if (s.status === "loading" && s.url) {
    console.log("✓ Tab is loading, checking URL..."), console.log("Tab URL:", s.url);
    const r = await O(s.url);
    r.block ? (console.log("🛑 WILL BLOCK THIS TAB UPDATE"), G(e, r.hostname)) : console.log("✓ Tab update allowed");
  }
});
