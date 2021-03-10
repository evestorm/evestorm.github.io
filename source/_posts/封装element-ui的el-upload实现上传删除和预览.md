---
title: 封装element-ui的el-upload实现上传删除和预览
tags:
  - element-ui
categories:
  - 前端
  - UI
  - element-ui
abbrlink: 463
date: 2021-03-05 16:43:39
---

## 父组件

<!-- more -->

```html
<template>
  <el-form-item label="驾驶证照片" prop="licenseImg">
    <!-- ↓鼠标移上去的提示信息↓ -->
    <el-tooltip
      class="item"
      effect="dark"
      content="最多选择一个文件"
      placement="top-start"
    >
      <!-- 封装的子组件 -->
      <upload-img
        ref="licenseImg"
        refName="licenseImg"
        :fileList="drivingLicenseUploadList"
        id="license"
        :limit="1"
        @handleChange="handleChange"
        @handleRemove="handleRemove"
      ></upload-img>
    </el-tooltip>
    <!--如果上传了，则隐藏获取的，显示上传的-->
    <span v-if="drivingLicenseUploadList.length > 0" v-show="false"></span>
    <img
      v-else
      v-for="(img, idx) in basicFormData.licenseImgUrls"
      :key="idx"
      :src="img.url"
      @click="handleImgPreview(img.url)"
      alt=""
      width="50%"
    />
    {{ basicFormData.licenseImg }}
  </el-form-item>
</template>
<script>
  import uploadImg from '@/components/common/uploadImg';
  export default {
    name: 'edit',
    data() {
      return {
        basicFormData: {
          ...
          licenseImg: '', // 驾驶证照片

          //  展示用
          licenseImgUrls: [
            {
              filePath: '', // 文件路径
              url: '' // 远程url链接
            }
          ], // 驾驶
        },
        drivingLicenseUploadList: [], // 驾驶证图片上传列表参数

        dialogImageUrl: '',
        dialogVisible: false // 图片预览
      };
    },
    methods: {
      /**
       * @description 上传的图片改变
       * @param file 当前文件
       * @param fileList 所有文件列表
       * @param type 删除的哪个字段的图片
       */
      async handleChange(file, fileList, type) {
        const obj = {
          license: {
            list: this.drivingLicenseUploadList,
            target: "licenseImg",
          },
        };
        // 图片上传限制
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.warning("上传图片大小不能超过5MB！");
        // console.log(this.$refs[obj[type].target].$refs[obj[type].target]);
        // 清空上传列表
        this.$refs[obj[type].target].$refs[obj[type].target].clearFiles();
        return;
      }
        //  上传当前文件
        const data = await this.uploadImgFile(file);
        if (data.filePath) {
          this.basicFormData[obj[type].target] = data.filePath;
          obj[type].list.splice(0, obj[type].list.length);
          for (const x of fileList) {
            const fileName = x.name + x.size;
            if (x.raw) {
              obj[type].list.push({
                ...x,
                fileName,
                fileUrl: x.uid === file.uid ? data.url : x.fileUrl, // 远程url
                filePath: x.uid === file.uid ? data.filePath : x.filePath, // tms标识地址
              });
            }
          }
        }
      },
      /**
       * @description 删除操作
       * @param file 当前文件
       * @param type 删除的哪个字段的图片
       */
      async handleRemove(file, type) {
        const obj = {
          license: {
            list: this.drivingLicenseUploadList,
            target: "licenseImg",
          },
        };
        // 移除当前图片
        const data = await this.deleteImgFile(file.filePath);
        if (data) {
          const targetIdx = obj[type].list.findIndex(
            (item) => item.uid !== file.uid
          );
          obj[type].list.splice(targetIdx, 1);
          // 如果删除成功，则还原成最初的filePath
          this.basicFormData[obj[type].target] =
            this.basicFormData.identificationImgUrl.length > 0
              ? this.basicFormData.identificationImgUrl[0].filePath
              : "";
        }
      },
      /**
       * @description 预览图片
       * @param url 图片url
       */
      handleImgPreview(url) {
        this.dialogImageUrl = url;
        this.dialogVisible = true;
      },
      /**
       * @description 上传图片文件
       * @param file File原始文件
       */
      uploadImgFile(file) {
        //  构造FormData
        const uploadForm = new FormData();
        uploadForm.append("file", file.raw);
        uploadForm.append("moduleName", "driver");

        return new Promise((resolve, reject) => {
          const url = `${HXConfig.Instance().mdaHttpUrl}/commonImg/uploadFile`;
          httpAsync(url, "post", uploadForm, {
            "Content-Type": "multipart/form-data",
            PROJECTCODE: "TMS",
            SID: localStorage.getItem("hafSID"),
          })
            .then((res) => {
              if (res.code === 0) {
                resolve(res.data);
              }
            })
            .catch((e) => {
              console.log(e);
              reject(e);
            });
        });
      },
      /**
       * @description 删除图片
       * @param filePath 图片tms路径
       * @returns {Promise<unknown>}
       */
      deleteImgFile(filePath) {
        return new Promise((resolve, reject) => {
          const url = `${
            HXConfig.Instance().mdaHttpUrl
          }/commonImg/deleteListFilePath`;
          httpAsync(
            url,
            "post",
            [
              {
                filePath,
              },
            ],
            {
              PROJECTCODE: "TMS",
              SID: localStorage.getItem("hafSID"),
            }
          )
            .then((res) => {
              if (res.code === 0) {
                resolve(true);
              }
            })
            .catch((e) => {
              console.log(e);
              reject(e);
            });
        });
      },
    }
  };
</script>
```

## 子组件

> uploadImg/index.vue

```html
<template>
  <div>
    <el-upload
      :ref="refName"
      action=""
      :limit="1"
      :multiple="true"
      list-type="picture-card"
      accept=".png,.jpg,.jpeg"
      :auto-upload="false"
      :file-list="fileLists"
      :on-change="_handleChange"
      :on-exceed="_handleExceed"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="_handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            class="el-upload-list__item-delete"
            @click="_handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      id: {
        // 用来区分同一个页面多个图片上传
        type: String,
        default: 'license'
      },
      limit: {
        type: Number,
        default: 3
      },
      fileList: {
        type: Array,
        default: () => []
      },
      handleChange: {
        // 文件改变
        type: Function,
        default: () => {}
      },
      handleRemove: {
        // 删除文件
        type: Function,
        default: () => {}
      },
      refName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        fileLists: this.fileList
      };
    },
    mounted() {},
    methods: {
      _handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      _handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 ${this.limit} 个文件，本次选择了 ${
            files.length
          } 个文件，共选择了 ${files.length + fileList.length} 个文件`
        );
      },
      _handleChange(file, fileList) {
        this.$emit('handleChange', file, fileList, this.id);
      },
      // 移除图片
      _handleRemove(file) {
        this.$emit('handleRemove', file, this.id);
      },
      // 将图片文件传回给父组件
      submitFile() {
        this.$emit('submitImg', this.fileLists);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .el-icon-plus {
    font-size: 30px !important;
  }
  .el-icon-edit {
    font-size: 18px !important;
  }
  .el-icon-zoom-in {
    font-size: 18px !important;
  }
  .el-icon-delete {
    font-size: 18px !important;
    color: rgb(243, 143, 130);
  }
  .el-input >>> .el-textarea__inner {
    font-size: 18px !important;
  }
</style>
```
