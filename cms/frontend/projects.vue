<template>
  <div style="padding: 30px;" class="main">
    <div style="height: 50px;">
      <el-button type="primary" style="background-color: #364C98;border:none;" @click="newProject">New Project</el-button>
    </div>
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
        prop="project_name"
        label="project name"
        width="140"
      />
      <el-table-column
        prop="web3_project_name"
        label="web3 project name"
        width="200"
      />
      <el-table-column
        prop="transaction_amount"
        label="transcation amount"
        width="180"
      />
      <el-table-column
        prop="project_starttime"
        label="project starttime"
        width="180"
      />
      <el-table-column
        prop="project_endtime"
        label="project endtime"
        width="180"
      />
      <el-table-column
        prop="contract_address"
        label="contract address"
        width="240"
      />
      <el-table-column
        prop="rule_name"
        label="rule name"
        width="140"
      />
      <el-table-column
        prop="commission"
        label="commission"
        width="140"
      />
      <el-table-column
        prop="commission_rule"
        label="commission rule"
        width="180"
      />
      <el-table-column
        prop="promotion_code"
        label="promotion code"
        width="180"
      />
      <el-table-column
        prop="creator_address"
        label="creator address"
        width="200"
      />
      <el-table-column
        prop="kol_ids"
        label="kol ids"
        width="140"
      />
      <el-table-column align="center" label="operations" width="240">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="info" size="small" @click="handleTranscation(scope)">Transcation</el-button>
        </template>``
      </el-table-column>
    </el-table>
    <el-dialog z-index="1001" :visible.sync="viewContentVisible" :title="isEdit?'Edit Project':'Create Project'" width="80%" style="margin-bottom: 20px;">
      <div v-show="!isEdit" style="text-align:left;margin-bottom: 20px;">
        <el-button type="primary" @click="connectWallet">{{ projectTable.creator_address ? projectTable.creator_address:'Connect Wallet' }}</el-button>
        <el-button v-show="projectTable.creator_address" type="info" @click="deployContract">Deploy Contract</el-button>
      </div>
      <el-form :model="projectTable" label-width="150px" label-position="left">
        <el-form-item label="commission rule">
          <el-input-number v-if="!isEdit" v-model="projectTable.commission_rule" style="margin-right:10px;" :min="0" :max="100" placeholder="commission rule, eg. 90, 100, 20 (percentage for creator get)" />
          <div v-else>{{ projectTable.commission_rule }}</div>
          % of transcation amount
        </el-form-item>
        <el-form-item label="contract address">
          <div>{{ projectTable.contract_address }}</div>
          <!-- <el-input v-model="projectTable.contract_address" placeholder="when you deploy a contract, it will display the address" disabled /> -->
        </el-form-item>
        <el-form-item label="creator address">
          <div>{{ projectTable.creator_address }}</div>
          <!-- <el-input v-model="projectTable.creator_address" placeholder="when you deploy a contract, it will display the address" disabled /> -->
        </el-form-item>
        <el-form-item label="project name">
          <el-input v-model="projectTable.project_name" placeholder="project name" />
        </el-form-item>
        <el-form-item label="promotion code">
          <!-- <el-input v-model="projectTable.promotion_code" placeholder="promotion code" disabled/> -->
          <div>{{ projectTable.promotion_code }}</div>
        </el-form-item>
        <el-form-item label="web3 project name">
          <el-input v-model="projectTable.web3_project_name" placeholder="web3 project name" />
        </el-form-item>
        <el-form-item label="project starttime">
          <!-- <el-input v-model="projectTable.project_starttime" placeholder="project starttime" /> -->
          <el-date-picker
            v-model="projectTable.project_starttime"
            type="datetime"
            value-format="yyyy-MM-dd-HH-mm-ss"
            placeholder="Select Start Date"
          />
        </el-form-item>
        <el-form-item label="project endtime">
          <!-- <el-input v-model="projectTable.project_endtime" placeholder="project endtime" /> -->
          <el-date-picker
            v-model="projectTable.project_endtime"
            type="datetime"
            value-format="yyyy-MM-dd-HH-mm-ss"
            placeholder="Select End Date"
          />
        </el-form-item>
        <el-form-item label="rule name">
          <el-input v-model="projectTable.rule_name" placeholder="rule name" />
        </el-form-item>
        <div class="kolBlock">
          <el-form-item v-for="(item, index) in projectTable.kols" :key="index" :label="'KOL ' + (index + 1)">
            <div style="display: flex;flex-direction: column;">
              <div style="display: flex;">
                <div class="kols">
                  <span style="margin-right: 10px;width: 50px;">name:</span>
                  <el-input v-model="item.name" placeholder="kol name" />
                </div>
                <div class="kols">
                  <span style="margin-left: 30px;margin-right: 10px;width: 112px;">address:</span>
                  <el-input v-model="item.address" placeholder="kol wallet address" />
                </div>
                <el-button type="danger" style="margin: 0 30px;" size="mini" icon="el-icon-delete" @click="removeKOL(item, index)">Remove</el-button>
              </div>
              <div v-if="isEdit && item.code" style="display: flex;margin-top: 5px;">
                <div>{{ `https://cms.rabbitgo.io/app/app.html?ref=${item.code}&pro=${projectTable.promotion_code}` }}</div>
                <el-button v-clipboard:copy="`https://cms.rabbitgo.io/app/app.html?ref=${item.code}&pro=${projectTable.promotion_code}`" v-clipboard:success="clipboardSuccess" size="mini" style="margin-left: 30px;color:aqua;cursor: pointer;" type="primary" icon="el-icon-document">Copy Link</el-button>
                <!-- <div>{{ `http://127.0.0.1:5500/sc-for-kol/app.html?ref=${item.code}&pro=${projectTable.promotion_code}` }}</div>
                <el-button v-clipboard:copy="`http://127.0.0.1:5500/sc-for-kol/app.html?ref=${item.code}&pro=${projectTable.promotion_code}`" v-clipboard:success="clipboardSuccess" size="mini" style="margin-left: 30px;color:aqua;cursor: pointer;" type="primary" icon="el-icon-document">Copy Link</el-button> -->
              </div>
            </div>

          </el-form-item>
          <div style="text-align: center;font-size: 20px;" @click="addKOL">Add a KOL</div>
        </div>

      </el-form>
      <div style="text-align:right;margin-top: 20px;">
        <el-button type="danger" @click="viewContentVisible=false">Cancel</el-button>
        <el-button type="primary" @click="saveSetting">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog z-index="1002" :visible.sync="viewVisibleTransaction" title="Transactions" width="85%" style="margin-bottom: 20px;">
      <div> <el-table
        :data="transactionDataOnchain"
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
          prop="buyer"
          label="buyer"
          width="400"
        />
        <el-table-column
          prop="kol"
          label="kol"
          width="400"
        />
        <el-table-column
          prop="commission"
          label="commission"
          width="140"
        />
      </el-table>
        <!-- <button @click="getAllData()">test</button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProjects, getAbi, createProjects, getProjectsById, updateProjects } from '@/api/polygon'
import Web3 from 'web3'
import { isNotEmptyPart } from '@/utils/validate'
import axios from 'axios'
import clipboard from '@/directive/clipboard/index.js'
// import _ from 'underscore'
export default {
  directives: {
    clipboard
  },
  data() {
    return {
      viewContentVisible: false,
      viewVisibleTransaction: false,
      isEdit: false,
      dialogVisible: false,
      projectList: [],
      web3: '',
      account: '',
      dialogType: 'edit',
      fullscreenLoading: false,
      tableData: [
      ],
      transactionDataOnchain: [],
      projectTable: {
        project_name: '',
        web3_project_name: '',
        transaction_amount: '',
        project_starttime: '',
        project_endtime: '',
        contract_address: '',
        rule_name: '',
        commission: 0,
        commission_rule: 0,
        creator_address: '',
        promotion_code: '',
        kol_ids: '',
        kols: [
        ]
      }
    }
  },
  mounted() {
    // console.log(window.ethereum.isConnected())
    this.initData()
  },
  methods: {
    clipboardSuccess() {
      this.$message({
        message: 'Copy successfully',
        type: 'success',
        duration: 1500
      })
    },
    async getAllData(contractAdd) {
      const that = this
      const response = await axios.get('https://data.rabbitgo.io/polygon/project/index')

      // const contractAddress = '0x7e1f200eada9a31f0bbd01dcc2932c2b700cac36'
      const contractAddress = contractAdd
      const myWeb3 = new Web3(window.ethereum)
      const contract = new myWeb3.eth.Contract(response.data.data[0].contractABI, contractAddress)
      const methodName = 'getAllData'
      const result = await contract.methods[methodName]().call()
      const temp = result.map((item, index) => {
        if (item.length > 0) {
          return {
            buyer: item[0],
            kol: item[1],
            commission: item[2] / (10 ** 18)
          }
        } else {
          return {}
        }
      })
      that.transactionDataOnchain = temp
      // console.log(temp)
    },
    removeKOL(item, index) {
      const that = this
      that.projectTable.kols.splice(index, 1)
    },
    addKOL() {
      const that = this
      that.projectTable.kols.push({
        name: '',
        address: ''
      })
    },
    connectWallet() {
      const that = this
      // console.log(window.ethereum.isConnected())
      if (typeof window.ethereum !== 'undefined') {
      // Enable Web3 and retrieve the selected account
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
          const myWeb3 = new Web3(window.ethereum)
          // console.log(myWeb3)
          that.projectTable.creator_address = accounts[0]
          that.web3 = myWeb3
          that.account = accounts[0]
        })
      } else {
        this.$message.warning('Please install metamask!')
      }
    },
    deployContract() {
      const that = this
      this.$confirm('Set commisson percentage is [ ' + that.projectTable.commission_rule + '% ] for creator. Once deployed, you can not change it, continue? ', 'Deploy Contract', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        getAbi().then(async res => {
          const contractABI = res.data[0].contractABI
          const contractBytecode = res.data[0].contractBytecode

          const contract = new that.web3.eth.Contract(contractABI)

          const deployedContract = await contract.deploy({
            data: contractBytecode,
            arguments: [that.projectTable.commission_rule] // constructor
          })

          const result = await deployedContract.send({
            from: that.account,
            gas: 1192811
          })

          that.projectTable.contract_address = result.options.address
          that.projectTable.creator_address = that.account
          loading.close()
          // console.log(result.options.address)
          console.log(result)
        })
      })
    },
    saveSetting() {
      const that = this
      var result = isNotEmptyPart(that.projectTable, [
        'project_name', 'web3_project_name', 'project_starttime', 'project_endtime', 'rule_name', 'contract_address', 'creator_address'
      ], that)
      if (result) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        if (!this.isEdit) {
          createProjects(that.projectTable).then(res => {
            console.log(res)
            console.log('create')
            that.resetForm()
            that.viewContentVisible = false
            loading.close()
            that.initData()
          })
        } else {
          // edit the project
          updateProjects(that.projectTable).then(res => {
            console.log(res)
            console.log('edit')
            that.resetForm()
            that.viewContentVisible = false
            loading.close()
            that.initData()
          })
          // console.log(that.projectTable)
        }
      }
    },
    initData() {
      const that = this
      getProjects().then(res => {
        that.tableData = res.data
      })
    },
    newProject() {
      const that = this
      that.resetForm()
      that.isEdit = false
      that.viewContentVisible = true
    },
    async handleTranscation(item) {
      this.viewVisibleTransaction = true
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.getAllData(item.row.contract_address)
      // await this.getAllData('0x7e1f200eada9a31f0bbd01dcc2932c2b700cac36') // for testing data
      loading.close()
    },
    handleEdit(data) {
      var that = this
      that.resetForm()
      that.isEdit = true
      that.viewContentVisible = true
      const loading2 = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        fullscreen: true,
        background: 'rgba(0, 0, 0, 0.7)'
      })
      getProjectsById({ id: data.row.id }).then(res => {
        that.projectTable = { ...res.data[0] }
        loading2.close()
        console.log(res.data)
      })
      // console.log(data.row)
    },
    confirmSubmit() {
      // var that = this
      // add quiz
      /* if (!that.isEdit) {
        createQuiz({ questions: JSON.stringify(that.jsonData.doNotChange), answers: that.getAns(that.jsonData.doNotChange), lesson_id: JSON.parse(that.lessonObj).lesson_id }).then(res => {
          if (res.status === 'ok') {
            that.dialogVisible = false
            that.viewContentVisible = false
            that.resetForm()
            that.initQuiz()
          }
          that.$alert(res.data.msg, 'Prompt', {
            confirmButtonText: 'Confirm'
          })
        })
      } else { // edit quiz
        editQuiz({ questions: JSON.stringify(that.jsonData.doNotChange), answers: that.getAns(that.jsonData.doNotChange), quiz_id: that.quiz_id }).then(res => {
          if (res.status === 'ok') {
            that.dialogVisible = false
            that.viewContentVisible = false
            that.resetForm()
            that.initQuiz()
          }
          that.$alert(res.data.msg, 'Prompt', {
            confirmButtonText: 'Confirm'
          })
        })
      } */
    },
    resetForm() {
      var that = this
      that.isEdit = false
      this.account = ''
      this.projectTable = {
        project_name: '',
        web3_project_name: '',
        transaction_amount: '',
        project_starttime: '',
        project_endtime: '',
        contract_address: '',
        rule_name: '',
        commission: 0,
        commission_rule: 0,
        creator_address: '',
        kol_ids: '',
        kols: [
        ]
      }
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

