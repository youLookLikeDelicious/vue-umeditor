<template>
  <div id="app">
      <nav class="navigation">
          <router-link to="/">首页</router-link>
          <router-link to="/other">其他</router-link>
      </nav>
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
.navigation{
    height: 4.5rem;
}
</style>