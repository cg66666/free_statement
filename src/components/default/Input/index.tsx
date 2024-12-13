/*
 * @Description: 输入框
 * @Author: cg
 * @Date: 2024-11-18 14:01:32
 * @LastEditors: cg
 * @LastEditTime: 2024-12-09 00:27:54
 */
import React from 'react';
import { type defaultType } from '@/components/default';
import { type tableItemConfigType, useTableConfig, tableModeEnum } from '@/store';
import s from './index.module.scss';

interface IProps extends defaultType {
  label?: string;
  defaultValue?: any;
  style?: React.CSSProperties;
  showUndeLine?: boolean;
  leftRatio?: number;
  placeholder?: string;
}

const Input: React.FC<IProps> = ({
  label = '标签',
  defaultValue = '',
  showUndeLine,
  leftRatio = 30,
  placeholder = '提示语',
  ...rest
}) => {
  return (
    <div className={s.container} {...rest}>
      <div className={s.lable} style={{ width: leftRatio + '%' }}>
        {label}
      </div>
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          className={s.inputInstance}
          defaultValue={defaultValue}
          style={{ width: '100%' }}
          placeholder={placeholder}
        ></input>
        {!!showUndeLine && <div className={s.underLine} />}
      </div>
    </div>
  );
};

export default Input;
