"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPRequest = void 0;
const types_1 = require("./types");
const node_fetch_1 = __importDefault(require("node-fetch"));
class HTTPRequest {
    constructor(url, priority = types_1.RequestPriority.NORMAL) {
        this.priority = priority;
        this.url = url;
        this.abortController = new AbortController();
    }
    async run() {
        return node_fetch_1.default(this.url, {
            method: 'get',
            signal: this.abortController.signal,
        }).then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        });
    }
    cancel() {
        this.abortController.abort();
    }
    changePriority(priority) {
        this.priority = priority;
    }
}
exports.HTTPRequest = HTTPRequest;
