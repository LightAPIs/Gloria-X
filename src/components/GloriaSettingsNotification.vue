<template>
  <div>
    <div>
      <el-switch :value="implicitPush" :active-text="i18n('settingsImplicitPush')" @change="onChange('implicitPush', $event)"></el-switch>
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
        :value="configs.notificationSound"
        :active-text="i18n('settingsNotificationSound')"
        @change="onChange('notificationSound', $event)"
      ></el-switch>
    </div>
    <div class="margin-top">
      <el-switch
        :value="configs.notificationCustomSound"
        :active-text="i18n('settingsNotificationCustomSound')"
        @change="onChange('notificationCustomSound', $event)"
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
        :value="configs.notificationShowBadge"
        :active-text="i18n('settingsNotificationShowBadge')"
        @change="onChange('notificationShowBadge', $event)"
      ></el-switch>
    </div>
    <div class="margin-top">
      <span class="font-14">
        {{ i18n('settingsNotificationMaximun') }}
      </span>
      <el-input-number
        :value="configs.notificationMaximun"
        :min="50"
        :max="500"
        controls-position="right"
        step-strictly
        @change="onChange('notificationMaximun', $event)"
      ></el-input-number>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations, mapState } from 'vuex';
export default Vue.extend({
  name: 'gloria-settings-notification',
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
        if (name === 'notificationMaximun' && !value) {
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
