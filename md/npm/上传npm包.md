## 上传npm包到npm中央仓库

### npm包命名规则及文件夹结构
1. 用模块的名称命名根目录，npm包名不能重复
2. 每个npm包根目录下都包含一个index.js文件和package.json文件
3. src目录，用于放置未压缩的源码
4. dist 目录，用于放置压缩后的代码
5. 使用package.json文件的规格来描述本模块

### 发布npm到npm中央仓库（公共仓库）
1注册npm账号
[npm账号](https://www.npmjs.com/signup)
2 编写模块

注意：1、npm包名称 name的值不能和已经存的npm包名相同；2、每次版本更新都必须修改版本号version值

3发布npm到npm公共仓库
添加账户
```
npm adduser
```
输入用户名、密码和邮箱

查看当前登录的用户
```
npm who am i
```

发布npm包
```
npm publish
```
发布成功以后，就可以npm个人中心看到刚刚发布的npm包了

更新npm包
和发布npm包一样都是使用 npm publish 命令，更新发布之前必须修改版本号

使用npm
和我们平时使用npm一样

发布npm常见错误
1 npm仓库设置了淘宝镜像
```
npm ERR! code E403
npm ERR! 403 Forbidden - PUT https://registry.npm.taobao.org/lld-npm-demo - no_perms

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/better/.npm/_logs/2019-01-24T02_08_54_914Z-debug.log

```
解决方案
```
// 检查仓库是否被设成了淘宝镜像库(https://registry.npm.taobao.org/)
npm config get registry

// 如果设置了淘宝镜像，执行以下命令
npm config set registry=http://registry.npmjs.org

// 解决问题后重新发布
npm publish

// 发布成功以后，在设会淘宝镜像
npm config set registry=https://registry.npm.taobao.org/
```

2 账号未登录
```
npm ERR! code E401
npm ERR! 401 Unauthorized - PUT http://registry.npmjs.org/lld-npm-demo - You must be logged in to publish packages.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/better/.npm/_logs/2019-01-24T02_13_00_370Z-debug.log
```

3 未修改版本号
```
npm ERR! code E403
npm ERR! 403 Forbidden - PUT http://registry.npmjs.org/lld-npm-demo - You cannot publish over the previously published versions: 1.0.0.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/better/.npm/_logs/2019-01-24T02_55_19_409Z-debug.log

```
