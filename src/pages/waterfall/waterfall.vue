<script setup lang='ts'>
import { onReady } from '@dcloudio/uni-app';
import { ref, getCurrentInstance, onMounted  } from 'vue'
const list = ref<imgType[]>([]);
const waterfallList = ref<fallListItem[]>([]);
const gap = 10;

type fallListItem = {
  height: number;
  colList?: imgType[];
}
type imgType = {
  id:number;
  src: string;
  height: number;
  width: number;
}

/** 
 * @description: 创建图片
 * 
**/
const createImg = (total: number) => {
  let res = [] as imgType[];
  for (let i = 0; i < total; i++) {
    res.push({
      id: i,
      src: '../../static/images/logo.png',
      height: Math.floor(Math.random() * 200) + 50,
      width: 100,
    })
  }
  return res;
}
list.value = createImg(10);


/** 
 * @description: 获取当前最小列高度
 * @param {fallListItem[]} waterfallList
 * @return {number} 最小列高度索引
**/
const getMinHeightIndex = (waterfallList: fallListItem[]): number => {
  if (waterfallList.length === 0) return 0;
  let minHeight = Infinity;
  let minHeightIndex = 0;
  waterfallList.forEach((item, index) => {
    if (item.height < minHeight) {
      minHeight = item.height;
      minHeightIndex = index;
    }
  });
  return minHeightIndex;
}

/** 
 * @description: 计算宽度并初始化waterfallList数组
 * 
**/
const initWaterfallList = () => {
  const containerWidth = uni.getSystemInfoSync().windowWidth;
  /* 计算设备宽度容纳的图片数量 */
  const colNum = Math.floor((containerWidth + gap) / (list.value[0].width + gap));
  /* 初始化waterfallList */
  for (let i = 0; i < colNum; i++) {
    waterfallList.value.push({
      height: 0,
      colList: [],
    });
  }
  for (let i = 0; i < list.value.length; i++) {
    const minHeightIndex = getMinHeightIndex(waterfallList.value);
    waterfallList.value[minHeightIndex].colList!.push(list.value[i]);
    waterfallList.value[minHeightIndex].height += list.value[i].height + gap;
  }
  console.log(waterfallList.value)
}
initWaterfallList()



/** 
 * @description: 绘制瀑布流
**/
const drawWaterfall = () => {
 
  

 
}

onReady(() => {
  // drawWaterfall()

})





</script>

<template>
  <view class="waterfall" ref="waterfallRef" id="waterfall">
   <view v-for="(col,colIndex) in waterfallList" :key="colIndex" class="column" :style="{ width: `${100 / waterfallList.length}%`}">
    <view 
      v-for="item in col.colList" 
      :key="item.id" 
      :src="item.src"
      :style="{ height: item.height + 'px',border: '1px solid #ccc', display:'flex',flexDirection: 'column' }"
    >
    <image :src="item.src" class="img"></image>
    <p>xxxxx</p>
   </view>
   </view>
  </view>
</template>

<style lang='scss' scoped>
.waterfall {
  display: flex;
  width: 100%;
  // margin: 0 auto;
  // position: relative;
}
.column{
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.img {
  width: 100%;
  object-fit: cover;
}
</style>