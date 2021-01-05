<template>
  <div class="tab-content">
    <el-container class="history-container">
      <el-aside width="200px" class="history-aside">
        <gloria-notification-menu></gloria-notification-menu>
      </el-aside>
      <el-container>
        <el-header>
          <gloria-notification-input></gloria-notification-input>
        </el-header>
        <el-main>
          <div class="history">
            <el-timeline class="history-timeline">
              <el-timeline-item
                v-for="info in notifications"
                :key="info.id"
                :timestamp="displayTime(info.options.eventTime)"
                placement="top"
              >
                <gloria-notification-item
                  :type="info.options.type"
                  :title="info.options.title"
                  :message="info.options.message"
                  :context-message="info.options.contextMessage"
                  :icon-url="info.options.iconUrl"
                  :image-url="info.options.imageUrl"
                  :url="info.options.url"
                ></gloria-notification-item>
              </el-timeline-item>
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
import GloriaNotificationInput from './GloriaNotificationInput.vue';
import GloriaNotificationItem from './GloriaNotificationItem.vue';

export default Vue.extend({
  name: 'gloria-notification-tab',
  components: {
    GloriaNotificationMenu,
    GloriaNotificationInput,
    GloriaNotificationItem,
  },
  computed: {
    ...mapState(['notifications']),
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
