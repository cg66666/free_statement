/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-11-14 14:10:19
 * @LastEditors: cg
 * @LastEditTime: 2025-01-07 14:38:35
 */
// components/Home.js
import { useEffect, useMemo, useRef, useState } from 'react';
import { Tour, type TourProps, message } from 'antd';
import { CloseCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { post } from '@/ajax';
import {
  type tableItemConfigType,
  useTableConfig,
  tableModeEnum,
  useComponentDrag,
  DomTypeEnum,
  useLoginStore
} from '@/store';
import _ from 'lodash';
import Header from './components/Header';
import Content from './components/Content';
import Bottom from './components/Bottom';
import LeftMenu from './components/LeftMenu';
import RightConfig from './components/RightConfig';
import { nanoid } from 'nanoid';
import s from './index.module.scss';

// 当前dom元素类型
// export enum DomTypeEnum {
//   // 画板最外层轮廓
//   ISOUTLINE = '1',
//   // 渲染的单元格
//   ISINSTANCE = '2',
//   // 渲染的组件
//   ISCOMPONENT = '3',
//   // 右侧操作的单元块
//   CELLITEM = '4',
//   // 右侧操作的单元块中的组件
//   COMPONENTCONFIGITEM = '5'
// }

const Home: React.FC = () => {
  const {
    tableMode,
    tableConfig,
    setTableConfig,
    tableItemSelectedList,
    setTableItemSelectedList,
    templateConfig,
    setTemplateConfig
  } = useTableConfig();

  const { userName, checkLogin, toLogin, toLogOut, config } = useLoginStore();

  const { draggingDomConfig, setDraggingDomConfig } = useComponentDrag();

  // 漫游式引导
  const [open, setOpen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);

  const saveTable = async () => {
    setIsLoading(true);

    const res = await post('/statement/saveTable', {
      config: { tableConfig, templateConfig }
    });
    if (res.successful) {
      message.success('保存成功！');
    }
    setIsLoading(false);
  };

  const containerMouseMove = _.throttle((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (draggingDomConfig) {
      document.body.style.cursor = 'grabbing'; // 改变鼠标图标
      setDraggingDomConfig(
        _.cloneDeep({
          ...draggingDomConfig,
          clientX: e.clientX - draggingDomConfig.innerX,
          clientY: e.clientY - draggingDomConfig.innerY
        })
      );
    }
    const dom = e.target as HTMLElement;
    // 右侧单元块选中判断
    if (tableMode === tableModeEnum.INIT) {
      if (dom.id && dom.dataset.type === DomTypeEnum.CELLITEM) {
        if (tableItemSelectedList.includes(dom.id)) return;
        if (tableConfig[dom.id]) {
          setTableItemSelectedList([dom.id]);
        }
      } else {
        if (
          tableItemSelectedList.length &&
          tableConfig[tableItemSelectedList[0]] &&
          !tableConfig[tableItemSelectedList[0]].isFreezed
        ) {
          setTableItemSelectedList([]);
          // prevId.current = '';
          // setTableConfig({ ...tableConfig });
        }
      }
    } else {
      // console.log('dom', dom)
      // if (dom.dataset.type === DomTypeEnum.COMPONENTCONFIGITEM) {
      // }
    }
  }, 100);

  const containerMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 用于清空组件库的拖拽事件
    if (draggingDomConfig) {
      document.body.style.cursor = ''; // 恢复默认鼠标图标
      setDraggingDomConfig(null);
    }

    // 拖拽功能处理
    if (draggingDomConfig) {
      const elements = document.elementsFromPoint(e.clientX, e.clientY) as HTMLElement[];
      let instanceDom: HTMLElement | undefined;
      elements.forEach(function (element) {
        if (element.dataset.type && element.dataset.type === DomTypeEnum.ISINSTANCE) {
          instanceDom = element;
        }
      });
      if (instanceDom) {
        const tableItem = tableConfig[instanceDom.dataset.id || ''];
        // console.log('tableItem', tableItem)
        const { chineseName, name, renderDom, props } = draggingDomConfig;
        const id = nanoid();
        tableItem.children[id] = {
          chineseName,
          name,
          pid: instanceDom.dataset.id || '',
          renderDom,
          id,
          props
        };
        setTableConfig({ ...tableConfig });
        setDraggingDomConfig(null);
      }
    }
  };

  const steps = [
    {
      title: '模式选择',
      description: (
        <>
          1、模板编辑，为表单单元格构造，能够新建删除单元格。
          <br />
          2、页面编辑，为单元格内部组件构造，能够新建删除组件。
        </>
      ),
      target: () => document.getElementById('modeSelect')
    },
    {
      title: '组件库',
      description: '仅在页面编辑模式下可使用，可以直接拖拽到单元格中使用。',
      target: () => document.getElementById('components')
    },
    {
      title: '操作区',
      description: (
        <>
          1、模板编辑，可以直接查看当前所有单元块，并删除对应单元块。
          <br />
          2、页面编辑，可以配置当前单元块内部布局配置与内部详细组件配置。
        </>
      ),
      target: () => document.getElementById('rightContent')
    }
  ] as TourProps['steps'];

  // 关闭浏览器的默认缩放功能
  useEffect(() => {
    // 首次进入页面判断是否为登录
    checkLogin();

    const wheelFunc = (e: WheelEvent) => {
      // 检查是否按下了 Ctrl 键
      if (e.ctrlKey) {
        // 阻止浏览器的默认行为（通常是页面缩放）
        e.preventDefault();
      }
    };
    document.addEventListener('wheel', wheelFunc, { passive: false }); // passive 必须设为 false 才能阻止默认行为
    return () => {
      document.removeEventListener('wheel', wheelFunc);
    };
  }, []);

  // 首次进入页面开启漫游式导航
  useEffect(() => {
    const isEntered = localStorage.getItem('isEntered');
    if (isEntered) return;
    localStorage.setItem('isEntered', '111');
    setOpen(true);
  }, []);

  useEffect(() => {
    if (config && config.tableConfig && config.templateConfig) {
      setTableConfig(_.cloneDeep(config.tableConfig));
      setTemplateConfig(_.cloneDeep(config.templateConfig));
    }
  }, [config]);

  return (
    <div className={s.conatiner} onMouseMove={containerMouseMove} onMouseUp={containerMouseUp}>
      <div className={s.leftContent}>
        <div className={s.loginHeader}>
          <div className={s.userName}>{userName ? `用户名：${userName}` : ''}</div>
          <div style={{ display: 'flex' }}>
            {userName ? (
              <>
                <Button style={{ height: 30, marginRight: 10 }} onClick={toLogOut}>
                  退出登录
                </Button>
                <Button style={{ height: 30 }} loading={isLoading} onClick={saveTable}>
                  保存
                </Button>
              </>
            ) : (
              <>
                <Button style={{ height: 30 }} onClick={toLogin}>
                  登录
                </Button>
              </>
            )}
          </div>
        </div>
        <LeftMenu />
      </div>
      <div className={s.midContent}>
        <Header />
        <Content />
        <Bottom />
      </div>
      <div className={s.rightContent}>
        <RightConfig />
      </div>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
};

export default Home;
