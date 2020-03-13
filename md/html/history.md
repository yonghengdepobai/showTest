### pushState和replaceState
pushState和replaceState是一个HTML5的新接口，他们的非常大，可以做到改变网址去不需要刷新页面。

### Hash
hash属性是一个可读写的字符串，该字符串是URL的锚部分（从#号开始的部分），在页面中的hash有多种功能意义

### 锚点
```
url: http://www.example.com/index.html#jump
dom: <a name='jump'></a> 或者<div id='jump'></div>
```
浏览器读取到hash之后自动滚动到该对应元素所在位置的可以视区域

### 不附加在请求上
意味着它不管怎么变化都不会影响到请求URL，即它只针对浏览器

### 思路
当URL的片段标识符更改时，将确发hashchange事件（跟在#符号后面的URL部分，包括#符号），然后根据hash值
做些路由跳转处理

最基本的路由实现方法就是监听事件根据location.hash判断界面

### History
DOM window对象通过history对象提供了对浏览器的会话历史的访问。它显露了很多有用的方法和属性，
允许你在用户浏览历史中向前和后跳转

### 向前和向后跳转
```
window.history.back();
window.history.forward();
```

### 跳转到history中指定的一个点
你可以用go()方法载入到会话历史中的某一特定页面，通过与当前页面相对位置标志（当前页面的相对位置标志为0）
```
window.history.go();
```

### 添加历史记录中的条目
不会立即加载页面的情况下改变了当前URL，往历史记录添加一条条目，除非刷新页面等操作
```
history.pushState(state, title, URL);
```

state 对象状态
state是一个JaveScript对象，popstate事件的state属性包含该历史记录条目状态对象的副本
状态对象可以是能被序列化的任何东西。原因在于Firefox将状态对象保存在用户的磁盘上，以便在用户
重启浏览器时使用，我们规定了状态对象在序列化表示后有640k的大小限制。如果你给pushState()方法传了一个
序列化后大于640k的状态对象，该方法会抛出异常。如果你需要更大的空间，建议使用sessionStorage
以及localStorage

title标题
Firefox目前忽略这人参数，但未来可能会用到。在此处传一个空字符串应该可以安全防范未来这个方法的更改
或者也可以传一个短标题

URL
新历史的URL记录。新URL不必为绝对路径。如果新URL是相对路径，那么它将被作为相对于当前URL处理。
新的URL必须与当前URL同源，否则pushState()会抛出异常。该参数是可选的，缺省为当前的URL

### 更改历史记录中的当前条目
不会立即加载页面的情况下改变了当前URL地址，并改变历史记录的当前条目
```
history.replace(state, title, URL);
```

### popstate事件
每当活动的历史记录项发生变化时，popstate事件都会被传递给window对象。如果当前活动的历史记录项是被pushState
或replaceState改变的，那么popstate事件的状态属性state会包含一个当前历史记录状态的对象的拷贝

获取当前状态
页面加载时，或许会有个非null的状态对象。这是有可能发生的，举个例子，假如页面（通过pushState() 或 replaceState() 方法）设置了状态对象而后用户重启了浏览器。那么当页面重新加载时，页面会接收一个onload事件，但没有 popstate 事件。然而，假如你读取了history.state属性，你将会得到如同popstate 被触发时能得到的状态对象。

你可以读取当前历史记录项的状态对象state，而不必等待popstate 事件
