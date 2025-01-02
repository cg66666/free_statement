/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-11-17 21:06:54
 * @LastEditors: cg
 * @LastEditTime: 2024-12-27 17:46:07
 */
import React, { memo, useRef, useState } from 'react';
import { useTableConfig, FlexAlignEnum, FlexDirectionEnum } from '@/store';
import components from '@/components/default';
import _ from 'lodash';
import s from './index.module.scss';

interface IProps {
  // style: React.CSSProperties;
}

const PrintDemo: React.FC<IProps> = memo(({ ...rest }) => {
  const { tableConfig, templateConfig } = useTableConfig();

  console.log('tableConfig', tableConfig);

  const { row, column, baseSize } = templateConfig;

  const [isSpin, setIsSpin] = useState(false);

  const editBorder = useRef(null);

  return (
    <div className={s.outine} {...rest}>
      <div className={s.drawingBoard} ref={editBorder}>
        <div
          className={`${s.gridContainer} `}
          style={{
            gridTemplateColumns: `repeat( ${column},${baseSize}px)`,
            gridTemplateRows: `repeat( ${row},${baseSize}px)`,
            width: baseSize * column + 'px',
            height: baseSize * row + 'px',
            transform: `scale(1)`
          }}
        >
          {Object.keys(tableConfig).map((name) => {
            const target = tableConfig[name];
            // 自适应布局配置
            let flexConfig: React.CSSProperties = {};
            if (target.flexConfig.direction === FlexDirectionEnum.PARALLEL) {
              flexConfig = {
                justifyContent: target.flexConfig.flexParalleEqual
                  ? 'space-evenly'
                  : target.flexConfig.flexParallelAlign,
                alignContent: target.flexConfig.flexVerticalEqual
                  ? 'space-evenly'
                  : target.flexConfig.flexVerticalAlign === FlexAlignEnum.TOP
                  ? 'flex-start'
                  : target.flexConfig.flexVerticalAlign === FlexAlignEnum.BOTTOM
                  ? 'flex-end'
                  : 'center',
                alignItems:
                  target.flexConfig.flexVerticalAlign === FlexAlignEnum.TOP
                    ? 'flex-start'
                    : target.flexConfig.flexVerticalAlign === FlexAlignEnum.BOTTOM
                    ? 'flex-end'
                    : 'center'
              };
            } else {
              flexConfig = {
                justifyContent: target.flexConfig.flexVerticalEqual
                  ? 'space-evenly'
                  : target.flexConfig.flexVerticalAlign === FlexAlignEnum.TOP
                  ? 'flex-start'
                  : target.flexConfig.flexVerticalAlign === FlexAlignEnum.BOTTOM
                  ? 'flex-end'
                  : 'center',
                alignItems:
                  target.flexConfig.flexParallelAlign === FlexAlignEnum.LEFT
                    ? 'flex-start'
                    : target.flexConfig.flexParallelAlign === FlexAlignEnum.RIGHT
                    ? 'flex-end'
                    : 'center',
                alignContent: target.flexConfig.flexParalleEqual
                  ? 'space-evenly'
                  : target.flexConfig.flexParallelAlign === FlexAlignEnum.LEFT
                  ? 'flex-start'
                  : target.flexConfig.flexParallelAlign === FlexAlignEnum.RIGHT
                  ? 'flex-end'
                  : 'center'
              };
            }

            // css中使用的变量
            const cssVariates = {
              '--border-left-style': target.cssVariates.borderLeftStyle,
              '--border-left-color': target.cssVariates.borderLeftColor,
              '--border-left-width': target.cssVariates.borderLeftWidth + 'px',
              '--border-right-style': target.cssVariates.borderRightStyle,
              '--border-right-color': target.cssVariates.borderRightColor,
              '--border-right-width': target.cssVariates.borderRightWidth + 'px',
              '--border-bottom-style': target.cssVariates.borderBottomStyle,
              '--border-bottom-color': target.cssVariates.borderBottomColor,
              '--border-bottom-width': target.cssVariates.borderBottomWidth + 'px',
              '--border-top-style': target.cssVariates.borderTopStyle,
              '--border-top-color': target.cssVariates.borderTopColor,
              '--border-top-width': target.cssVariates.borderTopWidth + 'px'
            };
            return (
              !!target && (
                <div
                  className={`${s.gridItem} ${s.renderDom} `}
                  style={{
                    gridColumn: target.columnString,
                    gridRow: target.rowString,
                    display: target.layout,
                    flexDirection: target.flexConfig.direction,
                    alignItems: 'left',
                    flexWrap: target.flexConfig.isWrap ? 'wrap' : 'nowrap',
                    ...flexConfig,
                    ...cssVariates,
                    ...target.style
                  }}
                >
                  {!!Object.keys(target.children).length &&
                    Object.keys(target.children).map((name2) => {
                      const item2 = target.children[name2];
                      const propsConfig: any = {};
                      const styleConfig: any = {};
                      Object.keys(item2.props).forEach((name3) => {
                        if (item2.props[name3].isStyle) {
                          styleConfig[item2.props[name3].name] = item2.props[name3].value;
                        } else {
                          propsConfig[item2.props[name3].name] = item2.props[name3].value;
                        }
                      });
                      //@ts-ignore
                      const targetDom = React.createElement(components[item2.renderDom], {
                        ...propsConfig,
                        style: styleConfig
                      });
                      return (
                        <div className={`${s.renderItem}`}>
                          {targetDom}
                          {/* <item2.renderDom {...propsConfig} style={styleConfig} /> */}
                        </div>
                      );
                    })}
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default PrintDemo;
