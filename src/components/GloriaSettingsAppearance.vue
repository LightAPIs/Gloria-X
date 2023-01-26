<template>
  <div class="gloria-settings-appearance">
    <div>
      <span class="font-14">
        {{ i18n('settingsAppearanceInterface') }}
      </span>
      <el-radio-group :model-value="configs.appearanceInterface" class="interface-radio-group" size="mini" @change="onChange">
        <el-radio-button label="default">{{ i18n('settingsAppearanceInterfaceDefault') }}</el-radio-button>
        <el-radio-button label="light">{{ i18n('settingsAppearanceInterfaceLight') }}</el-radio-button>
        <el-radio-button label="dark">{{ i18n('settingsAppearanceInterfaceDark') }}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="margin-top">
      <el-switch :value="configs.useAppearanceZoom" :active-text="i18n('settingsUseAppearanceZoom')" @change="onUseZoomChange"></el-switch>
    </div>
    <div v-if="configs.useAppearanceZoom" class="margin-top flex-center">
      <span class="font-14">
        {{ i18n('settingsAppearanceZoom') }}
      </span>
      <el-input-number
        :model-value="configs.appearanceZoom"
        :min="25"
        :max="500"
        controls-position="right"
        step-strictly
        size="medium"
        @change="onZoom($event)"
      ></el-input-number>
      %
      <el-tooltip placement="top-start" :enterable="false" :content="i18n('settingsAppearanceZoomTips')">
        <span class="options-tip-icon"><i class="el-icon-warning"></i></span>
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations } from 'vuex';

export default defineComponent({
  name: 'GloriaSettingsAppearance',
  computed: {
    ...mapState(['configs']),
  },
  methods: {
    ...mapMutations(['updateConfigs']),
    onChange(label: string) {
      let newLabel = 'default';
      switch (label) {
        case 'light':
          newLabel = 'light';
          break;
        case 'dark':
          newLabel = 'dark';
          break;
        case 'default':
        default:
          newLabel = 'default';
      }

      this.updateConfigs({
        name: 'appearanceInterface',
        value: newLabel,
      });
    },
    onUseZoomChange(value: boolean) {
      if (value != null) {
        this.updateConfigs({
          name: 'useAppearanceZoom',
          value,
        });
      }
    },
    onZoom(value: number) {
      if (value != null) {
        this.updateConfigs({
          name: 'appearanceZoom',
          value: value,
        });
      }
    },
  },
});
</script>

<style>
.interface-radio-group {
  display: inline-block;
  vertical-align: super;
}
</style>
