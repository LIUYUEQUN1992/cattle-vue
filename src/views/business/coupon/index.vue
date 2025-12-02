<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="卡券名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入卡券名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="卡券类型" prop="couponType">
        <el-select v-model="queryParams.couponType" placeholder="请选择卡券类型" clearable>
          <el-option
            v-for="dict in business_coupon"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in sys_common_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="来源活动" prop="resourceId">
        <el-input
          v-model="queryParams.resourceId"
          placeholder="请输入来源活动"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['business:coupon:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:coupon:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:coupon:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['business:coupon:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="couponList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="卡券名称" align="center" prop="name" />
      <el-table-column label="卡券类型" align="center" prop="couponType">
        <template #default="scope">
          <dict-tag :options="business_coupon" :value="scope.row.couponType"/>
        </template>
      </el-table-column>
      <el-table-column label="面值" align="center" prop="faceValue" />
      <el-table-column label="最低消费金额" align="center" prop="minSpend" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:coupon:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:coupon:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改卡券对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="couponRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="卡券名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入卡券名称" />
        </el-form-item>
        <el-form-item label="卡券类型" prop="couponType">
          <el-select v-model="form.couponType" placeholder="请选择卡券类型">
            <el-option
              v-for="dict in business_coupon"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面值" prop="faceValue">
          <el-input v-model="form.faceValue" placeholder="请输入面值" />
        </el-form-item>
        <el-form-item label="最低消费金额" prop="minSpend">
          <el-input v-model="form.minSpend" placeholder="请输入最低消费金额" />
        </el-form-item>
        <el-form-item label="有效天数" prop="validDays">
          <el-input v-model="form.validDays" placeholder="请输入有效期" />
        </el-form-item>
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

<script setup name="Coupon">
import { listCoupon, getCoupon, delCoupon, addCoupon, updateCoupon } from "@/api/business/coupon";

const { proxy } = getCurrentInstance();
const { sys_common_status, business_coupon } = proxy.useDict('sys_common_status', 'business_coupon');

const couponList = ref([]);
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
    name: null,
    couponType: null,
    status: null,
    resourceId: null,
    validDays: null,
  },
  rules: {
    name: [
      { required: true, message: "卡券名称不能为空", trigger: "blur" }
    ],
    couponType: [
      { required: true, message: "卡券类型不能为空", trigger: "change" }
    ],
    faceValue: [
      { required: true, message: "面值不能为空", trigger: "blur" }
    ],
    validDays: [
      { required: true, message: "有效期不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询卡券列表 */
function getList() {
  loading.value = true;
  listCoupon(queryParams.value).then(response => {
    couponList.value = response.rows;
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
    name: null,
    couponType: null,
    faceValue: null,
    minSpend: null,
    status: null,
    validFrom: null,
    validTo: null,
    resourceId: null,
    createdAt: null,
    updatedAt: null
  };
  proxy.resetForm("couponRef");
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

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加卡券";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getCoupon(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改卡券";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["couponRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCoupon(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCoupon(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除卡券编号为"' + _ids + '"的数据项？').then(function() {
    return delCoupon(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('business/coupon/export', {
    ...queryParams.value
  }, `coupon_${new Date().getTime()}.xlsx`)
}

getList();
</script>
