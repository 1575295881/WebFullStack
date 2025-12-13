import React from 'react';
import styles from './LoadingTip.module.css'
const LoadingTip = ({ loading }) => {
    if (!loading) return null;
    return (
        <div className={styles.tip}>
            正在查询股票数据,请稍等...
        </div>
    );
};
export default LoadingTip;