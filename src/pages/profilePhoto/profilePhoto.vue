<script setup >
import { onShow } from '@dcloudio/uni-app';
import { ref, watch } from 'vue'
const profile = ref(null);
const profileBg = ref(null);
const profileStyle = ref("default");
const defaultBg = [
  {src:'https://img.yzcdn.cn/vant/cat.jpeg'},
  {src: '../../static/images/default1.jpg'},
  {src: '../../static/images/default2.jpg'},
  {src: '../../static/images/default3.jpg'}
]

const toggle = ref(false);

const canvasStyle = ref({
  width: 500,
  height: 500
})
uni.setStorageSync("profileStyle", profileStyle.value);
/** 
 * @description:选择头像
**/
const choosePhoto = () => {
  uni.chooseMedia({
    count: 1,
    mediaType: ["image"],
    sourceType: ["album", "camera"],
    success: (res) => {
      profile.value = res.tempFiles[0];
      if(profileBg.value){
        compositeImage(profile.value, profileBg.value)
      }
    },
    fail: (err) => {
      console.log(err);
      uni.showToast({
        title: "选择文件失败",
      });
    },
  });
};




/** 
 * @description: 合成图片
 * @param {Object} image 头像图片
 * @param {Object} bg 背景图片
**/
const compositeImage = (image, bg) => {

  const bgCtx = uni.createCanvasContext("bg");
  const ctx = uni.createCanvasContext("image");

  const query = uni.createSelectorQuery().select('.profile__photo').boundingClientRect();
  let width = 0;
  let height = 0;
  query.exec((res) => {
    width = res[0].width;
    height = res[0].height;
    canvasStyle.value.width = `${width}`;
    canvasStyle.value.height = `${height}`;
    bgCtx.clearRect(0, 0, width, height);
    ctx.clearRect(0, 0, width - 40, height - 40);
    if (profileStyle.value === "circle") {
      bgCtx.save();
      bgCtx.beginPath();
      bgCtx.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI);
      bgCtx.clip();
      bgCtx.drawImage(bg.tempFilePath, 0, 0, width, height);
      bgCtx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.arc((width-40) / 2, (height-40) / 2, (width-40) / 2, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(image.tempFilePath, 0, 0, width, height);
      bgCtx.draw();
      ctx.draw();
    } else {
      bgCtx.drawImage(bg.tempFilePath, 0, 0, width, height);
      bgCtx.draw();
      ctx.drawImage(image.tempFilePath, 0, 0, width, height);
      ctx.draw();
    }
  });
 

  
}




/** 
 * @description:上传背景，存在头像，自动合成
**/
const uploadBg = () => {
  console.log("uploadBg");
  uni.chooseMedia({
    count: 1,
    mediaType: ["image"],
    sourceType: ["album", "camera"],
    success: (res) => {
      profileBg.value = res.tempFiles[0];
      uni.showToast({
        title: "选择背景成功",
      });
      if(profile.value){
        compositeImage(profile.value, profileBg.value)
      }
    },
    fail: (err) => {
      uni.showToast({
        title: "选择文件失败",
      })
    }
  })
}

const changeToggle = (event) => {
  if(event.target.id  !== 'mask') return;
  toggle.value = !toggle.value;
}

const chooseDefaultBg = (bg) => {
  profileBg.value = {
    tempFilePath: bg.src
  };
  toggle.value = false;
  if(profile.value){
    compositeImage(profile.value, profileBg.value)
  }
}

onShow(() => {

})

</script>

<template>
  <view>
    <view class="profile">
      <view 
        class="profile__photo" 
        :style="{
          'border-radius': `${profileStyle === 'default' ? '8px' : '50%'}`, 
          'background-image': `url(${profile ? profile.tempFilePath : ''})`
        }"
        @click="choosePhoto"
      >
      </view>
      <view class="style__container">
        <button @click="() => {profileStyle = 'default'}" class="style__btn">default</button>
        <button @click="() => {profileStyle = 'circle' }" class="style__btn">circle</button>
      </view>
      <view class="profile__compositing">
        <button @click="uploadBg">上传背景</button>
        <button @click=" () => { toggle = true}">使用系统背景</button>
      </view>
      <view class="canvas-container" :style="{width: canvasStyle.width +'px', height: canvasStyle.height +'px'}">
       <canvas canvas-id="bg" :style="{width: canvasStyle.width + 'px', height: canvasStyle.height + 'px',position: 'absolute', left: 0, top: 0}"></canvas>
       <canvas canvas-id="image" :style="{width: canvasStyle.width - 40 + 'px', height: canvasStyle.height - 40 + 'px',position: 'absolute', left: `20px`, top: `20px`}"></canvas>
      </view>
      
    </view>
    <view class="mask" v-show="toggle" @click="changeToggle" id="mask">
      <view class="mask__container">
        <view class="mask__bg" v-for="bg in defaultBg" :key="bg.name" >
          <image :src="bg.src" class="mask__bg__img" mode="aspectFill" @click="chooseDefaultBg(bg)" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang='scss' scoped>
.profile {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
}
.profile__photo{
  height: 500rpx;
  border-radius: 8px;
  width: 500rpx;
  background-color: #ccc;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid #ccc;
}
.style__container{
  display: flex;
}
.style__btn{
 margin: 10rpx 10rpx;
}
.canvas-container{
  position: relative;
}


.mask{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  z-index: 999;
}
.mask__container{
  background-color: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  border-radius: 10px 10px 0 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  z-index: 1000;
}

.mask__bg{
  margin: 10rpx;
  width: calc(33.33% - 20rpx);
  height: 200rpx;
}
.mask__bg__img{
  width: 100%;
  height: 100%;
}

</style>