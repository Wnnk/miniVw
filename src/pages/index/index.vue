<template>
  <view class="content">
   <view class="upload" @click="chooseFile"></view>
   <input type="text" placeholder="水印文本" class="watermark-text" v-model="config.text">
   <view class="watermark-config"></view>
   <button @click="addWaterMark">添加水印</button>
   <view class="preview">
    <h3>图片生成预览</h3>
    <canvas canvas-id="watermark-canvas" class="watermark-canvas"  :style="{width: canvasWidth + 'px', height: canvasHeight + 'px'}"></canvas>
   </view>
   <button @click="saveToAlbum(watermarkPhotoPath)">保存到相册</button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onReady } from '@dcloudio/uni-app';

const file = ref(null);
const config = ref({
  color: '#c0c4cc',
  opacity: 0.5,
  fontSize: 24,
  width:300,
  height: 200,
  text: '水印文本'
})
/** 
 * @description: 选择文件
**/
const chooseFile = () => {
  uni.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      file.value = res.tempFiles[0];
    },
    fail: (err) => {
      console.log(err);
      uni.showToast({
        title: '选择文件失败',
      })
    }
  })
}

/** 
 * @description: 初始化画布 
**/
const ctx = ref(null);
const canvasWidth = ref(100);
const canvasHeight = ref(100);
const initCanvas = () => {
  ctx.value = uni.createCanvasContext('watermark-canvas', this);
  canvasWidth.value = uni.getSystemInfoSync().windowWidth;
  canvasHeight.value = uni.getSystemInfoSync().windowHeight / 2;
}

/** 
 * @description: 绘制水印
**/
const isHasWaterMark = ref(false);
const watermarkPhotoPath = ref('');
const addWaterMark = () => {
  if (!file.value) return;
  /* 清空画布 */
  ctx.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
  const image = file.value;
  ctx.value.drawImage(image.tempFilePath, 0, 0, canvasWidth.value, canvasHeight.value);
  ctx.value.font = `normal ${config.value.fontSize}px sans-serif`;
  ctx.value.setFillStyle(config.value.color);
  ctx.value.setFontSize(config.value.fontSize);
  ctx.value.globalAlpha = config.value.opacity;
  ctx.value.rotate(45 * Math.PI / 180); // 旋转 45°
  ctx.value.fillText(`${config.value.text}`,50, 50)

  ctx.value.draw(false, () => {
    // 在绘制完成后调用 canvasToTempFilePath
    uni.canvasToTempFilePath({
      x: 0,
      y: 0,
      canvasId: 'watermark-canvas',
      success: (res) => {
        watermarkPhotoPath.value = res.tempFilePath;
        isHasWaterMark.value = true;
      },
      fail: (err) => {
        console.log('生成临时文件失败:', err);
      }
    }, this);
  });
}

/** 
 * @description： 水印图片保存到相册
 * @param {string} filePath 水印图片路径
 * @return {void}
**/
const saveToAlbum = (filePath) => {
  if (!filePath) return;
  uni.saveImageToPhotosAlbum({
    filePath,
    success: (res) => {
      uni.showToast({
        title: '保存成功',
        duration: 1000
      });
    },
    fail: (err) => {
      ti.showToast({
        title: `保存失败${err}`,
        duration: 1000
      });
    }
  })
  
}


onReady(() => {
  initCanvas();
})


</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.upload {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #ccc;
}
.watermark-text{
  width: 100%;
  text-align: center;
}
.watermark-config{
  width: 100%;
  display: flex;
  place-items: center;
}
.preview{
  margin-top: 20px;
  width: 100%;
  display: flex;
  place-items: center;
  flex-direction: column;
}

/* .watermark-canvas{
  width: 200px !important;
  height: 200px !important;
} */
</style>
