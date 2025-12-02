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
      <el-form-item label="开奖日期" style="width: 308px">
        <el-date-picker
          v-model="daterangeDrawDate"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="drawSsqList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="记录ID" align="center" prop="id" v-if="false" />
      <el-table-column label="彩票期号" align="center" prop="lotteryNo" />
      <el-table-column label="开奖日期" align="center" prop="drawDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.drawDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中奖号码" align="center" prop="winningNumbers">
        <template v-slot="slotProps">
          <div v-if="slotProps.row && slotProps.row.winningNumbers">
            <!-- 获取中奖号码，分割字符串 -->
            <span v-for="(num, index) in slotProps.row.winningNumbers.split('-')[0].split(',')" :key="index">
        <span class="red-circle">{{ num }}</span>
      </span>

            <!-- 如果有 '-' 后面的蓝色号码 -->
            <span v-if="slotProps.row.winningNumbers.split('-')[1]">
        <span class="blue-circle">{{ slotProps.row.winningNumbers.split('-')[1] }}</span>
      </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="奖池金额" align="center" prop="jackpot" />
      <el-table-column label="本期彩票销量" align="center" prop="sales" />
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改【双色球】彩票开奖信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="drawSsqRef" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="DrawSsq">
import { listDrawSsq, getDrawSsq, delDrawSsq, addDrawSsq, updateDrawSsq } from "@/api/business/drawSsq";

const { proxy } = getCurrentInstance();

const drawSsqList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeDrawDate = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    lotteryNo: null,
    drawDate: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询【双色球】彩票开奖信息列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeDrawDate && '' != daterangeDrawDate) {
    queryParams.value.params["beginDrawDate"] = daterangeDrawDate.value[0];
    queryParams.value.params["endDrawDate"] = daterangeDrawDate.value[1];
  }
  listDrawSsq(queryParams.value).then(response => {
    drawSsqList.value = response.rows;
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
  proxy.resetForm("drawSsqRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeDrawDate.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
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