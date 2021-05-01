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
        <el-main class="notifications-main">
          <el-scrollbar
            :native="false"
            :noresize="false"
            wrap-class="notifications-scroll-wrap"
            view-class="notifications-scroll-view"
            tag="div"
          >
            <el-timeline v-infinite-scroll="onInfiniteLoad" class="history-timeline">
              <gloria-notification-item
                v-for="info in notificationsList(loadIndex, menuName, filterText, isLater)"
                :id="info.id"
                :key="info.id"
                :later="info.later"
                :visited="info.visited"
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
          </el-scrollbar>
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
import { mapState, mapGetters } from 'vuex';
import GloriaNotificationMenu from './GloriaNotificationMenu.vue';
import GloriaSearchInput from './GloriaSearchInput.vue';
import GloriaNotificationItem from './GloriaNotificationItem.vue';
import GloriaContextMenu from './GloriaContextMenu.vue';

export default defineComponent({
  name: 'GloriaNotificationTab',
  components: {
    GloriaNotificationMenu,
    GloriaSearchInput,
    GloriaNotificationItem,
    GloriaContextMenu,
  },
  data() {
    return {
      menuName: '',
      isLater: false,
      filterText: '',
      loadIndex: 5,
      context: {
        isShow: false,
        items: [],
        event: null,
      },
    };
  },
  computed: {
    ...mapState(['configs']),
    ...mapGetters(['notificationsList']),
  },
  methods: {
    onSelectMenu(menuObj: { menuName: string; isLater: boolean }) {
      this.menuName = menuObj.menuName;
      this.isLater = menuObj.isLater;
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
    onInfiniteLoad() {
      this.loadIndex += 2;
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

.notifications-main {
  padding-right: 0px;
  padding-left: 10px;
}

.notifications-scroll-wrap {
  margin-right: 15px;
}

.notifications-scroll-view {
  margin-left: 1px;
  margin-right: 5px;
}
</style>
