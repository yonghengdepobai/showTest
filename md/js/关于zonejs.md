
## zone
Zone是一个在异步任务间保持一致的执行环境。 可以把它理解成JavaScript VM 的线程本地存储

### 原理
原来zone.js 覆写了一些window原型上的函数，换之以一些代理函数。
这意味着在加载zone.js脚本之后发出的任何事件或是创建的任何promise都是被代理函数封装过的。
这个概念叫做猴子补丁(Monkey-patched)

### 猴子补丁（Monkey-patched）
所谓的猴子补丁，是指在运行时修改类或模块，而不去改变源码的，达到hot patch的目的
是一种很脏的编程技巧，用拼凑代码的方法修改程序逻辑。
只能在动态语言中实现


### Zone.js启动时执行逻辑的抽象代码片段
```js
    function zoneAwareAddEventListener() {}
    function zoneAwareRemoveEventListener() {}
    function zoneAwarePromise() {}
    function patchTimeout() {}

    window.prototype.addEventListener = zoneAwareAddEventListener;
    window.prototype.removeEventListener = zoneAwareRemoveListener;
    window.prototype.promise = zoneAwarePromise;
    window.prototype.setTimeout = patchTimeout;
```

### 关于zoneAwareAddEventListener
```js

    element.addEventListener(event, function, useCapture);
    var SYMBOL_ADD_EVENT_LISTENER = exports.zoneSymbol(ADD_EVENT_LISTENER);

    function zoneAwareAddEventListener(self, args) {
        var eventName = args[0];
        var handler = args[1];
        var useCaptuing = args[2] || false;

        // - Inside a Web Worker, `this` is undefined, the context is `global`
	    // - When `addEventListener` is called on the global context in strict mode, `this` is undefined
        var target = self || _global;

        var delegate = null; // delegate 委托

        if(typeof handler == 'function') {
            delegate = handler;
        } else if (handler && handler.handleEvent) {
            delegate = function (event) {return hanlder.handleEvent(event); };
        }
        var validZoneHandle = false;
        try {
             // In cross site contexts (such as WebDriver frameworks like Selenium),
	        // accessing the handler object here will cause an exception to be thrown which
	        // will fail tests prematurely.
            validZoneHandle = handler && handle.toString() === 'object FunctionWrapper';
        }
        catch(e) {
            // Returning nothing here is fine, because objects in a cross-site context are unusable
            return;
        }

        // Ignore special listeners of IE11 & Edge dev tools,
        if (!delegate || validZoneHandle) {
            return target[SYMBOL_ADD_EVENT_LISTENER](eventName, handler, useCaptuing);
        }

        var eventTask = findExistingRegisterdTask(target, handler, eventName, useCapturing, false);

        var (eventTask) {
            // we already registered, so this will have noop.
            return target[SYMBOL_ADD_EVENT_LISTENER](eventName, eventTask.invoke, useCapturing);
        }

        var zone = Zone.current;
        var source = target.constructor['name'] + '.addEventListener:' + eventName;

        var data = {
            target: target,
            eventName: eventName,
            useCapturing: useCapturing,
            handler: handler,
        }

        zone.scheduleEventTask(source, delegate, data, scheduleEventListener, cancaelEventListener)

    }
```

