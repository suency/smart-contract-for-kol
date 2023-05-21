import { FileOutlined, PieChartOutlined, UserOutlined, DesktopOutlined, TeamOutlined } from '@ant-design/icons';
import { Layout, Menu, theme ,Button, Form, Input, InputNumber} from 'antd';
import { useEffect, useState } from 'react';
const { Header, Content, Footer, Sider } = Layout;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];
const onFinish = () => {

}
const Mvp = () => {
  useEffect(()=>{
    
  },[])
  return (
    <div><Form
    {...layout}
    name="nest-messages"
    onFinish={onFinish}
    style={{
      maxWidth: 600,
    }}
  >
    <Form.Item
      name={['user', 'address']}
      label="Kol address"
    >
      <Input />
    </Form.Item>

    <Form.Item
      name={['user', 'percentage']}
      label="Percentage"
      rules={[
        {
          type: 'number',
          min: 0,
          max: 100,
        },
      ]}
    >
      <InputNumber />
    </Form.Item>
    <Form.Item
      wrapperCol={{
        ...layout.wrapperCol,
        offset: 8,
      }}
    >
      <Button type="primary" htmlType="submit">
        Deploy Smart Contract
      </Button>
      <Button type="primary" style={{marginLeft:"20px"}}>
        Generate Link
      </Button>
    </Form.Item>
  </Form></div>
  )
}

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" style={{color:"white",textAlign:"center"}}>
          <h2>MVP Test</h2>
        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Mvp/>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Genggeng ©2023 Created by React.js
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;