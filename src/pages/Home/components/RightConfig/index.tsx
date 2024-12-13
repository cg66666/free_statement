/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-11-19 14:40:26
 * @LastEditors: cg
 * @LastEditTime: 2024-12-11 15:41:29
 */
import React, { useEffect, memo, useState } from 'react';
import {
  Collapse,
  Form,
  Input,
  Empty,
  ColorPicker,
  InputNumber,
  type CollapseProps,
  Modal,
  message
} from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { type tableItemConfigType, useTableConfig, tableModeEnum, DomTypeEnum } from '@/store';
import ConfigContent from './components/ConfigContent';
import _ from 'lodash';
import s from './index.module.scss';

interface IProps {
  // Add prop types here
}

const RightConfig: React.FC<IProps> = memo((prop) => {
  const {
    tableMode,
    tableConfig,
    setTableConfig,
    curConfigTableItemName,
    tableItemSelectedList,
    setTableItemSelectedList
    // componentSelectedList,
    // setComponentSelectedList
    // configComponentsIdList
  } = useTableConfig();

  const nameList = Object.keys(tableConfig).reverse();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const clickDelete = (name: string) => {
    if (Object.keys(tableConfig[name].children).length) {
      message.warning('当前块中存在子组件，无法删除！');
    } else {
      setTableItemSelectedList([name]);
      // tableConfig[name].isSelected = true;
      tableConfig[name].isFreezed = true;
      setTableConfig({ ...tableConfig });
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (tableItemSelectedList.length) {
      delete tableConfig[tableItemSelectedList[0]];
      setTableConfig({ ...tableConfig });
    }
    setDeleteModalOpen(false);
    message.success('单元块删除成功！');
  };

  const onCancelDelete = () => {
    if (!tableItemSelectedList.length) return;
    tableConfig[tableItemSelectedList[0]].isFreezed = false;
    setTableItemSelectedList([]);
    setTableConfig({ ...tableConfig });
    setDeleteModalOpen(false);
  };

  return (
    <div className={s.container}>
      {tableMode === tableModeEnum.INIT ? (
        <div className={s.unitList}>
          <div className={s.count}>单元块总数：{nameList.length}</div>
          <div style={{ overflow: 'hidden' }}>
            {nameList.map((name) => {
              const item = tableConfig[name];
              return (
                <div className={s.unitItem} id={name} key={name} data-type={DomTypeEnum.CELLITEM}>
                  {item.name}
                  <DeleteOutlined
                    className={s.icon}
                    onClick={() => clickDelete(name)}
                    onMouseMove={(e) => e.stopPropagation()}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : curConfigTableItemName ? (
        <ConfigContent
        // setTableConfig={setTableConfig}
        // tableConfig={tableConfig}
        // curConfigTableItemName={curConfigTableItemName}
        // componentSelectedList={componentSelectedList}
        // setComponentSelectedList={setComponentSelectedList}
        // configComponentsIdList={configComponentsIdList}
        />
      ) : (
        <Empty
          image={<></>}
          description={
            <div>
              <ExclamationCircleOutlined
                style={{
                  fontSize: '40px',
                  color: 'rgba(0, 0, 0, 0.45)',
                  marginBottom: '20px'
                }}
              />
              <div
                style={{
                  fontSize: '18px',
                  width: 180,
                  margin: 'auto',
                  color: 'rgba(0, 0, 0, 0.45)'
                }}
              >
                请选择需要配置的单元块或者组件！
              </div>
            </div>
          }
        />
      )}
      <Modal
        width={300}
        bodyProps={{ style: { height: '50px' } }}
        open={deleteModalOpen}
        title="删除确认"
        onOk={confirmDelete}
        onCancel={onCancelDelete}
      >
        <div>确认删除该单元块？</div>
      </Modal>
    </div>
  );
});

export default RightConfig;
