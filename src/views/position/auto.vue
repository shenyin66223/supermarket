<template>
  <div class="autoPosition">
    <img :src="require('../../static/logo/position.png')" alt />
  </div>
</template>
<script>
import mspFn from "@/utils/map";
export default {
  props: {},
  components: {},
  data() {
    return {
      geolocation: null
    };
  },
  computed: {},
  methods: {},
  created() {
    let mapObj = new AMap.Map("#autoPosition");
    mapObj.plugin("AMap.Geolocation", () => {
      this.geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 10000, //超过10秒后停止定位，默认：无穷大
        maximumAge: 1000, //定位结果缓存0毫秒，默认：0
        convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: false //显示定位按钮，默认：true
      });
    });
  },
  mounted() {
    this.geolocation.isSupported(true);
    this.geolocation.getCurrentPosition((status, result) => {
        console.log(status, result)
      if (status === "complete") {
        sessionStorage.setItem("position", result);
        this.$router.push("/home");
      } else {
        this.$router.push("/position");
      }
    });
  }
};
</script>
<style scoped lang="scss">
.autoPosition {
  width: 100%;
  height: 100%;
  overflow: hidden;
  > img {
    width: 100%;
    height: 100%;
  }
}
</style>