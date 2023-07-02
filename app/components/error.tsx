import React from "react";
import { IconButton } from "./button";
import GithubIcon from "../icons/github.svg";
import ResetIcon from "../icons/reload.svg";
import { ISSUE_URL } from "../constant";
import Locale from "../locales";
import { downloadAs } from "../utils";
import { showConfirm } from "./ui-lib";

interface IErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  info: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<any, IErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Update state with error details
    this.setState({ hasError: true, error, info });
  }

  clearAndSaveData() {
    try {
      downloadAs(
        JSON.stringify(localStorage),
        "chatgpt-next-web-snapshot.json",
      );
    } finally {
      localStorage.clear();
      location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      // Render error message
      return (
        <div className="error">
          <h2>噢, 出问题了，老铁!</h2>
          <pre>
            <code>{this.state.error?.toString()}</code>
            <code>{this.state.info?.componentStack}</code>
          </pre>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <a href={ISSUE_URL} className="report">
              <IconButton
                text="向老龚反馈下"
                icon={<GithubIcon />}
                bordered
              />
            </a>
            <IconButton
              icon={<ResetIcon />}
              text="清理所有数据"
              onClick={async () => {
                if (await showConfirm(Locale.Settings.Danger.Reset.Confirm)) {
                  this.clearAndSaveData();
                }
              }}
              bordered
            />
          </div>
        </div>
      );
    }
    // if no error occurred, render children
    return this.props.children;
  }
}
