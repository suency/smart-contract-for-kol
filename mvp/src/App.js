import { FileOutlined, PieChartOutlined, UserOutlined, DesktopOutlined, TeamOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Button, Form, Input, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
// import solc from 'solc';
import axios from 'axios';
import Web3 from 'web3';
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
// compile code, should put it on server
/* async function compileContract(contractSourceCode) {

  const souceFileName = "TransferContract.sol";
  // source code
  const input = {
    language: 'Solidity',
    sources: {
      [souceFileName]: {
        content: contractSourceCode
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

  // compile
  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  // abi and bytecode
  const contractName = Object.keys(output.contracts[souceFileName])[0];
  const contractBytecode = output.contracts[souceFileName][contractName].evm.bytecode.object;
  const contractAbi = output.contracts[souceFileName][contractName].abi;

  return {
    contractBytecode,
    contractAbi
  };
} */
const Mvp = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  useEffect(() => {
    /* fetch("http://localhost:33333/api/compileContract").then(res=>{
      console.log(res.json())
    }) */
  }, []);

  async function compileInServer() {

    try {
      const response = await axios.get('http://localhost:33333/api/compileContract');
      const contractABI = response.data.contractABI;
      const contractBytecode = response.data.contractBytecode;

      const contract = new web3.eth.Contract(contractABI);
      
      const deployedContract = await contract.deploy({
        data: contractBytecode,
        arguments: [10] // constructor
      });
      
      await deployedContract.send({
        from: account,
        gas: 1192811
      });
     // const contractAddress = deployedContract.options.address;
      console.log('contract address:', "ok");
    } catch (error) {
      console.error(error);
    }

  }
  //https://tp-statics.tokenpocket.pro/chains.json
  const getNetworkInfo = async () => {

    const provider = web3.currentProvider;
    const web3WithProvider = new Web3(provider);
    web3WithProvider.eth.net.getId()
      .then(networkId => {
        console.log('Network Name:', networkId);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  // connect wallet, any network is OK
  const connectWallet = () => {
    if (typeof window.ethereum !== 'undefined') {
      // Enable Web3 and retrieve the selected account
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        setAccount(accounts[0]);
      });
    }
  }

  // get current wallet balance
  const fetchBalance = async () => {
    if (web3 && account) {
      // Get the account balance
      const balanceWei = await web3.eth.getBalance(account);
      const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
      setBalance(balanceEth);
    }
  };

  return (
    <div><Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish}
      style={{
        maxWidth: 900,
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
          Deploy
        </Button>
        <Button type="primary" style={{ marginLeft: "10px" }} onClick={connectWallet}>
          Connect Wallet
        </Button>
        <Button type="primary" style={{ marginLeft: "10px" }} onClick={fetchBalance}>
          Show Balance
        </Button>
        <Button type="primary" style={{ marginLeft: "10px" }} onClick={getNetworkInfo}>
          GetInfo
        </Button>
        <Button type="primary" style={{ marginLeft: "10px" }} onClick={compileInServer}>
          Compile
        </Button>
        <h2>Account Balance: {balance} Matic</h2>
        <h2>{account}</h2>
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
        <div className="demo-logo-vertical" style={{ color: "white", textAlign: "center" }}>
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
            <Mvp />
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