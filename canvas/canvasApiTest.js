/**
 * css 渐变
 * // 从左到右渐变
 * background: linear-gradient(left, red 0%, #0f0 20%, rgb(51, 102, 255) 50%, rgba(204, 255, 0, 0.8) 100%)
 * 
 * // 45deg 表示从左上到右下进行渐变
 * background: linear-gradient(45deg, red 0%, #0f0 20%, rgb(51, 102, 255) 50%, rgba(204, 255, 0, 0.8) 100%)
 * 
 * // 以渐变原点为中心
 * background: linear-gradient(45deg, red 0%, #0f0 20%, rgb(51, 102, 255) 50%, rgba(204, 255, 0, 0.8) 100%)
 * 
 * // 原点在左下 渐变形状为椭圆
 * background: linear-gradient(bottom left, ellipse, red 0%, #0f0 20%, rgb(51, 102, 255) 50%, rgba(204, 255, 0, 0.8) 100%)
 * 
 * // 渐变在左下 渐变形状为圆形
 * background: linear-gradient(bottom left, circle, red 0%, #0f0 20%, rgb(51, 102, 255) 50%, rgba(204, 255, 0, 0.8) 100%)
 * 
 */

 /**
  * 获取鼠标相对于canvas的位置的方法
  * 　1）e.offsetX 、e.offsetY
　　2）e.layerX 、 e.layerY
　　3）e.clientX - canvas.getBoundingClientRect().left 、e.clientY - canvas.getBoundingClientRect().top
  */
var canvas = document.createElement('canvas');

var ctx = canvas.getContext('2d');

function drawPlane(ctx, mx, my) {
    let x = mx + this.px, y = my + this.py
    ctx.strokeStyle = 'white'; // 画线颜色
    ctx.lineJoin = 'round'; // 两个线条交叉的拐角类型  miter尖角（默认）bevel 斜角 round 圆角
    ctx.lineCap = 'round'; // 设置返回线条的结束端点样式 butt 默认 round 添加圆形线帽 square添加矩形线帽
    ctx.miterLimit = 6; // 规定最大斜接长度
    ctx.moveTo(x, y); // 移动这个点（没开始画）
    ctx.lineTo(x - this.width, y + this.height); // 画线到点这个
    ctx.lineTo(x + this.width, y + this.height);
    ctx.closePath(); // 让画笔回到起点
    // ctx.lineTo(x, y);
    ctx.stroke(); // 画
    // ctx.fill(); // 填充

    // ctx.strokeStyle = 'red'; // 画线颜色
    ctx.beginPath();
    ctx.moveTo(x, y + this.speed + this.height);
    ctx.lineTo(x - this.swidth, y + this.height );
    ctx.moveTo(x, y + this.speed + this.height);
    ctx.lineTo(x + this.swidth, y + this.height );
    ctx.lineWidth = 3; // 线条的宽度
    // ctx.fillRect(x, y, 50, 50); // 填充一个矩形 前两个是坐标 后两个是长宽
    // ctx.strokeRect(x, y, 50, 50); // 画一个空心矩形
    // ctx.fillText('画一个填充文字', x, y); // 起始坐标
    // ctx.strokeText('画一个描边文字',x, y); // 
    // ctx.textBaseline = 'bottom'; // 设置文字的基线
    // ctx.font = '20px Arial'; // 文字样式
    ctx.closePath();
    ctx.stroke(); // 开始画 stroke画

    ctx.beginPath();
    // arc(x,y,r,sAngle,eAngle,counterclockwise) 画圆 
    ctx.strokeStyle = 'cyan';
    // sAngle 开始弧度 eAngle 结束弧度 counterclockwise 表示顺时针还是逆时针
    ctx.arc(200, 200, 50, 0, 360 * Math.PI / 180, false);
    ctx.stroke();

    // arcTo(x1,y1,x2,y2,r) 创建两个切线之间的弧/曲线
    // quadraticCurveTo(cpx,cpy,x,y)  二次贝塞尔曲线 cpx,cpy 表示第一个控制点，x,y 表示结束点
    // 从起始点出发，曲线越靠近控制点，曲线越陡，然后慢慢远离控制点，曲线随即越来越平缓，直到结束点，并且此曲线会与起始点和结束点相切

    // bezierCurveTo(cpx1,cpy1,cpx2,cpy2,x,y)  三次贝塞尔曲线 cpx1,cpy1表示第一个控制点，cpx2,cpy2表示第二个控制点  x,y表示结束点

    // 渐变

    // createLinearGradient(x1,y1,x2,y2)   创建线性渐变
    // 参数：x1,y1 表示渐变起始点   x2,y2 表示渐变结束点

    // createRadialGradient(x1,y1,r1,x2,y2,r2)  创建径向渐变
    // 参数：x1,y1 表示渐变开始圆心坐标，r1表示渐变开始圆的半径  x2,y2 表示渐变结束圆心坐标，r2表示渐变结束圆的半径 

    // 添加渐变颜色
    // gradient.addColorStop(stop,color)  规定gradient 对象中的颜色和位置
    // 参数： stop 取值0-1之间，表示渐变中开始与结束之间的位置   color表示渐变颜色

    // canvas凡是设置样式的，必须放在绘图前面 *****

    var line = ctx.createLinearGradient(50,50,200,50);
        line.addColorStop(0,'red');
        line.addColorStop(0.2 ,'#0F0');
        line.addColorStop(0.5 ,'rgb(51,102,255)');
        line.addColorStop(1 ,'rgba(204,255,0,0.8)');
        
        ctx.fillStyle = line;
        ctx.fillRect(50,50,200,50);

        // globalAlpha = num    参数：num取值0-1之间   设置或返回绘图的当前透明值
        ctx.globalAlpha = 0.5;
        // 这是一个全局透明的 为了处理这个可用下面的
        // context.save()   保存当前环境的状态
        // context.restore() 返回之前保存过的路径状态和属性
        // 当设置了save()方法，就相当于将后面的绘图放在一个堆栈中，与世隔绝，知道看到restore()，就返回到原来的位置

    // transiton
    // scale(scaleWidth,scaleHeight)  缩放当前绘图
    ctx.strokeStyle = 'red';
    ctx.strokeRect(5,5,50,50);
    ctx.scale(2,2);
    ctx.strokeRect(5,5,50,50);
    ctx.scale(2,2);
    ctx.strokeRect(5,5,50,50);
    // 它不是从定位的原点开始缩放的，而是偏移了原点，实际上是不仅仅是图形缩放了，就连图形的边距也缩放了，且缩放的倍数与图形倍数一致

    // 原因是canvas本身是有默认宽高的（宽300，高150），如果在css中设置宽高，会让canvas认为，现在canvas的宽度倍自动缩放了，
    // 缩放比例为css设置的宽度/300，高的也一样，那么就可以理解了，现在css设置的宽度是300，高的是300，那么就会缩放宽=300/300，
    // 高缩放=300/150，高的自然就被拉高了一倍，所以这才是必须在canvas的属性上设置宽高的原因

    // rotate(angle)  旋转当前绘图  参数：angle表示旋转角度，这里需要填写弧度
    ctx.fillStyle = 'red';
    ctx.fillRect(0,0,150,50);
    ctx.beginPath();
    ctx.rotate(30*Math.PI/180);
    ctx.strokeRect(0,0,150,50);
    ctx.closePath();
    // canvas的旋转原点并不是以自身的中心为原点，而是以画布的左上角为原点
    // 图形的旋转原点也不是其自身的中心，而是其左上角为原点

    // translate(x,y)  重新映射画布上的 (0,0) 位置，这怎么理解？通俗的将，就是重新定义坐标原点，默认原点是（0,0），用此方法会将原点改成（x,y）
    ctx.fillRect(10,10,100,100);
    //设置新原点
    ctx.translate(110,110);
    ctx.fillRect(10,10,100,100);

    // transform(a,b,c,d,e,f)   替换当前的变换矩阵
    // 参数：
    // a：水平缩放绘图
    // b：水平倾斜绘图
    // c：垂直倾斜绘图
    // d：垂直缩放绘图
    // e：水平移动绘图
    // f：垂直移动绘图
    ctx.fillRect(10,10,100,100);
    //缩放
    ctx.transform(2,0,0,2,0,0);
    ctx.fillStyle="red";
    ctx.fillRect(10,10,100,100);


//     setTransform(a,b,c,d,e,f)  当前的变换矩阵重置为单位矩阵，用法与transform相同
    // 参数：
    // a：水平缩放绘图
    // b：水平倾斜绘图
    // c：垂直倾斜绘图
    // d：垂直缩放绘图
    // e：水平移动绘图
    // f：垂直移动绘图


    // drawImage()  在画布上绘制图像，画布或视频
    // drawImage(img,x,y) 在画布上定位一张图片
    // img在这里表示的是图片的对象而不是图片的路径，说明不能直接来引用图片，而是需要操作DOM的方式来引用
    var oImg = document.getElementById("img");
    ctx.drawImage(oImg,10,10);

    // drawImage(img,x,y,w,h)  在画布上定位图片，并规定图片的宽高

    // drawImage(img,sX,sY,sWidth,sHeight,x,y,width,height)  剪切画布，并在画布上定位被剪切的部分
    // img 表示引入的图片对象，sX,sY表示剪切的其实坐标，sWidth,sHeight表示剪切的宽度和高度，x,y表示在画布上放置图片的坐标 ，width,height表示需要使用的图片的宽高


    // drawImage(video,x,y,w,h)  在画布上定位视频，并规定视频的宽高
    var oVideo = document.getElementById("video1");
    ctx.drawImage(oVideo,10,10,270,135);
    // video表示引入是视频对象 ，x,y表示视频引入的坐标 ，w,h表示规定视频的大小
    // 其实这里跟引入图片是一样的，只不过它是可以引入视频的，但是这里的引入只是视频的某一帧，所以，当我们直接引入时，是没有什么反应的：

    var timer = setInterval(function(){
        ctx.drawImage(oVideo,10,10,270,135);
    },20); // 这样图片就动起来了

    // clip() 从原始画布中剪切任意形状和尺寸

    // ps:一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）。
    // 您也可以在使用 clip() 方法前通过使用 save() 方法对当前画布区域进行保存，并在以后的任意时间对其进行恢复（通过 restore() 方法）。


    // getImageData(x,y,w,h)  拷贝画布指定矩形的像素数据 
    // 参数：x,y表示开始复制的左上角的坐标  w,h表示将要复制的区域大小
    // 参数很好理解，就是在什么地方复制多大一个地方，而且它返回一个ImageData对象，ImageData对象里面包含了几个参数：
    // data：数组集合  width ：对象的宽度  height：对象的高度

    // putImageData(imageData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight)  方法将图像数据（从指定的 ImageData 对象）放回画布上
    // 参数： 
    // imageData指创建或获取的imageData对象 
    // x,y表示imageData对象的左上角坐标  
    // dirtyX,dirtyY 表示在画布上放置图像的坐标，以像素计，可选
    // dirtyWidth,dirtyHeight 表示在画布上放置的图形大小，可选


    //     createPattern(image,"repeat|repeat-x|repeat-y|no-repeat")  在指定的方向上重复指定的元素
    // 参数： image指实用的图片，画布或者是视频对象 第二个参数表示重复的方式





}