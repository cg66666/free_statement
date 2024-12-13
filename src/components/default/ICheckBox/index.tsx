import React, { useState } from 'react';
import { Checkbox } from 'antd';
import s from './index.module.scss';

interface IProps {
  // Add prop types here
  label: string;
  plainOptions: string[];
  leftRatio: number;
  style: React.CSSProperties;
  fontSizeVariate: number;
}

const CheckboxGroup = Checkbox.Group;

const ICheckBox: React.FC<IProps> = ({
  plainOptions = [],
  label,
  leftRatio,
  fontSizeVariate,
  style,
  ...rest
}) => {
  const cssVariates = {
    '--font-size': fontSizeVariate + 'px'
  };

  return (
    <div className={s.container} style={{ ...style, ...cssVariates }} {...rest}>
      <div className={s.lable} style={{ width: leftRatio + '%' }}>
        {label}
      </div>
      <div style={{ position: 'relative', flex: 1 }}>
        <CheckboxGroup options={plainOptions} style={{ fontSize: '30px' }} />
      </div>
    </div>
  );
};

export default ICheckBox;
