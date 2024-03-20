"use strict";
(self.webpackChunkangularx_social_login_ws =
  self.webpackChunkangularx_social_login_ws || []).push([
  [179],
  {
    599: () => {
      function J(e) {
        return "function" == typeof e;
      }
      function bo(e) {
        const n = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      const Io = bo(
        (e) =>
          function (n) {
            e(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, o) => `${o + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function _r(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class gt {
        constructor(t) {
          (this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const i of n) i.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (J(r))
              try {
                r();
              } catch (i) {
                t = i instanceof Io ? i.errors : [i];
              }
            const { _finalizers: o } = this;
            if (o) {
              this._finalizers = null;
              for (const i of o)
                try {
                  Kl(i);
                } catch (s) {
                  (t = t ?? []),
                    s instanceof Io ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new Io(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) Kl(t);
            else {
              if (t instanceof gt) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._finalizers =
                null !== (n = this._finalizers) && void 0 !== n ? n : []).push(
                t
              );
            }
        }
        _hasParent(t) {
          const { _parentage: n } = this;
          return n === t || (Array.isArray(n) && n.includes(t));
        }
        _addParent(t) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
        }
        _removeParent(t) {
          const { _parentage: n } = this;
          n === t ? (this._parentage = null) : Array.isArray(n) && _r(n, t);
        }
        remove(t) {
          const { _finalizers: n } = this;
          n && _r(n, t), t instanceof gt && t._removeParent(this);
        }
      }
      gt.EMPTY = (() => {
        const e = new gt();
        return (e.closed = !0), e;
      })();
      const ql = gt.EMPTY;
      function Zl(e) {
        return (
          e instanceof gt ||
          (e && "closed" in e && J(e.remove) && J(e.add) && J(e.unsubscribe))
        );
      }
      function Kl(e) {
        J(e) ? e() : e.unsubscribe();
      }
      const on = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        Mo = {
          setTimeout(e, t, ...n) {
            const { delegate: r } = Mo;
            return r?.setTimeout
              ? r.setTimeout(e, t, ...n)
              : setTimeout(e, t, ...n);
          },
          clearTimeout(e) {
            const { delegate: t } = Mo;
            return (t?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function Yl(e) {
        Mo.setTimeout(() => {
          const { onUnhandledError: t } = on;
          if (!t) throw e;
          t(e);
        });
      }
      function Ql() {}
      const Xy = fs("C", void 0, void 0);
      function fs(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let sn = null;
      function So(e) {
        if (on.useDeprecatedSynchronousErrorHandling) {
          const t = !sn;
          if ((t && (sn = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = sn;
            if (((sn = null), n)) throw r;
          }
        } else e();
      }
      class hs extends gt {
        constructor(t) {
          super(),
            (this.isStopped = !1),
            t
              ? ((this.destination = t), Zl(t) && t.add(this))
              : (this.destination = iD);
        }
        static create(t, n, r) {
          return new vr(t, n, r);
        }
        next(t) {
          this.isStopped
            ? gs(
                (function eD(e) {
                  return fs("N", e, void 0);
                })(t),
                this
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? gs(
                (function Jy(e) {
                  return fs("E", void 0, e);
                })(t),
                this
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped
            ? gs(Xy, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const nD = Function.prototype.bind;
      function ps(e, t) {
        return nD.call(e, t);
      }
      class rD {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(t);
            } catch (r) {
              Ao(r);
            }
        }
        error(t) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(t);
            } catch (r) {
              Ao(r);
            }
          else Ao(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (n) {
              Ao(n);
            }
        }
      }
      class vr extends hs {
        constructor(t, n, r) {
          let o;
          if ((super(), J(t) || !t))
            o = {
              next: t ?? void 0,
              error: n ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let i;
            this && on.useDeprecatedNextContext
              ? ((i = Object.create(t)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = {
                  next: t.next && ps(t.next, i),
                  error: t.error && ps(t.error, i),
                  complete: t.complete && ps(t.complete, i),
                }))
              : (o = t);
          }
          this.destination = new rD(o);
        }
      }
      function Ao(e) {
        on.useDeprecatedSynchronousErrorHandling
          ? (function tD(e) {
              on.useDeprecatedSynchronousErrorHandling &&
                sn &&
                ((sn.errorThrown = !0), (sn.error = e));
            })(e)
          : Yl(e);
      }
      function gs(e, t) {
        const { onStoppedNotification: n } = on;
        n && Mo.setTimeout(() => n(e, t));
      }
      const iD = {
          closed: !0,
          next: Ql,
          error: function oD(e) {
            throw e;
          },
          complete: Ql,
        },
        ms =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function Xl(e) {
        return e;
      }
      let Ee = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, o) {
            const i = (function aD(e) {
              return (
                (e && e instanceof hs) ||
                ((function sD(e) {
                  return e && J(e.next) && J(e.error) && J(e.complete);
                })(e) &&
                  Zl(e))
              );
            })(n)
              ? n
              : new vr(n, r, o);
            return (
              So(() => {
                const { operator: s, source: a } = this;
                i.add(
                  s
                    ? s.call(i, a)
                    : a
                    ? this._subscribe(i)
                    : this._trySubscribe(i)
                );
              }),
              i
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = ec(r))((o, i) => {
              const s = new vr({
                next: (a) => {
                  try {
                    n(a);
                  } catch (u) {
                    i(u), s.unsubscribe();
                  }
                },
                error: i,
                complete: o,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [ms]() {
            return this;
          }
          pipe(...n) {
            return (function Jl(e) {
              return 0 === e.length
                ? Xl
                : 1 === e.length
                ? e[0]
                : function (n) {
                    return e.reduce((r, o) => o(r), n);
                  };
            })(n)(this);
          }
          toPromise(n) {
            return new (n = ec(n))((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i)
              );
            });
          }
        }
        return (e.create = (t) => new e(t)), e;
      })();
      function ec(e) {
        var t;
        return null !== (t = e ?? on.Promise) && void 0 !== t ? t : Promise;
      }
      const uD = bo(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let Fn = (() => {
        class e extends Ee {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new tc(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new uD();
          }
          next(n) {
            So(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            So(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            So(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: o, observers: i } = this;
            return r || o
              ? ql
              : ((this.currentObservers = null),
                i.push(n),
                new gt(() => {
                  (this.currentObservers = null), _r(i, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? n.error(o) : i && n.complete();
          }
          asObservable() {
            const n = new Ee();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new tc(t, n)), e;
      })();
      class tc extends Fn {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, t);
        }
        error(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, t);
        }
        complete() {
          var t, n;
          null ===
            (n =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.complete) ||
            void 0 === n ||
            n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(t)) && void 0 !== r
            ? r
            : ql;
        }
      }
      function an(e) {
        return (t) => {
          if (
            (function lD(e) {
              return J(e?.lift);
            })(t)
          )
            return t.lift(function (n) {
              try {
                return e(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function un(e, t, n, r, o) {
        return new cD(e, t, n, r, o);
      }
      class cD extends hs {
        constructor(t, n, r, o, i, s) {
          super(t),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (u) {
                    t.error(u);
                  }
                }
              : super._next),
            (this._error = o
              ? function (a) {
                  try {
                    o(a);
                  } catch (u) {
                    t.error(u);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(),
              !n &&
                (null === (t = this.onFinalize) ||
                  void 0 === t ||
                  t.call(this));
          }
        }
      }
      function ln(e) {
        return this instanceof ln ? ((this.v = e), this) : new ln(e);
      }
      function hD(e, t, n) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var o,
          r = n.apply(e, t || []),
          i = [];
        return (
          (o = {}),
          s("next"),
          s("throw"),
          s("return"),
          (o[Symbol.asyncIterator] = function () {
            return this;
          }),
          o
        );
        function s(f) {
          r[f] &&
            (o[f] = function (h) {
              return new Promise(function (p, g) {
                i.push([f, h, p, g]) > 1 || a(f, h);
              });
            });
        }
        function a(f, h) {
          try {
            !(function u(f) {
              f.value instanceof ln
                ? Promise.resolve(f.value.v).then(l, c)
                : d(i[0][2], f);
            })(r[f](h));
          } catch (p) {
            d(i[0][3], p);
          }
        }
        function l(f) {
          a("next", f);
        }
        function c(f) {
          a("throw", f);
        }
        function d(f, h) {
          f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
        }
      }
      function pD(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function oc(e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                n = t && e[t],
                r = 0;
              if (n) return n.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                t
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(i) {
          n[i] =
            e[i] &&
            function (s) {
              return new Promise(function (a, u) {
                !(function o(i, s, a, u) {
                  Promise.resolve(u).then(function (l) {
                    i({ value: l, done: a });
                  }, s);
                })(a, u, (s = e[i](s)).done, s.value);
              });
            };
        }
      }
      const ic = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function sc(e) {
        return J(e?.then);
      }
      function ac(e) {
        return J(e[ms]);
      }
      function uc(e) {
        return Symbol.asyncIterator && J(e?.[Symbol.asyncIterator]);
      }
      function lc(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const cc = (function mD() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function dc(e) {
        return J(e?.[cc]);
      }
      function fc(e) {
        return hD(this, arguments, function* () {
          const n = e.getReader();
          try {
            for (;;) {
              const { value: r, done: o } = yield ln(n.read());
              if (o) return yield ln(void 0);
              yield yield ln(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function hc(e) {
        return J(e?.getReader);
      }
      function St(e) {
        if (e instanceof Ee) return e;
        if (null != e) {
          if (ac(e))
            return (function yD(e) {
              return new Ee((t) => {
                const n = e[ms]();
                if (J(n.subscribe)) return n.subscribe(t);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (ic(e))
            return (function DD(e) {
              return new Ee((t) => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (sc(e))
            return (function _D(e) {
              return new Ee((t) => {
                e.then(
                  (n) => {
                    t.closed || (t.next(n), t.complete());
                  },
                  (n) => t.error(n)
                ).then(null, Yl);
              });
            })(e);
          if (uc(e)) return pc(e);
          if (dc(e))
            return (function vD(e) {
              return new Ee((t) => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (hc(e))
            return (function CD(e) {
              return pc(fc(e));
            })(e);
        }
        throw lc(e);
      }
      function pc(e) {
        return new Ee((t) => {
          (function wD(e, t) {
            var n, r, o, i;
            return (function dD(e, t, n, r) {
              return new (n || (n = Promise))(function (i, s) {
                function a(c) {
                  try {
                    l(r.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  try {
                    l(r.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  c.done
                    ? i(c.value)
                    : (function o(i) {
                        return i instanceof n
                          ? i
                          : new n(function (s) {
                              s(i);
                            });
                      })(c.value).then(a, u);
                }
                l((r = r.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = pD(e); !(r = yield n.next()).done; )
                  if ((t.next(r.value), t.closed)) return;
              } catch (s) {
                o = { error: s };
              } finally {
                try {
                  r && !r.done && (i = n.return) && (yield i.call(n));
                } finally {
                  if (o) throw o.error;
                }
              }
              t.complete();
            });
          })(e, t).catch((n) => t.error(n));
        });
      }
      function qt(e, t, n, r = 0, o = !1) {
        const i = t.schedule(function () {
          n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(i), !o)) return i;
      }
      function gc(e, t, n = 1 / 0) {
        return J(t)
          ? gc(
              (r, o) =>
                (function ys(e, t) {
                  return an((n, r) => {
                    let o = 0;
                    n.subscribe(
                      un(r, (i) => {
                        r.next(e.call(t, i, o++));
                      })
                    );
                  });
                })((i, s) => t(r, i, o, s))(St(e(r, o))),
              n
            )
          : ("number" == typeof t && (n = t),
            an((r, o) =>
              (function ED(e, t, n, r, o, i, s, a) {
                const u = [];
                let l = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !u.length && !l && t.complete();
                  },
                  h = (g) => (l < r ? p(g) : u.push(g)),
                  p = (g) => {
                    i && t.next(g), l++;
                    let D = !1;
                    St(n(g, c++)).subscribe(
                      un(
                        t,
                        (_) => {
                          o?.(_), i ? h(_) : t.next(_);
                        },
                        () => {
                          D = !0;
                        },
                        void 0,
                        () => {
                          if (D)
                            try {
                              for (l--; u.length && l < r; ) {
                                const _ = u.shift();
                                s ? qt(t, s, () => p(_)) : p(_);
                              }
                              f();
                            } catch (_) {
                              t.error(_);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    un(t, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, o, e, n)
            ));
      }
      const _s = new Ee((e) => e.complete());
      function vs(e) {
        return e[e.length - 1];
      }
      function mc(e, t = 0) {
        return an((n, r) => {
          n.subscribe(
            un(
              r,
              (o) => qt(r, e, () => r.next(o), t),
              () => qt(r, e, () => r.complete(), t),
              (o) => qt(r, e, () => r.error(o), t)
            )
          );
        });
      }
      function yc(e, t = 0) {
        return an((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function Dc(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new Ee((n) => {
          qt(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            qt(
              n,
              t,
              () => {
                r.next().then((o) => {
                  o.done ? n.complete() : n.next(o.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function _c(e, t) {
        return t
          ? (function RD(e, t) {
              if (null != e) {
                if (ac(e))
                  return (function ND(e, t) {
                    return St(e).pipe(yc(t), mc(t));
                  })(e, t);
                if (ic(e))
                  return (function OD(e, t) {
                    return new Ee((n) => {
                      let r = 0;
                      return t.schedule(function () {
                        r === e.length
                          ? n.complete()
                          : (n.next(e[r++]), n.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (sc(e))
                  return (function FD(e, t) {
                    return St(e).pipe(yc(t), mc(t));
                  })(e, t);
                if (uc(e)) return Dc(e, t);
                if (dc(e))
                  return (function PD(e, t) {
                    return new Ee((n) => {
                      let r;
                      return (
                        qt(n, t, () => {
                          (r = e[cc]()),
                            qt(
                              n,
                              t,
                              () => {
                                let o, i;
                                try {
                                  ({ value: o, done: i } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                i ? n.complete() : n.next(o);
                              },
                              0,
                              !0
                            );
                        }),
                        () => J(r?.return) && r.return()
                      );
                    });
                  })(e, t);
                if (hc(e))
                  return (function xD(e, t) {
                    return Dc(fc(e), t);
                  })(e, t);
              }
              throw lc(e);
            })(e, t)
          : St(e);
      }
      function kD(...e) {
        const t = (function AD(e) {
            return (function MD(e) {
              return e && J(e.schedule);
            })(vs(e))
              ? e.pop()
              : void 0;
          })(e),
          n = (function TD(e, t) {
            return "number" == typeof vs(e) ? e.pop() : t;
          })(e, 1 / 0),
          r = e;
        return r.length
          ? 1 === r.length
            ? St(r[0])
            : (function bD(e = 1 / 0) {
                return gc(Xl, e);
              })(n)(_c(r, t))
          : _s;
      }
      function Cs(e, t, ...n) {
        if (!0 === t) return void e();
        if (!1 === t) return;
        const r = new vr({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return St(t(...n)).subscribe(r);
      }
      function W(e) {
        for (let t in e) if (e[t] === W) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function Z(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(Z).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const n = t.indexOf("\n");
        return -1 === n ? t : t.substring(0, n);
      }
      function Es(e, t) {
        return null == e || "" === e
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? e
          : e + " " + t;
      }
      const VD = W({ __forward_ref__: W });
      function K(e) {
        return (
          (e.__forward_ref__ = K),
          (e.toString = function () {
            return Z(this());
          }),
          e
        );
      }
      function M(e) {
        return (function bs(e) {
          return (
            "function" == typeof e &&
            e.hasOwnProperty(VD) &&
            e.__forward_ref__ === K
          );
        })(e)
          ? e()
          : e;
      }
      function Is(e) {
        return e && !!e.ɵproviders;
      }
      const vc = "https://g.co/ng/security#xss";
      class C extends Error {
        constructor(t, n) {
          super(
            (function To(e, t) {
              return `NG0${Math.abs(e)}${t ? ": " + t.trim() : ""}`;
            })(t, n)
          ),
            (this.code = t);
        }
      }
      function O(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function No(e, t) {
        throw new C(-201, !1);
      }
      function Ke(e, t) {
        null == e &&
          (function U(e, t, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`)
            );
          })(t, e, null, "!=");
      }
      function Y(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function mt(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function Fo(e) {
        return Cc(e, Oo) || Cc(e, Ec);
      }
      function Cc(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function wc(e) {
        return e && (e.hasOwnProperty(Ms) || e.hasOwnProperty(WD))
          ? e[Ms]
          : null;
      }
      const Oo = W({ ɵprov: W }),
        Ms = W({ ɵinj: W }),
        Ec = W({ ngInjectableDef: W }),
        WD = W({ ngInjectorDef: W });
      var T = (() => (
        ((T = T || {})[(T.Default = 0)] = "Default"),
        (T[(T.Host = 1)] = "Host"),
        (T[(T.Self = 2)] = "Self"),
        (T[(T.SkipSelf = 4)] = "SkipSelf"),
        (T[(T.Optional = 8)] = "Optional"),
        T
      ))();
      let Ss;
      function Ye(e) {
        const t = Ss;
        return (Ss = e), t;
      }
      function bc(e, t, n) {
        const r = Fo(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & T.Optional
          ? null
          : void 0 !== t
          ? t
          : void No(Z(e));
      }
      const Q = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" &&
            typeof WorkerGlobalScope < "u" &&
            self instanceof WorkerGlobalScope &&
            self))(),
        Cr = {},
        Po = "ngTempTokenPath",
        KD = /\n/gm,
        Ic = "__source";
      let wr;
      function On(e) {
        const t = wr;
        return (wr = e), t;
      }
      function QD(e, t = T.Default) {
        if (void 0 === wr) throw new C(-203, !1);
        return null === wr
          ? bc(e, void 0, t)
          : wr.get(e, t & T.Optional ? null : void 0, t);
      }
      function B(e, t = T.Default) {
        return (
          (function qD() {
            return Ss;
          })() || QD
        )(M(e), t);
      }
      function xo(e) {
        return typeof e > "u" || "number" == typeof e
          ? e
          : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4);
      }
      function Ts(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = M(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new C(900, !1);
            let o,
              i = T.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                u = JD(a);
              "number" == typeof u
                ? -1 === u
                  ? (o = a.token)
                  : (i |= u)
                : (o = a);
            }
            t.push(B(o, i));
          } else t.push(B(r));
        }
        return t;
      }
      function JD(e) {
        return e.__NG_DI_FLAG__;
      }
      function Kt(e) {
        return { toString: e }.toString();
      }
      var ot = (() => (
          ((ot = ot || {})[(ot.OnPush = 0)] = "OnPush"),
          (ot[(ot.Default = 1)] = "Default"),
          ot
        ))(),
        yt = (() => {
          return (
            ((e = yt || (yt = {}))[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            yt
          );
          var e;
        })();
      const At = {},
        H = [],
        Ro = W({ ɵcmp: W }),
        Ns = W({ ɵdir: W }),
        Fs = W({ ɵpipe: W }),
        Sc = W({ ɵmod: W }),
        Tt = W({ ɵfac: W }),
        br = W({ __NG_ELEMENT_ID__: W });
      let n_ = 0;
      function Ir(e) {
        return Kt(() => {
          const n = !0 === e.standalone,
            r = {},
            o = {
              type: e.type,
              providersResolver: null,
              decls: e.decls,
              vars: e.vars,
              factory: null,
              template: e.template || null,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              hostBindings: e.hostBindings || null,
              hostVars: e.hostVars || 0,
              hostAttrs: e.hostAttrs || null,
              contentQueries: e.contentQueries || null,
              declaredInputs: r,
              inputs: null,
              outputs: null,
              exportAs: e.exportAs || null,
              onPush: e.changeDetection === ot.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              standalone: n,
              dependencies: (n && e.dependencies) || null,
              getStandaloneInjector: null,
              selectors: e.selectors || H,
              viewQuery: e.viewQuery || null,
              features: e.features || null,
              data: e.data || {},
              encapsulation: e.encapsulation || yt.Emulated,
              id: "c" + n_++,
              styles: e.styles || H,
              _: null,
              setInput: null,
              schemas: e.schemas || null,
              tView: null,
              findHostDirectiveDefs: null,
              hostDirectives: null,
            },
            i = e.dependencies,
            s = e.features;
          return (
            (o.inputs = Nc(e.inputs, r)),
            (o.outputs = Nc(e.outputs)),
            s && s.forEach((a) => a(o)),
            (o.directiveDefs = i
              ? () => ("function" == typeof i ? i() : i).map(Ac).filter(Tc)
              : null),
            (o.pipeDefs = i
              ? () => ("function" == typeof i ? i() : i).map(Fe).filter(Tc)
              : null),
            o
          );
        });
      }
      function Ac(e) {
        return G(e) || be(e);
      }
      function Tc(e) {
        return null !== e;
      }
      function Nt(e) {
        return Kt(() => ({
          type: e.type,
          bootstrap: e.bootstrap || H,
          declarations: e.declarations || H,
          imports: e.imports || H,
          exports: e.exports || H,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function Nc(e, t) {
        if (null == e) return At;
        const n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let o = e[r],
              i = o;
            Array.isArray(o) && ((i = o[1]), (o = o[0])),
              (n[o] = r),
              t && (t[o] = i);
          }
        return n;
      }
      const N = Ir;
      function G(e) {
        return e[Ro] || null;
      }
      function be(e) {
        return e[Ns] || null;
      }
      function Fe(e) {
        return e[Fs] || null;
      }
      const L = 11;
      function Ge(e) {
        return Array.isArray(e) && "object" == typeof e[1];
      }
      function st(e) {
        return Array.isArray(e) && !0 === e[1];
      }
      function xs(e) {
        return 0 != (4 & e.flags);
      }
      function Nr(e) {
        return e.componentOffset > -1;
      }
      function jo(e) {
        return 1 == (1 & e.flags);
      }
      function at(e) {
        return null !== e.template;
      }
      function i_(e) {
        return 0 != (256 & e[2]);
      }
      function dn(e, t) {
        return e.hasOwnProperty(Tt) ? e[Tt] : null;
      }
      class u_ {
        constructor(t, n, r) {
          (this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function kc(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = c_), l_;
      }
      function l_() {
        const e = Vc(this),
          t = e?.current;
        if (t) {
          const n = e.previous;
          if (n === At) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function c_(e, t, n, r) {
        const o = this.declaredInputs[n],
          i =
            Vc(e) ||
            (function d_(e, t) {
              return (e[Lc] = t);
            })(e, { previous: At, current: null }),
          s = i.current || (i.current = {}),
          a = i.previous,
          u = a[o];
        (s[o] = new u_(u && u.currentValue, t, a === At)), (e[r] = t);
      }
      const Lc = "__ngSimpleChanges__";
      function Vc(e) {
        return e[Lc] || null;
      }
      function _e(e) {
        for (; Array.isArray(e); ) e = e[0];
        return e;
      }
      function ze(e, t) {
        return _e(t[e.index]);
      }
      function Hc(e, t) {
        return e.data[t];
      }
      function We(e, t) {
        const n = t[e];
        return Ge(n) ? n : n[0];
      }
      function $o(e) {
        return 64 == (64 & e[2]);
      }
      function Yt(e, t) {
        return null == t ? null : e[t];
      }
      function $c(e) {
        e[18] = 0;
      }
      function ks(e, t) {
        e[5] += t;
        let n = e,
          r = e[3];
        for (
          ;
          null !== r && ((1 === t && 1 === n[5]) || (-1 === t && 0 === n[5]));

        )
          (r[5] += t), (n = r), (r = r[3]);
      }
      const P = { lFrame: Xc(null), bindingsEnabled: !0 };
      function Gc() {
        return P.bindingsEnabled;
      }
      function y() {
        return P.lFrame.lView;
      }
      function j() {
        return P.lFrame.tView;
      }
      function fn(e) {
        return (P.lFrame.contextLView = e), e[8];
      }
      function hn(e) {
        return (P.lFrame.contextLView = null), e;
      }
      function ve() {
        let e = zc();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function zc() {
        return P.lFrame.currentTNode;
      }
      function _t(e, t) {
        const n = P.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function Ls() {
        return P.lFrame.isParent;
      }
      function Vn() {
        return P.lFrame.bindingIndex++;
      }
      function b_(e, t) {
        const n = P.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), Bs(t);
      }
      function Bs(e) {
        P.lFrame.currentDirectiveIndex = e;
      }
      function Hs(e) {
        P.lFrame.currentQueryIndex = e;
      }
      function M_(e) {
        const t = e[1];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[6] : null;
      }
      function Yc(e, t, n) {
        if (n & T.SkipSelf) {
          let o = t,
            i = e;
          for (
            ;
            !((o = o.parent),
            null !== o ||
              n & T.Host ||
              ((o = M_(i)), null === o || ((i = i[15]), 10 & o.type)));

          );
          if (null === o) return !1;
          (t = o), (e = i);
        }
        const r = (P.lFrame = Qc());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function $s(e) {
        const t = Qc(),
          n = e[1];
        (P.lFrame = t),
          (t.currentTNode = n.firstChild),
          (t.lView = e),
          (t.tView = n),
          (t.contextLView = e),
          (t.bindingIndex = n.bindingStartIndex),
          (t.inI18n = !1);
      }
      function Qc() {
        const e = P.lFrame,
          t = null === e ? null : e.child;
        return null === t ? Xc(e) : t;
      }
      function Xc(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function Jc() {
        const e = P.lFrame;
        return (
          (P.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const ed = Jc;
      function Us() {
        const e = Jc();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function xe() {
        return P.lFrame.selectedIndex;
      }
      function pn(e) {
        P.lFrame.selectedIndex = e;
      }
      function ne() {
        const e = P.lFrame;
        return Hc(e.tView, e.selectedIndex);
      }
      function Uo(e, t) {
        for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
          const i = e.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: u,
              ngAfterViewChecked: l,
              ngOnDestroy: c,
            } = i;
          s && (e.contentHooks || (e.contentHooks = [])).push(-n, s),
            a &&
              ((e.contentHooks || (e.contentHooks = [])).push(n, a),
              (e.contentCheckHooks || (e.contentCheckHooks = [])).push(n, a)),
            u && (e.viewHooks || (e.viewHooks = [])).push(-n, u),
            l &&
              ((e.viewHooks || (e.viewHooks = [])).push(n, l),
              (e.viewCheckHooks || (e.viewCheckHooks = [])).push(n, l)),
            null != c && (e.destroyHooks || (e.destroyHooks = [])).push(n, c);
        }
      }
      function Go(e, t, n) {
        td(e, t, 3, n);
      }
      function zo(e, t, n, r) {
        (3 & e[2]) === n && td(e, t, n, r);
      }
      function Gs(e, t) {
        let n = e[2];
        (3 & n) === t && ((n &= 2047), (n += 1), (e[2] = n));
      }
      function td(e, t, n, r) {
        const i = r ?? -1,
          s = t.length - 1;
        let a = 0;
        for (let u = void 0 !== r ? 65535 & e[18] : 0; u < s; u++)
          if ("number" == typeof t[u + 1]) {
            if (((a = t[u]), null != r && a >= r)) break;
          } else
            t[u] < 0 && (e[18] += 65536),
              (a < i || -1 == i) &&
                (R_(e, n, t, u), (e[18] = (4294901760 & e[18]) + u + 2)),
              u++;
      }
      function R_(e, t, n, r) {
        const o = n[r] < 0,
          i = n[r + 1],
          a = e[o ? -n[r] : n[r]];
        if (o) {
          if (e[2] >> 11 < e[18] >> 16 && (3 & e[2]) === t) {
            e[2] += 2048;
            try {
              i.call(a);
            } finally {
            }
          }
        } else
          try {
            i.call(a);
          } finally {
          }
      }
      class Or {
        constructor(t, n, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function Ws(e, t, n) {
        let r = 0;
        for (; r < n.length; ) {
          const o = n[r];
          if ("number" == typeof o) {
            if (0 !== o) break;
            r++;
            const i = n[r++],
              s = n[r++],
              a = n[r++];
            e.setAttribute(t, s, a, i);
          } else {
            const i = o,
              s = n[++r];
            rd(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
          }
        }
        return r;
      }
      function nd(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function rd(e) {
        return 64 === e.charCodeAt(0);
      }
      function Pr(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const o = t[r];
              "number" == typeof o
                ? (n = o)
                : 0 === n ||
                  od(e, n, o, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function od(e, t, n, r, o) {
        let i = 0,
          s = e.length;
        if (-1 === t) s = -1;
        else
          for (; i < e.length; ) {
            const a = e[i++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = i - 1;
                break;
              }
            }
          }
        for (; i < e.length; ) {
          const a = e[i];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== o && (e[i + 1] = o));
            if (r === e[i + 1]) return void (e[i + 2] = o);
          }
          i++, null !== r && i++, null !== o && i++;
        }
        -1 !== s && (e.splice(s, 0, t), (i = s + 1)),
          e.splice(i++, 0, n),
          null !== r && e.splice(i++, 0, r),
          null !== o && e.splice(i++, 0, o);
      }
      function id(e) {
        return -1 !== e;
      }
      function Wo(e) {
        return 32767 & e;
      }
      function qo(e, t) {
        let n = (function B_(e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[15]), n--;
        return r;
      }
      let qs = !0;
      function Zo(e) {
        const t = qs;
        return (qs = e), t;
      }
      let j_ = 0;
      const vt = {};
      function Ko(e, t) {
        const n = ud(e, t);
        if (-1 !== n) return n;
        const r = t[1];
        r.firstCreatePass &&
          ((e.injectorIndex = t.length),
          Zs(r.data, e),
          Zs(t, null),
          Zs(r.blueprint, null));
        const o = Ks(e, t),
          i = e.injectorIndex;
        if (id(o)) {
          const s = Wo(o),
            a = qo(o, t),
            u = a[1].data;
          for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | u[s + l];
        }
        return (t[i + 8] = o), i;
      }
      function Zs(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function ud(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function Ks(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let n = 0,
          r = null,
          o = t;
        for (; null !== o; ) {
          if (((r = gd(o)), null === r)) return -1;
          if ((n++, (o = o[15]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return -1;
      }
      function Ys(e, t, n) {
        !(function H_(e, t, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(br) && (r = n[br]),
            null == r && (r = n[br] = j_++);
          const o = 255 & r;
          t.data[e + (o >> 5)] |= 1 << o;
        })(e, t, n);
      }
      function ld(e, t, n) {
        if (n & T.Optional || void 0 !== e) return e;
        No();
      }
      function cd(e, t, n, r) {
        if (
          (n & T.Optional && void 0 === r && (r = null),
          !(n & (T.Self | T.Host)))
        ) {
          const o = e[9],
            i = Ye(void 0);
          try {
            return o ? o.get(t, r, n & T.Optional) : bc(t, r, n & T.Optional);
          } finally {
            Ye(i);
          }
        }
        return ld(r, 0, n);
      }
      function dd(e, t, n, r = T.Default, o) {
        if (null !== e) {
          if (1024 & t[2]) {
            const s = (function W_(e, t, n, r, o) {
              let i = e,
                s = t;
              for (
                ;
                null !== i && null !== s && 1024 & s[2] && !(256 & s[2]);

              ) {
                const a = fd(i, s, n, r | T.Self, vt);
                if (a !== vt) return a;
                let u = i.parent;
                if (!u) {
                  const l = s[21];
                  if (l) {
                    const c = l.get(n, vt, r);
                    if (c !== vt) return c;
                  }
                  (u = gd(s)), (s = s[15]);
                }
                i = u;
              }
              return o;
            })(e, t, n, r, vt);
            if (s !== vt) return s;
          }
          const i = fd(e, t, n, r, vt);
          if (i !== vt) return i;
        }
        return cd(t, n, r, o);
      }
      function fd(e, t, n, r, o) {
        const i = (function G_(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const t = e.hasOwnProperty(br) ? e[br] : void 0;
          return "number" == typeof t ? (t >= 0 ? 255 & t : z_) : t;
        })(n);
        if ("function" == typeof i) {
          if (!Yc(t, e, r)) return r & T.Host ? ld(o, 0, r) : cd(t, n, r, o);
          try {
            const s = i(r);
            if (null != s || r & T.Optional) return s;
            No();
          } finally {
            ed();
          }
        } else if ("number" == typeof i) {
          let s = null,
            a = ud(e, t),
            u = -1,
            l = r & T.Host ? t[16][6] : null;
          for (
            (-1 === a || r & T.SkipSelf) &&
            ((u = -1 === a ? Ks(e, t) : t[a + 8]),
            -1 !== u && pd(r, !1)
              ? ((s = t[1]), (a = Wo(u)), (t = qo(u, t)))
              : (a = -1));
            -1 !== a;

          ) {
            const c = t[1];
            if (hd(i, a, c.data)) {
              const d = U_(a, t, n, s, r, l);
              if (d !== vt) return d;
            }
            (u = t[a + 8]),
              -1 !== u && pd(r, t[1].data[a + 8] === l) && hd(i, a, t)
                ? ((s = c), (a = Wo(u)), (t = qo(u, t)))
                : (a = -1);
          }
        }
        return o;
      }
      function U_(e, t, n, r, o, i) {
        const s = t[1],
          a = s.data[e + 8],
          c = (function Yo(e, t, n, r, o) {
            const i = e.providerIndexes,
              s = t.data,
              a = 1048575 & i,
              u = e.directiveStart,
              c = i >> 20,
              f = o ? a + c : e.directiveEnd;
            for (let h = r ? a : a + c; h < f; h++) {
              const p = s[h];
              if ((h < u && n === p) || (h >= u && p.type === n)) return h;
            }
            if (o) {
              const h = s[u];
              if (h && at(h) && h.type === n) return u;
            }
            return null;
          })(
            a,
            s,
            n,
            null == r ? Nr(a) && qs : r != s && 0 != (3 & a.type),
            o & T.Host && i === a
          );
        return null !== c ? gn(t, s, c, a) : vt;
      }
      function gn(e, t, n, r) {
        let o = e[n];
        const i = t.data;
        if (
          (function k_(e) {
            return e instanceof Or;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function BD(e, t) {
              const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new C(
                -200,
                `Circular dependency in DI detected for ${e}${n}`
              );
            })(
              (function $(e) {
                return "function" == typeof e
                  ? e.name || e.toString()
                  : "object" == typeof e &&
                    null != e &&
                    "function" == typeof e.type
                  ? e.type.name || e.type.toString()
                  : O(e);
              })(i[n])
            );
          const a = Zo(s.canSeeViewProviders);
          s.resolving = !0;
          const u = s.injectImpl ? Ye(s.injectImpl) : null;
          Yc(e, r, T.Default);
          try {
            (o = e[n] = s.factory(void 0, i, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function x_(e, t, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: o,
                    ngDoCheck: i,
                  } = t.type.prototype;
                  if (r) {
                    const s = kc(t);
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(e, s),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, s);
                  }
                  o &&
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(0 - e, o),
                    i &&
                      ((n.preOrderHooks || (n.preOrderHooks = [])).push(e, i),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, i));
                })(n, i[n], t);
          } finally {
            null !== u && Ye(u), Zo(a), (s.resolving = !1), ed();
          }
        }
        return o;
      }
      function hd(e, t, n) {
        return !!(n[t + (e >> 5)] & (1 << e));
      }
      function pd(e, t) {
        return !(e & T.Self || (e & T.Host && t));
      }
      class jn {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return dd(this._tNode, this._lView, t, xo(r), n);
        }
      }
      function z_() {
        return new jn(ve(), y());
      }
      function gd(e) {
        const t = e[1],
          n = t.type;
        return 2 === n ? t.declTNode : 1 === n ? e[6] : null;
      }
      class F {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = Y({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      function mn(e, t) {
        e.forEach((n) => (Array.isArray(n) ? mn(n, t) : t(n)));
      }
      function yd(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function Qo(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      var Be = (() => (
        ((Be = Be || {})[(Be.Important = 1)] = "Important"),
        (Be[(Be.DashCase = 2)] = "DashCase"),
        Be
      ))();
      const aa = new Map();
      let Dv = 0;
      const la = "__ngContext__";
      function Ae(e, t) {
        Ge(t)
          ? ((e[la] = t[20]),
            (function vv(e) {
              aa.set(e[20], e);
            })(t))
          : (e[la] = t);
      }
      function da(e, t) {
        return undefined(e, t);
      }
      function jr(e) {
        const t = e[3];
        return st(t) ? t[3] : t;
      }
      function fa(e) {
        return Vd(e[13]);
      }
      function ha(e) {
        return Vd(e[4]);
      }
      function Vd(e) {
        for (; null !== e && !st(e); ) e = e[4];
        return e;
      }
      function qn(e, t, n, r, o) {
        if (null != r) {
          let i,
            s = !1;
          st(r) ? (i = r) : Ge(r) && ((s = !0), (r = r[0]));
          const a = _e(r);
          0 === e && null !== n
            ? null == o
              ? Gd(t, n, a)
              : yn(t, n, a, o || null, !0)
            : 1 === e && null !== n
            ? yn(t, n, a, o || null, !0)
            : 2 === e
            ? (function va(e, t, n) {
                const r = ri(e, t);
                r &&
                  (function jv(e, t, n, r) {
                    e.removeChild(t, n, r);
                  })(e, r, t, n);
              })(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != i &&
              (function Uv(e, t, n, r, o) {
                const i = n[7];
                i !== _e(n) && qn(t, e, r, i, o);
                for (let a = 10; a < n.length; a++) {
                  const u = n[a];
                  Hr(u[1], u, e, t, r, i);
                }
              })(t, e, i, n, o);
        }
      }
      function ga(e, t, n) {
        return e.createElement(t, n);
      }
      function jd(e, t) {
        const n = e[9],
          r = n.indexOf(t),
          o = t[3];
        512 & t[2] && ((t[2] &= -513), ks(o, -1)), n.splice(r, 1);
      }
      function ma(e, t) {
        if (e.length <= 10) return;
        const n = 10 + t,
          r = e[n];
        if (r) {
          const o = r[17];
          null !== o && o !== e && jd(o, r), t > 0 && (e[n - 1][4] = r[4]);
          const i = Qo(e, 10 + t);
          !(function Ov(e, t) {
            Hr(e, t, t[L], 2, null, null), (t[0] = null), (t[6] = null);
          })(r[1], r);
          const s = i[19];
          null !== s && s.detachView(i[1]),
            (r[3] = null),
            (r[4] = null),
            (r[2] &= -65);
        }
        return r;
      }
      function Hd(e, t) {
        if (!(128 & t[2])) {
          const n = t[L];
          n.destroyNode && Hr(e, t, n, 3, null, null),
            (function Rv(e) {
              let t = e[13];
              if (!t) return ya(e[1], e);
              for (; t; ) {
                let n = null;
                if (Ge(t)) n = t[13];
                else {
                  const r = t[10];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[4] && t !== e; )
                    Ge(t) && ya(t[1], t), (t = t[3]);
                  null === t && (t = e), Ge(t) && ya(t[1], t), (n = t && t[4]);
                }
                t = n;
              }
            })(t);
        }
      }
      function ya(e, t) {
        if (!(128 & t[2])) {
          (t[2] &= -65),
            (t[2] |= 128),
            (function Bv(e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const o = t[n[r]];
                  if (!(o instanceof Or)) {
                    const i = n[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          u = i[s + 1];
                        try {
                          u.call(a);
                        } finally {
                        }
                      }
                    else
                      try {
                        i.call(o);
                      } finally {
                      }
                  }
                }
            })(e, t),
            (function Vv(e, t) {
              const n = e.cleanup,
                r = t[7];
              let o = -1;
              if (null !== n)
                for (let i = 0; i < n.length - 1; i += 2)
                  if ("string" == typeof n[i]) {
                    const s = n[i + 3];
                    s >= 0 ? r[(o = s)]() : r[(o = -s)].unsubscribe(), (i += 2);
                  } else {
                    const s = r[(o = n[i + 1])];
                    n[i].call(s);
                  }
              if (null !== r) {
                for (let i = o + 1; i < r.length; i++) (0, r[i])();
                t[7] = null;
              }
            })(e, t),
            1 === t[1].type && t[L].destroy();
          const n = t[17];
          if (null !== n && st(t[3])) {
            n !== t[3] && jd(n, t);
            const r = t[19];
            null !== r && r.detachView(e);
          }
          !(function Cv(e) {
            aa.delete(e[20]);
          })(t);
        }
      }
      function $d(e, t, n) {
        return (function Ud(e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[0];
          {
            const { componentOffset: o } = r;
            if (o > -1) {
              const { encapsulation: i } = e.data[r.directiveStart + o];
              if (i === yt.None || i === yt.Emulated) return null;
            }
            return ze(r, n);
          }
        })(e, t.parent, n);
      }
      function yn(e, t, n, r, o) {
        e.insertBefore(t, n, r, o);
      }
      function Gd(e, t, n) {
        e.appendChild(t, n);
      }
      function zd(e, t, n, r, o) {
        null !== r ? yn(e, t, n, r, o) : Gd(e, t, n);
      }
      function ri(e, t) {
        return e.parentNode(t);
      }
      let Ea,
        Zd = function qd(e, t, n) {
          return 40 & e.type ? ze(e, n) : null;
        };
      function oi(e, t, n, r) {
        const o = $d(e, r, t),
          i = t[L],
          a = (function Wd(e, t, n) {
            return Zd(e, t, n);
          })(r.parent || t[6], r, t);
        if (null != o)
          if (Array.isArray(n))
            for (let u = 0; u < n.length; u++) zd(i, o, n[u], a, !1);
          else zd(i, o, n, a, !1);
      }
      function ii(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return ze(t, e);
          if (4 & n) return _a(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return ii(e, r);
            {
              const o = e[t.index];
              return st(o) ? _a(-1, o) : _e(o);
            }
          }
          if (32 & n) return da(t, e)() || _e(e[t.index]);
          {
            const r = Yd(e, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : ii(jr(e[16]), r)
              : ii(e, t.next);
          }
        }
        return null;
      }
      function Yd(e, t) {
        return null !== t ? e[16][6].projection[t.projection] : null;
      }
      function _a(e, t) {
        const n = 10 + e + 1;
        if (n < t.length) {
          const r = t[n],
            o = r[1].firstChild;
          if (null !== o) return ii(r, o);
        }
        return t[7];
      }
      function Ca(e, t, n, r, o, i, s) {
        for (; null != n; ) {
          const a = r[n.index],
            u = n.type;
          if (
            (s && 0 === t && (a && Ae(_e(a), r), (n.flags |= 2)),
            32 != (32 & n.flags))
          )
            if (8 & u) Ca(e, t, n.child, r, o, i, !1), qn(t, e, o, a, i);
            else if (32 & u) {
              const l = da(n, r);
              let c;
              for (; (c = l()); ) qn(t, e, o, c, i);
              qn(t, e, o, a, i);
            } else 16 & u ? Qd(e, t, r, n, o, i) : qn(t, e, o, a, i);
          n = s ? n.projectionNext : n.next;
        }
      }
      function Hr(e, t, n, r, o, i) {
        Ca(n, r, e.firstChild, t, o, i, !1);
      }
      function Qd(e, t, n, r, o, i) {
        const s = n[16],
          u = s[6].projection[r.projection];
        if (Array.isArray(u))
          for (let l = 0; l < u.length; l++) qn(t, e, o, u[l], i);
        else Ca(e, t, u, s[3], o, i, !0);
      }
      function Xd(e, t, n) {
        "" === n
          ? e.removeAttribute(t, "class")
          : e.setAttribute(t, "class", n);
      }
      function Jd(e, t, n) {
        const { mergedAttrs: r, classes: o, styles: i } = n;
        null !== r && Ws(e, t, r),
          null !== o && Xd(e, t, o),
          null !== i &&
            (function zv(e, t, n) {
              e.setAttribute(t, "style", n);
            })(e, t, i);
      }
      class of {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${vc})`;
        }
      }
      const iC =
        /^(?:(?:https?|mailto|data|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;
      var de = (() => (
        ((de = de || {})[(de.NONE = 0)] = "NONE"),
        (de[(de.HTML = 1)] = "HTML"),
        (de[(de.STYLE = 2)] = "STYLE"),
        (de[(de.SCRIPT = 3)] = "SCRIPT"),
        (de[(de.URL = 4)] = "URL"),
        (de[(de.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        de
      ))();
      function Ta(e) {
        const t = (function Gr() {
          const e = y();
          return e && e[12];
        })();
        return t
          ? t.sanitize(de.URL, e) || ""
          : (function $r(e, t) {
              const n = (function tC(e) {
                return (e instanceof of && e.getTypeName()) || null;
              })(e);
              if (null != n && n !== t) {
                if ("ResourceURL" === n && "URL" === t) return !0;
                throw new Error(`Required a safe ${t}, got a ${n} (see ${vc})`);
              }
              return n === t;
            })(e, "URL")
          ? (function Qt(e) {
              return e instanceof of
                ? e.changingThisBreaksApplicationSecurity
                : e;
            })(e)
          : (function Ia(e) {
              return (e = String(e)).match(iC) ? e : "unsafe:" + e;
            })(O(e));
      }
      const hf = new F("ENVIRONMENT_INITIALIZER"),
        pf = new F("INJECTOR", -1),
        gf = new F("INJECTOR_DEF_TYPES");
      class mf {
        get(t, n = Cr) {
          if (n === Cr) {
            const r = new Error(`NullInjectorError: No provider for ${Z(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      function _C(...e) {
        return { ɵproviders: yf(0, e), ɵfromNgModule: !0 };
      }
      function yf(e, ...t) {
        const n = [],
          r = new Set();
        let o;
        return (
          mn(t, (i) => {
            const s = i;
            Na(s, n, [], r) && (o || (o = []), o.push(s));
          }),
          void 0 !== o && Df(o, n),
          n
        );
      }
      function Df(e, t) {
        for (let n = 0; n < e.length; n++) {
          const { providers: o } = e[n];
          Fa(o, (i) => {
            t.push(i);
          });
        }
      }
      function Na(e, t, n, r) {
        if (!(e = M(e))) return !1;
        let o = null,
          i = wc(e);
        const s = !i && G(e);
        if (i || s) {
          if (s && !s.standalone) return !1;
          o = e;
        } else {
          const u = e.ngModule;
          if (((i = wc(u)), !i)) return !1;
          o = u;
        }
        const a = r.has(o);
        if (s) {
          if (a) return !1;
          if ((r.add(o), s.dependencies)) {
            const u =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const l of u) Na(l, t, n, r);
          }
        } else {
          if (!i) return !1;
          {
            if (null != i.imports && !a) {
              let l;
              r.add(o);
              try {
                mn(i.imports, (c) => {
                  Na(c, t, n, r) && (l || (l = []), l.push(c));
                });
              } finally {
              }
              void 0 !== l && Df(l, t);
            }
            if (!a) {
              const l = dn(o) || (() => new o());
              t.push(
                { provide: o, useFactory: l, deps: H },
                { provide: gf, useValue: o, multi: !0 },
                { provide: hf, useValue: () => B(o), multi: !0 }
              );
            }
            const u = i.providers;
            null == u ||
              a ||
              Fa(u, (c) => {
                t.push(c);
              });
          }
        }
        return o !== e && void 0 !== e.providers;
      }
      function Fa(e, t) {
        for (let n of e)
          Is(n) && (n = n.ɵproviders), Array.isArray(n) ? Fa(n, t) : t(n);
      }
      const vC = W({ provide: String, useValue: W });
      function Oa(e) {
        return null !== e && "object" == typeof e && vC in e;
      }
      function _n(e) {
        return "function" == typeof e;
      }
      const Pa = new F("Set Injector scope."),
        li = {},
        wC = {};
      let xa;
      function ci() {
        return void 0 === xa && (xa = new mf()), xa;
      }
      class Zn {}
      class Cf extends Zn {
        get destroyed() {
          return this._destroyed;
        }
        constructor(t, n, r, o) {
          super(),
            (this.parent = n),
            (this.source = r),
            (this.scopes = o),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            ka(t, (s) => this.processProvider(s)),
            this.records.set(pf, Kn(void 0, this)),
            o.has("environment") && this.records.set(Zn, Kn(void 0, this));
          const i = this.records.get(Pa);
          null != i && "string" == typeof i.value && this.scopes.add(i.value),
            (this.injectorDefTypes = new Set(this.get(gf.multi, H, T.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const t of this._ngOnDestroyHooks) t.ngOnDestroy();
            for (const t of this._onDestroyHooks) t();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear(),
              (this._onDestroyHooks.length = 0);
          }
        }
        onDestroy(t) {
          this._onDestroyHooks.push(t);
        }
        runInContext(t) {
          this.assertNotDestroyed();
          const n = On(this),
            r = Ye(void 0);
          try {
            return t();
          } finally {
            On(n), Ye(r);
          }
        }
        get(t, n = Cr, r = T.Default) {
          this.assertNotDestroyed(), (r = xo(r));
          const o = On(this),
            i = Ye(void 0);
          try {
            if (!(r & T.SkipSelf)) {
              let a = this.records.get(t);
              if (void 0 === a) {
                const u =
                  (function SC(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof F)
                    );
                  })(t) && Fo(t);
                (a = u && this.injectableDefInScope(u) ? Kn(Ra(t), li) : null),
                  this.records.set(t, a);
              }
              if (null != a) return this.hydrate(t, a);
            }
            return (r & T.Self ? ci() : this.parent).get(
              t,
              (n = r & T.Optional && n === Cr ? null : n)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[Po] = s[Po] || []).unshift(Z(t)), o)) throw s;
              return (function e_(e, t, n, r) {
                const o = e[Po];
                throw (
                  (t[Ic] && o.unshift(t[Ic]),
                  (e.message = (function t_(e, t, n, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1)
                        ? e.slice(2)
                        : e;
                    let o = Z(t);
                    if (Array.isArray(t)) o = t.map(Z).join(" -> ");
                    else if ("object" == typeof t) {
                      let i = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          i.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : Z(a))
                          );
                        }
                      o = `{${i.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
                      KD,
                      "\n  "
                    )}`;
                  })("\n" + e.message, o, n, r)),
                  (e.ngTokenPath = o),
                  (e[Po] = null),
                  e)
                );
              })(s, t, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            Ye(i), On(o);
          }
        }
        resolveInjectorInitializers() {
          const t = On(this),
            n = Ye(void 0);
          try {
            const r = this.get(hf.multi, H, T.Self);
            for (const o of r) o();
          } finally {
            On(t), Ye(n);
          }
        }
        toString() {
          const t = [],
            n = this.records;
          for (const r of n.keys()) t.push(Z(r));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new C(205, !1);
        }
        processProvider(t) {
          let n = _n((t = M(t))) ? t : M(t && t.provide);
          const r = (function bC(e) {
            return Oa(e)
              ? Kn(void 0, e.useValue)
              : Kn(
                  (function wf(e, t, n) {
                    let r;
                    if (_n(e)) {
                      const o = M(e);
                      return dn(o) || Ra(o);
                    }
                    if (Oa(e)) r = () => M(e.useValue);
                    else if (
                      (function vf(e) {
                        return !(!e || !e.useFactory);
                      })(e)
                    )
                      r = () => e.useFactory(...Ts(e.deps || []));
                    else if (
                      (function _f(e) {
                        return !(!e || !e.useExisting);
                      })(e)
                    )
                      r = () => B(M(e.useExisting));
                    else {
                      const o = M(e && (e.useClass || e.provide));
                      if (
                        !(function IC(e) {
                          return !!e.deps;
                        })(e)
                      )
                        return dn(o) || Ra(o);
                      r = () => new o(...Ts(e.deps));
                    }
                    return r;
                  })(e),
                  li
                );
          })(t);
          if (_n(t) || !0 !== t.multi) this.records.get(n);
          else {
            let o = this.records.get(n);
            o ||
              ((o = Kn(void 0, li, !0)),
              (o.factory = () => Ts(o.multi)),
              this.records.set(n, o)),
              (n = t),
              o.multi.push(t);
          }
          this.records.set(n, r);
        }
        hydrate(t, n) {
          return (
            n.value === li && ((n.value = wC), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function MC(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(n.value) &&
              this._ngOnDestroyHooks.add(n.value),
            n.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const n = M(t.providedIn);
          return "string" == typeof n
            ? "any" === n || this.scopes.has(n)
            : this.injectorDefTypes.has(n);
        }
      }
      function Ra(e) {
        const t = Fo(e),
          n = null !== t ? t.factory : dn(e);
        if (null !== n) return n;
        if (e instanceof F) throw new C(204, !1);
        if (e instanceof Function)
          return (function EC(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function kr(e, t) {
                  const n = [];
                  for (let r = 0; r < e; r++) n.push(t);
                  return n;
                })(t, "?"),
                new C(204, !1))
              );
            const n = (function GD(e) {
              const t = e && (e[Oo] || e[Ec]);
              if (t) {
                const n = (function zD(e) {
                  if (e.hasOwnProperty("name")) return e.name;
                  const t = ("" + e).match(/^function\s*([^\s(]+)/);
                  return null === t ? "" : t[1];
                })(e);
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${n}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${n}" class.`
                  ),
                  t
                );
              }
              return null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new C(204, !1);
      }
      function Kn(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function ka(e, t) {
        for (const n of e)
          Array.isArray(n) ? ka(n, t) : n && Is(n) ? ka(n.ɵproviders, t) : t(n);
      }
      class AC {}
      class Ef {}
      class NC {
        resolveComponentFactory(t) {
          throw (function TC(e) {
            const t = Error(
              `No component factory found for ${Z(
                e
              )}. Did you add it to @NgModule.entryComponents?`
            );
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let di = (() => {
        class e {}
        return (e.NULL = new NC()), e;
      })();
      function FC() {
        return Yn(ve(), y());
      }
      function Yn(e, t) {
        return new Je(ze(e, t));
      }
      let Je = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (e.__NG_ELEMENT_ID__ = FC), e;
      })();
      class If {}
      let xC = (() => {
        class e {}
        return (
          (e.ɵprov = Y({ token: e, providedIn: "root", factory: () => null })),
          e
        );
      })();
      class fi {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const RC = new fi("15.1.3"),
        La = {};
      function Ba(e) {
        return e.ngOriginalError;
      }
      class Qn {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t);
          this._console.error("ERROR", t),
            n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && Ba(t);
          for (; n && Ba(n); ) n = Ba(n);
          return n || null;
        }
      }
      function Sf(e, t, n) {
        let r = e.length;
        for (;;) {
          const o = e.indexOf(t, n);
          if (-1 === o) return o;
          if (0 === o || e.charCodeAt(o - 1) <= 32) {
            const i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
          }
          n = o + 1;
        }
      }
      const Af = "ng-template";
      function WC(e, t, n) {
        let r = 0;
        for (; r < e.length; ) {
          let o = e[r++];
          if (n && "class" === o) {
            if (((o = e[r]), -1 !== Sf(o.toLowerCase(), t, 0))) return !0;
          } else if (1 === o) {
            for (; r < e.length && "string" == typeof (o = e[r++]); )
              if (o.toLowerCase() === t) return !0;
            return !1;
          }
        }
        return !1;
      }
      function Tf(e) {
        return 4 === e.type && e.value !== Af;
      }
      function qC(e, t, n) {
        return t === (4 !== e.type || n ? e.value : Af);
      }
      function ZC(e, t, n) {
        let r = 4;
        const o = e.attrs || [],
          i = (function QC(e) {
            for (let t = 0; t < e.length; t++) if (nd(e[t])) return t;
            return e.length;
          })(o);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const u = t[a];
          if ("number" != typeof u) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== u && !qC(e, u, n)) || ("" === u && 1 === t.length))
                ) {
                  if (ut(r)) return !1;
                  s = !0;
                }
              } else {
                const l = 8 & r ? u : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!WC(e.attrs, l, n)) {
                    if (ut(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = KC(8 & r ? "class" : u, o, Tf(e), n);
                if (-1 === d) {
                  if (ut(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== l) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== Sf(h, l, 0)) || (2 & r && l !== f)) {
                    if (ut(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !ut(r) && !ut(u)) return !1;
            if (s && ut(u)) continue;
            (s = !1), (r = u | (1 & r));
          }
        }
        return ut(r) || s;
      }
      function ut(e) {
        return 0 == (1 & e);
      }
      function KC(e, t, n, r) {
        if (null === t) return -1;
        let o = 0;
        if (r || !n) {
          let i = !1;
          for (; o < t.length; ) {
            const s = t[o];
            if (s === e) return o;
            if (3 === s || 6 === s) i = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++o];
                for (; "string" == typeof a; ) a = t[++o];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                o += 4;
                continue;
              }
            }
            o += i ? 1 : 2;
          }
          return -1;
        }
        return (function XC(e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              const r = e[n];
              if ("number" == typeof r) return -1;
              if (r === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function Nf(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (ZC(e, t[r], n)) return !0;
        return !1;
      }
      function Ff(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function ew(e) {
        let t = e[0],
          n = 1,
          r = 2,
          o = "",
          i = !1;
        for (; n < e.length; ) {
          let s = e[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++n];
              o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
          else
            "" !== o && !ut(s) && ((t += Ff(i, o)), (o = "")),
              (r = s),
              (i = i || !ut(r));
          n++;
        }
        return "" !== o && (t += Ff(i, o)), t;
      }
      const x = {};
      function Lt(e) {
        Of(j(), y(), xe() + e, !1);
      }
      function Of(e, t, n, r) {
        if (!r)
          if (3 == (3 & t[2])) {
            const i = e.preOrderCheckHooks;
            null !== i && Go(t, i, n);
          } else {
            const i = e.preOrderHooks;
            null !== i && zo(t, i, 0, n);
          }
        pn(n);
      }
      function kf(e, t = null, n = null, r) {
        const o = Lf(e, t, n, r);
        return o.resolveInjectorInitializers(), o;
      }
      function Lf(e, t = null, n = null, r, o = new Set()) {
        const i = [n || H, _C(e)];
        return (
          (r = r || ("object" == typeof e ? void 0 : Z(e))),
          new Cf(i, t || ci(), r || null, o)
        );
      }
      let Vt = (() => {
        class e {
          static create(n, r) {
            if (Array.isArray(n)) return kf({ name: "" }, r, n, "");
            {
              const o = n.name ?? "";
              return kf({ name: o }, n.parent, n.providers, o);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = Cr),
          (e.NULL = new mf()),
          (e.ɵprov = Y({ token: e, providedIn: "any", factory: () => B(pf) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function v(e, t = T.Default) {
        const n = y();
        return null === n ? B(e, t) : dd(ve(), n, M(e), t);
      }
      function Gf(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const i = n[r + 1];
            if (-1 !== i) {
              const s = e.data[i];
              Hs(n[r]), s.contentQueries(2, t[i], i);
            }
          }
      }
      function pi(e, t, n, r, o, i, s, a, u, l, c) {
        const d = t.blueprint.slice();
        return (
          (d[0] = o),
          (d[2] = 76 | r),
          (null !== c || (e && 1024 & e[2])) && (d[2] |= 1024),
          $c(d),
          (d[3] = d[15] = e),
          (d[8] = n),
          (d[10] = s || (e && e[10])),
          (d[L] = a || (e && e[L])),
          (d[12] = u || (e && e[12]) || null),
          (d[9] = l || (e && e[9]) || null),
          (d[6] = i),
          (d[20] = (function _v() {
            return Dv++;
          })()),
          (d[21] = c),
          (d[16] = 2 == t.type ? e[16] : d),
          d
        );
      }
      function er(e, t, n, r, o) {
        let i = e.data[t];
        if (null === i)
          (i = (function Ga(e, t, n, r, o) {
            const i = zc(),
              s = Ls(),
              u = (e.data[t] = (function Sw(e, t, n, r, o, i) {
                return {
                  type: n,
                  index: r,
                  insertBeforeIndex: null,
                  injectorIndex: t ? t.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  componentOffset: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: o,
                  attrs: i,
                  mergedAttrs: null,
                  localNames: null,
                  initialInputs: void 0,
                  inputs: null,
                  outputs: null,
                  tViews: null,
                  next: null,
                  projectionNext: null,
                  child: null,
                  parent: t,
                  projection: null,
                  styles: null,
                  stylesWithoutHost: null,
                  residualStyles: void 0,
                  classes: null,
                  classesWithoutHost: null,
                  residualClasses: void 0,
                  classBindings: 0,
                  styleBindings: 0,
                };
              })(0, s ? i : i && i.parent, n, t, r, o));
            return (
              null === e.firstChild && (e.firstChild = u),
              null !== i &&
                (s
                  ? null == i.child && null !== u.parent && (i.child = u)
                  : null === i.next && (i.next = u)),
              u
            );
          })(e, t, n, r, o)),
            (function E_() {
              return P.lFrame.inI18n;
            })() && (i.flags |= 32);
        else if (64 & i.type) {
          (i.type = n), (i.value = r), (i.attrs = o);
          const s = (function Fr() {
            const e = P.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return _t(i, !0), i;
      }
      function zr(e, t, n, r) {
        if (0 === n) return -1;
        const o = t.length;
        for (let i = 0; i < n; i++)
          t.push(r), e.blueprint.push(r), e.data.push(null);
        return o;
      }
      function za(e, t, n) {
        $s(t);
        try {
          const r = e.viewQuery;
          null !== r && tu(1, r, n);
          const o = e.template;
          null !== o && zf(e, t, o, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && Gf(e, t),
            e.staticViewQueries && tu(2, e.viewQuery, n);
          const i = e.components;
          null !== i &&
            (function bw(e, t) {
              for (let n = 0; n < t.length; n++) Ww(e, t[n]);
            })(t, i);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[2] &= -5), Us();
        }
      }
      function gi(e, t, n, r) {
        const o = t[2];
        if (128 != (128 & o)) {
          $s(t);
          try {
            $c(t),
              (function qc(e) {
                return (P.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== n && zf(e, t, n, 2, r);
            const s = 3 == (3 & o);
            if (s) {
              const l = e.preOrderCheckHooks;
              null !== l && Go(t, l, null);
            } else {
              const l = e.preOrderHooks;
              null !== l && zo(t, l, 0, null), Gs(t, 0);
            }
            if (
              ((function Gw(e) {
                for (let t = fa(e); null !== t; t = ha(t)) {
                  if (!t[2]) continue;
                  const n = t[9];
                  for (let r = 0; r < n.length; r++) {
                    const o = n[r];
                    512 & o[2] || ks(o[3], 1), (o[2] |= 512);
                  }
                }
              })(t),
              (function Uw(e) {
                for (let t = fa(e); null !== t; t = ha(t))
                  for (let n = 10; n < t.length; n++) {
                    const r = t[n],
                      o = r[1];
                    $o(r) && gi(o, r, o.template, r[8]);
                  }
              })(t),
              null !== e.contentQueries && Gf(e, t),
              s)
            ) {
              const l = e.contentCheckHooks;
              null !== l && Go(t, l);
            } else {
              const l = e.contentHooks;
              null !== l && zo(t, l, 1), Gs(t, 1);
            }
            !(function ww(e, t) {
              const n = e.hostBindingOpCodes;
              if (null !== n)
                try {
                  for (let r = 0; r < n.length; r++) {
                    const o = n[r];
                    if (o < 0) pn(~o);
                    else {
                      const i = o,
                        s = n[++r],
                        a = n[++r];
                      b_(s, i), a(2, t[i]);
                    }
                  }
                } finally {
                  pn(-1);
                }
            })(e, t);
            const a = e.components;
            null !== a &&
              (function Ew(e, t) {
                for (let n = 0; n < t.length; n++) zw(e, t[n]);
              })(t, a);
            const u = e.viewQuery;
            if ((null !== u && tu(2, u, r), s)) {
              const l = e.viewCheckHooks;
              null !== l && Go(t, l);
            } else {
              const l = e.viewHooks;
              null !== l && zo(t, l, 2), Gs(t, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (t[2] &= -41),
              512 & t[2] && ((t[2] &= -513), ks(t[3], -1));
          } finally {
            Us();
          }
        }
      }
      function zf(e, t, n, r, o) {
        const i = xe(),
          s = 2 & r;
        try {
          pn(-1), s && t.length > 22 && Of(e, t, 22, !1), n(r, o);
        } finally {
          pn(i);
        }
      }
      function Wa(e, t, n) {
        if (xs(t)) {
          const o = t.directiveEnd;
          for (let i = t.directiveStart; i < o; i++) {
            const s = e.data[i];
            s.contentQueries && s.contentQueries(1, n[i], i);
          }
        }
      }
      function qa(e, t, n) {
        Gc() &&
          ((function Pw(e, t, n, r) {
            const o = n.directiveStart,
              i = n.directiveEnd;
            Nr(n) &&
              (function jw(e, t, n) {
                const r = ze(t, e),
                  o = Wf(n),
                  i = e[10],
                  s = mi(
                    e,
                    pi(
                      e,
                      o,
                      null,
                      n.onPush ? 32 : 16,
                      r,
                      t,
                      i,
                      i.createRenderer(r, n),
                      null,
                      null,
                      null
                    )
                  );
                e[t.index] = s;
              })(t, n, e.data[o + n.componentOffset]),
              e.firstCreatePass || Ko(n, t),
              Ae(r, t);
            const s = n.initialInputs;
            for (let a = o; a < i; a++) {
              const u = e.data[a],
                l = gn(t, e, a, n);
              Ae(l, t),
                null !== s && Hw(0, a - o, l, u, 0, s),
                at(u) && (We(n.index, t)[8] = gn(t, e, a, n));
            }
          })(e, t, n, ze(n, t)),
          64 == (64 & n.flags) && Xf(e, t, n));
      }
      function Za(e, t, n = ze) {
        const r = t.localNames;
        if (null !== r) {
          let o = t.index + 1;
          for (let i = 0; i < r.length; i += 2) {
            const s = r[i + 1],
              a = -1 === s ? n(t, e) : e[s];
            e[o++] = a;
          }
        }
      }
      function Wf(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = Ka(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts
            ))
          : t;
      }
      function Ka(e, t, n, r, o, i, s, a, u, l) {
        const c = 22 + r,
          d = c + o,
          f = (function Iw(e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : x);
            return n;
          })(c, d),
          h = "function" == typeof l ? l() : l;
        return (f[1] = {
          type: e,
          blueprint: f,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: f.slice().fill(null, c),
          bindingStartIndex: c,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof i ? i() : i,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: u,
          consts: h,
          incompleteFirstPass: !1,
        });
      }
      function Zf(e, t, n, r) {
        for (let o in e)
          if (e.hasOwnProperty(o)) {
            n = null === n ? {} : n;
            const i = e[o];
            null === r
              ? Kf(n, t, o, i)
              : r.hasOwnProperty(o) && Kf(n, t, r[o], i);
          }
        return n;
      }
      function Kf(e, t, n, r) {
        e.hasOwnProperty(n) ? e[n].push(t, r) : (e[n] = [t, r]);
      }
      function Ze(e, t, n, r, o, i, s, a) {
        const u = ze(t, n);
        let c,
          l = t.inputs;
        !a && null != l && (c = l[r])
          ? (nu(e, n, c, r, o), Nr(t) && Yf(n, t.index))
          : 3 & t.type &&
            ((r = (function Tw(e) {
              return "class" === e
                ? "className"
                : "for" === e
                ? "htmlFor"
                : "formaction" === e
                ? "formAction"
                : "innerHtml" === e
                ? "innerHTML"
                : "readonly" === e
                ? "readOnly"
                : "tabindex" === e
                ? "tabIndex"
                : e;
            })(r)),
            (o = null != s ? s(o, t.value || "", r) : o),
            i.setProperty(u, r, o));
      }
      function Yf(e, t) {
        const n = We(t, e);
        16 & n[2] || (n[2] |= 32);
      }
      function Ya(e, t, n, r) {
        let o = !1;
        if (Gc()) {
          const i = null === r ? null : { "": -1 },
            s = (function Rw(e, t) {
              const n = e.directiveRegistry;
              let r = null,
                o = null;
              if (n)
                for (let i = 0; i < n.length; i++) {
                  const s = n[i];
                  if (Nf(t, s.selectors, !1))
                    if ((r || (r = []), at(s)))
                      if (null !== s.findHostDirectiveDefs) {
                        const a = [];
                        (o = o || new Map()),
                          s.findHostDirectiveDefs(s, a, o),
                          r.unshift(...a, s),
                          Qa(e, t, a.length);
                      } else r.unshift(s), Qa(e, t, 0);
                    else
                      (o = o || new Map()),
                        s.findHostDirectiveDefs?.(s, r, o),
                        r.push(s);
                }
              return null === r ? null : [r, o];
            })(e, n);
          let a, u;
          null === s ? (a = u = null) : ([a, u] = s),
            null !== a && ((o = !0), Qf(e, t, n, a, i, u)),
            i &&
              (function kw(e, t, n) {
                if (t) {
                  const r = (e.localNames = []);
                  for (let o = 0; o < t.length; o += 2) {
                    const i = n[t[o + 1]];
                    if (null == i) throw new C(-301, !1);
                    r.push(t[o], i);
                  }
                }
              })(n, r, i);
        }
        return (n.mergedAttrs = Pr(n.mergedAttrs, n.attrs)), o;
      }
      function Qf(e, t, n, r, o, i) {
        for (let l = 0; l < r.length; l++) Ys(Ko(n, t), e, r[l].type);
        !(function Vw(e, t, n) {
          (e.flags |= 1),
            (e.directiveStart = t),
            (e.directiveEnd = t + n),
            (e.providerIndexes = t);
        })(n, e.data.length, r.length);
        for (let l = 0; l < r.length; l++) {
          const c = r[l];
          c.providersResolver && c.providersResolver(c);
        }
        let s = !1,
          a = !1,
          u = zr(e, t, r.length, null);
        for (let l = 0; l < r.length; l++) {
          const c = r[l];
          (n.mergedAttrs = Pr(n.mergedAttrs, c.hostAttrs)),
            Bw(e, n, t, u, c),
            Lw(u, c, o),
            null !== c.contentQueries && (n.flags |= 4),
            (null !== c.hostBindings ||
              null !== c.hostAttrs ||
              0 !== c.hostVars) &&
              (n.flags |= 64);
          const d = c.type.prototype;
          !s &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((e.preOrderHooks || (e.preOrderHooks = [])).push(n.index),
            (s = !0)),
            !a &&
              (d.ngOnChanges || d.ngDoCheck) &&
              ((e.preOrderCheckHooks || (e.preOrderCheckHooks = [])).push(
                n.index
              ),
              (a = !0)),
            u++;
        }
        !(function Aw(e, t, n) {
          const o = t.directiveEnd,
            i = e.data,
            s = t.attrs,
            a = [];
          let u = null,
            l = null;
          for (let c = t.directiveStart; c < o; c++) {
            const d = i[c],
              f = n ? n.get(d) : null,
              p = f ? f.outputs : null;
            (u = Zf(d.inputs, c, u, f ? f.inputs : null)),
              (l = Zf(d.outputs, c, l, p));
            const g = null === u || null === s || Tf(t) ? null : $w(u, c, s);
            a.push(g);
          }
          null !== u &&
            (u.hasOwnProperty("class") && (t.flags |= 8),
            u.hasOwnProperty("style") && (t.flags |= 16)),
            (t.initialInputs = a),
            (t.inputs = u),
            (t.outputs = l);
        })(e, n, i);
      }
      function Xf(e, t, n) {
        const r = n.directiveStart,
          o = n.directiveEnd,
          i = n.index,
          s = (function I_() {
            return P.lFrame.currentDirectiveIndex;
          })();
        try {
          pn(i);
          for (let a = r; a < o; a++) {
            const u = e.data[a],
              l = t[a];
            Bs(a),
              (null !== u.hostBindings ||
                0 !== u.hostVars ||
                null !== u.hostAttrs) &&
                xw(u, l);
          }
        } finally {
          pn(-1), Bs(s);
        }
      }
      function xw(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function Qa(e, t, n) {
        (t.componentOffset = n),
          (e.components || (e.components = [])).push(t.index);
      }
      function Lw(e, t, n) {
        if (n) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          at(t) && (n[""] = e);
        }
      }
      function Bw(e, t, n, r, o) {
        e.data[r] = o;
        const i = o.factory || (o.factory = dn(o.type)),
          s = new Or(i, at(o), v);
        (e.blueprint[r] = s),
          (n[r] = s),
          (function Fw(e, t, n, r, o) {
            const i = o.hostBindings;
            if (i) {
              let s = e.hostBindingOpCodes;
              null === s && (s = e.hostBindingOpCodes = []);
              const a = ~t.index;
              (function Ow(e) {
                let t = e.length;
                for (; t > 0; ) {
                  const n = e[--t];
                  if ("number" == typeof n && n < 0) return n;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(n, r, i);
            }
          })(e, t, r, zr(e, n, o.hostVars, x), o);
      }
      function Hw(e, t, n, r, o, i) {
        const s = i[t];
        if (null !== s) {
          const a = r.setInput;
          for (let u = 0; u < s.length; ) {
            const l = s[u++],
              c = s[u++],
              d = s[u++];
            null !== a ? r.setInput(n, d, l, c) : (n[c] = d);
          }
        }
      }
      function $w(e, t, n) {
        let r = null,
          o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (0 !== i)
            if (5 !== i) {
              if ("number" == typeof i) break;
              if (e.hasOwnProperty(i)) {
                null === r && (r = []);
                const s = e[i];
                for (let a = 0; a < s.length; a += 2)
                  if (s[a] === t) {
                    r.push(i, s[a + 1], n[o + 1]);
                    break;
                  }
              }
              o += 2;
            } else o += 2;
          else o += 4;
        }
        return r;
      }
      function Jf(e, t, n, r) {
        return [e, !0, !1, t, null, 0, r, n, null, null];
      }
      function zw(e, t) {
        const n = We(t, e);
        if ($o(n)) {
          const r = n[1];
          48 & n[2] ? gi(r, n, r.template, n[8]) : n[5] > 0 && Ja(n);
        }
      }
      function Ja(e) {
        for (let r = fa(e); null !== r; r = ha(r))
          for (let o = 10; o < r.length; o++) {
            const i = r[o];
            if ($o(i))
              if (512 & i[2]) {
                const s = i[1];
                gi(s, i, s.template, i[8]);
              } else i[5] > 0 && Ja(i);
          }
        const n = e[1].components;
        if (null !== n)
          for (let r = 0; r < n.length; r++) {
            const o = We(n[r], e);
            $o(o) && o[5] > 0 && Ja(o);
          }
      }
      function Ww(e, t) {
        const n = We(t, e),
          r = n[1];
        (function qw(e, t) {
          for (let n = t.length; n < e.blueprint.length; n++)
            t.push(e.blueprint[n]);
        })(r, n),
          za(r, n, n[8]);
      }
      function mi(e, t) {
        return e[13] ? (e[14][4] = t) : (e[13] = t), (e[14] = t), t;
      }
      function eu(e) {
        for (; e; ) {
          e[2] |= 32;
          const t = jr(e);
          if (i_(e) && !t) return e;
          e = t;
        }
        return null;
      }
      function yi(e, t, n, r = !0) {
        const o = t[10];
        o.begin && o.begin();
        try {
          gi(e, t, e.template, n);
        } catch (s) {
          throw (r && rh(t, s), s);
        } finally {
          o.end && o.end();
        }
      }
      function tu(e, t, n) {
        Hs(0), t(e, n);
      }
      function eh(e) {
        return e[7] || (e[7] = []);
      }
      function th(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function rh(e, t) {
        const n = e[9],
          r = n ? n.get(Qn, null) : null;
        r && r.handleError(t);
      }
      function nu(e, t, n, r, o) {
        for (let i = 0; i < n.length; ) {
          const s = n[i++],
            a = n[i++],
            u = t[s],
            l = e.data[s];
          null !== l.setInput ? l.setInput(u, o, r, a) : (u[a] = o);
        }
      }
      function Bt(e, t, n) {
        const r = (function Ho(e, t) {
          return _e(t[e]);
        })(t, e);
        !(function Bd(e, t, n) {
          e.setValue(t, n);
        })(e[L], r, n);
      }
      function Di(e, t, n) {
        let r = n ? e.styles : null,
          o = n ? e.classes : null,
          i = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a
              ? (i = a)
              : 1 == i
              ? (o = Es(o, a))
              : 2 == i && (r = Es(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r),
          n ? (e.classes = o) : (e.classesWithoutHost = o);
      }
      function _i(e, t, n, r, o = !1) {
        for (; null !== n; ) {
          const i = t[n.index];
          if ((null !== i && r.push(_e(i)), st(i)))
            for (let a = 10; a < i.length; a++) {
              const u = i[a],
                l = u[1].firstChild;
              null !== l && _i(u[1], u, l, r);
            }
          const s = n.type;
          if (8 & s) _i(e, t, n.child, r);
          else if (32 & s) {
            const a = da(n, t);
            let u;
            for (; (u = a()); ) r.push(u);
          } else if (16 & s) {
            const a = Yd(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const u = jr(t[16]);
              _i(u[1], u, a, r, !0);
            }
          }
          n = o ? n.projectionNext : n.next;
        }
        return r;
      }
      class Wr {
        get rootNodes() {
          const t = this._lView,
            n = t[1];
          return _i(n, t, n.firstChild, []);
        }
        constructor(t, n) {
          (this._lView = t),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get context() {
          return this._lView[8];
        }
        set context(t) {
          this._lView[8] = t;
        }
        get destroyed() {
          return 128 == (128 & this._lView[2]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[3];
            if (st(t)) {
              const n = t[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (ma(t, r), Qo(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          Hd(this._lView[1], this._lView);
        }
        onDestroy(t) {
          !(function qf(e, t, n, r) {
            const o = eh(t);
            null === n
              ? o.push(r)
              : (o.push(n), e.firstCreatePass && th(e).push(r, o.length - 1));
          })(this._lView[1], this._lView, null, t);
        }
        markForCheck() {
          eu(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -65;
        }
        reattach() {
          this._lView[2] |= 64;
        }
        detectChanges() {
          yi(this._lView[1], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new C(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function xv(e, t) {
              Hr(e, t, t[L], 2, null, null);
            })(this._lView[1], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new C(902, !1);
          this._appRef = t;
        }
      }
      class Zw extends Wr {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          yi(t[1], t, t[8], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class oh extends di {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = G(t);
          return new qr(n, this.ngModule);
        }
      }
      function ih(e) {
        const t = [];
        for (let n in e)
          e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      class Yw {
        constructor(t, n) {
          (this.injector = t), (this.parentInjector = n);
        }
        get(t, n, r) {
          r = xo(r);
          const o = this.injector.get(t, La, r);
          return o !== La || n === La ? o : this.parentInjector.get(t, n, r);
        }
      }
      class qr extends Ef {
        get inputs() {
          return ih(this.componentDef.inputs);
        }
        get outputs() {
          return ih(this.componentDef.outputs);
        }
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = (function tw(e) {
              return e.map(ew).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        create(t, n, r, o) {
          let i = (o = o || this.ngModule) instanceof Zn ? o : o?.injector;
          i &&
            null !== this.componentDef.getStandaloneInjector &&
            (i = this.componentDef.getStandaloneInjector(i) || i);
          const s = i ? new Yw(t, i) : t,
            a = s.get(If, null);
          if (null === a) throw new C(407, !1);
          const u = s.get(xC, null),
            l = a.createRenderer(null, this.componentDef),
            c = this.componentDef.selectors[0][0] || "div",
            d = r
              ? (function Mw(e, t, n) {
                  return e.selectRootElement(t, n === yt.ShadowDom);
                })(l, r, this.componentDef.encapsulation)
              : ga(
                  l,
                  c,
                  (function Kw(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(c)
                ),
            f = this.componentDef.onPush ? 288 : 272,
            h = Ka(0, null, null, 1, 0, null, null, null, null, null),
            p = pi(null, h, null, f, null, null, a, l, u, s, null);
          let g, D;
          $s(p);
          try {
            const _ = this.componentDef;
            let b,
              m = null;
            _.findHostDirectiveDefs
              ? ((b = []),
                (m = new Map()),
                _.findHostDirectiveDefs(_, b, m),
                b.push(_))
              : (b = [_]);
            const A = (function Xw(e, t) {
                const n = e[1];
                return (e[22] = t), er(n, 22, 2, "#host", null);
              })(p, d),
              q = (function Jw(e, t, n, r, o, i, s, a) {
                const u = o[1];
                !(function eE(e, t, n, r) {
                  for (const o of e)
                    t.mergedAttrs = Pr(t.mergedAttrs, o.hostAttrs);
                  null !== t.mergedAttrs &&
                    (Di(t, t.mergedAttrs, !0), null !== n && Jd(r, n, t));
                })(r, e, t, s);
                const l = i.createRenderer(t, n),
                  c = pi(
                    o,
                    Wf(n),
                    null,
                    n.onPush ? 32 : 16,
                    o[e.index],
                    e,
                    i,
                    l,
                    a || null,
                    null,
                    null
                  );
                return (
                  u.firstCreatePass && Qa(u, e, r.length - 1),
                  mi(o, c),
                  (o[e.index] = c)
                );
              })(A, d, _, b, p, a, l);
            (D = Hc(h, 22)),
              d &&
                (function nE(e, t, n, r) {
                  if (r) Ws(e, n, ["ng-version", RC.full]);
                  else {
                    const { attrs: o, classes: i } = (function nw(e) {
                      const t = [],
                        n = [];
                      let r = 1,
                        o = 2;
                      for (; r < e.length; ) {
                        let i = e[r];
                        if ("string" == typeof i)
                          2 === o
                            ? "" !== i && t.push(i, e[++r])
                            : 8 === o && n.push(i);
                        else {
                          if (!ut(o)) break;
                          o = i;
                        }
                        r++;
                      }
                      return { attrs: t, classes: n };
                    })(t.selectors[0]);
                    o && Ws(e, n, o),
                      i && i.length > 0 && Xd(e, n, i.join(" "));
                  }
                })(l, _, d, r),
              void 0 !== n &&
                (function rE(e, t, n) {
                  const r = (e.projection = []);
                  for (let o = 0; o < t.length; o++) {
                    const i = n[o];
                    r.push(null != i ? Array.from(i) : null);
                  }
                })(D, this.ngContentSelectors, n),
              (g = (function tE(e, t, n, r, o, i) {
                const s = ve(),
                  a = o[1],
                  u = ze(s, o);
                Qf(a, o, s, n, null, r);
                for (let c = 0; c < n.length; c++)
                  Ae(gn(o, a, s.directiveStart + c, s), o);
                Xf(a, o, s), u && Ae(u, o);
                const l = gn(o, a, s.directiveStart + s.componentOffset, s);
                if (((e[8] = o[8] = l), null !== i)) for (const c of i) c(l, t);
                return Wa(a, s, e), l;
              })(q, _, b, m, p, [oE])),
              za(h, p, null);
          } finally {
            Us();
          }
          return new Qw(this.componentType, g, Yn(D, p), p, D);
        }
      }
      class Qw extends AC {
        constructor(t, n, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new Zw(o)),
            (this.componentType = t);
        }
        setInput(t, n) {
          const r = this._tNode.inputs;
          let o;
          if (null !== r && (o = r[t])) {
            const i = this._rootLView;
            nu(i[1], i, o, t, n), Yf(i, this._tNode.index);
          }
        }
        get injector() {
          return new jn(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function oE() {
        const e = ve();
        Uo(y()[1], e);
      }
      function Te(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function nr(e, t, n, r) {
        return Te(e, Vn(), n) ? t + O(n) + r : x;
      }
      function Kr(e, t, n, r, o, i, s, a) {
        const u = y(),
          l = j(),
          c = e + 22,
          d = l.firstCreatePass
            ? (function DE(e, t, n, r, o, i, s, a, u) {
                const l = t.consts,
                  c = er(t, e, 4, s || null, Yt(l, a));
                Ya(t, n, c, Yt(l, u)), Uo(t, c);
                const d = (c.tViews = Ka(
                  2,
                  c,
                  r,
                  o,
                  i,
                  t.directiveRegistry,
                  t.pipeRegistry,
                  null,
                  t.schemas,
                  l
                ));
                return (
                  null !== t.queries &&
                    (t.queries.template(t, c),
                    (d.queries = t.queries.embeddedTView(c))),
                  c
                );
              })(c, l, u, t, n, r, o, i, s)
            : l.data[c];
        _t(d, !1);
        const f = u[L].createComment("");
        oi(l, u, f, d),
          Ae(f, u),
          mi(u, (u[c] = Jf(f, u, f, d))),
          jo(d) && qa(l, u, d),
          null != s && Za(u, d, a);
      }
      function cr(e, t, n) {
        const r = y();
        return Te(r, Vn(), t) && Ze(j(), ne(), r, e, t, r[L], n, !1), cr;
      }
      function iu(e, t, n, r, o) {
        const s = o ? "class" : "style";
        nu(e, n, t.inputs[s], s, r);
      }
      function ae(e, t, n, r) {
        const o = y(),
          i = j(),
          s = 22 + e,
          a = o[L],
          u = (o[s] = ga(
            a,
            t,
            (function P_() {
              return P.lFrame.currentNamespace;
            })()
          )),
          l = i.firstCreatePass
            ? (function CE(e, t, n, r, o, i, s) {
                const a = t.consts,
                  l = er(t, e, 2, o, Yt(a, i));
                return (
                  Ya(t, n, l, Yt(a, s)),
                  null !== l.attrs && Di(l, l.attrs, !1),
                  null !== l.mergedAttrs && Di(l, l.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, l),
                  l
                );
              })(s, i, o, 0, t, n, r)
            : i.data[s];
        return (
          _t(l, !0),
          Jd(a, u, l),
          32 != (32 & l.flags) && oi(i, o, u, l),
          0 ===
            (function y_() {
              return P.lFrame.elementDepthCount;
            })() && Ae(u, o),
          (function D_() {
            P.lFrame.elementDepthCount++;
          })(),
          jo(l) && (qa(i, o, l), Wa(i, l, o)),
          null !== r && Za(o, l),
          ae
        );
      }
      function ue() {
        let e = ve();
        Ls()
          ? (function Vs() {
              P.lFrame.isParent = !1;
            })()
          : ((e = e.parent), _t(e, !1));
        const t = e;
        !(function __() {
          P.lFrame.elementDepthCount--;
        })();
        const n = j();
        return (
          n.firstCreatePass && (Uo(n, e), xs(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function L_(e) {
              return 0 != (8 & e.flags);
            })(t) &&
            iu(n, t, y(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function V_(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            iu(n, t, y(), t.stylesWithoutHost, !1),
          ue
        );
      }
      function lt(e, t, n, r) {
        return ae(e, t, n, r), ue(), lt;
      }
      function Ei() {
        return y();
      }
      function bi(e) {
        return !!e && "function" == typeof e.then;
      }
      const Ch = function vh(e) {
        return !!e && "function" == typeof e.subscribe;
      };
      function Ce(e, t, n, r) {
        const o = y(),
          i = j(),
          s = ve();
        return (
          (function Eh(e, t, n, r, o, i, s) {
            const a = jo(r),
              l = e.firstCreatePass && th(e),
              c = t[8],
              d = eh(t);
            let f = !0;
            if (3 & r.type || s) {
              const g = ze(r, t),
                D = s ? s(g) : g,
                _ = d.length,
                b = s ? (A) => s(_e(A[r.index])) : r.index;
              let m = null;
              if (
                (!s &&
                  a &&
                  (m = (function EE(e, t, n, r) {
                    const o = e.cleanup;
                    if (null != o)
                      for (let i = 0; i < o.length - 1; i += 2) {
                        const s = o[i];
                        if (s === n && o[i + 1] === r) {
                          const a = t[7],
                            u = o[i + 2];
                          return a.length > u ? a[u] : null;
                        }
                        "string" == typeof s && (i += 2);
                      }
                    return null;
                  })(e, t, o, r.index)),
                null !== m)
              )
                ((m.__ngLastListenerFn__ || m).__ngNextListenerFn__ = i),
                  (m.__ngLastListenerFn__ = i),
                  (f = !1);
              else {
                i = Ih(r, t, c, i, !1);
                const A = n.listen(D, o, i);
                d.push(i, A), l && l.push(o, b, _, _ + 1);
              }
            } else i = Ih(r, t, c, i, !1);
            const h = r.outputs;
            let p;
            if (f && null !== h && (p = h[o])) {
              const g = p.length;
              if (g)
                for (let D = 0; D < g; D += 2) {
                  const q = t[p[D]][p[D + 1]].subscribe(i),
                    ce = d.length;
                  d.push(i, q), l && l.push(o, r.index, ce, -(ce + 1));
                }
            }
          })(i, o, o[L], s, e, t, r),
          Ce
        );
      }
      function bh(e, t, n, r) {
        try {
          return !1 !== n(r);
        } catch (o) {
          return rh(e, o), !1;
        }
      }
      function Ih(e, t, n, r, o) {
        return function i(s) {
          if (s === Function) return r;
          eu(e.componentOffset > -1 ? We(e.index, t) : t);
          let u = bh(t, 0, r, s),
            l = i.__ngNextListenerFn__;
          for (; l; ) (u = bh(t, 0, l, s) && u), (l = l.__ngNextListenerFn__);
          return o && !1 === u && (s.preventDefault(), (s.returnValue = !1)), u;
        };
      }
      function Ht(e = 1) {
        return (function S_(e) {
          return (P.lFrame.contextLView = (function A_(e, t) {
            for (; e > 0; ) (t = t[15]), e--;
            return t;
          })(e, P.lFrame.contextLView))[8];
        })(e);
      }
      function uu(e, t, n) {
        return lu(e, "", t, "", n), uu;
      }
      function lu(e, t, n, r, o) {
        const i = y(),
          s = nr(i, t, n, r);
        return s !== x && Ze(j(), ne(), i, e, s, i[L], o, !1), lu;
      }
      function tt(e, t = "") {
        const n = y(),
          r = j(),
          o = e + 22,
          i = r.firstCreatePass ? er(r, o, 1, t, null) : r.data[o],
          s = (n[o] = (function pa(e, t) {
            return e.createText(t);
          })(n[L], t));
        oi(r, n, s, i), _t(i, !1);
      }
      function Qr(e) {
        return Ai("", e, ""), Qr;
      }
      function Ai(e, t, n) {
        const r = y(),
          o = nr(r, e, t, n);
        return o !== x && Bt(r, xe(), o), Ai;
      }
      const hr = "en-US";
      let gp = hr;
      class pr {}
      class fI {}
      class Hp extends pr {
        constructor(t, n) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new oh(this));
          const r = (function Ue(e, t) {
            const n = e[Sc] || null;
            if (!n && !0 === t)
              throw new Error(
                `Type ${Z(e)} does not have '\u0275mod' property.`
              );
            return n;
          })(t);
          (this._bootstrapComponents = (function kt(e) {
            return e instanceof Function ? e() : e;
          })(r.bootstrap)),
            (this._r3Injector = Lf(
              t,
              n,
              [
                { provide: pr, useValue: this },
                { provide: di, useValue: this.componentFactoryResolver },
              ],
              Z(t),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(t));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class vu extends fI {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new Hp(this.moduleType, t);
        }
      }
      function wu(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const De = class $I extends Fn {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, n, r) {
          let o = t,
            i = n || (() => null),
            s = r;
          if (t && "object" == typeof t) {
            const u = t;
            (o = u.next?.bind(u)),
              (i = u.error?.bind(u)),
              (s = u.complete?.bind(u));
          }
          this.__isAsync && ((i = wu(i)), o && (o = wu(o)), s && (s = wu(s)));
          const a = super.subscribe({ next: o, error: i, complete: s });
          return t instanceof gt && t.add(a), a;
        }
      };
      let $t = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = WI), e;
      })();
      const GI = $t,
        zI = class extends GI {
          constructor(t, n, r) {
            super(),
              (this._declarationLView = t),
              (this._declarationTContainer = n),
              (this.elementRef = r);
          }
          createEmbeddedView(t, n) {
            const r = this._declarationTContainer.tViews,
              o = pi(
                this._declarationLView,
                r,
                t,
                16,
                null,
                r.declTNode,
                null,
                null,
                null,
                null,
                n || null
              );
            o[17] = this._declarationLView[this._declarationTContainer.index];
            const s = this._declarationLView[19];
            return (
              null !== s && (o[19] = s.createEmbeddedView(r)),
              za(r, o, t),
              new Wr(o)
            );
          }
        };
      function WI() {
        return (function Pi(e, t) {
          return 4 & e.type ? new zI(t, e, Yn(e, t)) : null;
        })(ve(), y());
      }
      let It = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = qI), e;
      })();
      function qI() {
        return (function ng(e, t) {
          let n;
          const r = t[e.index];
          if (st(r)) n = r;
          else {
            let o;
            if (8 & e.type) o = _e(r);
            else {
              const i = t[L];
              o = i.createComment("");
              const s = ze(e, t);
              yn(
                i,
                ri(i, s),
                o,
                (function Hv(e, t) {
                  return e.nextSibling(t);
                })(i, s),
                !1
              );
            }
            (t[e.index] = n = Jf(r, t, o, e)), mi(t, n);
          }
          return new eg(n, e, t);
        })(ve(), y());
      }
      const ZI = It,
        eg = class extends ZI {
          constructor(t, n, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return Yn(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new jn(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = Ks(this._hostTNode, this._hostLView);
            if (id(t)) {
              const n = qo(t, this._hostLView),
                r = Wo(t);
              return new jn(n[1].data[r + 8], n);
            }
            return new jn(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = tg(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - 10;
          }
          createEmbeddedView(t, n, r) {
            let o, i;
            "number" == typeof r
              ? (o = r)
              : null != r && ((o = r.index), (i = r.injector));
            const s = t.createEmbeddedView(n || {}, i);
            return this.insert(s, o), s;
          }
          createComponent(t, n, r, o, i) {
            const s =
              t &&
              !(function Rr(e) {
                return "function" == typeof e;
              })(t);
            let a;
            if (s) a = n;
            else {
              const d = n || {};
              (a = d.index),
                (r = d.injector),
                (o = d.projectableNodes),
                (i = d.environmentInjector || d.ngModuleRef);
            }
            const u = s ? t : new qr(G(t)),
              l = r || this.parentInjector;
            if (!i && null == u.ngModule) {
              const f = (s ? l : this.parentInjector).get(Zn, null);
              f && (i = f);
            }
            const c = u.create(l, o, void 0, i);
            return this.insert(c.hostView, a), c;
          }
          insert(t, n) {
            const r = t._lView,
              o = r[1];
            if (
              (function m_(e) {
                return st(e[3]);
              })(r)
            ) {
              const c = this.indexOf(t);
              if (-1 !== c) this.detach(c);
              else {
                const d = r[3],
                  f = new eg(d, d[6], d[3]);
                f.detach(f.indexOf(t));
              }
            }
            const i = this._adjustIndex(n),
              s = this._lContainer;
            !(function kv(e, t, n, r) {
              const o = 10 + r,
                i = n.length;
              r > 0 && (n[o - 1][4] = t),
                r < i - 10
                  ? ((t[4] = n[o]), yd(n, 10 + r, t))
                  : (n.push(t), (t[4] = null)),
                (t[3] = n);
              const s = t[17];
              null !== s &&
                n !== s &&
                (function Lv(e, t) {
                  const n = e[9];
                  t[16] !== t[3][3][16] && (e[2] = !0),
                    null === n ? (e[9] = [t]) : n.push(t);
                })(s, t);
              const a = t[19];
              null !== a && a.insertView(e), (t[2] |= 64);
            })(o, r, s, i);
            const a = _a(i, s),
              u = r[L],
              l = ri(u, s[7]);
            return (
              null !== l &&
                (function Pv(e, t, n, r, o, i) {
                  (r[0] = o), (r[6] = t), Hr(e, r, n, 1, o, i);
                })(o, s[6], u, r, l, a),
              t.attachToViewContainerRef(),
              yd(bu(s), i, t),
              t
            );
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = tg(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = ma(this._lContainer, n);
            r && (Qo(bu(this._lContainer), n), Hd(r[1], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = ma(this._lContainer, n);
            return r && null != Qo(bu(this._lContainer), n) ? new Wr(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return t ?? this.length + n;
          }
        };
      function tg(e) {
        return e[8];
      }
      function bu(e) {
        return e[8] || (e[8] = []);
      }
      function Ri(...e) {}
      const Mg = new F("Application Initializer");
      let ki = (() => {
        class e {
          constructor(n) {
            (this.appInits = n),
              (this.resolve = Ri),
              (this.reject = Ri),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, o) => {
                (this.resolve = r), (this.reject = o);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const n = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let o = 0; o < this.appInits.length; o++) {
                const i = this.appInits[o]();
                if (bi(i)) n.push(i);
                else if (Ch(i)) {
                  const s = new Promise((a, u) => {
                    i.subscribe({ complete: a, error: u });
                  });
                  n.push(s);
                }
              }
            Promise.all(n)
              .then(() => {
                r();
              })
              .catch((o) => {
                this.reject(o);
              }),
              0 === n.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(B(Mg, 8));
          }),
          (e.ɵprov = Y({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const so = new F("AppId", {
        providedIn: "root",
        factory: function Sg() {
          return `${xu()}${xu()}${xu()}`;
        },
      });
      function xu() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const Ag = new F("Platform Initializer"),
        Tg = new F("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        IM = new F("appBootstrapListener"),
        Ut = new F("LocaleId", {
          providedIn: "root",
          factory: () =>
            (function XD(e, t = T.Default) {
              return B(e, xo(t));
            })(Ut, T.Optional | T.SkipSelf) ||
            (function MM() {
              return (typeof $localize < "u" && $localize.locale) || hr;
            })(),
        }),
        FM = (() => Promise.resolve(0))();
      function Ru(e) {
        typeof Zone > "u"
          ? FM.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", e);
      }
      class we {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new De(!1)),
            (this.onMicrotaskEmpty = new De(!1)),
            (this.onStable = new De(!1)),
            (this.onError = new De(!1)),
            typeof Zone > "u")
          )
            throw new C(908, !1);
          Zone.assertZonePatched();
          const o = this;
          (o._nesting = 0),
            (o._outer = o._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
            (o.shouldCoalesceEventChangeDetection = !r && n),
            (o.shouldCoalesceRunChangeDetection = r),
            (o.lastRequestAnimationFrameId = -1),
            (o.nativeRequestAnimationFrame = (function OM() {
              let e = Q.requestAnimationFrame,
                t = Q.cancelAnimationFrame;
              if (typeof Zone < "u" && e && t) {
                const n = e[Zone.__symbol__("OriginalDelegate")];
                n && (e = n);
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
              }
              return {
                nativeRequestAnimationFrame: e,
                nativeCancelAnimationFrame: t,
              };
            })().nativeRequestAnimationFrame),
            (function RM(e) {
              const t = () => {
                !(function xM(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(Q, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                Lu(e),
                                (e.isCheckStableRunning = !0),
                                ku(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    Lu(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, o, i, s, a) => {
                  try {
                    return Og(e), n.invokeTask(o, i, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === i.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      Pg(e);
                  }
                },
                onInvoke: (n, r, o, i, s, a, u) => {
                  try {
                    return Og(e), n.invoke(o, i, s, a, u);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), Pg(e);
                  }
                },
                onHasTask: (n, r, o, i) => {
                  n.hasTask(o, i),
                    r === o &&
                      ("microTask" == i.change
                        ? ((e._hasPendingMicrotasks = i.microTask),
                          Lu(e),
                          ku(e))
                        : "macroTask" == i.change &&
                          (e.hasPendingMacrotasks = i.macroTask));
                },
                onHandleError: (n, r, o, i) => (
                  n.handleError(o, i),
                  e.runOutsideAngular(() => e.onError.emit(i)),
                  !1
                ),
              });
            })(o);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!we.isInAngularZone()) throw new C(909, !1);
        }
        static assertNotInAngularZone() {
          if (we.isInAngularZone()) throw new C(909, !1);
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, o) {
          const i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, t, PM, Ri, Ri);
          try {
            return i.runTask(s, n, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const PM = {};
      function ku(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function Lu(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function Og(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function Pg(e) {
        e._nesting--, ku(e);
      }
      class kM {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new De()),
            (this.onMicrotaskEmpty = new De()),
            (this.onStable = new De()),
            (this.onError = new De());
        }
        run(t, n, r) {
          return t.apply(n, r);
        }
        runGuarded(t, n, r) {
          return t.apply(n, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, n, r, o) {
          return t.apply(n, r);
        }
      }
      const xg = new F(""),
        Li = new F("");
      let ju,
        Vu = (() => {
          class e {
            constructor(n, r, o) {
              (this._ngZone = n),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                ju ||
                  ((function LM(e) {
                    ju = e;
                  })(o),
                  o.addToWindow(r)),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      we.assertNotInAngularZone(),
                        Ru(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                Ru(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, o) {
              let i = -1;
              r &&
                r > 0 &&
                (i = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== i
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
            }
            whenStable(n, r, o) {
              if (o && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, r, o), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(n) {
              this.registry.registerApplication(n, this);
            }
            unregisterApplication(n) {
              this.registry.unregisterApplication(n);
            }
            findProviders(n, r, o) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(B(we), B(Bu), B(Li));
            }),
            (e.ɵprov = Y({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Bu = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return ju?.findTestabilityInTree(this, n, r) ?? null;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = Y({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            })),
            e
          );
        })(),
        Jt = null;
      const Rg = new F("AllowMultipleToken"),
        Hu = new F("PlatformDestroyListeners");
      function Lg(e, t, n = []) {
        const r = `Platform: ${t}`,
          o = new F(r);
        return (i = []) => {
          let s = $u();
          if (!s || s.injector.get(Rg, !1)) {
            const a = [...n, ...i, { provide: o, useValue: !0 }];
            e
              ? e(a)
              : (function jM(e) {
                  if (Jt && !Jt.get(Rg, !1)) throw new C(400, !1);
                  Jt = e;
                  const t = e.get(Bg);
                  (function kg(e) {
                    const t = e.get(Ag, null);
                    t && t.forEach((n) => n());
                  })(e);
                })(
                  (function Vg(e = [], t) {
                    return Vt.create({
                      name: t,
                      providers: [
                        { provide: Pa, useValue: "platform" },
                        { provide: Hu, useValue: new Set([() => (Jt = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function $M(e) {
            const t = $u();
            if (!t) throw new C(401, !1);
            return t;
          })();
        };
      }
      function $u() {
        return Jt?.get(Bg) ?? null;
      }
      let Bg = (() => {
        class e {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const o = (function Hg(e, t) {
                let n;
                return (
                  (n =
                    "noop" === e
                      ? new kM()
                      : ("zone.js" === e ? void 0 : e) || new we(t)),
                  n
                );
              })(
                r?.ngZone,
                (function jg(e) {
                  return {
                    enableLongStackTrace: !1,
                    shouldCoalesceEventChangeDetection:
                      !(!e || !e.ngZoneEventCoalescing) || !1,
                    shouldCoalesceRunChangeDetection:
                      !(!e || !e.ngZoneRunCoalescing) || !1,
                  };
                })(r)
              ),
              i = [{ provide: we, useValue: o }];
            return o.run(() => {
              const s = Vt.create({
                  providers: i,
                  parent: this.injector,
                  name: n.moduleType.name,
                }),
                a = n.create(s),
                u = a.injector.get(Qn, null);
              if (!u) throw new C(402, !1);
              return (
                o.runOutsideAngular(() => {
                  const l = o.onError.subscribe({
                    next: (c) => {
                      u.handleError(c);
                    },
                  });
                  a.onDestroy(() => {
                    Vi(this._modules, a), l.unsubscribe();
                  });
                }),
                (function $g(e, t, n) {
                  try {
                    const r = n();
                    return bi(r)
                      ? r.catch((o) => {
                          throw (
                            (t.runOutsideAngular(() => e.handleError(o)), o)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(u, o, () => {
                  const l = a.injector.get(ki);
                  return (
                    l.runInitializers(),
                    l.donePromise.then(
                      () => (
                        (function mp(e) {
                          Ke(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (gp = e.toLowerCase().replace(/_/g, "-"));
                        })(a.injector.get(Ut, hr) || hr),
                        this._moduleDoBootstrap(a),
                        a
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const o = Ug({}, r);
            return (function VM(e, t, n) {
              const r = new vu(n);
              return Promise.resolve(r);
            })(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(Uu);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((o) => r.bootstrap(o));
            else {
              if (!n.instance.ngDoBootstrap) throw new C(-403, !1);
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new C(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const n = this._injector.get(Hu, null);
            n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(B(Vt));
          }),
          (e.ɵprov = Y({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      function Ug(e, t) {
        return Array.isArray(t) ? t.reduce(Ug, e) : { ...e, ...t };
      }
      let Uu = (() => {
        class e {
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          constructor(n, r, o) {
            (this._zone = n),
              (this._injector = r),
              (this._exceptionHandler = o),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription =
                this._zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this._zone.run(() => {
                      this.tick();
                    });
                  },
                }));
            const i = new Ee((a) => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    a.next(this._stable), a.complete();
                  });
              }),
              s = new Ee((a) => {
                let u;
                this._zone.runOutsideAngular(() => {
                  u = this._zone.onStable.subscribe(() => {
                    we.assertNotInAngularZone(),
                      Ru(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), a.next(!0));
                      });
                  });
                });
                const l = this._zone.onUnstable.subscribe(() => {
                  we.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        a.next(!1);
                      }));
                });
                return () => {
                  u.unsubscribe(), l.unsubscribe();
                };
              });
            this.isStable = kD(
              i,
              s.pipe(
                (function LD(e = {}) {
                  const {
                    connector: t = () => new Fn(),
                    resetOnError: n = !0,
                    resetOnComplete: r = !0,
                    resetOnRefCountZero: o = !0,
                  } = e;
                  return (i) => {
                    let s,
                      a,
                      u,
                      l = 0,
                      c = !1,
                      d = !1;
                    const f = () => {
                        a?.unsubscribe(), (a = void 0);
                      },
                      h = () => {
                        f(), (s = u = void 0), (c = d = !1);
                      },
                      p = () => {
                        const g = s;
                        h(), g?.unsubscribe();
                      };
                    return an((g, D) => {
                      l++, !d && !c && f();
                      const _ = (u = u ?? t());
                      D.add(() => {
                        l--, 0 === l && !d && !c && (a = Cs(p, o));
                      }),
                        _.subscribe(D),
                        !s &&
                          l > 0 &&
                          ((s = new vr({
                            next: (b) => _.next(b),
                            error: (b) => {
                              (d = !0), f(), (a = Cs(h, n, b)), _.error(b);
                            },
                            complete: () => {
                              (c = !0), f(), (a = Cs(h, r)), _.complete();
                            },
                          })),
                          St(g).subscribe(s));
                    })(i);
                  };
                })()
              )
            );
          }
          bootstrap(n, r) {
            const o = n instanceof Ef;
            if (!this._injector.get(ki).done)
              throw (
                (!o &&
                  (function Mr(e) {
                    const t = G(e) || be(e) || Fe(e);
                    return null !== t && t.standalone;
                  })(n),
                new C(405, false))
              );
            let s;
            (s = o ? n : this._injector.get(di).resolveComponentFactory(n)),
              this.componentTypes.push(s.componentType);
            const a = (function BM(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(pr),
              l = s.create(Vt.NULL, [], r || s.selector, a),
              c = l.location.nativeElement,
              d = l.injector.get(xg, null);
            return (
              d?.registerApplication(c),
              l.onDestroy(() => {
                this.detachView(l.hostView),
                  Vi(this.components, l),
                  d?.unregisterApplication(c);
              }),
              this._loadComponent(l),
              l
            );
          }
          tick() {
            if (this._runningTick) throw new C(101, !1);
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(n)
              );
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            Vi(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView), this.tick(), this.components.push(n);
            const r = this._injector.get(IM, []);
            r.push(...this._bootstrapListeners), r.forEach((o) => o(n));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((n) => n()),
                  this._views.slice().forEach((n) => n.destroy()),
                  this._onMicrotaskEmptySubscription.unsubscribe();
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(n) {
            return (
              this._destroyListeners.push(n),
              () => Vi(this._destroyListeners, n)
            );
          }
          destroy() {
            if (this._destroyed) throw new C(406, !1);
            const n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(B(we), B(Zn), B(Qn));
          }),
          (e.ɵprov = Y({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function Vi(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      const oS = Lg(null, "core", []);
      let iS = (() => {
          class e {
            constructor(n) {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(B(Uu));
            }),
            (e.ɵmod = Nt({ type: e })),
            (e.ɵinj = mt({})),
            e
          );
        })(),
        Ku = null;
      function Mn() {
        return Ku;
      }
      class uS {}
      const zt = new F("DocumentToken");
      let pm = (() => {
        class e {
          constructor(n, r) {
            (this._viewContainer = n),
              (this._context = new JS()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(n) {
            (this._context.$implicit = this._context.ngIf = n),
              this._updateView();
          }
          set ngIfThen(n) {
            gm("ngIfThen", n),
              (this._thenTemplateRef = n),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(n) {
            gm("ngIfElse", n),
              (this._elseTemplateRef = n),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(v(It), v($t));
          }),
          (e.ɵdir = N({
            type: e,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
            standalone: !0,
          })),
          e
        );
      })();
      class JS {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function gm(e, t) {
        if (t && !t.createEmbeddedView)
          throw new Error(
            `${e} must be a TemplateRef, but received '${Z(t)}'.`
          );
      }
      let Dm = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = Nt({ type: e })),
          (e.ɵinj = mt({})),
          e
        );
      })();
      class nA extends uS {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class hl extends nA {
        static makeCurrent() {
          !(function aS(e) {
            Ku || (Ku = e);
          })(new hl());
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r, !1),
            () => {
              t.removeEventListener(n, r, !1);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return "window" === n
            ? window
            : "document" === n
            ? t
            : "body" === n
            ? t.body
            : null;
        }
        getBaseHref(t) {
          const n = (function rA() {
            return (
              (fo = fo || document.querySelector("base")),
              fo ? fo.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function oA(e) {
                (Xi = Xi || document.createElement("a")),
                  Xi.setAttribute("href", e);
                const t = Xi.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          fo = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return (function qS(e, t) {
            t = encodeURIComponent(t);
            for (const n of e.split(";")) {
              const r = n.indexOf("="),
                [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
              if (o.trim() === t) return decodeURIComponent(i);
            }
            return null;
          })(document.cookie, t);
        }
      }
      let Xi,
        fo = null;
      const Im = new F("TRANSITION_ID"),
        sA = [
          {
            provide: Mg,
            useFactory: function iA(e, t, n) {
              return () => {
                n.get(ki).donePromise.then(() => {
                  const r = Mn(),
                    o = t.querySelectorAll(`style[ng-transition="${e}"]`);
                  for (let i = 0; i < o.length; i++) r.remove(o[i]);
                });
              };
            },
            deps: [Im, zt, Vt],
            multi: !0,
          },
        ];
      let uA = (() => {
        class e {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = Y({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Ji = new F("EventManagerPlugins");
      let es = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((o) => (o.manager = this)),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, o) {
            return this._findPluginFor(r).addEventListener(n, r, o);
          }
          addGlobalEventListener(n, r, o) {
            return this._findPluginFor(r).addGlobalEventListener(n, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            const r = this._eventNameToPlugin.get(n);
            if (r) return r;
            const o = this._plugins;
            for (let i = 0; i < o.length; i++) {
              const s = o[i];
              if (s.supports(n)) return this._eventNameToPlugin.set(n, s), s;
            }
            throw new Error(`No event manager plugin found for event ${n}`);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(B(Ji), B(we));
          }),
          (e.ɵprov = Y({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Mm {
        constructor(t) {
          this._doc = t;
        }
        addGlobalEventListener(t, n, r) {
          const o = Mn().getGlobalEventTarget(this._doc, t);
          if (!o)
            throw new Error(`Unsupported event target ${o} for event ${n}`);
          return this.addEventListener(o, n, r);
        }
      }
      let Sm = (() => {
          class e {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(n) {
              const r = new Set();
              n.forEach((o) => {
                this._stylesSet.has(o) || (this._stylesSet.add(o), r.add(o));
              }),
                this.onStylesAdded(r);
            }
            onStylesAdded(n) {}
            getAllStyles() {
              return Array.from(this._stylesSet);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = Y({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        ho = (() => {
          class e extends Sm {
            constructor(n) {
              super(),
                (this._doc = n),
                (this._hostNodes = new Map()),
                this._hostNodes.set(n.head, []);
            }
            _addStylesToHost(n, r, o) {
              n.forEach((i) => {
                const s = this._doc.createElement("style");
                (s.textContent = i), o.push(r.appendChild(s));
              });
            }
            addHost(n) {
              const r = [];
              this._addStylesToHost(this._stylesSet, n, r),
                this._hostNodes.set(n, r);
            }
            removeHost(n) {
              const r = this._hostNodes.get(n);
              r && r.forEach(Am), this._hostNodes.delete(n);
            }
            onStylesAdded(n) {
              this._hostNodes.forEach((r, o) => {
                this._addStylesToHost(n, o, r);
              });
            }
            ngOnDestroy() {
              this._hostNodes.forEach((n) => n.forEach(Am));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(B(zt));
            }),
            (e.ɵprov = Y({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      function Am(e) {
        Mn().remove(e);
      }
      const pl = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        gl = /%COMP%/g;
      function ml(e, t) {
        return t.flat(100).map((n) => n.replace(gl, e));
      }
      function Fm(e) {
        return (t) => {
          if ("__ngUnwrap__" === t) return e;
          !1 === e(t) && (t.preventDefault(), (t.returnValue = !1));
        };
      }
      let yl = (() => {
        class e {
          constructor(n, r, o) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = o),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new Dl(n));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            switch (r.encapsulation) {
              case yt.Emulated: {
                let o = this.rendererByCompId.get(r.id);
                return (
                  o ||
                    ((o = new pA(
                      this.eventManager,
                      this.sharedStylesHost,
                      r,
                      this.appId
                    )),
                    this.rendererByCompId.set(r.id, o)),
                  o.applyToHost(n),
                  o
                );
              }
              case yt.ShadowDom:
                return new gA(this.eventManager, this.sharedStylesHost, n, r);
              default:
                if (!this.rendererByCompId.has(r.id)) {
                  const o = ml(r.id, r.styles);
                  this.sharedStylesHost.addStyles(o),
                    this.rendererByCompId.set(r.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(B(es), B(ho), B(so));
          }),
          (e.ɵprov = Y({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Dl {
        constructor(t) {
          (this.eventManager = t),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n
            ? document.createElementNS(pl[n] || n, t)
            : document.createElement(t);
        }
        createComment(t) {
          return document.createComment(t);
        }
        createText(t) {
          return document.createTextNode(t);
        }
        appendChild(t, n) {
          (Pm(t) ? t.content : t).appendChild(n);
        }
        insertBefore(t, n, r) {
          t && (Pm(t) ? t.content : t).insertBefore(n, r);
        }
        removeChild(t, n) {
          t && t.removeChild(n);
        }
        selectRootElement(t, n) {
          let r = "string" == typeof t ? document.querySelector(t) : t;
          if (!r)
            throw new Error(`The selector "${t}" did not match any elements`);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, o) {
          if (o) {
            n = o + ":" + n;
            const i = pl[o];
            i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const o = pl[r];
            o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, o) {
          o & (Be.DashCase | Be.Important)
            ? t.style.setProperty(n, r, o & Be.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & Be.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t[n] = r;
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          return "string" == typeof t
            ? this.eventManager.addGlobalEventListener(t, n, Fm(r))
            : this.eventManager.addEventListener(t, n, Fm(r));
        }
      }
      function Pm(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class pA extends Dl {
        constructor(t, n, r, o) {
          super(t), (this.component = r);
          const i = ml(o + "-" + r.id, r.styles);
          n.addStyles(i),
            (this.contentAttr = (function dA(e) {
              return "_ngcontent-%COMP%".replace(gl, e);
            })(o + "-" + r.id)),
            (this.hostAttr = (function fA(e) {
              return "_nghost-%COMP%".replace(gl, e);
            })(o + "-" + r.id));
        }
        applyToHost(t) {
          super.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          const r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      class gA extends Dl {
        constructor(t, n, r, o) {
          super(t),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const i = ml(o.id, o.styles);
          for (let s = 0; s < i.length; s++) {
            const a = document.createElement("style");
            (a.textContent = i[s]), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
        appendChild(t, n) {
          return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
          return super.removeChild(this.nodeOrShadowRoot(t), n);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t))
          );
        }
      }
      let mA = (() => {
        class e extends Mm {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, o) {
            return (
              n.addEventListener(r, o, !1),
              () => this.removeEventListener(n, r, o)
            );
          }
          removeEventListener(n, r, o) {
            return n.removeEventListener(r, o);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(B(zt));
          }),
          (e.ɵprov = Y({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const xm = ["alt", "control", "meta", "shift"],
        yA = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        DA = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let _A = (() => {
        class e extends Mm {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != e.parseEventName(n);
          }
          addEventListener(n, r, o) {
            const i = e.parseEventName(r),
              s = e.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => Mn().onAndCancel(n, i.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              o = r.shift();
            if (0 === r.length || ("keydown" !== o && "keyup" !== o))
              return null;
            const i = e._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              xm.forEach((l) => {
                const c = r.indexOf(l);
                c > -1 && (r.splice(c, 1), (s += l + "."));
              }),
              (s += i),
              0 != r.length || 0 === i.length)
            )
              return null;
            const u = {};
            return (u.domEventName = o), (u.fullKey = s), u;
          }
          static matchEventFullKeyCode(n, r) {
            let o = yA[n.key] || n.key,
              i = "";
            return (
              r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
              !(null == o || !o) &&
                ((o = o.toLowerCase()),
                " " === o ? (o = "space") : "." === o && (o = "dot"),
                xm.forEach((s) => {
                  s !== o && (0, DA[s])(n) && (i += s + ".");
                }),
                (i += o),
                i === r)
            );
          }
          static eventCallback(n, r, o) {
            return (i) => {
              e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(B(zt));
          }),
          (e.ɵprov = Y({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const EA = Lg(oS, "browser", [
          { provide: Tg, useValue: "browser" },
          {
            provide: Ag,
            useValue: function vA() {
              hl.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: zt,
            useFactory: function wA() {
              return (
                (function Kv(e) {
                  Ea = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        Lm = new F(""),
        Vm = [
          {
            provide: Li,
            useClass: class aA {
              addToWindow(t) {
                (Q.getAngularTestability = (r, o = !0) => {
                  const i = t.findTestabilityInTree(r, o);
                  if (null == i)
                    throw new Error("Could not find testability for element.");
                  return i;
                }),
                  (Q.getAllAngularTestabilities = () =>
                    t.getAllTestabilities()),
                  (Q.getAllAngularRootElements = () => t.getAllRootElements()),
                  Q.frameworkStabilizers || (Q.frameworkStabilizers = []),
                  Q.frameworkStabilizers.push((r) => {
                    const o = Q.getAllAngularTestabilities();
                    let i = o.length,
                      s = !1;
                    const a = function (u) {
                      (s = s || u), i--, 0 == i && r(s);
                    };
                    o.forEach(function (u) {
                      u.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(t, n, r) {
                return null == n
                  ? null
                  : t.getTestability(n) ??
                      (r
                        ? Mn().isShadowRoot(n)
                          ? this.findTestabilityInTree(t, n.host, !0)
                          : this.findTestabilityInTree(t, n.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: xg, useClass: Vu, deps: [we, Bu, Li] },
          { provide: Vu, useClass: Vu, deps: [we, Bu, Li] },
        ],
        Bm = [
          { provide: Pa, useValue: "root" },
          {
            provide: Qn,
            useFactory: function CA() {
              return new Qn();
            },
            deps: [],
          },
          { provide: Ji, useClass: mA, multi: !0, deps: [zt, we, Tg] },
          { provide: Ji, useClass: _A, multi: !0, deps: [zt] },
          { provide: yl, useClass: yl, deps: [es, ho, so] },
          { provide: If, useExisting: yl },
          { provide: Sm, useExisting: ho },
          { provide: ho, useClass: ho, deps: [zt] },
          { provide: es, useClass: es, deps: [Ji, we] },
          { provide: class T0 {}, useClass: uA, deps: [] },
          [],
        ];
      let bA = (() => {
        class e {
          constructor(n) {}
          static withServerTransition(n) {
            return {
              ngModule: e,
              providers: [
                { provide: so, useValue: n.appId },
                { provide: Im, useExisting: so },
                sA,
              ],
            };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(B(Lm, 12));
          }),
          (e.ɵmod = Nt({ type: e })),
          (e.ɵinj = mt({ providers: [...Bm, ...Vm], imports: [Dm, iS] })),
          e
        );
      })();
      typeof window < "u" && window;
      const mo = new F("CallSetDisabledState", {
          providedIn: "root",
          factory: () => Fl,
        }),
        Fl = "always";
      let Ay = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Nt({ type: e })),
            (e.ɵinj = mt({})),
            e
          );
        })(),
        zT = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Nt({ type: e })),
            (e.ɵinj = mt({ imports: [Ay] })),
            e
          );
        })(),
        qT = (() => {
          class e {
            static withConfig(n) {
              return {
                ngModule: e,
                providers: [
                  { provide: mo, useValue: n.callSetDisabledState ?? Fl },
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Nt({ type: e })),
            (e.ɵinj = mt({ imports: [zT] })),
            e
          );
        })();
      class _o {
        constructor() {}
      }
      function Wy(e, t, n, r, o, i, s) {
        try {
          var a = e[i](s),
            u = a.value;
        } catch (l) {
          return void n(l);
        }
        a.done ? t(u) : Promise.resolve(u).then(r, o);
      }
      function vo(e) {
        return function () {
          var t = this,
            n = arguments;
          return new Promise(function (r, o) {
            var i = e.apply(t, n);
            function s(u) {
              Wy(i, r, o, s, a, "next", u);
            }
            function a(u) {
              Wy(i, r, o, s, a, "throw", u);
            }
            s(void 0);
          });
        };
      }
      (_o.ɵfac = function (t) {
        return new (t || _o)();
      }),
        (_o.ɵcmp = Ir({
          type: _o,
          selectors: [["lib-app-navbar"]],
          decls: 5,
          vars: 0,
          consts: [
            [
              1,
              "navbar",
              "navbar-toggleable-md",
              "navbar-light",
              "bg-faded",
              "fixed-top",
            ],
            [1, "container"],
            [1, "navbar-header", "page-scroll"],
            ["href", "#intro", 1, "navbar-brand"],
          ],
          template: function (t, n) {
            1 & t &&
              (ae(0, "nav", 0)(1, "div", 1)(2, "div", 2)(3, "a", 3),
              tt(4, "Angular X Social Login"),
              ue()()()());
          },
        }));
      class qy extends Fn {
        constructor(t) {
          super(), (this._value = t);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(t) {
          const n = super._subscribe(t);
          return !n.closed && t.next(this._value), n;
        }
        getValue() {
          const { hasError: t, thrownError: n, _value: r } = this;
          if (t) throw n;
          return this._throwIfClosed(), r;
        }
        next(t) {
          super.next((this._value = t));
        }
      }
      function Zy(e, t) {
        return an((n, r) => {
          let o = 0;
          n.subscribe(un(r, (i) => e.call(t, i, o++) && r.next(i)));
        });
      }
      function Ky(e) {
        return Zy((t, n) => e <= n);
      }
      function Yy(e) {
        return e <= 0
          ? () => _s
          : an((t, n) => {
              let r = 0;
              t.subscribe(
                un(n, (o) => {
                  ++r <= e && (n.next(o), e <= r && n.complete());
                })
              );
            });
      }
      const Qy = { now: () => (Qy.delegate || Date).now(), delegate: void 0 };
      class ZT extends Fn {
        constructor(t = 1 / 0, n = 1 / 0, r = Qy) {
          super(),
            (this._bufferSize = t),
            (this._windowTime = n),
            (this._timestampProvider = r),
            (this._buffer = []),
            (this._infiniteTimeWindow = !0),
            (this._infiniteTimeWindow = n === 1 / 0),
            (this._bufferSize = Math.max(1, t)),
            (this._windowTime = Math.max(1, n));
        }
        next(t) {
          const {
            isStopped: n,
            _buffer: r,
            _infiniteTimeWindow: o,
            _timestampProvider: i,
            _windowTime: s,
          } = this;
          n || (r.push(t), !o && r.push(i.now() + s)),
            this._trimBuffer(),
            super.next(t);
        }
        _subscribe(t) {
          this._throwIfClosed(), this._trimBuffer();
          const n = this._innerSubscribe(t),
            { _infiniteTimeWindow: r, _buffer: o } = this,
            i = o.slice();
          for (let s = 0; s < i.length && !t.closed; s += r ? 1 : 2)
            t.next(i[s]);
          return this._checkFinalizedStatuses(t), n;
        }
        _trimBuffer() {
          const {
              _bufferSize: t,
              _timestampProvider: n,
              _buffer: r,
              _infiniteTimeWindow: o,
            } = this,
            i = (o ? 1 : 2) * t;
          if ((t < 1 / 0 && i < r.length && r.splice(0, r.length - i), !o)) {
            const s = n.now();
            let a = 0;
            for (let u = 1; u < r.length && r[u] <= s; u += 2) a = u;
            a && r.splice(0, a + 1);
          }
        }
      }
      class KT extends Fn {
        constructor() {
          super(...arguments),
            (this._value = null),
            (this._hasValue = !1),
            (this._isComplete = !1);
        }
        _checkFinalizedStatuses(t) {
          const {
            hasError: n,
            _hasValue: r,
            _value: o,
            thrownError: i,
            isStopped: s,
            _isComplete: a,
          } = this;
          n ? t.error(i) : (s || a) && (r && t.next(o), t.complete());
        }
        next(t) {
          this.isStopped || ((this._value = t), (this._hasValue = !0));
        }
        complete() {
          const { _hasValue: t, _value: n, _isComplete: r } = this;
          r || ((this._isComplete = !0), t && super.next(n), super.complete());
        }
      }
      class Co {
        constructor() {}
        loadScript(t, n, r, o = null) {
          if (typeof document < "u" && !document.getElementById(t)) {
            let i = document.createElement("script");
            (i.async = !0),
              (i.src = n),
              (i.onload = r),
              o || (o = document.head),
              o.appendChild(i);
          }
        }
      }
      class Tn {}
      const QT = { oneTapEnabled: !0 };
      let Nn = (() => {
          class e extends Co {
            constructor(n, r) {
              super(),
                (this.clientId = n),
                (this.initOptions = r),
                (this.changeUser = new De()),
                (this._socialUser = new qy(null)),
                (this._accessToken = new qy(null)),
                (this._receivedAccessToken = new De()),
                (this.initOptions = { ...QT, ...this.initOptions }),
                this._socialUser.pipe(Ky(1)).subscribe(this.changeUser),
                this._accessToken
                  .pipe(Ky(1))
                  .subscribe(this._receivedAccessToken);
            }
            initialize(n) {
              return new Promise((r, o) => {
                try {
                  this.loadScript(
                    e.PROVIDER_ID,
                    "https://accounts.google.com/gsi/client",
                    () => {
                      if (
                        (google.accounts.id.initialize({
                          client_id: this.clientId,
                          auto_select: n,
                          callback: ({ credential: i }) => {
                            const s = this.createSocialUser(i);
                            this._socialUser.next(s);
                          },
                          prompt_parent_id: this.initOptions?.prompt_parent_id,
                          itp_support: this.initOptions.oneTapEnabled,
                        }),
                        this.initOptions.oneTapEnabled &&
                          this._socialUser
                            .pipe(Zy((i) => null === i))
                            .subscribe(() =>
                              google.accounts.id.prompt(console.debug)
                            ),
                        this.initOptions.scopes)
                      ) {
                        const i =
                          this.initOptions.scopes instanceof Array
                            ? this.initOptions.scopes.filter((s) => s).join(" ")
                            : this.initOptions.scopes;
                        this._tokenClient =
                          google.accounts.oauth2.initTokenClient({
                            client_id: this.clientId,
                            scope: i,
                            prompt: this.initOptions.prompt,
                            callback: (s) => {
                              s.error
                                ? this._accessToken.error({
                                    code: s.error,
                                    description: s.error_description,
                                    uri: s.error_uri,
                                  })
                                : this._accessToken.next(s.access_token);
                            },
                          });
                      }
                      r();
                    }
                  );
                } catch (i) {
                  o(i);
                }
              });
            }
            getLoginStatus() {
              return new Promise((n, r) => {
                this._socialUser.value
                  ? n(this._socialUser.value)
                  : r(`No user is currently logged in with ${e.PROVIDER_ID}`);
              });
            }
            refreshToken() {
              return new Promise((n, r) => {
                google.accounts.id.revoke(this._socialUser.value.id, (o) => {
                  o.error ? r(o.error) : n(this._socialUser.value);
                });
              });
            }
            getAccessToken() {
              return new Promise((n, r) => {
                this._tokenClient
                  ? (this._tokenClient.requestAccessToken({
                      hint: this._socialUser.value?.email,
                    }),
                    this._receivedAccessToken.pipe(Yy(1)).subscribe(n))
                  : r(
                      this._socialUser.value
                        ? "No token client was instantiated, you should specify some scopes."
                        : "You should be logged-in first."
                    );
              });
            }
            revokeAccessToken() {
              return new Promise((n, r) => {
                this._tokenClient
                  ? this._accessToken.value
                    ? google.accounts.oauth2.revoke(
                        this._accessToken.value,
                        () => {
                          this._accessToken.next(null), n();
                        }
                      )
                    : r("No access token to revoke")
                  : r(
                      "No token client was instantiated, you should specify some scopes."
                    );
              });
            }
            signIn() {
              return Promise.reject(
                'You should not call this method directly for Google, use "<asl-google-signin-button>" wrapper or generate the button yourself with "google.accounts.id.renderButton()" (https://developers.google.com/identity/gsi/web/guides/display-button#javascript)'
              );
            }
            signOut() {
              var n = this;
              return vo(function* () {
                google.accounts.id.disableAutoSelect(),
                  n._socialUser.next(null);
              })();
            }
            createSocialUser(n) {
              const r = new Tn();
              r.idToken = n;
              const o = this.decodeJwt(n);
              return (
                (r.id = o.sub),
                (r.name = o.name),
                (r.email = o.email),
                (r.photoUrl = o.picture),
                (r.firstName = o.given_name),
                (r.lastName = o.family_name),
                r
              );
            }
            decodeJwt(n) {
              const o = n.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"),
                i = decodeURIComponent(
                  window
                    .atob(o)
                    .split("")
                    .map(function (s) {
                      return (
                        "%" + ("00" + s.charCodeAt(0).toString(16)).slice(-2)
                      );
                    })
                    .join("")
                );
              return JSON.parse(i);
            }
          }
          return (e.PROVIDER_ID = "GOOGLE"), e;
        })(),
        cs = (() => {
          class e {
            get authState() {
              return this._authState.asObservable();
            }
            get initState() {
              return this._initState.asObservable();
            }
            constructor(n, r, o) {
              (this._ngZone = r),
                (this._injector = o),
                (this.providers = new Map()),
                (this.autoLogin = !1),
                (this._user = null),
                (this._authState = new ZT(1)),
                (this.initialized = !1),
                (this._initState = new KT()),
                n instanceof Promise
                  ? n.then((i) => {
                      this.initialize(i);
                    })
                  : this.initialize(n);
            }
            initialize(n) {
              this.autoLogin = void 0 !== n.autoLogin && n.autoLogin;
              const { onError: r = console.error } = n;
              n.providers.forEach((o) => {
                this.providers.set(
                  o.id,
                  "prototype" in o.provider
                    ? this._injector.get(o.provider)
                    : o.provider
                );
              }),
                Promise.all(
                  Array.from(this.providers.values()).map((o) =>
                    o.initialize(this.autoLogin)
                  )
                )
                  .then(() => {
                    if (this.autoLogin) {
                      const o = [];
                      let i = !1;
                      this.providers.forEach((s, a) => {
                        const u = s.getLoginStatus();
                        o.push(u),
                          u
                            .then((l) => {
                              this.setUser(l, a), (i = !0);
                            })
                            .catch(console.debug);
                      }),
                        Promise.all(o).catch(() => {
                          i ||
                            ((this._user = null), this._authState.next(null));
                        });
                    }
                    this.providers.forEach((o, i) => {
                      (function YT(e) {
                        return (
                          !!e &&
                          (e instanceof Ee || (J(e.lift) && J(e.subscribe)))
                        );
                      })(o.changeUser) &&
                        o.changeUser.subscribe((s) => {
                          this._ngZone.run(() => {
                            this.setUser(s, i);
                          });
                        });
                    });
                  })
                  .catch((o) => {
                    r(o);
                  })
                  .finally(() => {
                    (this.initialized = !0),
                      this._initState.next(this.initialized),
                      this._initState.complete();
                  });
            }
            getAccessToken(n) {
              var r = this;
              return vo(function* () {
                const o = r.providers.get(n);
                if (!r.initialized) throw e.ERR_NOT_INITIALIZED;
                if (!o) throw e.ERR_LOGIN_PROVIDER_NOT_FOUND;
                if (!(o instanceof Nn))
                  throw e.ERR_NOT_SUPPORTED_FOR_ACCESS_TOKEN;
                return yield o.getAccessToken();
              })();
            }
            refreshAuthToken(n) {
              return new Promise((r, o) => {
                if (this.initialized) {
                  const i = this.providers.get(n);
                  i
                    ? "function" != typeof i.refreshToken
                      ? o(e.ERR_NOT_SUPPORTED_FOR_REFRESH_TOKEN)
                      : i
                          .refreshToken()
                          .then((s) => {
                            this.setUser(s, n), r();
                          })
                          .catch((s) => {
                            o(s);
                          })
                    : o(e.ERR_LOGIN_PROVIDER_NOT_FOUND);
                } else o(e.ERR_NOT_INITIALIZED);
              });
            }
            refreshAccessToken(n) {
              return new Promise((r, o) => {
                if (this.initialized)
                  if (n !== Nn.PROVIDER_ID)
                    o(e.ERR_NOT_SUPPORTED_FOR_REFRESH_TOKEN);
                  else {
                    const i = this.providers.get(n);
                    i instanceof Nn
                      ? i.revokeAccessToken().then(r).catch(o)
                      : o(e.ERR_LOGIN_PROVIDER_NOT_FOUND);
                  }
                else o(e.ERR_NOT_INITIALIZED);
              });
            }
            signIn(n, r) {
              return new Promise((o, i) => {
                if (this.initialized) {
                  let s = this.providers.get(n);
                  s
                    ? s
                        .signIn(r)
                        .then((a) => {
                          this.setUser(a, n), o(a);
                        })
                        .catch((a) => {
                          i(a);
                        })
                    : i(e.ERR_LOGIN_PROVIDER_NOT_FOUND);
                } else i(e.ERR_NOT_INITIALIZED);
              });
            }
            signOut(n = !1) {
              return new Promise((r, o) => {
                if (this.initialized)
                  if (this._user) {
                    let s = this.providers.get(this._user.provider);
                    s
                      ? s
                          .signOut(n)
                          .then(() => {
                            r(), this.setUser(null);
                          })
                          .catch((a) => {
                            o(a);
                          })
                      : o(e.ERR_LOGIN_PROVIDER_NOT_FOUND);
                  } else o(e.ERR_NOT_LOGGED_IN);
                else o(e.ERR_NOT_INITIALIZED);
              });
            }
            setUser(n, r) {
              n && r && (n.provider = r),
                (this._user = n),
                this._authState.next(n);
            }
          }
          return (
            (e.ERR_LOGIN_PROVIDER_NOT_FOUND = "Login provider not found"),
            (e.ERR_NOT_LOGGED_IN = "Not logged in"),
            (e.ERR_NOT_INITIALIZED =
              "Login providers not ready yet. Are there errors on your console?"),
            (e.ERR_NOT_SUPPORTED_FOR_REFRESH_TOKEN =
              "Chosen login provider is not supported for refreshing a token"),
            (e.ERR_NOT_SUPPORTED_FOR_ACCESS_TOKEN =
              "Chosen login provider is not supported for getting an access token"),
            (e.ɵfac = function (n) {
              return new (n || e)(B("SocialAuthServiceConfig"), B(we), B(Vt));
            }),
            (e.ɵprov = Y({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        XT = (() => {
          class e {
            constructor(n, r) {
              (this.type = "icon"),
                (this.size = "medium"),
                (this.text = "signin_with"),
                (this.shape = "rectangular"),
                (this.theme = "outline"),
                (this.logo_alignment = "left"),
                (this.width = ""),
                (this.locale = ""),
                r.initState.pipe(Yy(1)).subscribe(() => {
                  Promise.resolve(this.width).then((o) => {
                    o > "400" || (o < "200" && "" != o)
                      ? Promise.reject(
                          "Please note .. max-width 400 , min-width 200 (https://developers.google.com/identity/gsi/web/tools/configurator)"
                        )
                      : google.accounts.id.renderButton(n.nativeElement, {
                          type: this.type,
                          size: this.size,
                          text: this.text,
                          width: this.width,
                          shape: this.shape,
                          theme: this.theme,
                          logo_alignment: this.logo_alignment,
                          locale: this.locale,
                        });
                  });
                });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(v(Je), v(cs));
            }),
            (e.ɵdir = N({
              type: e,
              selectors: [["asl-google-signin-button"]],
              inputs: {
                type: "type",
                size: "size",
                text: "text",
                shape: "shape",
                theme: "theme",
                logo_alignment: "logo_alignment",
                width: "width",
                locale: "locale",
              },
            })),
            e
          );
        })(),
        JT = (() => {
          class e {
            static initialize(n) {
              return {
                ngModule: e,
                providers: [
                  cs,
                  { provide: "SocialAuthServiceConfig", useValue: n },
                ],
              };
            }
            constructor(n) {
              if (n)
                throw new Error(
                  "SocialLoginModule is already loaded. Import it in the AppModule only"
                );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(B(e, 12));
            }),
            (e.ɵmod = Nt({ type: e })),
            (e.ɵinj = mt({ providers: [cs], imports: [Dm] })),
            e
          );
        })(),
        Ul = (() => {
          class e extends Co {
            constructor(n, r = {}) {
              super(),
                (this.clientId = n),
                (this.requestOptions = {
                  scope: "email,public_profile",
                  locale: "en_US",
                  fields: "name,email,picture,first_name,last_name",
                  version: "v10.0",
                }),
                (this.requestOptions = { ...this.requestOptions, ...r });
            }
            initialize() {
              return new Promise((n, r) => {
                try {
                  this.loadScript(
                    e.PROVIDER_ID,
                    `//connect.facebook.net/${this.requestOptions.locale}/sdk.js`,
                    () => {
                      FB.init({
                        appId: this.clientId,
                        autoLogAppEvents: !0,
                        cookie: !0,
                        xfbml: !0,
                        version: this.requestOptions.version,
                      }),
                        n();
                    }
                  );
                } catch (o) {
                  r(o);
                }
              });
            }
            getLoginStatus() {
              return new Promise((n, r) => {
                FB.getLoginStatus((o) => {
                  if ("connected" === o.status) {
                    let i = o.authResponse;
                    FB.api(`/me?fields=${this.requestOptions.fields}`, (s) => {
                      let a = new Tn();
                      (a.id = s.id),
                        (a.name = s.name),
                        (a.email = s.email),
                        (a.photoUrl =
                          "https://graph.facebook.com/" +
                          s.id +
                          "/picture?type=normal&access_token=" +
                          i.accessToken),
                        (a.firstName = s.first_name),
                        (a.lastName = s.last_name),
                        (a.authToken = i.accessToken),
                        (a.response = s),
                        n(a);
                    });
                  } else
                    r(`No user is currently logged in with ${e.PROVIDER_ID}`);
                });
              });
            }
            signIn(n) {
              const r = { ...this.requestOptions, ...n };
              return new Promise((o, i) => {
                FB.login((s) => {
                  if (s.authResponse) {
                    let a = s.authResponse;
                    FB.api(`/me?fields=${r.fields}`, (u) => {
                      let l = new Tn();
                      (l.id = u.id),
                        (l.name = u.name),
                        (l.email = u.email),
                        (l.photoUrl =
                          "https://graph.facebook.com/" +
                          u.id +
                          "/picture?type=normal"),
                        (l.firstName = u.first_name),
                        (l.lastName = u.last_name),
                        (l.authToken = a.accessToken),
                        (l.response = u),
                        o(l);
                    });
                  } else i("User cancelled login or did not fully authorize.");
                }, r);
              });
            }
            signOut() {
              return new Promise((n, r) => {
                FB.logout((o) => {
                  n();
                });
              });
            }
          }
          return (e.PROVIDER_ID = "FACEBOOK"), e;
        })(),
        Gl = (() => {
          class e extends Co {
            constructor(
              n,
              r = {
                scope: "profile",
                scope_data: { profile: { essential: !1 } },
                redirect_uri: location.origin,
              }
            ) {
              super(), (this.clientId = n), (this.initOptions = r);
            }
            initialize() {
              let n = null;
              return (
                document &&
                  ((n = document.createElement("div")),
                  (n.id = "amazon-root"),
                  document.body.appendChild(n)),
                (window.onAmazonLoginReady = () => {
                  amazon.Login.setClientId(this.clientId);
                }),
                new Promise((r, o) => {
                  try {
                    this.loadScript(
                      "amazon-login-sdk",
                      "https://assets.loginwithamazon.com/sdk/na/login1.js",
                      () => {
                        r();
                      },
                      n
                    );
                  } catch (i) {
                    o(i);
                  }
                })
              );
            }
            getLoginStatus() {
              return new Promise((n, r) => {
                let o = this.retrieveToken();
                o
                  ? amazon.Login.retrieveProfile(o, (i) => {
                      if (i.success) {
                        let s = new Tn();
                        (s.id = i.profile.CustomerId),
                          (s.name = i.profile.Name),
                          (s.email = i.profile.PrimaryEmail),
                          (s.response = i.profile),
                          n(s);
                      } else r(i.error);
                    })
                  : r(`No user is currently logged in with ${e.PROVIDER_ID}`);
              });
            }
            signIn(n) {
              const r = { ...this.initOptions, ...n };
              return new Promise((o, i) => {
                amazon.Login.authorize(r, (s) => {
                  s.error
                    ? i(s.error)
                    : amazon.Login.retrieveProfile(s.access_token, (a) => {
                        let u = new Tn();
                        (u.id = a.profile.CustomerId),
                          (u.name = a.profile.Name),
                          (u.email = a.profile.PrimaryEmail),
                          (u.authToken = s.access_token),
                          (u.response = a.profile),
                          this.persistToken(s.access_token),
                          o(u);
                      });
                });
              });
            }
            signOut() {
              return new Promise((n, r) => {
                try {
                  amazon.Login.logout(), this.clearToken(), n();
                } catch (o) {
                  r(o.message);
                }
              });
            }
            persistToken(n) {
              localStorage.setItem(`${e.PROVIDER_ID}_token`, n);
            }
            retrieveToken() {
              return localStorage.getItem(`${e.PROVIDER_ID}_token`);
            }
            clearToken() {
              localStorage.removeItem(`${e.PROVIDER_ID}_token`);
            }
          }
          return (e.PROVIDER_ID = "AMAZON"), e;
        })(),
        zl = (() => {
          class e extends Co {
            constructor(
              n,
              r = { fields: "photo_max,contacts", version: "5.124" }
            ) {
              super(),
                (this.clientId = n),
                (this.initOptions = r),
                (this.VK_API_URL = "//vk.com/js/api/openapi.js"),
                (this.VK_API_GET_USER = "users.get");
            }
            initialize() {
              return new Promise((n, r) => {
                try {
                  this.loadScript(e.PROVIDER_ID, this.VK_API_URL, () => {
                    VK.init({ apiId: this.clientId }), n();
                  });
                } catch (o) {
                  r(o);
                }
              });
            }
            getLoginStatus() {
              return new Promise((n, r) => this.getLoginStatusInternal(n, r));
            }
            signIn() {
              return new Promise((n, r) => this.signInInternal(n, r));
            }
            signOut() {
              return new Promise((n, r) => {
                VK.Auth.logout((o) => {
                  n();
                });
              });
            }
            signInInternal(n, r) {
              VK.Auth.login((o) => {
                "connected" === o.status &&
                  this.getUser(o.session.mid, o.session.sid, n);
              });
            }
            getUser(n, r, o) {
              VK.Api.call(
                this.VK_API_GET_USER,
                {
                  user_id: n,
                  fields: this.initOptions.fields,
                  v: this.initOptions.version,
                },
                (i) => {
                  o(
                    this.createUser(
                      Object.assign({}, { token: r }, i.response[0])
                    )
                  );
                }
              );
            }
            getLoginStatusInternal(n, r) {
              VK.Auth.getLoginStatus((o) => {
                "connected" === o.status &&
                  this.getUser(o.session.mid, o.session.sid, n);
              });
            }
            createUser(n) {
              const r = new Tn();
              return (
                (r.id = n.id),
                (r.name = `${n.first_name} ${n.last_name}`),
                (r.photoUrl = n.photo_max),
                (r.authToken = n.token),
                r
              );
            }
          }
          return (e.PROVIDER_ID = "VK"), e;
        })();
      var ds = (() => {
        return ((e = ds || (ds = {})).AAD = "AAD"), (e.OIDC = "OIDC"), ds;
        var e;
      })();
      let Wl = (() => {
        class e extends Co {
          constructor(n, r) {
            super(),
              (this.clientId = n),
              (this.initOptions = {
                authority: "https://login.microsoftonline.com/common/",
                scopes: ["openid", "email", "profile", "User.Read"],
                knownAuthorities: [],
                protocolMode: ds.AAD,
                clientCapabilities: [],
                cacheLocation: "sessionStorage",
              }),
              (this.initOptions = { ...this.initOptions, ...r });
          }
          initialize() {
            return new Promise((n, r) => {
              this.loadScript(
                e.PROVIDER_ID,
                "https://alcdn.msauth.net/browser/2.35.0/js/msal-browser.min.js",
                () => {
                  try {
                    const o = {
                      auth: {
                        clientId: this.clientId,
                        redirectUri:
                          this.initOptions.redirect_uri ?? location.origin,
                        authority: this.initOptions.authority,
                        knownAuthorities: this.initOptions.knownAuthorities,
                        protocolMode: this.initOptions.protocolMode,
                        clientCapabilities: this.initOptions.clientCapabilities,
                      },
                      cache: this.initOptions.cacheLocation
                        ? { cacheLocation: this.initOptions.cacheLocation }
                        : null,
                    };
                    (this._instance = new msal.PublicClientApplication(o)), n();
                  } catch (o) {
                    r(o);
                  }
                }
              );
            });
          }
          getSocialUser(n) {
            return new Promise((r, o) => {
              let i = new XMLHttpRequest();
              (i.onreadystatechange = () => {
                if (4 == i.readyState)
                  try {
                    if (200 == i.status) {
                      let s = JSON.parse(i.responseText),
                        a = new Tn();
                      (a.provider = e.PROVIDER_ID),
                        (a.id = n.idToken),
                        (a.authToken = n.accessToken),
                        (a.name = n.idTokenClaims.name),
                        (a.email = n.account.username),
                        (a.idToken = n.idToken),
                        (a.response = n),
                        (a.firstName = s.givenName),
                        (a.lastName = s.surname),
                        r(a);
                    } else o(`Error retrieving user info: ${i.status}`);
                  } catch (s) {
                    o(s);
                  }
              }),
                i.open("GET", "https://graph.microsoft.com/v1.0/me"),
                i.setRequestHeader("Authorization", `Bearer ${n.accessToken}`);
              try {
                i.send();
              } catch (s) {
                o(s);
              }
            });
          }
          getLoginStatus() {
            var n = this;
            return vo(function* () {
              const r = n._instance.getAllAccounts();
              if (r?.length > 0) {
                const o = yield n._instance.ssoSilent({
                  scopes: n.initOptions.scopes,
                  loginHint: r[0].username,
                });
                return yield n.getSocialUser(o);
              }
              throw `No user is currently logged in with ${e.PROVIDER_ID}`;
            })();
          }
          signIn() {
            var n = this;
            return vo(function* () {
              const r = yield n._instance.loginPopup({
                scopes: n.initOptions.scopes,
                prompt: n.initOptions.prompt,
              });
              return yield n.getSocialUser(r);
            })();
          }
          signOut(n) {
            var r = this;
            return vo(function* () {
              const o = r._instance.getAllAccounts();
              o?.length > 0 &&
                (yield r._instance.logoutPopup({
                  account: o[0],
                  postLogoutRedirectUri:
                    r.initOptions.logout_redirect_uri ??
                    r.initOptions.redirect_uri ??
                    location.href,
                }));
            })();
          }
        }
        return (e.PROVIDER_ID = "MICROSOFT"), e;
      })();
      function tN(e, t) {
        if (1 & e) {
          const n = Ei();
          ae(0, "div", 2)(1, "h6", 3),
            tt(2, "Social Login Demo"),
            ue(),
            ae(3, "div", 4)(4, "h4", 5),
            tt(5, "Not signed in"),
            ue(),
            ae(6, "p", 6),
            tt(7, "Sign in with"),
            ue()(),
            ae(8, "div", 7),
            lt(9, "asl-google-signin-button", 8),
            ae(10, "button", 9),
            Ce("click", function () {
              return fn(n), hn(Ht().signInWithFB());
            }),
            lt(11, "span", 10),
            ue(),
            ae(12, "button", 11),
            Ce("click", function () {
              return fn(n), hn(Ht().signInWithAmazon());
            }),
            lt(13, "span", 12),
            ue(),
            ae(14, "button", 11),
            Ce("click", function () {
              return fn(n), hn(Ht().signInWithVK());
            }),
            lt(15, "span", 13),
            ue(),
            ae(16, "button", 14),
            Ce("click", function () {
              return fn(n), hn(Ht().signInWithMicrosoft());
            }),
            lt(17, "span", 15),
            ue()()();
        }
      }
      function nN(e, t) {
        1 & e && lt(0, "img", 19), 2 & e && uu("src", Ht(2).user.photoUrl, Ta);
      }
      function rN(e, t) {
        if (1 & e) {
          const n = Ei();
          ae(0, "div", 4)(1, "button", 20),
            Ce("click", function () {
              return fn(n), hn(Ht(2).refreshGoogleToken());
            }),
            tt(2, " Refresh google token "),
            ue()();
        }
      }
      function oN(e, t) {
        if (1 & e) {
          const n = Ei();
          ae(0, "div", 2)(1, "h6", 3),
            tt(2, "Social Login Demo"),
            ue(),
            lt(3, "div", 4),
            Kr(4, nN, 1, 1, "img", 16),
            ae(5, "div", 4)(6, "h4", 5),
            tt(7),
            ue(),
            ae(8, "p", 6),
            tt(9),
            ue(),
            ae(10, "p", 6),
            tt(11),
            ue()(),
            ae(12, "div", 4)(13, "button", 17),
            Ce("click", function () {
              return fn(n), hn(Ht().signOut());
            }),
            tt(14, "Sign out"),
            ue()(),
            Kr(15, rN, 3, 0, "div", 18),
            ue();
        }
        if (2 & e) {
          const n = Ht();
          Lt(4),
            cr("ngIf", n.user.photoUrl),
            Lt(3),
            Qr(n.user.name),
            Lt(2),
            Qr(n.user.email),
            Lt(2),
            Ai("Logged in with ", n.user.provider, ""),
            Lt(4),
            cr("ngIf", n.user.provider === n.GoogleLoginProvider.PROVIDER_ID);
        }
      }
      class wo {
        constructor(t) {
          (this._authService = t), (this.GoogleLoginProvider = Nn);
        }
        ngOnInit() {
          this._authService.authState.subscribe((t) => {
            this.user = t;
          });
        }
        signInWithFB() {
          this._authService.signIn(Ul.PROVIDER_ID);
        }
        signInWithAmazon() {
          this._authService.signIn(Gl.PROVIDER_ID);
        }
        signInWithVK() {
          this._authService.signIn(zl.PROVIDER_ID);
        }
        signInWithMicrosoft() {
          this._authService.signIn(Wl.PROVIDER_ID);
        }
        signOut() {
          this._authService.signOut();
        }
        refreshGoogleToken() {
          this._authService.refreshAuthToken(Nn.PROVIDER_ID);
        }
      }
      (wo.ɵfac = function (t) {
        return new (t || wo)(v(cs));
      }),
        (wo.ɵcmp = Ir({
          type: wo,
          selectors: [["lib-app-demo"]],
          decls: 3,
          vars: 2,
          consts: [
            [1, "jumbotron", "bg-transparent", "text-center"],
            ["class", "card text-center", 4, "ngIf"],
            [1, "card", "text-center"],
            [1, "card-header"],
            [1, "card-block"],
            [1, "card-title"],
            [1, "card-text"],
            [1, "card-block", "d-flex", "justify-content-center"],
            [1, "mx-5"],
            [1, "btn", "btn-social-icon", "btn-facebook", "mx-1", 3, "click"],
            [1, "fab", "fa-facebook"],
            [1, "btn", "btn-social-icon", "btn-amazon", "mx-1", 3, "click"],
            [1, "fab", "fa-amazon"],
            [1, "fab", "fa-vk"],
            [1, "btn", "btn-social-icon", "btn-microsoft", "mx-1", 3, "click"],
            [1, "fab", "fa-microsoft"],
            ["class", "card-img-top img-responsive photo", 3, "src", 4, "ngIf"],
            [1, "btn", "btn-danger", 3, "click"],
            ["class", "card-block", 4, "ngIf"],
            [1, "card-img-top", "img-responsive", "photo", 3, "src"],
            [1, "btn", 3, "click"],
          ],
          template: function (t, n) {
            1 & t &&
              (ae(0, "div", 0),
              Kr(1, tN, 18, 0, "div", 1),
              Kr(2, oN, 16, 5, "div", 1),
              ue()),
              2 & t && (Lt(1), cr("ngIf", !n.user), Lt(1), cr("ngIf", n.user));
          },
          dependencies: [pm, XT],
          styles: [
            ".bg-transparent[_ngcontent-%COMP%]{background-color:transparent}[_nghost-%COMP%]{height:100%}.photo[_ngcontent-%COMP%]{object-fit:contain}.card[_ngcontent-%COMP%]{width:20rem;margin:0 auto}",
          ],
        }));
      class Eo {
        constructor() {
          this.title = "app works!";
        }
      }
      (Eo.ɵfac = function (t) {
        return new (t || Eo)();
      }),
        (Eo.ɵcmp = Ir({
          type: Eo,
          selectors: [["lib-app-root"]],
          decls: 5,
          vars: 1,
          consts: [["id", "demo", 1, "demo-section"]],
          template: function (t, n) {
            1 & t &&
              (ae(0, "h1"),
              tt(1),
              ue(),
              lt(2, "lib-app-navbar"),
              ae(3, "section", 0),
              lt(4, "lib-app-demo"),
              ue()),
              2 & t && (Lt(1), Qr(n.title));
          },
          dependencies: [_o, wo],
          styles: ["#demo[_ngcontent-%COMP%]{margin-top:56px}"],
        }));
      class Dr {}
      (Dr.ɵfac = function (t) {
        return new (t || Dr)();
      }),
        (Dr.ɵmod = Nt({ type: Dr, bootstrap: [Eo] })),
        (Dr.ɵinj = mt({
          providers: [
            {
              provide: "SocialAuthServiceConfig",
              useValue: {
                autoLogin: !0,
                providers: [
                  {
                    id: Nn.PROVIDER_ID,
                    provider: new Nn(
                      "624796833023-clhjgupm0pu6vgga7k5i5bsfp6qp6egh.apps.googleusercontent.com"
                    ),
                  },
                  { id: Ul.PROVIDER_ID, provider: new Ul("561602290896109") },
                  {
                    id: Gl.PROVIDER_ID,
                    provider: new Gl(
                      "amzn1.application-oa2-client.f074ae67c0a146b6902cc0c4a3297935"
                    ),
                  },
                  { id: zl.PROVIDER_ID, provider: new zl("7624815") },
                  {
                    id: Wl.PROVIDER_ID,
                    provider: new Wl("0611ccc3-9521-45b6-b432-039852002705"),
                  },
                ],
              },
            },
          ],
          imports: [bA, qT, JT],
        })),
        EA()
          .bootstrapModule(Dr)
          .catch((e) => console.error(e));
    },
  },
  (J) => {
    J((J.s = 599));
  },
]);
