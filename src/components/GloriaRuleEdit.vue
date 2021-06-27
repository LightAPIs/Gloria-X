<template>
  <el-dialog
    :title="type === 'edit' ? i18n('headersDialogEdit') : i18n('headersDialogAdd')"
    :model-value="dialogVisible"
    center
    @close="$emit('close-dialog')"
  >
    <el-form ref="form" :model="form" :rules="validateRules" label-width="120px">
      <el-form-item :label="i18n('headersTableDomain')" prop="domain">
        <el-input v-model="form.domain" clearable :placeholder="i18n('headersDialogDomainPlacehoder')"></el-input>
      </el-form-item>
      <el-form-item v-for="(header, index) in form.headers" :key="index" :label="i18n('headersDialogHeader') + ' ' + index">
        <el-row>
          <el-col :span="6">
            <el-autocomplete
              v-model.trim="header.name"
              class="gloria-rule-input"
              :placeholder="i18n('headersDialogNamePlacehoder')"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
            ></el-autocomplete>
          </el-col>
          <el-col :span="16">
            <el-input v-model="header.value" class="gloria-rule-input" :placeholder="i18n('headersDialogValuePlacehoder')"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button v-if="index > 0" type="danger" @click.prevent="removeHeader(index)">
              {{ i18n('headersDialogDelete') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">{{ i18n('headersDialogSubmit') }}</el-button>
        <el-button @click="addHeader">{{ i18n('headersDialogAddHeader') }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { mapState, mapMutations, mapGetters } from 'vuex';
import { ElForm } from 'element-plus';

export default defineComponent({
  name: 'GloriaRuleEdit',
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  emits: ['close-dialog'],
  setup() {
    const allHeaders = () => {
      return [
        { value: 'accept-charset' },
        { value: 'accept-encoding' },
        { value: 'access-control-request-headers' },
        { value: 'access-control-request-method' },
        { value: 'connection' },
        { value: 'content-length' },
        { value: 'cookie' },
        { value: 'cookie2' },
        { value: 'date' },
        { value: 'dnt' },
        { value: 'expect' },
        { value: 'host' },
        { value: 'keep-alive' },
        { value: 'origin' },
        { value: 'proxy-' },
        { value: 'sec-' },
        { value: 'referer' },
        { value: 'te' },
        { value: 'trailer' },
        { value: 'transfer-encoding' },
        { value: 'upgrade' },
        { value: 'user-agent' },
        { value: 'via' },
      ];
    };
    const validateDomain = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
      if (value.length < 5 || !value.includes('.') || value.match(/\s/)) {
        callback(new Error('Domain Error.'));
      } else {
        callback();
      }
    };

    const restaurants = ref([{ value: '' }]);
    const createFilter = (queryStr: string) => {
      return (restaurant: { value: string }) => {
        return restaurant.value.toLowerCase().includes(queryStr.toLowerCase());
      };
    };
    const querySearch = (queryStr: string, callback: (res: { value: string }[]) => void) => {
      const results = queryStr ? restaurants.value.filter(createFilter(queryStr)) : restaurants.value;
      callback(results);
    };

    onMounted(() => {
      restaurants.value = allHeaders();
    });

    return {
      validateDomain,
      querySearch,
    };
  },
  data() {
    return {
      form: {
        domain: '',
        headers: [
          {
            name: '',
            value: '',
          },
        ],
      },
      validateRules: {
        domain: [
          {
            required: true,
            message: this.i18n('headersRulesDomain'),
            trigger: 'change',
          },
          {
            validator: this.validateDomain,
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(['rules']),
    ...mapGetters(['ruleInfo']),
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.onReset();
        const { type, id } = this;
        if (type === 'edit') {
          const info = this.ruleInfo(id);
          if (info) {
            const { domain, headers } = info;
            Object.assign(this.form, {
              domain,
              headers: Object.assign([], headers),
            });
          } else {
            Object.assign(this.form, {
              domain: '',
              headers: [
                {
                  name: '',
                  value: '',
                },
              ],
            });
          }
        } else {
          Object.assign(this.form, {
            domain: '',
            headers: [
              {
                name: '',
                value: '',
              },
            ],
          });
        }
      }
    },
  },
  methods: {
    ...mapMutations(['updateRule']),
    submitForm() {
      (this.$refs.form as InstanceType<typeof ElForm>).validate((valid?: boolean) => {
        if (valid) {
          const {
            id,
            form: { domain, headers },
          } = this;
          this.updateRule({
            id,
            domain,
            headers,
          });
          this.$emit('close-dialog');
        }
      });
    },
    addHeader() {
      this.form.headers.push({
        name: '',
        value: '',
      });
    },
    removeHeader(index: number) {
      this.form.headers.splice(index, 1);
    },
    onReset() {
      this.$refs.form && (this.$refs.form as InstanceType<typeof ElForm>).resetFields();
    },
  },
});
</script>

<style>
.gloria-rule-input {
  width: 95%;
}
</style>
