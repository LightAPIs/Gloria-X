<template>
  <el-scrollbar :native="false" :noresize="false">
    <el-menu
      class="history-menu"
      default-active="-1"
      background-color="#545c64"
      active-text-color="#ffd04b"
      text-color="#fff"
      @select="handleSelect"
    >
      <el-menu-item
        index="-1"
        class="history-menu-item"
        :title="i18n('popupNotificationAll')"
        @contextmenu.prevent="onContextmenu($event, '-1')"
      >
        <template v-if="configs.notificationShowMenuCount">
          <el-row type="flex">
            <el-col :span="22">
              <span class="menu-item-text">{{ i18n('popupNotificationAll') }}</span>
            </el-col>
            <el-col :span="2">
              <strong class="menu-item-count">{{ notificationsAllCount }}</strong>
            </el-col>
          </el-row>
        </template>
        <span v-else>
          {{ i18n('popupNotificationAll') }}
        </span>
      </el-menu-item>
      <el-menu-item
        index="-2"
        class="history-menu-item"
        :title="i18n('popupNotificationLater')"
        @contextmenu.prevent="onContextmenu($event, '-2')"
      >
        {{ i18n('popupNotificationLater') }}
        <el-badge v-show="laterCount > 0" :value="laterCount" :max="99" class="later-count" type="danger" />
      </el-menu-item>
      <el-menu-item
        v-for="(item, index) in notificationsTitleList"
        :key="index"
        :index="index.toString()"
        class="history-menu-item"
        :title="item"
        @contextmenu.prevent="onContextmenu($event, index.toString())"
      >
        <template v-if="configs.notificationShowMenuCount">
          <el-row type="flex">
            <el-col :span="22">
              <span class="menu-item-text">{{ item }}</span>
            </el-col>
            <el-col :span="2">
              <strong class="menu-item-count">{{ notificationCount(item) }}</strong>
            </el-col>
          </el-row>
        </template>
        <span v-else>
          {{ item }}
        </span>
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElMessage } from 'element-plus';
import { mapState, mapGetters, mapMutations } from 'vuex';

/* global myStore */

export default defineComponent({
  name: 'GloriaNotificationMenu',
  emits: ['select-menu', 'menu-contextmenu'],
  computed: {
    ...mapState(['configs']),
    ...mapGetters(['notificationsTitleList', 'laterCount', 'laterList', 'notificationCount', 'notificationsAllCount']),
  },
  methods: {
    ...mapMutations([
      'checkedNotification',
      'clearLaterCount',
      'clearNotifications',
      'markLaterByName',
      'removeLaterByName',
      'removeNotificationsByName',
    ]),
    handleSelect(key: string) {
      let menuName = '';
      let isLater = false;
      if (key == '-2') {
        isLater = true;
      } else if (key != '-1') {
        menuName = this.notificationsTitleList[key];
      }

      this.$emit('select-menu', {
        menuName,
        isLater,
      });
    },
    onContextmenu(event: MouseEvent, index: string) {
      const { notificationsTitleList, laterCount, laterList } = this;
      const items = [];

      if (index !== '-1' && index !== '-2') {
        items.push(
          {
            label: this.i18n('popupContextNotificationMenuCopy'),
            icon: 'el-icon-document-copy',
            divided: true,
            onClick: () => {
              this.copyToClip(
                notificationsTitleList[index],
                () => {
                  ElMessage.success(this.i18n('popupContextNotificationMenuCopyCompleted'));
                },
                () => {
                  ElMessage.error(this.i18n('popupContextNotificationItemCopyError'));
                }
              );
            },
          },
          {
            label: this.i18n('popupContextNotificationMenuMarkLater'),
            icon: 'el-icon-collection-tag',
            onClick: () => {
              this.markLaterByName(notificationsTitleList[index]);
            },
          },
          {
            label: this.i18n('popupContextNotificationMenuRemoveLater'),
            icon: 'el-icon-finished',
            divided: true,
            onClick: () => {
              this.removeLaterByName(notificationsTitleList[index]);
            },
          }
        );
      }

      if (index === '-2') {
        if (laterCount <= 10) {
          items.push({
            label: this.i18n('popupContextNotificationMenuOpenLater'),
            icon: 'el-icon-view',
            onClick: () => {
              this.openLinks(laterList);
            },
          });
        }

        items.push({
          label: this.i18n('popupContextNotificationMenuCheckedLater'),
          icon: 'el-icon-finished',
          onClick: () => {
            this.clearLaterCount();
          },
        });
      }

      if (index !== '-2') {
        if (index === '-1') {
          items.push({
            label: this.i18n('popupContextNotificationMenuClearAll'),
            icon: 'el-icon-delete-solid',
            onClick: () => {
              this.clearNotifications();
            },
          });
        } else {
          items.push({
            label: this.i18n('popupContextNotificationMenuClear'),
            icon: 'el-icon-delete-solid',
            onClick: () => {
              this.removeNotificationsByName(notificationsTitleList[index]);
            },
          });
        }
      }

      this.$emit('menu-contextmenu', {
        items,
        event,
      });
      return false;
    },
    openLinks(list: myStore.GloriaNotification[]) {
      const { notificationOpenInterval } = this.configs;
      const links = new Set([] as string[]);
      let index = 0;
      list.forEach(ele => {
        const {
          options: { url },
          later,
          id,
        } = ele;

        if (url && this.isLink(url)) {
          const oUrl = this.asLink(url);
          if (!links.has(oUrl)) {
            links.add(oUrl);
            chrome.tabs.query(
              {
                url: oUrl,
                currentWindow: true,
              },
              tabs => {
                if (tabs.length === 0) {
                  setTimeout(() => {
                    chrome.tabs.create({
                      url,
                      active: false,
                    });
                  }, index * notificationOpenInterval);
                  index++;
                }
              }
            );
          }
        }

        if (later) {
          this.checkedNotification(id);
        }
      });
    },
  },
});
</script>

<style lang="scss">
.history-menu {
  height: 510px;
  border-right: 1px solid #545c64;
  .history-menu-item {
    overflow: hidden;
    text-overflow: ellipsis;
    .menu-item-text {
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }
    .menu-item-count {
      color: #409eff;
    }
  }
}
.later-count {
  sup {
    vertical-align: super;
  }
}
</style>
