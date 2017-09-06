# cesiumLeap
use leap motion to control cesium 



## 依赖库版本: 
cesium -- 1.36


leap motion -- 0.6.4


## leap motion 坐标系: 
<img src="https://di4564baj7skl.cloudfront.net/documentation/images/Leap_Axes.png" width="300">


## 指示符号示意图: 

<img src="https://raw.githubusercontent.com/fanzia/CesiumLeap/master/image/info.png" width="400">

#### 1. 东南西北方向偏移，沿XZ平面的手势移动
<img src="https://raw.githubusercontent.com/fanzia/CesiumLeap/master/image/direction.png" width="200">


#### 2. 高度改变，在leap motion 坐标系原点上的Y轴高低移动
<img src="https://raw.githubusercontent.com/fanzia/CesiumLeap/master/image/updown.png" width="80">


#### 3. 航偏角改变，在XZ平面上的左右挥动
<img src="https://raw.githubusercontent.com/fanzia/CesiumLeap/master/image/yaw.png" width="120">


#### 4. 俯仰角改变，手指方向的弯曲表示
<img src="https://raw.githubusercontent.com/fanzia/CesiumLeap/master/image/raise.png" width="40">


## 使用

1. 引入CesiumLeap文件、cesium文件和leap文件

```html
    <script src="../ThirdParty/Cesium/Cesium.js"></script>
    <script src="../ThirdParty/leap/leap-0.6.4.js"></script>
    <script src="../lib/CesiumLeap.js"></script>
```   

2. 引入css文件

```html
  <link rel="stylesheet" type="text/css" href="../lib/css/cesiumLeap.css">
```

3. 初始化CesiumLeap

```javascript
    var viewer = new Cesium.Viewer('cesiumContainer');  
    
    var cesiumLeap = new CesiumLeap({
      scene : viewer.scene,
      ellipsoid : viewer.scene.mapProjection.ellipsoid
    });
```

4. 默认是启用的状态的，可以进行停止和启用

```javascript
    cesiumLeap.stop();
    cesiumLeap.start();
```

## 使用注意事项
* 只可以使用一只手
* 先攥住拳头进入到leap motion控制器的上方，之后再伸出手掌，进行手势的使用
* 准备停止手势时，请握拳即可停止
