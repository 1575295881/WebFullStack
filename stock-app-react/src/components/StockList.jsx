import React from 'react';
const StockList = ({ stockList, stockData, onDeleteStock, onAddStock}) => {
    const isAdd = stockData && stockList.includes(stockData.code);
    return (
        <div style={{marginTop: '20px'}}>
            <h4 style={{color: '#333'}}>我的自选股</h4>
            {stockData && !isAdd && (
                <button
                    onClick={() => onAddStock(stockData.code)}
                    style={{
                        padding: '6px 12px',
                        backgroundColor: '#0088ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: '10px'
                    }}
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
                            style={{
                                padding: '8px',
                                borderBottom: '1px solid #eee',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <span>{code}</span>
                            <button
                                onClick={() => onDeleteStock(code)}
                                style={{
                                    color: '#ff444',
                                    border: '1px solid #ff444',
                                    borderRadius: '3px',
                                    background: 'none',
                                    cursor: 'pointer',
                                    padding: '2px 6px'
                                }}
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

export default StockList;