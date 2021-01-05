<template>
  <el-card :body-style="{ padding: '5px 15px' }" class="history-card">
    <div slot="header" class="card-header">
      <el-row>
        <el-col :span="4">
          <el-avatar class="card-icon" shape="square" fit="fill" :size="68" :src="iconUrl"></el-avatar>
        </el-col>
        <el-col :span="20" class="header-title">
          <el-link v-if="isLink(url)" type="primary" @click="openLink">
            {{ title }}
          </el-link>
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
    <el-image v-if="type === 'image'" class="card-image" :src="imageUrl"></el-image>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'gloria-notification-item',
  props: {
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    contextMessage: {
      type: String,
      required: true,
    },
    iconUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  methods: {
    openLink() {
      const { url } = this;
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
    },
  },
});
</script>

<style lang="scss">
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
    background-color: #fafafa;
  }
  .card-image {
    width: 100%;
    margin-top: 5px;
  }
}
</style>
