/*
 * @Description: 优化antd组件与zustand的性能问题
 * @Author: cg
 * @Date: 2024-11-20 16:36:53
 * @LastEditors: cg
 * @LastEditTime: 2024-12-13 09:58:17
 */
import React, { useState, memo, useEffect, useRef, useMemo } from 'react';
import {
  Collapse,
  Form,
  Input,
  Tooltip,
  ColorPicker,
  InputNumber,
  type CollapseProps,
  Segmented,
  Switch,
  Modal,
  message,
  Checkbox,
  Slider,
  Select
} from 'antd';
import { HolderOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  type tableItemType,
  type tableItemConfigType,
  LayoutEnum,
  LayoutStringEnum,
  FlexAlignStringEnum,
  FlexAlignEnum,
  FlexDirectionStringEnum,
  FlexDirectionEnum,
  useTableConfig,
  tableModeEnum,
  DomTypeEnum
} from '@/store';
import defaultComponentList, { DefaultComponentNameEnum, InquireType } from '@/components/default';
import _ from 'lodash';
import s from './index.module.scss';

interface IProps {
  // setTableConfig: (val: tableItemConfigType) => void;
  // tableConfig: tableItemConfigType;
  // curConfigTableItemName: string;
  // componentSelectedList: string[];
  // setComponentSelectedList: (val: string[]) => void;
  // configComponentsIdList: string[];
}

const ConfigContent: React.FC<IProps> = memo(() => {
  const {
    tableMode,
    tableConfig,
    setTableConfig,
    curConfigTableItemName,
    componentSelectedList,
    setComponentSelectedList,
    curConfigComponentName,
    setCurConfigComponentName
  } = useTableConfig();

  const isInit = useRef(true);

  const [form] = Form.useForm();

  // 删除组件二次确认框
  const [deleteComponentModalId, setDeleteComponentModalId] = useState('');

  // 用于性能优化
  const prevName = useRef('');
  // const [prevName, setPrevName] = useState<string>('');

  const [position, setPosition] = useState<'top' | 'bottom' | 'right' | 'left' | null>(null);

  const [isParallelEqual, setIsParallelEqual] = useState(false);

  const [isVerticalEqual, setIsVerticalEqual] = useState(false);

  const [deomoTriangleBorder, setDeomoTriangleBorder] = useState<React.CSSProperties>({
    borderRightStyle: 'dashed',
    borderRightColor: '#000000',
    borderTopStyle: 'dashed',
    borderTopColor: '#000000',
    borderBottomStyle: 'dashed',
    borderBottomColor: '#000000',
    borderLeftStyle: 'dashed',
    borderLeftColor: '#000000'
  });

  const curConfigTableComponentItem =
    tableConfig[curConfigTableItemName].children[curConfigComponentName] || {};

  const deleteComponent = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteComponentModalId(id);
  };

  const itemsBorder: CollapseProps['items'] = [
    {
      key: '1',
      forceRender: true,
      label: <div style={{ fontSize: '14px' }}>边设置：</div>,
      children: (
        <>
          <div className={s.square}>
            <div
              className={`${s.triangle} ${s.top} ${position === 'top' ? s.selectedTriangle : ''}`}
              onClick={() => setPosition('top')}
            ></div>
            <div
              className={`${s.triangle} ${s.right} ${
                position === 'right' ? s.selectedTriangle : ''
              }`}
              onClick={() => setPosition('right')}
            ></div>
            <div
              className={`${s.triangle} ${s.bottom} ${
                position === 'bottom' ? s.selectedTriangle : ''
              }`}
              onClick={() => setPosition('bottom')}
            ></div>
            <div
              className={`${s.triangle} ${s.left} ${position === 'left' ? s.selectedTriangle : ''}`}
              onClick={() => setPosition('left')}
            ></div>
            <div
              className={s.squareInstance}
              style={{
                borderRightStyle: deomoTriangleBorder.borderRightStyle,
                borderRightColor: deomoTriangleBorder.borderRightColor,
                borderLeftStyle: deomoTriangleBorder.borderLeftStyle,
                borderLeftColor: deomoTriangleBorder.borderLeftColor,
                borderBottomStyle: deomoTriangleBorder.borderBottomStyle,
                borderBottomColor: deomoTriangleBorder.borderBottomColor,
                borderTopStyle: deomoTriangleBorder.borderTopStyle,
                borderTopColor: deomoTriangleBorder.borderTopColor
              }}
            ></div>
          </div>
          <div style={{ display: position === 'top' ? 'block' : 'none' }}>
            <Form.Item label="上边框样式" name={['cssVariates', 'borderTopStyle']}>
              <Segmented<any>
                options={[
                  { label: '实线', value: 'solid' },
                  { label: '虚线', value: 'dashed' }
                ]}
                onChange={(value) => {
                  deomoTriangleBorder.borderTopStyle = value;
                  setBorderDebounce({ ...deomoTriangleBorder });
                }}
              />
            </Form.Item>
            <Form.Item
              label="上边框颜色"
              name={['cssVariates', 'borderTopColor']}
              normalize={(e) => {
                const value = e.toCssString();
                deomoTriangleBorder.borderTopColor = value;
                setBorderDebounce({ ...deomoTriangleBorder });
                return value;
              }}
            >
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="上边框粗细" name={['cssVariates', 'borderTopWidth']}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="上内边距" name={['style', 'paddingTop']}>
              <InputNumber min={0} />
            </Form.Item>
          </div>
          <div style={{ display: position === 'right' ? 'block' : 'none' }}>
            <Form.Item label="右边框样式" name={['cssVariates', 'borderRightStyle']}>
              <Segmented<any>
                options={[
                  { label: '实线', value: 'solid' },
                  { label: '虚线', value: 'dashed' }
                ]}
                onChange={(value) => {
                  deomoTriangleBorder.borderRightStyle = value;
                  setBorderDebounce({ ...deomoTriangleBorder });
                }}
              />
            </Form.Item>
            <Form.Item
              label="右边框颜色"
              name={['cssVariates', 'borderRightColor']}
              normalize={(e) => {
                const value = e.toCssString();
                deomoTriangleBorder.borderRightColor = value;
                setBorderDebounce({ ...deomoTriangleBorder });
                return value;
              }}
            >
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="右边框粗细" name={['cssVariates', 'borderRightWidth']}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="右内边距" name={['style', 'paddingRight']}>
              <InputNumber min={0} />
            </Form.Item>
          </div>
          <div style={{ display: position === 'bottom' ? 'block' : 'none' }}>
            <Form.Item label="底边框样式" name={['cssVariates', 'borderBottomStyle']}>
              <Segmented<any>
                options={[
                  { label: '实线', value: 'solid' },
                  { label: '虚线', value: 'dashed' }
                ]}
                onChange={(value) => {
                  deomoTriangleBorder.borderBottomStyle = value;
                  setBorderDebounce({ ...deomoTriangleBorder });
                }}
              />
            </Form.Item>
            <Form.Item
              label="底边框颜色"
              name={['cssVariates', 'borderBottomColor']}
              normalize={(e) => {
                const value = e.toCssString();
                deomoTriangleBorder.borderBottomColor = value;
                setBorderDebounce({ ...deomoTriangleBorder });
                return value;
              }}
            >
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="底边框粗细" name={['cssVariates', 'borderBottomWidth']}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="底内边距" name={['style', 'paddingBottom']}>
              <InputNumber min={0} />
            </Form.Item>
          </div>
          <div style={{ display: position === 'left' ? 'block' : 'none' }}>
            <Form.Item label="左边框样式" name={['cssVariates', 'borderLeftStyle']}>
              <Segmented<any>
                options={[
                  { label: '实线', value: 'solid' },
                  { label: '虚线', value: 'dashed' }
                ]}
                onChange={(value) => {
                  deomoTriangleBorder.borderLeftStyle = value;
                  setBorderDebounce({ ...deomoTriangleBorder });
                }}
              />
            </Form.Item>
            <Form.Item
              label="左边框颜色"
              name={['cssVariates', 'borderLeftColor']}
              normalize={(e) => {
                const value = e.toCssString();
                deomoTriangleBorder.borderLeftColor = value;
                setBorderDebounce({ ...deomoTriangleBorder });
                return value;
              }}
            >
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="左边框粗细" name={['cssVariates', 'borderLeftWidth']}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="左内边距" name={['style', 'paddingLeft']}>
              <InputNumber min={0} />
            </Form.Item>
          </div>
        </>
      )
    }
  ];

  const [configComponentList, setConfigComponentList] = useState<
    { name: string; chineseName: string }[]
  >([]);

  console.log('configComponentList', configComponentList);

  const [list, setList] = useState([
    { name: '111', chineseName: '文本标签' },
    { name: '222', chineseName: '文本标签' },
    { name: '333', chineseName: '文本标签' },
    { name: '444', chineseName: '文本标签' },
    { name: '555', chineseName: '文本标签' }
  ]);

  const listRef = useRef<HTMLDivElement>(null);

  const startIndex = useRef(-1);
  const endIndex = useRef(-1);

  const curDragDom = useRef<Element>();

  const childLeft = useRef<Record<string, number>>({});

  const isMoving = useRef(false);

  const onDragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!listRef.current) return;
    const children = [...listRef.current.children];
    children.forEach((dom) => {
      const rect = dom.getBoundingClientRect();
      //@ts-ignore
      childLeft.current[dom.dataset.index] = rect.top;
    });
    const target = e.target as Element;
    startIndex.current = children.indexOf(target);
    curDragDom.current = target;
    requestAnimationFrame(() => {
      target.classList.add(s.opacityClass);
    });
  };

  const onDragEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (isMoving.current) return;
    if (!curDragDom.current || !listRef.current) return;
    const elements = document.elementsFromPoint(e.clientX, e.clientY) as HTMLElement[];
    const target = elements.find((element) => Boolean(element.dataset.index)) as Element;
    const children = [...listRef.current.children];
    const prevIndex = children.indexOf(curDragDom.current);
    const targetIndex = children.indexOf(target);
    if (targetIndex < 0 || prevIndex == targetIndex) return;
    endIndex.current = targetIndex;
    if (prevIndex > targetIndex) {
      listRef.current.insertBefore(curDragDom.current, target);
    } else {
      listRef.current.insertBefore(curDragDom.current, target.nextElementSibling);
    }
    isMoving.current = true;
    children.forEach((dom) => {
      const rect = dom.getBoundingClientRect();
      //@ts-ignore
      const index = dom.dataset.index;
      const diffTop = childLeft.current[index] - rect.top;
      dom.animate([{ transform: `translateY(${diffTop}px)` }, { transform: `translateY(0px)` }], {
        duration: 200
      });
    });
    setTimeout(() => {
      isMoving.current = false;
      children.forEach((dom) => {
        const rect = dom.getBoundingClientRect();
        //@ts-ignore
        childLeft.current[dom.dataset.index] = rect.top;
      });
    }, 200);
  };

  const onDragEnd = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!curDragDom.current || !listRef.current) return;
    curDragDom.current.classList.remove(s.opacityClass);
    const children = [...listRef.current.children];
    //@ts-ignore
    const nameList = children.map((dom) => dom.dataset.index);
    console.log('nameList', nameList);
    const newObj: any = {};
    nameList.forEach((name) => {
      newObj[name] = tableConfig[curConfigTableItemName].children[name];
    });
    tableConfig[curConfigTableItemName].children = newObj;
    setTableConfig({ ...tableConfig });
  };

  const itemsComponent: CollapseProps['items'] = [
    {
      key: '1',
      forceRender: true,
      label: <div style={{ fontSize: '14px' }}>子组件排序设置：</div>,
      styles: { body: { paddingBottom: 0 } },
      children: (
        <div
          className={s.itemsComponentsContainer}
          // style={{ height: `${50 * (configComponentList.length - 1) + 23.5}px` }}
          ref={listRef}
          onDragStart={onDragStart}
          onDragEnter={onDragEnter}
          onDragOver={(e) => e.preventDefault()}
          onDragEnd={onDragEnd}
          // onMouseLeave={() => {
          //   setCurName(undefined);
          //   setCurHoverName(undefined);
          // }}
          // onDragEnter={(e) => {
          //   e.preventDefault();
          //   console.log('onDragEnter', e.target);
          // }}
        >
          {configComponentList.map((item) => (
            <div
              className={`${s.operateComponent} `}
              // style={{ top: `${topList[item.name]}px` }}
              key={item.name}
              data-index={item.name}
              draggable={true}
            >
              <HolderOutlined style={{ marginRight: '6px' }} />
              <div className={s.text}>{`${item.chineseName} - ${item.name.slice(0, 5)}`}</div>
              <DeleteOutlined
                className={s.deleteIcon}
                onClick={() => {
                  setDeleteComponentModalId(item.name);
                }}
              />
            </div>
          ))}
        </div>
      )
    }
  ];

  const setBorderDebounce = _.debounce((deomoTriangleBorder) => {
    setDeomoTriangleBorder(deomoTriangleBorder);
  }, 100);

  // 删除单元块内组件
  const onCancelDeleteComponent = () => {
    setDeleteComponentModalId('');
    componentSelectedList.length && setComponentSelectedList([]);
  };
  const confirmDeleteComponent = () => {
    delete tableConfig[curConfigTableItemName].children[deleteComponentModalId];
    setTableConfig({ ...tableConfig });
    setDeleteComponentModalId('');
    setCurConfigComponentName('');
    message.success('组件删除成功！');
  };

  const resetTableItemConfig = (curConfigTableItem: tableItemType) => {
    setPosition(null);
    setDeomoTriangleBorder({
      borderRightStyle: curConfigTableItem.cssVariates.borderRightStyle,
      borderRightColor: curConfigTableItem.cssVariates.borderRightColor || '',
      borderTopStyle: curConfigTableItem.cssVariates.borderTopStyle,
      borderTopColor: curConfigTableItem.cssVariates.borderTopColor || '',
      borderBottomStyle: curConfigTableItem.cssVariates.borderBottomStyle,
      borderBottomColor: curConfigTableItem.cssVariates.borderBottomColor || '',
      borderLeftStyle: curConfigTableItem.cssVariates.borderLeftStyle,
      borderLeftColor: curConfigTableItem.cssVariates.borderLeftColor || ''
    });
  };

  // 1、初始化
  // 2、监听单元块、组件切换
  useEffect(() => {
    const curConfigTableItem = tableConfig[curConfigTableItemName];
    if (!curConfigTableItem) return;
    if (isInit.current) {
      // 初始化
      if (!curConfigTableItem) return;
      const component: any = {};
      if (curConfigComponentName) {
        component[curConfigComponentName] = {};
        Object.keys(curConfigTableComponentItem.props).forEach((name) => {
          component[curConfigComponentName][name] = curConfigTableComponentItem.props[name].value;
        });
      }
      form.setFieldsValue({
        ...curConfigTableItem,
        component
      });
      resetTableItemConfig(curConfigTableItem);
      isInit.current = false;
    } else {
      // 监听单元块、组件切换
      const component: any = {};
      if (curConfigComponentName && prevName.current !== curConfigComponentName) {
        // 组件切换场景
        prevName.current = curConfigComponentName;
        component[curConfigComponentName] = {};
        Object.keys(curConfigTableComponentItem.props).forEach((name) => {
          component[curConfigComponentName][name] = curConfigTableComponentItem.props[name].value;
        });
        form.setFieldsValue({ component });
      } else if (prevName.current !== curConfigTableItemName) {
        // 单元块切换场景
        resetTableItemConfig(curConfigTableItem);
        form.setFieldsValue(curConfigTableItem);
      }
    }
  }, [curConfigTableItemName, curConfigComponentName]);

  // console.log('configComponentList', configComponentList);

  // console.log('tableConfig', tableConfig);

  // 监听组件配置
  useEffect(() => {
    if (curConfigComponentName) return;
    const curConfigTableItem = tableConfig[curConfigTableItemName];
    const curChildren = Object.keys(curConfigTableItem.children);
    if (!configComponentList.length || curChildren.length !== configComponentList.length) {
      const newTopList: Record<string, number> = {};
      setConfigComponentList(
        curChildren.map((name, index) => {
          newTopList[name] = index * 50;
          return {
            name: curConfigTableItem.children[name].id,
            chineseName: curConfigTableItem.children[name].chineseName
          };
        })
      );
    } else {
      // 判断其中内容是否有变动，正常情况下是不会存在改变
      const isSame = configComponentList.every((item) => curChildren.includes(item.name));
      if (!isSame) {
        const newTopList: Record<string, number> = {};
        setConfigComponentList(
          curChildren.map((name, index) => {
            newTopList[name] = index * 50;
            return {
              name: curConfigTableItem.children[name].id,
              chineseName: curConfigTableItem.children[name].chineseName
            };
          })
        );
        // setTopList(newTopList);
      }
    }
  }, [tableConfig, configComponentList, curConfigComponentName]);

  return (
    <>
      <div className={s.titleContainer}>
        <div className={s.title}>配置</div>
        <div className={s.subTitle}>{curConfigTableItemName} 单元格</div>
        {!!curConfigComponentName && (
          <div className={s.subTitle}>
            <Tooltip
              title={
                curConfigTableComponentItem.chineseName +
                ' - ' +
                curConfigTableComponentItem.id.slice(0, 5)
              }
            >
              <div className={s.label2}>
                {curConfigTableComponentItem.chineseName +
                  ' - ' +
                  curConfigTableComponentItem.id.slice(0, 5)}
              </div>
            </Tooltip>
            <DeleteOutlined
              className={s.icon}
              onClick={(e) => {
                deleteComponent(e, curConfigTableComponentItem.id);
              }}
            />
          </div>
        )}
      </div>
      <Form
        form={form}
        labelAlign="left"
        labelCol={{ span: 10 }}
        onValuesChange={_.debounce((changedValues: any, values: any) => {
          let tableItem = tableConfig[curConfigTableItemName];
          // 组件的特殊处理
          if (changedValues.component) {
            const name1List = Object.keys(changedValues.component);
            const name1 = name1List[0];
            const name2List = Object.keys(changedValues.component[name1]);
            const name2 = name2List[0];
            tableItem.children[name1].props[name2].value = changedValues.component[name1][name2];
          } else {
            tableItem = { ...tableItem, ...values };
          }
          if (changedValues.flexConfig) {
            if (typeof changedValues.flexConfig.flexVerticalEqual === 'boolean') {
              setIsVerticalEqual(changedValues.flexConfig.flexVerticalEqual);
            }
            if (typeof changedValues.flexConfig.flexParalleEqual === 'boolean') {
              setIsParallelEqual(changedValues.flexConfig.flexParalleEqual);
            }
          }

          tableConfig[curConfigTableItemName] = tableItem;
          setTableConfig({ ...tableConfig });
        }, 200)}
      >
        {!!curConfigComponentName ? (
          <>
            <div data-type={DomTypeEnum.COMPONENTCONFIGITEM}>
              {Object.keys(curConfigTableComponentItem.props).map((name2) => {
                const item2 = curConfigTableComponentItem.props[name2];
                switch (item2.type) {
                  case InquireType.INPUT: {
                    return (
                      <Form.Item
                        key={name2}
                        label={item2.label}
                        name={['component', curConfigComponentName, name2]}
                        initialValue={item2.value}
                        normalize={(e) => {
                          if (item2.normalize) {
                            return item2.normalize(e);
                          }
                          return e;
                        }}
                        getValueProps={(e) => {
                          if (item2.getValueProps) {
                            return item2.getValueProps(e);
                          }
                          return { value: e };
                        }}
                        tooltip={item2.tooltip}
                      >
                        <Input {...item2.prop}></Input>
                      </Form.Item>
                    );
                  }
                  case InquireType.INPUTNUMBER: {
                    return (
                      <Form.Item
                        key={name2}
                        label={item2.label}
                        name={['component', curConfigComponentName, name2]}
                        initialValue={item2.value}
                        normalize={(e) => {
                          if (item2.normalize) {
                            return item2.normalize(e);
                          }
                          return e;
                        }}
                        getValueProps={(e) => {
                          if (item2.getValueProps) {
                            return item2.getValueProps(e);
                          }
                          return { value: e };
                        }}
                        tooltip={item2.tooltip}
                      >
                        <InputNumber {...item2.prop}></InputNumber>
                      </Form.Item>
                    );
                  }
                  case InquireType.COLORPICKER: {
                    return (
                      <Form.Item
                        key={name2}
                        label={item2.label}
                        name={['component', curConfigComponentName, name2]}
                        normalize={(e) => {
                          if (item2.normalize) {
                            return item2.normalize(e);
                          }
                          return e.toCssString();
                        }}
                        getValueProps={(e) => {
                          if (item2.getValueProps) {
                            return item2.getValueProps(e);
                          }
                          return { value: e };
                        }}
                        tooltip={item2.tooltip}
                      >
                        <ColorPicker showText {...item2.prop}></ColorPicker>
                      </Form.Item>
                    );
                  }
                  case InquireType.SEGMENTED: {
                    return (
                      <Form.Item
                        key={name2}
                        label={item2.label}
                        name={['component', curConfigComponentName, name2]}
                        normalize={(e) => {
                          if (item2.normalize) {
                            return item2.normalize(e);
                          }
                          return e;
                        }}
                        getValueProps={(e) => {
                          if (item2.getValueProps) {
                            return item2.getValueProps(e);
                          }
                          return { value: e };
                        }}
                        tooltip={item2.tooltip}
                      >
                        <Segmented<string> options={[]} {...item2.prop} />
                      </Form.Item>
                    );
                  }
                  case InquireType.SINGLECHECKBOX: {
                    return (
                      <Form.Item
                        key={name2}
                        label={item2.label}
                        name={['component', curConfigComponentName, name2]}
                        valuePropName="checked"
                        normalize={(e) => {
                          if (item2.normalize) {
                            return item2.normalize(e);
                          }
                          return e;
                        }}
                        getValueProps={(e) => {
                          if (item2.getValueProps) {
                            return item2.getValueProps(e);
                          }
                          return { checked: e };
                        }}
                        tooltip={item2.tooltip}
                      >
                        <Checkbox {...item2.prop} />
                      </Form.Item>
                    );
                  }
                  case InquireType.SLIDER: {
                    return (
                      <Form.Item
                        key={name2}
                        label={item2.label}
                        name={['component', curConfigComponentName, name2]}
                        normalize={(e) => {
                          if (item2.normalize) return item2.normalize(e);
                          return e;
                        }}
                        getValueProps={(e) => {
                          if (item2.getValueProps) return item2.getValueProps(e);
                          return { value: e };
                        }}
                        tooltip={item2.tooltip}
                      >
                        <Slider {...item2.prop} />
                      </Form.Item>
                    );
                  }
                  case InquireType.TEXTAREA: {
                    return (
                      <Form.Item
                        key={name2}
                        label={item2.label}
                        name={['component', curConfigComponentName, name2]}
                        normalize={(e) => {
                          if (item2.normalize) return item2.normalize(e);
                          return e;
                        }}
                        getValueProps={(e) => {
                          if (item2.getValueProps) return item2.getValueProps(e);
                          return { value: e };
                        }}
                        tooltip={item2.tooltip}
                      >
                        <Input.TextArea {...item2.prop} />
                      </Form.Item>
                    );
                  }
                  case InquireType.DYNAMICSELECT: {
                    return (
                      <Form.Item
                        key={name2}
                        label={item2.label}
                        name={['component', curConfigComponentName, name2]}
                        normalize={(e) => {
                          if (item2.normalize) return item2.normalize(e);
                          return e;
                        }}
                        getValueProps={(e) => {
                          if (item2.getValueProps) return item2.getValueProps(e);
                          return { value: e };
                        }}
                        tooltip={item2.tooltip}
                      >
                        <Select mode="tags" tokenSeparators={[',']} />
                      </Form.Item>
                    );
                  }
                }
              })}
            </div>
          </>
        ) : (
          <>
            <Collapse items={itemsBorder} size="small" style={{ margin: '3px 0 15px' }}></Collapse>
            <Form.Item
              label="背景颜色"
              name={['style', 'backgroundColor']}
              normalize={(e) => e.toCssString()}
            >
              <ColorPicker showText />
            </Form.Item>
            <div style={{ fontSize: '14px', marginBottom: '10px' }}>布局模式：</div>
            <Form.Item name="layoutMode" style={{ paddingLeft: '17px' }}>
              <Segmented<string>
                options={[
                  { label: LayoutStringEnum.FLEX, value: LayoutEnum.FLEX },
                  { label: LayoutStringEnum.CUSTOM, value: LayoutEnum.CUSTOM, disabled: true }
                ]}
              />
            </Form.Item>
            <Form.Item name={['flexConfig', 'direction']} label="排列方向">
              <Segmented<string>
                options={[
                  {
                    label: FlexDirectionStringEnum.PARALLEL,
                    value: FlexDirectionEnum.PARALLEL
                  },
                  {
                    label: FlexDirectionStringEnum.VERTICAL,
                    value: FlexDirectionEnum.VERTICAL
                  }
                ]}
              />
            </Form.Item>
            <Form.Item
              name={['flexConfig', 'isWrap']}
              label="是否换行"
              tooltip="换行可能直接影响平均分效果，垂直排列换行无效"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label="水平平均分"
              name={['flexConfig', 'flexParalleEqual']}
              tooltip="与水平对齐互斥，开启后无法修改水平对齐配置"
            >
              <Switch />
            </Form.Item>
            <Form.Item name={['flexConfig', 'flexParallelAlign']} label="水平对齐">
              <Segmented<string>
                options={[
                  { label: FlexAlignStringEnum.LEFT, value: FlexAlignEnum.LEFT },
                  { label: FlexAlignStringEnum.MID, value: FlexAlignEnum.MID },
                  { label: FlexAlignStringEnum.RIGHT, value: FlexAlignEnum.RIGHT }
                ]}
                disabled={isParallelEqual}
              />
            </Form.Item>
            <Form.Item
              label="垂直平均分"
              name={['flexConfig', 'flexVerticalEqual']}
              tooltip="与垂直对齐互斥，开启后无法修改垂直对齐配置"
            >
              <Switch />
            </Form.Item>
            <Form.Item name={['flexConfig', 'flexVerticalAlign']} label="行垂直对齐">
              <Segmented<string>
                options={[
                  { label: FlexAlignStringEnum.TOP, value: FlexAlignEnum.TOP },
                  { label: FlexAlignStringEnum.MID, value: FlexAlignEnum.MID },
                  { label: FlexAlignStringEnum.BOTTOM, value: FlexAlignEnum.BOTTOM }
                ]}
                disabled={isVerticalEqual}
              />
            </Form.Item>
            <Collapse
              items={itemsComponent}
              size="small"
              style={{ margin: '3px 0 15px' }}
            ></Collapse>
          </>
        )}
      </Form>
      <Modal
        title="删除确认"
        width={350}
        open={!!deleteComponentModalId}
        onCancel={onCancelDeleteComponent}
        onOk={confirmDeleteComponent}
      >
        <div>删除当前单元块内的组件，单元块内样式可能会出现不可预料的改变！</div>
      </Modal>
    </>
  );
});

export default ConfigContent;
