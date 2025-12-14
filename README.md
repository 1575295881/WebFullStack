# WebFullStack
Learning Web Full Stack 
## 股票查询小工具

### 首页-1
![HomePage-1](https://github.com/1575295881/WebFullStack/blob/main/screenshots/homepage-1.png)
### 首页-2
![HomePage-2](https://github.com/1575295881/WebFullStack/blob/main/screenshots/homepage-2.png)
### 首页-3
![HomePage-3](https://github.com/1575295881/WebFullStack/blob/main/screenshots/homepage-3.png)

### 股票查询小工具
基于 React 开发的股票实时查询工具，支持自选股管理、请求防抖/中断、GBK 编码解码等核心能力。

### 技术栈
- 前端框架：React（Hooks：useState/useCallback/useRef/useEffect）
- 样式：CSS Modules（样式隔离）
- 接口：腾讯股票公开接口（GBK 解码处理中文乱码）
- 优化：防抖（debounce）+ 请求中断（AbortController）+ 防重复请求

### 核心功能
1. 股票实时查询：输入6位股票代码（如600519），自动/手动查询实时数据；
2. 自选股管理：添加/删除自选股，localStorage 持久化存储；
3. 体验优化：输入防抖避免频繁请求，请求中断防止旧数据干扰。

### 在线体验

[点击访问](https://web-full-stack-weld.vercel.app/)