"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SCallback = /** @class */ (function () {
    function SCallback(callback) {
        this.callbacks = [];
        this.onceCallbacks = [];
        if (callback) {
            this.add(callback);
        }
    }
    SCallback.prototype.set = function (callback) {
        this.clear().add(callback);
        return this;
    };
    SCallback.prototype.clear = function () {
        this.callbacks.splice(0, this.callbacks.length);
        return this;
    };
    SCallback.prototype.once = function (callback) {
        this.onceCallbacks.push(callback);
        return this;
    };
    SCallback.prototype.add = function (callback) {
        this.callbacks.push(callback);
        return this;
    };
    SCallback.prototype.bind = function (callback) {
        var _this = this;
        this.add(callback);
        return function () {
            _this.remove(callback);
            callback = null;
        };
    };
    SCallback.prototype.remove = function (callback) {
        var index = this.callbacks.findIndex(function (fn) { return fn === callback; });
        if (index > -1)
            this.callbacks.splice(index, 1);
        return this;
    };
    SCallback.prototype.fire = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.callbacks.forEach(function (callback) {
            callback.apply(null, args);
        });
        var callback = undefined;
        while (callback = this.onceCallbacks.pop()) {
            callback.apply(null, args);
        }
        return this;
    };
    SCallback.prototype.destory = function () {
        this.callbacks = [];
        this.onceCallbacks = [];
    };
    return SCallback;
}());
exports.default = SCallback;
