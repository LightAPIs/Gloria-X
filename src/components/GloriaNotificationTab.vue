<template>
  <div class="tab-content">
    <el-container class="history-container">
      <el-aside width="200px" class="history-aside">
        <gloria-notification-menu @select-menu="onSelectMenu"></gloria-notification-menu>
      </el-aside>
      <el-container direction="vertical">
        <el-header v-if="configs.notificationShowSearchInput" height="32px">
          <gloria-search-input type="notifications" @filter="onFilter"></gloria-search-input>
        </el-header>
        <el-main>
          <div class="history">
            <el-timeline class="history-timeline">
              <gloria-notification-item
                v-for="info in notifications"
                :key="info.id"
                :menu-key="menuKey"
                :event-time="info.options.eventTime"
                :type="info.options.type"
                :title="info.options.title"
                :message="info.options.message"
                :context-message="info.options.contextMessage"
                :icon-url="info.options.iconUrl"
                :image-url="info.options.imageUrl"
                :url="info.options.url"
                :filter-text="filterText"
              ></gloria-notification-item>
            </el-timeline>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import GloriaNotificationMenu from './GloriaNotificationMenu.vue';
import GloriaSearchInput from './GloriaSearchInput.vue';
import GloriaNotificationItem from './GloriaNotificationItem.vue';

export default Vue.extend({
  name: 'gloria-notification-tab',
  components: {
    GloriaNotificationMenu,
    GloriaSearchInput,
    GloriaNotificationItem,
  },
  data() {
    return {
      menuKey: '-1',
      filterText: '',
    };
  },
  computed: {
    ...mapState(['notifications', 'configs']),
  },
  methods: {
    onSelectMenu(key: string) {
      this.menuKey = key;
    },
    onFilter(text: string) {
      this.filterText = text;
    },
  },
});
</script>

<style lang="scss">
.history-container {
  height: 510px;
  .history-aside {
    background-color: #545c64;
  }
  .history-timeline {
    padding-inline-start: 0px;
  }
}
</style>
