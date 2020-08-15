<template>
  <div id="app">
    <div>
      <form action="/">
        <umeditor v-if="renderUM" @receiveUM="receiveUM" :upload-url="'http://baidu.com'" />
      </form>
    </div>
    <input type="submit" value="提交" />
    <input type="button" @click="destroyEditor" value="destroy" />
    <input type="button" @click="reload" value="reload" />
    <input type="button" @click="uploadImage" value="uploadImage" />
    <div>
      <umeditor @receiveUM="receiveUM2" :upload-url="'http://baidu.com'" />
    </div>
    <!-- <div v-html="html"></div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      UM: "",
      UM2: "",
      renderUM: true,
    };
  },
  methods: {
    receiveUM(UM) {
      this.UM = UM;
    },
    receiveUM2(UM) {
      this.UM2 = UM;
    },
    destroyEditor() {
      this.UM.destroy();
    },
    reload() {
      this.renderUM = false;
      this.$nextTick(() => {
        this.renderUM = true;
      });
    },
    uploadImage () {
      this.UM.getFileFormData()
    }
  },
  computed: {
    html() {
      return this.UM ? this.UM.getContent() : "";
    },
  }
};
</script>

<style>
</style>