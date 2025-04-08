<template>
  <el-dialog
    title="添加收信人"
    width="60%"
    style="margin-top:80px"
  >
    <el-row>
      <!--左侧-->
      <el-col :span="10">
        <div class="person-all">
          <div class="search">
            <div style="width: 95%; display: flex;justify-content: space-between;align-items: center;">
              <span>按音序排列</span>
              <el-input
                v-model="receivePerson"
                @input="searchReceivePerson"
                size="small"
                style="width: 40%"
                placeholder="请输入收件人"
              ></el-input>
            </div>
          </div>
          <!--每一个用户-->
          <div class="person-add">
            <div class="person-one" v-for="item in personList" :key="item">
              <div class="person-left">
                <div class="person-head">
                  <el-avatar
                    :size="45"
                    shape="square"
                    :src="item.avatar"
                    style="border-radius: 0"
                    @click="console.log(item)"
                  />
                </div>
                <div style="display: flex; flex-direction: column; justify-content: center;padding-left: 3px">
                  <div style="font-size: 16px;display: flex; align-items: center;">
                    <span style="margin-right: 5px">
                      {{item.name}}
                    </span>
                    <el-tag  :type="item.type === 'employee'? 'primary' : 'danger'" size="small">
                      {{ item.type === 'employee'? '员工' : '管理' }}
                    </el-tag>
                  </div>
                  <div style="font-size: 11px">
                    {{item.email}}
                  </div>
                </div>
              </div>
              <el-button
                type="primary"
                style="margin-right: 5px"
                @click="addPerson(item)"
                :disabled="addPersonList.some((data:any) => data === item)"
              >
                {{addPersonList.some((data:any) => data === item) ? '已添加': '添加'}}
              </el-button>
            </div>
          </div>
        </div>
      </el-col>
      <!--中间间距-->
      <el-col :span="1">
        <div style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;">
          <el-icon size="30" color="#409EFF">
            <ArrowRightBold></ArrowRightBold>
          </el-icon>
        </div>
      </el-col>
      <!--右侧部分-->
      <el-col :span="13">
        <div class="right">
          <div class="right-top">
            <span>
              收信人组
            </span>
            <span v-if="addPersonList.length > 0">
              已添加{{addPersonList.length}}位收信人
            </span>
          </div>
          <div class="right-body">
            <el-empty v-if="addPersonList.length < 1 " description="未添加收信人" />
            <el-card v-for="item in addPersonList" :key="item" class="card-all" shadow="hover">
              <template #default>
                <div class="card">
                  <div class="card-img" style="margin-left: 5px">
                    <el-avatar
                      :size="65"
                      shape="square"
                      :src="item.avatar"
                    />
                  </div>
                  <el-row style="width: 85%">
                    <el-row style="width: 100%;margin-top: 7px;margin-bottom: 7px;margin-left: 10px">
                      <el-col :span="8">
                        姓名：{{item.name}}
                      </el-col>
                      <el-col :span="16">
                        用户名：{{item.username}}
                      </el-col>
                    </el-row>
                    <el-row style="width: 100%;margin-top: 7px;margin-bottom: 7px;margin-left: 10px">
                      <el-col :span="8">
                        职位：
                        <el-tag v-if="item.type === 'employee'" type="primary" style="margin-left: -5px">员工</el-tag>
                        <el-tag v-if="item.type === 'manager'" type="danger" style="margin-left: -5px">管理</el-tag>
                      </el-col>
                      <el-col :span="16">
                        邮箱：{{item.email}}
                      </el-col>
                    </el-row>
                  </el-row>
                  <div style="margin-right: 10px">
                    <el-button @click="deletePerson(item)" type="danger" :icon="Delete" circle />
                  </div>
                </div>
              </template>
            </el-card>
          </div>
          <div class="right-footer">
            <el-button type="primary" plain @click="confirmPerson">确认</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script setup lang="ts">
import { Delete, ArrowRightBold } from '@element-plus/icons-vue'
import { defineEmits, defineExpose, onMounted, ref } from 'vue'
import { globalSideStore } from '@/store/global-data'
import { userType } from '@/type'

const emit = defineEmits(['confirmPerson', 'close'])
// 全部联系人
const personList = ref<any>([])
// 添加联系人
const addPersonList = ref<any>([])
// 收件人
const receivePerson = ref()
// 备份收件人组
const noChangePersonList = ref()
const globalStore = globalSideStore()

/**
 * 添加联系人
 */
const addPerson = (row: userType) => {
  addPersonList.value.push(row)
  console.log(addPersonList.value)
}
/**
 * 删除联系人
 */
const deletePerson = (row: userType) => {
  addPersonList.value = addPersonList.value.filter((item:any) => {
    return item !== row
  })
}
/**
 * 搜索联系人
 */
const searchReceivePerson = () => {
  personList.value = noChangePersonList.value
  personList.value = personList.value.filter((item:any) => {
    return item.name.includes(receivePerson.value)
  })
}
/**
 * 确认添加
 */
const confirmPerson = () => {
  emit('confirmPerson', addPersonList.value)
  emit('close')
}
onMounted(() => {
  personList.value = [...globalStore.employeeInfoList, ...globalStore.managerInfoList]
  // 创建一个 Collator 实例，指定使用中文拼音排序
  const collator = new Intl.Collator('zh-Hans-CN', { sensitivity: 'base' })
  // 按照名字的拼音排序
  personList.value.sort((a:any, b:any) => collator.compare(a.name, b.name))
  noChangePersonList.value = personList.value
})
defineExpose({
  addPersonList
})
</script>

<style scoped lang="scss">
.person-all {
  width: 100%;
  height: 400px;
  border: 1px solid var(--el-border-color);
  .search {
    width: 100%;
    display: flex;
    justify-content: center;
    border-bottom: 1px solid var(--el-border-color);
    padding: 5px 0;
  }
  .person-add {
    height: 366px;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-y: auto;
    .person-one {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 95%;
      height: 45px;
      border: 1px solid var(--el-border-color);
      margin: 5px 0;
      .person-left {
        display: flex;
        .person-head {
          height: 45px;
          width: 45px;
          border-right: 1px solid var(--el-border-color);
        }
      }
    }
  }
}
.right {
  height: 400px;
  .right-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 34px;
  }
  .right-body {
    border: 1px solid var(--el-border-color);
    height: 327px;
    width: 100%;
    overflow-y: auto;
    .card-all {
      width: 95%;
      height: 80px;
      margin: 5px auto;
      display: flex;
      align-items: center;
      .card {
        display: flex;
        align-items: center;
      }
    }
  }
  .right-footer {
    height: 39px;
    display: flex;
    justify-content: end;
    align-items: end;
  }
}
.el-card {
  --el-card-padding: 0px;
}
</style>
