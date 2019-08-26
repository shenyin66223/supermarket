<template>
  <div class="con" ref="dl" @click="detailFn(ele.id)">
    <div class="dlBox">
      <dl @touchstart="touchstartFn" @touchmove="touchmoveFn" @touchend="touchendFn">
        <span v-if="urlPath == '/shopcar'" :class="open ? 'active' : ''" @click="BtnFn"></span>
        <dt>
          <img :src="ele.cover" alt />
        </dt>
        <dd>
          <h2>{{ele.name}}</h2>
          <p>累计{{(ele.volume/10000).toFixed(2)}}万份/已拼{{ele.stock}}份</p>
          <p>
            <span>{{JSON.parse(ele.specs)[0].key}}</span>
          </p>
          <b>
            ￥{{ele.price}}&nbsp;
            <s>￥199</s>
          </b>
        </dd>
        <p v-if="urlPath == '/shopcar'">
          <span @click="delFn(ele.id)">-</span>
          <b>{{num}}</b>
          <span @click="addFn(ele.id)">+</span>
        </p>
        <i v-else class="iconfont icon-gouwuche" @click.stop="addShopFn(ele.id)"></i>
      </dl>
    </div>
    <b class="del" @click="deleteFn(ele.id)" v-if="urlPath == '/shopcar'">删除</b>
  </div>
</template>
<script>
import api from "../../api/index";
import { Message } from "element-ui";
export default {
  props: ["ele", "count"],
  components: {},
  data() {
    return {
      urlPath: "",
      open: false,
      isOk: true,
      num: "null",
      price: 0,
      pos: {
        startx: "",
        starty: "",
        movx: "",
        movy: ""
      }
    };
  },
  computed: {},
  methods: {
    detailFn(id) {
      if (this.urlPath !== "/shopcar") {
        this.$router.push({ path: "/detail", query: { id } });
      }
    },
    deleteFn(id) {
      let { userid } = JSON.parse(sessionStorage.getItem("userinfo"));
      api.carRemoveShop({ user_id: userid, shop_id: id }).then(res => {
        let { code } = res;
        if (code) {
          Message({
            message: "成功删除购物车商品",
            type: "success"
          });
          this.$emit("deleteFn", id);
          this.open = false;
          this.allPrice -= this.price;
          this.$refs.dl.style.transform = `translateX(0)`;
        }
      });
    },
    touchstartFn(e) {
      let { clientX: x, clientY: y } = e.touches[0];
      this.startx = x;
      this.starty = y;
    },
    touchmoveFn(e) {
      let { clientX: x, clientY: y } = e.touches[0];
      this.movx = this.startx - x;
      this.movy = this.starty - y;
    },
    touchendFn(e) {
      let changeBox = this.$refs.dl;
      if (Math.abs(this.movy) > 15 && Math.abs(this.movx) < 15) {
        return;
      }
      if (this.movx > 20) {
        document.querySelectorAll(".con").forEach(item => {
          item !== changeBox && (item.style.transform = `translateX(0)`);
        });
        changeBox.style.transform = `translateX(-50px)`;
      } else if (this.movx < -20) {
        changeBox.style.transform = `translateX(0)`;
      }
    },
    BtnFn() {
      this.open = !this.open;
      this.$refs.dl.style.transform = `translateX(0)`;
    },
    addFn(id) {
      if (this.open && this.isOk) {
        let { userid } = JSON.parse(sessionStorage.getItem("userinfo"));
        this.num = ++this.num;
        this.isOk = false;
        api.carAddCar({ user_id: userid, shop_id: id }).then(res => {
          let { code } = res;
          if (code) {
            this.isOk = true;
          }
        });
      }
    },
    delFn(id) {
      if (this.open && this.num > 1 && this.isOk) {
        let { userid } = JSON.parse(sessionStorage.getItem("userinfo"));
        this.num = --this.num;
        this.isOk = false;
        api.carRemoveCar({ user_id: userid, shop_id: id }).then(res => {
          let { code } = res;
          if (code) {
            this.isOk = true;
          }
        });
      }
    },
    addShopFn(id) {
      let userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
      if (!userinfo) {
        alert(`用户未登录,请前往登录界面 ^_^`);
        this.$router.push("/login");
      } else {
        // this.$router.push("/shopcar")
        api.carAddCar({ user_id: userinfo.userid, shop_id: id }).then(res => {
          let { code } = res;
          if (code) {
            Message({
              message: "成功添加购物车",
              type: "success"
            });
          }
        });
      }
    }
  },
  created() {
    let { path } = this.$router.history.current;
    this.urlPath = path;
  },
  mounted() {
    this.num = this.count;
    this.price = this.ele.price;
  },
  watch: {
    num(newData, oldData) {
      if (newData > oldData) {
        this.$parent.allPrice += this.price;
      } else if (newData < oldData) {
        this.$parent.allPrice -= this.price;
      }
    },
    open(data) {
      if (data) {
        this.$parent.allPrice += this.num * this.price;
      } else {
        this.$parent.allPrice -= this.num * this.price;
      }
    }
  }
};
</script>
<style scoped lang="scss">
.con {
  width: calc(100% + 50px);
  margin-top: 8px;
  display: flex;
  transition: all 0.2s linear;
  > .dlBox {
    width: calc(100% - 50px);
    display: inline-block;
  }
  > b {
    width: 50px;
    height: 100%;
    display: inline-block;
    background: #fe472c;
    color: #fff;
    line-height: 100px;
    text-align: center;
  }
}
dl {
  width: 100%;
  height: 100px;
  display: flex;
  overflow: hidden;
  position: relative;
  > span {
    width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: 50%;
    border: 1px solid #ccc;
    margin: 35px 3px;
    &.active {
      background: red;
    }
  }
  > p {
    position: absolute;
    right: 10px;
    bottom: 8px;
    span {
      border: 1px solid #eee;
      width: 20px;
      height: 20px;
      display: inline-block;
      line-height: 25px;
      text-align: center;
      border-radius: 50%;
      color: #333;
    }
    > b {
      width: 20px;
      height: 20px;
      display: inline-block;
      line-height: 20px;
      text-align: center;
    }
  }
  .el-message {
    min-width: none;
  }
  i {
    width: 25px;
    height: 25px;
    background: #fe3113;
    border-radius: 50%;
    color: #fff;
    position: absolute;
    right: 15px;
    bottom: 15px;
    text-align: center;
    line-height: 25px;
  }
  dt {
    width: 70px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  dd {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    h2 {
      width: 100%;
      height: 26px;
      padding-left: 10px;
      box-sizing: border-box;
      display: block;
      width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 26px;
    }
    p {
      font-size: 12px;
      color: #666;
      padding: 2px 10px;
      span {
        padding: 2px 5px;
        background: #fe472c;
        color: #fff;
        margin: 0 2px;
        border-radius: 12px;
        font-size: 10px;
      }
    }
    b {
      width: 100%;
      height: 30px;
      position: absolute;
      left: 0;
      bottom: 0;
      font-size: 18px;
      display: flex;
      line-height: 30px;
      box-sizing: border-box;
      padding-left: 10px;
      color: #fe3113;
      s {
        font-size: 11px;
        color: #999;
        line-height: 35px;
      }
    }
  }
}
</style>