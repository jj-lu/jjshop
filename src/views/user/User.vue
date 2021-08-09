<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="searchClick" ></el-button>
          </el-input>    
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="openDialog">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="userList"
        border
        style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"  width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"  width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"  width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色"  width="180"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="180">
          <el-switch
            slot-scope="scope"
            v-model="scope.row.mg_state" @change="swithChange(scope.row)">
          </el-switch>
        </el-table-column>
        <el-table-column label="操作"  width="auto">
          <template slot-scope="scope">
            <el-button type="primary" size="medium" icon="el-icon-edit" @click="showEdit(scope.row.id)"></el-button>
            <el-button type="danger" size="medium" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="权限分配" placement="top" :enterable="false">
              <el-button type="info" size="medium" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </el-card>

    <el-dialog
      title="增加用户"
      :visible.sync="addDialog"
      width="50%"
      @close="addDialogClose"
      >
      <el-form :model="addUserForm" status-icon :rules="addUserRules"
       ref="addUserFormRef" label-width="70px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="username">
          <el-input type="text" v-model="addUserForm.username" 
          autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password" 
          autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="addUserForm.email" 
          autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input type="text" v-model="addUserForm.mobile" 
          autocomplete="off"></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户"
      :visible.sync="editDialog"
      width="50%"
      @close="editDialogClose">
      <el-form :model="editUserForm" status-icon :rules="addUserRules"
       ref="editUserFormRef" label-width="70px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="username">
          <el-input type="text" v-model="editUserForm.username"
          autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input type="text" v-model="editUserForm.mobile" 
          autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="editUserForm.email" 
          autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'user',
  data(){
    const checkMoblie = (rule,value,callback) => {
      const regMoblie = /^(13)[0-9]{9}$/
      if(!regMoblie.test(value)){
        return callback(new Error('请输入正确的用户电话'));
      }
      callback();
    }

    const checkMail = (rule,value,callback) => {
      const regMail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if(!regMail.test(value)){
        return callback(new Error('请输入正确的用户邮箱'));
      }
      callback();
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      total: 0,
      addDialog: false,
      editDialog: false,
      addUserForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      editUserForm: {
        username: '',
        mobile: '',
        email: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkMail,trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: '请输入用户电话', trigger: 'blur' },
          { validator: checkMoblie,trigger: 'blur'}
        ],
      },
      
    }
  },
  methods: {

    // 获取用户列表
    getUserList(){
      this.$http.get('users', {params: this.queryInfo})
      .then((result) => {
        // console.log(result);
        if(result.data.meta.status !== 200){
          return this.$message({
            type: 'error',
            message: result.data.meta.msg
          })
        }
        this.userList = result.data.data.users;
        this.total = result.data.data.total;
      }).catch((err) => {
        this.$message({
          type: 'error',
          message: err
        })
      });
    },

    // 每页显示的条数
    handleSizeChange(index){
      // console.log(index);
      this.queryInfo.pagesize = index;
      this.getUserList();
    },

    // 当前页数
    handleCurrentChange(index){
      // console.log(index);
      this.queryInfo.pagenum = index;
      this.getUserList();
    },

    // 状态改变触发事件
    swithChange(obj){
      console.log(obj.id);
      console.log(obj.mg_state);
      // this.$http.put('users/:' + obj.id + '/state/:' + obj.mg_state).
      // this.$http.put('users/:uId/state/:type',{uId: obj.id,state: obj.mg_state}).
      this.$http.put(`users/${obj.id}/state/${obj.mg_state}`)
      .then((result) => {
        console.log(result);
        if(result.data.meta.status !== 200){
          return this.$message({
            type: 'error',
            message: result.data.meta.msg
          })
        }
        this.$message.success('更新用户状态成功');
      }).catch((err) => {
        this.$message({
          type: 'error',
          message: err
        })
      });
    },

    // 查询按钮
    searchClick(){
      this.queryInfo.pagenum = 1;
      console.log(this.queryInfo.query);
      this.getUserList();
    },

    // 打开添加用户对话框
    openDialog(){
      this.addDialog = true;
    },

    // 关闭添加用户对话框
    closeDialog(){
      this.addDialog = false;
    },

    // 监听对话框关闭事件
    addDialogClose(){
      this.$refs.addUserFormRef.resetFields();
    },

    // 新增用户
    addUser(){
      this.$refs.addUserFormRef.validate(valid => {
        if(!valid) return
        this.$http.post('users',this.addUserForm)
        .then((result) => {
          // console.log(result);
          if(result.data.meta.status !== 201){
            return this.$message.error(result.data.meta.msg);
          }
          // 关闭
          this.addDialog = false;
          this.$message.success('添加用户成功');
          this.getUserList();

        }).catch((err) => {
          
        });
      })
    },

    // 打开修改用户模态框
    showEdit(id){
      this.$http.get('users/' + id)
      .then((result) => {
        // console.log(result);
        if(result.data.meta.status !== 200) return this.$message.error(result.data.meta.msg);
        this.editUserForm = result.data.data;
        // this.editUserForm.username = result.data.data.username;
        // this.editUserForm.email = result.data.data.email;
        // this.editUserForm.mobile = result.data.data.mobile;
      }).catch((err) => {
        
      });

      this.editDialog = true;
    },

    // 关闭修改用户
    editDialogClose(){
      this.$refs.editUserFormRef.resetFields();
    },

    // 发送修改用户
    editUser(){
      console.log(this.editUserForm);
      this.$refs.editUserFormRef.validate(valid => {
        if(!valid) return
        this.$http.put('users/' + this.editUserForm.id ,this.editUserForm)
        .then((result) => {
          if(result.data.meta.status !== 200) return this.$message.error(result.data.meta.msg);
          this.$message.success('用户信息修改成功');
          this.editDialog = false;
          this.getUserList();
        }).catch((err) => {
          this.$message.error(err);
        });
      })
    },

    // 删除用户
    deleteUser(id){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('users/' + id)
          .then((result) => {
            // console.log(result);
            if(result.data.meta.status !== 200) return this.$message.error(result.data.meta.msg);
            this.getUserList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch((err) => {
            console.log(err);
          });
        }).catch((err) => {
          this.$message({
            type: 'info',
            message: err
          });          
        });
    }
  },
  created(){
    this.getUserList();
  }
}
</script>

<style lang="less" scoped>

</style>