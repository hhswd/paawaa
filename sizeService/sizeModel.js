window.onload = function(){
  var confirmButton = document.getElementById("bodySizeSubmit");
  confirmButton.onclick = confirm;
};

// 点击确定按钮后的响应
function confirm(){
  var person = new Person();
  //alert(person.genderID);
  //alert("height: "+person.height+" weight: "+person.weight + " gender: "+person.genderID);
  alert("r: " + person.r + " p: "+person.p + " size: " + person.size);
}

// 检测身材数据
function testBodySizeInput(){

}

function Person(){
  this.height = document.forms["bodySize"]["height"].value;
  this.weight = document.forms["bodySize"]["weight"].value;
  this.genderID = this.getGenderID();
  this.r = this.calR();
  this.p = this.calP();
  this.size = this.getBodySize();
}

Person.prototype = {
  // 获取性别id
  getGenderID : function(){
    var genderSelection = document.forms["bodySize"]["gender"];
    var gender = genderSelection.value;
    var genderID;
    if(gender == "male"){
      genderID = 0;
    }
    else {
      genderID = 1;
    }
    return genderID;
  },

  // 计算尺码
  getBodySize : function(){
    var sizeManager = new SizeManager(this.genderID, this.height, this.weight, this.p);
    return sizeManager.clothSize;
    //return sizeManager.sizeLevel;

  },

  // 计算r值
  calR : function(){
    var r;
    // Male
    if(this.genderID === 0){
      // 四舍五入求出r值
      r = Math.round((10 * this.weight) / (0.9 * (this.height-100)));
    }
    // Female
    else {
      r = Math.round((10 * this.weight) / (0.9 * (this.height-100)-2.5));
    }
    return r;
  },

  // 计算p值
  calP : function(){
    var p;
    if(this.r<10){
      p = this.r-9;
    }else{
      p = this.r-10;
    }
    return p;
  }
};


// 尺码管理器
function SizeManager(genderID, height, weight, p){
  // 性别参数设置, this.baseHeight, this.masLevel, this.femaleMaxLevel
  this.genderConfig(genderID);
  // this.sizeLevel : setSizeLevel
  this.setSizeLevel(height, p);
  // this.clothSize : setClothSize
  this.setClothSize(genderID);
}

SizeManager.prototype = {
  // 性别参数
  genderConfig : function(genderID){
    //男士
    if(genderID === 0){
      // 基础身高
      this.baseHeight = 160;
      // 最大尺码级数
      this.maxLevel = 5;
      //女士
    }else{
      this.baseHeight = 155;
      // 女士本身的最大级数，大于该尺码后转为男士级数
      this.femaleMaxLevel = 3;
      this.maxLevel = 7;
    }
  },

  // 计算sizeLevel
  setSizeLevel : function(height, p){
      var originLevel = Math.floor((height-this.baseHeight)/5);
      this.sizeLevel = originLevel + p;
      console.log(this.baseHeight);
      console.log(originLevel);
  },

  // 由sizeLevel求出对应尺码：
  setClothSize : function(genderID){
    //边界问题
    if(this.sizeLevel > this.maxLevel){
      this.sizeLevel = this.maxLevel;
    } else if(this.sizeLevel<0){
      this.sizeLevel = 0;
    }

    // 根据级数输出衣服尺码
    if(genderID === 0){
      this.convertMaleSize();
    } else{
      this.convertFemaleSize();
    }
  },

  // 男士级数转换
  convertMaleSize : function(genderID){
      switch(this.sizeLevel){
        case 0: this.clothSize = 'S';break;
        case 1: this.clothSize = 'M';break;
        case 2: this.clothSize = 'L';break;
        case 3: this.clothSize = 'XL';break;
        case 4: this.clothSize = 'XXL';break;
        case 5: this.clothSize = 'XXXL';break;
        default:
          this.clothSize = 'err';
        break;
    }
  },

  // 女士级数转换
  convertFemaleSize : function(genderID){
    // 女士级数超出其本身最大级数后，需用男款来补充
    if(this.sizeLevel > this.femaleMaxLevel){
      this.sizeLevel -= 2;
      this.convertMaleSize();
    }else{
    switch(this.sizeLevel){
      case 0: this.clothSize = 'WS';break;
      case 1: this.clothSize = 'WM';break;
      case 2: this.clothSize = 'WL';break;
      case 3: this.clothSize = 'WXL';break;
      default:
        this.clothSize = 'err';
      break;
   }
   }
  },
};






