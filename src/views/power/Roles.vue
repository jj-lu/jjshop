<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <div slot-scope="scope">
            <el-row
              v-for="(item, index) in scope.row.children"
              :key="item.id"
              :class="['bdbottom', 'vcenter', index === 0 ? 'bdtop' : '']"
            >
              <el-col :span="5">
                <el-tag closable
                @close="removeRightById(scope.row, item.id)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(its, index2) in item.children"
                  :key="its.id"
                  :class="['vcenter', index2 === 0 ? '' : 'bdtop']"
                >
                  <el-col :span="8">
                    <el-tag type="success" 
                    closable
                    @close="removeRightById(scope.row, its.id)">{{ its.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag
                      v-for="it in its.children"
                      :key="it.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, it.id)"
                      >{{ it.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <div slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showRightDialogVisible(scope.row)"
              >分配权限</el-button
            >
          </div>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="分配权限"
      :visible.sync="rightDialogVisible"
      width="50%"
      >
      <el-tree
        ref="treeForm"
        :data="rightsList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defCheKeys"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allowRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 分配权限模态框
      rightDialogVisible: false,
      // 权限列表
      rightsList: [],
      // 树形遍历列表
      defaultProps:{
        label: 'authName',
        children: 'children'
      },
      // 树形控件选中的值
      defCheKeys:[],
      // 分配权限的用户
      settingRole: {}
    };
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles');
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败');
      }
      this.rolesList = res.data;
      // console.log(this.rolesList);
    },
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
      // console.log(confirmResult);
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        );
        if (res.meta.status !== 200) {
          this.$message.error('删除权限失败');
        }
        role.children = res.data;
        console.log(res.data);
        console.log(this.rolesList);
      }
    },
    async showRightDialogVisible(role) {
      const {data: res} = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }
      this.settingRole = role;
      this.defCheKeys = [];
      this.rightsList = res.data;
      console.log(this.rightsList);
      this.getCheckKey(role,this.defCheKeys);
      console.log(this.defCheKeys);
      this.rightDialogVisible = true;
    },
    getCheckKey(rights,arr){
      if(!rights.children){
        return arr.push(rights.id)
      }
      rights.children.forEach(item => {
        this.getCheckKey(item,arr)
      });
    },
    async allowRights() {
      const selectRights = [...this.$refs.treeForm.getHalfCheckedKeys(),...this.$refs.treeForm.getCheckedKeys()]
      console.log(selectRights);
      const idStr = selectRights.join(',');
      console.log(idStr);
      console.log(this.settingRole.id);
      const {data: res} = await this.$http.post(`roles/${this.settingRole.id}/rights`,{ rids: idStr})
      if (res.meta.status !== 200) {
        console.log(res);
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('角色授权成功！')
      this.getRolesList()
      this.rightDialogVisible = false
    }
  },
  created() {
    this.getRolesList();
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.bdtop {
  border-top: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>