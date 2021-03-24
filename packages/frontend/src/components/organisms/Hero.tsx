import React from "react";
import { Button } from "../atoms/Button";

export const Hero: React.FC = () => {
  return (
    <section>
      <div className="w-full ">
        <div className="flex flex-col items-center mx-auto">
          <img className="h-80" src="/img/hero.png" />
          <p className="text-secondary text-xs mb-8">Creating NFT Shop for every NFT creator & artist!</p>
          <div className="flex items-center justify-center">
            <a href="https://factory.chocomint.app/mypage">
              <Button>
                Create<span className="ml-2">👷</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
