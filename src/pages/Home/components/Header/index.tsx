/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-11-15 17:43:48
 * @LastEditors: cg
 * @LastEditTime: 2024-11-25 16:23:53
 */
import React, { memo } from 'react';
import { Segmented, InputNumber, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  type tableItemConfigType,
  tableModeStringEnum,
  useTableConfig,
  tableModeEnum
} from '@/store';
import s from './index.module.scss';

interface IProps {
  // Add prop types here
}

const Header: React.FC<IProps> = memo((prop) => {
  const {
    tableConfig,
    tableMode,
    setTableMode,
    // setCurConfigTableItemName,
    templateConfig,
    setTemplateConfig
  } = useTableConfig();

  // console.log('tableConfig', tableConfig)

  const length = Object.keys(tableConfig).length;

  return (
    <div className={s.conatiner}>
      <Segmented<string>
        options={[tableModeStringEnum.INIT, tableModeStringEnum.EDIT]}
        value={
          tableMode === tableModeEnum.EDIT ? tableModeStringEnum.EDIT : tableModeStringEnum.INIT
        }
        onChange={(value) => {
          if (value === tableModeStringEnum.EDIT) {
            setTableMode(tableModeEnum.EDIT);
          } else {
            setTableMode(tableModeEnum.INIT);
          }
        }}
      />
      <div className={s.rightContainer}>
        <Tooltip
          overlayInnerStyle={{ width: '450px' }}
          title={
            <div>
              <div>1、行列数量上线为100，宽度上限为100，宽度最小值为10。</div>
              <div>2、一旦创建单元块后，此处配置将再无法修改，请删除所有单元块后再修改！</div>
            </div>
          }
        >
          <ExclamationCircleOutlined style={{ fontSize: '15px', cursor: 'pointer' }} />
        </Tooltip>
        <div className={s.label}>每行数量</div>
        <InputNumber
          className={s.inputNumber}
          min={0}
          max={100}
          value={templateConfig.column}
          onChange={(value) => {
            // console.log('value', value);
            templateConfig.column = Math.floor(value || 0);
            setTemplateConfig({ ...templateConfig });
          }}
          disabled={length > 0}
        ></InputNumber>
        <div className={s.label}>每列数量</div>
        <InputNumber
          className={s.inputNumber}
          min={0}
          max={100}
          value={templateConfig.row}
          onChange={(value) => {
            templateConfig.row = Math.floor(value || 0);
            setTemplateConfig({ ...templateConfig });
          }}
          disabled={length > 0}
        ></InputNumber>
        <div className={s.label}>格子宽度</div>
        <InputNumber
          className={s.inputNumber}
          min={10}
          max={100}
          value={templateConfig.baseSize}
          onChange={(value) => {
            templateConfig.baseSize = Math.floor(value || 10);
            setTemplateConfig({ ...templateConfig });
          }}
          disabled={length > 0}
        ></InputNumber>
      </div>
      {/* <div cla>缩放大小:{transformScale}</div> */}
    </div>
  );
});

export default Header;
