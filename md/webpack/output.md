### IIFE
在函名函数前加符号（！或 + 或 （））
就把一个函数声明语句变成了一个函数表达式，是表达式就会要script标签中自动执行

### webpack打包文件分析


### libraryTarget
// "var" | "assign" | "this" | "window" | "self" | "global" | "commonjs" | "commonjs2" |
        //  "commonjs-module" | "amd" | "amd-require" | "umd" | "umd2" | "jsonp" | "system"
libraryTarget 有以上这些值

libraryTarget: "commonjs" 入中起点的返回值将使用output.libary的值
分配给exports对象 这意味着模块用于CommonJS环境
```js
    export['Mylibrary'] = _entry_return;
    require('Mylibrary').dosomething();
```

libraryTarget: "commonjs2" 入中起点的返回值分配给module.exports对象 这意味着模块用于CommonJS环境
```js
    export['Mylibrary'] = _entry_return;
    require('Mylibrary').dosomething();
```
utput.library 会被省略，因此对于此特定的 output.libraryTarget，无需再设置 output.library 。

libraryTarget: "amd" -将你的library暴露为AMD模块
```
AMD模块要求入口chunk(例如使用<script>标签加载的第一个脚本)通过特定的属性定义，
例如define 和 require，它们通常由RequireJS 或任何兼容的模块加载器提供（例如almond）。
否则，直接加载生成的AMD bundle将导致报错， 如define is not define
```

```js
output:{
    library: 'MyLibrary',
    libraryTarget: 'amd',
}

```

生成的output
```js
define("MyLibrary", [], function() {
  return _entry_return_; // 此模块返回值，是入口 chunk 返回的值
});
```
如果library未定义
```
define([], function() {
  return _entry_return_; // 此模块返回值，是入口 chunk 返回的值
});
```

libararyTarget: 'umd' -将你的libary暴露为所有的模块定义下都可运行的方式。
它将在CommonJS,AMD环境下运行，或将模块导出到global下的变量

```js
output: {
    library: 'MyLibrary',
    libraryTarget: 'umd',
}
```
最终输出
```js
(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else if(typeof exports === 'object')
    exports["MyLibrary"] = factory();
  else
    root["MyLibrary"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
  return _entry_return_; // 此模块返回值，是入口 chunk 返回的值
});
```

省略library会导致入口起点返回的所有属性，直接赋值给root对象
```js
output: {
    libraryTarget: 'umd',
}
```
最终输出
```js
(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else {
    var a = factory();
    for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
  }
})(typeof self !== 'undefined' ? self : this, function() {
  return _entry_return_; // 此模块返回值，是入口 chunk 返回的值
});
```
