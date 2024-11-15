import { Component, Show } from "solid-js";
import Masonry from "../solid-masonry-virtual/Masonry";
import useApp from "./useApp";
import useMasonry from "./useMasonry";
import './Example.css';


const Example: Component = () => {
  const { asideShow } = useApp()
  const { data, calcItemHeight, backTop, masonryOption, setMasonryOption } = useMasonry();

  return (
    <>
      <header>
        <strong>Solid-Masonry-Virtual</strong>
        <small>
          <span class="badge text-bg-success">v{"1.0.0"}</span>
        </small>
      </header>   
      <div class="masonry-wrap">
        <Masonry
            virtual={masonryOption().virtual}
            gap={masonryOption().gap}
            padding={masonryOption().padding}
            preloadScreenCount={[masonryOption().topPreloadScreenCount, masonryOption().bottomPreloadScreenCount]}
            itemMinWidth={masonryOption().itemMinWidth}
            maxColumnCount={masonryOption().maxColumnCount}
            minColumnCount={masonryOption().minColumnCount}
            items={data().list}
            calcItemHeight={calcItemHeight}
          >
            {(item) =>
              <article class="card">
                <div class="cover">
                  <img src={item.url} alt="图片" />
                </div>
                <Show when={!masonryOption().onlyImage}>
                  <div class="body">
                    <h3>{item.title}</h3>
                  </div>
                </Show>
              </article>
            }
        </Masonry>
      </div>
      <Show when={asideShow()}>
        <aside>
          <form>
            <div class="form-group form-group-sm mb-2">
              <label class="form-label fs-6">间隔 <code>[0:100]</code></label>
              <div class="input-group input-group-sm">
                <input
                  type="number"
                  class="form-control"
                  value={masonryOption().gap}
                  onChange={(e) => {
                    setMasonryOption({
                      ...masonryOption(),
                      gap: e.target.valueAsNumber,
                    });
                  }}
                  min="0"
                  max="100"
                  step="1"
                />
                <span
                  class="input-group-text"
                  id="basic-addon1"
                >
                  px
                </span>
              </div>
            </div>
            <div class="form-group form-group-sm mb-2">
              <label class="form-label fs-6">填充 <code>[0:100]</code></label>
              <div class="input-group input-group-sm">
                <input
                  type="number"
                  class="form-control"
                  value={masonryOption().padding}
                  onChange={(e) => {
                    setMasonryOption({
                      ...masonryOption(),
                      padding: e.target.valueAsNumber,
                    });
                  }}
                  min="0"
                  max="100"
                  step="1"
                />
                <span
                  class="input-group-text"
                  id="basic-addon1"
                >
                  px
                </span>
              </div>
            </div>
            <div class="form-group form-group-sm mb-2">
              <label class="form-label fs-6">每个元素的最小宽度 <code>[100:600]</code></label>
              <div class="input-group input-group-sm">
                <input
                  type="number"
                  class="form-control"
                  value={masonryOption().itemMinWidth}
                  onInput={(e) => {
                    setMasonryOption({
                      ...masonryOption(),
                      itemMinWidth: e.target.valueAsNumber,
                    })
                  }}
                  min="100"
                  max="600"
                  step="1"
                />
                <span
                  class="input-group-text"
                  id="basic-addon1"
                >
                  px
                </span>
              </div>
            </div>
            <div class="form-group form-group-sm mb-2">
              <label class="form-label fs-6">距离底部多少加载更多 <code>[0:10000]</code></label>
              <div class="input-group input-group-sm">
                <input
                  type="number"
                  class="form-control"
                  value={masonryOption().bottomDistance}
                  onChange={(e) => {
                    setMasonryOption({
                      ...masonryOption(),
                      bottomDistance: e.target.valueAsNumber,
                    });
                  }}
                  min="0"
                  max="1000"
                  step="1"
                />
                <span
                  class="input-group-text"
                  id="basic-addon1"
                >
                  px
                </span>
              </div>
            </div>
            <div class="form-group form-group-sm mb-2">
              <label class="form-label fs-6">
                最小列数 <code>[0:{masonryOption().maxColumnCount}]</code>，最大列数 <code>[{masonryOption().minColumnCount}:10]</code>
              </label>
              <div class="input-group input-group-sm">
                <input
                  type="number"
                  class="form-control"
                  value={masonryOption().minColumnCount}
                  onChange={(e) => {
                    setMasonryOption({
                      ...masonryOption(),
                      minColumnCount: e.target.valueAsNumber,
                    });
                  }}
                  min="0"
                  max={masonryOption().maxColumnCount}
                  step="1"
                />
                <span
                  class="input-group-text"
                  id="basic-addon1"
                >
                  列
                </span>
                <input
                  type="number"
                  class="form-control"
                  value={masonryOption().maxColumnCount}
                  onChange={(e) => {
                    setMasonryOption({
                      ...masonryOption(),
                      maxColumnCount: e.target.valueAsNumber,
                    });
                  }}
                  min={masonryOption().minColumnCount}
                  max="10"
                  step="1"
                />
                <span
                  class="input-group-text"
                  id="basic-addon1"
                >
                  列
                </span>
              </div>
            </div>
            <div class="form-group form-group-sm mb-2">
              <label class="form-label fs-6">(顶部/底部)预加载屏 <code>[0:5]</code></label>
              <div class="input-group input-group-sm">
                <input
                  type="number"
                  class="form-control"
                  value={masonryOption().topPreloadScreenCount}
                  onChange={(e) => {
                    setMasonryOption({
                      ...masonryOption(),
                      topPreloadScreenCount: e.target.valueAsNumber,
                    });
                  }}
                  min="0"
                  max="5"
                  step="1"
                />
                <input
                  type="number"
                  class="form-control"
                  value={masonryOption().bottomPreloadScreenCount}
                  onChange={(e) => {
                    setMasonryOption({
                      ...masonryOption(),
                      bottomPreloadScreenCount: e.target.valueAsNumber,
                    });
                  }}
                  min="0"
                  max="5"
                  step="1"
                />
              </div>
            </div>
            <div class="form-group form-group-sm form-check form-switch mb-1">
              <label class="form-label fs-6">开启虚拟列表</label>
              <input
                class="form-check-input"
                type="checkbox"
                checked={masonryOption().virtual}
                onChange={(e) => {
                  setMasonryOption({
                    ...masonryOption(),
                    virtual: e.target.checked,
                  });
                }}
              />
            </div>
            <div class="form-group form-group-sm form-check form-switch mb-2">
              <label class="form-label fs-6">仅展示图片</label>
              <input
                class="form-check-input"
                type="checkbox"
                checked={masonryOption().onlyImage}
                onChange={(e) => {
                  setMasonryOption({
                    ...masonryOption(),
                    onlyImage: e.target.checked,
                  });
                }}
              />
            </div>
            <div class="form-group form-group-sm mb-2">
              <label class="form-label fs-6">数据展示</label>
              <p>每页条数: {data().size}</p>
              <p>当前页码: {data().page} / {data().max}</p>
              <p>已加载量: {data().list.length} / {data().total}</p>
              <p>等待加载: {masonryOption().loading + ""}</p>
            </div>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              onClick={backTop}
            >
              回到顶部
            </button>
          </form>
        </aside>
      </Show>
    </>
  );
}

export default Example;