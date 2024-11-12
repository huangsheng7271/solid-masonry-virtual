import { createSignal, onMount } from "solid-js";

interface ItemOption {
    id: number;
    title: string;
    width: number;
    height: number;
    avatar: string;
    user: string;
    views: number;
    url: string;
}
interface PageProps{
    page: number;
    size: number;
    total: number;
    max: number;
    list: ItemOption[];
    end: boolean;
  }

const useMasonry = () => {
    const [data, setData] = createSignal<PageProps>({
        page: 0,
        size: 30,
        total: 0,
        max: 0,
        list: [] as ItemOption[],
        end: false
    });

    // 加载更多数据的函数
    const loadData = async () => {
        if (data().end) return;
        const response = await fetch(`https://mock.tatakai.top/images?page=${data().page+1}&size=${data().size}&mode=simple`);
        const result = await response.json();
        

        if (!result.list.length) {
            setData({ ...data(), page: data().page+1, end: true });
        } else {
            setData({
                ...data(),
                page: data().page+1,
                total: result.total,
                max: result.max,
                list: [...data().list,...result.list]
            })
        }
    };

    const calcItemHeight = (item: ItemOption, itemWidth: number) => {
        let height = 72;
        // 当包含图文时，需要单独计算文字部分的高度
        // 文字部分的高度 + 图片的高度 = 真实高度
        // 这里可以根据是否只显示图片的条件来控制
        if(masonryOption().onlyImage){
            height = 0;
        }
        return item.height * (itemWidth / item.width) + height
    }

    const backTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        })
    }

    // 瀑布流的一些属性
    const [masonryOption,setMasonryOption] = createSignal({
        loading: false,
        bottomDistance: 5,
        // 是否只展示图片，这是自定义加的一个属性
        onlyImage: false,
        topPreloadScreenCount: 0,
        bottomPreloadScreenCount: 0,
        virtual: true,
        gap: 15,
        padding: 15,
        itemMinWidth: 220,
        minColumnCount: 2,
        maxColumnCount: 10
    })

    const checkScrollPosition = async () => {
        if (masonryOption().loading) {
            return
        }
        const scrollHeight = document.documentElement.scrollHeight
        const scrollTop = document.documentElement.scrollTop
        const clientHeight = document.documentElement.clientHeight

        const distanceFromBottom = scrollHeight - scrollTop - clientHeight

        // 不大于最小底部距离就加载更多
        if (distanceFromBottom <= masonryOption().bottomDistance) {
            setMasonryOption({ ...masonryOption(), loading: true })
            await loadData()
            setMasonryOption({ ...masonryOption(), loading: false })
        }
    }

    onMount(() => {
        loadData();

        let timeout = 0 ;
        const scrollHandler = async () => {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(async () => {
                await checkScrollPosition();
            }, 0);
        };
        window.addEventListener('scroll', scrollHandler);
    })

    return {
        data,
        calcItemHeight,
        backTop,
        masonryOption,
        setMasonryOption
    }
}

export default useMasonry;