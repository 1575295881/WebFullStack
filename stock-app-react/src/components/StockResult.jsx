import React from 'react';
import styles from './StockResult.module.css';

const StockResult = ({ stockData }) => {
    if (!stockData) return null;
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>{stockData.name}({stockData.code})</h3>
            <div className={styles.info}>
                <p>当前价格:<span style={{color: stockData.change > 0 ? 'red' : 'green'}}>{stockData.currentPrice}</span></p>
                <p>开盘价: {stockData.openPrice}</p>
                <p>涨跌幅: {stockData.changeRate}%</p>
            </div>
        </div>
    );
};

export default StockResult;