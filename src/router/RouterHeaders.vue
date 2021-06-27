<template>
  <div id="headers-router">
    <gloria-request-headers></gloria-request-headers>
    <el-divider content-position="left">
      {{ i18n('settingsRulesFile') }}
    </el-divider>
    <gloria-settings-file
      :secret-key="secretKey"
      :data="rules"
      file-name="rules"
      key-name="domain"
      @merge-data="mergeData"
    ></gloria-settings-file>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations, mapState } from 'vuex';
import GloriaRequestHeaders from '@/components/GloriaRequestHeaders.vue';
import GloriaSettingsFile from '@/components/GloriaSettingsFile.vue';

export default defineComponent({
  name: 'RouterHeaders',
  components: {
    GloriaRequestHeaders,
    GloriaSettingsFile,
  },
  setup() {
    const secretKey = '50b9a403-ca9e-4b1c-88ca-b97cf74e4324';
    return {
      secretKey,
    };
  },
  computed: {
    ...mapState(['rules']),
  },
  methods: {
    ...mapMutations(['mergeRules']),
    mergeData(selectData: unknown[]) {
      this.mergeRules(selectData);
    },
  },
});
</script>
