import { Base } from "@timberio/core";
import * as React from "react";

// `<TimberProvider>` props
interface ITimberProviderProps {
  logger: Base;
  message?: string;
}

export class TimberProvider extends React.Component<ITimberProviderProps> {
  public componentDidCatch(error: any, info: any) {
    console.log("error", error);
    console.log("info", info);
    void this.props.logger.error(
      this.props.message || "Error in React rendering"
    );
  }

  public render() {
    return this.props.children;
  }
}
