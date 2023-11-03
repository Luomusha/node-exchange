import httpProxy from "http-proxy"
import { HttpsAgent } from "agentkeepalive"
import http from "http"
import { XMLParser } from "fast-xml-parser"
import dotenv from "dotenv"

dotenv.config()

const MAIL_DOMAIN = process.env.MAIL_DOMAIN
const PROXY_PORT = process.env.PROXY_PORT
if (!MAIL_DOMAIN) throw Error("MAIL_URL is required in environment")
if (!PROXY_PORT) throw Error("PROXY_PORT is required in environment")

const agent = new HttpsAgent({
    maxSockets: 100,
    keepAlive: true,
    maxFreeSockets: 10,
    keepAliveMsecs: 1000,
    timeout: 60000,
    //@ts-ignore
    // keepAliveTimeout: 30000 // free socket keepalive for 30 seconds
})
const proxy = httpProxy.createProxyServer({
    target: `https://${MAIL_DOMAIN}`,
    agent: agent,
    changeOrigin: true,
    headers: {
        host: MAIL_DOMAIN
    },
})

proxy.on('error', function (err, req, res) {
    console.log("err:", err)
    res.end('Something went wrong. And we are reporting a custom error message.');
});

proxy.on('proxyReq', function (req, res) {
    console.log("==============Request==================")
    console.log(req.method, req.protocol, req.host, req.path,)
})

// proxy.on('proxyRes', function (proxyRes) {
//     if (proxyRes.headers['www-authenticate']) {
//         var l = [];
//         for (var i = 0; i < proxyRes.headers['www-authenticate'].split(',').length; i++) {
//             l.push(proxyRes.headers['www-authenticate'].split(',')[i].trim());
//         }
//         // @ts-ignore
//         // proxyRes.headers['www-authenticate'] = l;
//     }
//     console.log("==============Response==================")
//     // console.log(proxyRes.headers)
// });



const app = http.createServer(function (req, res) {
    console.log(req.headers)
    if (req.method === "POST") {
        let body = ""

        req.on("data", chunk => {
            body += chunk.toString()
        })
        req.on("end", () => {
            const parser = new XMLParser();
            let jObj = parser.parse(body);
            console.log(body)
            // console.log(JSON.stringify(jObj, null, "  "))

            // // 如果是ews以外的服务，拒绝。
            if (req.url?.toLocaleLowerCase() !== "/ews/exchange.asmx") {
                console.log("reject!!!!!!!!")
                res.writeHead(403, { 'Content-Type': 'text/plain' })
                res.end('Access Forbidden')
            }
            // 如果是邮件等敏感信息，拒绝
            // if (true) {
            //     console.log("reject!!!!!!!!")
            // }
        })
    }

    proxy.web(req, res)
})

app.listen(PROXY_PORT)