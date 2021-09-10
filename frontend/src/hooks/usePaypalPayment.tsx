import { useEffect, useState } from "react";
import env from './../config.json';
const usePaypalPayment = (isPaid: boolean | null) => {
  const [isSDKReady, setIsSDKReady] = useState<boolean>(false);

  useEffect(() => {
    if (isPaid || isPaid === null) return;

    if (!("paypal" in window)) {
      const paypalScript: HTMLScriptElement = document.createElement("script");
      fetch(`${window.location.origin}/api/config/paypal`).then(res => res.json()).then(key => {
        paypalScript.src = env.PAYPAL_SCRIPT_SRC + key;
        document.body.append(paypalScript);
        paypalScript.onload = function () {
          setIsSDKReady(true);
        };

      })
    } else {
      setIsSDKReady(true);
    }
  }, [isPaid]);

  return isSDKReady;
};

export default usePaypalPayment;
