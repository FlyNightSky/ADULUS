"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const axios_1 = __importDefault(require("axios"));
const server = (0, fastify_1.default)();
server.register(Promise.resolve().then(() => __importStar(require("@fastify/static"))), {
    root: __dirname,
    prefix: "/public/",
});
server.get("/", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "http://www.google.com"; // URL of the website you want to proxy
    try {
        const response = yield axios_1.default.get(url, {
            headers: request.headers, // Forward the client headers to the proxied request
        });
        const headers = response.headers;
        const content = response.data;
        let html = `<h1>Headers:</h1><pre>${JSON.stringify(headers, null, 2)}</pre>`;
        html += `<h1>Content:</h1><pre>${content}</pre>`;
        reply.type("text/html").send(html);
    }
    catch (error) {
        reply.code(500).send("Error occurred while fetching the website.");
    }
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server.listen(3000);
        console.log("Server is running on http://localhost:3000");
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
});
start();
