import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    // @ts-ignore
    const props = this.props as Props;
    if (this.state.hasError) {
      if (props.fallback) {
        return props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[300px] border border-rose-500/30 bg-rose-500/10 rounded-xl">
          <AlertCircle className="w-10 h-10 text-rose-500 mb-4" />
          <h2 className="text-rose-400 font-bold mb-2 uppercase tracking-wide">Erro de Renderização</h2>
          <p className="text-rose-400/80 text-sm font-mono max-w-md">
            {this.state.error?.message || "Ocorreu um erro inesperado ao renderizar este componente."}
          </p>
          <p className="text-zinc-500 text-xs mt-4 font-mono">
            Isso pode ocorrer se o dispositivo ou navegador não suportar WebGL (necessário para o Grafo).
          </p>
        </div>
      );
    }

    return props.children;
  }
}
