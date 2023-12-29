export interface TradeData {
  "CARD": {
    "CARDID": number,
    "CATEGORY": string,
    "MARKET_VALUE": number,
    "SEASON": number,
    "TRADES": {
      "TRADE": Array<Trade>
    }
  }
}

export interface Trade {
  "BUYER": string,
    "PRICE": string,
    "SELLER": string,
    "TIMESTAMP": number
}