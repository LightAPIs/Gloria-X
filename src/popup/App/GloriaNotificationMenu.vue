<template>
  <el-menu
    :default-active="activeIndex"
    background-color="#545c64"
    active-text-color="#ffd04b"
    text-color="#fff"
    @select="handleSelect"
    class="history-menu"
  >
    <el-menu-item index="0" class="history-menu-item" :title="i18n('popupNotificationAll')">
      {{ i18n('popupNotificationAll') }}
    </el-menu-item>
    <el-menu-item
      v-for="(item, index) in notificationsTitleList"
      :key="index + 1"
      :index="(index + 1).toString()"
      class="history-menu-item"
      :title="item"
    >
      {{ item }}
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'gloria-notification-menu',
  data() {
    return {
      activeIndex: '0',
    };
  },
  computed: {
    ...mapGetters(['notificationsTitleList']),
  },
  methods: {
    handleSelect(key: string, keyPath: string) {
      console.log('select');
      console.log(key, keyPath);
    },
  },
});
</script>

<style lang="scss">
.history-menu {
  height: 510px;
  .history-menu-item {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
