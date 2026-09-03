var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// ../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      static {
        __name(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
      static {
        __name(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance = class {
      static {
        __name(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver = class {
      static {
        __name(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// ../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// ../../node_modules/.bun/@cloudflare+unenv-preset@2.16.1+9b63e7378552b9e4/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "../../node_modules/.bun/@cloudflare+unenv-preset@2.16.1+9b63e7378552b9e4/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    if (!("__unenv__" in performance)) {
      const proto = Performance.prototype;
      for (const key of Object.getOwnPropertyNames(proto)) {
        if (key !== "constructor" && !(key in performance)) {
          const desc = Object.getOwnPropertyDescriptor(proto, key);
          if (desc) {
            Object.defineProperty(performance, key, desc);
          }
        }
      }
    }
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// ../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// ../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// ../../node_modules/.bun/@cloudflare+unenv-preset@2.16.1+9b63e7378552b9e4/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "../../node_modules/.bun/@cloudflare+unenv-preset@2.16.1+9b63e7378552b9e4/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// ../../node_modules/.bun/wrangler@4.128.0+fccf3d0819d1a6b6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "../../node_modules/.bun/wrangler@4.128.0+fccf3d0819d1a6b6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// ../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// ../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream;
var init_read_stream = __esm({
  "../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class {
      static {
        __name(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});

// ../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream;
var init_write_stream = __esm({
  "../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class {
      static {
        __name(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env3) {
        return 1;
      }
      hasColors(count3, env3) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});

// ../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// ../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION;
var init_node_version = __esm({
  "../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION = "22.14.0";
  }
});

// ../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "../../node_modules/.bun/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process = class _Process extends EventEmitter {
      static {
        __name(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      // --- event emitter ---
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      // --- stdio (lazy initializers) ---
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      // --- cwd ---
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      // --- dummy props and getters ---
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION}`;
      }
      get versions() {
        return { node: NODE_VERSION };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      // --- noop methods ---
      ref() {
      }
      unref() {
      }
      // --- unimplemented methods ---
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      // --- attached interfaces ---
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
      // --- undefined props ---
      mainModule = void 0;
      domain = void 0;
      // optional
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      // internals
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});

// ../../node_modules/.bun/@cloudflare+unenv-preset@2.16.1+9b63e7378552b9e4/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, workerdProcess, unenvProcess, exit, features, platform, _channel, _debugEnd, _debugProcess, _disconnect, _events, _eventsCount, _exiting, _fatalException, _getActiveHandles, _getActiveRequests, _handleQueue, _kill, _linkedBinding, _maxListeners, _pendingMessage, _preload_modules, _rawDebug, _send, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, abort, addListener, allowedNodeEnvironmentFlags, arch, argv, argv0, assert2, availableMemory, binding, channel, chdir, config, connected, constrainedMemory, cpuUsage, cwd, debugPort, disconnect, dlopen, domain, emit, emitWarning, env, eventNames, execArgv, execPath, exitCode, finalization, getActiveResourcesInfo, getegid, geteuid, getgid, getgroups, getMaxListeners, getuid, hasUncaughtExceptionCaptureCallback, hrtime3, initgroups, kill, listenerCount, listeners, loadEnvFile, mainModule, memoryUsage, moduleLoadList, nextTick, off, on, once, openStdin, permission, pid, ppid, prependListener, prependOnceListener, rawListeners, reallyExit, ref, release, removeAllListeners, removeListener, report, resourceUsage, send, setegid, seteuid, setgid, setgroups, setMaxListeners, setSourceMapsEnabled, setuid, setUncaughtExceptionCaptureCallback, sourceMapsEnabled, stderr, stdin, stdout, throwDeprecation, title, traceDeprecation, umask, unref, uptime, version, versions, _process, process_default;
var init_process2 = __esm({
  "../../node_modules/.bun/@cloudflare+unenv-preset@2.16.1+9b63e7378552b9e4/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    workerdProcess = getBuiltinModule("node:process");
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      // `nextTick` is available from workerd process v1
      nextTick: workerdProcess.nextTick
    });
    ({ exit, features, platform } = workerdProcess);
    ({
      _channel,
      _debugEnd,
      _debugProcess,
      _disconnect,
      _events,
      _eventsCount,
      _exiting,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _handleQueue,
      _kill,
      _linkedBinding,
      _maxListeners,
      _pendingMessage,
      _preload_modules,
      _rawDebug,
      _send,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      arch,
      argv,
      argv0,
      assert: assert2,
      availableMemory,
      binding,
      channel,
      chdir,
      config,
      connected,
      constrainedMemory,
      cpuUsage,
      cwd,
      debugPort,
      disconnect,
      dlopen,
      domain,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exitCode,
      finalization,
      getActiveResourcesInfo,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getMaxListeners,
      getuid,
      hasUncaughtExceptionCaptureCallback,
      hrtime: hrtime3,
      initgroups,
      kill,
      listenerCount,
      listeners,
      loadEnvFile,
      mainModule,
      memoryUsage,
      moduleLoadList,
      nextTick,
      off,
      on,
      once,
      openStdin,
      permission,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      reallyExit,
      ref,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      send,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setMaxListeners,
      setSourceMapsEnabled,
      setuid,
      setUncaughtExceptionCaptureCallback,
      sourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      throwDeprecation,
      title,
      traceDeprecation,
      umask,
      unref,
      uptime,
      version,
      versions
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// ../../node_modules/.bun/wrangler@4.128.0+fccf3d0819d1a6b6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "../../node_modules/.bun/wrangler@4.128.0+fccf3d0819d1a6b6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});

// ../../node_modules/.bun/wrangler@4.128.0+fccf3d0819d1a6b6/node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "../../node_modules/.bun/wrangler@4.128.0+fccf3d0819d1a6b6/node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// ../../node_modules/.bun/bignumber.js@9.3.1/node_modules/bignumber.js/bignumber.js
var require_bignumber = __commonJS({
  "../../node_modules/.bun/bignumber.js@9.3.1/node_modules/bignumber.js/bignumber.js"(exports, module) {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    (function(globalObject) {
      "use strict";
      var BigNumber, isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i, mathceil = Math.ceil, mathfloor = Math.floor, bignumberError = "[BigNumber Error] ", tooManyDigits = bignumberError + "Number primitive has more than 15 significant digits: ", BASE = 1e14, LOG_BASE = 14, MAX_SAFE_INTEGER = 9007199254740991, POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13], SQRT_BASE = 1e7, MAX = 1e9;
      function clone(configObject) {
        var div, convertBase, parseNumeric, P = BigNumber2.prototype = { constructor: BigNumber2, toString: null, valueOf: null }, ONE = new BigNumber2(1), DECIMAL_PLACES = 20, ROUNDING_MODE = 4, TO_EXP_NEG = -7, TO_EXP_POS = 21, MIN_EXP = -1e7, MAX_EXP = 1e7, CRYPTO = false, MODULO_MODE = 1, POW_PRECISION = 0, FORMAT = {
          prefix: "",
          groupSize: 3,
          secondaryGroupSize: 0,
          groupSeparator: ",",
          decimalSeparator: ".",
          fractionGroupSize: 0,
          fractionGroupSeparator: "\xA0",
          // non-breaking space
          suffix: ""
        }, ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz", alphabetHasNormalDecimalDigits = true;
        function BigNumber2(v, b) {
          var alphabet, c, caseChanged, e, i, isNum, len, str, x = this;
          if (!(x instanceof BigNumber2)) return new BigNumber2(v, b);
          if (b == null) {
            if (v && v._isBigNumber === true) {
              x.s = v.s;
              if (!v.c || v.e > MAX_EXP) {
                x.c = x.e = null;
              } else if (v.e < MIN_EXP) {
                x.c = [x.e = 0];
              } else {
                x.e = v.e;
                x.c = v.c.slice();
              }
              return;
            }
            if ((isNum = typeof v == "number") && v * 0 == 0) {
              x.s = 1 / v < 0 ? (v = -v, -1) : 1;
              if (v === ~~v) {
                for (e = 0, i = v; i >= 10; i /= 10, e++) ;
                if (e > MAX_EXP) {
                  x.c = x.e = null;
                } else {
                  x.e = e;
                  x.c = [v];
                }
                return;
              }
              str = String(v);
            } else {
              if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);
              x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
            }
            if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
            if ((i = str.search(/e/i)) > 0) {
              if (e < 0) e = i;
              e += +str.slice(i + 1);
              str = str.substring(0, i);
            } else if (e < 0) {
              e = str.length;
            }
          } else {
            intCheck(b, 2, ALPHABET.length, "Base");
            if (b == 10 && alphabetHasNormalDecimalDigits) {
              x = new BigNumber2(v);
              return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
            }
            str = String(v);
            if (isNum = typeof v == "number") {
              if (v * 0 != 0) return parseNumeric(x, str, isNum, b);
              x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;
              if (BigNumber2.DEBUG && str.replace(/^0\.0*|\./, "").length > 15) {
                throw Error(tooManyDigits + v);
              }
            } else {
              x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
            }
            alphabet = ALPHABET.slice(0, b);
            e = i = 0;
            for (len = str.length; i < len; i++) {
              if (alphabet.indexOf(c = str.charAt(i)) < 0) {
                if (c == ".") {
                  if (i > e) {
                    e = len;
                    continue;
                  }
                } else if (!caseChanged) {
                  if (str == str.toUpperCase() && (str = str.toLowerCase()) || str == str.toLowerCase() && (str = str.toUpperCase())) {
                    caseChanged = true;
                    i = -1;
                    e = 0;
                    continue;
                  }
                }
                return parseNumeric(x, String(v), isNum, b);
              }
            }
            isNum = false;
            str = convertBase(str, b, 10, x.s);
            if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
            else e = str.length;
          }
          for (i = 0; str.charCodeAt(i) === 48; i++) ;
          for (len = str.length; str.charCodeAt(--len) === 48; ) ;
          if (str = str.slice(i, ++len)) {
            len -= i;
            if (isNum && BigNumber2.DEBUG && len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
              throw Error(tooManyDigits + x.s * v);
            }
            if ((e = e - i - 1) > MAX_EXP) {
              x.c = x.e = null;
            } else if (e < MIN_EXP) {
              x.c = [x.e = 0];
            } else {
              x.e = e;
              x.c = [];
              i = (e + 1) % LOG_BASE;
              if (e < 0) i += LOG_BASE;
              if (i < len) {
                if (i) x.c.push(+str.slice(0, i));
                for (len -= LOG_BASE; i < len; ) {
                  x.c.push(+str.slice(i, i += LOG_BASE));
                }
                i = LOG_BASE - (str = str.slice(i)).length;
              } else {
                i -= len;
              }
              for (; i--; str += "0") ;
              x.c.push(+str);
            }
          } else {
            x.c = [x.e = 0];
          }
        }
        __name(BigNumber2, "BigNumber");
        BigNumber2.clone = clone;
        BigNumber2.ROUND_UP = 0;
        BigNumber2.ROUND_DOWN = 1;
        BigNumber2.ROUND_CEIL = 2;
        BigNumber2.ROUND_FLOOR = 3;
        BigNumber2.ROUND_HALF_UP = 4;
        BigNumber2.ROUND_HALF_DOWN = 5;
        BigNumber2.ROUND_HALF_EVEN = 6;
        BigNumber2.ROUND_HALF_CEIL = 7;
        BigNumber2.ROUND_HALF_FLOOR = 8;
        BigNumber2.EUCLID = 9;
        BigNumber2.config = BigNumber2.set = function(obj) {
          var p, v;
          if (obj != null) {
            if (typeof obj == "object") {
              if (obj.hasOwnProperty(p = "DECIMAL_PLACES")) {
                v = obj[p];
                intCheck(v, 0, MAX, p);
                DECIMAL_PLACES = v;
              }
              if (obj.hasOwnProperty(p = "ROUNDING_MODE")) {
                v = obj[p];
                intCheck(v, 0, 8, p);
                ROUNDING_MODE = v;
              }
              if (obj.hasOwnProperty(p = "EXPONENTIAL_AT")) {
                v = obj[p];
                if (v && v.pop) {
                  intCheck(v[0], -MAX, 0, p);
                  intCheck(v[1], 0, MAX, p);
                  TO_EXP_NEG = v[0];
                  TO_EXP_POS = v[1];
                } else {
                  intCheck(v, -MAX, MAX, p);
                  TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
                }
              }
              if (obj.hasOwnProperty(p = "RANGE")) {
                v = obj[p];
                if (v && v.pop) {
                  intCheck(v[0], -MAX, -1, p);
                  intCheck(v[1], 1, MAX, p);
                  MIN_EXP = v[0];
                  MAX_EXP = v[1];
                } else {
                  intCheck(v, -MAX, MAX, p);
                  if (v) {
                    MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
                  } else {
                    throw Error(bignumberError + p + " cannot be zero: " + v);
                  }
                }
              }
              if (obj.hasOwnProperty(p = "CRYPTO")) {
                v = obj[p];
                if (v === !!v) {
                  if (v) {
                    if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
                      CRYPTO = v;
                    } else {
                      CRYPTO = !v;
                      throw Error(bignumberError + "crypto unavailable");
                    }
                  } else {
                    CRYPTO = v;
                  }
                } else {
                  throw Error(bignumberError + p + " not true or false: " + v);
                }
              }
              if (obj.hasOwnProperty(p = "MODULO_MODE")) {
                v = obj[p];
                intCheck(v, 0, 9, p);
                MODULO_MODE = v;
              }
              if (obj.hasOwnProperty(p = "POW_PRECISION")) {
                v = obj[p];
                intCheck(v, 0, MAX, p);
                POW_PRECISION = v;
              }
              if (obj.hasOwnProperty(p = "FORMAT")) {
                v = obj[p];
                if (typeof v == "object") FORMAT = v;
                else throw Error(bignumberError + p + " not an object: " + v);
              }
              if (obj.hasOwnProperty(p = "ALPHABET")) {
                v = obj[p];
                if (typeof v == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
                  alphabetHasNormalDecimalDigits = v.slice(0, 10) == "0123456789";
                  ALPHABET = v;
                } else {
                  throw Error(bignumberError + p + " invalid: " + v);
                }
              }
            } else {
              throw Error(bignumberError + "Object expected: " + obj);
            }
          }
          return {
            DECIMAL_PLACES,
            ROUNDING_MODE,
            EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
            RANGE: [MIN_EXP, MAX_EXP],
            CRYPTO,
            MODULO_MODE,
            POW_PRECISION,
            FORMAT,
            ALPHABET
          };
        };
        BigNumber2.isBigNumber = function(v) {
          if (!v || v._isBigNumber !== true) return false;
          if (!BigNumber2.DEBUG) return true;
          var i, n, c = v.c, e = v.e, s = v.s;
          out: if ({}.toString.call(c) == "[object Array]") {
            if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {
              if (c[0] === 0) {
                if (e === 0 && c.length === 1) return true;
                break out;
              }
              i = (e + 1) % LOG_BASE;
              if (i < 1) i += LOG_BASE;
              if (String(c[0]).length == i) {
                for (i = 0; i < c.length; i++) {
                  n = c[i];
                  if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
                }
                if (n !== 0) return true;
              }
            }
          } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
            return true;
          }
          throw Error(bignumberError + "Invalid BigNumber: " + v);
        };
        BigNumber2.maximum = BigNumber2.max = function() {
          return maxOrMin(arguments, -1);
        };
        BigNumber2.minimum = BigNumber2.min = function() {
          return maxOrMin(arguments, 1);
        };
        BigNumber2.random = (function() {
          var pow2_53 = 9007199254740992;
          var random53bitInt = Math.random() * pow2_53 & 2097151 ? function() {
            return mathfloor(Math.random() * pow2_53);
          } : function() {
            return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0);
          };
          return function(dp) {
            var a, b, e, k, v, i = 0, c = [], rand = new BigNumber2(ONE);
            if (dp == null) dp = DECIMAL_PLACES;
            else intCheck(dp, 0, MAX);
            k = mathceil(dp / LOG_BASE);
            if (CRYPTO) {
              if (crypto.getRandomValues) {
                a = crypto.getRandomValues(new Uint32Array(k *= 2));
                for (; i < k; ) {
                  v = a[i] * 131072 + (a[i + 1] >>> 11);
                  if (v >= 9e15) {
                    b = crypto.getRandomValues(new Uint32Array(2));
                    a[i] = b[0];
                    a[i + 1] = b[1];
                  } else {
                    c.push(v % 1e14);
                    i += 2;
                  }
                }
                i = k / 2;
              } else if (crypto.randomBytes) {
                a = crypto.randomBytes(k *= 7);
                for (; i < k; ) {
                  v = (a[i] & 31) * 281474976710656 + a[i + 1] * 1099511627776 + a[i + 2] * 4294967296 + a[i + 3] * 16777216 + (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];
                  if (v >= 9e15) {
                    crypto.randomBytes(7).copy(a, i);
                  } else {
                    c.push(v % 1e14);
                    i += 7;
                  }
                }
                i = k / 7;
              } else {
                CRYPTO = false;
                throw Error(bignumberError + "crypto unavailable");
              }
            }
            if (!CRYPTO) {
              for (; i < k; ) {
                v = random53bitInt();
                if (v < 9e15) c[i++] = v % 1e14;
              }
            }
            k = c[--i];
            dp %= LOG_BASE;
            if (k && dp) {
              v = POWS_TEN[LOG_BASE - dp];
              c[i] = mathfloor(k / v) * v;
            }
            for (; c[i] === 0; c.pop(), i--) ;
            if (i < 0) {
              c = [e = 0];
            } else {
              for (e = -1; c[0] === 0; c.splice(0, 1), e -= LOG_BASE) ;
              for (i = 1, v = c[0]; v >= 10; v /= 10, i++) ;
              if (i < LOG_BASE) e -= LOG_BASE - i;
            }
            rand.e = e;
            rand.c = c;
            return rand;
          };
        })();
        BigNumber2.sum = function() {
          var i = 1, args = arguments, sum = new BigNumber2(args[0]);
          for (; i < args.length; ) sum = sum.plus(args[i++]);
          return sum;
        };
        convertBase = /* @__PURE__ */ (function() {
          var decimal = "0123456789";
          function toBaseOut(str, baseIn, baseOut, alphabet) {
            var j, arr = [0], arrL, i = 0, len = str.length;
            for (; i < len; ) {
              for (arrL = arr.length; arrL--; arr[arrL] *= baseIn) ;
              arr[0] += alphabet.indexOf(str.charAt(i++));
              for (j = 0; j < arr.length; j++) {
                if (arr[j] > baseOut - 1) {
                  if (arr[j + 1] == null) arr[j + 1] = 0;
                  arr[j + 1] += arr[j] / baseOut | 0;
                  arr[j] %= baseOut;
                }
              }
            }
            return arr.reverse();
          }
          __name(toBaseOut, "toBaseOut");
          return function(str, baseIn, baseOut, sign, callerIsToString) {
            var alphabet, d, e, k, r, x, xc, y, i = str.indexOf("."), dp = DECIMAL_PLACES, rm = ROUNDING_MODE;
            if (i >= 0) {
              k = POW_PRECISION;
              POW_PRECISION = 0;
              str = str.replace(".", "");
              y = new BigNumber2(baseIn);
              x = y.pow(str.length - i);
              POW_PRECISION = k;
              y.c = toBaseOut(
                toFixedPoint(coeffToString(x.c), x.e, "0"),
                10,
                baseOut,
                decimal
              );
              y.e = y.c.length;
            }
            xc = toBaseOut(str, baseIn, baseOut, callerIsToString ? (alphabet = ALPHABET, decimal) : (alphabet = decimal, ALPHABET));
            e = k = xc.length;
            for (; xc[--k] == 0; xc.pop()) ;
            if (!xc[0]) return alphabet.charAt(0);
            if (i < 0) {
              --e;
            } else {
              x.c = xc;
              x.e = e;
              x.s = sign;
              x = div(x, y, dp, rm, baseOut);
              xc = x.c;
              r = x.r;
              e = x.e;
            }
            d = e + dp + 1;
            i = xc[d];
            k = baseOut / 2;
            r = r || d < 0 || xc[d + 1] != null;
            r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : i > k || i == k && (rm == 4 || r || rm == 6 && xc[d - 1] & 1 || rm == (x.s < 0 ? 8 : 7));
            if (d < 1 || !xc[0]) {
              str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
            } else {
              xc.length = d;
              if (r) {
                for (--baseOut; ++xc[--d] > baseOut; ) {
                  xc[d] = 0;
                  if (!d) {
                    ++e;
                    xc = [1].concat(xc);
                  }
                }
              }
              for (k = xc.length; !xc[--k]; ) ;
              for (i = 0, str = ""; i <= k; str += alphabet.charAt(xc[i++])) ;
              str = toFixedPoint(str, e, alphabet.charAt(0));
            }
            return str;
          };
        })();
        div = /* @__PURE__ */ (function() {
          function multiply(x, k, base) {
            var m, temp, xlo, xhi, carry = 0, i = x.length, klo = k % SQRT_BASE, khi = k / SQRT_BASE | 0;
            for (x = x.slice(); i--; ) {
              xlo = x[i] % SQRT_BASE;
              xhi = x[i] / SQRT_BASE | 0;
              m = khi * xlo + xhi * klo;
              temp = klo * xlo + m % SQRT_BASE * SQRT_BASE + carry;
              carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
              x[i] = temp % base;
            }
            if (carry) x = [carry].concat(x);
            return x;
          }
          __name(multiply, "multiply");
          function compare2(a, b, aL, bL) {
            var i, cmp;
            if (aL != bL) {
              cmp = aL > bL ? 1 : -1;
            } else {
              for (i = cmp = 0; i < aL; i++) {
                if (a[i] != b[i]) {
                  cmp = a[i] > b[i] ? 1 : -1;
                  break;
                }
              }
            }
            return cmp;
          }
          __name(compare2, "compare");
          function subtract(a, b, aL, base) {
            var i = 0;
            for (; aL--; ) {
              a[aL] -= i;
              i = a[aL] < b[aL] ? 1 : 0;
              a[aL] = i * base + a[aL] - b[aL];
            }
            for (; !a[0] && a.length > 1; a.splice(0, 1)) ;
          }
          __name(subtract, "subtract");
          return function(x, y, dp, rm, base) {
            var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0, yL, yz, s = x.s == y.s ? 1 : -1, xc = x.c, yc = y.c;
            if (!xc || !xc[0] || !yc || !yc[0]) {
              return new BigNumber2(
                // Return NaN if either NaN, or both Infinity or 0.
                !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN : (
                  // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
                  xc && xc[0] == 0 || !yc ? s * 0 : s / 0
                )
              );
            }
            q = new BigNumber2(s);
            qc = q.c = [];
            e = x.e - y.e;
            s = dp + e + 1;
            if (!base) {
              base = BASE;
              e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
              s = s / LOG_BASE | 0;
            }
            for (i = 0; yc[i] == (xc[i] || 0); i++) ;
            if (yc[i] > (xc[i] || 0)) e--;
            if (s < 0) {
              qc.push(1);
              more = true;
            } else {
              xL = xc.length;
              yL = yc.length;
              i = 0;
              s += 2;
              n = mathfloor(base / (yc[0] + 1));
              if (n > 1) {
                yc = multiply(yc, n, base);
                xc = multiply(xc, n, base);
                yL = yc.length;
                xL = xc.length;
              }
              xi = yL;
              rem = xc.slice(0, yL);
              remL = rem.length;
              for (; remL < yL; rem[remL++] = 0) ;
              yz = yc.slice();
              yz = [0].concat(yz);
              yc0 = yc[0];
              if (yc[1] >= base / 2) yc0++;
              do {
                n = 0;
                cmp = compare2(yc, rem, yL, remL);
                if (cmp < 0) {
                  rem0 = rem[0];
                  if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);
                  n = mathfloor(rem0 / yc0);
                  if (n > 1) {
                    if (n >= base) n = base - 1;
                    prod = multiply(yc, n, base);
                    prodL = prod.length;
                    remL = rem.length;
                    while (compare2(prod, rem, prodL, remL) == 1) {
                      n--;
                      subtract(prod, yL < prodL ? yz : yc, prodL, base);
                      prodL = prod.length;
                      cmp = 1;
                    }
                  } else {
                    if (n == 0) {
                      cmp = n = 1;
                    }
                    prod = yc.slice();
                    prodL = prod.length;
                  }
                  if (prodL < remL) prod = [0].concat(prod);
                  subtract(rem, prod, remL, base);
                  remL = rem.length;
                  if (cmp == -1) {
                    while (compare2(yc, rem, yL, remL) < 1) {
                      n++;
                      subtract(rem, yL < remL ? yz : yc, remL, base);
                      remL = rem.length;
                    }
                  }
                } else if (cmp === 0) {
                  n++;
                  rem = [0];
                }
                qc[i++] = n;
                if (rem[0]) {
                  rem[remL++] = xc[xi] || 0;
                } else {
                  rem = [xc[xi]];
                  remL = 1;
                }
              } while ((xi++ < xL || rem[0] != null) && s--);
              more = rem[0] != null;
              if (!qc[0]) qc.splice(0, 1);
            }
            if (base == BASE) {
              for (i = 1, s = qc[0]; s >= 10; s /= 10, i++) ;
              round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);
            } else {
              q.e = e;
              q.r = +more;
            }
            return q;
          };
        })();
        function format(n, i, rm, id) {
          var c0, e, ne, len, str;
          if (rm == null) rm = ROUNDING_MODE;
          else intCheck(rm, 0, 8);
          if (!n.c) return n.toString();
          c0 = n.c[0];
          ne = n.e;
          if (i == null) {
            str = coeffToString(n.c);
            str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS) ? toExponential(str, ne) : toFixedPoint(str, ne, "0");
          } else {
            n = round(new BigNumber2(n), i, rm);
            e = n.e;
            str = coeffToString(n.c);
            len = str.length;
            if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {
              for (; len < i; str += "0", len++) ;
              str = toExponential(str, e);
            } else {
              i -= ne + (id === 2 && e > ne);
              str = toFixedPoint(str, e, "0");
              if (e + 1 > len) {
                if (--i > 0) for (str += "."; i--; str += "0") ;
              } else {
                i += e - len;
                if (i > 0) {
                  if (e + 1 == len) str += ".";
                  for (; i--; str += "0") ;
                }
              }
            }
          }
          return n.s < 0 && c0 ? "-" + str : str;
        }
        __name(format, "format");
        function maxOrMin(args, n) {
          var k, y, i = 1, x = new BigNumber2(args[0]);
          for (; i < args.length; i++) {
            y = new BigNumber2(args[i]);
            if (!y.s || (k = compare(x, y)) === n || k === 0 && x.s === n) {
              x = y;
            }
          }
          return x;
        }
        __name(maxOrMin, "maxOrMin");
        function normalise(n, c, e) {
          var i = 1, j = c.length;
          for (; !c[--j]; c.pop()) ;
          for (j = c[0]; j >= 10; j /= 10, i++) ;
          if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {
            n.c = n.e = null;
          } else if (e < MIN_EXP) {
            n.c = [n.e = 0];
          } else {
            n.e = e;
            n.c = c;
          }
          return n;
        }
        __name(normalise, "normalise");
        parseNumeric = /* @__PURE__ */ (function() {
          var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i, dotAfter = /^([^.]+)\.$/, dotBefore = /^\.([^.]+)$/, isInfinityOrNaN = /^-?(Infinity|NaN)$/, whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
          return function(x, str, isNum, b) {
            var base, s = isNum ? str : str.replace(whitespaceOrPlus, "");
            if (isInfinityOrNaN.test(s)) {
              x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
            } else {
              if (!isNum) {
                s = s.replace(basePrefix, function(m, p1, p2) {
                  base = (p2 = p2.toLowerCase()) == "x" ? 16 : p2 == "b" ? 2 : 8;
                  return !b || b == base ? p1 : m;
                });
                if (b) {
                  base = b;
                  s = s.replace(dotAfter, "$1").replace(dotBefore, "0.$1");
                }
                if (str != s) return new BigNumber2(s, base);
              }
              if (BigNumber2.DEBUG) {
                throw Error(bignumberError + "Not a" + (b ? " base " + b : "") + " number: " + str);
              }
              x.s = null;
            }
            x.c = x.e = null;
          };
        })();
        function round(x, sd, rm, r) {
          var d, i, j, k, n, ni, rd, xc = x.c, pows10 = POWS_TEN;
          if (xc) {
            out: {
              for (d = 1, k = xc[0]; k >= 10; k /= 10, d++) ;
              i = sd - d;
              if (i < 0) {
                i += LOG_BASE;
                j = sd;
                n = xc[ni = 0];
                rd = mathfloor(n / pows10[d - j - 1] % 10);
              } else {
                ni = mathceil((i + 1) / LOG_BASE);
                if (ni >= xc.length) {
                  if (r) {
                    for (; xc.length <= ni; xc.push(0)) ;
                    n = rd = 0;
                    d = 1;
                    i %= LOG_BASE;
                    j = i - LOG_BASE + 1;
                  } else {
                    break out;
                  }
                } else {
                  n = k = xc[ni];
                  for (d = 1; k >= 10; k /= 10, d++) ;
                  i %= LOG_BASE;
                  j = i - LOG_BASE + d;
                  rd = j < 0 ? 0 : mathfloor(n / pows10[d - j - 1] % 10);
                }
              }
              r = r || sd < 0 || // Are there any non-zero digits after the rounding digit?
              // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
              // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
              xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);
              r = rm < 4 ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 && // Check whether the digit to the left of the rounding digit is odd.
              (i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
              if (sd < 1 || !xc[0]) {
                xc.length = 0;
                if (r) {
                  sd -= x.e + 1;
                  xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
                  x.e = -sd || 0;
                } else {
                  xc[0] = x.e = 0;
                }
                return x;
              }
              if (i == 0) {
                xc.length = ni;
                k = 1;
                ni--;
              } else {
                xc.length = ni + 1;
                k = pows10[LOG_BASE - i];
                xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
              }
              if (r) {
                for (; ; ) {
                  if (ni == 0) {
                    for (i = 1, j = xc[0]; j >= 10; j /= 10, i++) ;
                    j = xc[0] += k;
                    for (k = 1; j >= 10; j /= 10, k++) ;
                    if (i != k) {
                      x.e++;
                      if (xc[0] == BASE) xc[0] = 1;
                    }
                    break;
                  } else {
                    xc[ni] += k;
                    if (xc[ni] != BASE) break;
                    xc[ni--] = 0;
                    k = 1;
                  }
                }
              }
              for (i = xc.length; xc[--i] === 0; xc.pop()) ;
            }
            if (x.e > MAX_EXP) {
              x.c = x.e = null;
            } else if (x.e < MIN_EXP) {
              x.c = [x.e = 0];
            }
          }
          return x;
        }
        __name(round, "round");
        function valueOf(n) {
          var str, e = n.e;
          if (e === null) return n.toString();
          str = coeffToString(n.c);
          str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(str, e) : toFixedPoint(str, e, "0");
          return n.s < 0 ? "-" + str : str;
        }
        __name(valueOf, "valueOf");
        P.absoluteValue = P.abs = function() {
          var x = new BigNumber2(this);
          if (x.s < 0) x.s = 1;
          return x;
        };
        P.comparedTo = function(y, b) {
          return compare(this, new BigNumber2(y, b));
        };
        P.decimalPlaces = P.dp = function(dp, rm) {
          var c, n, v, x = this;
          if (dp != null) {
            intCheck(dp, 0, MAX);
            if (rm == null) rm = ROUNDING_MODE;
            else intCheck(rm, 0, 8);
            return round(new BigNumber2(x), dp + x.e + 1, rm);
          }
          if (!(c = x.c)) return null;
          n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;
          if (v = c[v]) for (; v % 10 == 0; v /= 10, n--) ;
          if (n < 0) n = 0;
          return n;
        };
        P.dividedBy = P.div = function(y, b) {
          return div(this, new BigNumber2(y, b), DECIMAL_PLACES, ROUNDING_MODE);
        };
        P.dividedToIntegerBy = P.idiv = function(y, b) {
          return div(this, new BigNumber2(y, b), 0, 1);
        };
        P.exponentiatedBy = P.pow = function(n, m) {
          var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y, x = this;
          n = new BigNumber2(n);
          if (n.c && !n.isInteger()) {
            throw Error(bignumberError + "Exponent not an integer: " + valueOf(n));
          }
          if (m != null) m = new BigNumber2(m);
          nIsBig = n.e > 14;
          if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {
            y = new BigNumber2(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
            return m ? y.mod(m) : y;
          }
          nIsNeg = n.s < 0;
          if (m) {
            if (m.c ? !m.c[0] : !m.s) return new BigNumber2(NaN);
            isModExp = !nIsNeg && x.isInteger() && m.isInteger();
            if (isModExp) x = x.mod(m);
          } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0 ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7 : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {
            k = x.s < 0 && isOdd(n) ? -0 : 0;
            if (x.e > -1) k = 1 / k;
            return new BigNumber2(nIsNeg ? 1 / k : k);
          } else if (POW_PRECISION) {
            k = mathceil(POW_PRECISION / LOG_BASE + 2);
          }
          if (nIsBig) {
            half = new BigNumber2(0.5);
            if (nIsNeg) n.s = 1;
            nIsOdd = isOdd(n);
          } else {
            i = Math.abs(+valueOf(n));
            nIsOdd = i % 2;
          }
          y = new BigNumber2(ONE);
          for (; ; ) {
            if (nIsOdd) {
              y = y.times(x);
              if (!y.c) break;
              if (k) {
                if (y.c.length > k) y.c.length = k;
              } else if (isModExp) {
                y = y.mod(m);
              }
            }
            if (i) {
              i = mathfloor(i / 2);
              if (i === 0) break;
              nIsOdd = i % 2;
            } else {
              n = n.times(half);
              round(n, n.e + 1, 1);
              if (n.e > 14) {
                nIsOdd = isOdd(n);
              } else {
                i = +valueOf(n);
                if (i === 0) break;
                nIsOdd = i % 2;
              }
            }
            x = x.times(x);
            if (k) {
              if (x.c && x.c.length > k) x.c.length = k;
            } else if (isModExp) {
              x = x.mod(m);
            }
          }
          if (isModExp) return y;
          if (nIsNeg) y = ONE.div(y);
          return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
        };
        P.integerValue = function(rm) {
          var n = new BigNumber2(this);
          if (rm == null) rm = ROUNDING_MODE;
          else intCheck(rm, 0, 8);
          return round(n, n.e + 1, rm);
        };
        P.isEqualTo = P.eq = function(y, b) {
          return compare(this, new BigNumber2(y, b)) === 0;
        };
        P.isFinite = function() {
          return !!this.c;
        };
        P.isGreaterThan = P.gt = function(y, b) {
          return compare(this, new BigNumber2(y, b)) > 0;
        };
        P.isGreaterThanOrEqualTo = P.gte = function(y, b) {
          return (b = compare(this, new BigNumber2(y, b))) === 1 || b === 0;
        };
        P.isInteger = function() {
          return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
        };
        P.isLessThan = P.lt = function(y, b) {
          return compare(this, new BigNumber2(y, b)) < 0;
        };
        P.isLessThanOrEqualTo = P.lte = function(y, b) {
          return (b = compare(this, new BigNumber2(y, b))) === -1 || b === 0;
        };
        P.isNaN = function() {
          return !this.s;
        };
        P.isNegative = function() {
          return this.s < 0;
        };
        P.isPositive = function() {
          return this.s > 0;
        };
        P.isZero = function() {
          return !!this.c && this.c[0] == 0;
        };
        P.minus = function(y, b) {
          var i, j, t, xLTy, x = this, a = x.s;
          y = new BigNumber2(y, b);
          b = y.s;
          if (!a || !b) return new BigNumber2(NaN);
          if (a != b) {
            y.s = -b;
            return x.plus(y);
          }
          var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
          if (!xe || !ye) {
            if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber2(yc ? x : NaN);
            if (!xc[0] || !yc[0]) {
              return yc[0] ? (y.s = -b, y) : new BigNumber2(xc[0] ? x : (
                // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
                ROUNDING_MODE == 3 ? -0 : 0
              ));
            }
          }
          xe = bitFloor(xe);
          ye = bitFloor(ye);
          xc = xc.slice();
          if (a = xe - ye) {
            if (xLTy = a < 0) {
              a = -a;
              t = xc;
            } else {
              ye = xe;
              t = yc;
            }
            t.reverse();
            for (b = a; b--; t.push(0)) ;
            t.reverse();
          } else {
            j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;
            for (a = b = 0; b < j; b++) {
              if (xc[b] != yc[b]) {
                xLTy = xc[b] < yc[b];
                break;
              }
            }
          }
          if (xLTy) {
            t = xc;
            xc = yc;
            yc = t;
            y.s = -y.s;
          }
          b = (j = yc.length) - (i = xc.length);
          if (b > 0) for (; b--; xc[i++] = 0) ;
          b = BASE - 1;
          for (; j > a; ) {
            if (xc[--j] < yc[j]) {
              for (i = j; i && !xc[--i]; xc[i] = b) ;
              --xc[i];
              xc[j] += BASE;
            }
            xc[j] -= yc[j];
          }
          for (; xc[0] == 0; xc.splice(0, 1), --ye) ;
          if (!xc[0]) {
            y.s = ROUNDING_MODE == 3 ? -1 : 1;
            y.c = [y.e = 0];
            return y;
          }
          return normalise(y, xc, ye);
        };
        P.modulo = P.mod = function(y, b) {
          var q, s, x = this;
          y = new BigNumber2(y, b);
          if (!x.c || !y.s || y.c && !y.c[0]) {
            return new BigNumber2(NaN);
          } else if (!y.c || x.c && !x.c[0]) {
            return new BigNumber2(x);
          }
          if (MODULO_MODE == 9) {
            s = y.s;
            y.s = 1;
            q = div(x, y, 0, 3);
            y.s = s;
            q.s *= s;
          } else {
            q = div(x, y, 0, MODULO_MODE);
          }
          y = x.minus(q.times(y));
          if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;
          return y;
        };
        P.multipliedBy = P.times = function(y, b) {
          var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc, base, sqrtBase, x = this, xc = x.c, yc = (y = new BigNumber2(y, b)).c;
          if (!xc || !yc || !xc[0] || !yc[0]) {
            if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
              y.c = y.e = y.s = null;
            } else {
              y.s *= x.s;
              if (!xc || !yc) {
                y.c = y.e = null;
              } else {
                y.c = [0];
                y.e = 0;
              }
            }
            return y;
          }
          e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
          y.s *= x.s;
          xcL = xc.length;
          ycL = yc.length;
          if (xcL < ycL) {
            zc = xc;
            xc = yc;
            yc = zc;
            i = xcL;
            xcL = ycL;
            ycL = i;
          }
          for (i = xcL + ycL, zc = []; i--; zc.push(0)) ;
          base = BASE;
          sqrtBase = SQRT_BASE;
          for (i = ycL; --i >= 0; ) {
            c = 0;
            ylo = yc[i] % sqrtBase;
            yhi = yc[i] / sqrtBase | 0;
            for (k = xcL, j = i + k; j > i; ) {
              xlo = xc[--k] % sqrtBase;
              xhi = xc[k] / sqrtBase | 0;
              m = yhi * xlo + xhi * ylo;
              xlo = ylo * xlo + m % sqrtBase * sqrtBase + zc[j] + c;
              c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
              zc[j--] = xlo % base;
            }
            zc[j] = c;
          }
          if (c) {
            ++e;
          } else {
            zc.splice(0, 1);
          }
          return normalise(y, zc, e);
        };
        P.negated = function() {
          var x = new BigNumber2(this);
          x.s = -x.s || null;
          return x;
        };
        P.plus = function(y, b) {
          var t, x = this, a = x.s;
          y = new BigNumber2(y, b);
          b = y.s;
          if (!a || !b) return new BigNumber2(NaN);
          if (a != b) {
            y.s = -b;
            return x.minus(y);
          }
          var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
          if (!xe || !ye) {
            if (!xc || !yc) return new BigNumber2(a / 0);
            if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber2(xc[0] ? x : a * 0);
          }
          xe = bitFloor(xe);
          ye = bitFloor(ye);
          xc = xc.slice();
          if (a = xe - ye) {
            if (a > 0) {
              ye = xe;
              t = yc;
            } else {
              a = -a;
              t = xc;
            }
            t.reverse();
            for (; a--; t.push(0)) ;
            t.reverse();
          }
          a = xc.length;
          b = yc.length;
          if (a - b < 0) {
            t = yc;
            yc = xc;
            xc = t;
            b = a;
          }
          for (a = 0; b; ) {
            a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
            xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
          }
          if (a) {
            xc = [a].concat(xc);
            ++ye;
          }
          return normalise(y, xc, ye);
        };
        P.precision = P.sd = function(sd, rm) {
          var c, n, v, x = this;
          if (sd != null && sd !== !!sd) {
            intCheck(sd, 1, MAX);
            if (rm == null) rm = ROUNDING_MODE;
            else intCheck(rm, 0, 8);
            return round(new BigNumber2(x), sd, rm);
          }
          if (!(c = x.c)) return null;
          v = c.length - 1;
          n = v * LOG_BASE + 1;
          if (v = c[v]) {
            for (; v % 10 == 0; v /= 10, n--) ;
            for (v = c[0]; v >= 10; v /= 10, n++) ;
          }
          if (sd && x.e + 1 > n) n = x.e + 1;
          return n;
        };
        P.shiftedBy = function(k) {
          intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
          return this.times("1e" + k);
        };
        P.squareRoot = P.sqrt = function() {
          var m, n, r, rep, t, x = this, c = x.c, s = x.s, e = x.e, dp = DECIMAL_PLACES + 4, half = new BigNumber2("0.5");
          if (s !== 1 || !c || !c[0]) {
            return new BigNumber2(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
          }
          s = Math.sqrt(+valueOf(x));
          if (s == 0 || s == 1 / 0) {
            n = coeffToString(c);
            if ((n.length + e) % 2 == 0) n += "0";
            s = Math.sqrt(+n);
            e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);
            if (s == 1 / 0) {
              n = "5e" + e;
            } else {
              n = s.toExponential();
              n = n.slice(0, n.indexOf("e") + 1) + e;
            }
            r = new BigNumber2(n);
          } else {
            r = new BigNumber2(s + "");
          }
          if (r.c[0]) {
            e = r.e;
            s = e + dp;
            if (s < 3) s = 0;
            for (; ; ) {
              t = r;
              r = half.times(t.plus(div(x, t, dp, 1)));
              if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {
                if (r.e < e) --s;
                n = n.slice(s - 3, s + 1);
                if (n == "9999" || !rep && n == "4999") {
                  if (!rep) {
                    round(t, t.e + DECIMAL_PLACES + 2, 0);
                    if (t.times(t).eq(x)) {
                      r = t;
                      break;
                    }
                  }
                  dp += 4;
                  s += 4;
                  rep = 1;
                } else {
                  if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
                    round(r, r.e + DECIMAL_PLACES + 2, 1);
                    m = !r.times(r).eq(x);
                  }
                  break;
                }
              }
            }
          }
          return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
        };
        P.toExponential = function(dp, rm) {
          if (dp != null) {
            intCheck(dp, 0, MAX);
            dp++;
          }
          return format(this, dp, rm, 1);
        };
        P.toFixed = function(dp, rm) {
          if (dp != null) {
            intCheck(dp, 0, MAX);
            dp = dp + this.e + 1;
          }
          return format(this, dp, rm);
        };
        P.toFormat = function(dp, rm, format2) {
          var str, x = this;
          if (format2 == null) {
            if (dp != null && rm && typeof rm == "object") {
              format2 = rm;
              rm = null;
            } else if (dp && typeof dp == "object") {
              format2 = dp;
              dp = rm = null;
            } else {
              format2 = FORMAT;
            }
          } else if (typeof format2 != "object") {
            throw Error(bignumberError + "Argument not an object: " + format2);
          }
          str = x.toFixed(dp, rm);
          if (x.c) {
            var i, arr = str.split("."), g1 = +format2.groupSize, g2 = +format2.secondaryGroupSize, groupSeparator = format2.groupSeparator || "", intPart = arr[0], fractionPart = arr[1], isNeg = x.s < 0, intDigits = isNeg ? intPart.slice(1) : intPart, len = intDigits.length;
            if (g2) {
              i = g1;
              g1 = g2;
              g2 = i;
              len -= i;
            }
            if (g1 > 0 && len > 0) {
              i = len % g1 || g1;
              intPart = intDigits.substr(0, i);
              for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
              if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
              if (isNeg) intPart = "-" + intPart;
            }
            str = fractionPart ? intPart + (format2.decimalSeparator || "") + ((g2 = +format2.fractionGroupSize) ? fractionPart.replace(
              new RegExp("\\d{" + g2 + "}\\B", "g"),
              "$&" + (format2.fractionGroupSeparator || "")
            ) : fractionPart) : intPart;
          }
          return (format2.prefix || "") + str + (format2.suffix || "");
        };
        P.toFraction = function(md) {
          var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s, x = this, xc = x.c;
          if (md != null) {
            n = new BigNumber2(md);
            if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
              throw Error(bignumberError + "Argument " + (n.isInteger() ? "out of range: " : "not an integer: ") + valueOf(n));
            }
          }
          if (!xc) return new BigNumber2(x);
          d = new BigNumber2(ONE);
          n1 = d0 = new BigNumber2(ONE);
          d1 = n0 = new BigNumber2(ONE);
          s = coeffToString(xc);
          e = d.e = s.length - x.e - 1;
          d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
          md = !md || n.comparedTo(d) > 0 ? e > 0 ? d : n1 : n;
          exp = MAX_EXP;
          MAX_EXP = 1 / 0;
          n = new BigNumber2(s);
          n0.c[0] = 0;
          for (; ; ) {
            q = div(n, d, 0, 1);
            d2 = d0.plus(q.times(d1));
            if (d2.comparedTo(md) == 1) break;
            d0 = d1;
            d1 = d2;
            n1 = n0.plus(q.times(d2 = n1));
            n0 = d2;
            d = n.minus(q.times(d2 = d));
            n = d2;
          }
          d2 = div(md.minus(d0), d1, 0, 1);
          n0 = n0.plus(d2.times(n1));
          d0 = d0.plus(d2.times(d1));
          n0.s = n1.s = x.s;
          e = e * 2;
          r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
            div(n0, d0, e, ROUNDING_MODE).minus(x).abs()
          ) < 1 ? [n1, d1] : [n0, d0];
          MAX_EXP = exp;
          return r;
        };
        P.toNumber = function() {
          return +valueOf(this);
        };
        P.toPrecision = function(sd, rm) {
          if (sd != null) intCheck(sd, 1, MAX);
          return format(this, sd, rm, 2);
        };
        P.toString = function(b) {
          var str, n = this, s = n.s, e = n.e;
          if (e === null) {
            if (s) {
              str = "Infinity";
              if (s < 0) str = "-" + str;
            } else {
              str = "NaN";
            }
          } else {
            if (b == null) {
              str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(coeffToString(n.c), e) : toFixedPoint(coeffToString(n.c), e, "0");
            } else if (b === 10 && alphabetHasNormalDecimalDigits) {
              n = round(new BigNumber2(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
              str = toFixedPoint(coeffToString(n.c), n.e, "0");
            } else {
              intCheck(b, 2, ALPHABET.length, "Base");
              str = convertBase(toFixedPoint(coeffToString(n.c), e, "0"), 10, b, s, true);
            }
            if (s < 0 && n.c[0]) str = "-" + str;
          }
          return str;
        };
        P.valueOf = P.toJSON = function() {
          return valueOf(this);
        };
        P._isBigNumber = true;
        if (configObject != null) BigNumber2.set(configObject);
        return BigNumber2;
      }
      __name(clone, "clone");
      function bitFloor(n) {
        var i = n | 0;
        return n > 0 || n === i ? i : i - 1;
      }
      __name(bitFloor, "bitFloor");
      function coeffToString(a) {
        var s, z, i = 1, j = a.length, r = a[0] + "";
        for (; i < j; ) {
          s = a[i++] + "";
          z = LOG_BASE - s.length;
          for (; z--; s = "0" + s) ;
          r += s;
        }
        for (j = r.length; r.charCodeAt(--j) === 48; ) ;
        return r.slice(0, j + 1 || 1);
      }
      __name(coeffToString, "coeffToString");
      function compare(x, y) {
        var a, b, xc = x.c, yc = y.c, i = x.s, j = y.s, k = x.e, l = y.e;
        if (!i || !j) return null;
        a = xc && !xc[0];
        b = yc && !yc[0];
        if (a || b) return a ? b ? 0 : -j : i;
        if (i != j) return i;
        a = i < 0;
        b = k == l;
        if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;
        if (!b) return k > l ^ a ? 1 : -1;
        j = (k = xc.length) < (l = yc.length) ? k : l;
        for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;
        return k == l ? 0 : k > l ^ a ? 1 : -1;
      }
      __name(compare, "compare");
      function intCheck(n, min, max, name) {
        if (n < min || n > max || n !== mathfloor(n)) {
          throw Error(bignumberError + (name || "Argument") + (typeof n == "number" ? n < min || n > max ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(n));
        }
      }
      __name(intCheck, "intCheck");
      function isOdd(n) {
        var k = n.c.length - 1;
        return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
      }
      __name(isOdd, "isOdd");
      function toExponential(str, e) {
        return (str.length > 1 ? str.charAt(0) + "." + str.slice(1) : str) + (e < 0 ? "e" : "e+") + e;
      }
      __name(toExponential, "toExponential");
      function toFixedPoint(str, e, z) {
        var len, zs;
        if (e < 0) {
          for (zs = z + "."; ++e; zs += z) ;
          str = zs + str;
        } else {
          len = str.length;
          if (++e > len) {
            for (zs = z, e -= len; --e; zs += z) ;
            str += zs;
          } else if (e < len) {
            str = str.slice(0, e) + "." + str.slice(e);
          }
        }
        return str;
      }
      __name(toFixedPoint, "toFixedPoint");
      BigNumber = clone();
      BigNumber["default"] = BigNumber.BigNumber = BigNumber;
      if (typeof define == "function" && define.amd) {
        define(function() {
          return BigNumber;
        });
      } else if (typeof module != "undefined" && module.exports) {
        module.exports = BigNumber;
      } else {
        if (!globalObject) {
          globalObject = typeof self != "undefined" && self ? self : window;
        }
        globalObject.BigNumber = BigNumber;
      }
    })(exports);
  }
});

// ../../node_modules/.bun/json-bigint@1.0.0/node_modules/json-bigint/lib/stringify.js
var require_stringify = __commonJS({
  "../../node_modules/.bun/json-bigint@1.0.0/node_modules/json-bigint/lib/stringify.js"(exports, module) {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var BigNumber = require_bignumber();
    var JSON2 = module.exports;
    (function() {
      "use strict";
      function f(n) {
        return n < 10 ? "0" + n : n;
      }
      __name(f, "f");
      var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
        // table of character substitutions
        "\b": "\\b",
        "	": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
      }, rep;
      function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
          var c = meta[a];
          return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
      }
      __name(quote, "quote");
      function str(key, holder) {
        var i, k, v, length, mind = gap, partial, value = holder[key], isBigNumber2 = value != null && (value instanceof BigNumber || BigNumber.isBigNumber(value));
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
          value = value.toJSON(key);
        }
        if (typeof rep === "function") {
          value = rep.call(holder, key, value);
        }
        switch (typeof value) {
          case "string":
            if (isBigNumber2) {
              return value;
            } else {
              return quote(value);
            }
          case "number":
            return isFinite(value) ? String(value) : "null";
          case "boolean":
          case "null":
          case "bigint":
            return String(value);
          // If the type is 'object', we might be dealing with an object or an array or
          // null.
          case "object":
            if (!value) {
              return "null";
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === "[object Array]") {
              length = value.length;
              for (i = 0; i < length; i += 1) {
                partial[i] = str(i, value) || "null";
              }
              v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
              gap = mind;
              return v;
            }
            if (rep && typeof rep === "object") {
              length = rep.length;
              for (i = 0; i < length; i += 1) {
                if (typeof rep[i] === "string") {
                  k = rep[i];
                  v = str(k, value);
                  if (v) {
                    partial.push(quote(k) + (gap ? ": " : ":") + v);
                  }
                }
              }
            } else {
              Object.keys(value).forEach(function(k2) {
                var v2 = str(k2, value);
                if (v2) {
                  partial.push(quote(k2) + (gap ? ": " : ":") + v2);
                }
              });
            }
            v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
      }
      __name(str, "str");
      if (typeof JSON2.stringify !== "function") {
        JSON2.stringify = function(value, replacer, space) {
          var i;
          gap = "";
          indent = "";
          if (typeof space === "number") {
            for (i = 0; i < space; i += 1) {
              indent += " ";
            }
          } else if (typeof space === "string") {
            indent = space;
          }
          rep = replacer;
          if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
            throw new Error("JSON.stringify");
          }
          return str("", { "": value });
        };
      }
    })();
  }
});

// ../../node_modules/.bun/json-bigint@1.0.0/node_modules/json-bigint/lib/parse.js
var require_parse = __commonJS({
  "../../node_modules/.bun/json-bigint@1.0.0/node_modules/json-bigint/lib/parse.js"(exports, module) {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var BigNumber = null;
    var suspectProtoRx = /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/;
    var suspectConstructorRx = /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/;
    var json_parse = /* @__PURE__ */ __name(function(options) {
      "use strict";
      var _options = {
        strict: false,
        // not being strict means do not generate syntax errors for "duplicate key"
        storeAsString: false,
        // toggles whether the values should be stored as BigNumber (default) or a string
        alwaysParseAsBig: false,
        // toggles whether all numbers should be Big
        useNativeBigInt: false,
        // toggles whether to use native BigInt instead of bignumber.js
        protoAction: "error",
        constructorAction: "error"
      };
      if (options !== void 0 && options !== null) {
        if (options.strict === true) {
          _options.strict = true;
        }
        if (options.storeAsString === true) {
          _options.storeAsString = true;
        }
        _options.alwaysParseAsBig = options.alwaysParseAsBig === true ? options.alwaysParseAsBig : false;
        _options.useNativeBigInt = options.useNativeBigInt === true ? options.useNativeBigInt : false;
        if (typeof options.constructorAction !== "undefined") {
          if (options.constructorAction === "error" || options.constructorAction === "ignore" || options.constructorAction === "preserve") {
            _options.constructorAction = options.constructorAction;
          } else {
            throw new Error(
              `Incorrect value for constructorAction option, must be "error", "ignore" or undefined but passed ${options.constructorAction}`
            );
          }
        }
        if (typeof options.protoAction !== "undefined") {
          if (options.protoAction === "error" || options.protoAction === "ignore" || options.protoAction === "preserve") {
            _options.protoAction = options.protoAction;
          } else {
            throw new Error(
              `Incorrect value for protoAction option, must be "error", "ignore" or undefined but passed ${options.protoAction}`
            );
          }
        }
      }
      var at, ch, escapee = {
        '"': '"',
        "\\": "\\",
        "/": "/",
        b: "\b",
        f: "\f",
        n: "\n",
        r: "\r",
        t: "	"
      }, text, error3 = /* @__PURE__ */ __name(function(m) {
        throw {
          name: "SyntaxError",
          message: m,
          at,
          text
        };
      }, "error"), next = /* @__PURE__ */ __name(function(c) {
        if (c && c !== ch) {
          error3("Expected '" + c + "' instead of '" + ch + "'");
        }
        ch = text.charAt(at);
        at += 1;
        return ch;
      }, "next"), number = /* @__PURE__ */ __name(function() {
        var number2, string2 = "";
        if (ch === "-") {
          string2 = "-";
          next("-");
        }
        while (ch >= "0" && ch <= "9") {
          string2 += ch;
          next();
        }
        if (ch === ".") {
          string2 += ".";
          while (next() && ch >= "0" && ch <= "9") {
            string2 += ch;
          }
        }
        if (ch === "e" || ch === "E") {
          string2 += ch;
          next();
          if (ch === "-" || ch === "+") {
            string2 += ch;
            next();
          }
          while (ch >= "0" && ch <= "9") {
            string2 += ch;
            next();
          }
        }
        number2 = +string2;
        if (!isFinite(number2)) {
          error3("Bad number");
        } else {
          if (BigNumber == null) BigNumber = require_bignumber();
          if (string2.length > 15)
            return _options.storeAsString ? string2 : _options.useNativeBigInt ? BigInt(string2) : new BigNumber(string2);
          else
            return !_options.alwaysParseAsBig ? number2 : _options.useNativeBigInt ? BigInt(number2) : new BigNumber(number2);
        }
      }, "number"), string = /* @__PURE__ */ __name(function() {
        var hex, i, string2 = "", uffff;
        if (ch === '"') {
          var startAt = at;
          while (next()) {
            if (ch === '"') {
              if (at - 1 > startAt) string2 += text.substring(startAt, at - 1);
              next();
              return string2;
            }
            if (ch === "\\") {
              if (at - 1 > startAt) string2 += text.substring(startAt, at - 1);
              next();
              if (ch === "u") {
                uffff = 0;
                for (i = 0; i < 4; i += 1) {
                  hex = parseInt(next(), 16);
                  if (!isFinite(hex)) {
                    break;
                  }
                  uffff = uffff * 16 + hex;
                }
                string2 += String.fromCharCode(uffff);
              } else if (typeof escapee[ch] === "string") {
                string2 += escapee[ch];
              } else {
                break;
              }
              startAt = at;
            }
          }
        }
        error3("Bad string");
      }, "string"), white = /* @__PURE__ */ __name(function() {
        while (ch && ch <= " ") {
          next();
        }
      }, "white"), word = /* @__PURE__ */ __name(function() {
        switch (ch) {
          case "t":
            next("t");
            next("r");
            next("u");
            next("e");
            return true;
          case "f":
            next("f");
            next("a");
            next("l");
            next("s");
            next("e");
            return false;
          case "n":
            next("n");
            next("u");
            next("l");
            next("l");
            return null;
        }
        error3("Unexpected '" + ch + "'");
      }, "word"), value, array = /* @__PURE__ */ __name(function() {
        var array2 = [];
        if (ch === "[") {
          next("[");
          white();
          if (ch === "]") {
            next("]");
            return array2;
          }
          while (ch) {
            array2.push(value());
            white();
            if (ch === "]") {
              next("]");
              return array2;
            }
            next(",");
            white();
          }
        }
        error3("Bad array");
      }, "array"), object = /* @__PURE__ */ __name(function() {
        var key, object2 = /* @__PURE__ */ Object.create(null);
        if (ch === "{") {
          next("{");
          white();
          if (ch === "}") {
            next("}");
            return object2;
          }
          while (ch) {
            key = string();
            white();
            next(":");
            if (_options.strict === true && Object.hasOwnProperty.call(object2, key)) {
              error3('Duplicate key "' + key + '"');
            }
            if (suspectProtoRx.test(key) === true) {
              if (_options.protoAction === "error") {
                error3("Object contains forbidden prototype property");
              } else if (_options.protoAction === "ignore") {
                value();
              } else {
                object2[key] = value();
              }
            } else if (suspectConstructorRx.test(key) === true) {
              if (_options.constructorAction === "error") {
                error3("Object contains forbidden constructor property");
              } else if (_options.constructorAction === "ignore") {
                value();
              } else {
                object2[key] = value();
              }
            } else {
              object2[key] = value();
            }
            white();
            if (ch === "}") {
              next("}");
              return object2;
            }
            next(",");
            white();
          }
        }
        error3("Bad object");
      }, "object");
      value = /* @__PURE__ */ __name(function() {
        white();
        switch (ch) {
          case "{":
            return object();
          case "[":
            return array();
          case '"':
            return string();
          case "-":
            return number();
          default:
            return ch >= "0" && ch <= "9" ? number() : word();
        }
      }, "value");
      return function(source, reviver2) {
        var result;
        text = source + "";
        at = 0;
        ch = " ";
        result = value();
        white();
        if (ch) {
          error3("Syntax error");
        }
        return typeof reviver2 === "function" ? (/* @__PURE__ */ __name((function walk(holder, key) {
          var k, v, value2 = holder[key];
          if (value2 && typeof value2 === "object") {
            Object.keys(value2).forEach(function(k2) {
              v = walk(value2, k2);
              if (v !== void 0) {
                value2[k2] = v;
              } else {
                delete value2[k2];
              }
            });
          }
          return reviver2.call(holder, key, value2);
        }), "walk"))({ "": result }, "") : result;
      };
    }, "json_parse");
    module.exports = json_parse;
  }
});

// ../../node_modules/.bun/json-bigint@1.0.0/node_modules/json-bigint/index.js
var require_json_bigint = __commonJS({
  "../../node_modules/.bun/json-bigint@1.0.0/node_modules/json-bigint/index.js"(exports, module) {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var json_stringify = require_stringify().stringify;
    var json_parse = require_parse();
    module.exports = function(options) {
      return {
        parse: json_parse(options),
        stringify: json_stringify
      };
    };
    module.exports.parse = json_parse();
    module.exports.stringify = json_stringify;
  }
});

// .wrangler/tmp/bundle-bHKBtT/middleware-loader.entry.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// .wrangler/tmp/bundle-bHKBtT/middleware-insertion-facade.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/index.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/hono.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/hono-base.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/compose.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context2, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context2.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context2, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context2.error = err;
            res = await onError(err, context2);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context2.finalized === false && onNotFound) {
          res = await onNotFound(context2);
        }
      }
      if (res && (context2.finalized === false || isError)) {
        context2.res = res;
      }
      return context2;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/context.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/request.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/http-exception.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/request/constants.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/utils/body.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/utils/buffer.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/utils/crypto.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/utils/buffer.js
var bufferToFormData = /* @__PURE__ */ __name((arrayBuffer, contentType) => {
  const response = new Response(arrayBuffer, {
    headers: {
      // Normalize the media type (case-insensitive) while keeping parameters like the boundary
      "Content-Type": contentType.replace(/^[^;]+/, (mediaType) => mediaType.toLowerCase())
    }
  });
  return response.formData();
}, "bufferToFormData");

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/utils/body.js
var MAX_NESTING_DEPTH = 32;
var MAX_NESTED_OBJECTS = 1e4;
var isRawRequest = /* @__PURE__ */ __name((request) => "headers" in request, "isRawRequest");
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const contentType = headers.get("Content-Type");
  const mediaType = contentType?.split(";")[0].trim().toLowerCase();
  if (mediaType === "multipart/form-data" || mediaType === "application/x-www-form-urlencoded") {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  if (!isRawRequest(request) && request.bodyCache.formData) {
    return convertFormDataToBodyData(
      await request.bodyCache.formData,
      options
    );
  }
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const arrayBuffer = await request.arrayBuffer();
  const formDataPromise = bufferToFormData(arrayBuffer, headers.get("Content-Type") || "");
  if (!isRawRequest(request)) {
    request.bodyCache.formData = formDataPromise;
  }
  const formData = await formDataPromise;
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  const nestingState = { count: 0 };
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value, nestingState);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value, state) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".", MAX_NESTING_DEPTH + 2);
  if (keys.length > MAX_NESTING_DEPTH + 1) {
    throwNestingLimitExceeded();
  }
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        if (state.count++ >= MAX_NESTED_OBJECTS) {
          throwNestingLimitExceeded();
        }
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");
var throwNestingLimitExceeded = /* @__PURE__ */ __name(() => {
  throw new Error("Nesting limit exceeded");
}, "throwNestingLimitExceeded");

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/utils/url.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (segment.charCodeAt(segment.length - 1) === 63) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.slice(0, -1);
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => str.indexOf("%") !== -1 ? tryDecode(str, decodeURIComponent_) : str, "tryDecodeURIComponent");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return tryDecodeURIComponent(value);
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  const hashIndex = url.indexOf("#", 8);
  if (hashIndex !== -1) {
    url = url.slice(0, hashIndex);
  }
  let encoded;
  if (!multiple && key && key.indexOf("%") === -1 && key.indexOf("+") === -1) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = /* @__PURE__ */ Object.create(null);
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/request.js
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex]?.[1][key];
    const param = this.#getParamValue(paramKey);
    return param && tryDecodeURIComponent(param);
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex]?.[1] ?? {});
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = tryDecodeURIComponent(value);
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = /* @__PURE__ */ Object.create(null);
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    for (const anyCachedKey in bodyCache) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    ;
    (this.#validatedData ??= {})[target] = data;
  }
  valid(target) {
    return this.#validatedData?.[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/utils/html.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context2, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context: context2 }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context2, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var createResponseInstance = /* @__PURE__ */ __name((body, init) => new Response(body, init), "createResponseInstance");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   // Append multiple headers using the append option (e.g. Vary)
   *   c.header('Vary', 'Accept-Encoding', { append: true })
   *   c.header('Vary', 'User-Agent', { append: true })
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    let responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders;
    if (typeof arg === "object" && arg.headers) {
      responseHeaders ??= new Headers();
      for (const [key, value] of new Headers(arg.headers)) {
        if (key === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      if (!responseHeaders) {
        let count3 = 0;
        for (const k in headers) {
          if (++count3 > 1 || typeof headers[k] !== "string") {
            responseHeaders = new Headers();
            break;
          }
        }
      }
      if (responseHeaders) {
        for (const k in headers) {
          const v = headers[k];
          if (typeof v === "string") {
            responseHeaders.set(k, v);
          } else {
            responseHeaders.delete(k);
            for (const v2 of v) {
              responseHeaders.append(k, v2);
            }
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, {
      status,
      headers: responseHeaders ?? headers
    });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch", "query"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/utils/constants.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class _Hono {
  static {
    __name(this, "_Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  query;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env3, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env3, "GET")))();
    }
    const path = this.getPath(request, { env: env3 });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env: env3,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context2 = await composed(c);
        if (!context2.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context2.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} env - env Object
   * @param {ExecutionContext} executionCtx - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/router/reg-exp-router/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/router/reg-exp-router/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/router/utils.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var createNullObject = /* @__PURE__ */ __name(() => /* @__PURE__ */ Object.create(null), "createNullObject");

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/router/reg-exp-router/matcher.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name(((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }), "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/router/reg-exp-router/node.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return b === TAIL_WILDCARD_REG_EXP_STR ? -1 : 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class _Node {
  static {
    __name(this, "_Node");
  }
  // handler index of a dynamic path, or -1 for a static path terminal
  #index;
  #varIndex;
  #children = createNullObject();
  insert(tokens, index, paramMap, context2, isStatic) {
    let node = this;
    for (let i = 0, len = tokens.length; i < len; i++) {
      const token = tokens[i];
      const pattern = token.length === 1 ? token === "*" ? i === len - 1 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : null : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
      let nextNode;
      if (pattern) {
        const name = pattern[1];
        let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
        if (name && pattern[2]) {
          if (regexpStr === ".*") {
            throw PATH_ERROR;
          }
          regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
          if (/\((?!\?:)/.test(regexpStr)) {
            throw PATH_ERROR;
          }
          if (regexpStr.length === 1 && regExpMetaChars.has(regexpStr)) {
            throw PATH_ERROR;
          }
        }
        nextNode = node.#children[regexpStr];
        if (!nextNode) {
          if (regexpStr !== ONLY_WILDCARD_REG_EXP_STR && regexpStr !== TAIL_WILDCARD_REG_EXP_STR) {
            for (const k in node.#children) {
              if (
                // a single-char pattern coexists with single-char literals as a literal does
                (regexpStr.length > 1 || k.length > 1) && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
              ) {
                throw PATH_ERROR;
              }
            }
          }
          nextNode = node.#children[regexpStr] = new _Node();
        }
        if (name !== "") {
          nextNode.#varIndex ??= context2.varIndex++;
          paramMap.push([name, nextNode.#varIndex]);
        }
      } else {
        nextNode = node.#children[token];
        if (!nextNode) {
          for (const k in node.#children) {
            if (k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR) {
              throw PATH_ERROR;
            }
          }
          nextNode = node.#children[token] = new _Node();
        }
      }
      node = nextNode;
    }
    if (node.#index !== void 0) {
      throw PATH_ERROR;
    }
    node.#index = isStatic ? -1 : index;
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      const childStr = c.buildRegExpStr();
      return childStr === "" ? "" : (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + childStr;
    }).filter(Boolean);
    if (typeof this.#index === "number" && this.#index !== -1) {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/router/reg-exp-router/trie.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  #index = 0;
  // dynamic path -> [handler index, param assoc]; static paths are not registered
  paths = createNullObject();
  insert(path, isStatic) {
    if (isStatic) {
      this.#root.insert(path.split(""), 0, [], this.#context, true);
      return;
    }
    const paramAssoc = [];
    const groups = [];
    let markedPath = path;
    for (let i = 0; ; ) {
      let replaced = false;
      markedPath = markedPath.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = markedPath.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, this.#index, paramAssoc, this.#context, false);
    this.paths[path] = [this.#index++, paramAssoc];
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/router/reg-exp-router/router.js
var wildcardRegExpCache = createNullObject();
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    `^${path.replace(
      /\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g,
      (match2, metaChar) => metaChar ? `\\${metaChar}` : match2 === "/*" ? TAIL_WILDCARD_REG_EXP_STR : match2 === "*" ? ONLY_WILDCARD_REG_EXP_STR : `/:${LABEL_REG_EXP_STR}`
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function findMiddleware(middleware, path) {
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  #tries;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: createNullObject() };
    this.#routes = { [METHOD_NAME_ALL]: createNullObject() };
    this.#tries = { [METHOD_NAME_ALL]: new Trie() };
  }
  #insertPath(method, path) {
    try {
      this.#tries[method].insert(path, !/\*|\/:/.test(path));
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      this.#tries[method] = new Trie();
      for (const handlerMap of [middleware, routes]) {
        handlerMap[method] = createNullObject();
        for (const p in handlerMap[METHOD_NAME_ALL]) {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
          this.#insertPath(method, p);
        }
      }
    }
    if (path === "/*") {
      path = "*";
    }
    const methods = method === METHOD_NAME_ALL ? Object.keys(middleware) : [method];
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      for (const m of methods) {
        if (!middleware[m][path]) {
          this.#insertPath(m, path);
          middleware[m][path] = findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        }
      }
      for (const handlerMap of [middleware, routes]) {
        for (const m of methods) {
          for (const p in handlerMap[m]) {
            re.test(p) && handlerMap[m][p].push([handler, path]);
          }
        }
      }
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (const path2 of paths) {
      for (const m of methods) {
        if (!routes[m][path2]) {
          this.#insertPath(m, path2);
          routes[m][path2] = findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || [];
        }
        routes[m][path2].push([handler, path2]);
      }
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = createNullObject();
    for (const method of Object.keys(this.#routes)) {
      matchers[method] = this.#buildMatcher(method);
    }
    this.#middleware = this.#routes = this.#tries = void 0;
    wildcardRegExpCache = createNullObject();
    return matchers;
  }
  #buildMatcher(method) {
    const middleware = this.#middleware[method];
    const routes = this.#routes[method];
    const trie = this.#tries[method];
    const staticMap = createNullObject();
    const handlerData = [];
    const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
    for (const r of [middleware, routes]) {
      for (const path in r) {
        const handlers = r[path];
        const pathData = trie.paths[path];
        if (!pathData) {
          staticMap[path] = [handlers.map(([h]) => [h, createNullObject()]), emptyParam];
          continue;
        }
        handlerData[pathData[0]] = handlers.map(([h, handlerPath]) => [
          h,
          trie.paths[handlerPath][1].reduceRight((map, [key], i) => {
            map[key] = paramReplacementMap[pathData[1][i][1]];
            return map;
          }, createNullObject())
        ]);
      }
    }
    return [regexp, indexReplacementMap.map((i) => handlerData[i]), staticMap];
  }
};

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/router/reg-exp-router/prepared-router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/router/smart-router/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/router/smart-router/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/router/trie-router/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/router/trie-router/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/router/trie-router/node.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var emptyParams = createNullObject();
var order = 0;
var Node2 = class _Node2 {
  static {
    __name(this, "_Node");
  }
  #methods = [];
  #children = createNullObject();
  #patterns = [];
  #pattern;
  #params = emptyParams;
  insert(method, path, handler) {
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = /* @__PURE__ */ new Set();
    let i = 0;
    for (const p of parts) {
      const nextP = parts[++i];
      const pattern = getPattern(p, nextP) || (nextP === void 0 && p && p.indexOf("*") === p.length - 1 ? p : null);
      const isParam = Array.isArray(pattern);
      const key = isParam ? pattern[0] : pattern || p;
      const child = curNode.#children[key] ||= new _Node2();
      if (pattern && !child.#pattern) {
        child.#pattern = pattern;
        curNode.#patterns.push(child);
      }
      curNode = child;
      if (isParam) {
        possibleKeys.add(pattern[1]);
      }
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: [...possibleKeys],
        score: ++order
      }
    });
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      if (handlerSet) {
        handlerSet.params = createNullObject();
        handlerSets.push(handlerSet);
        for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
          const key = handlerSet.possibleKeys[i2];
          handlerSet.params[key] = params?.[key] && !i2 ? params[key] : nodeParams[key] ?? params?.[key];
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (const child of node.#patterns) {
          const pattern = child.#pattern;
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (typeof pattern === "string") {
            if (pattern === "*" || part.startsWith(pattern.slice(0, -1))) {
              this.#pushHandlerSets(handlerSets, child, method, node.#params);
              if (pattern === "*") {
                child.#params = params;
                tempNodes.push(child);
              }
            }
            continue;
          }
          const [, name, matcher] = pattern;
          if (!part && matcher === true) {
            continue;
          }
          if (matcher !== true) {
            if (!partOffsets) {
              partOffsets = [];
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.slice(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (m[0].length === restPathString.length && child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  node.#params,
                  params
                );
              }
              for (const _ in child.#children) {
                child.#params = params;
                const componentCount = m[0].match(/\//g)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
                break;
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets[1]) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node = new Node2();
  add(method, path, handler) {
    for (const result of checkOptionalParameter(path) || [path]) {
      this.#node.insert(method, result, handler);
    }
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// ../../node_modules/.bun/hono@4.13.5/node_modules/hono/dist/middleware/cors/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var cors = /* @__PURE__ */ __name((options) => {
  const opts = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH", "QUERY"],
    allowHeaders: [],
    exposeHeaders: [],
    ...options
  };
  const exposeHeadersStr = opts.exposeHeaders?.length ? opts.exposeHeaders.join(",") : void 0;
  const allowHeadersStr = opts.allowHeaders?.length ? opts.allowHeaders.join(",") : void 0;
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return async (origin, c) => (await optsAllowMethods(origin, c)).join(",");
    } else if (Array.isArray(optsAllowMethods)) {
      const methodsStr = optsAllowMethods.join(",");
      return () => methodsStr;
    } else {
      return () => "";
    }
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (exposeHeadersStr) {
      set("Access-Control-Expose-Headers", exposeHeadersStr);
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        c.res.headers.append("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods) {
        set("Access-Control-Allow-Methods", allowMethods);
      }
      let headersStr = allowHeadersStr;
      if (!headersStr) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headersStr = requestHeaders.split(",").map((h) => h.trim()).join(",");
        }
      }
      if (headersStr) {
        set("Access-Control-Allow-Headers", headersStr);
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  }, "cors2");
}, "cors");

// src/lib/env.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var env2 = {
  nodeEnv: "development",
  appUrl: process.env.APP_URL ?? "https://flowdoro.pages.dev",
  corsOrigin: process.env.CORS_ORIGIN ?? "https://flowdoro.pages.dev",
  apiUrl: process.env.API_URL ?? "",
  restRatioDefault: Number(process.env.REST_RATIO_DEFAULT ?? 5),
  logLevel: process.env.LOG_LEVEL ?? "info",
  // Appwrite Cloud
  appwriteEndpoint: process.env.APPWRITE_ENDPOINT ?? "https://cloud.appwrite.io/v1",
  appwriteProjectId: process.env.APPWRITE_PROJECT_ID ?? "",
  appwriteApiKey: process.env.APPWRITE_API_KEY ?? "",
  appwriteDatabaseId: process.env.APPWRITE_DATABASE_ID ?? "flowdoro",
  appwriteCollectionProfiles: process.env.APPWRITE_COLLECTION_PROFILES ?? "profiles",
  appwriteCollectionTasks: process.env.APPWRITE_COLLECTION_TASKS ?? "tasks",
  appwriteCollectionSessions: process.env.APPWRITE_COLLECTION_SESSIONS ?? "sessions",
  appwriteCollectionEvents: process.env.APPWRITE_COLLECTION_EVENTS ?? "session_events",
  appwriteBucketAvatars: process.env.APPWRITE_BUCKET_AVATARS ?? "avatars"
};

// src/routes/auth.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/.bun/appwrite@26.2.0/node_modules/appwrite/dist/esm/sdk.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_json_bigint = __toESM(require_json_bigint(), 1);
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  __name(adopt, "adopt");
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    __name(fulfilled, "fulfilled");
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    __name(rejected, "rejected");
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    __name(step, "step");
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
__name(__awaiter, "__awaiter");
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
__name(__classPrivateFieldGet, "__classPrivateFieldGet");
var _a;
var _ID_hexTimestamp;
var ID = class {
  static {
    __name(this, "ID");
  }
  /**
   * Uses the provided ID as the ID for the resource.
   *
   * @param {string} id
   * @returns {string}
   */
  static custom(id) {
    return id;
  }
  /**
   * Have Appwrite generate a unique ID for you.
   *
   * @param {number} padding. Default is 7.
   * @returns {string}
   */
  static unique(padding = 7) {
    const baseId = __classPrivateFieldGet(_a, _a, "m", _ID_hexTimestamp).call(_a);
    let randomPadding = "";
    for (let i = 0; i < padding; i++) {
      const randomHexDigit = Math.floor(Math.random() * 16).toString(16);
      randomPadding += randomHexDigit;
    }
    return baseId + randomPadding;
  }
};
_a = ID, _ID_hexTimestamp = /* @__PURE__ */ __name(function _ID_hexTimestamp2() {
  const now = /* @__PURE__ */ new Date();
  const sec = Math.floor(now.getTime() / 1e3);
  const msec = now.getMilliseconds();
  const hexTimestamp = sec.toString(16) + msec.toString(16).padStart(5, "0");
  return hexTimestamp;
}, "_ID_hexTimestamp");
var JSONbig$1 = (0, import_json_bigint.default)({ useNativeBigInt: true });
var Query = class {
  static {
    __name(this, "Query");
  }
  /**
   * Constructor for Query class.
   *
   * @param {string} method
   * @param {AttributesTypes} attribute
   * @param {QueryTypes} values
   */
  constructor(method, attribute, values) {
    this.method = method;
    this.attribute = attribute;
    if (values !== void 0) {
      if (Array.isArray(values)) {
        this.values = values;
      } else {
        this.values = [values];
      }
    }
  }
  /**
   * Convert the query object to a JSON string.
   *
   * @returns {string}
   */
  toString() {
    return JSONbig$1.stringify({
      method: this.method,
      attribute: this.attribute,
      values: this.values
    });
  }
};
Query.equal = (attribute, value) => new Query("equal", attribute, value).toString();
Query.notEqual = (attribute, value) => new Query("notEqual", attribute, value).toString();
Query.regex = (attribute, pattern) => new Query("regex", attribute, pattern).toString();
Query.lessThan = (attribute, value) => new Query("lessThan", attribute, value).toString();
Query.lessThanEqual = (attribute, value) => new Query("lessThanEqual", attribute, value).toString();
Query.greaterThan = (attribute, value) => new Query("greaterThan", attribute, value).toString();
Query.greaterThanEqual = (attribute, value) => new Query("greaterThanEqual", attribute, value).toString();
Query.isNull = (attribute) => new Query("isNull", attribute).toString();
Query.isNotNull = (attribute) => new Query("isNotNull", attribute).toString();
Query.exists = (attributes) => new Query("exists", void 0, attributes).toString();
Query.notExists = (attributes) => new Query("notExists", void 0, attributes).toString();
Query.between = (attribute, start, end) => new Query("between", attribute, [start, end]).toString();
Query.startsWith = (attribute, value) => new Query("startsWith", attribute, value).toString();
Query.endsWith = (attribute, value) => new Query("endsWith", attribute, value).toString();
Query.select = (attributes) => new Query("select", void 0, attributes).toString();
Query.search = (attribute, value) => new Query("search", attribute, value).toString();
Query.orderDesc = (attribute) => new Query("orderDesc", attribute).toString();
Query.orderAsc = (attribute) => new Query("orderAsc", attribute).toString();
Query.orderRandom = () => new Query("orderRandom").toString();
Query.cursorAfter = (documentId) => new Query("cursorAfter", void 0, documentId).toString();
Query.cursorBefore = (documentId) => new Query("cursorBefore", void 0, documentId).toString();
Query.limit = (limit) => new Query("limit", void 0, limit).toString();
Query.offset = (offset) => new Query("offset", void 0, offset).toString();
Query.contains = (attribute, value) => new Query("contains", attribute, value).toString();
Query.containsAny = (attribute, value) => new Query("containsAny", attribute, value).toString();
Query.containsAll = (attribute, value) => new Query("containsAll", attribute, value).toString();
Query.notContains = (attribute, value) => new Query("notContains", attribute, value).toString();
Query.notSearch = (attribute, value) => new Query("notSearch", attribute, value).toString();
Query.notBetween = (attribute, start, end) => new Query("notBetween", attribute, [start, end]).toString();
Query.notStartsWith = (attribute, value) => new Query("notStartsWith", attribute, value).toString();
Query.notEndsWith = (attribute, value) => new Query("notEndsWith", attribute, value).toString();
Query.createdBefore = (value) => Query.lessThan("$createdAt", value);
Query.createdAfter = (value) => Query.greaterThan("$createdAt", value);
Query.createdBetween = (start, end) => Query.between("$createdAt", start, end);
Query.updatedBefore = (value) => Query.lessThan("$updatedAt", value);
Query.updatedAfter = (value) => Query.greaterThan("$updatedAt", value);
Query.updatedBetween = (start, end) => Query.between("$updatedAt", start, end);
Query.or = (queries) => new Query("or", void 0, queries.map((query) => JSONbig$1.parse(query))).toString();
Query.and = (queries) => new Query("and", void 0, queries.map((query) => JSONbig$1.parse(query))).toString();
Query.elemMatch = (attribute, queries) => new Query("elemMatch", attribute, queries.map((query) => JSONbig$1.parse(query))).toString();
Query.distanceEqual = (attribute, values, distance, meters = true) => new Query("distanceEqual", attribute, [[values, distance, meters]]).toString();
Query.distanceNotEqual = (attribute, values, distance, meters = true) => new Query("distanceNotEqual", attribute, [[values, distance, meters]]).toString();
Query.distanceGreaterThan = (attribute, values, distance, meters = true) => new Query("distanceGreaterThan", attribute, [[values, distance, meters]]).toString();
Query.distanceLessThan = (attribute, values, distance, meters = true) => new Query("distanceLessThan", attribute, [[values, distance, meters]]).toString();
Query.vectorDot = (attribute, vector) => new Query("vectorDot", attribute, [vector]).toString();
Query.vectorCosine = (attribute, vector) => new Query("vectorCosine", attribute, [vector]).toString();
Query.vectorEuclidean = (attribute, vector) => new Query("vectorEuclidean", attribute, [vector]).toString();
Query.intersects = (attribute, values) => new Query("intersects", attribute, [values]).toString();
Query.notIntersects = (attribute, values) => new Query("notIntersects", attribute, [values]).toString();
Query.crosses = (attribute, values) => new Query("crosses", attribute, [values]).toString();
Query.notCrosses = (attribute, values) => new Query("notCrosses", attribute, [values]).toString();
Query.overlaps = (attribute, values) => new Query("overlaps", attribute, [values]).toString();
Query.notOverlaps = (attribute, values) => new Query("notOverlaps", attribute, [values]).toString();
Query.touches = (attribute, values) => new Query("touches", attribute, [values]).toString();
Query.notTouches = (attribute, values) => new Query("notTouches", attribute, [values]).toString();
var JSONbigParser = (0, import_json_bigint.default)({ storeAsString: false });
var JSONbigSerializer = (0, import_json_bigint.default)({ useNativeBigInt: true });
var MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);
var MIN_SAFE = BigInt(Number.MIN_SAFE_INTEGER);
var MAX_INT64 = BigInt("9223372036854775807");
var MIN_INT64 = BigInt("-9223372036854775808");
function isBigNumber(value) {
  return value !== null && typeof value === "object" && value._isBigNumber === true && typeof value.isInteger === "function" && typeof value.toFixed === "function" && typeof value.toNumber === "function";
}
__name(isBigNumber, "isBigNumber");
function reviver(_key, value) {
  if (isBigNumber(value)) {
    if (value.isInteger()) {
      const str = value.toFixed();
      const bi = BigInt(str);
      if (bi >= MIN_SAFE && bi <= MAX_SAFE) {
        return Number(str);
      }
      if (bi >= MIN_INT64 && bi <= MAX_INT64) {
        return bi;
      }
      return value.toNumber();
    }
    return value.toNumber();
  }
  return value;
}
__name(reviver, "reviver");
var JSONbig = {
  parse: /* @__PURE__ */ __name((text) => JSONbigParser.parse(text, reviver), "parse"),
  stringify: JSONbigSerializer.stringify
};
var AppwriteException = class extends Error {
  static {
    __name(this, "AppwriteException");
  }
  /**
   * Initializes a Appwrite Exception.
   *
   * @param {string} message - The error message.
   * @param {number} code - The error code. Default is 0.
   * @param {string} type - The error type. Default is an empty string.
   * @param {string} response - The response string. Default is an empty string.
   */
  constructor(message, code = 0, type = "", response = "") {
    super(message);
    this.name = "AppwriteException";
    this.message = message;
    this.code = code;
    this.type = type;
    this.response = response;
  }
};
var Client = class _Client {
  static {
    __name(this, "Client");
  }
  constructor() {
    this.config = {
      endpoint: "https://cloud.appwrite.io/v1",
      endpointRealtime: "",
      project: "",
      jwt: "",
      bearer: "",
      locale: "",
      session: "",
      devkey: "",
      cookie: "",
      impersonateuserid: "",
      impersonateuseremail: "",
      impersonateuserphone: ""
    };
    this.headers = {
      "x-sdk-name": "Web",
      "x-sdk-platform": "client",
      "x-sdk-language": "web",
      "x-sdk-version": "26.2.0",
      "X-Appwrite-Response-Format": "1.9.5"
    };
    this.realtime = {
      socket: void 0,
      timeout: void 0,
      heartbeat: void 0,
      url: "",
      channels: /* @__PURE__ */ new Set(),
      subscriptions: /* @__PURE__ */ new Map(),
      pendingSubscribes: /* @__PURE__ */ new Map(),
      reconnect: true,
      reconnectAttempts: 0,
      lastMessage: void 0,
      connect: /* @__PURE__ */ __name(() => {
        clearTimeout(this.realtime.timeout);
        this.realtime.timeout = window === null || window === void 0 ? void 0 : window.setTimeout(() => {
          this.realtime.createSocket();
        }, 50);
      }, "connect"),
      getTimeout: /* @__PURE__ */ __name(() => {
        switch (true) {
          case this.realtime.reconnectAttempts < 5:
            return 1e3;
          case this.realtime.reconnectAttempts < 15:
            return 5e3;
          case this.realtime.reconnectAttempts < 100:
            return 1e4;
          default:
            return 6e4;
        }
      }, "getTimeout"),
      createHeartbeat: /* @__PURE__ */ __name(() => {
        if (this.realtime.heartbeat) {
          clearTimeout(this.realtime.heartbeat);
        }
        this.realtime.heartbeat = window === null || window === void 0 ? void 0 : window.setInterval(() => {
          var _a2;
          (_a2 = this.realtime.socket) === null || _a2 === void 0 ? void 0 : _a2.send(JSONbig.stringify({
            type: "ping"
          }));
        }, 2e4);
      }, "createHeartbeat"),
      createSocket: /* @__PURE__ */ __name(() => {
        var _a2, _b, _c, _d, _e;
        if (this.realtime.subscriptions.size < 1) {
          this.realtime.reconnect = false;
          (_a2 = this.realtime.socket) === null || _a2 === void 0 ? void 0 : _a2.close();
          return;
        }
        const encodedProject = encodeURIComponent((_b = this.config.project) !== null && _b !== void 0 ? _b : "");
        let queryParams = "project=" + encodedProject;
        if (this.config.jwt) {
          queryParams += "&jwt=" + encodeURIComponent(this.config.jwt);
        }
        const url = this.config.endpointRealtime + "/realtime?" + queryParams;
        if (url !== this.realtime.url || // Check if URL is present
        !this.realtime.socket || // Check if WebSocket has not been created
        ((_c = this.realtime.socket) === null || _c === void 0 ? void 0 : _c.readyState) > WebSocket.OPEN) {
          if (this.realtime.socket && ((_d = this.realtime.socket) === null || _d === void 0 ? void 0 : _d.readyState) < WebSocket.CLOSING) {
            this.realtime.reconnect = false;
            this.realtime.socket.close();
          }
          this.realtime.url = url;
          this.realtime.socket = new WebSocket(url);
          this.realtime.socket.addEventListener("message", this.realtime.onMessage);
          this.realtime.socket.addEventListener("open", (_event) => {
            this.realtime.reconnectAttempts = 0;
            this.realtime.createHeartbeat();
          });
          this.realtime.socket.addEventListener("close", (event) => {
            var _a3, _b2, _c2;
            if (!this.realtime.reconnect || ((_b2 = (_a3 = this.realtime) === null || _a3 === void 0 ? void 0 : _a3.lastMessage) === null || _b2 === void 0 ? void 0 : _b2.type) === "error" && // Check if last message was of type error
            ((_c2 = this.realtime) === null || _c2 === void 0 ? void 0 : _c2.lastMessage.data).code === 1008) {
              this.realtime.reconnect = true;
              return;
            }
            const timeout = this.realtime.getTimeout();
            console.error(`Realtime got disconnected. Reconnect will be attempted in ${timeout / 1e3} seconds.`, event.reason);
            setTimeout(() => {
              this.realtime.reconnectAttempts++;
              this.realtime.createSocket();
            }, timeout);
          });
        } else if (((_e = this.realtime.socket) === null || _e === void 0 ? void 0 : _e.readyState) === WebSocket.OPEN) {
          this.realtime.sendPendingSubscribes();
        }
      }, "createSocket"),
      sendPendingSubscribes: /* @__PURE__ */ __name(() => {
        if (!this.realtime.socket || this.realtime.socket.readyState !== WebSocket.OPEN) {
          return;
        }
        if (this.realtime.pendingSubscribes.size < 1) {
          return;
        }
        const rows = Array.from(this.realtime.pendingSubscribes.values());
        this.realtime.pendingSubscribes.clear();
        this.realtime.socket.send(JSONbig.stringify({
          type: "subscribe",
          data: rows
        }));
      }, "sendPendingSubscribes"),
      onMessage: /* @__PURE__ */ __name((event) => {
        var _a2, _b;
        try {
          const message = JSONbig.parse(event.data);
          this.realtime.lastMessage = message;
          switch (message.type) {
            case "connected": {
              const messageData = message.data;
              let session = this.config.session;
              if (!session) {
                const cookie = JSONbig.parse((_a2 = window.localStorage.getItem("cookieFallback")) !== null && _a2 !== void 0 ? _a2 : "{}");
                session = cookie === null || cookie === void 0 ? void 0 : cookie[`a_session_${this.config.project}`];
              }
              if (session && !(messageData === null || messageData === void 0 ? void 0 : messageData.user)) {
                (_b = this.realtime.socket) === null || _b === void 0 ? void 0 : _b.send(JSONbig.stringify({
                  type: "authentication",
                  data: {
                    session
                  }
                }));
              }
              this.realtime.subscriptions.forEach((sub, subscriptionId) => {
                var _a3;
                this.realtime.pendingSubscribes.set(subscriptionId, {
                  subscriptionId,
                  channels: sub.channels,
                  queries: (_a3 = sub.queries) !== null && _a3 !== void 0 ? _a3 : []
                });
              });
              this.realtime.sendPendingSubscribes();
              break;
            }
            case "response":
              break;
            case "event": {
              const data = message.data;
              if (!(data === null || data === void 0 ? void 0 : data.channels))
                break;
              const eventSubIds = data.subscriptions;
              if (eventSubIds && eventSubIds.length > 0) {
                for (const subscriptionId of eventSubIds) {
                  const subscription = this.realtime.subscriptions.get(subscriptionId);
                  if (subscription) {
                    setTimeout(() => subscription.callback(data));
                  }
                }
              } else {
                const isSubscribed = data.channels.some((channel2) => this.realtime.channels.has(channel2));
                if (!isSubscribed)
                  break;
                this.realtime.subscriptions.forEach((subscription) => {
                  if (data.channels.some((channel2) => subscription.channels.includes(channel2))) {
                    setTimeout(() => subscription.callback(data));
                  }
                });
              }
              break;
            }
            case "pong":
              break;
            // Handle pong response if needed
            case "error":
              throw message.data;
            default:
              break;
          }
        } catch (e) {
          console.error(e);
        }
      }, "onMessage")
    };
  }
  /**
   * Get Headers
   *
   * Returns a copy of the current request headers, including any
   * authentication headers. Handle with care.
   *
   * @returns {Headers}
   */
  getHeaders() {
    return Object.assign({}, this.headers);
  }
  /**
   * Set Endpoint
   *
   * Your project endpoint
   *
   * @param {string} endpoint
   *
   * @returns {this}
   */
  setEndpoint(endpoint) {
    if (!endpoint || typeof endpoint !== "string") {
      throw new AppwriteException("Endpoint must be a valid string");
    }
    if (!endpoint.startsWith("http://") && !endpoint.startsWith("https://")) {
      throw new AppwriteException("Invalid endpoint URL: " + endpoint);
    }
    this.config.endpoint = endpoint;
    this.config.endpointRealtime = endpoint.replace("https://", "wss://").replace("http://", "ws://");
    return this;
  }
  /**
   * Set Realtime Endpoint
   *
   * @param {string} endpointRealtime
   *
   * @returns {this}
   */
  setEndpointRealtime(endpointRealtime) {
    if (!endpointRealtime || typeof endpointRealtime !== "string") {
      throw new AppwriteException("Endpoint must be a valid string");
    }
    if (!endpointRealtime.startsWith("ws://") && !endpointRealtime.startsWith("wss://")) {
      throw new AppwriteException("Invalid realtime endpoint URL: " + endpointRealtime);
    }
    this.config.endpointRealtime = endpointRealtime;
    return this;
  }
  /**
   * Set Project
   *
   * Your project ID
   *
   * @param value string
   *
   * @return {this}
   */
  setProject(value) {
    this.config.project = value;
    return this;
  }
  /**
   * Set JWT
   *
   * Your secret JSON Web Token
   *
   * @param value string
   *
   * @return {this}
   */
  setJWT(value) {
    this.headers["X-Appwrite-JWT"] = value;
    this.config.jwt = value;
    return this;
  }
  /**
   * Set Bearer
   *
   * The OAuth access token to authenticate with
   *
   * @param value string
   *
   * @return {this}
   */
  setBearer(value) {
    this.headers["Authorization"] = `Bearer ${value}`;
    this.config.bearer = value;
    return this;
  }
  /**
   * Set Locale
   *
   * @param value string
   *
   * @return {this}
   */
  setLocale(value) {
    this.headers["X-Appwrite-Locale"] = value;
    this.config.locale = value;
    return this;
  }
  /**
   * Set Session
   *
   * The user session to authenticate with
   *
   * @param value string
   *
   * @return {this}
   */
  setSession(value) {
    this.headers["X-Appwrite-Session"] = value;
    this.config.session = value;
    return this;
  }
  /**
   * Set DevKey
   *
   * Your secret dev API key
   *
   * @param value string
   *
   * @return {this}
   */
  setDevKey(value) {
    this.headers["X-Appwrite-Dev-Key"] = value;
    this.config.devkey = value;
    return this;
  }
  /**
   * Set Cookie
   *
   * The user cookie to authenticate with. Used by SDKs that forward an incoming Cookie header in server-side runtimes.
   *
   * @param value string
   *
   * @return {this}
   */
  setCookie(value) {
    this.headers["Cookie"] = value;
    this.config.cookie = value;
    return this;
  }
  /**
   * Set ImpersonateUserId
   *
   * Impersonate a user by ID
   *
   * @param value string
   *
   * @return {this}
   */
  setImpersonateUserId(value) {
    this.headers["X-Appwrite-Impersonate-User-Id"] = value;
    this.config.impersonateuserid = value;
    return this;
  }
  /**
   * Set ImpersonateUserEmail
   *
   * Impersonate a user by email
   *
   * @param value string
   *
   * @return {this}
   */
  setImpersonateUserEmail(value) {
    this.headers["X-Appwrite-Impersonate-User-Email"] = value;
    this.config.impersonateuseremail = value;
    return this;
  }
  /**
   * Set ImpersonateUserPhone
   *
   * Impersonate a user by phone
   *
   * @param value string
   *
   * @return {this}
   */
  setImpersonateUserPhone(value) {
    this.headers["X-Appwrite-Impersonate-User-Phone"] = value;
    this.config.impersonateuserphone = value;
    return this;
  }
  /**
   * Subscribes to Appwrite events and passes you the payload in realtime.
   *
   * @deprecated Use the Realtime service instead.
   * @see Realtime
   *
   * @param {string|string[]|Channel<any>|ActionableChannel|ResolvedChannel|(Channel<any>|ActionableChannel|ResolvedChannel)[]} channels
   * Channel to subscribe - pass a single channel as a string or Channel builder instance, or multiple with an array.
   *
   * Possible channels are:
   * - account
   * - collections
   * - collections.[ID]
   * - collections.[ID].documents
   * - documents
   * - documents.[ID]
   * - files
   * - files.[ID]
   * - executions
   * - executions.[ID]
   * - functions.[ID]
   * - teams
   * - teams.[ID]
   * - memberships
   * - memberships.[ID]
   *
   * You can also use Channel builders:
   * - Channel.database('db').collection('col').document('doc').create()
   * - Channel.bucket('bucket').file('file').update()
   * - Channel.function('func').execution('exec').delete()
   * - Channel.team('team').create()
   * - Channel.membership('membership').update()
   * @param {(payload: RealtimeMessage) => void} callback Is called on every realtime update.
   * @returns {() => void} Unsubscribes from events.
   */
  subscribe(channels, callback, queries = []) {
    const channelArray = Array.isArray(channels) ? channels : [channels];
    const channelStrings = channelArray.map((ch) => {
      if (typeof ch === "string") {
        return ch;
      }
      if (ch && typeof ch.toString === "function") {
        return ch.toString();
      }
      return String(ch);
    });
    channelStrings.forEach((channel2) => this.realtime.channels.add(channel2));
    const queryStrings = (queries !== null && queries !== void 0 ? queries : []).map((q) => typeof q === "string" ? q : q.toString());
    let subscriptionId = "";
    const attempts = this.realtime.subscriptions.size + 1;
    for (let i = 0; i < attempts; i++) {
      const candidate = ID.unique();
      if (!this.realtime.subscriptions.has(candidate)) {
        subscriptionId = candidate;
        break;
      }
    }
    if (subscriptionId === "") {
      throw new AppwriteException("Failed to generate unique subscription id");
    }
    this.realtime.subscriptions.set(subscriptionId, {
      channels: channelStrings,
      queries: queryStrings,
      callback
    });
    this.realtime.pendingSubscribes.set(subscriptionId, {
      subscriptionId,
      channels: channelStrings,
      queries: queryStrings
    });
    this.realtime.connect();
    return () => {
      this.realtime.subscriptions.delete(subscriptionId);
      this.realtime.pendingSubscribes.delete(subscriptionId);
      const stillUsed = /* @__PURE__ */ new Set();
      this.realtime.subscriptions.forEach((sub) => {
        sub.channels.forEach((channel2) => stillUsed.add(channel2));
      });
      this.realtime.channels.forEach((channel2) => {
        if (!stillUsed.has(channel2)) {
          this.realtime.channels.delete(channel2);
        }
      });
      this.realtime.connect();
    };
  }
  prepareRequest(method, url, headers = {}, params = {}) {
    method = method.toUpperCase();
    headers = Object.assign({}, this.headers, headers);
    if (typeof window !== "undefined" && window.localStorage) {
      const cookieFallback = window.localStorage.getItem("cookieFallback");
      if (cookieFallback) {
        headers["X-Fallback-Cookies"] = cookieFallback;
      }
    }
    let options = {
      method,
      headers
    };
    if (headers["X-Appwrite-Dev-Key"] === void 0) {
      options.credentials = "include";
    }
    if (method === "GET") {
      for (const [key, value] of Object.entries(_Client.flatten(params))) {
        url.searchParams.append(key, value);
      }
    } else {
      switch (headers["content-type"]) {
        case "application/json":
          options.body = JSONbig.stringify(params);
          break;
        case "multipart/form-data":
          const formData = new FormData();
          for (const [key, value] of Object.entries(params)) {
            if (value instanceof File) {
              formData.append(key, value, value.name);
            } else if (Array.isArray(value)) {
              for (const nestedValue of value) {
                formData.append(`${key}[]`, nestedValue);
              }
            } else {
              formData.append(key, value);
            }
          }
          options.body = formData;
          delete headers["content-type"];
          break;
      }
    }
    return { uri: url.toString(), options };
  }
  chunkedUpload(method_1, url_1) {
    return __awaiter(this, arguments, void 0, function* (method, url, headers = {}, originalPayload = {}, onProgress) {
      var _a2;
      const [fileParam, file] = (_a2 = Object.entries(originalPayload).find(([_, value]) => value instanceof File)) !== null && _a2 !== void 0 ? _a2 : [];
      if (!file || !fileParam) {
        throw new Error("File not found in payload");
      }
      if (file.size <= _Client.CHUNK_SIZE) {
        return yield this.call(method, url, headers, originalPayload);
      }
      const totalChunks = Math.ceil(file.size / _Client.CHUNK_SIZE);
      const firstChunkEnd = Math.min(_Client.CHUNK_SIZE, file.size);
      const firstChunkHeaders = Object.assign(Object.assign({}, headers), { "content-range": `bytes 0-${firstChunkEnd - 1}/${file.size}` });
      const firstChunk = file.slice(0, firstChunkEnd);
      const firstPayload = Object.assign({}, originalPayload);
      firstPayload[fileParam] = new File([firstChunk], file.name);
      let response = yield this.call(method, url, firstChunkHeaders, firstPayload);
      const uploadId = response === null || response === void 0 ? void 0 : response.$id;
      if (onProgress && typeof onProgress === "function") {
        onProgress({
          $id: uploadId,
          progress: Math.round(firstChunkEnd / file.size * 100),
          sizeUploaded: firstChunkEnd,
          chunksTotal: totalChunks,
          chunksUploaded: 1
        });
      }
      if (totalChunks === 1) {
        return response;
      }
      const chunks = [];
      for (let i = 1; i < totalChunks; i++) {
        const start = i * _Client.CHUNK_SIZE;
        const end = Math.min(start + _Client.CHUNK_SIZE, file.size);
        chunks.push({ start, end });
      }
      const CONCURRENCY = 8;
      let completedCount = 1;
      let uploadedBytes = firstChunkEnd;
      let lastResponse = response;
      let finalResponse = null;
      let rejected = false;
      const isUploadComplete = /* @__PURE__ */ __name((chunkResponse) => {
        var _a3;
        const chunksUploaded = chunkResponse === null || chunkResponse === void 0 ? void 0 : chunkResponse.chunksUploaded;
        const chunksTotal = (_a3 = chunkResponse === null || chunkResponse === void 0 ? void 0 : chunkResponse.chunksTotal) !== null && _a3 !== void 0 ? _a3 : totalChunks;
        return typeof chunksUploaded === "number" && typeof chunksTotal === "number" && chunksUploaded >= chunksTotal;
      }, "isUploadComplete");
      const uploadChunk = /* @__PURE__ */ __name((chunk) => __awaiter(this, void 0, void 0, function* () {
        const chunkHeaders = Object.assign({}, headers);
        if (uploadId) {
          chunkHeaders["x-appwrite-id"] = uploadId;
        }
        chunkHeaders["content-range"] = `bytes ${chunk.start}-${chunk.end - 1}/${file.size}`;
        const chunkBlob = file.slice(chunk.start, chunk.end);
        const chunkPayload = Object.assign({}, originalPayload);
        chunkPayload[fileParam] = new File([chunkBlob], file.name);
        const chunkResponse = yield this.call(method, url, chunkHeaders, chunkPayload);
        if (rejected) {
          return chunkResponse;
        }
        completedCount++;
        uploadedBytes += chunk.end - chunk.start;
        lastResponse = chunkResponse;
        if (isUploadComplete(chunkResponse)) {
          finalResponse = chunkResponse;
        }
        if (onProgress && typeof onProgress === "function") {
          onProgress({
            $id: uploadId,
            progress: Math.round(uploadedBytes / file.size * 100),
            sizeUploaded: uploadedBytes,
            chunksTotal: totalChunks,
            chunksUploaded: completedCount
          });
        }
        return chunkResponse;
      }), "uploadChunk");
      yield new Promise((resolve, reject) => {
        let nextChunk = 0;
        let inFlight = 0;
        let completed = 0;
        const uploadNext = /* @__PURE__ */ __name(() => {
          if (rejected) {
            return;
          }
          if (completed === chunks.length) {
            resolve();
            return;
          }
          while (inFlight < CONCURRENCY && nextChunk < chunks.length) {
            const chunk = chunks[nextChunk++];
            inFlight++;
            uploadChunk(chunk).then(() => {
              inFlight--;
              completed++;
              uploadNext();
            }).catch((error3) => {
              rejected = true;
              reject(error3);
            });
          }
        }, "uploadNext");
        uploadNext();
      });
      return finalResponse !== null && finalResponse !== void 0 ? finalResponse : lastResponse;
    });
  }
  ping() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.call("GET", new URL(this.config.endpoint + "/ping"), {
        "X-Appwrite-Project": this.config.project,
        "accept": "application/json"
      });
    });
  }
  call(method_1, url_1) {
    return __awaiter(this, arguments, void 0, function* (method, url, headers = {}, params = {}, responseType = "json") {
      var _a2, _b, _c;
      const { uri, options } = this.prepareRequest(method, url, headers, params);
      let data = null;
      const response = yield fetch(uri, options);
      if (response.type === "opaque") {
        throw new AppwriteException(`Invalid Origin. Register your new client (${window.location.host}) as a new Web platform on your project console dashboard`, 403, "forbidden", "");
      }
      const warnings = response.headers.get("x-appwrite-warning");
      if (warnings) {
        warnings.split(";").forEach((warning) => console.warn("Warning: " + warning));
      }
      if ((_a2 = response.headers.get("content-type")) === null || _a2 === void 0 ? void 0 : _a2.includes("application/json")) {
        data = JSONbig.parse(yield response.text());
      } else if (responseType === "arrayBuffer") {
        data = yield response.arrayBuffer();
      } else {
        data = {
          message: yield response.text()
        };
      }
      if (400 <= response.status) {
        let responseText = "";
        if (((_b = response.headers.get("content-type")) === null || _b === void 0 ? void 0 : _b.includes("application/json")) || responseType === "arrayBuffer") {
          responseText = JSONbig.stringify(data);
        } else {
          responseText = data === null || data === void 0 ? void 0 : data.message;
        }
        throw new AppwriteException((_c = data === null || data === void 0 ? void 0 : data.message) !== null && _c !== void 0 ? _c : responseText, response.status, data === null || data === void 0 ? void 0 : data.type, responseText);
      }
      const cookieFallback = response.headers.get("X-Fallback-Cookies");
      if (typeof window !== "undefined" && window.localStorage && cookieFallback) {
        window.console.warn("Appwrite is using localStorage for session management. Increase your security by adding a custom domain as your API endpoint.");
        window.localStorage.setItem("cookieFallback", cookieFallback);
      }
      if (data && typeof data === "object") {
        Object.defineProperty(data, "toString", {
          value: /* @__PURE__ */ __name(() => JSONbig.stringify(data), "value"),
          writable: true,
          enumerable: false,
          configurable: true
        });
      }
      return data;
    });
  }
  static flatten(data, prefix = "") {
    let output = {};
    for (const [key, value] of Object.entries(data)) {
      let finalKey = prefix ? prefix + "[" + key + "]" : key;
      if (Array.isArray(value)) {
        output = Object.assign(Object.assign({}, output), _Client.flatten(value, finalKey));
      } else {
        output[finalKey] = value;
      }
    }
    return output;
  }
};
Client.CHUNK_SIZE = 1024 * 1024 * 5;
var Service = class _Service {
  static {
    __name(this, "Service");
  }
  constructor(client) {
    this.client = client;
  }
  static flatten(data, prefix = "") {
    let output = {};
    for (const [key, value] of Object.entries(data)) {
      let finalKey = prefix ? prefix + "[" + key + "]" : key;
      if (Array.isArray(value)) {
        output = Object.assign(Object.assign({}, output), _Service.flatten(value, finalKey));
      } else {
        output[finalKey] = value;
      }
    }
    return output;
  }
};
Service.CHUNK_SIZE = 5 * 1024 * 1024;
var Account = class {
  static {
    __name(this, "Account");
  }
  constructor(client) {
    this.client = client;
  }
  /**
   * Get the currently logged in user.
   *
   * @throws {AppwriteException}
   * @returns {Promise<Models.User<Preferences>>}
   */
  get() {
    const apiPath = "/account";
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "accept": "application/json"
    };
    return this.client.call("get", uri, apiHeaders, payload);
  }
  create(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        userId: paramsOrFirst,
        email: rest[0],
        password: rest[1],
        name: rest[2]
      };
    }
    const userId = params.userId;
    const email = params.email;
    const password = params.password;
    const name = params.name;
    if (typeof userId === "undefined") {
      throw new AppwriteException('Missing required parameter: "userId"');
    }
    if (typeof email === "undefined") {
      throw new AppwriteException('Missing required parameter: "email"');
    }
    if (typeof password === "undefined") {
      throw new AppwriteException('Missing required parameter: "password"');
    }
    const apiPath = "/account";
    const payload = {};
    if (typeof userId !== "undefined") {
      payload["userId"] = userId;
    }
    if (typeof email !== "undefined") {
      payload["email"] = email;
    }
    if (typeof password !== "undefined") {
      payload["password"] = password;
    }
    if (typeof name !== "undefined") {
      payload["name"] = name;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  updateEmail(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        email: paramsOrFirst,
        password: rest[0]
      };
    }
    const email = params.email;
    const password = params.password;
    if (typeof email === "undefined") {
      throw new AppwriteException('Missing required parameter: "email"');
    }
    if (typeof password === "undefined") {
      throw new AppwriteException('Missing required parameter: "password"');
    }
    const apiPath = "/account/email";
    const payload = {};
    if (typeof email !== "undefined") {
      payload["email"] = email;
    }
    if (typeof password !== "undefined") {
      payload["password"] = password;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("patch", uri, apiHeaders, payload);
  }
  listIdentities(paramsOrFirst, ...rest) {
    let params;
    if (!paramsOrFirst || paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        queries: paramsOrFirst,
        total: rest[0]
      };
    }
    const queries = params.queries;
    const total = params.total;
    const apiPath = "/account/identities";
    const payload = {};
    if (typeof queries !== "undefined") {
      payload["queries"] = queries;
    }
    if (typeof total !== "undefined") {
      payload["total"] = total;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "accept": "application/json"
    };
    return this.client.call("get", uri, apiHeaders, payload);
  }
  deleteIdentity(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        identityId: paramsOrFirst
      };
    }
    const identityId = params.identityId;
    if (typeof identityId === "undefined") {
      throw new AppwriteException('Missing required parameter: "identityId"');
    }
    const apiPath = "/account/identities/{identityId}".replace("{identityId}", encodeURIComponent(String(identityId)));
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json"
    };
    return this.client.call("delete", uri, apiHeaders, payload);
  }
  createJWT(paramsOrFirst) {
    let params;
    if (!paramsOrFirst || paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        duration: paramsOrFirst
      };
    }
    const duration = params.duration;
    const apiPath = "/account/jwts";
    const payload = {};
    if (typeof duration !== "undefined") {
      payload["duration"] = duration;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  listLogs(paramsOrFirst, ...rest) {
    let params;
    if (!paramsOrFirst || paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        queries: paramsOrFirst,
        total: rest[0]
      };
    }
    const queries = params.queries;
    const total = params.total;
    const apiPath = "/account/logs";
    const payload = {};
    if (typeof queries !== "undefined") {
      payload["queries"] = queries;
    }
    if (typeof total !== "undefined") {
      payload["total"] = total;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "accept": "application/json"
    };
    return this.client.call("get", uri, apiHeaders, payload);
  }
  updateMFA(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        mfa: paramsOrFirst
      };
    }
    const mfa = params.mfa;
    if (typeof mfa === "undefined") {
      throw new AppwriteException('Missing required parameter: "mfa"');
    }
    const apiPath = "/account/mfa";
    const payload = {};
    if (typeof mfa !== "undefined") {
      payload["mfa"] = mfa;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("patch", uri, apiHeaders, payload);
  }
  createMfaAuthenticator(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst) && "type" in paramsOrFirst) {
      params = paramsOrFirst || {};
    } else {
      params = {
        type: paramsOrFirst
      };
    }
    const type = params.type;
    if (typeof type === "undefined") {
      throw new AppwriteException('Missing required parameter: "type"');
    }
    const apiPath = "/account/mfa/authenticators/{type}".replace("{type}", encodeURIComponent(String(type)));
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  createMFAAuthenticator(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst) && "type" in paramsOrFirst) {
      params = paramsOrFirst || {};
    } else {
      params = {
        type: paramsOrFirst
      };
    }
    const type = params.type;
    if (typeof type === "undefined") {
      throw new AppwriteException('Missing required parameter: "type"');
    }
    const apiPath = "/account/mfa/authenticators/{type}".replace("{type}", encodeURIComponent(String(type)));
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  updateMfaAuthenticator(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst) && ("type" in paramsOrFirst || "otp" in paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        type: paramsOrFirst,
        otp: rest[0]
      };
    }
    const type = params.type;
    const otp = params.otp;
    if (typeof type === "undefined") {
      throw new AppwriteException('Missing required parameter: "type"');
    }
    if (typeof otp === "undefined") {
      throw new AppwriteException('Missing required parameter: "otp"');
    }
    const apiPath = "/account/mfa/authenticators/{type}".replace("{type}", encodeURIComponent(String(type)));
    const payload = {};
    if (typeof otp !== "undefined") {
      payload["otp"] = otp;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("put", uri, apiHeaders, payload);
  }
  updateMFAAuthenticator(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst) && ("type" in paramsOrFirst || "otp" in paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        type: paramsOrFirst,
        otp: rest[0]
      };
    }
    const type = params.type;
    const otp = params.otp;
    if (typeof type === "undefined") {
      throw new AppwriteException('Missing required parameter: "type"');
    }
    if (typeof otp === "undefined") {
      throw new AppwriteException('Missing required parameter: "otp"');
    }
    const apiPath = "/account/mfa/authenticators/{type}".replace("{type}", encodeURIComponent(String(type)));
    const payload = {};
    if (typeof otp !== "undefined") {
      payload["otp"] = otp;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("put", uri, apiHeaders, payload);
  }
  deleteMfaAuthenticator(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst) && "type" in paramsOrFirst) {
      params = paramsOrFirst || {};
    } else {
      params = {
        type: paramsOrFirst
      };
    }
    const type = params.type;
    if (typeof type === "undefined") {
      throw new AppwriteException('Missing required parameter: "type"');
    }
    const apiPath = "/account/mfa/authenticators/{type}".replace("{type}", encodeURIComponent(String(type)));
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json"
    };
    return this.client.call("delete", uri, apiHeaders, payload);
  }
  deleteMFAAuthenticator(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst) && "type" in paramsOrFirst) {
      params = paramsOrFirst || {};
    } else {
      params = {
        type: paramsOrFirst
      };
    }
    const type = params.type;
    if (typeof type === "undefined") {
      throw new AppwriteException('Missing required parameter: "type"');
    }
    const apiPath = "/account/mfa/authenticators/{type}".replace("{type}", encodeURIComponent(String(type)));
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json"
    };
    return this.client.call("delete", uri, apiHeaders, payload);
  }
  createMfaChallenge(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst) && "factor" in paramsOrFirst) {
      params = paramsOrFirst || {};
    } else {
      params = {
        factor: paramsOrFirst
      };
    }
    const factor = params.factor;
    if (typeof factor === "undefined") {
      throw new AppwriteException('Missing required parameter: "factor"');
    }
    const apiPath = "/account/mfa/challenges";
    const payload = {};
    if (typeof factor !== "undefined") {
      payload["factor"] = factor;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  createMFAChallenge(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst) && "factor" in paramsOrFirst) {
      params = paramsOrFirst || {};
    } else {
      params = {
        factor: paramsOrFirst
      };
    }
    const factor = params.factor;
    if (typeof factor === "undefined") {
      throw new AppwriteException('Missing required parameter: "factor"');
    }
    const apiPath = "/account/mfa/challenges";
    const payload = {};
    if (typeof factor !== "undefined") {
      payload["factor"] = factor;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  updateMfaChallenge(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        challengeId: paramsOrFirst,
        otp: rest[0]
      };
    }
    const challengeId = params.challengeId;
    const otp = params.otp;
    if (typeof challengeId === "undefined") {
      throw new AppwriteException('Missing required parameter: "challengeId"');
    }
    if (typeof otp === "undefined") {
      throw new AppwriteException('Missing required parameter: "otp"');
    }
    const apiPath = "/account/mfa/challenges";
    const payload = {};
    if (typeof challengeId !== "undefined") {
      payload["challengeId"] = challengeId;
    }
    if (typeof otp !== "undefined") {
      payload["otp"] = otp;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("put", uri, apiHeaders, payload);
  }
  updateMFAChallenge(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        challengeId: paramsOrFirst,
        otp: rest[0]
      };
    }
    const challengeId = params.challengeId;
    const otp = params.otp;
    if (typeof challengeId === "undefined") {
      throw new AppwriteException('Missing required parameter: "challengeId"');
    }
    if (typeof otp === "undefined") {
      throw new AppwriteException('Missing required parameter: "otp"');
    }
    const apiPath = "/account/mfa/challenges";
    const payload = {};
    if (typeof challengeId !== "undefined") {
      payload["challengeId"] = challengeId;
    }
    if (typeof otp !== "undefined") {
      payload["otp"] = otp;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("put", uri, apiHeaders, payload);
  }
  /**
   * List the factors available on the account to be used as a MFA challange.
   *
   * @throws {AppwriteException}
   * @returns {Promise<Models.MfaFactors>}
   * @deprecated This API has been deprecated since 1.8.0. Please use `Account.listMFAFactors` instead.
   */
  listMfaFactors() {
    const apiPath = "/account/mfa/factors";
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "accept": "application/json"
    };
    return this.client.call("get", uri, apiHeaders, payload);
  }
  /**
   * List the factors available on the account to be used as a MFA challange.
   *
   * @throws {AppwriteException}
   * @returns {Promise<Models.MfaFactors>}
   */
  listMFAFactors() {
    const apiPath = "/account/mfa/factors";
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "accept": "application/json"
    };
    return this.client.call("get", uri, apiHeaders, payload);
  }
  /**
   * Get recovery codes that can be used as backup for MFA flow. Before getting codes, they must be generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method. An OTP challenge is required to read recovery codes.
   *
   * @throws {AppwriteException}
   * @returns {Promise<Models.MfaRecoveryCodes>}
   * @deprecated This API has been deprecated since 1.8.0. Please use `Account.getMFARecoveryCodes` instead.
   */
  getMfaRecoveryCodes() {
    const apiPath = "/account/mfa/recovery-codes";
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "accept": "application/json"
    };
    return this.client.call("get", uri, apiHeaders, payload);
  }
  /**
   * Get recovery codes that can be used as backup for MFA flow. Before getting codes, they must be generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method. An OTP challenge is required to read recovery codes.
   *
   * @throws {AppwriteException}
   * @returns {Promise<Models.MfaRecoveryCodes>}
   */
  getMFARecoveryCodes() {
    const apiPath = "/account/mfa/recovery-codes";
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "accept": "application/json"
    };
    return this.client.call("get", uri, apiHeaders, payload);
  }
  /**
   * Generate recovery codes as backup for MFA flow. It's recommended to generate and show then immediately after user successfully adds their authehticator. Recovery codes can be used as a MFA verification type in [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge) method.
   *
   * @throws {AppwriteException}
   * @returns {Promise<Models.MfaRecoveryCodes>}
   * @deprecated This API has been deprecated since 1.8.0. Please use `Account.createMFARecoveryCodes` instead.
   */
  createMfaRecoveryCodes() {
    const apiPath = "/account/mfa/recovery-codes";
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  /**
   * Generate recovery codes as backup for MFA flow. It's recommended to generate and show then immediately after user successfully adds their authehticator. Recovery codes can be used as a MFA verification type in [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge) method.
   *
   * @throws {AppwriteException}
   * @returns {Promise<Models.MfaRecoveryCodes>}
   */
  createMFARecoveryCodes() {
    const apiPath = "/account/mfa/recovery-codes";
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  /**
   * Regenerate recovery codes that can be used as backup for MFA flow. Before regenerating codes, they must be first generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method. An OTP challenge is required to regenreate recovery codes.
   *
   * @throws {AppwriteException}
   * @returns {Promise<Models.MfaRecoveryCodes>}
   * @deprecated This API has been deprecated since 1.8.0. Please use `Account.updateMFARecoveryCodes` instead.
   */
  updateMfaRecoveryCodes() {
    const apiPath = "/account/mfa/recovery-codes";
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("patch", uri, apiHeaders, payload);
  }
  /**
   * Regenerate recovery codes that can be used as backup for MFA flow. Before regenerating codes, they must be first generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method. An OTP challenge is required to regenreate recovery codes.
   *
   * @throws {AppwriteException}
   * @returns {Promise<Models.MfaRecoveryCodes>}
   */
  updateMFARecoveryCodes() {
    const apiPath = "/account/mfa/recovery-codes";
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("patch", uri, apiHeaders, payload);
  }
  updateName(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        name: paramsOrFirst
      };
    }
    const name = params.name;
    if (typeof name === "undefined") {
      throw new AppwriteException('Missing required parameter: "name"');
    }
    const apiPath = "/account/name";
    const payload = {};
    if (typeof name !== "undefined") {
      payload["name"] = name;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("patch", uri, apiHeaders, payload);
  }
  updatePassword(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        password: paramsOrFirst,
        oldPassword: rest[0]
      };
    }
    const password = params.password;
    const oldPassword = params.oldPassword;
    if (typeof password === "undefined") {
      throw new AppwriteException('Missing required parameter: "password"');
    }
    const apiPath = "/account/password";
    const payload = {};
    if (typeof password !== "undefined") {
      payload["password"] = password;
    }
    if (typeof oldPassword !== "undefined") {
      payload["oldPassword"] = oldPassword;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("patch", uri, apiHeaders, payload);
  }
  updatePhone(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        phone: paramsOrFirst,
        password: rest[0]
      };
    }
    const phone = params.phone;
    const password = params.password;
    if (typeof phone === "undefined") {
      throw new AppwriteException('Missing required parameter: "phone"');
    }
    if (typeof password === "undefined") {
      throw new AppwriteException('Missing required parameter: "password"');
    }
    const apiPath = "/account/phone";
    const payload = {};
    if (typeof phone !== "undefined") {
      payload["phone"] = phone;
    }
    if (typeof password !== "undefined") {
      payload["password"] = password;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("patch", uri, apiHeaders, payload);
  }
  /**
   * Get the preferences as a key-value object for the currently logged in user.
   *
   * @throws {AppwriteException}
   * @returns {Promise<Preferences>}
   */
  getPrefs() {
    const apiPath = "/account/prefs";
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "accept": "application/json"
    };
    return this.client.call("get", uri, apiHeaders, payload);
  }
  updatePrefs(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst) && "prefs" in paramsOrFirst) {
      params = paramsOrFirst || {};
    } else {
      params = {
        prefs: paramsOrFirst
      };
    }
    const prefs = params.prefs;
    if (typeof prefs === "undefined") {
      throw new AppwriteException('Missing required parameter: "prefs"');
    }
    const apiPath = "/account/prefs";
    const payload = {};
    if (typeof prefs !== "undefined") {
      payload["prefs"] = prefs;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("patch", uri, apiHeaders, payload);
  }
  createRecovery(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        email: paramsOrFirst,
        url: rest[0]
      };
    }
    const email = params.email;
    const url = params.url;
    if (typeof email === "undefined") {
      throw new AppwriteException('Missing required parameter: "email"');
    }
    if (typeof url === "undefined") {
      throw new AppwriteException('Missing required parameter: "url"');
    }
    const apiPath = "/account/recovery";
    const payload = {};
    if (typeof email !== "undefined") {
      payload["email"] = email;
    }
    if (typeof url !== "undefined") {
      payload["url"] = url;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  updateRecovery(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        userId: paramsOrFirst,
        secret: rest[0],
        password: rest[1]
      };
    }
    const userId = params.userId;
    const secret = params.secret;
    const password = params.password;
    if (typeof userId === "undefined") {
      throw new AppwriteException('Missing required parameter: "userId"');
    }
    if (typeof secret === "undefined") {
      throw new AppwriteException('Missing required parameter: "secret"');
    }
    if (typeof password === "undefined") {
      throw new AppwriteException('Missing required parameter: "password"');
    }
    const apiPath = "/account/recovery";
    const payload = {};
    if (typeof userId !== "undefined") {
      payload["userId"] = userId;
    }
    if (typeof secret !== "undefined") {
      payload["secret"] = secret;
    }
    if (typeof password !== "undefined") {
      payload["password"] = password;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("put", uri, apiHeaders, payload);
  }
  /**
   * Get the list of active sessions across different devices for the currently logged in user.
   *
   * @throws {AppwriteException}
   * @returns {Promise<Models.SessionList>}
   */
  listSessions() {
    const apiPath = "/account/sessions";
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "accept": "application/json"
    };
    return this.client.call("get", uri, apiHeaders, payload);
  }
  /**
   * Delete all sessions from the user account and remove any sessions cookies from the end client.
   *
   * @throws {AppwriteException}
   * @returns {Promise<{}>}
   */
  deleteSessions() {
    const apiPath = "/account/sessions";
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json"
    };
    return this.client.call("delete", uri, apiHeaders, payload);
  }
  /**
   * Use this endpoint to allow a new user to register an anonymous account in your project. This route will also create a new session for the user. To allow the new user to convert an anonymous account to a normal account, you need to update its [email and password](https://appwrite.io/docs/references/cloud/client-web/account#updateEmail) or create an [OAuth2 session](https://appwrite.io/docs/references/cloud/client-web/account#CreateOAuth2Session).
   *
   * @throws {AppwriteException}
   * @returns {Promise<Models.Session>}
   */
  createAnonymousSession() {
    const apiPath = "/account/sessions/anonymous";
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  createEmailPasswordSession(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        email: paramsOrFirst,
        password: rest[0]
      };
    }
    const email = params.email;
    const password = params.password;
    if (typeof email === "undefined") {
      throw new AppwriteException('Missing required parameter: "email"');
    }
    if (typeof password === "undefined") {
      throw new AppwriteException('Missing required parameter: "password"');
    }
    const apiPath = "/account/sessions/email";
    const payload = {};
    if (typeof email !== "undefined") {
      payload["email"] = email;
    }
    if (typeof password !== "undefined") {
      payload["password"] = password;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  updateMagicURLSession(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        userId: paramsOrFirst,
        secret: rest[0]
      };
    }
    const userId = params.userId;
    const secret = params.secret;
    if (typeof userId === "undefined") {
      throw new AppwriteException('Missing required parameter: "userId"');
    }
    if (typeof secret === "undefined") {
      throw new AppwriteException('Missing required parameter: "secret"');
    }
    const apiPath = "/account/sessions/magic-url";
    const payload = {};
    if (typeof userId !== "undefined") {
      payload["userId"] = userId;
    }
    if (typeof secret !== "undefined") {
      payload["secret"] = secret;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("put", uri, apiHeaders, payload);
  }
  createOAuth2Session(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst) && ("provider" in paramsOrFirst || "success" in paramsOrFirst || "failure" in paramsOrFirst || "scopes" in paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        provider: paramsOrFirst,
        success: rest[0],
        failure: rest[1],
        scopes: rest[2]
      };
    }
    const provider = params.provider;
    const success = params.success;
    const failure = params.failure;
    const scopes = params.scopes;
    if (typeof provider === "undefined") {
      throw new AppwriteException('Missing required parameter: "provider"');
    }
    const apiPath = "/account/sessions/oauth2/{provider}".replace("{provider}", encodeURIComponent(String(provider)));
    const payload = {};
    if (typeof success !== "undefined") {
      payload["success"] = success;
    }
    if (typeof failure !== "undefined") {
      payload["failure"] = failure;
    }
    if (typeof scopes !== "undefined") {
      payload["scopes"] = scopes;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    ({
      "X-Appwrite-Project": this.client.config.project
    });
    payload["project"] = this.client.config.project;
    for (const [key, value] of Object.entries(Service.flatten(payload))) {
      uri.searchParams.append(key, value);
    }
    if (typeof window !== "undefined" && (window === null || window === void 0 ? void 0 : window.location)) {
      window.location.href = uri.toString();
      return;
    } else {
      return uri.toString();
    }
  }
  updatePhoneSession(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        userId: paramsOrFirst,
        secret: rest[0]
      };
    }
    const userId = params.userId;
    const secret = params.secret;
    if (typeof userId === "undefined") {
      throw new AppwriteException('Missing required parameter: "userId"');
    }
    if (typeof secret === "undefined") {
      throw new AppwriteException('Missing required parameter: "secret"');
    }
    const apiPath = "/account/sessions/phone";
    const payload = {};
    if (typeof userId !== "undefined") {
      payload["userId"] = userId;
    }
    if (typeof secret !== "undefined") {
      payload["secret"] = secret;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("put", uri, apiHeaders, payload);
  }
  createSession(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        userId: paramsOrFirst,
        secret: rest[0]
      };
    }
    const userId = params.userId;
    const secret = params.secret;
    if (typeof userId === "undefined") {
      throw new AppwriteException('Missing required parameter: "userId"');
    }
    if (typeof secret === "undefined") {
      throw new AppwriteException('Missing required parameter: "secret"');
    }
    const apiPath = "/account/sessions/token";
    const payload = {};
    if (typeof userId !== "undefined") {
      payload["userId"] = userId;
    }
    if (typeof secret !== "undefined") {
      payload["secret"] = secret;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  getSession(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        sessionId: paramsOrFirst
      };
    }
    const sessionId = params.sessionId;
    if (typeof sessionId === "undefined") {
      throw new AppwriteException('Missing required parameter: "sessionId"');
    }
    const apiPath = "/account/sessions/{sessionId}".replace("{sessionId}", encodeURIComponent(String(sessionId)));
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "accept": "application/json"
    };
    return this.client.call("get", uri, apiHeaders, payload);
  }
  updateSession(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        sessionId: paramsOrFirst
      };
    }
    const sessionId = params.sessionId;
    if (typeof sessionId === "undefined") {
      throw new AppwriteException('Missing required parameter: "sessionId"');
    }
    const apiPath = "/account/sessions/{sessionId}".replace("{sessionId}", encodeURIComponent(String(sessionId)));
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("patch", uri, apiHeaders, payload);
  }
  deleteSession(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        sessionId: paramsOrFirst
      };
    }
    const sessionId = params.sessionId;
    if (typeof sessionId === "undefined") {
      throw new AppwriteException('Missing required parameter: "sessionId"');
    }
    const apiPath = "/account/sessions/{sessionId}".replace("{sessionId}", encodeURIComponent(String(sessionId)));
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json"
    };
    return this.client.call("delete", uri, apiHeaders, payload);
  }
  /**
   * Block the currently logged in user account. Behind the scene, the user record is not deleted but permanently blocked from any access. To completely delete a user, use the Users API instead.
   *
   * @throws {AppwriteException}
   * @returns {Promise<Models.User<Preferences>>}
   */
  updateStatus() {
    const apiPath = "/account/status";
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("patch", uri, apiHeaders, payload);
  }
  createPushTarget(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        targetId: paramsOrFirst,
        identifier: rest[0],
        providerId: rest[1]
      };
    }
    const targetId = params.targetId;
    const identifier = params.identifier;
    const providerId = params.providerId;
    if (typeof targetId === "undefined") {
      throw new AppwriteException('Missing required parameter: "targetId"');
    }
    if (typeof identifier === "undefined") {
      throw new AppwriteException('Missing required parameter: "identifier"');
    }
    const apiPath = "/account/targets/push";
    const payload = {};
    if (typeof targetId !== "undefined") {
      payload["targetId"] = targetId;
    }
    if (typeof identifier !== "undefined") {
      payload["identifier"] = identifier;
    }
    if (typeof providerId !== "undefined") {
      payload["providerId"] = providerId;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  updatePushTarget(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        targetId: paramsOrFirst,
        identifier: rest[0]
      };
    }
    const targetId = params.targetId;
    const identifier = params.identifier;
    if (typeof targetId === "undefined") {
      throw new AppwriteException('Missing required parameter: "targetId"');
    }
    if (typeof identifier === "undefined") {
      throw new AppwriteException('Missing required parameter: "identifier"');
    }
    const apiPath = "/account/targets/{targetId}/push".replace("{targetId}", encodeURIComponent(String(targetId)));
    const payload = {};
    if (typeof identifier !== "undefined") {
      payload["identifier"] = identifier;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("put", uri, apiHeaders, payload);
  }
  deletePushTarget(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        targetId: paramsOrFirst
      };
    }
    const targetId = params.targetId;
    if (typeof targetId === "undefined") {
      throw new AppwriteException('Missing required parameter: "targetId"');
    }
    const apiPath = "/account/targets/{targetId}/push".replace("{targetId}", encodeURIComponent(String(targetId)));
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json"
    };
    return this.client.call("delete", uri, apiHeaders, payload);
  }
  createEmailToken(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        userId: paramsOrFirst,
        email: rest[0],
        phrase: rest[1]
      };
    }
    const userId = params.userId;
    const email = params.email;
    const phrase = params.phrase;
    if (typeof userId === "undefined") {
      throw new AppwriteException('Missing required parameter: "userId"');
    }
    if (typeof email === "undefined") {
      throw new AppwriteException('Missing required parameter: "email"');
    }
    const apiPath = "/account/tokens/email";
    const payload = {};
    if (typeof userId !== "undefined") {
      payload["userId"] = userId;
    }
    if (typeof email !== "undefined") {
      payload["email"] = email;
    }
    if (typeof phrase !== "undefined") {
      payload["phrase"] = phrase;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  createMagicURLToken(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        userId: paramsOrFirst,
        email: rest[0],
        url: rest[1],
        phrase: rest[2]
      };
    }
    const userId = params.userId;
    const email = params.email;
    const url = params.url;
    const phrase = params.phrase;
    if (typeof userId === "undefined") {
      throw new AppwriteException('Missing required parameter: "userId"');
    }
    if (typeof email === "undefined") {
      throw new AppwriteException('Missing required parameter: "email"');
    }
    const apiPath = "/account/tokens/magic-url";
    const payload = {};
    if (typeof userId !== "undefined") {
      payload["userId"] = userId;
    }
    if (typeof email !== "undefined") {
      payload["email"] = email;
    }
    if (typeof url !== "undefined") {
      payload["url"] = url;
    }
    if (typeof phrase !== "undefined") {
      payload["phrase"] = phrase;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  createOAuth2Token(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst) && ("provider" in paramsOrFirst || "success" in paramsOrFirst || "failure" in paramsOrFirst || "scopes" in paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        provider: paramsOrFirst,
        success: rest[0],
        failure: rest[1],
        scopes: rest[2]
      };
    }
    const provider = params.provider;
    const success = params.success;
    const failure = params.failure;
    const scopes = params.scopes;
    if (typeof provider === "undefined") {
      throw new AppwriteException('Missing required parameter: "provider"');
    }
    const apiPath = "/account/tokens/oauth2/{provider}".replace("{provider}", encodeURIComponent(String(provider)));
    const payload = {};
    if (typeof success !== "undefined") {
      payload["success"] = success;
    }
    if (typeof failure !== "undefined") {
      payload["failure"] = failure;
    }
    if (typeof scopes !== "undefined") {
      payload["scopes"] = scopes;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    ({
      "X-Appwrite-Project": this.client.config.project
    });
    payload["project"] = this.client.config.project;
    for (const [key, value] of Object.entries(Service.flatten(payload))) {
      uri.searchParams.append(key, value);
    }
    if (typeof window !== "undefined" && (window === null || window === void 0 ? void 0 : window.location)) {
      window.location.href = uri.toString();
      return;
    } else {
      return uri.toString();
    }
  }
  createPhoneToken(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        userId: paramsOrFirst,
        phone: rest[0]
      };
    }
    const userId = params.userId;
    const phone = params.phone;
    if (typeof userId === "undefined") {
      throw new AppwriteException('Missing required parameter: "userId"');
    }
    if (typeof phone === "undefined") {
      throw new AppwriteException('Missing required parameter: "phone"');
    }
    const apiPath = "/account/tokens/phone";
    const payload = {};
    if (typeof userId !== "undefined") {
      payload["userId"] = userId;
    }
    if (typeof phone !== "undefined") {
      payload["phone"] = phone;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  createEmailVerification(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        url: paramsOrFirst
      };
    }
    const url = params.url;
    if (typeof url === "undefined") {
      throw new AppwriteException('Missing required parameter: "url"');
    }
    const apiPath = "/account/verifications/email";
    const payload = {};
    if (typeof url !== "undefined") {
      payload["url"] = url;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  createVerification(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        url: paramsOrFirst
      };
    }
    const url = params.url;
    if (typeof url === "undefined") {
      throw new AppwriteException('Missing required parameter: "url"');
    }
    const apiPath = "/account/verifications/email";
    const payload = {};
    if (typeof url !== "undefined") {
      payload["url"] = url;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  updateEmailVerification(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        userId: paramsOrFirst,
        secret: rest[0]
      };
    }
    const userId = params.userId;
    const secret = params.secret;
    if (typeof userId === "undefined") {
      throw new AppwriteException('Missing required parameter: "userId"');
    }
    if (typeof secret === "undefined") {
      throw new AppwriteException('Missing required parameter: "secret"');
    }
    const apiPath = "/account/verifications/email";
    const payload = {};
    if (typeof userId !== "undefined") {
      payload["userId"] = userId;
    }
    if (typeof secret !== "undefined") {
      payload["secret"] = secret;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("put", uri, apiHeaders, payload);
  }
  updateVerification(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        userId: paramsOrFirst,
        secret: rest[0]
      };
    }
    const userId = params.userId;
    const secret = params.secret;
    if (typeof userId === "undefined") {
      throw new AppwriteException('Missing required parameter: "userId"');
    }
    if (typeof secret === "undefined") {
      throw new AppwriteException('Missing required parameter: "secret"');
    }
    const apiPath = "/account/verifications/email";
    const payload = {};
    if (typeof userId !== "undefined") {
      payload["userId"] = userId;
    }
    if (typeof secret !== "undefined") {
      payload["secret"] = secret;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("put", uri, apiHeaders, payload);
  }
  /**
   * Use this endpoint to send a verification SMS to the currently logged in user. This endpoint is meant for use after updating a user's phone number using the [accountUpdatePhone](https://appwrite.io/docs/references/cloud/client-web/account#updatePhone) endpoint. Learn more about how to [complete the verification process](https://appwrite.io/docs/references/cloud/client-web/account#updatePhoneVerification). The verification code sent to the user's phone number is valid for 15 minutes.
   *
   * @throws {AppwriteException}
   * @returns {Promise<Models.Token>}
   */
  createPhoneVerification() {
    const apiPath = "/account/verifications/phone";
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  updatePhoneVerification(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        userId: paramsOrFirst,
        secret: rest[0]
      };
    }
    const userId = params.userId;
    const secret = params.secret;
    if (typeof userId === "undefined") {
      throw new AppwriteException('Missing required parameter: "userId"');
    }
    if (typeof secret === "undefined") {
      throw new AppwriteException('Missing required parameter: "secret"');
    }
    const apiPath = "/account/verifications/phone";
    const payload = {};
    if (typeof userId !== "undefined") {
      payload["userId"] = userId;
    }
    if (typeof secret !== "undefined") {
      payload["secret"] = secret;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("put", uri, apiHeaders, payload);
  }
};
var Databases = class {
  static {
    __name(this, "Databases");
  }
  constructor(client) {
    this.client = client;
  }
  listTransactions(paramsOrFirst) {
    let params;
    if (!paramsOrFirst || paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        queries: paramsOrFirst
      };
    }
    const queries = params.queries;
    const apiPath = "/databases/transactions";
    const payload = {};
    if (typeof queries !== "undefined") {
      payload["queries"] = queries;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "accept": "application/json"
    };
    return this.client.call("get", uri, apiHeaders, payload);
  }
  createTransaction(paramsOrFirst) {
    let params;
    if (!paramsOrFirst || paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        ttl: paramsOrFirst
      };
    }
    const ttl = params.ttl;
    const apiPath = "/databases/transactions";
    const payload = {};
    if (typeof ttl !== "undefined") {
      payload["ttl"] = ttl;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  getTransaction(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        transactionId: paramsOrFirst
      };
    }
    const transactionId = params.transactionId;
    if (typeof transactionId === "undefined") {
      throw new AppwriteException('Missing required parameter: "transactionId"');
    }
    const apiPath = "/databases/transactions/{transactionId}".replace("{transactionId}", encodeURIComponent(String(transactionId)));
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "accept": "application/json"
    };
    return this.client.call("get", uri, apiHeaders, payload);
  }
  updateTransaction(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        transactionId: paramsOrFirst,
        commit: rest[0],
        rollback: rest[1]
      };
    }
    const transactionId = params.transactionId;
    const commit = params.commit;
    const rollback = params.rollback;
    if (typeof transactionId === "undefined") {
      throw new AppwriteException('Missing required parameter: "transactionId"');
    }
    const apiPath = "/databases/transactions/{transactionId}".replace("{transactionId}", encodeURIComponent(String(transactionId)));
    const payload = {};
    if (typeof commit !== "undefined") {
      payload["commit"] = commit;
    }
    if (typeof rollback !== "undefined") {
      payload["rollback"] = rollback;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("patch", uri, apiHeaders, payload);
  }
  deleteTransaction(paramsOrFirst) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        transactionId: paramsOrFirst
      };
    }
    const transactionId = params.transactionId;
    if (typeof transactionId === "undefined") {
      throw new AppwriteException('Missing required parameter: "transactionId"');
    }
    const apiPath = "/databases/transactions/{transactionId}".replace("{transactionId}", encodeURIComponent(String(transactionId)));
    const payload = {};
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json"
    };
    return this.client.call("delete", uri, apiHeaders, payload);
  }
  createOperations(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        transactionId: paramsOrFirst,
        operations: rest[0]
      };
    }
    const transactionId = params.transactionId;
    const operations = params.operations;
    if (typeof transactionId === "undefined") {
      throw new AppwriteException('Missing required parameter: "transactionId"');
    }
    const apiPath = "/databases/transactions/{transactionId}/operations".replace("{transactionId}", encodeURIComponent(String(transactionId)));
    const payload = {};
    if (typeof operations !== "undefined") {
      payload["operations"] = operations;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  listDocuments(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        databaseId: paramsOrFirst,
        collectionId: rest[0],
        queries: rest[1],
        transactionId: rest[2],
        total: rest[3],
        ttl: rest[4]
      };
    }
    const databaseId = params.databaseId;
    const collectionId = params.collectionId;
    const queries = params.queries;
    const transactionId = params.transactionId;
    const total = params.total;
    const ttl = params.ttl;
    if (typeof databaseId === "undefined") {
      throw new AppwriteException('Missing required parameter: "databaseId"');
    }
    if (typeof collectionId === "undefined") {
      throw new AppwriteException('Missing required parameter: "collectionId"');
    }
    const apiPath = "/databases/{databaseId}/collections/{collectionId}/documents".replace("{databaseId}", encodeURIComponent(String(databaseId))).replace("{collectionId}", encodeURIComponent(String(collectionId)));
    const payload = {};
    if (typeof queries !== "undefined") {
      payload["queries"] = queries;
    }
    if (typeof transactionId !== "undefined") {
      payload["transactionId"] = transactionId;
    }
    if (typeof total !== "undefined") {
      payload["total"] = total;
    }
    if (typeof ttl !== "undefined") {
      payload["ttl"] = ttl;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "accept": "application/json"
    };
    return this.client.call("get", uri, apiHeaders, payload);
  }
  createDocument(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        databaseId: paramsOrFirst,
        collectionId: rest[0],
        documentId: rest[1],
        data: rest[2],
        permissions: rest[3],
        transactionId: rest[4]
      };
    }
    const databaseId = params.databaseId;
    const collectionId = params.collectionId;
    const documentId = params.documentId;
    const data = params.data;
    const permissions = params.permissions;
    const transactionId = params.transactionId;
    if (typeof databaseId === "undefined") {
      throw new AppwriteException('Missing required parameter: "databaseId"');
    }
    if (typeof collectionId === "undefined") {
      throw new AppwriteException('Missing required parameter: "collectionId"');
    }
    if (typeof documentId === "undefined") {
      throw new AppwriteException('Missing required parameter: "documentId"');
    }
    if (typeof data === "undefined") {
      throw new AppwriteException('Missing required parameter: "data"');
    }
    const apiPath = "/databases/{databaseId}/collections/{collectionId}/documents".replace("{databaseId}", encodeURIComponent(String(databaseId))).replace("{collectionId}", encodeURIComponent(String(collectionId)));
    const payload = {};
    if (typeof documentId !== "undefined") {
      payload["documentId"] = documentId;
    }
    if (typeof data !== "undefined") {
      payload["data"] = data;
    }
    if (typeof permissions !== "undefined") {
      payload["permissions"] = permissions;
    }
    if (typeof transactionId !== "undefined") {
      payload["transactionId"] = transactionId;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("post", uri, apiHeaders, payload);
  }
  getDocument(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        databaseId: paramsOrFirst,
        collectionId: rest[0],
        documentId: rest[1],
        queries: rest[2],
        transactionId: rest[3]
      };
    }
    const databaseId = params.databaseId;
    const collectionId = params.collectionId;
    const documentId = params.documentId;
    const queries = params.queries;
    const transactionId = params.transactionId;
    if (typeof databaseId === "undefined") {
      throw new AppwriteException('Missing required parameter: "databaseId"');
    }
    if (typeof collectionId === "undefined") {
      throw new AppwriteException('Missing required parameter: "collectionId"');
    }
    if (typeof documentId === "undefined") {
      throw new AppwriteException('Missing required parameter: "documentId"');
    }
    const apiPath = "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}".replace("{databaseId}", encodeURIComponent(String(databaseId))).replace("{collectionId}", encodeURIComponent(String(collectionId))).replace("{documentId}", encodeURIComponent(String(documentId)));
    const payload = {};
    if (typeof queries !== "undefined") {
      payload["queries"] = queries;
    }
    if (typeof transactionId !== "undefined") {
      payload["transactionId"] = transactionId;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "accept": "application/json"
    };
    return this.client.call("get", uri, apiHeaders, payload);
  }
  upsertDocument(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        databaseId: paramsOrFirst,
        collectionId: rest[0],
        documentId: rest[1],
        data: rest[2],
        permissions: rest[3],
        transactionId: rest[4]
      };
    }
    const databaseId = params.databaseId;
    const collectionId = params.collectionId;
    const documentId = params.documentId;
    const data = params.data;
    const permissions = params.permissions;
    const transactionId = params.transactionId;
    if (typeof databaseId === "undefined") {
      throw new AppwriteException('Missing required parameter: "databaseId"');
    }
    if (typeof collectionId === "undefined") {
      throw new AppwriteException('Missing required parameter: "collectionId"');
    }
    if (typeof documentId === "undefined") {
      throw new AppwriteException('Missing required parameter: "documentId"');
    }
    const apiPath = "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}".replace("{databaseId}", encodeURIComponent(String(databaseId))).replace("{collectionId}", encodeURIComponent(String(collectionId))).replace("{documentId}", encodeURIComponent(String(documentId)));
    const payload = {};
    if (typeof data !== "undefined") {
      payload["data"] = data;
    }
    if (typeof permissions !== "undefined") {
      payload["permissions"] = permissions;
    }
    if (typeof transactionId !== "undefined") {
      payload["transactionId"] = transactionId;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("put", uri, apiHeaders, payload);
  }
  updateDocument(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        databaseId: paramsOrFirst,
        collectionId: rest[0],
        documentId: rest[1],
        data: rest[2],
        permissions: rest[3],
        transactionId: rest[4]
      };
    }
    const databaseId = params.databaseId;
    const collectionId = params.collectionId;
    const documentId = params.documentId;
    const data = params.data;
    const permissions = params.permissions;
    const transactionId = params.transactionId;
    if (typeof databaseId === "undefined") {
      throw new AppwriteException('Missing required parameter: "databaseId"');
    }
    if (typeof collectionId === "undefined") {
      throw new AppwriteException('Missing required parameter: "collectionId"');
    }
    if (typeof documentId === "undefined") {
      throw new AppwriteException('Missing required parameter: "documentId"');
    }
    const apiPath = "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}".replace("{databaseId}", encodeURIComponent(String(databaseId))).replace("{collectionId}", encodeURIComponent(String(collectionId))).replace("{documentId}", encodeURIComponent(String(documentId)));
    const payload = {};
    if (typeof data !== "undefined") {
      payload["data"] = data;
    }
    if (typeof permissions !== "undefined") {
      payload["permissions"] = permissions;
    }
    if (typeof transactionId !== "undefined") {
      payload["transactionId"] = transactionId;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("patch", uri, apiHeaders, payload);
  }
  deleteDocument(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        databaseId: paramsOrFirst,
        collectionId: rest[0],
        documentId: rest[1],
        transactionId: rest[2]
      };
    }
    const databaseId = params.databaseId;
    const collectionId = params.collectionId;
    const documentId = params.documentId;
    const transactionId = params.transactionId;
    if (typeof databaseId === "undefined") {
      throw new AppwriteException('Missing required parameter: "databaseId"');
    }
    if (typeof collectionId === "undefined") {
      throw new AppwriteException('Missing required parameter: "collectionId"');
    }
    if (typeof documentId === "undefined") {
      throw new AppwriteException('Missing required parameter: "documentId"');
    }
    const apiPath = "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}".replace("{databaseId}", encodeURIComponent(String(databaseId))).replace("{collectionId}", encodeURIComponent(String(collectionId))).replace("{documentId}", encodeURIComponent(String(documentId)));
    const payload = {};
    if (typeof transactionId !== "undefined") {
      payload["transactionId"] = transactionId;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json"
    };
    return this.client.call("delete", uri, apiHeaders, payload);
  }
  decrementDocumentAttribute(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        databaseId: paramsOrFirst,
        collectionId: rest[0],
        documentId: rest[1],
        attribute: rest[2],
        value: rest[3],
        min: rest[4],
        transactionId: rest[5]
      };
    }
    const databaseId = params.databaseId;
    const collectionId = params.collectionId;
    const documentId = params.documentId;
    const attribute = params.attribute;
    const value = params.value;
    const min = params.min;
    const transactionId = params.transactionId;
    if (typeof databaseId === "undefined") {
      throw new AppwriteException('Missing required parameter: "databaseId"');
    }
    if (typeof collectionId === "undefined") {
      throw new AppwriteException('Missing required parameter: "collectionId"');
    }
    if (typeof documentId === "undefined") {
      throw new AppwriteException('Missing required parameter: "documentId"');
    }
    if (typeof attribute === "undefined") {
      throw new AppwriteException('Missing required parameter: "attribute"');
    }
    const apiPath = "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}/{attribute}/decrement".replace("{databaseId}", encodeURIComponent(String(databaseId))).replace("{collectionId}", encodeURIComponent(String(collectionId))).replace("{documentId}", encodeURIComponent(String(documentId))).replace("{attribute}", encodeURIComponent(String(attribute)));
    const payload = {};
    if (typeof value !== "undefined") {
      payload["value"] = value;
    }
    if (typeof min !== "undefined") {
      payload["min"] = min;
    }
    if (typeof transactionId !== "undefined") {
      payload["transactionId"] = transactionId;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("patch", uri, apiHeaders, payload);
  }
  incrementDocumentAttribute(paramsOrFirst, ...rest) {
    let params;
    if (paramsOrFirst && typeof paramsOrFirst === "object" && !Array.isArray(paramsOrFirst)) {
      params = paramsOrFirst || {};
    } else {
      params = {
        databaseId: paramsOrFirst,
        collectionId: rest[0],
        documentId: rest[1],
        attribute: rest[2],
        value: rest[3],
        max: rest[4],
        transactionId: rest[5]
      };
    }
    const databaseId = params.databaseId;
    const collectionId = params.collectionId;
    const documentId = params.documentId;
    const attribute = params.attribute;
    const value = params.value;
    const max = params.max;
    const transactionId = params.transactionId;
    if (typeof databaseId === "undefined") {
      throw new AppwriteException('Missing required parameter: "databaseId"');
    }
    if (typeof collectionId === "undefined") {
      throw new AppwriteException('Missing required parameter: "collectionId"');
    }
    if (typeof documentId === "undefined") {
      throw new AppwriteException('Missing required parameter: "documentId"');
    }
    if (typeof attribute === "undefined") {
      throw new AppwriteException('Missing required parameter: "attribute"');
    }
    const apiPath = "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}/{attribute}/increment".replace("{databaseId}", encodeURIComponent(String(databaseId))).replace("{collectionId}", encodeURIComponent(String(collectionId))).replace("{documentId}", encodeURIComponent(String(documentId))).replace("{attribute}", encodeURIComponent(String(attribute)));
    const payload = {};
    if (typeof value !== "undefined") {
      payload["value"] = value;
    }
    if (typeof max !== "undefined") {
      payload["max"] = max;
    }
    if (typeof transactionId !== "undefined") {
      payload["transactionId"] = transactionId;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    const apiHeaders = {
      "X-Appwrite-Project": this.client.config.project,
      "content-type": "application/json",
      "accept": "application/json"
    };
    return this.client.call("patch", uri, apiHeaders, payload);
  }
};
var RealtimeCode;
(function(RealtimeCode2) {
  RealtimeCode2[RealtimeCode2["NORMAL_CLOSURE"] = 1e3] = "NORMAL_CLOSURE";
  RealtimeCode2[RealtimeCode2["POLICY_VIOLATION"] = 1008] = "POLICY_VIOLATION";
  RealtimeCode2[RealtimeCode2["UNKNOWN_ERROR"] = -1] = "UNKNOWN_ERROR";
})(RealtimeCode || (RealtimeCode = {}));
var Permission = class {
  static {
    __name(this, "Permission");
  }
};
Permission.read = (role) => {
  return `read("${role}")`;
};
Permission.write = (role) => {
  return `write("${role}")`;
};
Permission.create = (role) => {
  return `create("${role}")`;
};
Permission.update = (role) => {
  return `update("${role}")`;
};
Permission.delete = (role) => {
  return `delete("${role}")`;
};
var Condition;
(function(Condition2) {
  Condition2["Equal"] = "equal";
  Condition2["NotEqual"] = "notEqual";
  Condition2["GreaterThan"] = "greaterThan";
  Condition2["GreaterThanEqual"] = "greaterThanEqual";
  Condition2["LessThan"] = "lessThan";
  Condition2["LessThanEqual"] = "lessThanEqual";
  Condition2["Contains"] = "contains";
  Condition2["IsNull"] = "isNull";
  Condition2["IsNotNull"] = "isNotNull";
})(Condition || (Condition = {}));
var Operator = class {
  static {
    __name(this, "Operator");
  }
  /**
   * Constructor for Operator class.
   *
   * @param {string} method
   * @param {OperatorValues} values
   */
  constructor(method, values) {
    this.method = method;
    if (values !== void 0) {
      if (Array.isArray(values)) {
        this.values = values;
      } else {
        this.values = [values];
      }
    }
  }
  /**
   * Convert the operator object to a JSON string.
   *
   * @returns {string}
   */
  toString() {
    return JSON.stringify({
      method: this.method,
      values: this.values
    });
  }
};
Operator.increment = (value = 1, max) => {
  if (isNaN(value) || !isFinite(value)) {
    throw new Error("Value cannot be NaN or Infinity");
  }
  if (max !== void 0 && (isNaN(max) || !isFinite(max))) {
    throw new Error("Max cannot be NaN or Infinity");
  }
  const values = [value];
  if (max !== void 0) {
    values.push(max);
  }
  return new Operator("increment", values).toString();
};
Operator.decrement = (value = 1, min) => {
  if (isNaN(value) || !isFinite(value)) {
    throw new Error("Value cannot be NaN or Infinity");
  }
  if (min !== void 0 && (isNaN(min) || !isFinite(min))) {
    throw new Error("Min cannot be NaN or Infinity");
  }
  const values = [value];
  if (min !== void 0) {
    values.push(min);
  }
  return new Operator("decrement", values).toString();
};
Operator.multiply = (factor, max) => {
  if (isNaN(factor) || !isFinite(factor)) {
    throw new Error("Factor cannot be NaN or Infinity");
  }
  if (max !== void 0 && (isNaN(max) || !isFinite(max))) {
    throw new Error("Max cannot be NaN or Infinity");
  }
  const values = [factor];
  if (max !== void 0) {
    values.push(max);
  }
  return new Operator("multiply", values).toString();
};
Operator.divide = (divisor, min) => {
  if (isNaN(divisor) || !isFinite(divisor)) {
    throw new Error("Divisor cannot be NaN or Infinity");
  }
  if (min !== void 0 && (isNaN(min) || !isFinite(min))) {
    throw new Error("Min cannot be NaN or Infinity");
  }
  if (divisor === 0) {
    throw new Error("Divisor cannot be zero");
  }
  const values = [divisor];
  if (min !== void 0) {
    values.push(min);
  }
  return new Operator("divide", values).toString();
};
Operator.modulo = (divisor) => {
  if (isNaN(divisor) || !isFinite(divisor)) {
    throw new Error("Divisor cannot be NaN or Infinity");
  }
  if (divisor === 0) {
    throw new Error("Divisor cannot be zero");
  }
  return new Operator("modulo", [divisor]).toString();
};
Operator.power = (exponent, max) => {
  if (isNaN(exponent) || !isFinite(exponent)) {
    throw new Error("Exponent cannot be NaN or Infinity");
  }
  if (max !== void 0 && (isNaN(max) || !isFinite(max))) {
    throw new Error("Max cannot be NaN or Infinity");
  }
  const values = [exponent];
  if (max !== void 0) {
    values.push(max);
  }
  return new Operator("power", values).toString();
};
Operator.arrayAppend = (values) => new Operator("arrayAppend", values).toString();
Operator.arrayPrepend = (values) => new Operator("arrayPrepend", values).toString();
Operator.arrayInsert = (index, value) => new Operator("arrayInsert", [index, value]).toString();
Operator.arrayRemove = (value) => new Operator("arrayRemove", [value]).toString();
Operator.arrayUnique = () => new Operator("arrayUnique", []).toString();
Operator.arrayIntersect = (values) => new Operator("arrayIntersect", values).toString();
Operator.arrayDiff = (values) => new Operator("arrayDiff", values).toString();
Operator.arrayFilter = (condition, value) => {
  const values = [condition, value === void 0 ? null : value];
  return new Operator("arrayFilter", values).toString();
};
Operator.stringConcat = (value) => new Operator("stringConcat", [value]).toString();
Operator.stringReplace = (search, replace) => new Operator("stringReplace", [search, replace]).toString();
Operator.toggle = () => new Operator("toggle", []).toString();
Operator.dateAddDays = (days) => new Operator("dateAddDays", [days]).toString();
Operator.dateSubDays = (days) => new Operator("dateSubDays", [days]).toString();
Operator.dateSetNow = () => new Operator("dateSetNow", []).toString();
var AuthenticatorType;
(function(AuthenticatorType2) {
  AuthenticatorType2["Totp"] = "totp";
})(AuthenticatorType || (AuthenticatorType = {}));
var AuthenticationFactor;
(function(AuthenticationFactor2) {
  AuthenticationFactor2["Email"] = "email";
  AuthenticationFactor2["Phone"] = "phone";
  AuthenticationFactor2["Totp"] = "totp";
  AuthenticationFactor2["Recoverycode"] = "recoverycode";
})(AuthenticationFactor || (AuthenticationFactor = {}));
var OAuthProvider;
(function(OAuthProvider2) {
  OAuthProvider2["Amazon"] = "amazon";
  OAuthProvider2["Apple"] = "apple";
  OAuthProvider2["Appwrite"] = "appwrite";
  OAuthProvider2["Auth0"] = "auth0";
  OAuthProvider2["Authentik"] = "authentik";
  OAuthProvider2["Autodesk"] = "autodesk";
  OAuthProvider2["Bitbucket"] = "bitbucket";
  OAuthProvider2["Bitly"] = "bitly";
  OAuthProvider2["Box"] = "box";
  OAuthProvider2["Dailymotion"] = "dailymotion";
  OAuthProvider2["Discord"] = "discord";
  OAuthProvider2["Disqus"] = "disqus";
  OAuthProvider2["Dropbox"] = "dropbox";
  OAuthProvider2["Etsy"] = "etsy";
  OAuthProvider2["Facebook"] = "facebook";
  OAuthProvider2["Figma"] = "figma";
  OAuthProvider2["Fusionauth"] = "fusionauth";
  OAuthProvider2["Github"] = "github";
  OAuthProvider2["Gitlab"] = "gitlab";
  OAuthProvider2["Google"] = "google";
  OAuthProvider2["Keycloak"] = "keycloak";
  OAuthProvider2["Kick"] = "kick";
  OAuthProvider2["Linkedin"] = "linkedin";
  OAuthProvider2["Microsoft"] = "microsoft";
  OAuthProvider2["Notion"] = "notion";
  OAuthProvider2["Oidc"] = "oidc";
  OAuthProvider2["Okta"] = "okta";
  OAuthProvider2["Paypal"] = "paypal";
  OAuthProvider2["PaypalSandbox"] = "paypalSandbox";
  OAuthProvider2["Podio"] = "podio";
  OAuthProvider2["Salesforce"] = "salesforce";
  OAuthProvider2["Slack"] = "slack";
  OAuthProvider2["Spotify"] = "spotify";
  OAuthProvider2["Stripe"] = "stripe";
  OAuthProvider2["Tradeshift"] = "tradeshift";
  OAuthProvider2["TradeshiftBox"] = "tradeshiftBox";
  OAuthProvider2["Twitch"] = "twitch";
  OAuthProvider2["Wordpress"] = "wordpress";
  OAuthProvider2["X"] = "x";
  OAuthProvider2["Yahoo"] = "yahoo";
  OAuthProvider2["Yammer"] = "yammer";
  OAuthProvider2["Yandex"] = "yandex";
  OAuthProvider2["Zoho"] = "zoho";
  OAuthProvider2["Zoom"] = "zoom";
})(OAuthProvider || (OAuthProvider = {}));
var Browser;
(function(Browser2) {
  Browser2["AvantBrowser"] = "aa";
  Browser2["AndroidWebViewBeta"] = "an";
  Browser2["GoogleChrome"] = "ch";
  Browser2["GoogleChromeIOS"] = "ci";
  Browser2["GoogleChromeMobile"] = "cm";
  Browser2["Chromium"] = "cr";
  Browser2["MozillaFirefox"] = "ff";
  Browser2["Safari"] = "sf";
  Browser2["MobileSafari"] = "mf";
  Browser2["MicrosoftEdge"] = "ps";
  Browser2["MicrosoftEdgeIOS"] = "oi";
  Browser2["OperaMini"] = "om";
  Browser2["Opera"] = "op";
  Browser2["OperaNext"] = "on";
})(Browser || (Browser = {}));
var CreditCard;
(function(CreditCard2) {
  CreditCard2["AmericanExpress"] = "amex";
  CreditCard2["Argencard"] = "argencard";
  CreditCard2["Cabal"] = "cabal";
  CreditCard2["Cencosud"] = "cencosud";
  CreditCard2["DinersClub"] = "diners";
  CreditCard2["Discover"] = "discover";
  CreditCard2["Elo"] = "elo";
  CreditCard2["Hipercard"] = "hipercard";
  CreditCard2["JCB"] = "jcb";
  CreditCard2["Mastercard"] = "mastercard";
  CreditCard2["Naranja"] = "naranja";
  CreditCard2["TarjetaShopping"] = "targeta-shopping";
  CreditCard2["UnionPay"] = "unionpay";
  CreditCard2["Visa"] = "visa";
  CreditCard2["MIR"] = "mir";
  CreditCard2["Maestro"] = "maestro";
  CreditCard2["Rupay"] = "rupay";
})(CreditCard || (CreditCard = {}));
var Flag;
(function(Flag2) {
  Flag2["Afghanistan"] = "af";
  Flag2["Angola"] = "ao";
  Flag2["Albania"] = "al";
  Flag2["Andorra"] = "ad";
  Flag2["UnitedArabEmirates"] = "ae";
  Flag2["Argentina"] = "ar";
  Flag2["Armenia"] = "am";
  Flag2["AntiguaAndBarbuda"] = "ag";
  Flag2["Australia"] = "au";
  Flag2["Austria"] = "at";
  Flag2["Azerbaijan"] = "az";
  Flag2["Burundi"] = "bi";
  Flag2["Belgium"] = "be";
  Flag2["Benin"] = "bj";
  Flag2["BurkinaFaso"] = "bf";
  Flag2["Bangladesh"] = "bd";
  Flag2["Bulgaria"] = "bg";
  Flag2["Bahrain"] = "bh";
  Flag2["Bahamas"] = "bs";
  Flag2["BosniaAndHerzegovina"] = "ba";
  Flag2["Belarus"] = "by";
  Flag2["Belize"] = "bz";
  Flag2["Bolivia"] = "bo";
  Flag2["Brazil"] = "br";
  Flag2["Barbados"] = "bb";
  Flag2["BruneiDarussalam"] = "bn";
  Flag2["Bhutan"] = "bt";
  Flag2["Botswana"] = "bw";
  Flag2["CentralAfricanRepublic"] = "cf";
  Flag2["Canada"] = "ca";
  Flag2["Switzerland"] = "ch";
  Flag2["Chile"] = "cl";
  Flag2["China"] = "cn";
  Flag2["CoteDIvoire"] = "ci";
  Flag2["Cameroon"] = "cm";
  Flag2["DemocraticRepublicOfTheCongo"] = "cd";
  Flag2["RepublicOfTheCongo"] = "cg";
  Flag2["Colombia"] = "co";
  Flag2["Comoros"] = "km";
  Flag2["CapeVerde"] = "cv";
  Flag2["CostaRica"] = "cr";
  Flag2["Cuba"] = "cu";
  Flag2["Cyprus"] = "cy";
  Flag2["CzechRepublic"] = "cz";
  Flag2["Germany"] = "de";
  Flag2["Djibouti"] = "dj";
  Flag2["Dominica"] = "dm";
  Flag2["Denmark"] = "dk";
  Flag2["DominicanRepublic"] = "do";
  Flag2["Algeria"] = "dz";
  Flag2["Ecuador"] = "ec";
  Flag2["Egypt"] = "eg";
  Flag2["Eritrea"] = "er";
  Flag2["Spain"] = "es";
  Flag2["Estonia"] = "ee";
  Flag2["Ethiopia"] = "et";
  Flag2["Finland"] = "fi";
  Flag2["Fiji"] = "fj";
  Flag2["France"] = "fr";
  Flag2["MicronesiaFederatedStatesOf"] = "fm";
  Flag2["Gabon"] = "ga";
  Flag2["UnitedKingdom"] = "gb";
  Flag2["Georgia"] = "ge";
  Flag2["Ghana"] = "gh";
  Flag2["Guinea"] = "gn";
  Flag2["Gambia"] = "gm";
  Flag2["GuineaBissau"] = "gw";
  Flag2["EquatorialGuinea"] = "gq";
  Flag2["Greece"] = "gr";
  Flag2["Grenada"] = "gd";
  Flag2["Guatemala"] = "gt";
  Flag2["Guyana"] = "gy";
  Flag2["Honduras"] = "hn";
  Flag2["Croatia"] = "hr";
  Flag2["Haiti"] = "ht";
  Flag2["Hungary"] = "hu";
  Flag2["Indonesia"] = "id";
  Flag2["India"] = "in";
  Flag2["Ireland"] = "ie";
  Flag2["IranIslamicRepublicOf"] = "ir";
  Flag2["Iraq"] = "iq";
  Flag2["Iceland"] = "is";
  Flag2["Israel"] = "il";
  Flag2["Italy"] = "it";
  Flag2["Jamaica"] = "jm";
  Flag2["Jordan"] = "jo";
  Flag2["Japan"] = "jp";
  Flag2["Kazakhstan"] = "kz";
  Flag2["Kenya"] = "ke";
  Flag2["Kyrgyzstan"] = "kg";
  Flag2["Cambodia"] = "kh";
  Flag2["Kiribati"] = "ki";
  Flag2["SaintKittsAndNevis"] = "kn";
  Flag2["SouthKorea"] = "kr";
  Flag2["Kuwait"] = "kw";
  Flag2["LaoPeopleSDemocraticRepublic"] = "la";
  Flag2["Lebanon"] = "lb";
  Flag2["Liberia"] = "lr";
  Flag2["Libya"] = "ly";
  Flag2["SaintLucia"] = "lc";
  Flag2["Liechtenstein"] = "li";
  Flag2["SriLanka"] = "lk";
  Flag2["Lesotho"] = "ls";
  Flag2["Lithuania"] = "lt";
  Flag2["Luxembourg"] = "lu";
  Flag2["Latvia"] = "lv";
  Flag2["Morocco"] = "ma";
  Flag2["Monaco"] = "mc";
  Flag2["Moldova"] = "md";
  Flag2["Madagascar"] = "mg";
  Flag2["Maldives"] = "mv";
  Flag2["Mexico"] = "mx";
  Flag2["MarshallIslands"] = "mh";
  Flag2["NorthMacedonia"] = "mk";
  Flag2["Mali"] = "ml";
  Flag2["Malta"] = "mt";
  Flag2["Myanmar"] = "mm";
  Flag2["Montenegro"] = "me";
  Flag2["Mongolia"] = "mn";
  Flag2["Mozambique"] = "mz";
  Flag2["Mauritania"] = "mr";
  Flag2["Mauritius"] = "mu";
  Flag2["Malawi"] = "mw";
  Flag2["Malaysia"] = "my";
  Flag2["Namibia"] = "na";
  Flag2["Niger"] = "ne";
  Flag2["Nigeria"] = "ng";
  Flag2["Nicaragua"] = "ni";
  Flag2["Netherlands"] = "nl";
  Flag2["Norway"] = "no";
  Flag2["Nepal"] = "np";
  Flag2["Nauru"] = "nr";
  Flag2["NewZealand"] = "nz";
  Flag2["Oman"] = "om";
  Flag2["Pakistan"] = "pk";
  Flag2["Panama"] = "pa";
  Flag2["Peru"] = "pe";
  Flag2["Philippines"] = "ph";
  Flag2["Palau"] = "pw";
  Flag2["PapuaNewGuinea"] = "pg";
  Flag2["Poland"] = "pl";
  Flag2["FrenchPolynesia"] = "pf";
  Flag2["NorthKorea"] = "kp";
  Flag2["Portugal"] = "pt";
  Flag2["Paraguay"] = "py";
  Flag2["Qatar"] = "qa";
  Flag2["Romania"] = "ro";
  Flag2["Russia"] = "ru";
  Flag2["Rwanda"] = "rw";
  Flag2["SaudiArabia"] = "sa";
  Flag2["Sudan"] = "sd";
  Flag2["Senegal"] = "sn";
  Flag2["Singapore"] = "sg";
  Flag2["SolomonIslands"] = "sb";
  Flag2["SierraLeone"] = "sl";
  Flag2["ElSalvador"] = "sv";
  Flag2["SanMarino"] = "sm";
  Flag2["Somalia"] = "so";
  Flag2["Serbia"] = "rs";
  Flag2["SouthSudan"] = "ss";
  Flag2["SaoTomeAndPrincipe"] = "st";
  Flag2["Suriname"] = "sr";
  Flag2["Slovakia"] = "sk";
  Flag2["Slovenia"] = "si";
  Flag2["Sweden"] = "se";
  Flag2["Eswatini"] = "sz";
  Flag2["Seychelles"] = "sc";
  Flag2["Syria"] = "sy";
  Flag2["Chad"] = "td";
  Flag2["Togo"] = "tg";
  Flag2["Thailand"] = "th";
  Flag2["Tajikistan"] = "tj";
  Flag2["Turkmenistan"] = "tm";
  Flag2["TimorLeste"] = "tl";
  Flag2["Tonga"] = "to";
  Flag2["TrinidadAndTobago"] = "tt";
  Flag2["Tunisia"] = "tn";
  Flag2["Turkey"] = "tr";
  Flag2["Tuvalu"] = "tv";
  Flag2["Tanzania"] = "tz";
  Flag2["Uganda"] = "ug";
  Flag2["Ukraine"] = "ua";
  Flag2["Uruguay"] = "uy";
  Flag2["UnitedStates"] = "us";
  Flag2["Uzbekistan"] = "uz";
  Flag2["VaticanCity"] = "va";
  Flag2["SaintVincentAndTheGrenadines"] = "vc";
  Flag2["Venezuela"] = "ve";
  Flag2["Vietnam"] = "vn";
  Flag2["Vanuatu"] = "vu";
  Flag2["Samoa"] = "ws";
  Flag2["Yemen"] = "ye";
  Flag2["SouthAfrica"] = "za";
  Flag2["Zambia"] = "zm";
  Flag2["Zimbabwe"] = "zw";
})(Flag || (Flag = {}));
var BrowserTheme;
(function(BrowserTheme2) {
  BrowserTheme2["Light"] = "light";
  BrowserTheme2["Dark"] = "dark";
})(BrowserTheme || (BrowserTheme = {}));
var Timezone;
(function(Timezone2) {
  Timezone2["AfricaAbidjan"] = "africa/abidjan";
  Timezone2["AfricaAccra"] = "africa/accra";
  Timezone2["AfricaAddisAbaba"] = "africa/addis_ababa";
  Timezone2["AfricaAlgiers"] = "africa/algiers";
  Timezone2["AfricaAsmara"] = "africa/asmara";
  Timezone2["AfricaBamako"] = "africa/bamako";
  Timezone2["AfricaBangui"] = "africa/bangui";
  Timezone2["AfricaBanjul"] = "africa/banjul";
  Timezone2["AfricaBissau"] = "africa/bissau";
  Timezone2["AfricaBlantyre"] = "africa/blantyre";
  Timezone2["AfricaBrazzaville"] = "africa/brazzaville";
  Timezone2["AfricaBujumbura"] = "africa/bujumbura";
  Timezone2["AfricaCairo"] = "africa/cairo";
  Timezone2["AfricaCasablanca"] = "africa/casablanca";
  Timezone2["AfricaCeuta"] = "africa/ceuta";
  Timezone2["AfricaConakry"] = "africa/conakry";
  Timezone2["AfricaDakar"] = "africa/dakar";
  Timezone2["AfricaDarEsSalaam"] = "africa/dar_es_salaam";
  Timezone2["AfricaDjibouti"] = "africa/djibouti";
  Timezone2["AfricaDouala"] = "africa/douala";
  Timezone2["AfricaElAaiun"] = "africa/el_aaiun";
  Timezone2["AfricaFreetown"] = "africa/freetown";
  Timezone2["AfricaGaborone"] = "africa/gaborone";
  Timezone2["AfricaHarare"] = "africa/harare";
  Timezone2["AfricaJohannesburg"] = "africa/johannesburg";
  Timezone2["AfricaJuba"] = "africa/juba";
  Timezone2["AfricaKampala"] = "africa/kampala";
  Timezone2["AfricaKhartoum"] = "africa/khartoum";
  Timezone2["AfricaKigali"] = "africa/kigali";
  Timezone2["AfricaKinshasa"] = "africa/kinshasa";
  Timezone2["AfricaLagos"] = "africa/lagos";
  Timezone2["AfricaLibreville"] = "africa/libreville";
  Timezone2["AfricaLome"] = "africa/lome";
  Timezone2["AfricaLuanda"] = "africa/luanda";
  Timezone2["AfricaLubumbashi"] = "africa/lubumbashi";
  Timezone2["AfricaLusaka"] = "africa/lusaka";
  Timezone2["AfricaMalabo"] = "africa/malabo";
  Timezone2["AfricaMaputo"] = "africa/maputo";
  Timezone2["AfricaMaseru"] = "africa/maseru";
  Timezone2["AfricaMbabane"] = "africa/mbabane";
  Timezone2["AfricaMogadishu"] = "africa/mogadishu";
  Timezone2["AfricaMonrovia"] = "africa/monrovia";
  Timezone2["AfricaNairobi"] = "africa/nairobi";
  Timezone2["AfricaNdjamena"] = "africa/ndjamena";
  Timezone2["AfricaNiamey"] = "africa/niamey";
  Timezone2["AfricaNouakchott"] = "africa/nouakchott";
  Timezone2["AfricaOuagadougou"] = "africa/ouagadougou";
  Timezone2["AfricaPortonovo"] = "africa/porto-novo";
  Timezone2["AfricaSaoTome"] = "africa/sao_tome";
  Timezone2["AfricaTripoli"] = "africa/tripoli";
  Timezone2["AfricaTunis"] = "africa/tunis";
  Timezone2["AfricaWindhoek"] = "africa/windhoek";
  Timezone2["AmericaAdak"] = "america/adak";
  Timezone2["AmericaAnchorage"] = "america/anchorage";
  Timezone2["AmericaAnguilla"] = "america/anguilla";
  Timezone2["AmericaAntigua"] = "america/antigua";
  Timezone2["AmericaAraguaina"] = "america/araguaina";
  Timezone2["AmericaArgentinaBuenosAires"] = "america/argentina/buenos_aires";
  Timezone2["AmericaArgentinaCatamarca"] = "america/argentina/catamarca";
  Timezone2["AmericaArgentinaCordoba"] = "america/argentina/cordoba";
  Timezone2["AmericaArgentinaJujuy"] = "america/argentina/jujuy";
  Timezone2["AmericaArgentinaLaRioja"] = "america/argentina/la_rioja";
  Timezone2["AmericaArgentinaMendoza"] = "america/argentina/mendoza";
  Timezone2["AmericaArgentinaRioGallegos"] = "america/argentina/rio_gallegos";
  Timezone2["AmericaArgentinaSalta"] = "america/argentina/salta";
  Timezone2["AmericaArgentinaSanJuan"] = "america/argentina/san_juan";
  Timezone2["AmericaArgentinaSanLuis"] = "america/argentina/san_luis";
  Timezone2["AmericaArgentinaTucuman"] = "america/argentina/tucuman";
  Timezone2["AmericaArgentinaUshuaia"] = "america/argentina/ushuaia";
  Timezone2["AmericaAruba"] = "america/aruba";
  Timezone2["AmericaAsuncion"] = "america/asuncion";
  Timezone2["AmericaAtikokan"] = "america/atikokan";
  Timezone2["AmericaBahia"] = "america/bahia";
  Timezone2["AmericaBahiaBanderas"] = "america/bahia_banderas";
  Timezone2["AmericaBarbados"] = "america/barbados";
  Timezone2["AmericaBelem"] = "america/belem";
  Timezone2["AmericaBelize"] = "america/belize";
  Timezone2["AmericaBlancsablon"] = "america/blanc-sablon";
  Timezone2["AmericaBoaVista"] = "america/boa_vista";
  Timezone2["AmericaBogota"] = "america/bogota";
  Timezone2["AmericaBoise"] = "america/boise";
  Timezone2["AmericaCambridgeBay"] = "america/cambridge_bay";
  Timezone2["AmericaCampoGrande"] = "america/campo_grande";
  Timezone2["AmericaCancun"] = "america/cancun";
  Timezone2["AmericaCaracas"] = "america/caracas";
  Timezone2["AmericaCayenne"] = "america/cayenne";
  Timezone2["AmericaCayman"] = "america/cayman";
  Timezone2["AmericaChicago"] = "america/chicago";
  Timezone2["AmericaChihuahua"] = "america/chihuahua";
  Timezone2["AmericaCiudadJuarez"] = "america/ciudad_juarez";
  Timezone2["AmericaCostaRica"] = "america/costa_rica";
  Timezone2["AmericaCoyhaique"] = "america/coyhaique";
  Timezone2["AmericaCreston"] = "america/creston";
  Timezone2["AmericaCuiaba"] = "america/cuiaba";
  Timezone2["AmericaCuracao"] = "america/curacao";
  Timezone2["AmericaDanmarkshavn"] = "america/danmarkshavn";
  Timezone2["AmericaDawson"] = "america/dawson";
  Timezone2["AmericaDawsonCreek"] = "america/dawson_creek";
  Timezone2["AmericaDenver"] = "america/denver";
  Timezone2["AmericaDetroit"] = "america/detroit";
  Timezone2["AmericaDominica"] = "america/dominica";
  Timezone2["AmericaEdmonton"] = "america/edmonton";
  Timezone2["AmericaEirunepe"] = "america/eirunepe";
  Timezone2["AmericaElSalvador"] = "america/el_salvador";
  Timezone2["AmericaFortNelson"] = "america/fort_nelson";
  Timezone2["AmericaFortaleza"] = "america/fortaleza";
  Timezone2["AmericaGlaceBay"] = "america/glace_bay";
  Timezone2["AmericaGooseBay"] = "america/goose_bay";
  Timezone2["AmericaGrandTurk"] = "america/grand_turk";
  Timezone2["AmericaGrenada"] = "america/grenada";
  Timezone2["AmericaGuadeloupe"] = "america/guadeloupe";
  Timezone2["AmericaGuatemala"] = "america/guatemala";
  Timezone2["AmericaGuayaquil"] = "america/guayaquil";
  Timezone2["AmericaGuyana"] = "america/guyana";
  Timezone2["AmericaHalifax"] = "america/halifax";
  Timezone2["AmericaHavana"] = "america/havana";
  Timezone2["AmericaHermosillo"] = "america/hermosillo";
  Timezone2["AmericaIndianaIndianapolis"] = "america/indiana/indianapolis";
  Timezone2["AmericaIndianaKnox"] = "america/indiana/knox";
  Timezone2["AmericaIndianaMarengo"] = "america/indiana/marengo";
  Timezone2["AmericaIndianaPetersburg"] = "america/indiana/petersburg";
  Timezone2["AmericaIndianaTellCity"] = "america/indiana/tell_city";
  Timezone2["AmericaIndianaVevay"] = "america/indiana/vevay";
  Timezone2["AmericaIndianaVincennes"] = "america/indiana/vincennes";
  Timezone2["AmericaIndianaWinamac"] = "america/indiana/winamac";
  Timezone2["AmericaInuvik"] = "america/inuvik";
  Timezone2["AmericaIqaluit"] = "america/iqaluit";
  Timezone2["AmericaJamaica"] = "america/jamaica";
  Timezone2["AmericaJuneau"] = "america/juneau";
  Timezone2["AmericaKentuckyLouisville"] = "america/kentucky/louisville";
  Timezone2["AmericaKentuckyMonticello"] = "america/kentucky/monticello";
  Timezone2["AmericaKralendijk"] = "america/kralendijk";
  Timezone2["AmericaLaPaz"] = "america/la_paz";
  Timezone2["AmericaLima"] = "america/lima";
  Timezone2["AmericaLosAngeles"] = "america/los_angeles";
  Timezone2["AmericaLowerPrinces"] = "america/lower_princes";
  Timezone2["AmericaMaceio"] = "america/maceio";
  Timezone2["AmericaManagua"] = "america/managua";
  Timezone2["AmericaManaus"] = "america/manaus";
  Timezone2["AmericaMarigot"] = "america/marigot";
  Timezone2["AmericaMartinique"] = "america/martinique";
  Timezone2["AmericaMatamoros"] = "america/matamoros";
  Timezone2["AmericaMazatlan"] = "america/mazatlan";
  Timezone2["AmericaMenominee"] = "america/menominee";
  Timezone2["AmericaMerida"] = "america/merida";
  Timezone2["AmericaMetlakatla"] = "america/metlakatla";
  Timezone2["AmericaMexicoCity"] = "america/mexico_city";
  Timezone2["AmericaMiquelon"] = "america/miquelon";
  Timezone2["AmericaMoncton"] = "america/moncton";
  Timezone2["AmericaMonterrey"] = "america/monterrey";
  Timezone2["AmericaMontevideo"] = "america/montevideo";
  Timezone2["AmericaMontserrat"] = "america/montserrat";
  Timezone2["AmericaNassau"] = "america/nassau";
  Timezone2["AmericaNewYork"] = "america/new_york";
  Timezone2["AmericaNome"] = "america/nome";
  Timezone2["AmericaNoronha"] = "america/noronha";
  Timezone2["AmericaNorthDakotaBeulah"] = "america/north_dakota/beulah";
  Timezone2["AmericaNorthDakotaCenter"] = "america/north_dakota/center";
  Timezone2["AmericaNorthDakotaNewSalem"] = "america/north_dakota/new_salem";
  Timezone2["AmericaNuuk"] = "america/nuuk";
  Timezone2["AmericaOjinaga"] = "america/ojinaga";
  Timezone2["AmericaPanama"] = "america/panama";
  Timezone2["AmericaParamaribo"] = "america/paramaribo";
  Timezone2["AmericaPhoenix"] = "america/phoenix";
  Timezone2["AmericaPortauprince"] = "america/port-au-prince";
  Timezone2["AmericaPortOfSpain"] = "america/port_of_spain";
  Timezone2["AmericaPortoVelho"] = "america/porto_velho";
  Timezone2["AmericaPuertoRico"] = "america/puerto_rico";
  Timezone2["AmericaPuntaArenas"] = "america/punta_arenas";
  Timezone2["AmericaRankinInlet"] = "america/rankin_inlet";
  Timezone2["AmericaRecife"] = "america/recife";
  Timezone2["AmericaRegina"] = "america/regina";
  Timezone2["AmericaResolute"] = "america/resolute";
  Timezone2["AmericaRioBranco"] = "america/rio_branco";
  Timezone2["AmericaSantarem"] = "america/santarem";
  Timezone2["AmericaSantiago"] = "america/santiago";
  Timezone2["AmericaSantoDomingo"] = "america/santo_domingo";
  Timezone2["AmericaSaoPaulo"] = "america/sao_paulo";
  Timezone2["AmericaScoresbysund"] = "america/scoresbysund";
  Timezone2["AmericaSitka"] = "america/sitka";
  Timezone2["AmericaStBarthelemy"] = "america/st_barthelemy";
  Timezone2["AmericaStJohns"] = "america/st_johns";
  Timezone2["AmericaStKitts"] = "america/st_kitts";
  Timezone2["AmericaStLucia"] = "america/st_lucia";
  Timezone2["AmericaStThomas"] = "america/st_thomas";
  Timezone2["AmericaStVincent"] = "america/st_vincent";
  Timezone2["AmericaSwiftCurrent"] = "america/swift_current";
  Timezone2["AmericaTegucigalpa"] = "america/tegucigalpa";
  Timezone2["AmericaThule"] = "america/thule";
  Timezone2["AmericaTijuana"] = "america/tijuana";
  Timezone2["AmericaToronto"] = "america/toronto";
  Timezone2["AmericaTortola"] = "america/tortola";
  Timezone2["AmericaVancouver"] = "america/vancouver";
  Timezone2["AmericaWhitehorse"] = "america/whitehorse";
  Timezone2["AmericaWinnipeg"] = "america/winnipeg";
  Timezone2["AmericaYakutat"] = "america/yakutat";
  Timezone2["AntarcticaCasey"] = "antarctica/casey";
  Timezone2["AntarcticaDavis"] = "antarctica/davis";
  Timezone2["AntarcticaDumontdurville"] = "antarctica/dumontdurville";
  Timezone2["AntarcticaMacquarie"] = "antarctica/macquarie";
  Timezone2["AntarcticaMawson"] = "antarctica/mawson";
  Timezone2["AntarcticaMcmurdo"] = "antarctica/mcmurdo";
  Timezone2["AntarcticaPalmer"] = "antarctica/palmer";
  Timezone2["AntarcticaRothera"] = "antarctica/rothera";
  Timezone2["AntarcticaSyowa"] = "antarctica/syowa";
  Timezone2["AntarcticaTroll"] = "antarctica/troll";
  Timezone2["AntarcticaVostok"] = "antarctica/vostok";
  Timezone2["ArcticLongyearbyen"] = "arctic/longyearbyen";
  Timezone2["AsiaAden"] = "asia/aden";
  Timezone2["AsiaAlmaty"] = "asia/almaty";
  Timezone2["AsiaAmman"] = "asia/amman";
  Timezone2["AsiaAnadyr"] = "asia/anadyr";
  Timezone2["AsiaAqtau"] = "asia/aqtau";
  Timezone2["AsiaAqtobe"] = "asia/aqtobe";
  Timezone2["AsiaAshgabat"] = "asia/ashgabat";
  Timezone2["AsiaAtyrau"] = "asia/atyrau";
  Timezone2["AsiaBaghdad"] = "asia/baghdad";
  Timezone2["AsiaBahrain"] = "asia/bahrain";
  Timezone2["AsiaBaku"] = "asia/baku";
  Timezone2["AsiaBangkok"] = "asia/bangkok";
  Timezone2["AsiaBarnaul"] = "asia/barnaul";
  Timezone2["AsiaBeirut"] = "asia/beirut";
  Timezone2["AsiaBishkek"] = "asia/bishkek";
  Timezone2["AsiaBrunei"] = "asia/brunei";
  Timezone2["AsiaChita"] = "asia/chita";
  Timezone2["AsiaColombo"] = "asia/colombo";
  Timezone2["AsiaDamascus"] = "asia/damascus";
  Timezone2["AsiaDhaka"] = "asia/dhaka";
  Timezone2["AsiaDili"] = "asia/dili";
  Timezone2["AsiaDubai"] = "asia/dubai";
  Timezone2["AsiaDushanbe"] = "asia/dushanbe";
  Timezone2["AsiaFamagusta"] = "asia/famagusta";
  Timezone2["AsiaGaza"] = "asia/gaza";
  Timezone2["AsiaHebron"] = "asia/hebron";
  Timezone2["AsiaHoChiMinh"] = "asia/ho_chi_minh";
  Timezone2["AsiaHongKong"] = "asia/hong_kong";
  Timezone2["AsiaHovd"] = "asia/hovd";
  Timezone2["AsiaIrkutsk"] = "asia/irkutsk";
  Timezone2["AsiaJakarta"] = "asia/jakarta";
  Timezone2["AsiaJayapura"] = "asia/jayapura";
  Timezone2["AsiaJerusalem"] = "asia/jerusalem";
  Timezone2["AsiaKabul"] = "asia/kabul";
  Timezone2["AsiaKamchatka"] = "asia/kamchatka";
  Timezone2["AsiaKarachi"] = "asia/karachi";
  Timezone2["AsiaKathmandu"] = "asia/kathmandu";
  Timezone2["AsiaKhandyga"] = "asia/khandyga";
  Timezone2["AsiaKolkata"] = "asia/kolkata";
  Timezone2["AsiaKrasnoyarsk"] = "asia/krasnoyarsk";
  Timezone2["AsiaKualaLumpur"] = "asia/kuala_lumpur";
  Timezone2["AsiaKuching"] = "asia/kuching";
  Timezone2["AsiaKuwait"] = "asia/kuwait";
  Timezone2["AsiaMacau"] = "asia/macau";
  Timezone2["AsiaMagadan"] = "asia/magadan";
  Timezone2["AsiaMakassar"] = "asia/makassar";
  Timezone2["AsiaManila"] = "asia/manila";
  Timezone2["AsiaMuscat"] = "asia/muscat";
  Timezone2["AsiaNicosia"] = "asia/nicosia";
  Timezone2["AsiaNovokuznetsk"] = "asia/novokuznetsk";
  Timezone2["AsiaNovosibirsk"] = "asia/novosibirsk";
  Timezone2["AsiaOmsk"] = "asia/omsk";
  Timezone2["AsiaOral"] = "asia/oral";
  Timezone2["AsiaPhnomPenh"] = "asia/phnom_penh";
  Timezone2["AsiaPontianak"] = "asia/pontianak";
  Timezone2["AsiaPyongyang"] = "asia/pyongyang";
  Timezone2["AsiaQatar"] = "asia/qatar";
  Timezone2["AsiaQostanay"] = "asia/qostanay";
  Timezone2["AsiaQyzylorda"] = "asia/qyzylorda";
  Timezone2["AsiaRiyadh"] = "asia/riyadh";
  Timezone2["AsiaSakhalin"] = "asia/sakhalin";
  Timezone2["AsiaSamarkand"] = "asia/samarkand";
  Timezone2["AsiaSeoul"] = "asia/seoul";
  Timezone2["AsiaShanghai"] = "asia/shanghai";
  Timezone2["AsiaSingapore"] = "asia/singapore";
  Timezone2["AsiaSrednekolymsk"] = "asia/srednekolymsk";
  Timezone2["AsiaTaipei"] = "asia/taipei";
  Timezone2["AsiaTashkent"] = "asia/tashkent";
  Timezone2["AsiaTbilisi"] = "asia/tbilisi";
  Timezone2["AsiaTehran"] = "asia/tehran";
  Timezone2["AsiaThimphu"] = "asia/thimphu";
  Timezone2["AsiaTokyo"] = "asia/tokyo";
  Timezone2["AsiaTomsk"] = "asia/tomsk";
  Timezone2["AsiaUlaanbaatar"] = "asia/ulaanbaatar";
  Timezone2["AsiaUrumqi"] = "asia/urumqi";
  Timezone2["AsiaUstnera"] = "asia/ust-nera";
  Timezone2["AsiaVientiane"] = "asia/vientiane";
  Timezone2["AsiaVladivostok"] = "asia/vladivostok";
  Timezone2["AsiaYakutsk"] = "asia/yakutsk";
  Timezone2["AsiaYangon"] = "asia/yangon";
  Timezone2["AsiaYekaterinburg"] = "asia/yekaterinburg";
  Timezone2["AsiaYerevan"] = "asia/yerevan";
  Timezone2["AtlanticAzores"] = "atlantic/azores";
  Timezone2["AtlanticBermuda"] = "atlantic/bermuda";
  Timezone2["AtlanticCanary"] = "atlantic/canary";
  Timezone2["AtlanticCapeVerde"] = "atlantic/cape_verde";
  Timezone2["AtlanticFaroe"] = "atlantic/faroe";
  Timezone2["AtlanticMadeira"] = "atlantic/madeira";
  Timezone2["AtlanticReykjavik"] = "atlantic/reykjavik";
  Timezone2["AtlanticSouthGeorgia"] = "atlantic/south_georgia";
  Timezone2["AtlanticStHelena"] = "atlantic/st_helena";
  Timezone2["AtlanticStanley"] = "atlantic/stanley";
  Timezone2["AustraliaAdelaide"] = "australia/adelaide";
  Timezone2["AustraliaBrisbane"] = "australia/brisbane";
  Timezone2["AustraliaBrokenHill"] = "australia/broken_hill";
  Timezone2["AustraliaDarwin"] = "australia/darwin";
  Timezone2["AustraliaEucla"] = "australia/eucla";
  Timezone2["AustraliaHobart"] = "australia/hobart";
  Timezone2["AustraliaLindeman"] = "australia/lindeman";
  Timezone2["AustraliaLordHowe"] = "australia/lord_howe";
  Timezone2["AustraliaMelbourne"] = "australia/melbourne";
  Timezone2["AustraliaPerth"] = "australia/perth";
  Timezone2["AustraliaSydney"] = "australia/sydney";
  Timezone2["EuropeAmsterdam"] = "europe/amsterdam";
  Timezone2["EuropeAndorra"] = "europe/andorra";
  Timezone2["EuropeAstrakhan"] = "europe/astrakhan";
  Timezone2["EuropeAthens"] = "europe/athens";
  Timezone2["EuropeBelgrade"] = "europe/belgrade";
  Timezone2["EuropeBerlin"] = "europe/berlin";
  Timezone2["EuropeBratislava"] = "europe/bratislava";
  Timezone2["EuropeBrussels"] = "europe/brussels";
  Timezone2["EuropeBucharest"] = "europe/bucharest";
  Timezone2["EuropeBudapest"] = "europe/budapest";
  Timezone2["EuropeBusingen"] = "europe/busingen";
  Timezone2["EuropeChisinau"] = "europe/chisinau";
  Timezone2["EuropeCopenhagen"] = "europe/copenhagen";
  Timezone2["EuropeDublin"] = "europe/dublin";
  Timezone2["EuropeGibraltar"] = "europe/gibraltar";
  Timezone2["EuropeGuernsey"] = "europe/guernsey";
  Timezone2["EuropeHelsinki"] = "europe/helsinki";
  Timezone2["EuropeIsleOfMan"] = "europe/isle_of_man";
  Timezone2["EuropeIstanbul"] = "europe/istanbul";
  Timezone2["EuropeJersey"] = "europe/jersey";
  Timezone2["EuropeKaliningrad"] = "europe/kaliningrad";
  Timezone2["EuropeKirov"] = "europe/kirov";
  Timezone2["EuropeKyiv"] = "europe/kyiv";
  Timezone2["EuropeLisbon"] = "europe/lisbon";
  Timezone2["EuropeLjubljana"] = "europe/ljubljana";
  Timezone2["EuropeLondon"] = "europe/london";
  Timezone2["EuropeLuxembourg"] = "europe/luxembourg";
  Timezone2["EuropeMadrid"] = "europe/madrid";
  Timezone2["EuropeMalta"] = "europe/malta";
  Timezone2["EuropeMariehamn"] = "europe/mariehamn";
  Timezone2["EuropeMinsk"] = "europe/minsk";
  Timezone2["EuropeMonaco"] = "europe/monaco";
  Timezone2["EuropeMoscow"] = "europe/moscow";
  Timezone2["EuropeOslo"] = "europe/oslo";
  Timezone2["EuropeParis"] = "europe/paris";
  Timezone2["EuropePodgorica"] = "europe/podgorica";
  Timezone2["EuropePrague"] = "europe/prague";
  Timezone2["EuropeRiga"] = "europe/riga";
  Timezone2["EuropeRome"] = "europe/rome";
  Timezone2["EuropeSamara"] = "europe/samara";
  Timezone2["EuropeSanMarino"] = "europe/san_marino";
  Timezone2["EuropeSarajevo"] = "europe/sarajevo";
  Timezone2["EuropeSaratov"] = "europe/saratov";
  Timezone2["EuropeSimferopol"] = "europe/simferopol";
  Timezone2["EuropeSkopje"] = "europe/skopje";
  Timezone2["EuropeSofia"] = "europe/sofia";
  Timezone2["EuropeStockholm"] = "europe/stockholm";
  Timezone2["EuropeTallinn"] = "europe/tallinn";
  Timezone2["EuropeTirane"] = "europe/tirane";
  Timezone2["EuropeUlyanovsk"] = "europe/ulyanovsk";
  Timezone2["EuropeVaduz"] = "europe/vaduz";
  Timezone2["EuropeVatican"] = "europe/vatican";
  Timezone2["EuropeVienna"] = "europe/vienna";
  Timezone2["EuropeVilnius"] = "europe/vilnius";
  Timezone2["EuropeVolgograd"] = "europe/volgograd";
  Timezone2["EuropeWarsaw"] = "europe/warsaw";
  Timezone2["EuropeZagreb"] = "europe/zagreb";
  Timezone2["EuropeZurich"] = "europe/zurich";
  Timezone2["IndianAntananarivo"] = "indian/antananarivo";
  Timezone2["IndianChagos"] = "indian/chagos";
  Timezone2["IndianChristmas"] = "indian/christmas";
  Timezone2["IndianCocos"] = "indian/cocos";
  Timezone2["IndianComoro"] = "indian/comoro";
  Timezone2["IndianKerguelen"] = "indian/kerguelen";
  Timezone2["IndianMahe"] = "indian/mahe";
  Timezone2["IndianMaldives"] = "indian/maldives";
  Timezone2["IndianMauritius"] = "indian/mauritius";
  Timezone2["IndianMayotte"] = "indian/mayotte";
  Timezone2["IndianReunion"] = "indian/reunion";
  Timezone2["PacificApia"] = "pacific/apia";
  Timezone2["PacificAuckland"] = "pacific/auckland";
  Timezone2["PacificBougainville"] = "pacific/bougainville";
  Timezone2["PacificChatham"] = "pacific/chatham";
  Timezone2["PacificChuuk"] = "pacific/chuuk";
  Timezone2["PacificEaster"] = "pacific/easter";
  Timezone2["PacificEfate"] = "pacific/efate";
  Timezone2["PacificFakaofo"] = "pacific/fakaofo";
  Timezone2["PacificFiji"] = "pacific/fiji";
  Timezone2["PacificFunafuti"] = "pacific/funafuti";
  Timezone2["PacificGalapagos"] = "pacific/galapagos";
  Timezone2["PacificGambier"] = "pacific/gambier";
  Timezone2["PacificGuadalcanal"] = "pacific/guadalcanal";
  Timezone2["PacificGuam"] = "pacific/guam";
  Timezone2["PacificHonolulu"] = "pacific/honolulu";
  Timezone2["PacificKanton"] = "pacific/kanton";
  Timezone2["PacificKiritimati"] = "pacific/kiritimati";
  Timezone2["PacificKosrae"] = "pacific/kosrae";
  Timezone2["PacificKwajalein"] = "pacific/kwajalein";
  Timezone2["PacificMajuro"] = "pacific/majuro";
  Timezone2["PacificMarquesas"] = "pacific/marquesas";
  Timezone2["PacificMidway"] = "pacific/midway";
  Timezone2["PacificNauru"] = "pacific/nauru";
  Timezone2["PacificNiue"] = "pacific/niue";
  Timezone2["PacificNorfolk"] = "pacific/norfolk";
  Timezone2["PacificNoumea"] = "pacific/noumea";
  Timezone2["PacificPagoPago"] = "pacific/pago_pago";
  Timezone2["PacificPalau"] = "pacific/palau";
  Timezone2["PacificPitcairn"] = "pacific/pitcairn";
  Timezone2["PacificPohnpei"] = "pacific/pohnpei";
  Timezone2["PacificPortMoresby"] = "pacific/port_moresby";
  Timezone2["PacificRarotonga"] = "pacific/rarotonga";
  Timezone2["PacificSaipan"] = "pacific/saipan";
  Timezone2["PacificTahiti"] = "pacific/tahiti";
  Timezone2["PacificTarawa"] = "pacific/tarawa";
  Timezone2["PacificTongatapu"] = "pacific/tongatapu";
  Timezone2["PacificWake"] = "pacific/wake";
  Timezone2["PacificWallis"] = "pacific/wallis";
  Timezone2["Utc"] = "utc";
})(Timezone || (Timezone = {}));
var BrowserPermission;
(function(BrowserPermission2) {
  BrowserPermission2["Geolocation"] = "geolocation";
  BrowserPermission2["Camera"] = "camera";
  BrowserPermission2["Microphone"] = "microphone";
  BrowserPermission2["Notifications"] = "notifications";
  BrowserPermission2["Midi"] = "midi";
  BrowserPermission2["Push"] = "push";
  BrowserPermission2["Clipboardread"] = "clipboard-read";
  BrowserPermission2["Clipboardwrite"] = "clipboard-write";
  BrowserPermission2["Paymenthandler"] = "payment-handler";
  BrowserPermission2["Usb"] = "usb";
  BrowserPermission2["Bluetooth"] = "bluetooth";
  BrowserPermission2["Accelerometer"] = "accelerometer";
  BrowserPermission2["Gyroscope"] = "gyroscope";
  BrowserPermission2["Magnetometer"] = "magnetometer";
  BrowserPermission2["Ambientlightsensor"] = "ambient-light-sensor";
  BrowserPermission2["Backgroundsync"] = "background-sync";
  BrowserPermission2["Persistentstorage"] = "persistent-storage";
  BrowserPermission2["Screenwakelock"] = "screen-wake-lock";
  BrowserPermission2["Webshare"] = "web-share";
  BrowserPermission2["Xrspatialtracking"] = "xr-spatial-tracking";
})(BrowserPermission || (BrowserPermission = {}));
var ImageFormat;
(function(ImageFormat2) {
  ImageFormat2["Jpg"] = "jpg";
  ImageFormat2["Jpeg"] = "jpeg";
  ImageFormat2["Png"] = "png";
  ImageFormat2["Webp"] = "webp";
  ImageFormat2["Heic"] = "heic";
  ImageFormat2["Avif"] = "avif";
  ImageFormat2["Gif"] = "gif";
})(ImageFormat || (ImageFormat = {}));
var ExecutionMethod;
(function(ExecutionMethod2) {
  ExecutionMethod2["GET"] = "GET";
  ExecutionMethod2["POST"] = "POST";
  ExecutionMethod2["PUT"] = "PUT";
  ExecutionMethod2["PATCH"] = "PATCH";
  ExecutionMethod2["DELETE"] = "DELETE";
  ExecutionMethod2["OPTIONS"] = "OPTIONS";
  ExecutionMethod2["HEAD"] = "HEAD";
})(ExecutionMethod || (ExecutionMethod = {}));
var ImageGravity;
(function(ImageGravity2) {
  ImageGravity2["Center"] = "center";
  ImageGravity2["Topleft"] = "top-left";
  ImageGravity2["Top"] = "top";
  ImageGravity2["Topright"] = "top-right";
  ImageGravity2["Left"] = "left";
  ImageGravity2["Right"] = "right";
  ImageGravity2["Bottomleft"] = "bottom-left";
  ImageGravity2["Bottom"] = "bottom";
  ImageGravity2["Bottomright"] = "bottom-right";
})(ImageGravity || (ImageGravity = {}));
var ExecutionTrigger;
(function(ExecutionTrigger2) {
  ExecutionTrigger2["Http"] = "http";
  ExecutionTrigger2["Schedule"] = "schedule";
  ExecutionTrigger2["Event"] = "event";
})(ExecutionTrigger || (ExecutionTrigger = {}));
var ExecutionStatus;
(function(ExecutionStatus2) {
  ExecutionStatus2["Waiting"] = "waiting";
  ExecutionStatus2["Processing"] = "processing";
  ExecutionStatus2["Completed"] = "completed";
  ExecutionStatus2["Failed"] = "failed";
  ExecutionStatus2["Scheduled"] = "scheduled";
})(ExecutionStatus || (ExecutionStatus = {}));

// src/lib/appwrite.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function getAdminClient() {
  return new Client().setEndpoint(env2.appwriteEndpoint).setProject(env2.appwriteProjectId).setDevKey(env2.appwriteApiKey);
}
__name(getAdminClient, "getAdminClient");
function getSessionClient(sessionSecret) {
  const c = new Client().setEndpoint(env2.appwriteEndpoint).setProject(env2.appwriteProjectId);
  if (sessionSecret) c.setSession(sessionSecret);
  return c;
}
__name(getSessionClient, "getSessionClient");
function getDatabases() {
  return new Databases(getAdminClient());
}
__name(getDatabases, "getDatabases");
async function getProfile(userId) {
  const res = await getDatabases().listDocuments(
    env2.appwriteDatabaseId,
    env2.appwriteCollectionProfiles,
    [Query.equal("userId", userId)]
  );
  return res.documents[0] ?? null;
}
__name(getProfile, "getProfile");
var appwrite = {
  databaseId: env2.appwriteDatabaseId,
  collections: {
    profiles: env2.appwriteCollectionProfiles,
    tasks: env2.appwriteCollectionTasks,
    sessions: env2.appwriteCollectionSessions,
    events: env2.appwriteCollectionEvents
  },
  buckets: {
    avatars: env2.appwriteBucketAvatars
  }
};

// src/lib/response.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SESSION_COOKIE = "token";
function json(data, status = 200, extraHeaders) {
  const h = new Headers({ "content-type": "application/json", ...extraHeaders });
  return new Response(JSON.stringify(data), { status, headers: h });
}
__name(json, "json");
function setSessionCookie(resHeaders, token) {
  resHeaders.set(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax; ${false ? "Secure" : ""}`
  );
}
__name(setSessionCookie, "setSessionCookie");
function clearSessionCookie(resHeaders) {
  resHeaders.set("Set-Cookie", `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`);
}
__name(clearSessionCookie, "clearSessionCookie");
function getSessionToken(req) {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match2 = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=(.*?)$`));
  if (match2?.[1]) return match2[1];
  const auth2 = req.headers.get("authorization") ?? "";
  return auth2.startsWith("Bearer ") ? auth2.slice(7) : "";
}
__name(getSessionToken, "getSessionToken");

// src/routes/auth.ts
function serializeProfile(doc) {
  if (!doc) return null;
  return {
    id: doc.$id,
    userId: doc.userId,
    email: doc.email,
    name: doc.name,
    avatarUrl: doc.avatarUrl ?? null,
    restRatio: doc.restRatio ?? 5,
    theme: doc.theme ?? "system",
    notificationsEnabled: doc.notificationsEnabled ?? false,
    soundEnabled: doc.soundEnabled ?? false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}
__name(serializeProfile, "serializeProfile");
var auth = new Hono2();
auth.post("/register", async (c) => {
  const { name, email, password } = await c.req.json().catch(() => ({}));
  if (!name || name.length < 2) return json({ success: false, data: null, error: { code: "VALIDATION_ERROR", message: "Name min 2 chars" }, meta: null }, 422);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ success: false, data: null, error: { code: "VALIDATION_ERROR", message: "Invalid email" }, meta: null }, 422);
  if (!password || password.length < 8) return json({ success: false, data: null, error: { code: "VALIDATION_ERROR", message: "Password min 8 chars" }, meta: null }, 422);
  const emailLower = email.toLowerCase();
  try {
    const createRes = await fetch(`${env2.appwriteEndpoint}/users`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-appwrite-project": env2.appwriteProjectId,
        "x-appwrite-key": env2.appwriteApiKey
      },
      body: JSON.stringify({ userId: ID.unique(), email: emailLower, password, name })
    });
    if (!createRes.ok) {
      const errBody = await createRes.json().catch(() => ({}));
      if (/already|exists/i.test(errBody?.message ?? "")) {
        return json({ success: false, data: null, error: { code: "CONFLICT", message: "Email already registered" }, meta: null }, 409);
      }
      throw new Error(errBody?.message ?? "Registration failed");
    }
    const user = await createRes.json();
    const databases = getDatabases();
    await databases.createDocument(env2.appwriteDatabaseId, appwrite.collections.profiles, ID.unique(), {
      userId: user.$id,
      email: emailLower,
      name,
      restRatio: 5,
      theme: "system",
      notificationsEnabled: false,
      soundEnabled: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    const loginRes = await fetch(`${env2.appwriteEndpoint}/account/sessions/email`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-appwrite-project": env2.appwriteProjectId },
      body: JSON.stringify({ email: emailLower, password })
    });
    if (!loginRes.ok) throw new Error("Login failed after registration");
    const session = await loginRes.json();
    const setHeaders = new Headers();
    setSessionCookie(setHeaders, session.secret ?? "");
    return c.json({
      success: true,
      data: serializeProfile({ $id: user.$id, userId: user.$id, email: emailLower, name, avatarUrl: null, restRatio: 5, theme: "system", notificationsEnabled: false, soundEnabled: false }),
      error: null,
      meta: null
    }, 201, Object.fromEntries(setHeaders.entries()));
  } catch (e) {
    console.error("register failed", e);
    return json({ success: false, data: null, error: { code: "INTERNAL_ERROR", message: e?.message ?? "Registration failed" }, meta: null }, 500);
  }
});
auth.post("/login", async (c) => {
  const { email, password } = await c.req.json().catch(() => ({}));
  if (!email || !password) return json({ success: false, data: null, error: { code: "VALIDATION_ERROR", message: "Email and password required" }, meta: null }, 422);
  const emailLower = email.toLowerCase();
  try {
    const loginRes = await fetch(`${env2.appwriteEndpoint}/account/sessions/email`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-appwrite-project": env2.appwriteProjectId },
      body: JSON.stringify({ email: emailLower, password })
    });
    if (!loginRes.ok) throw new Error("Invalid credentials");
    const session = await loginRes.json();
    const setHeaders = new Headers();
    setSessionCookie(setHeaders, session.secret ?? "");
    const databases = getDatabases();
    const profiles2 = await databases.listDocuments(
      env2.appwriteDatabaseId,
      appwrite.collections.profiles,
      [Query.equal("email", emailLower)]
    );
    return c.json({
      success: true,
      data: serializeProfile(profiles2.documents[0] ?? null),
      error: null,
      meta: null
    }, 200, Object.fromEntries(setHeaders.entries()));
  } catch {
    return json({ success: false, data: null, error: { code: "UNAUTHORIZED", message: "Invalid email or password" }, meta: null }, 401);
  }
});
auth.post("/logout", async (c) => {
  const setHeaders = new Headers();
  clearSessionCookie(setHeaders);
  return c.json({ success: true, data: null, error: null, meta: null }, 200, Object.fromEntries(setHeaders.entries()));
});
var auth_default = auth;

// src/routes/tasks.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/middleware/auth.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var authMiddleware = /* @__PURE__ */ __name(async (c, next) => {
  const token = getSessionToken(c.req.raw);
  if (!token) return c.json({ success: false, data: null, error: { code: "UNAUTHORIZED", message: "Unauthorized" }, meta: null }, 401);
  try {
    const account = new Account(getSessionClient(token));
    const session = await account.get();
    let profile3 = null;
    try {
      profile3 = await getProfile(session.$id);
    } catch {
      profile3 = null;
    }
    c.set("user", { id: session.$id, email: session.email, name: session.name, profile: profile3 });
    await next();
  } catch {
    return c.json({ success: false, data: null, error: { code: "UNAUTHORIZED", message: "Unauthorized" }, meta: null }, 401);
  }
}, "authMiddleware");

// src/routes/tasks.ts
var tasks = new Hono2().use("*", authMiddleware);
tasks.get("/", async (c) => {
  const res = await getDatabases().listDocuments(
    env2.appwriteDatabaseId,
    appwrite.collections.tasks,
    [Query.equal("userId", c.get("user").id), Query.orderDesc("createdAt")]
  );
  return c.json({ success: true, data: res.documents, error: null, meta: null });
});
tasks.post("/", async (c) => {
  const { name } = await c.req.json().catch(() => ({}));
  if (!name || name.length < 1) return c.json({ success: false, data: null, error: { code: "VALIDATION_ERROR", message: "Task name required" }, meta: null }, 422);
  const doc = await getDatabases().createDocument(
    env2.appwriteDatabaseId,
    appwrite.collections.tasks,
    ID.unique(),
    { userId: c.get("user").id, name, createdAt: (/* @__PURE__ */ new Date()).toISOString() }
  );
  return c.json({ success: true, data: doc, error: null, meta: null }, 201);
});
tasks.delete("/:id", async (c) => {
  try {
    const doc = await getDatabases().getDocument(env2.appwriteDatabaseId, appwrite.collections.tasks, c.req.param("id"));
    if (doc.userId !== c.get("user").id) return c.json({ success: false, data: null, error: { code: "NOT_FOUND", message: "Task not found" }, meta: null }, 404);
    await getDatabases().deleteDocument(env2.appwriteDatabaseId, appwrite.collections.tasks, c.req.param("id"));
    return c.json({ success: true, data: null, error: null, meta: null });
  } catch {
    return c.json({ success: false, data: null, error: { code: "NOT_FOUND", message: "Task not found" }, meta: null }, 404);
  }
});
var tasks_default = tasks;

// src/routes/sessions.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var sessions = new Hono2().use("*", authMiddleware);
sessions.get("/active", async (c) => {
  const res = await getDatabases().listDocuments(
    env2.appwriteDatabaseId,
    appwrite.collections.sessions,
    [Query.equal("userId", c.get("user").id), Query.equal("status", "active"), Query.limit(1)]
  );
  return c.json({ success: true, data: res.documents[0] ?? null, error: null, meta: null });
});
sessions.get("/", async (c) => {
  const databases = getDatabases();
  const url = new URL(c.req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "20")));
  const offset = (page - 1) * limit;
  const filters = [Query.equal("userId", c.get("user").id)];
  const taskId = url.searchParams.get("taskId");
  if (taskId) filters.push(Query.equal("taskId", taskId));
  const from = url.searchParams.get("from");
  if (from) filters.push(Query.greaterThanEqual("startedAt", new Date(from).toISOString()));
  const to = url.searchParams.get("to");
  if (to) filters.push(Query.lessThanEqual("startedAt", new Date(to).toISOString()));
  filters.push(Query.orderDesc("startedAt"), Query.limit(limit), Query.offset(offset));
  const res = await databases.listDocuments(env2.appwriteDatabaseId, appwrite.collections.sessions, filters, void 0, true);
  return c.json({
    success: true,
    data: res.documents,
    error: null,
    meta: { page, limit, total: res.total, totalPages: Math.ceil(res.total / limit) }
  });
});
sessions.get("/:id", async (c) => {
  const databases = getDatabases();
  try {
    const doc = await databases.getDocument(env2.appwriteDatabaseId, appwrite.collections.sessions, c.req.param("id"));
    if (doc.userId !== c.get("user").id) return c.json({ success: false, data: null, error: { code: "NOT_FOUND", message: "Session not found" }, meta: null }, 404);
    const events = await databases.listDocuments(
      env2.appwriteDatabaseId,
      appwrite.collections.events,
      [Query.equal("sessionId", doc.$id), Query.orderAsc("timestamp")]
    );
    return c.json({ success: true, data: { ...doc, events: events.documents }, error: null, meta: null });
  } catch {
    return c.json({ success: false, data: null, error: { code: "NOT_FOUND", message: "Session not found" }, meta: null }, 404);
  }
});
sessions.post("/", async (c) => {
  const databases = getDatabases();
  const existing = await databases.listDocuments(
    env2.appwriteDatabaseId,
    appwrite.collections.sessions,
    [Query.equal("userId", c.get("user").id), Query.equal("status", "active"), Query.limit(1)]
  );
  if (existing.total > 0) return c.json({ success: false, data: null, error: { code: "CONFLICT", message: "Already have an active session" }, meta: null }, 409);
  const { taskId } = await c.req.json().catch(() => ({}));
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const doc = await databases.createDocument(
    env2.appwriteDatabaseId,
    appwrite.collections.sessions,
    ID.unique(),
    { userId: c.get("user").id, taskId: taskId ?? null, status: "active", durationSeconds: 0, restEarnedSeconds: 0, restTakenSeconds: 0, startedAt: now, createdAt: now }
  );
  await databases.createDocument(
    env2.appwriteDatabaseId,
    appwrite.collections.events,
    ID.unique(),
    { sessionId: doc.$id, eventType: "focus_started", timestamp: now, payload: "{}" }
  ).catch(() => {
  });
  return c.json({ success: true, data: doc, error: null, meta: null }, 201);
});
sessions.patch("/:id", async (c) => {
  const databases = getDatabases();
  let doc;
  try {
    doc = await databases.getDocument(env2.appwriteDatabaseId, appwrite.collections.sessions, c.req.param("id"));
    if (doc.userId !== c.get("user").id) return c.json({ success: false, data: null, error: { code: "NOT_FOUND", message: "Session not found" }, meta: null }, 404);
  } catch {
    return c.json({ success: false, data: null, error: { code: "NOT_FOUND", message: "Session not found" }, meta: null }, 404);
  }
  const b = await c.req.json().catch(() => ({}));
  const updates = {};
  if (b.status) updates.status = b.status;
  if (b.durationSeconds !== void 0) updates.durationSeconds = b.durationSeconds;
  if (b.restEarnedSeconds !== void 0) updates.restEarnedSeconds = b.restEarnedSeconds;
  if (b.restTakenSeconds !== void 0) updates.restTakenSeconds = b.restTakenSeconds;
  if (b.endedAt) updates.endedAt = new Date(b.endedAt).toISOString();
  else if (b.status === "completed" && !doc.endedAt) updates.endedAt = (/* @__PURE__ */ new Date()).toISOString();
  if (b.status === "completed" && b.durationSeconds !== void 0) {
    const profile3 = await getProfile(c.get("user").id);
    const ratio = profile3?.restRatio ?? env2.restRatioDefault;
    updates.restEarnedSeconds = Math.floor(b.durationSeconds / ratio);
  }
  const updated = await databases.updateDocument(env2.appwriteDatabaseId, appwrite.collections.sessions, c.req.param("id"), updates);
  if (b.status) {
    await databases.createDocument(
      env2.appwriteDatabaseId,
      appwrite.collections.events,
      ID.unique(),
      { sessionId: updated.$id, eventType: b.status === "completed" ? "session_ended" : b.status, timestamp: (/* @__PURE__ */ new Date()).toISOString(), payload: "{}" }
    ).catch(() => {
    });
  }
  return c.json({ success: true, data: updated, error: null, meta: null });
});
sessions.delete("/:id", async (c) => {
  const databases = getDatabases();
  try {
    const doc = await databases.getDocument(env2.appwriteDatabaseId, appwrite.collections.sessions, c.req.param("id"));
    if (doc.userId !== c.get("user").id) return c.json({ success: false, data: null, error: { code: "NOT_FOUND", message: "Session not found" }, meta: null }, 404);
    await databases.deleteDocument(env2.appwriteDatabaseId, appwrite.collections.sessions, c.req.param("id"));
    return c.json({ success: true, data: null, error: null, meta: null });
  } catch {
    return c.json({ success: false, data: null, error: { code: "NOT_FOUND", message: "Session not found" }, meta: null }, 404);
  }
});
var sessions_default = sessions;

// src/routes/analytics.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var analytics = new Hono2().use("*", authMiddleware);
function streakDays(list) {
  const dates = new Set(list.map((s) => new Date(s.startedAt).toISOString().slice(0, 10)));
  let streak = 0;
  const cur = /* @__PURE__ */ new Date();
  while (dates.has(cur.toISOString().slice(0, 10))) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}
__name(streakDays, "streakDays");
async function listAllCompleted(userId) {
  const databases = getDatabases();
  const all = [];
  let cursor = 0;
  const limit = 100;
  while (true) {
    const res = await databases.listDocuments(
      env2.appwriteDatabaseId,
      appwrite.collections.sessions,
      [Query.equal("userId", userId), Query.equal("status", "completed"), Query.limit(limit), Query.offset(cursor)],
      void 0,
      true
    );
    all.push(...res.documents);
    if (cursor + limit >= res.total) break;
    cursor += limit;
  }
  return all;
}
__name(listAllCompleted, "listAllCompleted");
analytics.get("/summary", async (c) => {
  const all = await listAllCompleted(c.get("user").id);
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const todaySessions = all.filter((s) => new Date(s.startedAt).toISOString().slice(0, 10) === todayStr);
  const todayFocus = todaySessions.reduce((a, s) => a + (s.durationSeconds ?? 0), 0);
  const totalFocus = all.reduce((a, s) => a + (s.durationSeconds ?? 0), 0);
  const avgFocus = all.length ? Math.round(totalFocus / all.length) : 0;
  const longest = all.length ? Math.max(...all.map((s) => s.durationSeconds ?? 0)) : 0;
  const byDay = {};
  for (const s of all) {
    const d = new Date(s.startedAt).toISOString().slice(0, 10);
    byDay[d] = (byDay[d] ?? 0) + (s.durationSeconds ?? 0);
  }
  let bestDay = null;
  for (const [d, v] of Object.entries(byDay)) if (!bestDay || v > bestDay.value) bestDay = { date: d, value: v };
  return c.json({ success: true, data: { todayFocus, totalFocus, avgFocus, longestSession: longest, bestDay, streak: streakDays(all), totalSessions: all.length }, error: null, meta: null });
});
analytics.get("/history", async (c) => {
  const url = new URL(c.req.url);
  const period = url.searchParams.get("period") ?? "week";
  const days = period === "month" ? 30 : period === "week" ? 7 : 1;
  const from = /* @__PURE__ */ new Date();
  from.setDate(from.getDate() - days);
  const all = await listAllCompleted(c.get("user").id);
  const list = all.filter((s) => new Date(s.startedAt) >= from);
  const byDate = {};
  for (const s of list) {
    const d = new Date(s.startedAt).toISOString().slice(0, 10);
    byDate[d] = (byDate[d] ?? 0) + (s.durationSeconds ?? 0);
  }
  const points = Object.entries(byDate).map(([date, seconds]) => ({ date, seconds })).sort((a, b) => a.date.localeCompare(b.date));
  return c.json({ success: true, data: points, error: null, meta: null });
});
var analytics_default = analytics;

// src/routes/profiles.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function serialize(doc) {
  if (!doc) return null;
  return {
    id: doc.$id,
    userId: doc.userId,
    email: doc.email,
    name: doc.name,
    avatarUrl: doc.avatarUrl ?? null,
    restRatio: doc.restRatio ?? 5,
    theme: doc.theme ?? "system",
    notificationsEnabled: doc.notificationsEnabled ?? false,
    soundEnabled: doc.soundEnabled ?? false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}
__name(serialize, "serialize");
async function ensureProfile(databases, user) {
  let profile3 = await getProfile(user.id);
  if (!profile3) {
    profile3 = await databases.createDocument(env2.appwriteDatabaseId, appwrite.collections.profiles, ID.unique(), {
      userId: user.id,
      email: user.email,
      name: user.name,
      restRatio: 5,
      theme: "system",
      notificationsEnabled: false,
      soundEnabled: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  return profile3;
}
__name(ensureProfile, "ensureProfile");
var profiles = new Hono2().use("*", authMiddleware);
profiles.get("/", async (c) => {
  try {
    const profile3 = await ensureProfile(getDatabases(), c.get("user"));
    return c.json({ success: true, data: serialize(profile3), error: null, meta: null });
  } catch {
    return c.json({ success: false, data: null, error: { code: "NOT_FOUND", message: "User not found" }, meta: null }, 404);
  }
});
profiles.patch("/", async (c) => {
  const databases = getDatabases();
  const profile3 = await ensureProfile(databases, c.get("user"));
  const b = await c.req.json().catch(() => ({}));
  const updates = {};
  if (b.name !== void 0) updates.name = b.name;
  if (b.restRatio !== void 0) updates.restRatio = b.restRatio;
  if (b.theme !== void 0) updates.theme = b.theme;
  if (b.notificationsEnabled !== void 0) updates.notificationsEnabled = b.notificationsEnabled;
  if (b.soundEnabled !== void 0) updates.soundEnabled = b.soundEnabled;
  updates.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  const updated = await databases.updateDocument(env2.appwriteDatabaseId, appwrite.collections.profiles, profile3.$id, updates);
  return c.json({ success: true, data: serialize(updated), error: null, meta: null });
});
profiles.post("/avatar", async (c) => {
  const databases = getDatabases();
  const profile3 = await ensureProfile(databases, c.get("user"));
  const b = await c.req.json().catch(() => ({}));
  let avatarUrl = profile3.avatarUrl ?? null;
  if (b?.avatarUrl !== void 0) avatarUrl = b.avatarUrl;
  if (b?.file?.dataUrl) {
    try {
      const b64 = b.file.dataUrl.split(",")[1];
      const bytes = new Uint8Array([...b64].map((ch) => ch.charCodeAt(0)));
      const res = await fetch(`${env2.appwriteEndpoint}/storage/buckets/${appwrite.buckets.avatars}/files`, {
        method: "POST",
        headers: { "x-appwrite-project": env2.appwriteProjectId, "x-appwrite-key": env2.appwriteApiKey },
        body: bytes
      });
      if (res.ok) {
        const up = await res.json();
        avatarUrl = `${env2.appwriteEndpoint}/storage/buckets/${appwrite.buckets.avatars}/files/${up.$id}/view?project=${env2.appwriteProjectId}`;
      }
    } catch {
    }
  }
  try {
    const updated = await databases.updateDocument(env2.appwriteDatabaseId, appwrite.collections.profiles, profile3.$id, { avatarUrl, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
    return c.json({ success: true, data: serialize(updated), error: null, meta: null });
  } catch (e) {
    console.error("avatar update failed", e);
    return c.json({ success: true, data: serialize(profile3), error: null, meta: null });
  }
});
var profiles_default = profiles;

// src/index.ts
var app = new Hono2().use("*", cors({
  origin: env2.corsOrigin,
  allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowHeaders: ["Content-Type", "Authorization", "X-Idempotency-Key"],
  credentials: true
})).get(
  "/api/health",
  () => new Response(JSON.stringify({
    success: true,
    data: { status: "ok", service: "flowdoro-api", uptime: process.uptime(), env: env2.nodeEnv },
    error: null,
    meta: null
  }), { headers: { "content-type": "application/json" } })
).route("/api/auth", auth_default).route("/api/tasks", tasks_default).route("/api/sessions", sessions_default).route("/api/analytics", analytics_default).route("/api", profiles_default);
var src_default = app;

// ../../node_modules/.bun/wrangler@4.128.0+fccf3d0819d1a6b6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env3, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env3);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../node_modules/.bun/wrangler@4.128.0+fccf3d0819d1a6b6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env3, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env3);
  } catch (e) {
    const error3 = reduceError(e);
    const body = JSON.stringify(error3);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-bHKBtT/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../node_modules/.bun/wrangler@4.128.0+fccf3d0819d1a6b6/node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env3, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env3, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env3, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env3, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-bHKBtT/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env3, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env3, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env3, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env3, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env3, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env3, ctx) => {
      this.env = env3;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
