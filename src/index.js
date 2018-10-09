import React from 'react';
import ReactDOM from 'react-dom';
import RouteMap from './routers/index.js'
import { Provider } from "react-redux"
import Store from './store/store'

import 'moment/locale/zh-cn'
import 'ant-design-pro/dist/ant-design-pro.css';
import './style/reset.scss'
import "./style/common.scss"



ReactDOM.render(
    <Provider store={Store}>
        <RouteMap />
    </Provider>,
    document.getElementById('root'));
