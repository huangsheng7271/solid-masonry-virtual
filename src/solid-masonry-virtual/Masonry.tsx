import { Component, createEffect, createSignal, For, JSX, mergeProps, untrack } from "solid-js";
import { useElementBounding, useElementSize } from "solidjs-use";

interface MasonryOption {
  // 是否启用虚拟列表
  virtual?: boolean
  rowKey?: string
  // item间隔
  gap?: number
  // 容器内边距
  padding?: number | string
  // 预加载屏数量 [top, bottom]
  preloadScreenCount?: [number, number]
  // item最小宽度
  itemMinWidth?: number
  // 最大列数
  maxColumnCount?: number
  // 最小列数
  minColumnCount?: number
  // 数据
  items?: any[]
  // 计算单个item高度的方法
  calcItemHeight?: (item: any, itemWidth: number) => number
  // 子组件
  children?: (item:any) => JSX.Element;
}

const Masonry: Component<MasonryOption> = (props) => {
  const merged = mergeProps({
    virtual: true,
    rowKey: 'id',
    gap: 15,
    padding: 15,
    preloadScreenCount:[0, 0],
    itemMinWidth: 220,
    maxColumnCount: 10,
    minColumnCount: 2,
    items: [],
    calcItemHeight: (item: any, itemWidth: number) => 250,
  }, props);

  const [ content, setContent ] = createSignal<HTMLDivElement>();
  const { width: contentWidth } = useElementSize(content)
  const { top: contentTop } = useElementBounding(content)

  const isNumber = (value: any): boolean => {
    return Object.prototype.toString.call(value) === '[object Number]';
  }

  // 计算列数
  const columnCount = () => {
    if (!contentWidth()) {
        return 0
    }
    const cWidth = contentWidth()
    if (cWidth >= merged.itemMinWidth * 2) {
        const count = Math.floor(cWidth / merged.itemMinWidth)
        if (merged.maxColumnCount && count > merged.maxColumnCount) {
            return merged.maxColumnCount
        }
        return count
    }
    return merged.minColumnCount
  }

  // 每列距离顶部的距离
  let columnsTop = new Array(columnCount()).fill(0);

  // 计算每个item占据的宽度: (容器宽度 - 间隔) / 列数
  const itemWidth = () => {
      if (!contentWidth() || columnCount() <= 0) {
          return 0
      }
      // 列之间的间隔
      const gap = (columnCount() - 1) * merged.gap
      
      return Math.ceil((contentWidth() - gap) / columnCount())
  }

  interface SpaceOption {
    index: number
    item: any
    column: number
    top: number
    left: number
    bottom: number
    height: number
  }

  // 计算每个item占据的空间
  const [itemSpaces, setItemSpaces] = createSignal<SpaceOption[]>([])

  createEffect(() => {
    if (!columnCount()) {
        setItemSpaces([])
        return
    }
    const length = merged.items.length
    const spaces = new Array(length)
    const untrackItemSpaces = untrack(() => itemSpaces());

    let start = 0
    // 是否启用缓存：只有当新增元素时，需要计算新增元素的信息
    const cache = untrackItemSpaces.length && length > untrackItemSpaces.length
    if (cache) {
        start = untrackItemSpaces.length
    } else {
        columnsTop = new Array(columnCount()).fill(0)
    }

    // 为了高性能采用for-i
    for (let i = 0; i < length; i++) {
        if (cache && i < start) {
            spaces[i] = untrackItemSpaces[i]
            continue
        }

        const columnIndex = getColumnIndex()
        // 计算元素的高度
        const h = merged.calcItemHeight(merged.items[i], itemWidth())
        const top = columnsTop[columnIndex]
        const left = (itemWidth() + merged.gap) * columnIndex
        
        const space: SpaceOption = {
            index: i,
            item: merged.items[i],
            column: columnIndex,
            top: top,
            left: left,
            bottom: top + h,
            height: h
        }

        // 累加当前列的高度
        columnsTop[columnIndex] += h + merged.gap
        spaces[i] = space
    }
    setItemSpaces(spaces)
  })

  // 虚拟列表逻辑：需要渲染的items
  const itemRenderList = () => {
    const length = itemSpaces().length
    if (!length) {
      return []
    }
    if (!merged.virtual) {
      return itemSpaces()
    }

    // 父节点距离顶部的距离
    const parentTop = content()?.parentElement?.offsetTop || 0

    const tp = -contentTop() + parentTop

    const [topPreloadScreenCount, bottomPreloadScreenCount] = merged.preloadScreenCount
    // 避免多次访问
    const innerHeight = content()?.parentElement?.clientHeight || 0

    // 顶部的范围: 向上预加载preloadScreenCount个屏幕，Y轴上部
    const minLimit = tp - topPreloadScreenCount * innerHeight
    // 底部的范围: 向下预加载preloadScreenCount个屏幕
    const maxLimit = tp + (bottomPreloadScreenCount + 1) * innerHeight
    
    const items = []
    
    for (let i = 0; i < length; i++) {
      const v = itemSpaces()[i]
      const t = v.top
      const b = v.bottom
      // 这里的逻辑是：
      // 只要元素部分出现在可视区域里就算作可见，因此有三段判断:
      // 1. 元素的上边界在容器内
      // 2. 元素的下边界在容器内
      // 3. 元素覆盖了整个容器
      if(
        (t >= minLimit && t <= maxLimit) ||
        (b >= minLimit && b <= maxLimit) ||
        (t < minLimit && b > maxLimit)
      ) {
        items.push(v)
      }
    }
    return items
  }

  // 获取当前元素应该处于哪一列
  const getColumnIndex = (): number => {
    return columnsTop.indexOf(Math.min(...columnsTop))
  }

  return (
    <div 
      ref={setContent}
      style={{
          "position": 'relative',
          "will-change" : 'height',
          "height": `${Math.max(...columnsTop)}px`,
          "padding": `${isNumber(merged.padding) ? merged.padding + 'px' : merged.padding}`
      }}
    >
      <For each={itemRenderList()}>
        {(data) => (
          <div
            id={data.item[merged.rowKey] ?? data.index}
            style={{
              "position": 'absolute',
              "content-visibility": 'auto',
              "width": `${itemWidth()}px`,
              "height": `${data.height}px`,
              "transform": `translate(${data.left}px, ${data.top}px)`,
              "contain-intrinsic-size": `${itemWidth()}px ${data.height}px`
          }}
            data-index={data.index}
          >
            {props.children ? props.children(data.item) : null}
          </div>
        )}
      </For>
    </div> 
  );
};

export default Masonry;