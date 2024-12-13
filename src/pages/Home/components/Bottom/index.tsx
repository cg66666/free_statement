/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-11-18 09:15:14
 * @LastEditors: cg
 * @LastEditTime: 2024-11-25 16:24:34
 */
import React, { useState, useEffect, memo } from 'react';
import { InputNumber, Slider, type InputNumberProps } from 'antd';
import {
  type tableItemConfigType,
  tableModeStringEnum,
  useTableConfig,
  tableModeEnum
} from '@/store';
import _ from 'lodash';
import s from './index.module.scss';

const Bottom: React.FC = memo(() => {
  const { transformScale, setTransformScale } = useTableConfig();

  const onChange: InputNumberProps['onChange'] = (value) => {
    if (Number.isNaN(value)) {
      return;
    }
    setTransformScale(value as number);
  };

  return (
    <div className={s.container}>
      <div className={s.tip}>快捷键：ctr + 鼠标滚轮</div>
      <div>大小缩放：</div>
      <Slider
        min={0}
        max={1}
        onChange={onChange}
        value={typeof transformScale === 'number' ? transformScale : 0}
        step={0.01}
        style={{ width: '150px', margin: '0 10px' }}
      />
      <InputNumber
        min={0}
        max={1}
        step={0.01}
        value={transformScale}
        onChange={onChange}
        style={{ height: '30px', width: '70px' }}
      />
    </div>
  );
});

export default Bottom;
