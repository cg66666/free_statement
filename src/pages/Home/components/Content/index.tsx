/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-11-17 21:06:54
 * @LastEditors: cg
 * @LastEditTime: 2024-12-09 09:29:38
 */
import { useEffect, useMemo, useRef, useState, useCallback, memo } from 'react';
import {
  Dropdown,
  Space,
  type MenuProps,
  Popconfirm,
  type PopconfirmProps,
  message,
  Modal,
  Tooltip
} from 'antd';
import { CloseCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
import {
  type tableItemConfigType,
  useTableConfig,
  tableModeEnum,
  LayoutEnum,
  FlexAlignEnum,
  FlexDirectionEnum,
  DomTypeEnum
} from '@/store';
import Text from '@/components/default/Text';
import _ from 'lodash';
import s from './index.module.scss';

// interface IProps {
//   // Add prop types here
// }

const Content: React.FC = memo(() => {
  const {
    tableConfig,
    setTableConfig,
    tableMode,
    transformScale,
    setTransformScale,
    templateConfig,
    setTemplateConfig,
    curConfigTableItemName,
    setCurConfigTableItemName,
    tableItemSelectedList,
    setTableItemSelectedList,
    componentSelectedList,
    setComponentSelectedList,
    curConfigComponentName,
    setCurConfigComponentName
  } = useTableConfig();

  // console.log('componentSelectedList', componentSelectedList);

  // const {
  //   tableItemSelectedList,
  //   setTableItemSelectedList,
  //   componentSelectedList,
  //   setComponentSelectedList
  // } = useSelected();

  // console.log('tableConfig', tableConfig)

  const { row, column, baseSize } = templateConfig;

  // 右键
  const itemsTableItem: MenuProps['items'] = [
    {
      label: '删除当前单元块',
      key: '0',
      onClick: () => {
        if (Object.keys(tableConfig[tableItemSelectedList[0]].children).length) {
          setOpenMenuTemplate(false);
          return message.warning('当前单元块中存在子组件，无法删除！');
        }
        setDeleteTableItemModal(true);
        setOpenMenuTemplate(false);
      }
    }
  ];

  const itemsSelectedComponent: MenuProps['items'] = [
    {
      label: '删除当前组件',
      key: '0',
      onClick: () => {
        setOpenMenuTemplate(false);
        setDeleteComponentModal(true);
      }
    }
  ];

  const templateRenderList = Array(column * row).fill(null);

  // 画板dom
  const drawBoardDom = useRef<any>();

  // 画板中滚动条配置
  const [drawerBoardScrollConfig, setDrawerBoardScrollConfig] = useState<
    | {
        x: number;
        y: number;
      }
    | undefined
  >();

  // 画板中拖拽
  const [captureStartConfig, setCaptureStartConfig] = useState<
    | {
        x: number;
        y: number;
      }
    | undefined
  >();

  const [deleteTableItemModal, setDeleteTableItemModal] = useState(false);

  // 页面编辑-删除组件二次确认框
  const [deleteComponentModal, setDeleteComponentModal] = useState(false);

  // 画板是否在拖拽中
  const [isCapture, setIsCapture] = useState(false);

  // 页面编辑-控制底部模板渲染
  const [showUnderMode, setShowUnderMode] = useState(false);

  // 页面编辑-右键被选中的组件
  // const contextSelectedComponentDom = useRef<any>()
  const contextSelectedComponentConfig = useRef<any>();

  // 模板编辑-创建方块模板dom元素
  const markDom = useRef<any>();

  // 模板编辑-右键被选中单元块名称
  // const contextSelectedItemName = useRef('');

  // 模板编辑-创建确认
  const [inquire, setInquire] = useState(false);

  // 模板编辑-避免鼠标移动行为重复触发
  const [prevConfig, setPrevConfig] = useState<string>();

  // 模板编辑-创建方块错误确认
  const [isErrorConfirm, setIsErroeConfirm] = useState(false);

  // 模板编辑-当前所有已创建的方块相对位置配置，用于判断新建模板是否存在重叠
  const rectList = Object.keys(tableConfig).map((item) => tableConfig[item].rect);

  // 模板编辑-右键菜单是否展开
  const [openMenuTamplate, setOpenMenuTemplate] = useState(false);

  const markConfigIsFreeze = useRef(false);

  // 模板编辑-拖拽临时单元块配置
  const [markConfig, setMarkConfig] = useState<{
    column: (string | number)[];
    row: (string | number)[];
    startConfig: { column: number; row: number };
  } | null>(null);

  // 共用事件-缩放事件
  const wheelFunc = (e: React.WheelEvent<HTMLDivElement>) => {
    // 检查是否按下了 Ctrl 键
    if (e.ctrlKey) {
      if (e.deltaY < 0) {
        if (transformScale + 0.025 > 1) {
          setTransformScale(1);
        } else {
          setTransformScale(transformScale + 0.04);
        }
      } else {
        if (transformScale - 0.025 < 0) {
          setTransformScale(0.01);
        } else {
          setTransformScale(transformScale - 0.04);
        }
      }
    }
  };

  // 右键
  const onContextMenuTemplate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault && e.preventDefault();
    if (tableMode === tableModeEnum.INIT) {
      // 方块选择判断
      if (openMenuTamplate) {
        setOpenMenuTemplate(false);
        tableItemSelectedList.length && setTableItemSelectedList([]);
      } else {
        const elements = document.elementsFromPoint(e.clientX, e.clientY) as HTMLElement[];
        let instanceDom: HTMLElement | undefined;
        elements.forEach(function (element) {
          if (element.dataset.type && element.dataset.type === DomTypeEnum.ISINSTANCE) {
            instanceDom = element;
          }
        });
        if (!instanceDom) return;
        const name = instanceDom.dataset.id || '';
        setTableItemSelectedList([name]);
        tableConfig[name].isFreezed = true;
        setTableConfig({ ...tableConfig });
        setOpenMenuTemplate(true);
      }
    } else {
      // 组件选择判断
      if (openMenuTamplate) {
        setOpenMenuTemplate(false);
        componentSelectedList.length && setComponentSelectedList([]);
      } else {
        const elements = document.elementsFromPoint(e.clientX, e.clientY) as HTMLElement[];
        let instanceDom: HTMLElement | undefined;
        elements.forEach(function (element) {
          if (element.dataset.type && element.dataset.type === DomTypeEnum.ISCOMPONENT) {
            instanceDom = element;
          }
        });
        if (!instanceDom || !instanceDom.dataset.id || !instanceDom.dataset.pid) return;
        const pid = instanceDom.dataset.pid;
        const id = instanceDom.dataset.id;
        const itemConfig = tableConfig[pid];
        const component = itemConfig.children[id];
        if (!component) return;
        contextSelectedComponentConfig.current = {
          pid,
          id
        };
        setComponentSelectedList([id]);
        setOpenMenuTemplate(true);
      }
    }
  };

  // 确认创建表格块
  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    if (markConfig && !isErrorConfirm) {
      const columnString = markConfig.column.join('/');
      const rowString = markConfig.row.join('/');
      const name = columnString + '-' + rowString;
      const left = markDom.current.offsetLeft;
      const top = markDom.current.offsetTop;
      const width = markDom.current.offsetWidth;
      const height = markDom.current.offsetHeight;
      const addConfig = {
        [name]: {
          name,
          id: name,
          column: markConfig.column,
          row: markConfig.row,
          columnString,
          rowString,
          rect: {
            bottom: top + height,
            left,
            right: left + width,
            top
          },
          style: {
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            backgroundColor: 'rgba(255,255,255,0%)'
          },
          cssVariates: {
            borderLeftStyle: 'solid',
            borderLeftColor: 'rgba(0,0,0,1)',
            borderLeftWidth: 2,
            borderRightStyle: 'solid',
            borderRightColor: 'rgba(0,0,0,1)',
            borderRightWidth: 2,
            borderTopStyle: 'solid',
            borderTopColor: 'rgba(0,0,0,1)',
            borderTopWidth: 2,
            borderBottomStyle: 'solid',
            borderBottomColor: 'rgba(0,0,0,1)',
            borderBottomWidth: 2
          },
          layout: LayoutEnum.FLEX,
          flexConfig: {
            direction: FlexDirectionEnum.PARALLEL,
            flexVerticalAlign: FlexAlignEnum.MID,
            flexParallelAlign: FlexAlignEnum.LEFT,
            flexVerticalEqual: false,
            flexParalleEqual: false,
            isWrap: false
          },
          isFreezed: false,
          children: {}
        }
      } as tableItemConfigType;

      setTableConfig({
        ...tableConfig,
        ...addConfig
      });
      message.success('表格块创建成功！');
    } else {
      setIsErroeConfirm(false);
    }
    setInquire(false);
    setMarkConfig(null);
  };

  // 取消创建表格块
  const cancel: PopconfirmProps['onCancel'] = (e) => {
    if (markConfig) setMarkConfig(null);
    setInquire(false);
  };

  // 画板中鼠标拖拽组合事件
  const onMouseDownDrawBoard = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 右键行为不执行
    if (e.button === 2) return;
    // 重置选中行为
    if (openMenuTamplate) {
      setOpenMenuTemplate(false);
      tableItemSelectedList.length && setTableItemSelectedList([]);
      componentSelectedList.length && setComponentSelectedList([]);
      return;
    }
    const dom = e.target as HTMLElement;
    if (dom.dataset.type && dom.dataset.type === DomTypeEnum.ISOUTLINE && drawBoardDom.current) {
      const startBoardX = drawBoardDom.current.scrollLeft;
      const startBoardY = drawBoardDom.current.scrollTop;
      setDrawerBoardScrollConfig({ x: startBoardX, y: startBoardY });
      const startX = e.pageX;
      const startY = e.pageY;
      setCaptureStartConfig({ x: startX, y: startY });
      setIsCapture(true);
      document.body.style.cursor = 'grabbing'; // 改变鼠标图标
    } else if (tableMode === tableModeEnum.INIT) {
      setIsCapture(false);
      setCaptureStartConfig(undefined);
      if (markConfig && markConfigIsFreeze.current) return;
      const elements = document.elementsFromPoint(e.clientX, e.clientY) as HTMLElement[];
      let instanceDom;
      elements.forEach(function (element) {
        if (element.dataset.type && element.dataset.type === DomTypeEnum.ISINSTANCE) {
          instanceDom = element;
        }
      });
      if (instanceDom) return;
      const dom = e.target as HTMLElement;
      const list = dom.id.split('-');
      markConfigIsFreeze.current = false;
      setMarkConfig({
        column: [list[0], Number(list[0]) + 1],
        row: [list[1], Number(list[1]) + 1],
        startConfig: {
          column: Number(list[0]),
          row: Number(list[1])
        }
      });
    } else {
      // 点击配置单元块操作
      if (e.button === 0) {
        const dom = e.target as HTMLElement;
        if (
          dom.dataset.type &&
          [DomTypeEnum.ISINSTANCE].includes(dom.dataset.type as DomTypeEnum)
        ) {
          let name = '';
          if (dom.dataset.type === DomTypeEnum.ISINSTANCE) {
            name = dom.dataset.id || '';
          }
          setCurConfigTableItemName(name);
          setCurConfigComponentName('');
        } else {
          const elements = document.elementsFromPoint(e.clientX, e.clientY) as HTMLElement[];
          let instanceDom: HTMLElement | undefined;
          console.log('elements', elements);

          elements.forEach(function (element) {
            if (element.dataset.type && element.dataset.type === DomTypeEnum.ISCOMPONENT) {
              console.log('element', element);

              instanceDom = element;
            }
          });
          if (!instanceDom) {
            return setCurConfigComponentName('');
          }
          setCurConfigTableItemName(instanceDom.dataset.pid || '');
          setCurConfigComponentName(instanceDom.dataset.id || '');
        }
      }
    }
  };

  const onMouseMoveDrawBoard = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (isCapture && captureStartConfig && drawerBoardScrollConfig && drawBoardDom.current) {
      // 抓取周边改变滚动条位置
      const moveX = e.pageX - captureStartConfig.x;
      const moveY = e.pageY - captureStartConfig.y;
      const curX = drawerBoardScrollConfig.x - moveX < 0 ? 0 : drawerBoardScrollConfig.x - moveX;
      const curY = drawerBoardScrollConfig.y - moveY < 0 ? 0 : drawerBoardScrollConfig.y - moveY;
      drawBoardDom.current.scrollLeft = curX;
      drawBoardDom.current.scrollTop = curY;
    } else if (tableMode === tableModeEnum.INIT) {
      // 画单元块
      if (!markConfig) return;
      if (markConfigIsFreeze.current) return;
      if ((e.target as HTMLElement).dataset.type === DomTypeEnum.ISOUTLINE && markConfig) {
        setMarkConfig(null);
        return;
      }
      const dom = e.target as HTMLElement;
      if (dom.id === prevConfig) return;
      setPrevConfig(dom.id);
      const list = dom.id.split('-');
      if (Number(list[0]) < markConfig.startConfig.column) {
        markConfig.column[0] = list[0];
        markConfig.column[1] = Number(markConfig.startConfig.column) + 1;
      } else {
        markConfig.column[0] = markConfig.startConfig.column;
        markConfig.column[1] = Number(list[0]) + 1;
      }
      if (Number(list[1]) < markConfig.startConfig.row) {
        markConfig.row[0] = list[1];
        markConfig.row[1] = Number(markConfig.startConfig.row) + 1;
      } else {
        markConfig.row[0] = markConfig.startConfig.row;
        markConfig.row[1] = Number(list[1]) + 1;
      }
      setMarkConfig({ ...markConfig });
    }
  };

  const onMouseUpBrawerBoard = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isCapture) {
      setIsCapture(false);
      document.body.style.cursor = '';
      setCaptureStartConfig(undefined);
    } else {
      // console.log('markConfig', markConfig);

      if (!markConfig) return;
      const left = markDom.current.offsetLeft;
      const top = markDom.current.offsetTop;
      const width = markDom.current.offsetWidth;
      const height = markDom.current.offsetHeight;
      const bottom = top + height;
      const right = left + width;
      const isColliding = rectList.some((itemRect, index) => {
        return !(
          right - 2 < itemRect.left ||
          left + 2 > itemRect.right ||
          bottom - 2 < itemRect.top ||
          top + 2 > itemRect.bottom
        );
      });

      if (isColliding) {
        setIsErroeConfirm(true);
      } else {
        setIsErroeConfirm(false);
      }
      setInquire(true);
      markConfigIsFreeze.current = true;
      setMarkConfig({ ...markConfig });
    }
  };

  const onMouseLeaveDrawBoard = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    openMenuTamplate && setOpenMenuTemplate(false);

    if (!deleteTableItemModal) {
      tableItemSelectedList.length && setTableItemSelectedList([]);
    }
    if (!deleteComponentModal) {
      componentSelectedList.length && setComponentSelectedList([]);
    }
  };

  // 删除单元块
  const onCancelDeleteTableItem = () => {
    tableItemSelectedList.length && setTableItemSelectedList([]);
    setDeleteTableItemModal(false);
  };
  const confirmDeleteTableItem = () => {
    delete tableConfig[tableItemSelectedList[0]];
    setTableItemSelectedList([]);
    setTableConfig({ ...tableConfig });
    setDeleteTableItemModal(false);
    message.success('单元块删除成功！');
  };

  // 删除单元块内组件
  const onCancelDeleteComponent = () => {
    componentSelectedList.length && setComponentSelectedList([]);
    setDeleteComponentModal(false);
  };
  const confirmDeleteComponent = () => {
    const pid = contextSelectedComponentConfig.current.pid;
    const id = contextSelectedComponentConfig.current.id;
    const itemConfig = tableConfig[pid];
    delete itemConfig.children[id];
    setTableConfig({ ...tableConfig });
    componentSelectedList.length && setComponentSelectedList([]);
    setDeleteComponentModal(false);
    setCurConfigComponentName('');
    message.success('组件删除成功！');
  };

  // 根据模式切换执行初始化逻辑
  useEffect(() => {
    if (tableMode === tableModeEnum.INIT) {
      curConfigTableItemName && setCurConfigTableItemName('');
      curConfigComponentName && setCurConfigComponentName('');
    }

    // 初始化选中行为
    if (openMenuTamplate) {
      setOpenMenuTemplate(false);
      tableItemSelectedList.length && setTableItemSelectedList([]);
      componentSelectedList.length && setComponentSelectedList([]);
    }
    // 取消询问弹出框
    cancel();
    // 取消报错信息
    setIsErroeConfirm(false);
  }, [tableMode]);

  return (
    <div className={s.outine} onMouseLeave={onMouseLeaveDrawBoard}>
      <Dropdown
        menu={{ items: tableMode === tableModeEnum.INIT ? itemsTableItem : itemsSelectedComponent }}
        trigger={['contextMenu']}
        open={openMenuTamplate}
      >
        <div
          className={s.drawingBoard}
          ref={drawBoardDom}
          data-type={DomTypeEnum.ISOUTLINE}
          onWheel={wheelFunc}
          onMouseDown={onMouseDownDrawBoard}
          onMouseUp={onMouseUpBrawerBoard}
          onMouseMove={onMouseMoveDrawBoard}
          onContextMenu={onContextMenuTemplate}
        >
          <div
            className={`${s.gridContainer} ${s.editBorder}`}
            style={{
              gridTemplateColumns: `repeat( ${column},${baseSize}px)`,
              gridTemplateRows: `repeat( ${row},${baseSize}px)`,
              width: baseSize * column + 'px',
              height: baseSize * row + 'px',
              transform: `scale(${transformScale})`
            }}
            // 页面编辑模式处理
            onMouseEnter={() => {
              if (tableMode === tableModeEnum.EDIT) setShowUnderMode(true);
            }}
            onMouseLeave={() => {
              if (tableMode === tableModeEnum.EDIT) setShowUnderMode(false);
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
                // '--padding-left': target.style.paddingLeft + 'px',
                '--border-right-style': target.cssVariates.borderRightStyle,
                '--border-right-color': target.cssVariates.borderRightColor,
                '--border-right-width': target.cssVariates.borderRightWidth + 'px',
                // '--padding-right': target.style.paddingRight + 'px',
                '--border-bottom-style': target.cssVariates.borderBottomStyle,
                '--border-bottom-color': target.cssVariates.borderBottomColor,
                '--border-bottom-width': target.cssVariates.borderBottomWidth + 'px',
                // '--padding-bottom': target.style.paddingBottom + 'px',
                '--border-top-style': target.cssVariates.borderTopStyle,
                '--border-top-color': target.cssVariates.borderTopColor,
                '--border-top-width': target.cssVariates.borderTopWidth + 'px'
                // '--padding-top': target.style.paddingTop + 'px',
                // '--background-color': target.style.backgroundColor || 'initial'
              };

              return (
                !!target && (
                  <Tooltip
                    title={name + ' 单元块'}
                    placement="topLeft"
                    arrow={false}
                    color="#f5f5f5"
                    overlayInnerStyle={{ color: 'rgba(0,0,0,0.6)' }}
                    key={name}
                  >
                    <div
                      className={`${s.gridItem} ${s.renderDom} ${
                        tableMode === tableModeEnum.EDIT ? s.editItem : ''
                      }  ${curConfigTableItemName === target.name ? s.configingItem : ''} ${
                        tableItemSelectedList.includes(target.id) ? s.selectedItem : ''
                      }`}
                      data-type={DomTypeEnum.ISINSTANCE}
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
                      data-id={name}
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
                          // console.log('propsConfig', propsConfig);

                          return (
                            <Tooltip
                              title={item2.chineseName + ' - ' + item2.id.slice(0, 5)}
                              placement="topLeft"
                              arrow={false}
                              color="#f5f5f5"
                              overlayInnerStyle={{ color: 'rgba(0,0,0,0.6)' }}
                              key={name2}
                            >
                              <div
                                className={`${s.renderItem} 
                                ${
                                  componentSelectedList.includes(item2.id)
                                    ? s.selectedRenderItem
                                    : ''
                                }
                                `}
                              >
                                <item2.renderDom
                                  {...propsConfig}
                                  data-type={DomTypeEnum.ISCOMPONENT}
                                  data-pid={name}
                                  data-id={item2.id}
                                  style={styleConfig}
                                />
                              </div>
                            </Tooltip>
                          );
                        })}
                    </div>
                  </Tooltip>
                )
              );
            })}
            {markConfig && (
              <Popconfirm
                title={isErrorConfirm ? '错误提示' : '创建确认'}
                description={
                  isErrorConfirm ? '当前方块存在重叠情况，无法创建' : '是否要创建当前方块？'
                }
                icon={
                  isErrorConfirm ? (
                    <CloseCircleFilled style={{ color: 'red' }}></CloseCircleFilled>
                  ) : (
                    <ExclamationCircleFilled />
                  )
                }
                onConfirm={confirm}
                onCancel={cancel}
                okText={isErrorConfirm ? '取消' : '创建'}
                cancelText="取消"
                showCancel={!isErrorConfirm}
                open={inquire}
              >
                <div
                  className={` ${s.markItem} ${isErrorConfirm ? s.errorMarkItem : ''}`}
                  style={{
                    gridColumn: markConfig.column.join('/'),
                    gridRow: markConfig.row.join('/')
                  }}
                  ref={markDom}
                ></div>
              </Popconfirm>
            )}
          </div>
          <div
            style={{
              gridTemplateColumns: `repeat( ${column},${baseSize}px)`,
              gridTemplateRows: `repeat( ${row},${baseSize}px)`,
              width: baseSize * column + 'px',
              height: baseSize * row + 'px',
              transform: `scale(${transformScale})`
            }}
            className={`${s.templateGridContainer} ${
              tableMode === tableModeEnum.EDIT ? s.underMode : ''
            } ${tableMode === tableModeEnum.EDIT && showUnderMode ? s.showUnderMode : ''}`}
          >
            <>
              {templateRenderList.map((_, index) => {
                return (
                  <div
                    className={`${s.gridItem} ${s.templateGridItem}`}
                    key={index}
                    id={`${(index % column) + 1}-${Math.floor(index / column) + 1}`}
                  ></div>
                );
              })}
            </>
          </div>
        </div>
      </Dropdown>
      <Modal
        width={300}
        bodyProps={{ style: { height: '50px' } }}
        open={deleteTableItemModal}
        title="删除确认"
        onOk={confirmDeleteTableItem}
        onCancel={onCancelDeleteTableItem}
      >
        <div>确认删除该单元块？</div>
      </Modal>
      <Modal
        title="删除确认"
        width={350}
        open={deleteComponentModal}
        onCancel={onCancelDeleteComponent}
        onOk={confirmDeleteComponent}
      >
        <div>删除当前单元块内的组件，单元块内样式可能会出现不可预料的改变！</div>
      </Modal>
    </div>
  );
});

export default Content;
