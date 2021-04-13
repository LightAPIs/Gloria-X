<template>
  <div class="tab-content">
    <el-container class="history-container">
      <el-aside width="200px" class="history-aside">
        <gloria-notification-menu @select-menu="onSelectMenu" @menu-contextmenu="onContextmenu"></gloria-notification-menu>
      </el-aside>
      <el-container direction="vertical">
        <el-header v-if="configs.notificationShowSearchInput" height="32px">
          <gloria-search-input type="notifications" @filter-text="onFilterText"></gloria-search-input>
        </el-header>
        <el-main>
          <div class="history">
            <el-timeline class="history-timeline" color="#0bbd87">
              <gloria-notification-item
                v-for="info in notifications"
                :key="info.id"
                :id="info.id"
                :menu-key="menuKey"
                :later="info.later"
                :event-time="info.options.eventTime"
                :type="info.options.type"
                :title="info.options.title"
                :message="info.options.message"
                :context-message="info.options.contextMessage"
                :icon-url="info.options.iconUrl"
                :image-url="info.options.imageUrl"
                :url="info.options.url"
                :filter-text="filterText"
                @notification-contextmenu="onContextmenu"
              ></gloria-notification-item>
            </el-timeline>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <gloria-context-menu
      :is-show="context.isShow"
      :items="context.items"
      :context-event="context.event"
      @close="onContextmenuClose"
    ></gloria-context-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import GloriaNotificationMenu from './GloriaNotificationMenu.vue';
import GloriaSearchInput from './GloriaSearchInput.vue';
import GloriaNotificationItem from './GloriaNotificationItem.vue';
import GloriaContextMenu from './GloriaContextMenu.vue';

export default defineComponent({
  name: 'gloria-notification-tab',
  components: {
    GloriaNotificationMenu,
    GloriaSearchInput,
    GloriaNotificationItem,
    GloriaContextMenu,
  },
  data() {
    return {
      menuKey: '-1',
      filterText: '',
      context: {
        isShow: false,
        items: [],
        event: null,
      },
    };
  },
  computed: {
    ...mapState(['notifications', 'configs']),
  },
  methods: {
    onSelectMenu(key: string) {
      this.menuKey = key;
    },
    onFilterText(text: string) {
      this.filterText = text;
    },
    onContextmenu(context: unknown) {
      Object.assign(this.context, context, {
        isShow: true,
      });
    },
    onContextmenuClose() {
      this.context.isShow = false;
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
