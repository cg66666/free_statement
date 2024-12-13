/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-11-15 17:19:58
 * @LastEditors: cg
 * @LastEditTime: 2024-12-08 23:34:20
 */
import { create } from 'zustand';
import {
  defaultComponentConfig,
  DefaultComponentNameEnum,
  InquireType
} from '@/components/default';

export type childItem = {
  id: string;
  pid: string;
  // isSelected: boolean;
} & defaultComponentConfig;

export enum LayoutEnum {
  // 自适应布局
  FLEX = 'flex',
  // 自定义布局
  CUSTOM = 'initial'
}

export enum LayoutStringEnum {
  FLEX = '自适应布局',
  CUSTOM = '自定义布局'
}

export enum FlexAlignEnum {
  TOP = 'top',
  RIGHT = 'end',
  BOTTOM = 'bottom',
  LEFT = 'start',
  MID = 'center'
}

export enum FlexAlignStringEnum {
  TOP = '上',
  RIGHT = '右',
  BOTTOM = '下',
  LEFT = '左',
  MID = '中'
}

export enum FlexDirectionEnum {
  PARALLEL = 'initial',
  VERTICAL = 'column'
}

export enum FlexDirectionStringEnum {
  PARALLEL = '水平',
  VERTICAL = '垂直'
}

export type tableItemType = {
  name: string;
  id: string;
  column: number[];
  columnString: string;
  row: number[];
  rowString: string;
  style: React.CSSProperties;
  cssVariates: React.CSSProperties; // 定义css中的变量，用于修改伪元素样式
  rect: {
    right: number;
    left: number;
    bottom: number;
    top: number;
  };
  layout: LayoutEnum;
  flexConfig: {
    direction: FlexDirectionEnum;
    flexVerticalAlign: FlexAlignEnum;
    flexParalleEqual: boolean;
    flexParallelAlign: FlexAlignEnum;
    flexVerticalEqual: boolean;
    isWrap: boolean;
  };
  isFreezed: boolean; // 当前是否为冻结
  children: Record<string, childItem>;
};

export type tableItemConfigType = Record<string, tableItemType>;

export enum tableModeStringEnum {
  INIT = '模板编辑',
  EDIT = '页面编辑'
}

export enum tableModeEnum {
  INIT,
  EDIT
}

// 当前dom元素类型
export enum DomTypeEnum {
  // 画板最外层轮廓
  ISOUTLINE = '1',
  // 渲染的单元格
  ISINSTANCE = '2',
  // 渲染的组件
  ISCOMPONENT = '3',
  // 右侧操作的单元块
  CELLITEM = '4',
  // 右侧操作的单元块中的组件
  COMPONENTCONFIGITEM = '5'
}

interface IState {
  // 模板模式
  tableMode: tableModeEnum;
  setTableMode: (val: tableModeEnum) => void;
  // 表格配置
  tableConfig: tableItemConfigType;
  setTableConfig: (val: tableItemConfigType) => void;
  // 缩放大小
  transformScale: number;
  setTransformScale: (val: number) => void;
  // 模板表格基本配置
  templateConfig: {
    baseSize: number;
    column: number;
    row: number;
  };
  setTemplateConfig: (val: { baseSize: number; column: number; row: number }) => void;
  // 当前正在配置的单元块名
  curConfigTableItemName: string;
  setCurConfigTableItemName: (val: string) => void;
  // 当前这个在配置的组件名
  curConfigComponentName: string;
  setCurConfigComponentName: (val: string) => void;
  // 当前选中的单元块
  tableItemSelectedList: string[];
  setTableItemSelectedList: (val: string[]) => void;
  // 当前选中的单元内组件（用于发光提示）
  componentSelectedList: string[];
  setComponentSelectedList: (val: string[]) => void;
}

export const useTableConfig = create<IState>((set, get) => ({
  tableMode: tableModeEnum.INIT,
  setTableMode: async (val) => {
    set({ tableMode: val });
  },
  tableConfig: {},
  setTableConfig: async (val) => {
    set({ tableConfig: val });
  },
  transformScale: 1,
  setTransformScale: async (val) => {
    set({ transformScale: val });
  },
  templateConfig: {
    baseSize: 40,
    column: 20,
    row: 15
  },
  setTemplateConfig: (val) => {
    set({ templateConfig: val });
  },
  curConfigTableItemName: '',
  setCurConfigTableItemName: (val) => {
    set({
      curConfigTableItemName: val
    });
  },
  curConfigComponentName: '',
  setCurConfigComponentName: (val) => {
    set({
      curConfigComponentName: val,
      componentSelectedList: val ? [val] : []
    });
  },
  tableItemSelectedList: [],
  setTableItemSelectedList: (val) => {
    set({ tableItemSelectedList: val });
  },
  componentSelectedList: [],
  setComponentSelectedList: (val) => {
    const curConfigComponentName = get().curConfigComponentName;
    if (curConfigComponentName) {
      if (!val.length) {
        set({ componentSelectedList: [curConfigComponentName] });
      } else {
        set({ componentSelectedList: [curConfigComponentName, ...val] });
      }
    } else {
      set({ componentSelectedList: val });
    }
  }
  // curEditType: null,
  // setCurEditType: (val) => {
  //   set({ curEditType: val });
  // }
}));
