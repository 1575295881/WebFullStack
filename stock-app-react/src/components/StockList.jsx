import React, { memo } from 'react';
import styles from './StockList.module.css';

const StockList = ({ stockList, stockData, onDeleteStock, onAddStock}) => {
    const isAdd = stockData && stockList.includes(stockData.code);
    return (
        <div className={styles.container}>
            <h4 className={styles.title}>我的自选股</h4>
            {stockData && !isAdd && (
                <button
                    onClick={() => onAddStock(stockData.code)}
                    className={styles.addBtn}
                >
                    添加到自选股
                </button>
            )}
            { stockList.length === 0 ? (
                <p style={{color: '#999'}}>暂无自选股,查询股票后可添加</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, maxWidth: '400px'}}>
                    {stockList.map((code) => {
                        return (
                        <li
                            key={code}
                            className={styles.row}
                        >
                            <span>{code}</span>
                            <button
                                onClick={() => onDeleteStock(code)}
                                className={styles.deleteBtn}
                            >
                                删除
                            </button>
                        </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default memo(StockList);