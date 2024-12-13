/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-11-18 14:29:44
 * @LastEditors: cg
 * @LastEditTime: 2024-12-13 15:12:32
 */
import Text from './Text';
import Input from './Input';
import ICheckBox from './ICheckBox';

export type defaultType = {
  ['data-id']: string;
  ['data-pid']: string;
  ['data-type']: string;
};

// 配置框组件类型枚举
export enum InquireType {
  INPUT, // 输入框
  SELECT, // 选择器
  INPUTNUMBER, // 数字输入框
  COLORPICKER, // 颜色选择器
  SEGMENTED, // 分段控制器
  SINGLECHECKBOX, // 单选框
  SLIDER, // 滑动输入条
  TEXTAREA, // 文本域
  DYNAMICSELECT // 动态选择器
}

// 组件类型名称枚举
export enum DefaultComponentNameEnum {
  TEXT = 'Text',
  INPUT = 'Input',
  ICHECKBOX = 'ICheckBox'
}

export type defaultComponentConfig = {
  chineseName: string;
  name: DefaultComponentNameEnum;
  renderDom: React.FC<any>;
  desc?: string;
  props: Record<
    string,
    {
      label: string;
      type: InquireType; // 输入组件类型
      name: string;
      isStyle: boolean; // 该内容是否写入style
      value: any;
      normalize?: (value: any) => any; // formItem上的功能
      getValueProps?: (value: any) => Record<string, any>; // formItem上的功能
      tooltip?: React.ReactNode;
      prop?: Record<string, any>; // 该属性对应的组件传参
    }
  >;
};

const defaultComponentList: defaultComponentConfig[] = [
  {
    chineseName: '文本标签',
    name: DefaultComponentNameEnum.TEXT,
    renderDom: Text,
    // desc:'',
    props: {
      text: {
        label: '标签内容',
        type: InquireType.TEXTAREA,
        name: 'text',
        isStyle: false,
        value: '文本标签'
      },
      width: {
        label: '宽度',
        type: InquireType.INPUTNUMBER,
        name: 'width',
        isStyle: true,
        // prop: { min: 90 },
        value: 110
      },
      height: {
        label: '高度',
        type: InquireType.INPUTNUMBER,
        name: 'height',
        isStyle: true,
        // prop: { min: 30 },
        value: 30
      },
      fontSize: {
        label: '字体大小',
        type: InquireType.INPUTNUMBER,
        name: 'fontSize',
        isStyle: true,
        prop: { min: 12 },
        value: 20
      },
      lineHeight: {
        label: '字体行高',
        type: InquireType.INPUTNUMBER,
        name: 'lineHeight',
        isStyle: true,
        normalize: (e) => e + 'px',
        getValueProps: (e) => {
          const regex = new RegExp(`[px]`, 'g');
          return {
            value: Number(e.replace(regex, ''))
          };
        },
        tooltip: '行高与高度、字体大小相互关联，请根据实际情况调整',
        prop: { min: 12 },
        value: '30px'
      },
      color: {
        label: '字体颜色',
        type: InquireType.COLORPICKER,
        name: 'color',
        isStyle: true,
        value: 'rgba(0,0,0,1)'
      },
      fontWeight: {
        label: '字体粗细',
        type: InquireType.SEGMENTED,
        name: 'fontWeight',
        isStyle: true,
        prop: {
          options: [
            {
              label: '细',
              value: 'lighter'
            },
            {
              label: '常规',
              value: 'normal'
            },
            {
              label: '粗',
              value: 'bold'
            }
          ]
        },
        tooltip: '字体小时，效果会不明显',
        value: 'normal'
      },
      justifyContent: {
        label: '水平位置',
        type: InquireType.SEGMENTED,
        name: 'justifyContent',
        isStyle: true,
        prop: {
          options: [
            {
              label: '左',
              value: 'flex-start'
            },
            {
              label: '中',
              value: 'center'
            },
            {
              label: '右',
              value: 'flex-end'
            }
          ]
        },
        value: 'flex-start'
      },
      alignItems: {
        label: '垂直位置',
        type: InquireType.SEGMENTED,
        name: 'alignItems',
        isStyle: true,
        prop: {
          options: [
            {
              label: '上',
              value: 'flex-start'
            },
            {
              label: '中',
              value: 'center'
            },
            {
              label: '下',
              value: 'flex-end'
            }
          ]
        },
        value: 'flex-start'
      }
    }
  },
  {
    chineseName: '输入框',
    name: DefaultComponentNameEnum.INPUT,
    renderDom: Input,
    props: {
      label: {
        label: '标签',
        type: InquireType.INPUT,
        name: 'label',
        isStyle: false,
        value: '标签:'
      },
      leftRatio: {
        label: '标签宽度占比',
        type: InquireType.SLIDER,
        name: 'leftRatio',
        isStyle: false,
        value: 30
      },
      defaultValue: {
        label: '默认值',
        type: InquireType.INPUT,
        name: 'defaultValue',
        isStyle: false,
        value: ''
      },
      placeholder: {
        label: '提示语',
        type: InquireType.INPUT,
        name: 'placeholder',
        isStyle: false,
        value: '请输入内容'
      },
      width: {
        label: '宽度',
        type: InquireType.INPUTNUMBER,
        name: 'width',
        isStyle: true,
        // prop: { min: 90 },
        value: 200
      },
      height: {
        label: '高度',
        type: InquireType.INPUTNUMBER,
        name: 'height',
        isStyle: true,
        value: 30
      },
      fontSize: {
        label: '字体大小',
        type: InquireType.INPUTNUMBER,
        name: 'fontSize',
        isStyle: true,
        prop: { min: 12 },
        value: 20
      },
      fontWeight: {
        label: '字体粗细',
        type: InquireType.SEGMENTED,
        name: 'fontWeight',
        isStyle: true,
        prop: {
          options: [
            {
              label: '细',
              value: 'lighter'
            },
            {
              label: '常规',
              value: 'normal'
            },
            {
              label: '粗',
              value: 'bold'
            }
          ]
        },
        tooltip: '字体小时，效果会不明显',
        value: 'normal'
      },
      color: {
        label: '字体颜色',
        type: InquireType.COLORPICKER,
        name: 'color',
        isStyle: true,
        value: 'rgba(0,0,0,1)'
      },
      showUndeLine: {
        label: '展示下划线',
        type: InquireType.SINGLECHECKBOX,
        name: 'showUndeLine',
        isStyle: false,
        value: true
      }
    }
  },
  {
    chineseName: '多选框',
    name: DefaultComponentNameEnum.ICHECKBOX,
    renderDom: ICheckBox,
    props: {
      width: {
        label: '宽度',
        type: InquireType.INPUTNUMBER,
        name: 'width',
        isStyle: true,
        // prop: { min: 90 },
        value: 200
      },
      leftRatio: {
        label: '标签宽度占比',
        type: InquireType.SLIDER,
        name: 'leftRatio',
        isStyle: false,
        value: 30
      },
      height: {
        label: '高度',
        type: InquireType.INPUTNUMBER,
        name: 'height',
        isStyle: true,
        value: 60
      },
      fontSize: {
        label: '字体大小',
        type: InquireType.INPUTNUMBER,
        name: 'fontSizeVariate',
        isStyle: false,
        prop: { min: 12 },
        value: 15
      },
      label: {
        label: '标签',
        type: InquireType.INPUT,
        name: 'label',
        isStyle: false,
        value: '标签:'
      },
      plainOptions: {
        label: '多选框内容',
        type: InquireType.DYNAMICSELECT,
        name: 'plainOptions',
        isStyle: false,
        value: [],
        tooltip: '回车，逗号可以直接创建多选项'
      }
    }
  }
];

// export type defaultComponentNameList = keyof typeof defaultComponentList

export default defaultComponentList;
