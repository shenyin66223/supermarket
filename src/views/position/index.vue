<template>
  <div class="wrap">
    <Header />
    <div class="main">
      <div class="iptBox">
        <input type="text" v-model="val" ref='ipt' placeholder="搜索地址" />
      </div>
      <ul ref="show"></ul>
    </div>
  </div>
</template>
<script>
import { getPlugin } from "../../utils/map";
export default {
  props: {},
  components: {},
  data() {
    return {
      val: "",
      ind: 0,
      search: null,
      resultList: []
    };
  },
  computed: {},
  methods: {
    clickFn(index, name) {
      this.ind = index;
      this.val = name ? name : this.val;
      sessionStorage.setItem("position", name);
      this.$router.push("/home");
    }
  },
  created() {},
  async mounted() {
    this.search = await getPlugin("AMap.Autocomplete", {
      city: "陵川",
      input: this.$refs.ipt,
      output:this.$refs.show
    });
    this.search.on('select', (d) => {
      console.log(d.poi.address)
      sessionStorage.setItem("position", d.poi.address);
      this.$router.push("/home");
    })
  },
};
</script>
<style scoped lang="scss">
.wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .main {
    flex: 1;
    overflow: auto;
    .iptBox {
      width: 100%;
      height: 35px;
      input {
        width: 90%;
        height: 100%;
        margin: 0 5%;
        background: #eee;
        padding-left: 6px;
        box-sizing: border-box;
        border-radius: 15px;
        border: none;
        outline: none;
      }
    }
    ul {
      width: 90%;
      margin: 3px auto;
      background: yellow;
      border-radius: 10px;
      // li {
      //   width: 100%;
      //   height: 30px;
      //   white-space: nowrap;
      //   overflow: hidden;
      //   text-overflow: ellipsis;
      //   padding-left: 8px;
      //   box-sizing: border-box;
      //   line-height: 30px;
      //   &.active {
      //     color: palevioletred;
      //     background: palegreen;
      //   }
      // }
    }
  }
}
</style>