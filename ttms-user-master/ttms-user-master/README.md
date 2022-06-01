
# 影院管理系统（用户端）
### 项目介绍

本项目用于影院用户端配套购票网页，包括用户个人信息维护，充值，购票，退票，查询影片及上映信息等功能。

项目采用react+antd构建页面和处理业务逻辑，使用react-router管理路由。
### 使用说明

请确保您的电脑上已经安装node环境和git环境。

```
npm install
```

当获取到源码时，请使用npm install安装依赖，如果出现错误，请按照返回的信息进行操作。

```
npm run start
```

在本地运行请使用此命令，会默认监听3000端口。如需更改端口，请在scripts下start.js第48行:

```
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
```

改动末尾的3000数值即可。

```
npm run build
```

将源码打包成静态文件并压缩，此法生成的静态文件代理时，请将根设置在build下。