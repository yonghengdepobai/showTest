## 创建一个table类的组件
分析 发布到npm上按npm的标准来创建 先做一个基础版原生的 能显示大数据而不卡顿

### 创建一个tsconfig.json
用ts编写 先创建一个tsconfig.json文件
tsconfig.json文件中指定了用来编译这个项目的根文件和编译选项
"declarationDir": "./dist/types/"

包含属性
files:数组类型，用于表示


### 创建一个readme.md文件
说明组件如何使用

### 配合webpack
webpack-dev-server
使用webpack搭建本地一个测试服务器

### css问题
遇到一个css问题 如何按需加载css和设置一个默认的css后面可自已切换css
最初的想法用js创建一个link 引入一个全局的css
这个问题要考虑的是css文件路径问题
还有在全局引入csss感觉不太好


### 编译
不用webpack直接编译可直接用tsc命令
```json
"scripts": {
    "build": "tsc" # 增加 ts 编译命令
  },
```

npm run build

### 编写测试

npm i jest ts-jest @types/jest
在jest.config.js中
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['\*\*/\_\_tests\_\_/\*\*/\*.js?(x)','\*\*/?(*.)(spec|test).js?(x)']
};
```

开始少安装了ts-jest
在运行时用import 引入时会报错：SyntaxError: Unexpected identifier









