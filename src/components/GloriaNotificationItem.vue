<template>
  <el-timeline-item :timestamp="displayTime(eventTime)" placement="top" :color="nodeColor">
    <el-badge is-dot :hidden="!later" type="danger" class="notification-item">
      <el-card :body-style="{ padding: '5px 15px' }" class="history-card" @contextmenu.prevent="onContextmenu">
        <template #header>
          <div class="card-header">
            <el-row>
              <el-col :span="4">
                <el-avatar class="card-icon" shape="square" fit="fill" :size="68" :src="displayIcon"></el-avatar>
              </el-col>
              <el-col :span="20" class="header-title">
                <template v-if="isLink(url)">
                  <template v-if="configs.notificationShowUrl">
                    <div class="title-text">
                      <gloria-text-highlight v-if="title" :text="title" :keyword="filterText"></gloria-text-highlight>
                      <span v-else>
                        {{ url }}
                      </span>
                    </div>
                    <el-link type="primary" href="#" class="url-text" @click="openLink(false)">
                      {{ url }}
                    </el-link>
                  </template>
                  <el-link v-else type="primary" href="#" @click="openLink(false)">
                    <gloria-text-highlight v-if="title" :text="title" :keyword="filterText"></gloria-text-highlight>
                    <span v-else>
                      {{ url }}
                    </span>
                  </el-link>
                </template>
                <div v-else class="title-text">
                  <gloria-text-highlight :text="title" :keyword="filterText"></gloria-text-highlight>
                </div>
                <div class="context-message">
                  {{ i18n('popupNotificationFrom') }}
                  <gloria-text-highlight :text="contextMessage" :keyword="filterText"></gloria-text-highlight>
                </div>
              </el-col>
            </el-row>
          </div>
        </template>
        <span class="message-text">
          <gloria-text-highlight :text="message" :keyword="filterText"></gloria-text-highlight>
        </span>
        <el-image v-if="type === 'image'" :lazy="configs.notificationLazyLoading" class="card-image" :src="imageUrl"></el-image>
      </el-card>
    </el-badge>
  </el-timeline-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations } from 'vuex';
import { ElMessage } from 'element-plus';
import { APP_ICON_URL } from '@/commons/var';
import GloriaTextHighlight from './GloriaTextHighlight.vue';

export default defineComponent({
  name: 'GloriaNotificationItem',
  components: {
    GloriaTextHighlight,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    later: {
      type: Boolean,
      default: false,
    },
    visited: {
      type: Boolean,
      default: false,
    },
    eventTime: {
      type: Number || String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    contextMessage: {
      type: String,
      required: true,
    },
    iconUrl: {
      type: String,
      default: APP_ICON_URL,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    filterText: {
      type: String,
      default: '',
    },
  },
  emits: ['notification-contextmenu'],
  computed: {
    ...mapState(['configs']),
    displayIcon(): string {
      const { iconUrl } = this;
      if (!iconUrl) {
        return APP_ICON_URL;
      } else {
        return iconUrl;
      }
    },
    nodeColor(): string {
      let color = '#909399';
      const { later, visited, url, type } = this;
      if (later) {
        color = '#f56c6c';
      } else if (visited) {
        color = '#0bbd87';
      } else if (url) {
        color = '#3a8ee6';
      } else if (type === 'error') {
        color = '#ffcc00';
      } else if (type === 'image') {
        color = '#a56b56';
      }
      return color;
    },
  },
  methods: {
    ...mapMutations(['checkedNotification', 'visitNotification', 'markLaterNotification', 'removeNotification']),
    openLink(active: boolean) {
      const { url, later, visited, id } = this;
      if (url && this.isLink(url)) {
        chrome.tabs.query(
          {
            url: this.asLink(url),
            currentWindow: true,
          },
          tabs => {
            if (!chrome.runtime.lastError && tabs[0]) {
              const { windowId, index } = tabs[0];
              chrome.tabs.highlight({
                windowId,
                tabs: index,
              });
            } else {
              chrome.tabs.create({
                url,
                active,
              });
            }
          }
        );
      }

      !visited && this.visitNotification(id);
      later && this.checkedNotification(id);
    },
    onContextmenu(event: MouseEvent) {
      const { id, url, title, message, iconUrl, imageUrl, later } = this;
      const items = [];

      url &&
        items.push(
          {
            label: this.i18n('popupContextNotificationItemOpenLink'),
            icon: 'el-icon-view',
            divided: true,
            onClick: () => {
              this.openLink(true);
            },
          },
          {
            label: this.i18n('popupContextNotificationItemCopyLink'),
            icon: 'el-icon-link',
            onClick: () => {
              this.copyToClip(
                url,
                () => {
                  ElMessage.success(this.i18n('popupContextNotificationItemCopyLinkCompleted'));
                },
                () => {
                  ElMessage.error(this.i18n('popupContextNotificationItemCopyError'));
                }
              );
            },
          }
        );

      title &&
        items.push({
          label: this.i18n('popupContextNotificationItemCopyTitle'),
          icon: 'el-icon-chat-dot-round',
          onClick: () => {
            this.copyToClip(
              title,
              () => {
                ElMessage.success(this.i18n('popupContextNotificationItemCopyTitleCompleted'));
              },
              () => {
                ElMessage.error(this.i18n('popupContextNotificationItemCopyError'));
              }
            );
          },
        });

      message &&
        items.push({
          label: this.i18n('popupContextNotificationItemCopyMessage'),
          icon: 'el-icon-chat-line-round',
          onClick: () => {
            this.copyToClip(
              message,
              () => {
                ElMessage.success(this.i18n('popupContextNotificationItemCopyMessageCompleted'));
              },
              () => {
                ElMessage.error(this.i18n('popupContextNotificationItemCopyError'));
              }
            );
          },
        });

      iconUrl &&
        items.push({
          label: this.i18n('popupContextNotificationItemCopyIconUrl'),
          icon: 'el-icon-picture-outline-round',
          onClick: () => {
            this.copyToClip(
              iconUrl,
              () => {
                ElMessage.success(this.i18n('popupContextNotificationItemCopyIconUrlCompleted'));
              },
              () => {
                ElMessage.error(this.i18n('popupContextNotificationItemCopyError'));
              }
            );
          },
        });

      imageUrl &&
        items.push({
          label: this.i18n('popupContextNotificationItemCopyImageUrl'),
          icon: 'el-icon-picture-outline',
          onClick: () => {
            this.copyToClip(
              imageUrl,
              () => {
                ElMessage.success(this.i18n('popupContextNotificationItemCopyImageUrlCompleted'));
              },
              () => {
                ElMessage.error(this.i18n('popupContextNotificationItemCopyError'));
              }
            );
          },
        });

      id &&
        items.push({
          label: this.i18n('popupContextNotificationItemCopyId'),
          icon: 'el-icon-user',
          divided: true,
          onClick: () => {
            this.copyToClip(
              id,
              () => {
                ElMessage.success(this.i18n('popupContextNotificationItemCopyIdCompleted'));
              },
              () => {
                ElMessage.error(this.i18n('popupContextNotificationItemCopyError'));
              }
            );
          },
        });

      if (url) {
        items.push({
          label: later ? this.i18n('popupContextNotificationItemRemoveLater') : this.i18n('popupContextNotificationItemMarkLater'),
          icon: later ? 'el-icon-check' : 'el-icon-collection-tag',
          divided: true,
          onClick: () => {
            if (later) {
              this.checkedNotification(id);
            } else {
              this.markLaterNotification(id);
            }
          },
        });
      }

      items.push({
        label: this.i18n('popupContextNotificationItemDelete'),
        icon: 'el-icon-delete',
        onClick: () => {
          this.removeNotification(id);
        },
      });

      this.$emit('notification-contextmenu', {
        items,
        event,
      });
      return false;
    },
  },
});
</script>

<style lang="scss">
.notification-item {
  display: block;
}
.history-card {
  .header-title {
    padding: 0px 10px;
    .context-message {
      color: #aaa;
    }
  }
  .el-card__header {
    padding: 5px 10px;
  }
  .card-icon {
    background-color: #fbfbfb;
  }
  .card-image {
    width: 100%;
    margin-top: 5px;
  }
}
</style>
