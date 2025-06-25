import { lazy } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import delay from "./delay";

NProgress.configure({ showSpinner: false, minimum: 0.3, trickleSpeed: 200 });

const lazyWrapper = (importFunc) => {
  const LazyComponent = lazy(async () => {
    NProgress.start();
    // await delay(2000);
    try {
      return await importFunc();
    } finally {
      NProgress.done();
    }
  });

  return (props) => <LazyComponent {...props} />;
};

export default lazyWrapper;
