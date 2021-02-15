import React from "react";
import { List } from "antd";
import { Link } from "react-router-dom";

const data = [
    { title: 'Home', path: '/' },
    { title: 'Camera', path: '/camera' },
    { title: 'Canvas', path: '/canvas' },
    { title: 'Screen sharing', path: '/screensharing' },
];

class Samples extends React.Component {
    render() {
        return <div>
            {/* Samples List */}
            <List
                header={<div>WebRTC示例</div>}
                footer={<div>Footer</div>}
                bordered
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <Link to={item['path']}>{item['title']}</Link>
                    </List.Item>
                )}
            />
        </div>
    }
}

export default Samples;