/*
 * @Description: 文本标签
 * @Author: cg
 * @Date: 2024-11-18 14:01:32
 * @LastEditors: cg
 * @LastEditTime: 2024-12-04 15:20:11
 */
import React from 'react';
import { type tableItemConfigType, useTableConfig, tableModeEnum } from '@/store';
import s from './index.module.scss';

interface IProps {
  text?: any;
  style?: React.CSSProperties;
}

const Text: React.FC<IProps> = ({ text = '文本标签', ...rest }) => {
  // return <textarea className={s.container} value={defaultValue} {...rest}></textarea>;
  return (
    <div className={s.container} {...rest}>
      {text}
    </div>
  );
};

export default Text;
