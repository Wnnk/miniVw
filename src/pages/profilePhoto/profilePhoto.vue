<script setup >
import { onShow } from '@dcloudio/uni-app';
import { ref, watch } from 'vue'
const profile = ref(null);
const profileStyle = ref("default");
const canvasStyle = ref({
  width: "500px",
  height: "500px"
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
      uni.setStorageSync("profile", res.tempFiles[0]);
      const bg =uni.getStorageSync("profileBg")
      if(bg){
        compositeImage(profile.value, bg)
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

  const canvas = uni.createCanvasContext("compositing");
  /* 绘制背景 */
  const query = uni.createSelectorQuery().select('.profile__photo').boundingClientRect();
  let width = 0;
  let height = 0;
  query.exec((res) => {
    width = res[0].width;
    height = res[0].height;
    canvasStyle.value.width = `${width}px`;
    canvasStyle.value.height = `${height}px`;
    canvas.clearRect(0, 0, width, height);
    console.log(image)
    if (profileStyle.value === "circle") {
      canvas.beginPath();
      canvas.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI);
      canvas.stroke();
      canvas.beginPath();
      canvas.arc(width / 2, height / 2, width / 2 - 10, 0, 2 * Math.PI);
      canvas.stroke();

      canvas.beginPath();
      canvas.arc(width / 2, height / 2, width / 2 , 0, 2 * Math.PI);
      canvas.arc(width / 2, height / 2, width / 2 - 10, 0, 2 * Math.PI, true);
      canvas.clip();
      canvas.drawImage(bg.tempFilePath, 0, 0, width, height);
      canvas.drawImage(image.tempFilePath, 0, 0, width, height);
      canvas.draw();
    } else {
      canvas.drawImage(bg.tempFilePath, 0, 0, width, height);
      canvas.clearRect(20, 20, width - 40, height - 40);
      canvas.draw();
    }
  });
 
  // if (profileStyle.value === "circle") {
  //   canvas.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI);
  //   canvas.clip();
  //   let img = new Image();
  //   img.src = bg.tempFilePath;
  //   img.onload = function () {
  //     img.width = width;
  //     img.height = height;
  //     canvas.drawImage(img, 0, 0, width, height);
  //   };
  // } else {
  //   canvas.drawImage(image, 0, 0, width, height);
  //   canvas.draw();
    
  // }
  
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
      uni.setStorageSync("profileBg", res.tempFiles[0]);
      uni.showToast({
        title: "选择背景成功",
      });
      const profile = uni.getStorageSync("profile")
      if(profile){
        compositeImage(profile, res.tempFiles[0])
      }
    },
    fail: (err) => {
      uni.showToast({
        title: "选择文件失败",
      })
    }
  })
}


onShow(() => {
  // uni.removeStorageSync("profileBg");
  // uni.removeStorageSync("profile");
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
        <button>使用系统背景</button>
      </view>
       <canvas canvas-id="compositing" :style="{width: canvasStyle.width, height: canvasStyle.height}"></canvas>
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


</style>