"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var scallback_1 = __importDefault(require("./scallback"));
var WRequestState = /** @class */ (function () {
    function WRequestState() {
        var _this = this;
        this.index = 0;
        this.destoryCallback = [];
        this.callback = {
            load: new scallback_1.default,
            success: new scallback_1.default,
            fail: new scallback_1.default,
            final: new scallback_1.default
        };
        this.status = {
            loading: false,
            error: ''
        };
        this.load(function () {
            _this.status.loading = true;
            _this.status.error = '';
        });
        this.fail(function (error) {
            _this.status.loading = false;
            _this.status.error = error;
            return error;
        });
        this.success(function () {
            _this.status.loading = false;
            _this.status.error = '';
        });
        this.fire = {
            load: function () { return _this.callback.load.fire(); },
            success: function (data) { return _this.callback.success.fire(data); },
            fail: function (error) {
                _this.callback.fail.fire(error);
                return error;
            },
            final: function () { return _this.callback.final.fire(); }
        };
    }
    WRequestState.prototype.next = function () {
        return this.index = this.index + 1;
    };
    WRequestState.prototype.isValid = function (index) {
        return this.index === index;
    };
    WRequestState.prototype.getCache = function () {
        return this.cache;
    };
    WRequestState.prototype.load = function (callback) {
        this.destoryCallback.push(this.callback.load.bind(callback));
    };
    WRequestState.prototype.success = function (callback) {
        this.destoryCallback.push(this.callback.success.bind(callback));
    };
    WRequestState.prototype.fail = function (callback) {
        this.destoryCallback.push(this.callback.fail.bind(callback));
    };
    WRequestState.prototype.final = function (callback) {
        this.destoryCallback.push(this.callback.final.bind(callback));
    };
    WRequestState.prototype.destory = function () {
        this.destoryCallback.forEach(function (callback) { return callback(); });
        this.callback.load.destory();
        this.callback.success.destory();
        this.callback.fail.destory();
        this.callback.final.destory();
    };
    return WRequestState;
}());
exports.default = WRequestState;
