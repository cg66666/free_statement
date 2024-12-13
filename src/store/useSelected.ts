/*
 * @Description: 更新频率较高，优化性能，单独使用
 * @Author: cg
 * @Date: 2024-11-20 16:16:46
 * @LastEditors: cg
 * @LastEditTime: 2024-11-27 11:36:57
 */
import { create } from 'zustand';
import { defaultComponentConfig } from '@/components/default';

interface IState {
  // 当前选中的单元块
  tableItemSelectedList: string[];
  setTableItemSelectedList: (val: string[]) => void;
  // 当前选中的单元内组件
  componentSelectedList: string[];
  setComponentSelectedList: (val: string[]) => void;
}

export const useSelected = create<IState>((set) => ({
  tableItemSelectedList: [],
  setTableItemSelectedList: (val) => {
    set({ tableItemSelectedList: val });
  },
  componentSelectedList: [],
  setComponentSelectedList: (val) => {
    set({ componentSelectedList: val });
  }
}));
