<template>
  <div class="container">
    <!-- 导航栏 -->
    <navBar :name="navName"></navBar>
    <!-- 加载动画 -->
    <loader v-if="showLoader"></loader>
    <!-- 置顶卡片部分 -->
    <div class="card" :style="{ top: cardTop }">
      <div class="imgRight" @click="toChart(top.name)">
        <img src="/static/images/cardRight.svg" alt="cardRight" />
      </div>
      <div class="cardPerson" @click="toChart(top.name)">
        <img :src="top.image" />
      </div>
      <div class="cardBigText">
        <p>{{ top.name }}</p>
      </div>
      <div class="cardSmallText">
        <p>{{ top.days }}</p>
      </div>
    </div>
    <!-- 小伙伴列表 -->
    <div class="dude" :style="{ height: dudeHeight }">
      <div class="dudeTitle" @click="toDude">
        <p>小伙伴</p>
        <img src="/static/images/add.svg" alt="add" />
      </div>
      <div class="dudeList" :style="{ height: dudeListMaxHeight }">
        <div
          class="dudeCard"
          :style="{ backgroundColor: item.bgColor }"
          v-show="item.id + 1"
          v-for="(item, index) in dudeItem"
          :key="index"
        >
          <div class="profile" @click="toChart(item.name)">
            <img :src="item.profile" />
          </div>
          <div class="optionsButton" @click="showBtn(index)">
            <img :src="item.img" />
          </div>
          <div
            class="dudename"
            :style="{ color: item.nameColor }"
            @click="toChart(item.name)"
          >
            <p>{{ item.name }}</p>
          </div>
          <div class="time" :style="{ color: item.time }">
            <p>起始日:{{ item.start }}</p>
          </div>
          <div class="control" v-if="item.show">
            <p @click="toTop(item.name)">置顶</p>
            <hr />
            <p @click="deleteDude(item.name)">删除</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "@/components/navBar";
import loader from "@/components/loader";
export default {
  components: {
    navBar,
    loader,
  },
  data() {
    return {
      showLoader: true,
      navName: "小本子",
      isTrue: false,
      screenHeight: "",
      dudeHeight: "",
      navHeight: "",
      cardTop: "",
      dudeListMaxHeight: "",
      scale: "",
      top: {
        image: "",
        name: "",
        days: "",
      },
      dudeItem: [
        {
          id: Number,
          bgColor: "rgba(67, 120, 219, 0.16);",
          nameColor: "rgba(64, 93, 181, 1)",
          time: "rgba(67, 120, 219, 1)",
          img: "/static/images/optionsOne.svg",
          profile: "",
          name: "",
          start: "",
          show: false,
        },
        {
          id: Number,
          bgColor: "rgba(240, 167, 20, 0.16)",
          nameColor: "rgba(240, 167, 20, 1)",
          time: "rgba(240, 167, 20, 1)",
          img: "/static/images/optionsTwo.svg",
          profile: "",
          name: "",
          start: "",
          show: false,
        },
        {
          id: Number,
          bgColor: "rgba(243, 85, 85, 0.16)",
          nameColor: "rgba(171, 63, 63, 1)",
          time: "rgba(243, 85, 85, 1)",
          img: "/static/images/optionsThree.svg",
          profile: "",
          name: "",
          start: "",
          show: false,
        },
        {
          id: Number,
          bgColor: "rgba(40, 161, 100, 0.16)",
          nameColor: "rgba(34, 137, 85, 1)",
          time: "rgba(40, 161, 100, 1)",
          img: "/static/images/optionsFour.svg",
          profile: "",
          name: "",
          start: "",
          show: false,
        },
      ],
      ui: {},
      dudeInfo: [],
      btnId: 0,
    };
  },
  methods: {
    //跳转至小伙伴个人界面
    toChart(e) {
      let url = "/pages/chart/main?name=" + e;
      if (getCurrentPages().length >= 10) {
        //判断当前页面栈是否大于等于10.如果大于或等于就使用wx.redirectTo来跳转页面，清除当前页面栈
        wx.redirectTo({
          url,
        });
      } else {
        wx.navigateTo({
          url,
        });
      }
    },
    //跳转至创建伙伴界面
    toDude() {
      let url = "/pages/dude/main";
      if (getCurrentPages().length >= 10) {
        wx.redirectTo({
          url,
        });
      } else {
        wx.navigateTo({
          url,
        });
      }
    },
    //显示按钮
    showBtn(e) {
      this.dudeItem[e].show = !this.dudeItem[e].show;
      this.btnId = e;
    },
    //获取导航栏参数
    getNav() {
      console.log("getNav");
      let that = this;
      //获取按钮信息
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
      //获取用户手机信息
      const systemInfo = wx.getSystemInfoSync();
      that.globalData.screenHeight = systemInfo.screenHeight;
      that.scale = systemInfo.screenWidth / 375;
      that.navHeight =
        (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 +
        menuButtonInfo.height +
        systemInfo.statusBarHeight;
      that.globalData.navHeight = that.navHeight + "px";
      that.globalData.barHeight =
        systemInfo.screenHeight - that.navHeight + "px";
      //缩放比例
      that.cardTop = that.navHeight + that.scale * 29 + "px";
      that.dudeHeight =
        systemInfo.screenHeight - that.navHeight - that.scale * 222 + "px";
      that.dudeListMaxHeight =
        systemInfo.screenHeight -
        that.navHeight -
        that.scale * 222 -
        that.scale * 104 +
        "px";
      that.globalData.imgHeight = menuButtonInfo.height + "px";
      that.globalData.imgTop = menuButtonInfo.top + "px";
      that.globalData.imgLeft =
        systemInfo.screenWidth - menuButtonInfo.right + "px";
    },
    //获取小伙伴数据
    getData() {
      const that = this;
      that.ui = wx.getStorageSync("ui");
      wx.cloud
        .callFunction({
          name: "finddude",
          data: {
            openId: that.ui.openId,
          },
        })
        .then((res) => {
          console.log(res);
          that.dudeInfo = res.result.data;
          if (that.dudeInfo[0]) {
            that.mergeImg();
          } else {
            that.toDude();
          }
          that.showLoader = false;
          that.isTrue = false;
        })
        .catch((err) => {
          console.log("读取数据库失败", err);
        });
    },
    //置顶
    toTop(e) {
      let time = new Date();
      let now = time.getTime();
      const that = this;
      that.showBtn(that.btnId);
      that.showLoader = true;
      wx.cloud
        .callFunction({
          name: "updatetop",
          data: {
            openId: that.ui.openId,
            name: e,
            top: now,
          },
        })
        .then((res) => {
          that.getData();
          that.showLoader = false;
          wx.showToast({
            title: "置顶成功",
            icon: "success",
            duration: 2000,
          });
        })
        .catch((err) => {
          that.isTrue = false;
          wx.showToast({
            title: "置顶失败",
            icon: "error",
            duration: 2000,
          });
        });
    },
    //删除
    deleteDude(e) {
      const that = this;
      that.showLoader = true;
      that.showBtn(that.btnId);
      wx.cloud
        .callFunction({
          name: "removedude",
          data: {
            openId: that.ui.openId,
            name: e,
          },
        })
        .then((res) => {
          that.cleanArr();
          that.getData();
          wx.showToast({
            title: "删除成功",
            icon: "success",
            duration: 2000,
          });
        })
        .catch((err) => {
          wx.showToast({
            title: "删除失败",
            icon: "error",
            duration: 2000,
          });
        });
    },
    //清空数组
    cleanArr() {
      for (let i = 0; i < this.dudeItem.length; i++) {
        this.dudeItem[i].id = Number;
        this.dudeItem[i].name = "";
        this.dudeItem[i].profile = "";
        this.dudeItem[i].start = "";
      }
    },
    // 预处理信息
    mergeImg() {
      for (let i = 0; i < this.dudeInfo.length; i++) {
        this.dudeItem[i].id = i;
        this.dudeItem[i].profile =
          "/static/images/" + this.dudeInfo[i].name + ".png";
        this.dudeItem[i].name = this.dudeInfo[i].name;
        this.dudeItem[i].start = this.dudeInfo[i].startDays;
      }
      //处理置顶信息
      this.top.image = this.dudeItem[0].profile;
      this.top.name = this.dudeItem[0].name;
      let time = new Date();
      let now = time.getTime();
      let old = this.dudeInfo[0].startTime;
      let onceDays = this.dudeInfo[0].allSeconds;
      this.allSeconds = now - old + onceDays;
      this.top.days = Math.ceil(this.allSeconds / 86400000) + " 天";
    },
  },
  created() {
    this.getNav();
  },
  onShow() {
    this.getData();
  },
};
</script>

<style>
.container {
  position: relative;
  background-color: #f2f5f8;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.card {
  position: absolute;
  width: 345px;
  height: 163px;
  background-color: #4378db;
  border-radius: 26px;
  box-shadow: 10px 15px 5px rgba(67, 120, 219, 0.2);
}

.card .imgRight img {
  position: absolute;
  width: 56px;
  height: 54px;
  right: 0;
}

.card .cardPerson {
  position: absolute;
  width: 97px;
  height: 97px;
  top: 25px;
  left: 37px;
  background-color: #ffffff;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card .cardPerson img {
  position: absolute;
  width: 82px;
  height: 82px;
}

.card .cardBigText p {
  position: absolute;
  top: 35px;
  left: 165px;
  font-family: PingFang HK;
  font-size: 28px;
  color: #ffffff;
}

.card .cardSmallText p {
  position: absolute;
  left: 166px;
  top: 79px;
  font-family: PingFang HK;
  font-size: 22px;
  color: rgba(255, 255, 255, 0.8);
}

.dude {
  position: absolute;
  width: 100%;
  bottom: 0px;
  border-radius: 16px 16px 0px 0px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
}

.dude .dudeTitle {
  position: absolute;
  width: 322px;
  height: 27px;
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dude .dudeTitle p {
  font-family: Poppins;
  font-size: 18px;
  color: rgba(33, 32, 90, 1);
}

.dude .dudeTitle img {
  width: 15px;
  height: 15px;
}

.dude .dudeList {
  position: absolute;
  width: 346px;
  overflow: scroll;
  margin-top: 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-gap: 16px;
}

.dude .dudeList .dudeCard {
  position: relative;
  width: 165px;
  height: 125px;
  border-radius: 16px;
}

.dudeList .dudeCard .profile {
  position: absolute;
  width: 35px;
  height: 35px;
  left: 19px;
  top: 16px;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dudeCard .profile img {
  width: 23px;
  height: 23px;
}

.dudeCard .optionsButton img {
  width: 24px;
  height: 24px;
  position: absolute;
  right: 16px;
  top: 23px;
}

.dudeCard .dudename {
  font-family: Poppins;
  font-size: 16px;
  position: absolute;
  left: 16px;
  top: 64px;
}

.dudeCard .time {
  font-family: PingFang SC;
  font-size: 14px;
  position: absolute;
  left: 16px;
  bottom: 16px;
}

.dudeCard .control {
  width: 45px;
  height: 53px;
  position: absolute;
  top: 56px;
  right: 7px;
  background-color: rgba(81, 81, 81, 1);
  border-radius: 3px;
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  align-content: space-around;
}

.dudeCard .control p {
  font-family: PingFang SC;
  font-size: 12px;
  color: rgba(255, 255, 255, 1);
}

.dudeCard .control hr {
  background-color: rgba(0, 0, 0, 0.22);
  width: 100%;
  height: 1px;
}
</style>
