<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="资讯标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入资讯标题"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布日期" style="width: 308px">
        <el-date-picker
          v-model="daterangePublishDate"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['business:news:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:news:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:news:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="newsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="资讯ID" align="center" prop="id" v-if="false"/>
      <el-table-column label="资讯标题" align="center" prop="title" />
      <el-table-column label="发布日期" align="center" prop="publishDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.publishDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已读数" align="center" prop="readCount" />
      <el-table-column label="主图URL" align="center" prop="mainImage" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.mainImage" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:news:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:news:remove']">删除</el-button>
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

    <!-- 添加或修改彩票资讯对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="newsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="资讯标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入资讯标题" />
        </el-form-item>
        <el-form-item label="发布日期" prop="publishDate">
          <el-date-picker clearable
            v-model="form.publishDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发布日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="已读数" prop="readCount">
          <el-input v-model="form.readCount" placeholder="请输入已读数" />
        </el-form-item>
        <el-form-item label="主图URL" prop="mainImage">
          <image-upload v-model="form.mainImage"/>
        </el-form-item>
        <el-form-item label="发布内容" prop="content">
          <div class="editor-container">
            <QuillEditor 
              v-model:content="form.content"
              contentType="html"
              theme="snow"
              :options="editorOptions"
              style="height: 400px" @ready="(quill) => quillInstance = quill"
            />
          </div>
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

<script setup name="News">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import axios from '@/utils/request'
import { listNews, getNews, delNews, addNews, updateNews } from "@/api/business/news";
// 在现有代码中添加以下内容

let quillInstance = null

// 图片上传处理
const imageHandler = async () => {
// const imageHandler = () => {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')
  input.click()
  
  input.onchange = async () => {
    const file = input.files[0]
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await axios.post('/common/upload', formData)
      const url = res.url
      // const quill = document.querySelector('.ql-editor').__vue__.quill
      // const range = quill.getSelection()
      // quill.insertEmbed(range.index, 'image', url)

      const quill = quillInstance
      if (quillInstance) {
        const range = quill.getSelection()
        quill.insertEmbed(range?.index || 0, 'image', url)
      }
    } catch (err) {
      console.log("11"+err)
      proxy.$modal.msgError('图片上传失败')
    }
  }
}

const editorOptions = ref({
  modules: {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['link', 'image', 'video'],
        ['clean'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }]
      ],
      handlers: {
        image: imageHandler
      }
    }
  }
})

const { proxy } = getCurrentInstance();

const newsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangePublishDate = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: null,
    publishDate: null,
    content: null,
  },
  rules: {
    title: [
      { required: true, message: "资讯标题不能为空", trigger: "blur" }
    ],
    publishDate: [
      { required: true, message: "发布日期不能为空", trigger: "blur" }
    ],
    // 修改内容验证规则
    content: [
      { required: true, message: "内容不能为空", trigger: "blur" },
      { 
        validator: (rule, value, callback) => {
          const text = value.replace(/<[^>]+>/g, '').trim()
          if (text.length < 10) {
            callback(new Error('内容长度不能少于10个字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询彩票资讯列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangePublishDate && '' != daterangePublishDate) {
    queryParams.value.params["beginPublishDate"] = daterangePublishDate.value[0];
    queryParams.value.params["endPublishDate"] = daterangePublishDate.value[1];
  }
  listNews(queryParams.value).then(response => {
    newsList.value = response.rows;
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
    title: null,
    publishDate: null,
    readCount: null,
    mainImage: null,
    createdAt: null,
    updatedAt: null
  };
  proxy.resetForm("newsRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangePublishDate.value = [];
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
  title.value = "添加彩票资讯";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getNews(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改彩票资讯";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["newsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateNews(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addNews(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除彩票资讯编号为"' + _ids + '"的数据项？').then(function() {
    return delNews(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

getList();
</script>
<style scoped>
.editor-container {
  position: relative;
}
:deep(.ql-toolbar) {
  position: sticky;
  top: 0;
  background: white;
  z-index: 100;
}
:deep(.ql-editor) {
  min-height: 300px;
}
</style>