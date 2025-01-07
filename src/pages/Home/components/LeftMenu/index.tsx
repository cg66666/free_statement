/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-11-18 11:47:52
 * @LastEditors: cg
 * @LastEditTime: 2025-01-07 14:41:51
 */
import React, { useEffect, memo } from 'react';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { type tableItemConfigType, useTableConfig, tableModeEnum } from '@/store';
import { defaultComponentList, type defaultComponentConfig } from '@/components/default';
import ShowDemo from '@/components/ShowDemo';
import s from './index.module.scss';

const LeftMenu: React.FC = memo(() => {
  const { tableMode } = useTableConfig();

  return (
    <div className={s.container}>
      <div className={s.title}>组件库</div>
      <div className={s.list}>
        {tableMode === tableModeEnum.INIT && (
          <div className={s.mark}>
            <div>
              <InfoCircleOutlined style={{ fontSize: '28px', marginBottom: '15px' }} />
            </div>
            <div>模板编辑下无法使用！</div>
          </div>
        )}
        <div id="components">
          {defaultComponentList.map((item, index) => {
            return <ShowDemo classs={s.item} itemConfig={item} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
});

export default LeftMenu;
