# 单元测试
    单元就是一个相对独立的功能模块，可以是一个类，或是一个模块，或是一个方法
    单元测试的目的，就是首先保证一个系统的基本组成单元（类、模块或方法）能正常工作。
    所谓‘测试框架’，就是运行测试的工具。通过它，可以为javascript应用添加测试，从而保证代码的质量

```javascript
var expect = require('chai').expect; // 引入断言库 这里用的是Mocha 它本身不带有断言库

describe('expect', function() {
    it ('4 + 9 应该等于 13', function() {
        expect(4 + 9).to.be.equal(13); // 这个就是断言。所谓断言就是判断源码的实际执行效果结果与预期是否一致，
                                      // 如果不一致就抛出一个错误 一致这个测试就通过了
        // 其他的一些语句
        // 相等或不相等
        expect(4 + 5).to.be.not.equal(10);
        expect(foo).to.be.deep.equal({bar, 'baz'})

        // 布尔值为true
        expect('everthing').to.be.ok;
        expect(false).to.be.ok;

        // typeof
        expect('teset').to.be.a('string');
        expect({foo: 'bar'}).to.be.an('object');
        expect(foo).to.be.an.instanceof(Foo);

        // include
        expect([1, 2, 3]).to.include(2);
        expect(['foobar']).to.contain('foo');
        expect({foo: 'bar', hello: 'universe'}).to.include.keys('foo')

        // empty
        expect([]).to.be.empty;
        expect('').to.be.empty;
        expect({}).to.be.empty;

        // match
        expect('foobar').to.match(/^foo/)


    })
});

```
    上面这代段代码就是测试脚本，它可以独立执行。脚本包括一个或多个describle，每个describe块包括一个或多个if块

    describe块称为’测试套件‘，表示一个单独的测试，是测试的最小单位。它也是一个函数，第一个参数是测试用例的名称，第二个
    参数是实际执行的函数

    所有测试用例都应该含有一个或多个断言。断言由断言库来实现

    demo
```javascript
    // calculate.js
    var calculate = {
        add: function(a, b) {
            return a + b;
        },
        divide: function(a, b) {
            return a / b;
        }
    }

    module.exports = calculate;

    // calcuate.spec.js
    var calculate = require('./calcuate');
    var expect = require('chai').expect;

    describe('Calculate', function() {
        describe('#calculate', function) {
            it ('return add result', function() {
                expect(calculate.add(1, 2).to.be.equal(3));
            });
            it ('return divide result', function() {
                expect(calculate.divide(2, 2)).equal(1);
            });
        }
    });

```


