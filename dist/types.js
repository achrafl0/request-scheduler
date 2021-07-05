"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestStatus = exports.RequestPriority = void 0;
var RequestPriority;
(function (RequestPriority) {
    RequestPriority[RequestPriority["VERY_HIGH"] = 2] = "VERY_HIGH";
    RequestPriority[RequestPriority["HIGH"] = 1] = "HIGH";
    RequestPriority[RequestPriority["NORMAL"] = 0] = "NORMAL";
    RequestPriority[RequestPriority["LOW"] = -1] = "LOW";
    RequestPriority[RequestPriority["VERY_LOW"] = -2] = "VERY_LOW";
})(RequestPriority = exports.RequestPriority || (exports.RequestPriority = {}));
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["WAITLIST"] = "waitlist";
    RequestStatus["RUNNING"] = "running";
    RequestStatus["DONE"] = "done";
    RequestStatus["IDLE"] = "idle";
    RequestStatus["CANCELED"] = "canceled";
    RequestStatus["FAILED"] = "failed";
    RequestStatus["NONEXISTANT"] = "non-existant";
})(RequestStatus = exports.RequestStatus || (exports.RequestStatus = {}));
