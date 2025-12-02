<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="彩票期号" prop="lotteryNo">
        <el-input
            v-model="queryParams.lotteryNo"
            placeholder="请输入彩票期号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开奖日期" prop="drawDate">
        <el-date-picker clearable
                        v-model="queryParams.drawDate"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择开奖日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>



    <el-table v-loading="loading" :data="drawKl8List" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="记录ID" align="center" prop="id" v-if="false"/>
      <el-table-column label="彩票期号" align="center" prop="lotteryNo"/>
      <el-table-column label="开奖日期" align="center" prop="drawDate">
        <template #default="scope">
          <span>{{ parseTime(scope.row.drawDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖池金额" align="center" prop="jackpot"/>
      <el-table-column label="中奖号码" align="center" prop="winningNumbers" width="750">
        <template v-slot="slotProps">
          <div v-if="slotProps.row && slotProps.row.winningNumbers">
            <!-- 获取中奖号码，分割字符串 -->
            <span v-for="(num, index) in slotProps.row.winningNumbers.split('-')[0].split(',')" :key="index">
              <span class="red-circle">{{ num }}</span>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="本期彩票销量" align="center" prop="sales"/>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />
  </div>
</template>

<script setup name="DrawKl8">
import {listDrawKl8} from "@/api/business/drawKl8";

const {proxy} = getCurrentInstance();

const drawKl8List = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    lotteryNo: null,
    drawDate: null,
  },
});

const {queryParams, form, rules} = toRefs(data);

/** 查询【快乐8】彩票开奖信息列表 */
function getList() {
  loading.value = true;
  listDrawKl8(queryParams.value).then(response => {
    drawKl8List.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    lotteryNo: null,
    drawDate: null,
    jackpot: null,
    winningNumbers: null,
    sales: null,
    createdAt: null,
    updatedAt: null
  };
  proxy.resetForm("drawKl8Ref");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


getList();
</script>
<style scoped>
.red-circle {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: red;
  color: white;
  text-align: center;
  line-height: 24px;
  margin: 0 5px;
}

.blue-circle {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: blue;
  color: white;
  text-align: center;
  line-height: 24px;
  margin: 0 5px;
}
</style>