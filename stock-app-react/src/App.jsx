import React, {useState, useCallback, useRef, useEffect} from 'react';
import SearchInput from './components/SearchInput';
import LoadingTip from './components/LoadingTip';
import StockResult from './components/StockResult';
import StockList from './components/StockList';
import ErrorBoundary from './components/ErrorBoundary';
import { useRequest } from './hooks/useRequestHook';

const StockSearch = () => {
    const [stockCode, setStockCode] = useState('');
    const [stockData, setStockData] = useState(null);
    const [stockList, setStockList] = useState([]);

    const fetchStock = async({signal}) => {
        const res = await fetch(`https://qt.gtimg.cn/q=sh${stockCode}`, {signal});
        if (!res.ok) throw new Error('接口请求失败');
        const buffer = await res.arrayBuffer();
        const decoder = new TextDecoder('GBK');
        const text = decoder.decode(buffer);
        const match = text.match(/v_sh\d+="([^"]+)"/);
        if (!match) throw new Error('未查询到股票数据');
        const dataArr = match[1].split('~');

        const currentPrice = Number(dataArr[3]) || 0;
        const openPrice = Number(dataArr[2]) || 0;
        const preClosePrice = Number(dataArr[4]) || 0;
        return {
            code: stockCode,
            name: dataArr[1] || '未知股票',
            currentPrice: currentPrice.toFixed(2),
            openPrice: openPrice.toFixed(2),
            change: (currentPrice - preClosePrice).toFixed(2),
            changeRate: preClosePrice !== 0 ? ((currentPrice - preClosePrice) / preClosePrice * 100).toFixed(2)
                : '0.0',
        };
    };
    const { debouncedRequest: queryStock, cancelRequest, isLoading } = useRequest(fetchStock, 500);

    useEffect(() => {
      let isMounted = true;
      const fetchData = async () => {
        if (stockCode.length === 6) {
          try {
            const result = await queryStock();
            if (isMounted && result) {
              setStockData(result);
            }
          } catch (error) {
            if (error.name !== "AbortError") {
              alert(`查询失败: ${error.message}`);
            }
          }
        }
      };
      fetchData();
      return () => {
        isMounted = false;
        cancelRequest();
      };
    }, [stockCode, queryStock, cancelRequest]);

    const addStock = useCallback((code) => {
        const newList = [...stockList, code];
        setStockList(newList);
        localStorage.setItem('stockList', JSON.stringify(newList));
    }, [stockList]);

    const deleteStock = useCallback((code) => {
        const newList = stockList.filter(item => item !== code);
        setStockList(newList);
        localStorage.setItem('stockList', JSON.stringify(newList));
    }, [stockList]);

    return (
      <ErrorBoundary>
        <div
          style={{ maxWidth: "600px", margin: "20px auto", padding: "0 20px" }}
        >
          <h2 style={{ color: "#333", textAlign: "center" }}>股票查询工具</h2>
          <SearchInput
            stockCode={stockCode}
            loading={isLoading}
            onCodeChange={setStockCode}
            onQuery={queryStock}
          />
          <LoadingTip loading={isLoading} />
          <StockResult stockData={stockData} />
          <StockList
            stockList={stockList}
            stockData={stockData}
            onAddStock={addStock}
            onDeleteStock={deleteStock}
          />
        </div>
      </ErrorBoundary>
    );
};

export default StockSearch;