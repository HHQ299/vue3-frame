import { http } from "../../utils/http";
import { ApiPageResponse, IDictItem, ApiResponse } from "../types";

//设置枚举值
export const getEnumList = async (dictKey: string): Promise<IDictItem[]> => {
  const { data } = await http.request<ApiPageResponse<IDictItem[]>>(
    "post",
    "/kukesystem/enum/enumList",
    {
      data: { category: dictKey, status: [0, 1] }
    }
  );
  const dictList = (data.list || []).map(v => {
    return {
      label: v.dataName,
      value: v.usedId
    };
  });
  return Promise.resolve(dictList);
};

//获取所有分校
export const getDepartmentList = async (): Promise<IDictItem[]> => {
  const { data } = await http.request<ApiPageResponse<IDictItem[]>>(
    "post",
    "/kukeadmin/dep/orderCenterSchoolListProt",
    {
      data: { status: 0 }
    }
  );
  const dictList = (data.list || []).map(v => {
    const childList = v.children.map(d => {
      return {
        label: d.departmentName,
        value: d.id
      };
    });
    return {
      label: v.departmentName,
      value: v.id,
      children: childList
    };
  });
  return Promise.resolve(dictList);
};

//获取毕业院校
export const getSchoolInfo = async (name: string): Promise<IDictItem[]> => {
  const { data } = await http.request<ApiPageResponse<IDictItem[]>>(
    "post",
    "/kukesystem/enum/eduSchoolList",
    {
      data: { name: name }
    }
  );
  const dictList = (data.list || []).map(v => {
    return {
      label: v.name,
      value: v.name
    };
  });
  return Promise.resolve(dictList);
};

//获取角色列表
export const getRoleList = async (): Promise<IDictItem[]> => {
  const { data } = await http.request<ApiPageResponse<IDictItem[]>>(
    "post",
    "/kukeadmin/role/selectListProt",
    {
      data: {}
    }
  );
  const dictList = (data.list || []).map(v => {
    return {
      label: v.name,
      value: v.id
    };
  });
  return Promise.resolve(dictList);
};

//导出历史记录
export const exportHistory = (data?: object) => {
  return http.request<ApiPageResponse<any>>(
    "post",
    "kukesystem/admin/export/exportHistoryProt",
    {
      data
    }
  );
};

//导出成功提醒
export const setExportNotice = (data?: object) => {
  return http.request<ApiPageResponse<any>>(
    "post",
    "kukesystem/admin/export/setExportNoticeProt",
    {
      data
    }
  );
};

// 通过项目获取学科
export const getProjectList = async (cateId: number): Promise<IDictItem[]> => {
  const { data } = await http.request<ApiPageResponse<IDictItem[]>>(
    "post",
    "/kukesystem/enum/subjectsByCateId",
    {
      data: { cateId: cateId }
    }
  );
  const dictList = (data.list || []).map(v => {
    return {
      label: v.dataName,
      value: v.usedId
    };
  });
  return Promise.resolve(dictList);
};

// 获取当前登录分校信息
export const getFilterSchool = async (): Promise<IDictItem[]> => {
  const { data } = await http.request<ApiPageResponse<IDictItem[]>>(
    "post",
    "/kukeadmin/dep/orderCenterUserSchoolListProt",
    {
      data: {}
    }
  );
  const dictList = (data.list || []).map(v => {
    const childList = v.children.map(d => {
      return {
        label: d.departmentName,
        value: d.id
      };
    });
    return {
      label: v.departmentName,
      value: v.id,
      children: childList
    };
  });
  return Promise.resolve(dictList);
};

// 根据字典分类获取数据
export const getDataByCategory = (data: { category: string }) => {
  return http.request<ApiResponse<any>>(
    "post",
    "/kukesystem/dataDict/getDataByCategory",
    {
      data
    }
  );
};
