
### beforeEach
beforeEach 非常的关键，所有的一切都需要它的引导

beforeEach目的为了简化测试代码，将重复的工作放在这

当我们需要写一段Angular单元测试时，是需要先提供一个测试模块的，即使用
TestBed.configureTestModule来构建，Angular工具集提供的用于快速创建一个测试NgModule，
他接受的参数和NgModule并无任何差异

```typescript
beforEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpModule],
        declarations: [TestComponent]
    })
});

beforeEach(async(() => { // angluar5
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

```