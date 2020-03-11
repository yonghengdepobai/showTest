
## 新语法索引
```ts
declare var // 声明全局变量
declare function // 声明全局方法
declare class; // 声明合全局类
declare enum // 声明全局枚举类型
declare namespace // 声明（含有子属性的）全局对象
// interface 和 type 声明全局类型
export default // ES6 默认导出
export // = commonjs导出模块
export as namespace // UMD库声明全局变量
declare global // 扩展全局变量
declare module // 扩展模块
/// <reference /> 三斜线指令
```

### 什么是声明语句
假如我们想使用第三方库jQuery,一种常的方式是在html中通过<script_>标签引入jQurey，然后就可以使用$或jQurey了
我们通常这样获取一个id是foo的元素
```js
$('#foo')
// or
jQurey('#foo');
```

但是在ts中，编译器并不知道$或jQuery是什么东西
```ts
jQuery('#foo');
// ERROR: Cannot find name 'jQuery'
```

这时我们需要declare var 来定义它的类型2：
```ts
declare var jQuery: (selector: string) => any;
jQuery('#foo')
```

上例中，declare var 并没有真正的定义一个变量，只是定义了全局变量jQuery的类型，仅仅会用于编译时的检查，在编译结果中会被删除
它的编译结果是
```js
jQuery('foo');
```

## 什么是声明文件
通常我们会把声明语句放到一个单独的文件（jQuery.d.ts）中，就是声明文件：
```ts
// src/jQuery.d.ts
declare var jQuery: (selector: string) => any;
```

```ts
// src/index.ts
jQuery('#foo');
```

声明文件必需以 .d.ts为后缀

一般来说，ts会解析项目中的所有的 *.ts 文件，当然也包含以 .d.ts结尾的文件。
所以当我们将jQery.d.ts 放到项目中时，其他所有的*.ts文件就都可以获得jQuery的类型定义了

假如仍然无法解析，那么可以检查一下 tsconfig.json 中的文件的files、include和exclude配置，确保包含了jQuery.d.ts文件


## 书写声明文件
当一人库没有提供供声明文件时，我们就需要自已书写声明文件了

在不同的场景下，声明文件的内容和使用方式会有所区别

库的使用场景主要以下几种：
```
    全局变量：通过<script_>标签引入第三方库，注入全局变量；
    npm包：通过 import foo from 'foo' 导入，符合ES6模块规范
    UMD库：即可以通过<script_>标签引入，又可以通过import导入
    直接扩展全局变量：通过<script_> 标签引入后，改变一个全局变量的结构
    在npm包或UMD库中扩展全局变量：引用npm包或UMD库后，改变一个全局变量的结构
    模块插件：通过<scritp>或import导入后，改变一个模块构量

```

### 全局变量
全局变量是最简单的的一种场景，之前举的例子就是通过<script_>标签引入

使用全局变量的声明文件时，如果是 npm install @type/xxx 安装的，则不需要任何配置。
如果将声明文件直接存放于当前项目中，则建议和其他源码一起放到src目录下（或者对应的源码目录下）
如果没有生效检查tsconfig.json配置文件 

### declare var
declare const declare let 与 var 使用没有什么区别 它们自身的含义还在

需要注意的是，声明语句只能定义类型，切勿在声明语句中定义具体的实现

### declare function
定义全局函数
在函数类型声明语句中，函数重载也是支持的：
```ts
// src/jQuery.d.ts
declare function jQuery(selector: string): any;
declare function jQuery(domReadyCallback: () => any):any;
```
```ts
// src/index.ts
jQuery('#foo');
jQuery(function() {
    console.log('Dom Ready');
})
```

### declare class
当全局变量是一类的时候，用declare class
```ts
declare class Animal {
    name: string;
    constructor(name: string);
    sayHi(): string;
}
```

同样的，declare class 语句也只能用定定义类型，不能用来定义具体的实现

### declare enum
使用 declare enum定义的枚举类型也称作外部枚举（Ambient Enums）
```ts
// src/Directions.d.ts
declare enum Directions {
    Up,
    Down,
    Left,
    Right,
}
```
```ts
// src/index.ts
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
```
仅用来定义类型，而不是具体的值

Directions.d.ts 仅仅用于编译时的检查，声明文件里的内容在编译结果中会被删除。它编译结果是：
```js
var directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
```
其中Direction是由第三方库定义好的全局变量

### declare namespace
namespace 是 ts 早期时为了解决模块化而创造的关键字，中文称为命名空间。
由于历史遗留原因，在早期还没有 ES6 的时候，ts 提供了一种模块化方案，使用 module 关键字表示内部模块。但由于后来 ES6 也使用了 module 关键字，ts 为了兼容 ES6，使用 namespace 替代了自己的 module，更名为命名空间。
随着 ES6 的广泛应用，现在已经不建议再使用 ts 中的 namespace，而推荐使用 ES6 的模块化方案了，故我们不再需要学习 namespace 的使用了。

namespcae被淘汰了，但是在声明文件中，declare namespace还是比较常用的
它用来表示全局变量是一个对象，包含很多子属性

比如jQuery是一个全局变量，它是一个对象 ，提供了一个jQuery.ajax方法可以调用
```ts
// src/jQuery.d.ts
declare namespace jQuery {
    function ajax(url: string, setting?: any): void;
}
```
```ts
// src/index.ts
jQuery.ajax('/api/get_something');
```
注意在 declare namespace内部，我们直接使function ajax直声明函数，而不是使用 declare function ajax.
类似的，也可以使用cost, class, enum等

### 嵌套的命名空间
如果对象拥有深层的层级，则需要嵌套的namespace来声明深层的属性有类型
```typescript
// src/jQuery.d.ts
declare namespace jQuery {
    function ajax(url: string, setting?: any): void;
    namespace fn {
        function extend(object: any): void;
    }
}
```
```ts
// src/index.ts
jQuery.ajax('/api/get_something');
jQuery.fn.extend({
    check: function() {
        return this.each(function() {
            this.checked = true;
        })
    }
})
```

如查jQuery仅有fn这一个属性，则可不需要嵌套
```ts
// src/jQuery.d.ts
declare namespace jQuery.fn {
    function extend(object: any): void;
}
```
```ts
// src/index.ts
jQuery.fn.extend({
    check: function() {
        return this.each(function() {
            this.checked = true;
        })
    }
})
```

### interface 和 type
除了全局变量之外，可能有一些类型我们也希望能显露出来。在类型声明文件中，我们可以
直接使用interface 和 type 来声明一个全局的接口或类型
```ts
// src/jQuery.d.ts

interface AjaxSettings {
    method?: 'GET' | 'POST',
    data?: any;
}

declare namespace jQuery {
    function ajax(url: string, setting?: AjaxSettings): void;
}
```
```ts
// src/index.ts
let settings: AjaxSettings = {
    method: 'POST',
    data: {
        name: 'foo'
    }
}
jQuery.ajax('url', settings)
```

### 防止命名冲突
显露在最外层的interface或type会作为全局类型作用于整个项目，我们应该尽可能的减少全局变量或全局类型的数量。
故最好将他们放到namespace下
```ts
// src/jQuery.d.ts

declare namespace jQuery {
    interface AjaxSettings {
        method?: 'GET' | 'POST',
        data?: any;
    }
    function ajax(url: string, setting?: AjaxSettings): void;
}
```
```ts
// src/index.ts
let settings: jQuery.AjaxSettings = {
    method: 'POST',
    data: {
        name: 'foo'
    }
}
jQuery.ajax('url', settings)
```

### 声明合并
假如jQuery既是一个函数，可以直接调用jQuery('id'),又是一个对象，拥有子属性jQuery.ajax(),
那么我们可以组合多个声明语句，它们会不冲突的合并起来
```ts
// src/jQuery.d.ts
declare function jQuery(selector: string): any;
declare namespace jQuery {
    function ajax(url: string, setting?: AjaxSettings): void;
}
```
```ts
// src/index.ts
jQuery.ajax('url', settings)
jQuery('#foo');
```

## npm包
一般我们通过 import foo from 'foo' 导入一个npm包，这是符合ES6模块规范

在我们尝试给一个npm包建声明之前，需要先看看它的声明文件是否已经存在。一般来说，npm包的声明文件
可参存在于这两个地主：
1. 与该npm包绑定在一起。判断依据是package.json中有types字段，或者有一个index.d.ts声明文件。 ？？？？
    这种模式是不需要额外安装其他包的，是最为推荐的

2. 发布到@types里，我们只需要尝试安装一下@type包就知道是否存该声明文件

如果以上都没有就要我们自写声明文件了
1. 创建一个 node_modules/@types/foo/index.d.ts文件 这种方式不需要额外配置 但放在node_modules
    目录不稳定 不推建
2. 创建一个types目录，专门用来管理自写的声明文件，将foo的声明文件放到tyeps/foo/index.d.ts.
    这种方式需要配置tsconfig.json中的paths和baseUrl字段
```json
{
    "compileOptions": {
        "module": "commonjs",
        "baseUrl": "./",
        "paths": {
            "*": ["types/*"]
        }
    }
}
```
如此配置之后，通过import导入foo的时候 也会去types目录文件找对应的模块声明文件子
注意module的配置有很多种选项，不同的选项会影响模块的导入模式

### export 
npm包的声明文件与全局变量的声明文件有很大区别。在npm包的声明文件中，使用declare不会再声明一个全局变量，而只会在当前文件中
声明一个局部变量。只有在声明文件中使用export导出，然后在使用import导入，才会应用到这些类型声明

export 的语法与普通的ts语法类似，区别仅在于文件中禁止定义具体的实现
```ts
// types/foo/index.d.ts
export const name: string;
export function getName(): string;
export class Animal() {
    constructor(name: string);
    sayHi(): string;
}
export enum Directions {
    Up,
    Down,
    Left,
    Right,
}
export interface Options {
    data: any;
}
```

对应的导入和使用模块应该是这样：
```ts
import {name, getName, Animal, Dirctions, Options} from 'foo';
console.log(name);

let myName = getName();
let cat = new Animal('Tim');
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
let options: Options = {
    data: {
        name: 'foo'
    }
};
```

### 混用declare 的 export

我们也可以使用declare先声明多个变量，最后在用export 一次性导出
改上面的例子
```ts
declare const name: string;
declare function getName(): string;
declare class Animal() {
    constructor(name: string);
    sayHi(): string;
}
declare enum Directions {
    Up,
    Down,
    Left,
    Right,
}
declare interface Options {
    data: any;
}
export {name, getName, Animal, Dirctions, Options}
```

interface前是不需要declare的

### export namespace
与 declare namespace类似，export namespace用来导出一个拥有子属性的对象
```ts
// types/foo/index.d.ts
export namespace foo {
    const name: string;
    namespace bar {
        function baz(): string;
    }
}
```
```ts
// src/index.ts
import {foo} from 'foo';
console.log(foo.name);
foo.bar.baz();
```

### export default
在ES6模块系统中，使用export default 可以导出一个默认值，使用方可以 import foo from 'foo';
而不是import {foo} from ‘foo' 来导入这个默认值
```ts
// types/foo/index.d.ts
export default function foo(): string;
```
```ts
import foo from 'foo';

foo();
```

注意，只有 function、class 和 interface可以直接默认导出，其他的变量需要先定义出，再默认导出
```ts
// types/foo/index.d.ts
export default enum Directions {
    // ERROR: Expression expected
    Up,
    Down
}
```
上面的 export default enum是错误的语法
```ts
// types/foo/index.d.ts
declare enum Directions {
    Up,
    Down
}
export default Directions;
```
针对默认导出，我们一般将导出语句放在最前面
```ts
// types/foo/index.d.ts
export default Directions;
declare enum Directions {
    Up,
    Down
}
```

### export =
在commonjs规范中，我们使用以下方式来导出一个模块
```js
module.exports = foo; // 整体导出
exports.bar = bar; // 单个导出
```

在ts中，针对这种模块导出，有多种方式可以导入，第一种是
const ...=require:
```ts
const foo = require('foo'); // 整体导入
const bar = require('foo').bar; // 单入导入
```

第二种是 import ... from, 注意针对整体导出，需要使用 import * as
```ts
import * as foo from 'foo'; // 整体导入
import {bar} from 'foo'; // 单个导入
```

第三种是 import ...require,这也是ts官方推荐的方式：
```ts
import foo = require('foo');
import bar = foo.bar;
```

对于这种用到commonjs规范的库，假如要为写它类型声明文件的话，就需要使用export = 
```ts
export = foo;
declare function foo(): string;
declare namespace foo {
    const bar: number;
}
```

需要注意的是使用export = foo 之后，就不能再单个导出export { bar } 了。
所以通过合并声明

准确地讲，export = 不仅可以用在声明文件中，也可以在普通的ts文件中。实际上， import ... require 和
export = 都是ts为了兼容ADM规范和commonjs规范而创立的新语法

相比export = 更推荐使用ES6标准的 export default export

## UMD库

既可以通过<script_>标签引入，又可以通过import 导入的库，称为UMD库
相比于npm包的类型声明文件，我们需要额外声明一个全局变量，为了实现这种方式，ts提供了一个新语法 export as namespace

### export as namespace
一般使用 export as namespace时，都先有了npm包的声明文件，再基于它添加一条 export as namespace语句
即可将声明的一个变量声明为全局变量
```ts
// types/foo/index.d.ts
export as namespace foo;
export = foo;
declare function foo(): string;
declare namespace foo {
    const bar: number;
}
```
当然也可以和 export default 一起使用
```ts
// types/foo/index.d.ts
export as namespace foo;
export default foo;
declare function foo(): string;
declare namespace foo {
    const bar: number;
}
```

### 直接扩展全局变量
有的第三方库扩展了一个全局变量，可是此全局变量的类型却没有相应的更新过来，就会导致ts编译错误，此时就需要扩展
全局变量的比类。
比如扩展String类型
```ts
interface String {
    prependHello(): string;
}
'foo'.prependHello();
```

通过声明合并，使用interface String 即可给 String 添加属性或方法
也可使用 declare namespace 给已有的命名空间添加类型声明
```ts
// types/jquery-plugin/index.d.ts
declare namespace JQuery {
    interface CustomOptions {
        bar: string;
    }
}
interface JQueryStatic {
    foo(options: JQuery.CustomOptions): string;
}
```
```ts
// src/index.ts
jQuery.foo({
    bar: '',
})
```

### 在npm包或UMD库中扩展全局变量
如之前所说，对于一个npm包或者UMD库的声明文件，只有export导出的类型声明才能被导入，
如果导入此库之后会扩展全局变量，则需要使用另一种语法文件中扩展全局的类型，那就是
declare global

### declare global
使用 declare global 可以在npm包或者UMD库的声明文件中扩展全局变量
```ts
// types/foo/index.d.ts
    dclare global {
        inferface String {
            prependHello(): string;
        }
    }
    export {};
```
```ts
// src/index.ts
'bar'.perpendHello();
```

注意声明文件件不需要导出任何东西，仍然需要导出一个空对象，用来告诉编译器这是一个模块的声明文件，而不是一个
全局变量的声明文件

### 模块插件
有时候通过 import 导入一个模块插件，可以改变另一个原有模块的结构。此时如果原有模块已经有了类型声明文件，
而插件模块没有类型声明，就会导致类型不完整，缺少插件部分的类型。ts提供了一个语法 declare module,
它可以用来扩展原有模块的类型

### declare module
如果是需要扩展原有模块的话，需要在类型声明文件中先引用原有模块，再使用 declare module
```ts
// types/moment-plugin/index.d.ts
import * as moment from 'moment';

declare module 'moment' {
    export function foo(): moment.CalendarKey;
}
```
```ts
// src/index.ts
import * as moment from 'moment';
import 'moment-plugin';
moment.foo();
```

declare module   也可用于在一个文件中一次性声明多个模块
```ts
// types/foo-bar.d.ts
declare module 'foo'  {
    export interface Foo  {
        foo: string;
    }
}

declare module 'bar' {
    export function bar(): string;
}
```
```ts
// src/index.ts
import { Foo } from 'foo';
import * as bar from 'bar';

let f: Foo;
bar.bar();
```

### 声明文件中的依赖
一个声明文件有时会依赖另一个声明文件中的类型，比如在前面的declare module的例子中，我们就在声明文件中
导入moment，并且使用moment.Calendarkey

除了可以在声明文件中通过import导入另一个声明文件中的类型之外，还有一个语法可以导入别一个声明文件，
那就是三斜线指令

### 三斜线指令
与 namespace 类似，三斜线指令也是 ts 在早期版本中为了描述模块之间的依赖关系而创造的语法。随着 ES6 的广泛应用，现在已经不建议再使用 ts 中的三斜线指令来声明模块之间的依赖关系了。

但是在声明文件中，它还是有一定的用武之地。

类似声明文件中的 import ，它可以用来导入另一个声明文件。与import的区别是，当且仅当在几个场景下
我人才需要使用三斜线指令替代 import
1. 当我们在书写一个全局变量的声明文件时
2. 当我们需要依赖一个全局变量的声明文件时

### 书写一个全局变量的声明文件
这些场景听上去很拗口，但实际上很好理解--在全局变量的声明文件中，是不允许出现 import export 关键字的。
一旦出现，那么它就会被视为一个npm 包或 UMD库，就不再是全局变量的声明文件了。故当我们在书写一个全局变量
的声明文件时，如果需要引用另一个库的类型，那么就必须用三斜线指令了
```ts
// types/jquery-plugin/index.d.ts
/// <reference types="jqyery" />
delcare function foo(options: JQuery.AjaxSettings): string;
```
```ts
// src/index.ts
foo({})
```

三斜线指令的语法如上，在/// 后面使用xml的格式添加了对jquery类型的依赖

注意，三斜线指令必须放在文件的最顶端，三斜线指令前面只允许出现单行或多行注释

### 依赖一个全局文件的声明
在另一个场景下，当我们需要依赖一个全局变量的声明文件时，由于全局变量不支持通过import导入，当然也就必须使用三斜线
指令来引入了
```ts
// types/node-plugin/index.d.ts
/// <reference types="node" />
export function foo(p: NodeJS.Process): string;
```
```ts
// src/index.ts
import {foo} from 'node-plugin';
foo(global.process);
```

### 拆分声明文件
当我们全局文件太大时，可以通过拆分为多个文件，然后在一个入口中将它们引入，来提高代码的可维护性
```ts
// node_modules/@types/jquery/index.d.ts
/// <reference types="sizzle" />
/// <reference types="sizzle" />
/// <reference path="JQueryStatic.d.ts" />
/// <reference path="JQuery.d.ts" />
/// <reference path="misc.d.ts" />
/// <reference path="legacy.d.ts" />

exprot = jQuery;
```

其中types是用于声明对另一个库的依赖，而path是声明对另一个文件的依赖

### 自动生成声明文件
如果库的源码本身就是由ts写的，那么在使用 tsc 脚本将ts编译为js的时候，添加 declaration 选项，就可以
同时也生成.d.ts声明文件了

我们可以在命令行添加 --declaration (简写 -d)，或者在tsconfig.json 中添加 declaration选项
"declartion": true

delcarationMap 对每个.d.ts文件，都生成对应的 .d.ts.map(sourcemap)文件
emitDeclarationOlny 仅生成.d.ts 文件，不生成.js文件

### 发布声明文件
当我们为一个库写好了声明文件之后，下一步就是将它发布出去了
此时有两种方案
1. 将声明文件和源码放在一起
2. 将声明文件发布到@types 下

优先选择第一个

### 将声明文件和源码放在一起
如果声明文件是通过tsc自动生成的，那么就无需做任何其他的配置，只需要把编译好的文件发布到npm上

如果是手动写的声明文件，那么需要满足以下条件之一，才能正确认别
1. 给package.json中的types或typings 字段指定一个类型声明文件地址
2. 在项目根目录下，编写一个index.d.ts文件
3. 针对入口文件（package.json 中的main字段指定入口文件），编写一个同名不现后缀的.d.ts文件


```json
{
    "name": "foo",
    "version": "1.0.0",
    "main": "lib/index.js",
    "types": "foo.d.ts",
}
```
指定了types后 就会找types对应的文件

如果没有指定types或typings, 那么就会在根目录下寻找 index.d.ts文件，将它视为此库的类型声明文件

如果没有找到index.d.ts文件，那么就会寻找入口文件（package.json 中的main字段指定入口文件）
是否存在对应同名不同后缀的.d.ts文件
```ts
{
    "name": "foo",
    "version": "1.0.0",
    "main": "lib/index.js"
}
```

### 将声明文件发布到@types下

与普通的 npm 模块不同，@types 是统一由 DefinitelyTyped 管理的。要将声明文件发布到 @types 下，就需要给 DefinitelyTyped 创建一个 pull-request，其中包含了类型声明文件，测试代码，以及 tsconfig.json 等。
pull-request 需要符合它们的规范，并且通过测试，才能被合并，稍后就会被自动发布到 @types 下。


