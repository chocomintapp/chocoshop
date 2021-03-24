import React from "react";
import { Link } from "react-router-dom";

import { shortenText } from "../../modules/util";
import { Metadata } from "../../types";

import "./NFTsGridListViewer.scss";

export interface NFTsGridListViewerProps {
  metadataList: Metadata[];
}

export const NFTsGridListViewer: React.FC<NFTsGridListViewerProps> = ({ metadataList }) => {
  return (
    <section>
      <ul className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {metadataList.map((metadata, i) => {
          return (
            <Link key={i} to={`/${metadata.chainId}/${metadata.nftContractAddress}/${metadata.tokenId}`}>
              <li className="gridlist-container rounded-md border overflow-hidden relative shadow-sm">
                <div className="gridlist-dummy"></div>
                <div className="gridlist-element">
                  <img className="absolute h-full w-full object-cover" src={metadata.image} />
                  <div className="absolute right-0 p-1 px-2 m-1 text-xs bg-gray-900 rounded-full text-white opacity-75">
                    #{metadata.tokenId}
                  </div>
                  {metadata.name && metadata.description && (
                    <div className="absolute z-50 p-2 bg-gray-900 w-full bottom-0 opacity-75">
                      <p className="text-white text-sm font-bold mb-1">{shortenText(metadata.name, 10)}</p>
                      <p className="text-white text-xs">{shortenText(metadata.description, 40)}</p>
                    </div>
                  )}
                </div>
              </li>
            </Link>
          );
        })}
      </ul>
    </section>
  );
};
