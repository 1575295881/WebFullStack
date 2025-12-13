import React, {useState, useCallback, useRef, useEffect} from 'react';
import SearchInput from './components/SearchInput';
import LoadingTip from './components/LoadingTip';
import StockResult from './components/StockResult';
import StockList from './components/StockList';
import { useDebounce } from './hooks/useDebounce';

const StockSearch = () => {
    const [stockCode, setStockCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [stockData, setStockData] = useState(null);
    const [stockList, setStockList] = useState([]);

    const isQueryingRef = useRef(false);
    const abortControllerRef = useRef(null);
    const [ debounceQuery, cancelDebounce] = useDebounce(() => {
        if (stockCode.length === 6) {
            queryStock();
        }
    }, 500);

    useEffect(() => {
        debounceQuery()
        return () => cancelDebounce();
    }, [stockCode, debounceQuery, cancelDebounce]);

    useEffect(() => {
        const savedList = localStorage.getItem('stockList');
        if (savedList) {
            setStockList(JSON.parse(savedList));
        }
    }, []);

    const queryStock = useCallback(async () => {
        if (isQueryingRef.current) return;
        isQueryingRef.current = true;
        setLoading(true);

        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        try {
            const res = await fetch(`https://qt.gtimg.cn/q=sh${stockCode}`, { signal });
            if (!res.ok) throw new Error('接口请求失败');

            const buffer = await res.arrayBuffer();
            const decoder =  new TextDecoder('GBK');

            const text = decoder.decode(buffer);
            const match = text.match(/v_sh\d+="([^"]+)"/);
            if (!match) throw new Error('未查询到股票数据');

            const dataArr = match[1].split('~');
            const realData = {
                code: stockCode,
                name: dataArr[1],
                currentPrice: dataArr[3],
                openPrice: dataArr[2],
                change: (Number(dataArr[3]) - Number(dataArr[4])).toFixed(2),
                changeRate: ((Number(dataArr[3]) - Number(dataArr[4])) / Number(dataArr[4]) * 100).toFixed(2)
            };
            setStockData(realData);
        } catch(error) {
            if (error.name !== 'AbortError') {
                alert(`查询失败: ${error.message}`)
            }
        } finally {
            setLoading(false);
            isQueryingRef.current = false;
        }
    }, [stockCode]);

    const addStock = useCallback((code) => {
        const newList = [...stockList, code];
        setStockList(newList);
        localStorage.setItem(`stockList`, JSON.stringify(newList));
    }, [stockList]);

    const deleteStock = useCallback((code) => {
        const newList = stockList.filter(item => item !== code);
        setStockList(newList);
        localStorage.setItem('stockList', JSON.stringify(newList));
    }, [stockList]);

    return (
        <div style={{maxWidth: '600px', margin: '20px auto', padding: '0 20px'}}>
            <h2 style={{color: '#333', textAlign: 'center'}}>股票查询工具</h2>
            <SearchInput
                stockCode={stockCode}
                loading={loading}
                onCodeChange={setStockCode} 
                onQuery={queryStock}
            />
            <LoadingTip loading={loading}/>
            <StockResult stockData={stockData}/>
            <StockList
                stockList={stockList}
                stockData={stockData}
                onAddStock={addStock}
                onDeleteStock={deleteStock}
            />
        </div>
    );
};

export default StockSearch;