/*
 * @Description: 更新频率较高，单独使用
 * @Author: cg
 * @Date: 2024-11-20 16:16:46
 * @LastEditors: cg
 * @LastEditTime: 2024-11-25 16:33:12
 */
import { create } from 'zustand';
import { defaultComponentConfig } from '@/components/default';

type dragType = {
  innerX: number;
  innerY: number;
  clientX: number;
  clientY: number;
} & defaultComponentConfig;

interface IState {
  // 当前正在拖拽元素
  draggingDomConfig: dragType | null;
  setDraggingDomConfig: (val: dragType | null) => void;
}

export const useComponentDrag = create<IState>((set) => ({
  draggingDomConfig: null,
  setDraggingDomConfig: (val) => {
    set({ draggingDomConfig: val });
  }
}));
