const httpProxy = require("http-proxy")
const { HttpsAgent } = require("agentkeepalive-ntlm")
const https = require("https")
const dotenv = require("dotenv")
const fs = require('fs')

dotenv.config()

const SSL_KEY = process.env.SSL_KEY || "cer/server.key"
const SSL_CRT = process.env.SSL_CRT || "cer/server.crt"
const MAIL_DOMAIN = process.env.MAIL_DOMAIN
const PROXY_PORT = process.env.PROXY_PORT || 443
if (!MAIL_DOMAIN) throw Error("MAIL_URL is required in environment")
if (!PROXY_PORT) throw Error("PROXY_PORT is required in environment")

const agent = new HttpsAgent({
    cookieName: "ClientId"
})
const proxy = httpProxy.createProxyServer({
    target: `https://${MAIL_DOMAIN}`,
    agent: agent,
    changeOrigin: true,
})

proxy.on('error', function (err, req, res) {
    console.log("err:", err)
    res.end('Something went wrong. And we are reporting a custom error message.');
});

proxy.on('proxyReq', function (req, res) {
    console.log(req.method, req.protocol, req.host, req.path,)
})

proxy.on('proxyRes', function (proxyRes) {
    if (proxyRes.headers['www-authenticate']) {
        var key = 'www-authenticate';
        // @ts-ignore
        proxyRes.headers[key] = proxyRes.headers[key] && proxyRes.headers[key].split(',');
    }
});

const options = {
    key: fs.readFileSync(SSL_KEY),
    cert: fs.readFileSync(SSL_CRT),
};

const app = https.createServer(options, (req, res) => {
    // // 如果是ews以外的服务，拒绝。
    if (req.url?.toLocaleLowerCase() !== "/ews/exchange.asmx") {
        console.log("reject!!!!!!!!")
        res.writeHead(403, { 'Content-Type': 'text/plain' })
        res.end('Access Forbidden')
    }

    if (req.method === "POST") {
        let body = ""
        req.on("data", chunk => {
            body += chunk.toString()
        })
        req.on("end", () => {
            // 如果是邮件等敏感信息，拒绝
            const danger = body.includes("inbox") || body.includes("sentitems") || body.includes("drafts") || body.includes("deleteditems") || body.includes("archive")
            if (danger) {
                console.log("reject!!!!!!!!")
                res.writeHead(403, { 'Content-Type': 'text/plain' })
                res.end('Access Forbidden')
            }
            console.log(body)
        })
    }
    req.on("end", () => {
        console.log("==============Request==================")
        console.log(req.headers)
        console.log("==============Response==================", res.statusCode)
    })
    proxy.web(req, res)
})

app.listen(PROXY_PORT, () => {
    console.log("Listening on", PROXY_PORT)
    console.log("SSL_KEY", SSL_KEY)
    console.log("SSL_CRT", SSL_CRT)
})
