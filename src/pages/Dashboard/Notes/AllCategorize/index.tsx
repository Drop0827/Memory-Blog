import './index.sass'
import {
    Button, ColorPicker,
    Form,
    Input,
    Modal,
    Space,
    Table,
    TableProps,
    Tag,
    theme,
} from "antd";
import React, {useState} from "react";
import {FolderOpenOutlined} from '@ant-design/icons';

interface CategorieType {
    key: string;
    categorie_title: string;
    introduce: string;
    icon: string;
    note_count: number;
    color: string;
}

const CategoriesData = [
    {
        key: '1',
        categorie_title: '技术',
        introduce: '关于编程、开发、技术趋势等的博客文章',
        icon: 'icon-code1',
        note_count: 2,
        color: '#3498db',
    },
    {
        key: '2',
        categorie_title: '设计',
        introduce: '设计原理、用户界面设计、用户体验等方面的博客文章',
        icon: 'icon-sheji1',
        note_count: 10,
        color: '#2ecc71',
    },
    {
        key: '3',
        categorie_title: '生活',
        introduce: '个人生活、日常琐事、旅行日记等的博客文章',
        icon: 'icon-icon',
        note_count: 12,
        color: '#e74c3c',
    },
    {
        key: '4',
        categorie_title: '健康',
        introduce: '健康生活、运动、饮食等方面的博客文章',
        icon: 'icon-jiankang',
        note_count: 21,
        color: '#f39c12',
    },
    {
        key: '5',
        categorie_title: '文学',
        introduce: '文学创作、书评、阅读感想等的博客文章',
        icon: 'icon-wenxue2',
        note_count: 7,
        color: '#9b59b6',
    },
    {
        key: '6',
        categorie_title: '学术',
        introduce: '学术研究、学科探讨等的博客文章',
        icon: 'icon-xueshuquan',
        note_count: 19,
        color: '#34495e',
    },
    {
        key: '7',
        categorie_title: '音乐',
        introduce: '音乐欣赏、乐器演奏、音乐创作等的博客文章',
        icon: 'icon-yinle',
        note_count: 4,
        color: '#e67e22',
    }
];


const  AllCategorize = () => {
    const { token } = theme.useToken();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const columns: TableProps<CategorieType>['columns'] = [
        {
          title: '序列',
          dataIndex: 'key',
          key: 'key',
          align: "center"
        },
        {
            title: '分类名称',
            dataIndex: 'categorie_title',
            key: 'key',
            align: "center",
        },
        {
            title: '分类介绍',
            dataIndex: 'introduce',
            key: 'title',
            align: "center"
        },
        {
            title: '分类图标',
            dataIndex: 'icon',
            key: 'key',
            align: "center",
            render: (icon) => <i className={`iconfont ${icon} icon`}></i>
        },
        {
            title: '文章数量',
            key: 'key',
            dataIndex: 'note_count',
            align: "center",
        },
        {
            title: '颜色',
            key: 'key',
            dataIndex: 'color',
            align: "center",
            render: (color) => <Tag color={color}>{color}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            align: "center",
            render: (_, ) => (
                <Space size="middle">
                    <Button type='primary'>编辑</Button>
                    <Button type='primary' style={{background: '#f5222d'}}>删除</Button>
                </Space>
            ),
        },
    ];
    const listStyle: React.CSSProperties = {
        lineHeight: '200px',
        textAlign: 'center',
        background: 'white',
        borderRadius: token.borderRadiusLG,
        marginTop: 30,
        maxWidth: '98%',
        height: '75vh',
        marginLeft: '1%',
        overflowY: 'hidden'
    };
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };

    //表单选中
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    //添加框打开
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    return <>
        <div style={listStyle} className="searchRes">
            <Table columns={columns} dataSource={CategoriesData} pagination={{pageSize: 6}}
                   title={() => <>
                           <div style={{float: 'left'}}>
                               <Button type="primary" style={{ background: '#389e0d'}} onClick={showModal}>
                                   新增
                               </Button>
                               <Button type="primary" style={{ marginLeft: 10,background: '#f5222d'}}>
                                   批量删除
                               </Button>
                               <span style={{ marginLeft: 8 }}>
                {hasSelected ? `选中 ${selectedRowKeys.length} 项` : ''}
        </span>
                           </div>
                       <h2 style={{marginRight: 150}}>
                           <FolderOpenOutlined /> 分类管理
                       </h2>
                   </>}
                   rowSelection={rowSelection}
            />
        </div>

        <Modal
            title="分类新增"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            okText='添加'
            cancelText='取消'
        >
            <Form {...formItemLayout} variant="filled" style={{ maxWidth: 600 }}>
                <Form.Item label="分类名称" name="categorie" >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="分类介绍"
                    name="introduce"
                    rules={[{ required: true, message: 'Please input!' }]}
                >
                    <Input.TextArea autoSize={{ minRows: 4, maxRows: 8 }}/>
                </Form.Item>

                <Form.Item label="分类图标" name="categorie_icon"
                           rules={[{ required: true, message: 'Please input!' }]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item label="颜色" name="categorie_color" >
                    <ColorPicker defaultValue="#fff" showText />
                </Form.Item>
            </Form>
        </Modal>
    </>
}
export default  AllCategorize