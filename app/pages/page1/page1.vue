<template>
  <h1>page1</h1>
  <el-input
    v-model="content"
    style="width: 300px;"
  />
  <el-table
    :data="tableData"
    style="width: 100%;"
  >
    <el-table-column
      prop="name"
      label="name"
      width="180"
    /><el-table-column
      prop="desc"
      label="desc"
    />
  </el-table>
  <div>{{ content }}</div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import $curl from '$common/curl'
const content = ref('');
console.log('page1 init')

const tableData = ref([])

onMounted(async () => {
  const res = await $curl({
    method: 'get',
    url: '/api/project/list',
    query: {
      proj_key: 'test'
    }
  })
  tableData.value = res.data
})

</script>

<style lang="less" scoped>
h1 {
  color: red;
}
</style>