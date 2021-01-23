<template>
  <el-menu
    :default-active="activeIndex"
    background-color="#545c64"
    active-text-color="#ffd04b"
    text-color="#fff"
    @select="handleSelect"
    class="history-menu"
  >
    <el-menu-item index="-1" class="history-menu-item" :title="i18n('popupNotificationAll')">
      {{ i18n('popupNotificationAll') }}
    </el-menu-item>
    <el-menu-item index="-2" class="history-menu-item" :title="i18n('popupNotificationLater')">
      {{ i18n('popupNotificationLater') }}
    </el-menu-item>
    <el-menu-item
      v-for="(item, index) in notificationsTitleList"
      :key="index"
      :index="index.toString()"
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
      activeIndex: '-1',
    };
  },
  computed: {
    ...mapGetters(['notificationsTitleList']),
  },
  methods: {
    handleSelect(key: string) {
      this.$emit('select-menu', key);
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
