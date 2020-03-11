## NgModules
NgModules用于配置注入器（injector）和编译(compiler)，并帮你把那些相关的东西组织在一起

NgModule是一个带有@NgModule装饰器的类。@NgModule的参数是一个元数据对象，用于描述如何编译组件的模板，
以及如何在运行时创建注入器。它会标出该模块自已的组件、指令和很管道，通过exports属性公开其中的一部分，以便
外部组件使用它们。NgModule还能把一些服务提供商添加到应用有依赖注入器中


### Angular 模块化
模块是组织应用和使用外部库扩展应用的最佳途径

Angualr自已的库都是NgModule

NgModule把组件、指令和管道打包成内聚的功能块，每个模块聚焦于一个特性区域、业务领域、工作流或通用工具

模块还把服务加到应用中

模块可以急性加载也可以懒加载

NgModule的元素数：
```
    声明某些组件、指令、管道属性这个模块
    公开其中的部分组件、指令和管道，以便其他模块中的组件模板中可以使用它们
    导入其它带有组件、指令和管道的模块
    提供一些应用中的其它组件使用的服务
```

每个angular至少一个模块 也就是根模块


### JavaScript 模块
在js中，模块是内含js代码的独立文件 es6模块（import, export）

@NgModule装饰器的imports数组会告诉Angualr哪些其它的NgModule是当前模块所需要的

NgModule用于描述应用的各个部分如何组织在一起。每个应用有至少一个Angular模块

#### declarations数组
告诉Angular哪些组件属于该模块，
每个组件只能声明（declare）在一个NgModule类中。如果你使用未声明的组件，angluar就会报错

declarations 只接受可声明对象。可声明对象包括组件、指令、管道。一个模块的所有可声明对象都必须放在declarations数组中
可声明对象也必须只能属于一个模块，否则会报错

这些可声明模块在当前模块中是可见的，但是对其他的组件是不可见的--除非把它们从当前模块导出，并让对方模块导入本模块

#### imports数组
imports数组只会出现在@NgModule元数据中。它告诉Angular该模块还需要哪些模块才能正常工作

#### providers数组
providers列出了该应用所需的服务。当直接把服务列在这里时，它们的是全应用范围的。当你使用特性模块和惰性加载时，它们是范围化的

#### bootstrap数组

#### entryComponents 数组

### 特性模块
    特性模块是用来对代码进行组织的模块


