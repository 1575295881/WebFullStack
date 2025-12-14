import { Component } from "react";

class ErrorBoundary extends Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error: error.message };
    }

    componentDidCatch(error, info) {
        console.log('组件错误：', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', textAlign: 'center'}}>
                    <h3>哎呀,出了点小问题</h3>
                    <p>错误原因:{this.state.error}</p>
                    <button onClick={() => {
                        window.location.reload()
                    }}>
                        刷新重试
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;