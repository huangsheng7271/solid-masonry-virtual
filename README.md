# solid-masonry-virtual

## 简介

`solid-masonry-virtual` 是一个基于 SolidJS 构建的虚拟化瀑布流组件，提供高性能的列表渲染，尤其适用于大量数据的展示。

## 安装

```bash
npm install solid-masonry-virtual
```

## 使用

```typescript
import { Component } from 'solid-js';
import Masonry from 'solid-masonry-virtual/Masonry';

const MyComponent: Component = () => {
  const items = [
    // 你的数据数组，每个元素都应该包含渲染所需的信息
    { id: 1, height: 200, content: "Item 1" },
    { id: 2, height: 300, content: "Item 2" },
    // ...更多数据
  ];

  return (
    <Masonry
      items={items}         // 数据数组
      columnWidth={200}     // 每列的宽度
      gap={10}             // 元素之间的间隙
      calcItemHeight={(item) => item.height}  // 计算每个元素高度的函数
    >
      {(item, index) => (  // 渲染每个元素的函数
        <div style={{ height: item.height + 'px' }}>
          {item.content}
        </div>
      )}
    </Masonry>
  );
};

export default MyComponent;
```
更多的使用细节可以参考项目中example文件夹中的内容

## Props

| Prop | 类型 | 描述 | 默认值 |
|----------------|--------------------------|--------------------------------------------------------------|-------|
| items | any[] | 数据数组 | 必要 |
| columnWidth | number | 每列的宽度 | 必要 |
| gap | number | 元素之间的间隙 | 0 |
| calcItemHeight | (item: any) => number | 计算每个元素高度的函数 | 必要 |
| preloadScreenCount | number \| [number, number] | 预加载屏幕数量 | 1 |

## 特性

### 虚拟化

使用虚拟化技术，只渲染可视区域内的元素，从而提高性能。这意味着即使有成千上万的项目，也能保持流畅的滚动体验。

### 自定义渲染

通过子组件 (children) 可以自定义每个元素的渲染方式：
- 接收两个参数：item (当前数据项) 和 index (当前数据项的索引)
- 完全控制每个项目的渲染输出
- 支持任意的JSX结构

### 预加载

`preloadScreenCount` 属性控制预加载屏幕的数量：
- 可以是单个数字（上下相同的预加载量）
- 可以是数组 [top, bottom]，分别指定上下预加载量
- 默认值为 1，表示预加载一屏的内容
- 较大的预加载量可以提供更流畅的滚动体验，但会增加内存使用

## 开发

```bash
npm run dev
```

## 构建

```bash
npm run build
```

## 示例

查看 [在线示例](link-to-example) (请确保示例链接正确)

## 许可

MIT

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 更新日志

### 1.0.0
- 初始版本发布
- 实现基本的虚拟化瀑布流功能
- 支持自定义渲染和预加载