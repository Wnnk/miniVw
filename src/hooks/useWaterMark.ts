

const defaultConfig = {
  color: '#c0c4cc',
  opacity: 0.5,
  fontSize: 16,
  width:300,
  height: 200,
  text: '水印文本'
}

type WaterMarkConfig = {
  color: string,
  opacity: number,
  fontSize: number,
  width: number,
  height: number
  text: string
}


export const useWaterMark = async(image:any,config:WaterMarkConfig = defaultConfig) => {
  const ctx = uni.createCanvasContext('watermark',this);
  ctx.drawImage(image.tempFilePath, 0, 0, config.width, config.height);
  ctx.font = `bold ${config.fontSize}px sans-serif`;
  ctx.fillStyle = config.color;
  ctx.globalAlpha = config.opacity;
  ctx.rotate(-Math.PI / 4);
  ctx.fillText(`${config.text}`, 0, config.height / 2);
  console.log('开始绘制水印')
  ctx.draw(false, () => {
    // 在绘制完成后调用 canvasToTempFilePath
    uni.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: config.width,
      height: config.height,
      canvasId: 'watermark',
      success: (res) => {
        console.log('生成临时文件成功:', res.tempFilePath);
      },
      fail: (err) => {
        console.log('生成临时文件失败:', err);
      }
    }, this);
  });
 
}