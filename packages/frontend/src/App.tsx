import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { AtomsRootLoader } from "./components/utils/hooks";

import Shop from "./pages/_chainId/_contractAddress";
import NFT from "./pages/_chainId/_contractAddress/_tokenId";
import Mypage from "./pages/_chainId/_contractAddress/mypage";
import Home from "./pages/index";

const App: React.FC = () => {
  return (
    <div className="font-body">
      <RecoilRoot>
        <AtomsRootLoader>
          <Router>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/:chainId/:nftContractAddress" exact>
                <Shop />
              </Route>
              <Route path="/:chainId/:nftContractAddress/mypage" exact>
                <Mypage />
              </Route>
              <Route path="/:chainId/:nftContractAddress/:tokenId" exact>
                <NFT />
              </Route>
            </Switch>
          </Router>
        </AtomsRootLoader>
      </RecoilRoot>
    </div>
  );
};

export default App;
