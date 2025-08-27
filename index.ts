 export const slide = [
    {
    "title": "“Every bite feels like it was made with love. The pistachio tart is my absolute favorite!””",
    "name":"Emily J."
    },
    {
    "title": "“Every bite feels like it was made with love. The pistachio tart is my absolute favorite!””",
        "name":"Emily J."
    },
    {
    "title": "“Every bite feels like it was made with love. The pistachio tart is my absolute favorite!””",
        "name":"Emily J."
    },
    {
    "title": "“Every bite feels like it was made with love. The pistachio tart is my absolute favorite!””",
        "name":"Emily J."
    },
    {
    "title": "“Every bite feels like it was made with love. The pistachio tart is my absolute favorite!””",
        "name":"Emily J."
    },
    {
    "title": "“Every bite feels like it was made with love. The pistachio tart is my absolute favorite!””",
        "name":"Emily J."
    },
  ]

  export interface Product {
  id: number;
  title: string;
  description: string;
  images: string[];
  price: number;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}