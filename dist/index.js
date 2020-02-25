"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var WRequest = /** @class */ (function () {
    function WRequest(generator) {
        var _this = this;
        this.generator = generator;
        this.dataHandlers = [];
        this.promiseTransforms = [];
        this.failCallback = [];
        this.finalCallback = [];
        this.loadCallback = [];
        this.debug = {
            log: function () {
                _this.success(console.log);
                return _this;
            },
            delay: function (time) {
                if (time === void 0) { time = 1000; }
                _this.promiseTransforms.push(function (generator, callback) {
                    setTimeout(function () { return callback(generator); }, time);
                });
                return _this;
            },
            success: function (data) {
                _this.promiseTransforms.push(function (_, callback) {
                    callback(function () { return Promise.resolve(data); });
                });
                return _this;
            },
            fail: function (error) {
                _this.promiseTransforms.push(function (_, callback) {
                    callback(function () { return Promise.reject(error); });
                });
                return _this;
            }
        };
        this.status = {
            loading: function (callback) {
                _this.load(function () { return callback(true); });
                _this.final(function () { return callback(false); });
                return _this;
            },
            error: function (calllback) {
                _this.load(function () { return calllback(''); });
                _this.fail(function (error) { return calllback(error); });
                _this.success(function () { return (calllback(''), void 0); });
                return _this;
            }
        };
        setTimeout(function () { return _this.query(); });
    }
    WRequest.prototype.transformPromise = function (generator, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, _i, _a, transform;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _loop_1 = function (transform) {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, new Promise(function (r) {
                                            transform(generator, function (g) {
                                                generator = g;
                                                r();
                                            });
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, _a = this.promiseTransforms;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        transform = _a[_i];
                        return [5 /*yield**/, _loop_1(transform)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        callback(generator);
                        return [2 /*return*/];
                }
            });
        });
    };
    WRequest.prototype.query = function () {
        var _this = this;
        var _a, _b;
        var index = (_b = (_a = this.myState) === null || _a === void 0 ? void 0 : _a.next()) !== null && _b !== void 0 ? _b : 0;
        for (var _i = 0, _c = this.loadCallback; _i < _c.length; _i++) {
            var load = _c[_i];
            load();
        }
        var generator = function () { var _a, _b; return (_b = (_a = _this.myState) === null || _a === void 0 ? void 0 : _a.getCache()) !== null && _b !== void 0 ? _b : _this.generator(); };
        if (this.promiseTransforms.length) {
            this.transformPromise(generator, function (generator) {
                _this.handle(generator(), index);
            });
        }
        else {
            this.handle(generator(), index);
        }
    };
    WRequest.prototype.handle = function (api, index) {
        var _this = this;
        // if (this.promiseTransforms.length > 0) {
        //   promise = new Promise((resolve) => {
        //     for (const transform of this.promiseTransforms.reverse()) {
        //       promise = transform(new Promise((resolve) => {
        //         resolve(promise)
        //       }))
        //     }
        //     resolve(promise)
        //   })
        // }
        return api.then(function (data) { return __awaiter(_this, void 0, void 0, function () {
            var _i, _a, handler, result, result;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (((_b = this.myState) === null || _b === void 0 ? void 0 : _b.isValid(index)) === false) {
                            return [2 /*return*/, console.log('重复的请求')];
                        }
                        _i = 0, _a = this.dataHandlers;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        handler = _a[_i];
                        if (!(handler.type === 'success')) return [3 /*break*/, 3];
                        return [4 /*yield*/, handler.callback(data)];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        if (!(handler.type === 'transform')) return [3 /*break*/, 4];
                        result = handler.callback(data, { fail: function (message) { return new Error(message); } });
                        if (result instanceof Error) {
                            return [2 /*return*/, Promise.reject(result.message)];
                        }
                        else {
                            data = result;
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        if (!(handler.type === 'validate')) return [3 /*break*/, 6];
                        return [4 /*yield*/, handler.callback(data)];
                    case 5:
                        result = _c.sent();
                        if (result !== undefined && result !== true) {
                            return [2 /*return*/, Promise.reject(typeof result === 'string' ? result : '返回数据错误')];
                        }
                        _c.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        }); }).catch(function (error) {
            var _a;
            if (((_a = _this.myState) === null || _a === void 0 ? void 0 : _a.isValid(index)) === false) {
                return console.log('重复的请求');
            }
            if (typeof error === 'string' || error instanceof Error) {
                var err = typeof error === 'string' ? error : error.message;
                for (var _i = 0, _b = _this.failCallback; _i < _b.length; _i++) {
                    var fail = _b[_i];
                    if (err) {
                        err = fail(err);
                    }
                    else {
                        break;
                    }
                }
            }
            else {
                console.log('未知的错误', error);
            }
        }).finally(function () {
            var _a;
            if (((_a = _this.myState) === null || _a === void 0 ? void 0 : _a.isValid(index)) === false) {
                return console.log('重复的请求');
            }
            for (var _i = 0, _b = _this.finalCallback; _i < _b.length; _i++) {
                var final = _b[_i];
                final();
            }
            _this.destory();
        });
    };
    WRequest.prototype.destory = function () {
        this.dataHandlers = [];
        this.failCallback = [];
        this.finalCallback = [];
        this.promiseTransforms = [];
        this.myState = undefined;
    };
    WRequest.prototype.load = function (callback) {
        this.loadCallback.push(callback);
        return this;
    };
    WRequest.prototype.map = function (callback) {
        return this.transform(callback);
    };
    WRequest.prototype.transform = function (callback) {
        this.dataHandlers.push({
            type: 'transform',
            callback: callback
        });
        return this;
    };
    WRequest.prototype.success = function (callback) {
        this.dataHandlers.push({
            type: 'success',
            callback: callback
        });
        return this;
    };
    WRequest.prototype.fail = function (callback) {
        this.failCallback.unshift(callback);
        return this;
    };
    WRequest.prototype.final = function (callback) {
        this.finalCallback.push(callback);
        return this;
    };
    WRequest.prototype.validate = function (callback) {
        this.dataHandlers.push({
            type: 'validate',
            callback: callback
        });
        return this;
    };
    WRequest.prototype.state = function (state) {
        this.myState = state;
        this.load(state.fire.load);
        this.success(state.fire.success);
        this.fail(state.fire.fail);
        this.final(state.fire.final);
        return this;
    };
    return WRequest;
}());
exports.default = WRequest;
