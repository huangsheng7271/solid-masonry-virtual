import { createSignal, onCleanup, onMount } from "solid-js"
import { useDebounceFn } from "solidjs-use"

const useApp = () => {
    const [asideShow,setAsideShow] = createSignal(true)

    const setAppStyle = () => {
        // 想要实现虚拟渲染，需要瀑布流的外层固定高度
        const root = document.getElementById('root');
        if (root) {
            root.style.height = window.innerHeight + 'px';
        } else {
            console.warn("Root element not found!"); 
        }
        if (window.innerWidth > 640) {
            setAsideShow(true)
            document.body.style.paddingRight = '300px'
            return
        }
        setAsideShow(false)
        document.body.style.paddingRight = '0'
    }

    onMount(() => {
        setAppStyle()
        window.addEventListener('resize', useDebounceFn(setAppStyle, 125))
    })

    onCleanup(() => {
        window.removeEventListener('resize', useDebounceFn(setAppStyle, 125))
    })

    return {
        asideShow
    }
}

export default useApp