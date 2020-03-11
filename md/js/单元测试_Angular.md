# 测试环境
    使用Angular Cli来创建项目，默认已经集成所需要的npm包与脚本

    Angular单元测试我们可以将其分成两类：独立单独测试与Angular测试工具集

    Pipe与Service适合独立单独测试，因为它们只需要new实例类即可；同样是无法与Angular组件任何交互
    与这相反就是Angualr测试工具集

## 测试框架介绍
### Jasmine
    jasmine测试框架提供了编写测试脚本的工具集，而且非常优秀的语义化，让测试代码看起来像是在读一段话
### Karma
    有测试脚本，还需要Karma来帮忙管理这些脚本，以便于在浏览器中运行

### npm包
```
    "jasmine-core": "~2.5.2",
    "jasmine-spec-reporter": "~3.2.0",
    "karma": "~1.4.1",
    "karma-chrome-launcher": "~2.1.1",
    "karma-cli": "~1.0.1",
    "karma-jasmine": "~1.1.0",
    "karma-jasmine-html-reporter": "^0.2.2",
    "karma-coverage-istanbul-reporter": "^0.2.0"
```

### 配置脚本
    我们的核心是需要让karma运行器运行起来，而对于jasmine,是在我们编写测试脚本时才会使用到

    因此我们要在根目录创建karma.conf.js文件，这相当于一些约定。文件是为了告知karma需要启动哪些插件、加载哪些测试脚本、
    需要哪些测试浏览器环境、测试报告通知方式、日志等
```javascript
// Angular cli 默认提供的karma配置文件
module.exports = function(config) {
    config.set({
        basePath: '', // 基础路径（适用file、exclude属性）
        frmaeworks: ['jasmine', '@angular/cli'], // 测试框架 @angular/cli 指Angular测试工具集
        // 加载插件清单
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('@angular/cli/plugins/karma')
        ],
        client: { // 当测试完成后是否清除上文
            clearContext: false,
        },
        files: [
            {pattern: './src/test.ts', watched: false}
        ],
        // 允许文件到达浏览器之前进行一些预处理操作
        // 非常丰富的预处理器：https://www.npmjs.com/browse/keyword/karma-preprocessor
        preprocessors: {
            './src/test.ts': ['@angular/cli']
        },
        // 指定请求文件MIME类型
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
        // 插件【karma-coverage-istanbul-reporter】的配置项
        coverageIstanbulReporter: {
            // 覆盖率报告方式
            reports: ['html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },
        // 指定angular cli环境
        angularCli: {
            environment: 'dev'
        },
        // 测试结果报告方式
        reporters: config.angularCli && config.angularCli.codeCoverage ?
            ['progress', 'coverage-istanbul'] :
            ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        // 日志等级
        logLevel: config.LOG_INFO,
        // 是否监听测试文件
        autoWatch: true,
        // 测试浏览器列表
        browsers: ['Chrome'],
        // 持续集成模式，true：表示浏览器执行测试后退出
        singleRun: false
    });
}
```

以上配置基本可以满足需求，要变动的一般是浏览器列表，karma支持所有市面上的浏览器
当你使用 Travis CI 持续集成时，启动一个禁用沙箱环境Chrome浏览器会让我们少了很多事：

### test.ts
在编写karma.conf.js时，我们配置过浏览器加载文件指向的是./src/test.ts文件。作用是为了引导karma启动
```typescript
    import 'zone.js/dist/long-stack-trace-zone';
    import 'zone.js/dist/proxy.js';
    import 'zone.js/dist/sync-test';
    import 'zone.js/dist/jasmine-patch';
    import 'zone.js/dist/async-test';
    import 'zone.js/dist/fake-async-test';
    import { getTestBed } from '@angular/core/testing';
    import {
        BrowSerDynamicTestingModule,
        platformBrowsDynamicTesting
    } from '@angular/platform-browser-dynamic/testing';


    // Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
    declare var __karma__: any;
    declare var require: any;

    // Prevent Karma from running prematurely.
    __karma__.loaded = function () {};

    // First, initialize the Angular testing environment.
    getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
    );
    // Then we find all the tests.
    // 所有.spec.ts文件
    const context = require.context('./', true, /\.spec\.ts$/);
    // And load the modules.
    context.keys().map(context);
    // Finally, start Karma to run the tests.
    __karma__.start();

```
一切就绪后，我们可以尝试启动 karma 试一下，哪怕无任何测试代码，也是可以运行的。

如果是Angular Cli那么 ng test。折腾的用 node "./node_modules/karma-cli/bin/karma" start

最后，打开浏览器：http://localhost:9876，可以查看测试报告。

## 简单示例
创建./src/demo.spec.ts文件。
```typescript
describe('demo test', () => {
    it ('shoudl be true', () => {
        expect(true).toBe(true);
    })
});
```
运行后
```
Chrome 58.0.3029 (Windows 10 0.0.0): Executed 1 of 1 SUCCESS (0.031 secs / 0.002 secs)
```
或者浏览器
```
1 spec, 0 failures
demo test
  true is true
```

## Angular测试工具集
普通类诸如Pipe或service，只需要通过简单的new创建实例。而对于指令、组件而言，耍要一定的环境。这是因为Angular的模块
概念，要想组件能运行，首先得有一个@NgModule定义

常用工具集

### TestBed
TestBed就是Angular测试工具集提供的用于构建一个@NgModule测试环境模块。当然有了模块，还需要利用
TestBed.createComponent创建一个用于测试目标组件的测试组件

### 异步
Angular 到处都是异步，而异步测试可以利用async、fakeAsync编写优雅测试代码看着是同步



### Test Suite
测试套件，哪怕一个简单类，也会有若干的测试用例，因此将这些测试用例集合在一个分类之下就叫 Test Suite

而在Jasmine就是使用describe全局函数来表示，它的第一个字符串参数用来表示Suite的名称或标题，第二个方法参数就是实现Suite代码
```typescript
describe('test suite name', () => {});
```

### Specs
一个Specs相当于一个测试用例，也就是我们实现测试具体代码体

Jasmine就是使用it全局函数来表示，和describe类似，字符串和方法两个参数
而每个Spec内包括多个expectation来测试需要测试的代码，只要任何一个expectation结果为false就表示该测试用例为失败状态
```typescript
describe('demo test', () => {
    const VALUE = true;
    it('should be true', () => {
        expect(VALUE).toBe(VALUE);
    })
});
```

### EXpections
断言，使用expect全局函数来表示，只接收一个代表要测试的实际值，并且需要与Matcher代表期望值

### Matchers
断言匹配操作，在实际值与期望值之间进行比较，并将结果通知Jasmine，最终Jasmine会判断此Spec成功还是失败

Jasmine提供的API,一些常用的Mathchers
```
toBe() // 等同 ===
toNotBe() // 等同 !==
toBeDefind() // !== undefined
toBeUndefined() // === undefined
toBeNull() // === null
toBeTruthy() // !!obj (Truthy 真相)
toBeFalsy() // !obj
toBeLessThan() // <
toBeGreaterThan() // >
toEqual() // ==
toNotEqual() // !==
toContain() // indexOf
toBeCloseTo() // 数值比较时定义精度，先四舍五入再比较
toHaveBeenCalled() // 检查function是否被调用
toHaveBeenCalledWith() // 检查传入参数是否被调用
toMatch() // 等同 new RegExp().test();
toNotMatch() // 等同 !newRegExp().test();
toThrow() // 检查function是否会抛出一个错误

```
而这些API之前用not表示负判断
```
expect(true).not.toBe(false);
```

### Setup Teardown
一份干静的代码很重要，因此我们可以将这些生重复的setup与teardown代码，放在与之相对应的beforeEach与afterEach全局函数里

beforeEach表每个Spec执行之前，反之
```typescript
    describe('demo test', () => {
        let val: number = 0;
        beforeEach(() => {
            val = 1;
        });
        it('should be true', () => {
            expect(val).toBe(1);
        });
        it('should be false', () => {
            expect(val).not.toBe(0);
        })
    })
```

### 数据共享
如同上面示例中，我们可以在每个测试文件开头、describe来定义相应的变量，这样每个it内部可以共享它们

当然，每个Spec的执行周期也会伴随着一个空的this对象，直至Spec执行结束后被清空，利用this也可以做数据共享

### 嵌套代码
有时候当我们对某个组件进行测试时，而这个组件会有不同状态来展示不同的结果，这个时候如果只用一个describe会显得不够优雅

因此，嵌套describe,会让测试代码、测试报告看起来更漂亮
```typescript
describe('AppComponent', () => {
    describe('Show user', () => {
        it('should be show panel', () => {});
        it('should be show avatar.', () => {});
    });
    describe('Hidden User', () => {
        it('should be hidden panel.', () => {});
    })
})
```

### 跳过测试代码块
Suites的Specs分别可以用xdescribe和xit全局函数来跳过这些测试代码块

### Spy
Angular有许多自定义事件，为了测试这些自定义事件，监控事件是否被正常调用很重要，Spy可以用于监测函数是否被调用
```typescript
    describe('AppComponent', () =>{
        let fixture: ComponentFixture<TestComponent>;
        let context: TestComponent;
        beforEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestComponent]
            });
            fixture = TestBed.createComponent(TestComponent);
            context = fixture.componentInstance;

            sypOn(context, 'onSelected'); // 监听onSelected方法
            fixture.detectChanges();
        });

        it('should be called [select] event', () => {
            // 触发selected操作

            // 断言是否被调用过
            expect(context.onSelected).toHaveBeenCalled();
        })
    })
```

### 异步技持
这里的异步是指带有Observable 或Promise的异步行为，因此对于组件在调用某个Service来异步获取数据时的测试状态

假设下面是待测试代码
```typescript
    export class AppComponent {
        constructor (private _ueser: UserService) {}
        query() {
            this._user.quer().subscribe(() => {})
        }
    }
```

### async
async无任何参数与返回值，所有包裹代码块里的测试代码，可以通过调用whenStable()让所有待处理异步行为都完成后在进行回调；
最后再进行断言操作
```typescript
it('shold be get user list(async)', async(() => {
    fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(true).toBe(true);
    });
}))
```

### fakeAsync
async需要回调才能进行断点， fakeAysnc可以解决这一点
```typescript
it ('shold be get user list(async)', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    expect(true).toBe(true);
}))
```
这里只是将回调换成tick()，

### Jasmine自带导步
上面所说的异步指带有Observable或Promise的异步行为，而有时候我们有些东西是依赖setTimeout或者需要外部订阅结果以后
才能触发

可以使用done()方法。
```typescript
it('async demo', (done: () => void) => {
    context.show().subscribe(res => {
        expect(true).toBe(true);
        done();
    })
    el.querySelected('xxx').click();
});

```

