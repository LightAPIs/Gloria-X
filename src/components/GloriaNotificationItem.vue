<template>
  <el-timeline-item v-show="matchMenu && itemShow" :timestamp="displayTime(eventTime)" placement="top">
    <el-badge is-dot :hidden="!later" class="notification-item">
      <el-card :body-style="{ padding: '5px 15px' }" class="history-card">
        <div slot="header" class="card-header">
          <el-row>
            <el-col :span="4">
              <el-avatar class="card-icon" shape="square" fit="fill" :size="68" :src="displayIcon"></el-avatar>
            </el-col>
            <el-col :span="20" class="header-title">
              <template v-if="isLink(url)">
                <template v-if="configs.notificationShowUrl">
                  <div class="title-text">
                    {{ title || url }}
                  </div>
                  <el-link type="primary" @click="openLink" class="url-text">
                    {{ url }}
                  </el-link>
                </template>
                <el-link v-else type="primary" @click="openLink">
                  {{ title || url }}
                </el-link>
              </template>
              <div v-else class="title-text">
                {{ title }}
              </div>
              <div class="context-message">
                {{ i18n('popupNotificationFrom') + contextMessage }}
              </div>
            </el-col>
          </el-row>
        </div>
        <span>
          {{ message }}
        </span>
        <el-image v-if="type === 'image'" :lazy="configs.notificationLazyLoading" class="card-image" :src="imageUrl"></el-image>
      </el-card>
    </el-badge>
  </el-timeline-item>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapState, mapMutations } from 'vuex';
import { toLower } from 'lodash';
import { APP_ICON_URL } from '@/commons/var';

export default Vue.extend({
  name: 'gloria-notification-item',
  props: {
    menuKey: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    later: {
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
    },
    message: {
      type: String,
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
    },
    url: {
      type: String,
    },
    filterText: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState(['configs']),
    ...mapGetters(['notificationsTitleList']),
    matchMenu() {
      const { menuKey, contextMessage, later } = this;
      let show = true;
      if (menuKey != '-1' && menuKey != '-2') {
        const menuName = this.notificationsTitleList[menuKey];
        if (menuName !== contextMessage) {
          show = false;
        }
      } else if (menuKey == '-2') {
        if (!later) {
          show = false;
        }
      }
      return show;
    },
    itemShow() {
      let show = false;
      const { filterText, title, message } = this;
      if (!filterText || toLower(title).includes(toLower(filterText)) || toLower(message).includes(toLower(filterText))) {
        show = true;
      }
      return show;
    },
    displayIcon(): string {
      const { iconUrl } = this;
      if (!iconUrl) {
        return APP_ICON_URL;
      } else {
        return iconUrl;
      }
    },
  },
  methods: {
    ...mapMutations(['checkedNotification']),
    openLink() {
      const { url, later, id } = this;
      if (this.isLink(url)) {
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
                active: false,
              });
            }
          }
        );
      }
      if (later) {
        this.checkedNotification(id);
      }
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
