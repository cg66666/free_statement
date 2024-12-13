/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-11-18 14:47:09
 * @LastEditors: cg
 * @LastEditTime: 2024-12-11 16:10:56
 */
import React, { useEffect, useState, useRef } from 'react';
import { Tooltip } from 'antd';
import { ZoomInOutlined } from '@ant-design/icons';
import { type tableItemConfigType, useTableConfig, useComponentDrag } from '@/store';
import { type defaultComponentConfig } from '@/components/default';
import Text from '@/components/default/Text';
import s from './index.module.scss';

interface IProps {
  classs: string;
  itemConfig: defaultComponentConfig;
}

const ShowDemo: React.FC<IProps> = ({ classs, itemConfig }) => {
  const { draggingDomConfig, setDraggingDomConfig } = useComponentDrag();

  const dom = useRef<HTMLDivElement | null>(null);

  // 优化性能
  const [isDemoInit, setIsDemoInit] = useState(true);

  const [locationConfig, setLocationConfig] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (dom.current) {
      setLocationConfig({
        x: dom.current.offsetLeft,
        y: dom.current.offsetTop
      });
    }
  }, []);

  return (
    <>
      <div
        className={classs}
        onMouseDown={(e) => {
          setDraggingDomConfig({
            innerX: e.clientX - locationConfig.x,
            innerY: e.clientY - locationConfig.y,
            clientX: locationConfig.x,
            clientY: locationConfig.y,
            ...itemConfig
          });
        }}
        ref={dom}
      >
        {/* <Tooltip
          placement="right"
          // color="white"
          // style={}
          fresh={true}
          // open={true}
          onOpenChange={(open) => {
            if (isDemoInit && open) {
              setIsDemoInit(false);
            }
          }}
          style={{ background: 'white' }}
          title={
            <div
              style={{
                padding: '0 10px',
                minHeight: '200px',
                minWidth: '40px',
                display: 'flex',
                alignItems: 'center'
                // background: 'white'
              }}
            >
              {isDemoInit ? <></> : <itemConfig.renderDom />}
            </div>
          }
        >
          <ZoomInOutlined className={s.icon}></ZoomInOutlined>
        </Tooltip> */}
        {itemConfig.chineseName}
      </div>
      {draggingDomConfig && draggingDomConfig.chineseName === itemConfig.chineseName && (
        <div
          className={s.ghost}
          style={{ left: draggingDomConfig.clientX, top: draggingDomConfig.clientY }}
        >
          {itemConfig.chineseName}
        </div>
      )}
    </>
  );
};

export default ShowDemo;
