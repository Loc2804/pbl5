import React from 'react';
import { createRoot } from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.scss';

import App from './containers/App';
import * as serviceWorker from './serviceWorker';
import IntlProviderWrapper from "./hoc/IntlProviderWrapper";

import { Provider } from 'react-redux';
import reduxStore, { persistor } from './redux';


const container = document.getElementById('root');
const root = createRoot(container);

const renderApp = () => {
    root.render(
        <React.StrictMode>
            <Provider store={reduxStore}>
                <IntlProviderWrapper>
                    <App persistor={persistor}/>
                </IntlProviderWrapper>
            </Provider>
        </React.StrictMode>
    );
};

renderApp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
