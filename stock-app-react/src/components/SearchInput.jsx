import React from 'react';
import styles from './SearchInput.module.css';

const SearchInput =({ stockCode, loading, onCodeChange, onQuery}) => {
    return (
        <div className={styles.container}>
            <input
                value={stockCode}
                onChange={(e) => onCodeChange(e.target.value)}
                placeholder='请输入6位股票代码'
                disabled={loading}
                style={{
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    width: '200px',
                    marginRight: '10px'
                }}
            />
            <button 
                onClick={onQuery}
                disabled={loading || stockCode.length !== 6}
                className={styles.btn}
            >
                {loading ? '查询中...' : '查询股票'}
            </button>
        </div>
    );
};

export default SearchInput;