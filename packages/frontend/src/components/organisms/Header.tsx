import React from "react";
import { Link } from "react-router-dom";

import { mainIcon, name } from "../../config.json";
import { shortenAddress } from "../../modules/util";

import { Button } from "../atoms/Button";
import { useWallet } from "../utils/hooks";
import { useLoadingOverlay, useNotificationToast } from "../utils/hooks";

export const Header: React.FC = () => {
  const { connectWallet, userAddress } = useWallet();

  const { openLoadingOverlay, closeLoadingOverlay } = useLoadingOverlay();
  const { openNotificationToast } = useNotificationToast();

  const signIn = async () => {
    try {
      openLoadingOverlay();
      await connectWallet();
      closeLoadingOverlay();
    } catch (err) {
      console.log(err);
      closeLoadingOverlay();
      openNotificationToast({ type: "error", text: err.message });
    }
  };

  return (
    <header>
      <div className="relative h-20">
        <div className="px-4 py-8 absolute left-0 font-bold">
          <Link to="/">
            <span>
              {name}
              <span className="ml-1">{mainIcon}</span>
            </span>
          </Link>
        </div>
        <div className="px-4 py-6 absolute right-0">
          {!userAddress ? <Button onClick={signIn}>Connect</Button> : <Button>{shortenAddress(userAddress)}</Button>}
        </div>
      </div>
    </header>
  );
};
