# 邮件同步安全代理

飞书有很好用的日历功能，Outlook邮箱也有很好用的日历功能。如果需要同时使用两款日历，就需要同步。
虽然飞书提供了Exchange协议同步日历的功能，但是不可避免的需要将邮件的服务器地址、账号、密码交给飞书。
可以同步日历功能的同时，也把邮件暴露给了飞书。

本仓库提供了使用nodejs完成Exchange协议代理的简单功能。

## 运行条件
公网地址

## 环境变量

| KEY | VALUE | DESC|
| --- | --- | ---|
|MAIL_DOMAIN|mail.xxx.com.cn|邮件服务器的域名|
|PROXY_PORT|3000|代理的端口|
|USERNAME|chuanpeng1.zhu|测试用户名|
|PASSWORD|*******|  测试用户密码|


## 冷知识

- Exchange: Exchange服务是soap服务的一种。微软在soap服务基础上实现了Exchange邮箱功能。
- Soap: Soap是基于http/https传输协议、xml文件格式的业务协议标准。
- EWS：Exchange Web Service。
- Outlook：微软的邮箱桌面客户端软件。使用的支持Exchange协议。
- OWA：Outlook Web Application
- ECP：Exchange服务的管理后台
- asmx: C#风格的页面拓展名。类比Structs的.do，PHP的.php, 
- wsdl：xml格式的服务说明文件

## 操作
1. 下载项目启动项目
    - 运行`npm i`安装依赖
    - 配置环境变量，USERNAME和PASSWORD可以不用配置。
    - 运行`npm start`

2. 在飞书的Exchange填入服务的地址。如果部署在proxy.domain.com.cn域名上、端口是3000的话就写

```
http://proxy.domain.com.cn:3000/EWS/Exchange.asmx
```

## Docker运行

### 构建镜像
```
docker build . -t proxy
```

### 运行镜像

```
docker run --name exchange-proxy \
-p 3000:3000 \
-e MAIL_DOMAIN=mail.dhc.com.cn \
-e PROXY_PORT=3000 \
-d proxy
```