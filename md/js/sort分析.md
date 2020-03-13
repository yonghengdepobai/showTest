## sort源码分析

```js

function ArraySort(comparefn) {

    // In-place QuickSort algorithm. 快速排序算法
    // For short (length <= 22) arrays, insertion sort(插入排序) is used for efficiency（效率）. 

    var custom_compare = IS_FUNCTION(comparefn); // 传入的参数是不是一个方法

    function Compare(x, y) {
        if (x === y) {return 0;}

        if (custom_compare) {
            // Don't call directly(直接) to avoid（避免） exposing (暴露) the builtin's global object.
            return comparefn.call(null, x, y);
        }

        if (%_IsSmi(x) && %_IsSmi(y))


    }
}


```

## 插入排序
插入排序是一种简单直观且稳定的排序算法
插入排序就是将要插入的数组当做是一个有序数组
```js
function insertions(arr) {
    // 25361
    for (let i = 1; i < arr.length; i++) {
        let w = i;
        while(w > 0) { // 找到要插入的位置 在进行插入
             w--;
            if (arr[i] > arr[w]) {
                // 操作数据
                if(w == i - 1) {
                    break;
                }
                arr.splice(w + 1, 0, arr[i]);
                arr.splice(i + 1, 1);
                break;
            }
            if (w == 0) {
                arr.splice(w, 0, arr[i]);
                arr.splice(i + 1, 1);
                break;
            }
        }
    }
    return arr;
}

function Insertions (arr) {
    let len = arr.length;
    let preIndex, current;
    for (let i = 1; i < len; i++) {
        preIndex = i - 1;
        current = arr[i];
        while(preIndex >= 0 && current < arr[preIndex]) {
            // 如果比它前的数小就让前面的数往外移
            arr[preIndex++] = arr[preIndex];
            preIndex--;
        }
        arr[preIndex + 1] = current;
    }
    return arr;
}

```

### 快速排序
快速排序是对冒泡排序的一种改进
快速排序它的基本思想是：通过一趟排序将排序的数据分割成独立的两部分，其中一部分的所有数据都比另外一部分的所有数据都要小，
然后再按此方法对两部分数据分别进行快速排序，整个排序过程可以递归进行，以此达到整个数据变成有序充列

### 排序流程
1. 首先设定一个分界值，通过该分界值将数组分成左右两个部分。
2. 将大于或等于分界值的数据集中到数组右边，小于分界值的数集中到数组的左边
3. 左边和右边的数据可以独立排序。
4. 重复上述过程

```js
var arr = [3,5,7,1,4,56,12,78,25,0,9,8,42,37];
function QuickSort(quickarr) { // 一个基础的快速排序 不会改变原数组
    // arr 是传的一个地址
    function setLR(sarr) {
        if (sarr.length <= 1) {return sarr;}
        let L = [], R = [];
        let middel = Math.floor(sarr.length / 2);
        let temp = sarr.splice(middel, 1)[0];
        for (let i = 0; i < sarr.length; i++) {
            if (sarr[i] < temp) {
                L.push(sarr[i]);
            } else {
                R.push(sarr[i])
            }
        }
        return setLR(L).concat(temp, ...setLR(R));
    }
    let backArr;
    backArr = setLR(quickarr.slice(0)); // setLR(arr)返回了一个新的数组
    // quickarr = setLR(arr) 是quickarr指向一个新的地址 原地址的数据arr没有被改变
    // 怎么去改变原
    // 自已去循环改原数组 如果有需要
    for (let i = 0; i < quickarr.length; i++) {
        quickarr[i] = backArr[i];
    }
    return quickarr;
}

```

网上看到的一个原地交换不用在L,R容器的排序
```js
    function changeLR(array, start, end) { // 确定基数 并把两边的大小整理好
        if (start >= end) {return array}
        var baseIndex = Math.floor((start + end) / 2);
        i = start; j = end;
        while(i <= j) {
            // 从头开始把到不比基数小的
            while(array[i] < array[baseIndex]) {
                i++;
            }
            // 从尾开始把到不比基数大的
            while(array[j] > array[baseIndex]) {
                j--;
            }
            if (i <= j) { // 如果两边的下标还在两边 交换他们
                let temp = array[i];
                array[i] = array[j];
                array[j] = temp;
                i++; j--;
            }
        }
        return i;
    }

    function quickSort(array, start = 0, end = array.length - 1) {
        if (array.length < 1) {
            return array;
        }
        // 进来确定基数
        let index = changeLR(array, start, end);
        if (start < index - 1) {
            quickSort(array, start, index - 1);
        }
        if (end > index) {
            quickSort(array, index, end);
        }
        return array;

    }

```

