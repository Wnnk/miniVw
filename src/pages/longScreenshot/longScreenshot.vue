<script setup >
import { ref, getCurrentInstance } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
const list = ref([])
const createData = () => {
  let data = []
  for (let i = 0; i < 10; i++) {
    data.push({
      id: i,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      text: `这是一条数据${i}`
    })
  }
  return data
}
list.value = createData();

/* 长截图 */
const longScreenshot = () => {
  const instance = getCurrentInstance();
  // console.log(instance)
  const query = uni.createSelectorQuery().select('#target').fields({node: true}).exec((res) => {
    const node = res[0].node;
    console.log(node)
    node.takeSnapshot({
      type: 'arraybuffer',
      format: 'png',
      success: (res) => {
        console.log(res)
        const name = `${Date.now()}.png`;
        const f = `${wx.env.USER_DATA_PATH}/${name}`
        const fs = uni.getFileSystemManager();
        fs.writeFileSync(f,res.data,'binary')
        uni.showToast({
          title: '截图成功',
        })
        uni.saveImageToPhotosAlbum({
          filePath: f,
          success: (success) => {
            console.log(success)
          },
          fail: (fail) => {
            console.log(fail)
          }
        })
        
      },
      fail: (err) => {
        console.log(err)
      }
    })
  });
}


onLoad(() => {
  
})


</script>


<template>
    <scroll-view 
      class="list"
      scroll-y="true" 
      type="list"
    >
      <snapshot id="target">
        <view v-for="(item, index) in list" :key="item.id" class="item" :style="{ backgroundColor: item.color }" >
          {{ item.text }}
        </view>
      </snapshot>
    </scroll-view>
    <button @click="longScreenshot" class="btn">保存截图</button>
</template>

<style lang='scss' scoped>
.list {
  height: 100%;
}
.item {
  height: 500rpx;
  text-align: center;
  line-height: 500rpx;
  font-size: 30rpx;
  border: 1px solid #ccc;
}
.btn {
  position: fixed;
  bottom: 0px;
  border-radius: 8px 8px 0 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4ad658;
}
</style>