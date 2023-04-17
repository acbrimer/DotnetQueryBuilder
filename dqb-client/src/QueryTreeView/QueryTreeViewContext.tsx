import * as React from "react";

export interface IQueryTreeViewContext {
  selectedNodeId: any;
  deselectNode: (id: any) => void;
}
export const QueryTreeViewContext = React.createContext<IQueryTreeViewContext>({
  selectedNodeId: null as any,
  deselectNode: (id: any) => {},
});

export function withTreeViewContext<P>(Component: React.ComponentType<P>) {
  return function TreeViewContextComponent(props: any) {
    return (
      <QueryTreeViewContext.Consumer>
        {(context) => <Component {...props} {...context} />}
      </QueryTreeViewContext.Consumer>
    );
  };
}
