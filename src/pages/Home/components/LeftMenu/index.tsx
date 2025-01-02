/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-11-18 11:47:52
 * @LastEditors: cg
 * @LastEditTime: 2024-12-27 10:11:03
 */
import React, { useEffect, memo } from 'react';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { type tableItemConfigType, useTableConfig, tableModeEnum } from '@/store';
import { defaultComponentList, type defaultComponentConfig } from '@/components/default';
import Text from '@/components/default/Text';
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
        {defaultComponentList.map((item, index) => {
          return <ShowDemo classs={s.item} itemConfig={item} key={index} />;
        })}
      </div>
      {/* <div className={s.title}>自定义组件库</div>
      <div className={s.list}>
        <Tooltip placement="right" title={<Text />}>
          <div className={s.item}>文本标签</div>
        </Tooltip>
      </div> */}
    </div>
  );
});

export default LeftMenu;
