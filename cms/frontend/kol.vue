<template>
  <div style="padding: 30px;" class="main">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        label="index"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in tableData[0]"
        :key="index"
        :prop="index"
        :label="index"
        width="190"
      />
    </el-table>
  </div>
</template>

<script>
import { getTransaction } from '@/api/polygon'
export default {
  data() {
    return {
      tableData: [
      ]
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      const that = this
      getTransaction().then(res => {
        that.tableData = res.data
        that.tableData.forEach(element => {
          element.buyer_value /= 10 ** 18
          element.seller_value /= 10 ** 18
          element.agent_value /= 10 ** 18
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor{
  border: none;
}

.main {
  .barTitle{
    width: 100%;
    color: #ffffff;
    background-color: #364C98;
    display: flex;
    align-items: center;
    font-size: 18px;
    margin-top: 30px;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 10px 20px 10px 20px;
    font-weight: bold;
    justify-content: space-between;
  }

  /deep/ .kols{
    display: flex;
    flex-direction: row;
  }

  .kolBlock{
    text-align:left;
    margin-left:10px;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  /deep/ .json{
    background-color: #3b3363;
  }
  /deep/ .jsonEditor{
    color: #ffffff;
    width: 60%;
    background-color: #3b3363;
    padding: 10px;
    border-radius: 10px;
  }
  .jsonDiv{
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
    width: 100%;
  }
  .jsonCode{
    width: 39%;
    background-color: #3b3363;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px;
    color: #ffffff;
  }

  /deep/ .array-item.hide-item{
    background-color: #3b3363;
  }
  /deep/ .block.hide-block{
    background-color: #3b3363;
  }
  .block_content{
    margin-left: 0;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px;
  }
  /deep/ .jsonEditor select{
    background-color: rgba(54, 76, 152,0.1);
    border: #5B5288 solid 1px;
    border-radius: 3px;
    padding: 2px;
    margin-top: 2px;
  }
  /deep/ .jsonEditor .collapse-down{
    color: #67c23a;
  }

  /deep/ .pure-form input{
    box-shadow: none;
  }

  /deep/ .pure-form select{
    box-shadow: none;
    padding: 0.4em 0.6em;
  }
 /*  /deep/ .block_content .i-type{
    color: #67c23a;
  } */
  /deep/ .jsonEditor .val-input{
    color: #67c23a;
    width: 250px;
  }
  /deep/ .jsonEditor input{
    background-color: rgba(54, 76, 152,0.1);
    border: #5B5288 solid 1px;
    border-radius: 3px;
    padding-left: 8px;
    margin-top: 3px;
  }
  .el-input__inner::placeholder {
      color: #696969;
    }
    .el-input__inner::-webkit-input-placeholder {
      color: #696969;
    }
}

/deep/ input{
  border: #5B5288 solid 1px;
}
/deep/ input::-webkit-input-placeholder { color: rgba($color: #ffffff, $alpha: 0.4); } input::-moz-input-placeholder { color: rgba($color: #ffffff, $alpha: 0.4); } input::-ms-input-placeholder { color: rgba($color: #ffffff, $alpha: 0.4); }
</style>

