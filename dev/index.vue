<template>
  <form action="/">
    <div id="umeditor">
      <umeditor @receiveUM="receiveUM" :upload-url="'http://baidu.com'" />
    </div>
    <input type="submit" value="提交" />
  </form>
</template>

<script>
export default {
  data() {
    return UM;
  },
  methods: {
    receiveUM(UM) {
        console.log(UM.replaceImageUrl)
      this.UM = UM;
    },
  },
};
</script>

<style>
</style>