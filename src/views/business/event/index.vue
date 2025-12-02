<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="活动名称" prop="eventName">
        <el-input
          v-model="queryParams.eventName"
          placeholder="请输入活动名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="活动类型" prop="eventType">
        <el-select v-model="queryParams.eventType" placeholder="请选择活动类型" clearable>
          <el-option
            v-for="dict in business_even"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="活动开始时间" prop="startTime">
        <el-date-picker clearable
          v-model="queryParams.startTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择活动开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动结束时间" prop="endTime">
        <el-date-picker clearable
          v-model="queryParams.endTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择活动结束时间">
        </el-date-picker>
      </el-form-item>
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
          v-hasPermi="['business:event:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:event:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="eventList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="活动ID" align="center" prop="id" v-if="false" />
      <el-table-column label="活动名称" align="center" prop="eventName" />
      <el-table-column label="活动类型" align="center" prop="eventType">
        <template #default="scope">
          <dict-tag :options="business_even" :value="scope.row.eventType"/>
        </template>
      </el-table-column>
      <el-table-column label="活动开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动状态" align="center" prop="status" >
        <template #default="scope">
           <span>{{ scope.row.status == 0 ? '关闭' : '开启' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="活动描述(文本域或者活动海报说明)" align="center" prop="description" />
      <el-table-column label="活动规则" align="center" prop="rules" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:event:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:event:remove']">删除</el-button>
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

    <!-- 添加或修改彩票活动对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="eventRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="活动名称" prop="eventName">
          <el-input v-model="form.eventName" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="活动类型" prop="eventType">
          <el-select v-model="form.eventType" placeholder="请选择活动类型" style="width: 100%;" >
            <el-option
              v-for="dict in business_even"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>

        <div style="display: flex;">
          <el-form-item label="开始时间" prop="startTime" style="width: 50%;">
          <el-date-picker clearable
            v-model="form.startTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择活动开始时间"
            style="width: 100%;"
            >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime" style="width: 50%;">
          <el-date-picker clearable
            v-model="form.endTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择活动结束时间"
            style="width: 100%;"
            >
          </el-date-picker>
        </el-form-item>
        </div>


        
        <el-form-item label="活动主图" prop="mainImg">
          <image-upload v-model="form.mainImg"/>
        </el-form-item>

        <!-- <el-form-item label="活动描述(文本域或者活动海报说明)" prop="description" style="height: auto;">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item> -->
        <el-form-item label="发布内容" prop="description">
          <div class="editor-wrapper">
            <QuillEditor
                ref="quillEditor"
                v-model:content="form.description"
                contentType="html"
                theme="snow"
                :options="editorOptions"
                @paste="handlePaste"
                style="height: 500px"
            />
          </div>
        </el-form-item>
        <el-form-item label="活动规则" prop="rules">
          <el-input v-model="form.rules" type="textarea" placeholder="请输入内容" />
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

<script setup name="Event">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { listEvent, getEvent, delEvent, addEvent, updateEvent } from "@/api/business/event";
import axios from '@/utils/request'

const { proxy } = getCurrentInstance();
const { business_even } = proxy.useDict('business_even');

const eventList = ref([]);
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
    eventName: null,
    eventType: null,
    startTime: null,
    endTime: null,
    status: null,
    description: null,
    prizeInfo: null,
    rules: null,
  },
  rules: {
    eventName: [
      { required: true, message: "活动名称不能为空", trigger: "blur" }
    ],
    eventType: [
      { required: true, message: "活动类型不能为空", trigger: "change" }
    ],
    mainImg: [
      { required: true, message: "活动主图不能为空", trigger: "change" }
    ],
    startTime: [
      { required: true, message: "活动开始时间不能为空", trigger: "blur" }
    ],
    endTime: [
      { required: true, message: "活动结束时间不能为空", trigger: "blur" }
    ],
    description: [
      { required: true, message: "活动描述(文本域或者活动海报说明)不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询彩票活动列表 */
function getList() {
  loading.value = true;
  listEvent(queryParams.value).then(response => {
    eventList.value = response.rows;
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
    eventName: null,
    eventType: null,
    startTime: null,
    endTime: null,
    status: null,
    description: null,
    prizeInfo: null,
    rules: null,
    createdAt: null,
    updatedAt: null,
    mainImg: null,
  };
  proxy.resetForm("eventRef");
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
  title.value = "添加彩票活动";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getEvent(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改彩票活动";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["eventRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateEvent(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEvent(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除彩票活动编号为"' + _ids + '"的数据项？').then(function() {
    return delEvent(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

getList();

// 修改初始化方法确保编辑器加载
const quillEditor = ref(null)
// const { queryParams, form, rules } = toRefs(data);

// 配置 Quill 编辑器
const editorOptions = ref({
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
      [{ color: [] }, { background: [] }],
    ],
  },
});

const handlePaste = async (event) => {
  const clipboardData = event.clipboardData || window.clipboardData;
  if (!clipboardData || !clipboardData.items) return;

  for (const item of clipboardData.items) {
    if (item.kind === "file" && item.type.includes("image")) {
      event.preventDefault();
      const file = item.getAsFile();
      if (file) await uploadImage(file);
    }
  }

  // 处理富文本里的 HTTPS 图片
  const text = clipboardData.getData("text/html");
  if (text) {
    const doc = new DOMParser().parseFromString(text, "text/html");
    const images = doc.querySelectorAll("img");
    for (const img of images) {
      const imgUrl = img.src;
      if (imgUrl.startsWith("https")) {
        const newUrl = await fetchAndUploadImage(imgUrl);
        if (newUrl) {
          insertImageToQuill(newUrl);
        }
      }
    }
  }
};

// 让服务器下载并重新上传图片
const fetchAndUploadImage = async (imageUrl) => {
  try {
    const res = await axios.post("/common/fetchImage", { url: imageUrl });
    return res.url; // 服务器返回新图片地址
  } catch (err) {
    console.error("图片代理失败:", err);
    return null;
  }
};

// 插入图片到 Quill
const insertImageToQuill = (url) => {
  console.log("准备插入新图片：" + url);

  nextTick(() => {
    if (!quillEditor.value) {
      console.error("quillEditor 为空，无法获取 Quill 实例");
      return;
    }

    const quill = quillEditor.value.getQuill();
    if (!quill) {
      console.error("Quill 实例未正确初始化");
      return;
    }

    const range = quill.getSelection();
    if (!range) {
      console.warn("Quill 选区为空，设置焦点后插入图片");
      quill.focus();
      setTimeout(() => {
        const newRange = quill.getSelection();
        if (newRange) {
          quill.insertEmbed(newRange.index, "image", url);
          quill.setSelection(newRange.index + 1);
        } else {
          console.error("无法获取 Quill 选区，图片插入失败");
        }
      }, 100);
      return;
    }

    console.log("插入新图片到 Quill，位置：" + range.index);
    quill.insertEmbed(range.index, "image", url);
    quill.setSelection(range.index + 1);
  });
};
</script>
