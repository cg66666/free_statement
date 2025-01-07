/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-11-15 17:43:48
 * @LastEditors: cg
 * @LastEditTime: 2025-01-07 15:34:31
 */
import React, { memo, useEffect, useRef, useState } from 'react';
import { Segmented, InputNumber, Tooltip, Button, Dropdown, type MenuProps } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  type tableItemConfigType,
  tableModeStringEnum,
  useTableConfig,
  tableModeEnum
} from '@/store';
import { useNavigate } from 'react-router-dom';
import PrintDemo from '@/components/PrintDemo';
import html2canvas from 'html2canvas';
import s from './index.module.scss';

interface IProps {
  // Add prop types here
}

const Header: React.FC<IProps> = memo((prop) => {
  const navigate = useNavigate();

  const { tableConfig, tableMode, setTableMode, templateConfig, setTemplateConfig } =
    useTableConfig();

  const length = Object.keys(tableConfig).length;

  // const [blob, setBlob] = useState<Blob>();

  const [isPrinting, setIsPrinting] = useState(false);

  // 导出json
  const exportJson = () => {
    const tableConfig2 = JSON.stringify(
      { tableConfig: tableConfig, templateConfig: templateConfig },
      null,
      4
    );
    const blob = new Blob([tableConfig2], { type: 'text/json' });
    const link = document.createElement('a');
    link.download = 'hehe2.json';
    link.href = window.URL.createObjectURL(blob);
    link.click();
    link.remove();
  };

  // 导出图片
  const printOut = async () => {
    const editBorder = document.getElementById('editBorder');
    if (editBorder) {
      // setIsSpin(true);
      const canvas = await html2canvas(editBorder, {
        // width: editBorder.offsetWidth,
        // height: 2000
      });
      // 将Canvas转换为图片URL
      const imgData = canvas.toDataURL('image/png');
      // 创建一个<a>元素用于下载
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'screenshot.png'; // 设置下载文件名
      // 模拟点击触发下载
      link.click();
      link.remove();
      setIsPrinting(false);
    }
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <div onClick={() => setIsPrinting(true)}>导出图片</div>
    },
    {
      key: '4',
      label: <div onClick={exportJson}>导出json</div>
    }
  ];

  useEffect(() => {
    if (isPrinting) {
      printOut();
    }
  }, [isPrinting]);

  // useEffect(() => {
  //   setBlob(new Blob([JSON.stringify(tableConfig)], { type: 'application/json' }));
  // }, [tableConfig]);

  return (
    <div className={s.conatiner}>
      <Segmented<string>
        id="modeSelect"
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
      {isPrinting && (
        <div id="editBorder" style={{ position: 'absolute', top: '-9999px' }}>
          <PrintDemo />
        </div>
      )}
      <div className={s.rightContainer}>
        <Dropdown menu={{ items }}>
          <Button
            style={{ marginRight: 20 }}
            // onClick={() => setIsPrinting(true)}
          >
            输出
          </Button>
        </Dropdown>
        <Button style={{ marginRight: 20 }} onClick={() => navigate('show')}>
          预览
        </Button>
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
