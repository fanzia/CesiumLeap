var CesiumLeap = function(options){
	var cesiumLeap = this;
	this.version = "1.0.0";
	this.ellipsoid = options.ellipsoid;
	this.scene = options.scene;
	this.leapController = new Leap.Controller();
	this.leapController.on('connect', function(){
		cesiumLeap.onConnect();
	});
	this.leapController.on('frame', function(data){
		cesiumLeap.onFrame(data);
	});

	this.start();
	this._cleanData();

	var div = document.createElement("div");
	div.innerHTML = '<div class="cesium-leap-lookup-up cesium-leap-lookup"></div>'
				+	'<div class="cesium-leap-lookup-down cesium-leap-lookup"></div>'
				+	'<div class="cesium-leap-height-up cesium-leap-height"></div>'
				+	'<div class="cesium-leap-height-down cesium-leap-height"></div>'
				+	'<div class="cesium-leap-ew-east cesium-leap-ew"></div>'
				+	'<div class="cesium-leap-ew-west cesium-leap-ew"></div>'
				+	'<div class="cesium-leap-ns-north cesium-leap-ns"></div>'
				+	'<div class="cesium-leap-ns-south cesium-leap-ns"></div>'
				+	'<div class="cesium-leap-twist-right cesium-leap-twist"></div>'
				+	'<div class="cesium-leap-twist-left cesium-leap-twist"></div>';						
	div.className = "cesiumLeapContainer"
	document.getElementsByClassName("cesium-viewer")[0].appendChild(div);
};

CesiumLeap.prototype.onDisconnect = function(){
	console.log('successfully disconnect');
};

CesiumLeap.prototype.onConnect = function(){
	console.log('successfully connected');
};

CesiumLeap.prototype.start = function(){
	this.leapController.connect();
}

CesiumLeap.prototype.stop = function(){
	this.leapController.disconnect();
}

CesiumLeap.prototype._cleanData = function(){
	this._handId = null;
	var div = document.getElementsByClassName("cesiumLeapContainer")[0];
	if(div){
		var children = div.children;
		for(var i = 0; i < children.length;++i){
			children[i].style.display = "none";
		}
	}
};

CesiumLeap.prototype.onFrame = function(frame){
	if(!this.leapController.connected()){
		return;
	}
	var data = frame.data;
	if (frame.valid && data.hands.length === 1) {
		var fingers = data.pointables;
		if (fingers.length > 1) {
			hand = data.hands[0];
			if (hand.timeVisible > 0.75) {
				if(!this._handId){
					this._handId = hand.id;
				}else{
					if(this._handId != hand.id){
						this._cleanData();
						this._handId = hand.id;
					}
				}
				var grabStrength = hand.grabStrength;
				if(grabStrength >0.8){
					this._cleanData();
					return;
				}
				var cesiumLeap = this,
					camera = cesiumLeap.scene.camera,
					movement = {},
					cameraHeight = cesiumLeap.ellipsoid.cartesianToCartographic(camera.position).height,
					moveRate = cameraHeight / 100.0;

	            // pan - x,y
	            movement.x = hand.palmPosition[0];
	            movement.y = hand.palmPosition[2];

	            //zoom - z // height above leap
	            movement.z = hand.palmPosition[1];


	            //pitch - pitch
	            var normal = hand.palmNormal;
	            movement.pitch = -1 * normal[2]; 
	            movement.rotate = hand.direction[0];
	            //yaw - yaw
	            movement.yaw = -1 * normal[0]; 

	            var mid = 175;
	            var normalized = (movement.z - mid) / -100;

	            cesiumLeap.moveForward(movement.z);

	            cesiumLeap.moveRight(movement.x);

	            cesiumLeap.moveDown(movement.y);

	         	cesiumLeap.lookUp(movement.pitch);

	          	cesiumLeap.twistRight(movement.rotate);

	            // camera.lookRight(movement.yaw / 100);
	        }
	    }
	}
}

	// 抬起
CesiumLeap.prototype.lookUp = function(pitch){
	if(!pitch){
		return;
	}
	var camera = this.scene.camera;
	if(Math.abs(pitch) > 0.2){
		this.arrowControl("lookup",false);
		camera.lookUp(pitch / 100);
		if(pitch > 0){
			this.arrowControl("lookup-up",true);	
		}else{
			this.arrowControl("lookup-down",true);	
		}
	}else{
		this.arrowControl("lookup",false);
	}
}


//  高低改变
CesiumLeap.prototype.moveForward = function(number){
	if(!number){
		return;
	}

	var mid = 175;
	var normalized = number - mid;

	var camera = this.scene.camera;
	var cameraHeight = this.ellipsoid.cartesianToCartographic(camera.position).height,
	moveRate = cameraHeight / 100.0;

	if(Math.abs(normalized) > 20){
		this.arrowControl("height",false);
		camera.moveForward(normalized * moveRate/-100);
		if(normalized > 0){
			this.arrowControl("height-up",true);	
		}else{
			this.arrowControl("height-down",true);	
		}
	}else{
		this.arrowControl("height",false);
	}
}

// 东西改变
CesiumLeap.prototype.moveRight = function(number){
	if(!number){
		return;
	}
	var camera = this.scene.camera;
	var cameraHeight = this.ellipsoid.cartesianToCartographic(camera.position).height,
	moveRate = cameraHeight / 100.0;
	if(Math.abs(number) > 30){
		this.arrowControl("ew",false);
		camera.moveRight(number * moveRate / 100);
		if(number > 0){
			this.arrowControl("ew-west",true);	
		}else{
			this.arrowControl("ew-east",true);	
		}
	}else{
		this.arrowControl("ew",false);
	}
}

// 南北改变
CesiumLeap.prototype.moveDown = function(number){
	if(!number){
		return;
	}
	var camera = this.scene.camera;
	var cameraHeight = this.ellipsoid.cartesianToCartographic(camera.position).height,
		moveRate = cameraHeight / 100.0;

	if(Math.abs(number) > 30){
		this.arrowControl("ns",false);
		camera.moveDown(number * moveRate / 100);
		if(number > 0){
			this.arrowControl("ns-north",true);
		}else{
			this.arrowControl("ns-south",true);
		}
	}else{
		this.arrowControl("ns",false);
	}		

}

// 航偏方向改变
CesiumLeap.prototype.twistRight = function(number){
	if(!number){
		return;
	}
	var camera = this.scene.camera;
	var cameraHeight = this.ellipsoid.cartesianToCartographic(camera.position).height,
	moveRate = cameraHeight / 100.0;

	if(Math.abs(number) > 0.2){
		this.arrowControl("twist",false);
		camera.twistRight(number / 100);
		if(number > 0){
			this.arrowControl("twist-right",true);
		}else{
			this.arrowControl("twist-left",true);
		}
	}else{
		this.arrowControl("twist",false);
	}		
}

CesiumLeap.prototype.arrowControl = function(type,show){
	var divs = document.getElementsByClassName("cesium-leap-" + type);
	if(divs.length == 0){
	  return;
	}
	var div = divs[0];
	for(var i = 0; i < divs.length;++i){
		div = divs[i];
		if(div){
			if(show){
	        	div.style.display = "block";
	        }else{
	        	div.style.display = "none";
	        }
		}
	}
}