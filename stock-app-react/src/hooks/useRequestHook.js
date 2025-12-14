// src/hooks/useRequestHook.js
import { useRef, useCallback } from 'react';

export const useRequest = (requestFn, delay = 500) => {
  // 1. 防重复请求：标记是否正在查询
  const isQueryingRef = useRef(false);
  // 2. 中断请求：保存AbortController实例
  const abortControllerRef = useRef(null);
  // 3. 防抖计时器：保存setTimeout的ID
  const debounceTimerRef = useRef(null);

  // 核心：防抖函数（延迟执行请求）
  const debouncedRequest = useCallback(async (...args) => {
    // 先清空上一次的防抖计时（重置延迟）
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    // 返回Promise，让调用方（useEffect）能await到结果
    return new Promise((resolve, reject) => {
      debounceTimerRef.current = setTimeout(async () => {
        // 防重复请求：如果正在查询，直接拒绝
        if (isQueryingRef.current) {
          reject(new Error('已有请求在处理中'));
          return;
        }

        try {
          // 中断上一次未完成的请求
          if (abortControllerRef.current) abortControllerRef.current.abort();
          abortControllerRef.current = new AbortController();
          isQueryingRef.current = true;

          // 执行传入的请求函数（比如fetchStock），传入signal
          const result = await requestFn({
            signal: abortControllerRef.current.signal,
            ...args,
          });

          isQueryingRef.current = false;
          resolve(result); // 把数据返回给调用方
        } catch (error) {
          isQueryingRef.current = false;
          // 区分“主动中断”和“真错误”
          if (error.name === 'AbortError') {
            reject(new Error('请求已中断'));
          } else {
            reject(error); // 把错误抛给调用方
          }
        }
      }, delay); // 防抖延迟时间
    });
  }, [requestFn, delay]);

  // 取消请求+清空防抖计时
  const cancelRequest = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();
    isQueryingRef.current = false;
  }, []);

  // 返回：防抖请求函数、取消函数、实时加载状态
  return {
    debouncedRequest,
    cancelRequest,
    isLoading: isQueryingRef.current, // 实时反映是否在请求中
  };
};