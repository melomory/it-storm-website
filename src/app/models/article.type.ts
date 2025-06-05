export interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  url: string;

  // id: string;
  // name: string;
  // price: number;
  // image: string;
  // lightning: string;
  // humidity: string;
  // temperature: string;
  // height: number;
  // diameter: number;
  // url: string;
  // type: {
  //   id: string;
  //   name: string;
  //   url: string;
  // };
  // countInCart?: number;
  // isInFavorite?: boolean;
}

export interface Articles {
  count: number;
  pages: number;
  items: Article[];
}
