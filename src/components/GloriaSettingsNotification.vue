<template>
  <div>
    <div>
      <el-switch :value="implicitPush" :active-text="i18n('settingsImplicitPush')" @change="onChange('implicitPush', $event)"></el-switch>
    </div>
    <div v-if="isChrome" class="margin-top">
      <el-switch
        :value="configs.notificationSound"
        :active-text="i18n('settingsNotificationSound')"
        @change="onChange('notificationSound', $event)"
      ></el-switch>
    </div>
    <div v-if="isChrome" class="margin-top">
      <el-switch
        :value="configs.notificationCustomSound"
        :active-text="i18n('settingsNotificationCustomSound')"
        @change="onChange('notificationCustomSound', $event)"
      ></el-switch>
    </div>
    <div v-if="isChrome" class="margin-top">
      <el-switch
        :value="configs.notificationLaterMark"
        :active-text="i18n('settingsNotificationLaterMark')"
        @change="onChange('notificationLaterMark', $event)"
      ></el-switch>
    </div>
    <div class="margin-top">
      <el-switch
        :value="configs.notificationDetectIcon"
        :active-text="i18n('settingsNotificationDetectIcon')"
        @change="onChange('notificationDetectIcon', $event)"
      ></el-switch>
    </div>
    <div class="margin-top">
      <el-switch
        :value="configs.notificationDisableError"
        :active-text="i18n('settingsNotificationDisableError')"
        @change="onChange('notificationDisableError', $event)"
      ></el-switch>
    </div>
    <div class="margin-top">
      <el-switch
        :value="configs.notificationShowUrl"
        :active-text="i18n('settingsNotificationShowUrl')"
        @change="onChange('notificationShowUrl', $event)"
      ></el-switch>
    </div>
    <div class="margin-top">
      <el-switch
        :value="configs.notificationLazyLoading"
        :active-text="i18n('settingsNotificationLazyLoading')"
        @change="onChange('notificationLazyLoading', $event)"
      ></el-switch>
    </div>
    <div class="margin-top">
      <el-switch
        :value="configs.notificationShowSearchInput"
        :active-text="i18n('settingsNotificationShowSearchInput')"
        @change="onChange('notificationShowSearchInput', $event)"
      ></el-switch>
    </div>
    <div class="margin-top">
      <el-switch
        :value="configs.notificationShowMenuCount"
        :active-text="i18n('settingsNotificationShowMenuCount')"
        @change="onChange('notificationShowMenuCount', $event)"
      ></el-switch>
    </div>
    <div class="margin-top">
      <el-switch
        :value="configs.notificationShowBadge"
        :active-text="isChrome ? i18n('settingsNotificationShowBadge') : i18n('settingsNotificationShowBadgeFirefox')"
        @change="onChange('notificationShowBadge', $event)"
      ></el-switch>
    </div>
    <div class="margin-top">
      <span class="font-14">
        {{ i18n('settingsNotificationMaxinum') }}
      </span>
      <el-input-number
        :model-value="configs.notificationMaxinum"
        :min="50"
        :max="500"
        controls-position="right"
        step-strictly
        @change="onChange('notificationMaxinum', $event)"
      ></el-input-number>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations, mapState } from 'vuex';
export default defineComponent({
  name: 'GloriaSettingsNotification',
  data() {
    return {
      isChrome: process.env.VUE_APP_TITLE === 'chrome',
    };
  },
  computed: {
    ...mapState(['implicitPush', 'configs']),
  },
  methods: {
    ...mapMutations(['updateConfigs', 'updateImplicitPush']),
    onChange(name: string, value: boolean | number) {
      if (name === 'implicitPush') {
        this.updateImplicitPush(value);
      } else {
        let sta = true;
        if (name === 'notificationMaxinum' && !value) {
          sta = false;
        }
        sta &&
          this.updateConfigs({
            name,
            value,
          });
      }
    },
  },
});
</script>

<style lang="scss">
.options-trigger-time {
  margin-left: 25px;
}
</style>
